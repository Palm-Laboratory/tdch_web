import "server-only";

import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import type { TiptapDocument } from "@/lib/admin-board-editor-content";

export type AdminBoardType = "ANNOUNCEMENT" | "FREE" | "GALLERY" | "FAQ" | string;

export interface AdminBoardSummary {
  id: string;
  slug: string;
  title: string;
  type: AdminBoardType;
  boardTypeId?: string | null;
  description: string | null;
}

export interface AdminBoardTypeSummary {
  id: string;
  key: string;
  label: string;
  description: string | null;
  sortOrder: number;
}

export interface AdminBoardPostSummary {
  id: string;
  boardId: string;
  menuId: string;
  title: string;
  isPublic: boolean;
  isPinned: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBoardPostAsset {
  id: string;
  kind: "INLINE_IMAGE" | "FILE_ATTACHMENT" | string;
  originalFilename: string;
  storedPath: string;
  mimeType: string;
  byteSize: number;
  width: number | null;
  height: number | null;
  sortOrder: number;
}

export interface AdminBoardPostDetail extends AdminBoardPostSummary {
  contentJson: TiptapDocument | Record<string, unknown>;
  contentHtml: string;
  assets: AdminBoardPostAsset[];
}

export interface BoardPostSavePayload {
  menuId?: string | number | null;
  title: string;
  contentJson: TiptapDocument | Record<string, unknown>;
  contentHtml: string;
  isPublic: boolean;
  isPinned: boolean;
  assetIds: Array<string | number>;
}

interface BackendBoardSummary {
  id: string | number;
  slug: string;
  title: string;
  type: AdminBoardType;
  boardTypeId?: string | number | null;
  description?: string | null;
}

interface BackendBoardTypeSummary {
  id: string | number;
  key: string;
  label: string;
  description?: string | null;
  sortOrder?: number | null;
}

interface BackendPostSummary {
  id: string | number;
  boardId: string | number;
  menuId?: string | number | null;
  title: string;
  isPublic: boolean;
  isPinned?: boolean | null;
  authorId: string | number;
  createdAt: string;
  updatedAt: string;
}

interface BackendPostAsset {
  id: string | number;
  kind: string;
  originalFilename: string;
  storedPath: string;
  mimeType: string;
  byteSize: number;
  width?: number | null;
  height?: number | null;
  sortOrder?: number | null;
}

interface BackendPostDetail extends BackendPostSummary {
  contentJson: string | TiptapDocument | Record<string, unknown>;
  contentHtml?: string | null;
  assets?: BackendPostAsset[];
}

interface BackendPostSaveResponse {
  id?: string | number | null;
}

function toFrontendId(value: string | number) {
  return String(value);
}

function toBackendNumber(value: string | number, label: string) {
  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue)) {
    throw new AdminApiError(400, "INVALID_BOARD_PAYLOAD", `${label} 값이 올바르지 않습니다.`);
  }

  return numberValue;
}

function normalizeContentJson(value: BackendPostDetail["contentJson"]) {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value) as TiptapDocument | Record<string, unknown>;
  } catch {
    return { type: "doc", content: [] };
  }
}

function normalizeBoard(board: BackendBoardSummary): AdminBoardSummary {
  return {
    id: toFrontendId(board.id),
    slug: board.slug,
    title: board.title,
    type: board.type,
    boardTypeId: board.boardTypeId == null ? null : toFrontendId(board.boardTypeId),
    description: board.description ?? null,
  };
}

function normalizeBoardType(boardType: BackendBoardTypeSummary): AdminBoardTypeSummary {
  return {
    id: toFrontendId(boardType.id),
    key: boardType.key,
    label: boardType.label,
    description: boardType.description ?? null,
    sortOrder: boardType.sortOrder ?? 0,
  };
}

function normalizePostSummary(post: BackendPostSummary): AdminBoardPostSummary {
  return {
    id: toFrontendId(post.id),
    boardId: toFrontendId(post.boardId),
    menuId: toFrontendId(post.menuId ?? post.boardId),
    title: post.title,
    isPublic: post.isPublic,
    isPinned: post.isPinned ?? false,
    authorId: toFrontendId(post.authorId),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function normalizeAsset(asset: BackendPostAsset): AdminBoardPostAsset {
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
  };
}

function normalizePostDetail(post: BackendPostDetail): AdminBoardPostDetail {
  return {
    ...normalizePostSummary(post),
    contentJson: normalizeContentJson(post.contentJson),
    contentHtml: post.contentHtml ?? "",
    assets: (post.assets ?? []).map(normalizeAsset),
  };
}

function normalizeSavedPostId(payload: BackendPostSaveResponse) {
  if (payload.id === undefined || payload.id === null || String(payload.id).trim() === "") {
    throw new AdminApiError(502, "INVALID_BOARD_SAVE_RESPONSE", "게시글 저장 응답이 올바르지 않습니다.");
  }

  return toFrontendId(payload.id);
}

function buildSavePayload(payload: BoardPostSavePayload) {
  return {
    title: payload.title,
    ...(payload.menuId == null ? {} : { menuId: toBackendNumber(payload.menuId, "메뉴 ID") }),
    contentJson: JSON.stringify(payload.contentJson),
    contentHtml: payload.contentHtml,
    isPublic: payload.isPublic,
    isPinned: payload.isPinned,
    assetIds: payload.assetIds.map((assetId) => toBackendNumber(assetId, "첨부 파일 ID")),
  };
}

function actorHeaders(actorId: string, contentType = false) {
  return {
    ...(contentType ? { "Content-Type": "application/json" } : {}),
    "X-Admin-Actor-Id": actorId,
  };
}

export async function getAdminBoards(actorId: string): Promise<AdminBoardSummary[]> {
  const response = await adminApiFetch("/api/v1/admin/boards", {
    headers: actorHeaders(actorId),
  });
  const payload = (await response.json()) as { boards?: BackendBoardSummary[] };
  return (payload.boards ?? []).map(normalizeBoard);
}

export async function getAdminBoardTypes(actorId: string): Promise<AdminBoardTypeSummary[]> {
  const response = await adminApiFetch("/api/v1/admin/boards/types", {
    headers: actorHeaders(actorId),
  });
  const payload = (await response.json()) as { types?: BackendBoardTypeSummary[] };
  return (payload.types ?? []).map(normalizeBoardType);
}

export async function getAdminBoardPosts(
  actorId: string,
  slug: string,
  menuId?: string | number | null,
): Promise<AdminBoardPostSummary[]> {
  const menuQuery = menuId == null ? "" : `?menuId=${toBackendNumber(menuId, "메뉴 ID")}`;
  const response = await adminApiFetch(`/api/v1/admin/boards/${encodeURIComponent(slug)}/posts${menuQuery}`, {
    headers: actorHeaders(actorId),
  });
  const payload = (await response.json()) as { posts?: BackendPostSummary[] };
  return (payload.posts ?? []).map(normalizePostSummary);
}

export async function getAdminBoardPost(
  actorId: string,
  slug: string,
  postId: string,
  menuId?: string | number | null,
): Promise<AdminBoardPostDetail> {
  const menuQuery = menuId == null ? "" : `?menuId=${toBackendNumber(menuId, "메뉴 ID")}`;
  const response = await adminApiFetch(
    `/api/v1/admin/boards/${encodeURIComponent(slug)}/posts/${toBackendNumber(postId, "게시글 ID")}${menuQuery}`,
    {
      headers: actorHeaders(actorId),
    },
  );
  return normalizePostDetail((await response.json()) as BackendPostDetail);
}

export async function createAdminBoardPost(
  actorId: string,
  slug: string,
  payload: BoardPostSavePayload,
): Promise<AdminBoardPostDetail> {
  const response = await adminApiFetch(`/api/v1/admin/boards/${encodeURIComponent(slug)}/posts`, {
    method: "POST",
    headers: actorHeaders(actorId, true),
    body: JSON.stringify(buildSavePayload(payload)),
  });
  const saved = (await response.json()) as BackendPostSaveResponse;
  return getAdminBoardPost(actorId, slug, normalizeSavedPostId(saved), payload.menuId);
}

export async function updateAdminBoardPost(
  actorId: string,
  slug: string,
  postId: string,
  payload: BoardPostSavePayload,
): Promise<AdminBoardPostDetail> {
  const response = await adminApiFetch(
    `/api/v1/admin/boards/${encodeURIComponent(slug)}/posts/${toBackendNumber(postId, "게시글 ID")}`,
    {
      method: "PUT",
      headers: actorHeaders(actorId, true),
      body: JSON.stringify(buildSavePayload(payload)),
    },
  );
  const saved = (await response.json()) as BackendPostSaveResponse;
  return getAdminBoardPost(actorId, slug, normalizeSavedPostId(saved), payload.menuId);
}

export async function deleteAdminBoardPost(
  actorId: string,
  slug: string,
  postId: string,
  menuId?: string | number | null,
): Promise<void> {
  const menuQuery = menuId == null ? "" : `?menuId=${toBackendNumber(menuId, "메뉴 ID")}`;
  await adminApiFetch(
    `/api/v1/admin/boards/${encodeURIComponent(slug)}/posts/${toBackendNumber(postId, "게시글 ID")}${menuQuery}`,
    {
      method: "DELETE",
      headers: actorHeaders(actorId),
    },
  );
}

export function toFriendlyAdminBoardMessage(error: unknown, fallback: string): string {
  if (!(error instanceof AdminApiError)) {
    return fallback;
  }

  if (error.status === 401 || error.status === 403) {
    return "권한이 없거나 로그인 정보가 만료되었습니다. 다시 로그인해 주세요.";
  }

  if (error.code === "ADMIN_SYNC_KEY_MISSING") {
    return "게시판 관리 기능 설정이 아직 완료되지 않았습니다. 서버 설정을 확인해 주세요.";
  }

  if (error.status >= 500) {
    return "게시판 서버와 통신하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }

  return error.message || fallback;
}
