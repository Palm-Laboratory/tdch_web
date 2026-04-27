import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import MenuStaticPageRenderer from "@/components/menu-static-page-renderer";
import PublicBoardRenderer from "@/components/public-board/public-board-renderer";
import PublicVideoPlaylistDetailView from "@/components/public-video-playlist-detail-view";
import PublicVideoPlaylistView from "@/components/public-video-playlist-view";
import SitePageShell from "@/components/site-page-shell";
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

export const dynamic = "force-dynamic";

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

async function resolvePublicBoardState(path: string) {
  const resolved = await resolvePublicMenuPath(path);

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
    return { kind: "none" as const, resolved };
  }

  const parentResolved = resolved?.type === "BOARD" ? resolved : await resolvePublicMenuPath(parentPath);

  if (!parentResolved || parentResolved.type !== "BOARD" || !parentResolved.boardKey) {
    return { kind: "none" as const, resolved: parentResolved ?? resolved };
  }

  if (parentResolved.fullPath === path) {
    return { kind: "list" as const, resolved: parentResolved };
  }

  const postId = path.slice(parentResolved.fullPath.replace(/\/+$/, "").length + 1);
  if (!postId) {
    return { kind: "none" as const, resolved: parentResolved };
  }

  const post = await getPublicBoardPost(parentResolved.boardKey, parentResolved.menuId, postId);
  if (!post) {
    return { kind: "missing" as const, resolved: parentResolved };
  }

  return { kind: "detail" as const, resolved: parentResolved, post };
}

async function resolvePublicVideoState(path: string) {
  const resolved = await resolvePublicMenuPath(path);

  if (resolved?.type === "YOUTUBE_PLAYLIST" && resolved.fullPath === path) {
    return { kind: "list" as const, resolved };
  }

  const parentPath = getParentPath(path);
  if (!parentPath) {
    return { kind: "none" as const, resolved };
  }

  const parentResolved =
    resolved?.type === "YOUTUBE_PLAYLIST" ? resolved : await resolvePublicMenuPath(parentPath);

  if (!parentResolved || parentResolved.type !== "YOUTUBE_PLAYLIST") {
    return { kind: "none" as const, resolved: parentResolved ?? resolved };
  }

  const videoId = path.slice(parentResolved.fullPath.replace(/\/+$/, "").length + 1);
  if (!videoId) {
    return { kind: "none" as const, resolved: parentResolved };
  }

  const video = await getPublicPlaylistVideoDetailByPath(parentResolved.fullPath, videoId);
  if (!video) {
    return { kind: "missing" as const, resolved: parentResolved };
  }

  return { kind: "detail" as const, resolved: parentResolved, video };
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

export async function generateMetadata({
  params,
  searchParams,
}: DynamicRoutePageProps): Promise<Metadata> {
  const { segments } = await params;
  const { page, size, title } = await searchParams;
  const path = toResolvedPath(segments);
  const resolved = await resolvePublicMenuPath(path);
  const normalizedPage = getNormalizedPage(page);
  const normalizedBoardPageSize = getNormalizedBoardPageSize(size);
  const normalizedBoardTitle = getNormalizedBoardTitle(title);

  if (!resolved) {
    const videoState = await resolvePublicVideoState(path);
    if (videoState.kind === "detail") {
      return createVideoMetadata({
        title: videoState.video.title,
        description: videoState.video.summary || videoState.video.description || `${videoState.resolved.label} 영상입니다.`,
        path,
        publishedTime: videoState.video.publishedAt ?? undefined,
      });
    }

    const boardState = await resolvePublicBoardState(path);
    if (boardState.kind === "detail") {
      return createPageMetadata({
        title: boardState.post.title,
        description: `${boardState.post.title} | ${boardState.resolved.label}`,
        path,
      });
    }

    if (boardState.kind === "list") {
      return createPageMetadata({
        title: normalizedPage > 1 ? `${boardState.resolved.label} - ${normalizedPage}페이지` : boardState.resolved.label,
        description: `${boardState.resolved.label} | The 제자교회`,
        path: getBoardListPath(boardState.resolved.fullPath, normalizedPage, normalizedBoardPageSize, normalizedBoardTitle),
      });
    }

    return {
      title: "페이지를 찾을 수 없습니다",
      description: "요청하신 페이지를 찾을 수 없습니다.",
    };
  }

  if (resolved.type === "YOUTUBE_PLAYLIST") {
    const playlist = await getPublicPlaylistDetailByPath(resolved.fullPath);
    return createPageMetadata({
      title: playlist?.title ?? resolved.label,
      description: playlist?.description || `${resolved.label} 재생목록입니다.`,
      path:
        playlist?.contentForm === "SHORTFORM" || normalizedPage <= 1
          ? resolved.fullPath
          : `${resolved.fullPath}?page=${normalizedPage}`,
    });
  }

  if (resolved.type === "BOARD") {
    if (!resolved.boardKey) {
      return {
        title: "페이지를 찾을 수 없습니다",
        description: "요청하신 페이지를 찾을 수 없습니다.",
      };
    }

    if (resolved.fullPath === path) {
      return createPageMetadata({
        title: normalizedPage > 1 ? `${resolved.label} - ${normalizedPage}페이지` : resolved.label,
        description: `${resolved.label} | The 제자교회`,
        path: getBoardListPath(path, normalizedPage, normalizedBoardPageSize, normalizedBoardTitle),
      });
    }
  }

  return createPageMetadata({
    title: resolved.label,
    description: `${resolved.label} | The 제자교회`,
    path,
  });
}

export default async function DynamicRoutePage({
  params,
  searchParams,
}: DynamicRoutePageProps) {
  const { segments } = await params;
  const { page, size, title } = await searchParams;
  const path = toResolvedPath(segments);
  const resolved = await resolvePublicMenuPath(path);
  const normalizedPage = getNormalizedPage(page);
  const normalizedBoardPageSize = getNormalizedBoardPageSize(size);
  const normalizedBoardTitle = getNormalizedBoardTitle(title);

  if (!resolved) {
    const videoState = await resolvePublicVideoState(path);

    if (videoState.kind === "detail") {
      return renderPublicVideoDetail(videoState.resolved, videoState.video, path);
    }

    if (videoState.kind === "missing") {
      notFound();
    }

    const boardState = await resolvePublicBoardState(path);

    if (boardState.kind === "detail") {
      return renderPublicBoardDetail(boardState.resolved.label, boardState.resolved.fullPath, boardState.post);
    }

    if (boardState.kind === "list") {
      const list = await loadPublicBoardList(boardState.resolved, normalizedPage, normalizedBoardPageSize, normalizedBoardTitle);

      if (list.totalItems > 0 && normalizedPage > list.totalPages) {
        redirect(getBoardListPath(boardState.resolved.fullPath, list.totalPages, normalizedBoardPageSize, normalizedBoardTitle));
      }

      if (list.currentPage !== normalizedPage) {
        redirect(getBoardListPath(boardState.resolved.fullPath, list.currentPage, normalizedBoardPageSize, normalizedBoardTitle));
      }

      return renderPublicBoardList(boardState.resolved.label, boardState.resolved.fullPath, list);
    }

    notFound();
  }

  if (resolved.redirectTo && resolved.redirectTo !== path) {
    redirect(resolved.redirectTo);
  }

  if (resolved.type === "STATIC") {
    if (!resolved.staticPageKey) {
      notFound();
    }
    return <MenuStaticPageRenderer staticPageKey={resolved.staticPageKey} />;
  }

  if (resolved.type === "YOUTUBE_PLAYLIST") {
    return renderPublicVideoList(resolved, path, normalizedPage);
  }

  if (resolved.type === "BOARD") {
    if (!resolved.boardKey) {
      notFound();
    }

    if (resolved.fullPath === path) {
      const list = await loadPublicBoardList(resolved, normalizedPage, normalizedBoardPageSize, normalizedBoardTitle);

      if (list.totalItems > 0 && normalizedPage > list.totalPages) {
        redirect(getBoardListPath(resolved.fullPath, list.totalPages, normalizedBoardPageSize, normalizedBoardTitle));
      }

      if (list.currentPage !== normalizedPage) {
        redirect(getBoardListPath(resolved.fullPath, list.currentPage, normalizedBoardPageSize, normalizedBoardTitle));
      }

      return renderPublicBoardList(resolved.label, resolved.fullPath, list);
    }
  }

  const boardState = await resolvePublicBoardState(path);

  if (boardState.kind === "list") {
    const list = await loadPublicBoardList(boardState.resolved, normalizedPage, normalizedBoardPageSize, normalizedBoardTitle);

    if (list.totalItems > 0 && normalizedPage > list.totalPages) {
      redirect(getBoardListPath(boardState.resolved.fullPath, list.totalPages, normalizedBoardPageSize, normalizedBoardTitle));
    }

    if (list.currentPage !== normalizedPage) {
      redirect(getBoardListPath(boardState.resolved.fullPath, list.currentPage, normalizedBoardPageSize, normalizedBoardTitle));
    }

    return renderPublicBoardList(boardState.resolved.label, boardState.resolved.fullPath, list);
  }

  if (boardState.kind === "detail") {
    return renderPublicBoardDetail(boardState.resolved.label, boardState.resolved.fullPath, boardState.post);
  }

  if (boardState.kind === "missing") {
    notFound();
  }

  if (resolved.fullPath !== path) {
    redirect(resolved.fullPath);
  }

  notFound();
}
