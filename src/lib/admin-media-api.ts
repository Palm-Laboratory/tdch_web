import "server-only";

import { AdminApiError, adminApiFetch } from "@/lib/admin-api";
export {
  ADMIN_CONTENT_KIND_META,
  ADMIN_PLAYLIST_OPERATION_STATUS_META,
  ADMIN_PLAYLIST_STATUS_META,
  ADMIN_SYNC_JOB_STATUS_META,
  formatAdminMediaDate,
  formatAdminMediaDateTime,
  getAdminSyncJobStatusMeta,
} from "@/lib/admin-media-shared";
export type {
  AdminContentKind,
  AdminPlaylist,
  AdminPlaylistDetailResponse,
  AdminPlaylistDiscoveryItem,
  AdminPlaylistDiscoveryResponse,
  AdminPlaylistListResponse,
  AdminPlaylistStatus,
  AdminSyncJobDetailResponse,
  AdminSyncJob,
  AdminSyncJobListResponse,
  AdminVideo,
  AdminVideoListResponse,
  AdminVideoMetadataResponse,
  UpdateAdminPlaylistPayload,
  UpdateAdminVideoMetadataPayload,
} from "@/lib/admin-media-shared";

import type {
  AdminPlaylistDetailResponse,
  AdminPlaylistDiscoveryResponse,
  AdminPlaylistListResponse,
  AdminSyncJobDetailResponse,
  AdminSyncJobListResponse,
  AdminVideoListResponse,
  AdminVideoMetadataResponse,
  UpdateAdminPlaylistPayload,
  UpdateAdminVideoMetadataPayload,
} from "@/lib/admin-media-shared";
import type { AdminMediaSyncResponse } from "@/lib/admin-api";

async function fetchAdminMediaJson<T>(
  actorId: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("X-Admin-Actor-Id", actorId);

  const response = await adminApiFetch(path, {
    ...init,
    headers,
  });

  return response.json() as Promise<T>;
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

  return fetchAdminMediaJson<AdminPlaylistListResponse>(
    actorId,
    `/api/v1/admin/media/playlists${query.size ? `?${query.toString()}` : ""}`,
  );
}

export async function getAdminPlaylist(
  actorId: string,
  siteKey: string,
): Promise<AdminPlaylistDetailResponse> {
  return fetchAdminMediaJson<AdminPlaylistDetailResponse>(
    actorId,
    `/api/v1/admin/media/playlists/${encodeURIComponent(siteKey)}`,
  );
}

export async function discoverAdminPlaylists(
  actorId: string,
  payload?: { channelId?: string | null },
): Promise<AdminPlaylistDiscoveryResponse> {
  return fetchAdminMediaJson<AdminPlaylistDiscoveryResponse>(actorId, "/api/v1/admin/media/playlists/discover", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload ?? {}),
  });
}

export async function updateAdminPlaylist(
  actorId: string,
  siteKey: string,
  payload: UpdateAdminPlaylistPayload,
): Promise<AdminPlaylistDetailResponse> {
  return fetchAdminMediaJson<AdminPlaylistDetailResponse>(actorId, `/api/v1/admin/media/playlists/${encodeURIComponent(siteKey)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getAdminSyncJobs(actorId: string): Promise<AdminSyncJobListResponse> {
  return fetchAdminMediaJson<AdminSyncJobListResponse>(actorId, "/api/v1/admin/media/sync-jobs");
}

export async function getAdminSyncJob(
  actorId: string,
  jobId: string | number,
): Promise<AdminSyncJobDetailResponse> {
  return fetchAdminMediaJson<AdminSyncJobDetailResponse>(actorId, `/api/v1/admin/media/sync-jobs/${encodeURIComponent(String(jobId))}`);
}

export async function runAdminMediaSync(actorId: string): Promise<AdminMediaSyncResponse> {
  return fetchAdminMediaJson<AdminMediaSyncResponse>(actorId, "/api/v1/admin/media/sync", {
    method: "POST",
  });
}

export async function getAdminPlaylistVideos(
  actorId: string,
  siteKey: string,
  params?: {
    visible?: string;
    featured?: string;
    search?: string;
    page?: number;
    size?: number;
  },
): Promise<AdminVideoListResponse> {
  const query = new URLSearchParams();
  if (params?.visible) query.set("visible", params.visible);
  if (params?.featured) query.set("featured", params.featured);
  if (params?.search) query.set("search", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.size) query.set("size", String(params.size));

  return fetchAdminMediaJson<AdminVideoListResponse>(
    actorId,
    `/api/v1/admin/media/playlists/${encodeURIComponent(siteKey)}/videos${query.size ? `?${query.toString()}` : ""}`,
  );
}

export async function getAdminVideoMetadata(
  actorId: string,
  youtubeVideoId: string,
): Promise<AdminVideoMetadataResponse> {
  return fetchAdminMediaJson<AdminVideoMetadataResponse>(
    actorId,
    `/api/v1/admin/media/videos/${encodeURIComponent(youtubeVideoId)}/metadata`,
  );
}

export async function updateAdminVideoMetadata(
  actorId: string,
  youtubeVideoId: string,
  payload: UpdateAdminVideoMetadataPayload,
): Promise<AdminVideoMetadataResponse> {
  return fetchAdminMediaJson<AdminVideoMetadataResponse>(
    actorId,
    `/api/v1/admin/media/videos/${encodeURIComponent(youtubeVideoId)}/metadata`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
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
  if (message.includes("slug")) {
    return message;
  }
  if (message.includes("youtubePlaylistId")) {
    return message;
  }
  if (message.includes("youtubeVideoId")) {
    return message;
  }
  if (message.includes("channel")) {
    return "유튜브 채널 설정을 확인한 뒤 다시 시도해 주세요.";
  }

  return fallback;
}
