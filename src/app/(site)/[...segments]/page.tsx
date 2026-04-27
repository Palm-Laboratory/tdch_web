import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import MenuStaticPageRenderer from "@/components/menu-static-page-renderer";
import PublicBoardRenderer from "@/components/public-board/public-board-renderer";
import PublicVideoPlaylistDetailView from "@/components/public-video-playlist-detail-view";
import PublicVideoPlaylistView from "@/components/public-video-playlist-view";
import SitePageShell from "@/components/site-page-shell";
import { PUBLIC_ROUTE_REVALIDATE_SECONDS } from "@/lib/public-cache-policy";
import {
  getPublicBoardPost,
  listPublicBoardPosts,
  type PublicBoardPostDetail,
  type PublicBoardPostListResponse,
} from "@/lib/public-board-api";
import { resolvePublicMenuPath, type PublicResolvedMenuPage } from "@/lib/public-menu-api";
import { createPageMetadata, createVideoMetadata } from "@/lib/seo";
import {
  getPublicPlaylistDetailByPath,
  getPublicPlaylistVideoDetailByPath,
  getPublicPlaylistVideoListByPath,
  type PublicVideoDetail,
} from "@/lib/videos-api";

interface DynamicRoutePageProps {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{ page?: string | string[]; size?: string | string[]; title?: string | string[] }>;
}

export const revalidate = PUBLIC_ROUTE_REVALIDATE_SECONDS;

const DEFAULT_BOARD_PAGE_SIZE = 20;
const BOARD_PAGE_SIZE_OPTIONS = new Set([10, 20, 50]);
const LONGFORM_PAGE_SIZE = 6;
const SHORTFORM_PAGE_SIZE = 8;

function toResolvedPath(segments: string[]): string {
  const normalizedSegments = segments.filter((segment) => segment.length > 0);
  return normalizedSegments.length > 0 ? `/${normalizedSegments.join("/")}` : "/";
}

function getParentPath(path: string): string | null {
  const normalizedPath = path.replace(/\/+$/, "");
  if (!normalizedPath || normalizedPath === "/") {
    return null;
  }

  const parts = normalizedPath.split("/").filter(Boolean);
  if (parts.length <= 1) {
    return "/";
  }

  return `/${parts.slice(0, -1).join("/")}`;
}

function getNormalizedPage(page: string | string[] | undefined): number {
  const pageValue = Array.isArray(page) ? page[0] : page;
  const pageNumber = Number.parseInt(pageValue ?? "1", 10);
  return Number.isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;
}

function getNormalizedBoardPageSize(size: string | string[] | undefined): number {
  const sizeValue = Array.isArray(size) ? size[0] : size;
  const pageSize = Number.parseInt(sizeValue ?? String(DEFAULT_BOARD_PAGE_SIZE), 10);
  return BOARD_PAGE_SIZE_OPTIONS.has(pageSize) ? pageSize : DEFAULT_BOARD_PAGE_SIZE;
}

function getNormalizedBoardTitle(title: string | string[] | undefined): string {
  const titleValue = Array.isArray(title) ? title[0] : title;
  return titleValue?.trim() ?? "";
}

function getBoardListTargetPath(boardPath: string, page: number, title = "") {
  return getBoardListPath(boardPath, page, DEFAULT_BOARD_PAGE_SIZE, title);
}

function getBoardListPath(boardPath: string, page: number, pageSize: number, title = "") {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (pageSize !== DEFAULT_BOARD_PAGE_SIZE) {
    params.set("size", String(pageSize));
  }

  if (title.trim()) {
    params.set("title", title.trim());
  }

  const query = params.toString();
  return query ? `${boardPath}?${query}` : boardPath;
}

function getBoardDetailPath(boardPath: string, postId: string) {
  return `${boardPath.replace(/\/+$/, "")}/${postId}`;
}

type BoardRouteState =
  | { kind: "none" }
  | { kind: "missing" }
  | { kind: "list"; resolved: PublicResolvedMenuPage }
  | {
      kind: "detail";
      resolved: PublicResolvedMenuPage;
      post: PublicBoardPostDetail;
      canonicalPath: string;
    };

type VideoRouteState =
  | { kind: "none" }
  | { kind: "missing" }
  | { kind: "list"; resolved: PublicResolvedMenuPage }
  | { kind: "detail"; resolved: PublicResolvedMenuPage; video: PublicVideoDetail };

type PublicRouteState =
  | { kind: "not-found" }
  | { kind: "redirect"; target: string }
  | { kind: "static"; resolved: PublicResolvedMenuPage }
  | { kind: "video-list"; resolved: PublicResolvedMenuPage }
  | { kind: "video-detail"; resolved: PublicResolvedMenuPage; video: PublicVideoDetail }
  | { kind: "board-list"; resolved: PublicResolvedMenuPage }
  | {
      kind: "board-detail";
      resolved: PublicResolvedMenuPage;
      post: PublicBoardPostDetail;
      canonicalPath: string;
    };

async function loadPublicBoardList(resolved: PublicResolvedMenuPage, page: number, pageSize: number, title: string) {
  if (!resolved.boardKey) {
    notFound();
  }

  const list = await listPublicBoardPosts(resolved.boardKey, resolved.menuId, {
    page: page - 1,
    size: pageSize,
    title,
  });

  if (!list) {
    notFound();
  }

  return list;
}

function renderPublicBoardList(
  boardLabel: string,
  boardPath: string,
  list: PublicBoardPostListResponse,
) {
  return (
    <PublicBoardPageShell boardLabel={boardLabel}>
      <PublicBoardRenderer
        mode="list"
        boardLabel={boardLabel}
        boardPath={boardPath}
        posts={list.items}
        currentPage={list.currentPage}
        pageSize={list.pageSize}
        totalItems={list.totalItems}
        totalPages={list.totalPages}
        searchTitle={list.searchTitle}
      />
    </PublicBoardPageShell>
  );
}

function renderPublicBoardDetail(
  boardLabel: string,
  boardPath: string,
  post: PublicBoardPostDetail,
) {
  return (
    <PublicBoardPageShell boardLabel={boardLabel}>
      <PublicBoardRenderer mode="detail" boardLabel={boardLabel} boardPath={boardPath} post={post} />
    </PublicBoardPageShell>
  );
}

function PublicBoardPageShell({
  boardLabel,
  children,
}: {
  boardLabel: string;
  children: React.ReactNode;
}) {
  return (
    <SitePageShell title={boardLabel} subtitle="BOARD">
      {children}
    </SitePageShell>
  );
}

async function resolvePublicBoardState(
  path: string,
  resolved: PublicResolvedMenuPage | null,
): Promise<BoardRouteState> {
  if (resolved?.type === "BOARD") {
    if (!resolved.boardKey) {
      return { kind: "missing" as const, resolved };
    }

    if (resolved.fullPath === path) {
      return { kind: "list" as const, resolved };
    }
  }

  const parentPath = getParentPath(path);
  if (!parentPath) {
    return { kind: "none" as const };
  }

  const parentResolved = resolved?.type === "BOARD" ? resolved : await resolvePublicMenuPath(parentPath);

  if (!parentResolved || parentResolved.type !== "BOARD" || !parentResolved.boardKey) {
    return { kind: "none" as const };
  }

  if (parentResolved.fullPath === path) {
    return { kind: "list" as const, resolved: parentResolved };
  }

  const postId = path.slice(parentResolved.fullPath.replace(/\/+$/, "").length + 1);
  if (!postId) {
    return { kind: "none" as const };
  }

  const post = await getPublicBoardPost(parentResolved.boardKey, parentResolved.menuId, postId);
  if (!post) {
    return { kind: "missing" as const, resolved: parentResolved };
  }

  return {
    kind: "detail" as const,
    resolved: parentResolved,
    post,
    canonicalPath: getBoardDetailPath(parentResolved.fullPath, post.id),
  };
}

async function resolvePublicVideoState(
  path: string,
  resolved: PublicResolvedMenuPage | null,
): Promise<VideoRouteState> {
  if (resolved?.type === "YOUTUBE_PLAYLIST" && resolved.fullPath === path) {
    return { kind: "list" as const, resolved };
  }

  const parentPath = getParentPath(path);
  if (!parentPath) {
    return { kind: "none" as const };
  }

  const parentResolved =
    resolved?.type === "YOUTUBE_PLAYLIST" ? resolved : await resolvePublicMenuPath(parentPath);

  if (!parentResolved || parentResolved.type !== "YOUTUBE_PLAYLIST") {
    return { kind: "none" as const };
  }

  const videoId = path.slice(parentResolved.fullPath.replace(/\/+$/, "").length + 1);
  if (!videoId) {
    return { kind: "none" as const };
  }

  const video = await getPublicPlaylistVideoDetailByPath(parentResolved.fullPath, videoId);
  if (!video) {
    return { kind: "missing" as const, resolved: parentResolved };
  }

  return { kind: "detail" as const, resolved: parentResolved, video };
}

async function resolvePublicRouteState(path: string): Promise<PublicRouteState> {
  const resolved = await resolvePublicMenuPath(path);

  if (resolved?.redirectTo && resolved.redirectTo !== path) {
    return { kind: "redirect", target: resolved.redirectTo };
  }

  if (resolved?.type === "STATIC") {
    if (!resolved.staticPageKey) {
      return { kind: "not-found" };
    }

    if (resolved.fullPath !== path) {
      return { kind: "redirect", target: resolved.fullPath };
    }

    return { kind: "static", resolved };
  }

  if (resolved?.type === "YOUTUBE_PLAYLIST") {
    return { kind: "video-list", resolved };
  }

  if (resolved?.type === "BOARD" && resolved.fullPath === path) {
    if (!resolved.boardKey) {
      return { kind: "not-found" };
    }

    return { kind: "board-list", resolved };
  }

  const videoState = await resolvePublicVideoState(path, resolved);

  if (videoState.kind === "detail") {
    return { kind: "video-detail", resolved: videoState.resolved, video: videoState.video };
  }

  if (videoState.kind === "missing") {
    return { kind: "not-found" };
  }

  const boardState = await resolvePublicBoardState(path, resolved);

  if (boardState.kind === "detail") {
    return {
      kind: "board-detail",
      resolved: boardState.resolved,
      post: boardState.post,
      canonicalPath: boardState.canonicalPath,
    };
  }

  if (boardState.kind === "list") {
    return { kind: "board-list", resolved: boardState.resolved };
  }

  if (boardState.kind === "missing") {
    return { kind: "not-found" };
  }

  if (resolved && resolved.fullPath !== path) {
    return { kind: "redirect", target: resolved.fullPath };
  }

  return { kind: "not-found" };
}

async function renderPublicVideoList(
  resolved: PublicResolvedMenuPage,
  path: string,
  page: number,
) {
  const playlist = await getPublicPlaylistDetailByPath(resolved.fullPath);
  if (!playlist) {
    notFound();
  }

  const requestedPageSize = playlist.contentForm === "SHORTFORM" ? SHORTFORM_PAGE_SIZE : LONGFORM_PAGE_SIZE;
  const initialVideos = await getPublicPlaylistVideoListByPath(playlist.fullPath, page, requestedPageSize);

  if (!initialVideos) {
    notFound();
  }

  const videos =
    initialVideos.form === "SHORTFORM" && requestedPageSize !== SHORTFORM_PAGE_SIZE
      ? await getPublicPlaylistVideoListByPath(playlist.fullPath, page, SHORTFORM_PAGE_SIZE)
      : initialVideos;

  if (!videos) {
    notFound();
  }

  if (playlist.fullPath !== path) {
    redirect(playlist.fullPath);
  }

  if (videos.form === "SHORTFORM") {
    if (page !== 1) {
      redirect(playlist.fullPath);
    }

    return <PublicVideoPlaylistView playlist={playlist} videos={videos} />;
  }

  if (videos.currentPage !== page) {
    const target = videos.currentPage > 1 ? `${playlist.fullPath}?page=${videos.currentPage}` : playlist.fullPath;
    redirect(target);
  }

  return <PublicVideoPlaylistView playlist={playlist} videos={videos} />;
}

async function renderPublicVideoDetail(
  resolved: PublicResolvedMenuPage,
  video: PublicVideoDetail,
  path: string,
) {
  const playlist = await getPublicPlaylistDetailByPath(resolved.fullPath);
  if (!playlist) {
    notFound();
  }

  const canonicalDetailPath = `${playlist.fullPath}/${video.videoId}`;
  if (canonicalDetailPath !== path) {
    redirect(canonicalDetailPath);
  }

  return <PublicVideoPlaylistDetailView playlist={playlist} video={video} />;
}

function createNotFoundMetadata(): Metadata {
  return {
    title: "페이지를 찾을 수 없습니다",
    description: "요청하신 페이지를 찾을 수 없습니다.",
  };
}

function createStaticPageMetadata(resolved: PublicResolvedMenuPage): Metadata {
  return createPageMetadata({
    title: resolved.label,
    description: `${resolved.label} | The 제자교회`,
    path: resolved.fullPath,
  });
}

function createBoardListMetadata(
  resolved: PublicResolvedMenuPage,
  page: number,
  pageSize: number,
  title: string,
): Metadata {
  return createPageMetadata({
    title: page > 1 ? `${resolved.label} - ${page}페이지` : resolved.label,
    description: `${resolved.label} | The 제자교회`,
    path: getBoardListPath(resolved.fullPath, page, pageSize, title),
  });
}

function createBoardDetailMetadata(
  resolved: PublicResolvedMenuPage,
  post: PublicBoardPostDetail,
  canonicalPath: string,
): Metadata {
  return createPageMetadata({
    title: post.title,
    description: `${post.title} | ${resolved.label}`,
    path: canonicalPath,
  });
}

function createVideoDetailPageMetadata(
  resolved: PublicResolvedMenuPage,
  video: PublicVideoDetail,
): Metadata {
  return createVideoMetadata({
    title: video.title,
    description: video.summary || video.description || `${resolved.label} 영상입니다.`,
    path: `${resolved.fullPath}/${video.videoId}`,
    publishedTime: video.publishedAt ?? undefined,
  });
}

async function loadBoardListForRender(
  resolved: PublicResolvedMenuPage,
  normalizedPage: number,
  normalizedBoardPageSize: number,
  normalizedBoardTitle: string,
) {
  const list = await loadPublicBoardList(
    resolved,
    normalizedPage,
    normalizedBoardPageSize,
    normalizedBoardTitle,
  );

  if (list.totalItems > 0 && normalizedPage > list.totalPages) {
    redirect(
      getBoardListPath(
        resolved.fullPath,
        list.totalPages,
        normalizedBoardPageSize,
        normalizedBoardTitle,
      ),
    );
  }

  if (list.currentPage !== normalizedPage) {
    redirect(
      getBoardListPath(
        resolved.fullPath,
        list.currentPage,
        normalizedBoardPageSize,
        normalizedBoardTitle,
      ),
    );
  }

  return renderPublicBoardList(resolved.label, resolved.fullPath, list);
}

export async function generateMetadata({
  params,
  searchParams,
}: DynamicRoutePageProps): Promise<Metadata> {
  const { segments } = await params;
  const { page, size, title } = await searchParams;
  const path = toResolvedPath(segments);
  const routeState = await resolvePublicRouteState(path);
  const normalizedPage = getNormalizedPage(page);
  const normalizedBoardPageSize = getNormalizedBoardPageSize(size);
  const normalizedBoardTitle = getNormalizedBoardTitle(title);

  if (routeState.kind === "video-detail") {
    return createVideoDetailPageMetadata(routeState.resolved, routeState.video);
  }

  if (routeState.kind === "board-detail") {
    return createBoardDetailMetadata(routeState.resolved, routeState.post, routeState.canonicalPath);
  }

  if (routeState.kind === "board-list") {
    return createBoardListMetadata(
      routeState.resolved,
      normalizedPage,
      normalizedBoardPageSize,
      normalizedBoardTitle,
    );
  }

  if (routeState.kind === "video-list") {
    const playlist = await getPublicPlaylistDetailByPath(routeState.resolved.fullPath);
    return createPageMetadata({
      title: playlist?.title ?? routeState.resolved.label,
      description: playlist?.description || `${routeState.resolved.label} 재생목록입니다.`,
      path:
        playlist?.contentForm === "SHORTFORM" || normalizedPage <= 1
          ? routeState.resolved.fullPath
          : `${routeState.resolved.fullPath}?page=${normalizedPage}`,
    });
  }

  if (routeState.kind === "static") {
    return createStaticPageMetadata(routeState.resolved);
  }

  return createNotFoundMetadata();
}

export default async function DynamicRoutePage({
  params,
  searchParams,
}: DynamicRoutePageProps) {
  const { segments } = await params;
  const { page, size, title } = await searchParams;
  const path = toResolvedPath(segments);
  const routeState = await resolvePublicRouteState(path);
  const normalizedPage = getNormalizedPage(page);
  const normalizedBoardPageSize = getNormalizedBoardPageSize(size);
  const normalizedBoardTitle = getNormalizedBoardTitle(title);

  if (routeState.kind === "redirect") {
    redirect(routeState.target);
  }

  if (routeState.kind === "not-found") {
    notFound();
  }

  if (routeState.kind === "static") {
    return <MenuStaticPageRenderer staticPageKey={routeState.resolved.staticPageKey!} />;
  }

  if (routeState.kind === "video-list") {
    return renderPublicVideoList(routeState.resolved, path, normalizedPage);
  }

  if (routeState.kind === "video-detail") {
    return renderPublicVideoDetail(routeState.resolved, routeState.video, path);
  }

  if (routeState.kind === "board-list") {
    return loadBoardListForRender(
      routeState.resolved,
      normalizedPage,
      normalizedBoardPageSize,
      normalizedBoardTitle,
    );
  }

  if (routeState.kind === "board-detail") {
    if (routeState.canonicalPath !== path) {
      redirect(routeState.canonicalPath);
    }

    return renderPublicBoardDetail(routeState.resolved.label, routeState.resolved.fullPath, routeState.post);
  }

  notFound();
}
