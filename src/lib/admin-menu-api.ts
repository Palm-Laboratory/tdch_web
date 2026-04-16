import "server-only";

import { adminApiFetch, AdminApiError } from "@/lib/admin-api";

export type MenuType =
  | "STATIC"
  | "BOARD"
  | "FOLDER"
  | "YOUTUBE_PLAYLIST_GROUP"
  | "YOUTUBE_PLAYLIST"
  | "EXTERNAL_LINK";

export type MenuStatus = "DRAFT" | "PUBLISHED" | "HIDDEN" | "ARCHIVED";
export type YouTubeSyncStatus = "ACTIVE" | "REMOVED";

export interface AdminMenuTreeNode {
  id: number;
  type: MenuType;
  status: MenuStatus;
  label: string;
  slug: string;
  isAuto: boolean;
  labelCustomized: boolean;
  staticPageKey: string | null;
  boardKey: string | null;
  externalUrl: string | null;
  openInNewTab: boolean;
  playlistTitle: string | null;
  playlistSourceTitle: string | null;
  thumbnailUrl: string | null;
  itemCount: number | null;
  syncStatus: YouTubeSyncStatus | null;
  parentId: number | null;
  children: AdminMenuTreeNode[];
}

export interface AdminMenuTreeResponse {
  items: AdminMenuTreeNode[];
}

export interface AdminYouTubePlaylist {
  menuId: number;
  playlistId: string;
  menuLabel: string;
  sourceTitle: string;
  slug: string;
  status: MenuStatus;
  syncStatus: YouTubeSyncStatus;
  parentId: number | null;
  parentLabel: string | null;
  thumbnailUrl: string | null;
  itemCount: number;
}

export interface AdminYouTubePlaylistsResponse {
  playlists: AdminYouTubePlaylist[];
}

export interface MenuTreeNodePayload {
  id: number | null;
  type: MenuType;
  status: MenuStatus;
  label: string;
  slug: string;
  staticPageKey?: string | null;
  boardKey?: string | null;
  externalUrl?: string | null;
  openInNewTab?: boolean;
  isAuto?: boolean;
  children: MenuTreeNodePayload[];
}

export interface YouTubeSyncResponse {
  status: string;
  totalPlaylists: number;
  createdMenus: number;
  updatedMenus: number;
  archivedMenus: number;
  restoredMenus: number;
  completedAt: string;
}

export async function getAdminMenuTree(actorId: string): Promise<AdminMenuTreeResponse> {
  const response = await adminApiFetch("/api/v1/admin/menu", {
    headers: { "X-Admin-Actor-Id": actorId },
  });
  return response.json() as Promise<AdminMenuTreeResponse>;
}

export async function getAdminYouTubePlaylists(actorId: string): Promise<AdminYouTubePlaylistsResponse> {
  const response = await adminApiFetch("/api/v1/admin/youtube/playlists", {
    headers: { "X-Admin-Actor-Id": actorId },
  });
  return response.json() as Promise<AdminYouTubePlaylistsResponse>;
}

export async function replaceAdminMenuTree(
  actorId: string,
  items: MenuTreeNodePayload[],
): Promise<AdminMenuTreeResponse> {
  const response = await adminApiFetch("/api/v1/admin/menu/tree", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Actor-Id": actorId,
    },
    body: JSON.stringify({ items }),
  });
  return response.json() as Promise<AdminMenuTreeResponse>;
}

export async function syncAdminYouTube(actorId: string): Promise<YouTubeSyncResponse> {
  const response = await adminApiFetch("/api/v1/admin/youtube/sync", {
    method: "POST",
    headers: {
      "X-Admin-Actor-Id": actorId,
    },
  });
  return response.json() as Promise<YouTubeSyncResponse>;
}

export async function deleteAdminMenuItem(actorId: string, menuId: number): Promise<void> {
  await adminApiFetch(`/api/v1/admin/menu/${menuId}`, {
    method: "DELETE",
    headers: { "X-Admin-Actor-Id": actorId },
  });
}

export function toFriendlyAdminMenuMessage(error: unknown, fallback: string): string {
  if (!(error instanceof AdminApiError)) {
    return fallback;
  }

  if (error.status === 401 || error.status === 403) {
    return "권한이 없거나 로그인 정보가 만료되었습니다. 다시 로그인해 주세요.";
  }

  return error.message || fallback;
}
