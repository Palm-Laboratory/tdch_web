import "server-only";

import { AdminApiError, adminApiFetch } from "@/lib/admin-api";

export type AdminPlaylistStatus = "DRAFT" | "PUBLISHED" | "INACTIVE";
export type AdminContentKind = "LONG_FORM" | "SHORT";

export interface AdminPlaylist {
  id: number;
  menuName: string;
  siteKey: string;
  slug: string;
  contentKind: AdminContentKind;
  status: AdminPlaylistStatus;
  active: boolean;
  navigationVisible: boolean;
  sortOrder: number;
  description: string | null;
  discoveredAt: string | null;
  publishedAt: string | null;
  lastModifiedBy: number | null;
  youtubePlaylistId: string;
  itemCount: number;
  syncEnabled: boolean;
  lastSyncedAt: string | null;
}

export interface AdminPlaylistListResponse {
  data: AdminPlaylist[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface AdminPlaylistDiscoveryItem {
  siteKey: string;
  menuName: string;
  slug: string;
  contentKind: AdminContentKind;
  status: AdminPlaylistStatus;
  navigationVisible: boolean;
  youtubePlaylistId: string;
  youtubeTitle: string;
  channelTitle: string | null;
  itemCount: number;
  syncEnabled: boolean;
}

export interface AdminPlaylistDiscoveryResponse {
  discoveredCount: number;
  skippedCount: number;
  items: AdminPlaylistDiscoveryItem[];
}

export interface AdminSyncJob {
  id: number;
  triggerType: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  totalPlaylists: number;
  succeededPlaylists: number;
  failedPlaylists: number;
  itemCount: number;
  failedItemCount: number;
  errorSummary: string | null;
}

export interface AdminSyncJobListResponse {
  data: AdminSyncJob[];
}

export async function getAdminPlaylists(
  actorId: string,
  params?: {
    kind?: string;
    search?: string;
    page?: number;
    size?: number;
    sort?: string;
    order?: string;
  },
): Promise<AdminPlaylistListResponse> {
  const query = new URLSearchParams();
  if (params?.kind) query.set("kind", params.kind);
  if (params?.search) query.set("search", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.size) query.set("size", String(params.size));
  if (params?.sort) query.set("sort", params.sort);
  if (params?.order) query.set("order", params.order);

  const response = await adminApiFetch(`/api/v1/admin/media/playlists${query.size ? `?${query.toString()}` : ""}`, {
    headers: { "X-Admin-Actor-Id": actorId },
  });

  return response.json() as Promise<AdminPlaylistListResponse>;
}

export async function discoverAdminPlaylists(
  actorId: string,
  payload?: { channelId?: string | null },
): Promise<AdminPlaylistDiscoveryResponse> {
  const response = await adminApiFetch("/api/v1/admin/media/playlists/discover", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Actor-Id": actorId,
    },
    body: JSON.stringify(payload ?? {}),
  });

  return response.json() as Promise<AdminPlaylistDiscoveryResponse>;
}

export async function getAdminSyncJobs(actorId: string): Promise<AdminSyncJobListResponse> {
  const response = await adminApiFetch("/api/v1/admin/media/sync-jobs", {
    headers: { "X-Admin-Actor-Id": actorId },
  });

  return response.json() as Promise<AdminSyncJobListResponse>;
}

export function toFriendlyAdminMediaMessage(error: unknown, fallback: string): string {
  if (!(error instanceof AdminApiError)) {
    return fallback;
  }

  if (error.status === 401 || error.status === 403) {
    return "권한이 없거나 로그인 정보가 만료되었습니다. 다시 로그인한 뒤 시도해 주세요.";
  }

  if (error.code === "ADMIN_SYNC_KEY_MISSING") {
    return "관리자 미디어 기능 설정이 아직 완료되지 않았습니다. 서버 설정을 확인해 주세요.";
  }

  const message = error.message.trim();
  if (message.includes("관리자 키")) {
    return "관리자 API 키가 올바르지 않습니다. 서버 설정을 확인해 주세요.";
  }
  if (message.includes("channel")) {
    return "유튜브 채널 설정을 확인한 뒤 다시 시도해 주세요.";
  }

  return fallback;
}
