import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import MenuStaticPageRenderer from "@/components/menu-static-page-renderer";
import PublicBoardRenderer from "@/components/public-board/public-board-renderer";
import {
  getPublicBoardPost,
  listPublicBoardPosts,
  type PublicBoardPostDetail,
  type PublicBoardPostListResponse,
} from "@/lib/public-board-api";
import { resolvePublicMenuPath } from "@/lib/public-menu-api";
import { createPageMetadata } from "@/lib/seo";

interface DynamicRoutePageProps {
  params: Promise<{
    segments: string[];
  }>;
}

export const dynamic = "force-dynamic";

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

async function loadPublicBoardList(boardKey: string) {
  const list = await listPublicBoardPosts(boardKey, { page: 0, size: 20 });

  if (!list) {
    notFound();
  }

  return list;
}

function renderPublicBoardList(
  boardLabel: string,
  boardPath: string,
  posts: PublicBoardPostListResponse["items"],
) {
  return <PublicBoardRenderer mode="list" boardLabel={boardLabel} boardPath={boardPath} posts={posts} />;
}

function renderPublicBoardDetail(
  boardLabel: string,
  boardPath: string,
  post: PublicBoardPostDetail,
) {
  return <PublicBoardRenderer mode="detail" boardLabel={boardLabel} boardPath={boardPath} post={post} />;
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

  const post = await getPublicBoardPost(parentResolved.boardKey, postId);
  if (!post) {
    return { kind: "missing" as const, resolved: parentResolved };
  }

  return { kind: "detail" as const, resolved: parentResolved, post };
}

export async function generateMetadata({
  params,
}: DynamicRoutePageProps): Promise<Metadata> {
  const { segments } = await params;
  const path = toResolvedPath(segments);
  const resolved = await resolvePublicMenuPath(path);

  if (!resolved) {
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
        title: boardState.resolved.label,
        description: `${boardState.resolved.label} | The 제자교회`,
        path: boardState.resolved.fullPath,
      });
    }

    return {
      title: "페이지를 찾을 수 없습니다",
      description: "요청하신 페이지를 찾을 수 없습니다.",
    };
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
        title: resolved.label,
        description: `${resolved.label} | The 제자교회`,
        path,
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
}: DynamicRoutePageProps) {
  const { segments } = await params;
  const path = toResolvedPath(segments);
  const resolved = await resolvePublicMenuPath(path);

  if (!resolved) {
    const boardState = await resolvePublicBoardState(path);

    if (boardState.kind === "detail") {
      return renderPublicBoardDetail(boardState.resolved.label, boardState.resolved.fullPath, boardState.post);
    }

    if (boardState.kind === "list") {
      const boardKey = boardState.resolved.boardKey;
      if (!boardKey) {
        notFound();
      }

      const list = await loadPublicBoardList(boardKey);
      return renderPublicBoardList(boardState.resolved.label, boardState.resolved.fullPath, list.items);
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

  if (resolved.type === "BOARD") {
    if (!resolved.boardKey) {
      notFound();
    }

    if (resolved.fullPath === path) {
      const list = await loadPublicBoardList(resolved.boardKey);
      return renderPublicBoardList(resolved.label, resolved.fullPath, list.items);
    }
  }

  const boardState = await resolvePublicBoardState(path);

  if (boardState.kind === "list") {
    const boardKey = boardState.resolved.boardKey;
    if (!boardKey) {
      notFound();
    }

    const list = await loadPublicBoardList(boardKey);
    return renderPublicBoardList(boardState.resolved.label, boardState.resolved.fullPath, list.items);
  }

  if (boardState.kind === "detail") {
    return renderPublicBoardDetail(boardState.resolved.label, boardState.resolved.fullPath, boardState.post);
  }

  if (boardState.kind === "missing") {
    notFound();
  }

  if (resolved && resolved.fullPath !== path) {
    redirect(resolved.fullPath);
  }

  notFound();
}
