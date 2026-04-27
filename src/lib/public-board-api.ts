import "server-only";

import { getOrSetPublicRequestCache } from "@/lib/public-request-cache";
import { type ServerFetchInit, serverFetchJsonOrNull } from "@/lib/server-fetch";
import type { TiptapDocument } from "@/lib/admin-board-editor-content";

export interface PublicBoardPostAsset {
  id: string;
  kind: "INLINE_IMAGE" | "FILE_ATTACHMENT" | string;
  originalFilename: string;
  storedPath: string;
  mimeType: string;
  byteSize: number;
  width: number | null;
  height: number | null;
  sortOrder: number;
  publicUrl?: string | null;
}

export interface PublicBoardPostSummary {
  id: string;
  boardId: string;
  menuId: string;
  title: string;
  isPublic: boolean;
  isPinned: boolean;
  authorId: string;
  authorName: string;
  viewCount: number;
  contentHtml: string;
  hasInlineImage: boolean;
  hasVideoEmbed: boolean;
  hasAttachments: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicBoardPostDetail extends PublicBoardPostSummary {
  contentJson: TiptapDocument | Record<string, unknown>;
  contentHtml: string;
  assets: PublicBoardPostAsset[];
}

export interface PublicBoardPostListResponse {
  items: PublicBoardPostSummary[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext?: boolean;
  searchTitle: string;
}

interface BackendBoardPostAsset {
  id: string | number;
  kind: string;
  originalFilename: string;
  storedPath: string;
  mimeType: string;
  byteSize: number;
  width?: number | null;
  height?: number | null;
  sortOrder?: number | null;
  publicUrl?: string | null;
}

interface BackendBoardPostSummary {
  id: string | number;
  boardId: string | number;
  menuId?: string | number | null;
  title: string;
  isPublic?: boolean;
  isPinned?: boolean | null;
  authorId?: string | number | null;
  authorName?: string | null;
  viewCount?: number | null;
  contentHtml?: string | null;
  hasInlineImage?: boolean | null;
  hasVideoEmbed?: boolean | null;
  hasAttachments?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendBoardPostDetail extends BackendBoardPostSummary {
  contentJson: string | TiptapDocument | Record<string, unknown>;
  contentHtml?: string | null;
  assets?: BackendBoardPostAsset[];
}

interface BackendBoardPostListResponse {
  posts?: BackendBoardPostSummary[];
  page?: number;
  size?: number;
  totalElements?: number;
  hasNext?: boolean;
}

const PUBLIC_BOARD_REVALIDATE_OPTIONS: NonNullable<ServerFetchInit["next"]> = {
  revalidate: 300,
  tags: ["public-board"],
};

function toFrontendId(value: string | number): string {
  return String(value);
}

function normalizeContentJson(value: BackendBoardPostDetail["contentJson"]): TiptapDocument | Record<string, unknown> {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value) as TiptapDocument | Record<string, unknown>;
  } catch {
    return { type: "doc", content: [] };
  }
}

function normalizeAsset(asset: BackendBoardPostAsset): PublicBoardPostAsset {
  return {
    id: toFrontendId(asset.id),
    kind: asset.kind,
    originalFilename: asset.originalFilename,
    storedPath: asset.storedPath,
    mimeType: asset.mimeType,
    byteSize: asset.byteSize,
    width: asset.width ?? null,
    height: asset.height ?? null,
    sortOrder: asset.sortOrder ?? 0,
    publicUrl: asset.publicUrl ?? null,
  };
}

function normalizeSummary(post: BackendBoardPostSummary): PublicBoardPostSummary {
  return {
    id: toFrontendId(post.id),
    boardId: toFrontendId(post.boardId),
    menuId: toFrontendId(post.menuId ?? post.boardId),
    title: post.title,
    isPublic: post.isPublic ?? true,
    isPinned: post.isPinned ?? false,
    authorId: post.authorId == null ? "" : toFrontendId(post.authorId),
    authorName: post.authorName ?? "",
    viewCount: post.viewCount ?? 0,
    contentHtml: post.contentHtml ?? "",
    hasInlineImage: post.hasInlineImage ?? false,
    hasVideoEmbed: post.hasVideoEmbed ?? false,
    hasAttachments: post.hasAttachments ?? false,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function normalizeDetail(post: BackendBoardPostDetail): PublicBoardPostDetail {
  return {
    ...normalizeSummary(post),
    contentJson: normalizeContentJson(post.contentJson),
    contentHtml: post.contentHtml ?? "",
    assets: (post.assets ?? []).map(normalizeAsset),
  };
}

function mapPayloadOrNull<TInput, TOutput>(payload: TInput | null, mapper: (value: TInput) => TOutput): TOutput | null {
  return payload ? mapper(payload) : null;
}

function normalizeListResponse(
  payload: BackendBoardPostListResponse,
  requestedPage: number,
  requestedSize: number,
  requestedTitle: string,
): PublicBoardPostListResponse {
  const page = typeof payload.page === "number" ? payload.page : requestedPage;
  const size = typeof payload.size === "number" ? payload.size : requestedSize;
  const totalItems = typeof payload.totalElements === "number" ? payload.totalElements : 0;
  const totalPages = size > 0 ? Math.max(1, Math.ceil(totalItems / size)) : 0;

  return {
    items: (payload.posts ?? []).map(normalizeSummary),
    currentPage: page + 1,
    pageSize: size,
    totalItems,
    totalPages,
    hasNext: payload.hasNext,
    searchTitle: requestedTitle,
  };
}

async function fetchPublicBoardPosts(
  slug: string,
  menuId: number,
  page: number,
  size: number,
  title: string,
): Promise<PublicBoardPostListResponse | null> {
  const params = new URLSearchParams({
    menuId: String(menuId),
    page: String(page),
    size: String(size),
  });

  if (title) {
    params.set("title", title);
  }

  const payload = await serverFetchJsonOrNull<BackendBoardPostListResponse>(
    `/api/v1/public/boards/${encodeURIComponent(slug)}/posts?${params.toString()}`,
    {
      next: PUBLIC_BOARD_REVALIDATE_OPTIONS,
    },
  );

  return mapPayloadOrNull(payload, (value) => normalizeListResponse(value, page, size, title));
}

async function fetchPublicBoardPost(
  slug: string,
  menuId: number,
  postId: string,
): Promise<PublicBoardPostDetail | null> {
  const payload = await serverFetchJsonOrNull<BackendBoardPostDetail>(
    `/api/v1/public/boards/${encodeURIComponent(slug)}/posts/${encodeURIComponent(postId)}?menuId=${menuId}`,
    {
      next: PUBLIC_BOARD_REVALIDATE_OPTIONS,
    },
  );

  return mapPayloadOrNull(payload, normalizeDetail);
}

export async function listPublicBoardPosts(
  slug: string,
  menuId: number,
  options: { page: number; size: number; title?: string },
): Promise<PublicBoardPostListResponse | null> {
  const normalizedTitle = options.title?.trim() ?? "";
  return getOrSetPublicRequestCache(
    `public-board-posts:${slug}:${menuId}:${options.page}:${options.size}:${normalizedTitle}`,
    () => fetchPublicBoardPosts(slug, menuId, options.page, options.size, normalizedTitle),
  );
}

export async function getPublicBoardPost(
  slug: string,
  menuId: number,
  postId: string,
): Promise<PublicBoardPostDetail | null> {
  return getOrSetPublicRequestCache(`public-board-post:${slug}:${menuId}:${postId}`, () =>
    fetchPublicBoardPost(slug, menuId, postId),
  );
}
