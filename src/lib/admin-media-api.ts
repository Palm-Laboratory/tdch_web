import "server-only";

import { AdminApiError, adminApiFetch } from "@/lib/admin-api";

// ── 타입 ──────────────────────────────────────────────────────────────────────

export type ContentKind = "LONG_FORM" | "SHORT";

export interface AdminPlaylist {
  id: number;
  menuName: string;
  siteKey: string;
  slug: string;
  contentKind: ContentKind;
  active: boolean;
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

export interface AdminPlaylistDetail {
  id: number;
  menuName: string;
  siteKey: string;
  slug: string;
  contentKind: ContentKind;
  active: boolean;
  youtubePlaylistId: string;
  youtubeTitle: string;
  youtubeDescription: string;
  channelTitle: string;
  thumbnailUrl: string;
  itemCount: number;
  syncEnabled: boolean;
  lastSyncedAt: string | null;
}

export interface UpdatePlaylistRequest {
  menuName: string;
  slug: string;
  syncEnabled: boolean;
  active: boolean;
}

export interface AdminVideo {
  youtubeVideoId: string;
  position: number;
  visible: boolean;
  featured: boolean;
  displayTitle: string;
  displayThumbnailUrl: string;
  displayPublishedDate: string;
  originalTitle: string;
  publishedAt: string;
  thumbnailUrl: string;
  preacher: string | null;
  scripture: string | null;
  pinnedRank: number | null;
}

export interface AdminVideoListResponse {
  data: AdminVideo[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface AdminVideoWithMetadata {
  youtubeVideoId: string;
  originalTitle: string;
  originalDescription: string;
  publishedAt: string;
  watchUrl: string;
  embedUrl: string;
  lastSyncedAt: string | null;
  visible: boolean;
  featured: boolean;
  pinnedRank: number | null;
  manualTitle: string | null;
  manualThumbnailUrl: string | null;
  manualPublishedDate: string | null;
  manualKind: ContentKind | null;
  preacher: string | null;
  scripture: string | null;
  scriptureBody: string | null;
  serviceType: string | null;
  summary: string | null;
  tags: string[];
}

export interface UpdateVideoMetadataRequest {
  visible: boolean;
  featured: boolean;
  pinnedRank: number | null;
  manualTitle: string | null;
  manualThumbnailUrl: string | null;
  manualPublishedDate: string | null;
  manualKind: ContentKind | null;
  preacher: string | null;
  scripture: string | null;
  scriptureBody: string | null;
  serviceType: string | null;
  summary: string | null;
  tags: string[];
}

// ── 조회 ──────────────────────────────────────────────────────────────────────

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
  const searchParams = new URLSearchParams();
  if (params?.kind) searchParams.set("kind", params.kind);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.size) searchParams.set("size", String(params.size));
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.order) searchParams.set("order", params.order);

  const qs = searchParams.toString();
  const path = `/api/v1/admin/media/playlists${qs ? `?${qs}` : ""}`;

  const response = await adminApiFetch(path, {
    headers: { "X-Admin-Actor-Id": actorId },
  });
  return response.json() as Promise<AdminPlaylistListResponse>;
}

export async function getAdminPlaylistDetail(
  actorId: string,
  siteKey: string,
): Promise<AdminPlaylistDetail> {
  const response = await adminApiFetch(`/api/v1/admin/media/playlists/${siteKey}`, {
    headers: { "X-Admin-Actor-Id": actorId },
  });
  return response.json() as Promise<AdminPlaylistDetail>;
}

export async function updateAdminPlaylist(
  actorId: string,
  siteKey: string,
  payload: UpdatePlaylistRequest,
): Promise<AdminPlaylistDetail> {
  const response = await adminApiFetch(`/api/v1/admin/media/playlists/${siteKey}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Actor-Id": actorId,
    },
    body: JSON.stringify(payload),
  });
  return response.json() as Promise<AdminPlaylistDetail>;
}

export async function getAdminVideos(
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
  const searchParams = new URLSearchParams();
  if (params?.visible) searchParams.set("visible", params.visible);
  if (params?.featured) searchParams.set("featured", params.featured);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.size) searchParams.set("size", String(params.size));

  const qs = searchParams.toString();
  const path = `/api/v1/admin/media/playlists/${siteKey}/videos${qs ? `?${qs}` : ""}`;

  const response = await adminApiFetch(path, {
    headers: { "X-Admin-Actor-Id": actorId },
  });
  return response.json() as Promise<AdminVideoListResponse>;
}

export async function getAdminVideoMetadata(
  actorId: string,
  videoId: string,
): Promise<AdminVideoWithMetadata> {
  const response = await adminApiFetch(`/api/v1/admin/media/videos/${videoId}/metadata`, {
    headers: { "X-Admin-Actor-Id": actorId },
  });
  return response.json() as Promise<AdminVideoWithMetadata>;
}

export async function updateAdminVideoMetadata(
  actorId: string,
  videoId: string,
  payload: UpdateVideoMetadataRequest,
): Promise<AdminVideoWithMetadata> {
  const response = await adminApiFetch(`/api/v1/admin/media/videos/${videoId}/metadata`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Actor-Id": actorId,
    },
    body: JSON.stringify(payload),
  });
  return response.json() as Promise<AdminVideoWithMetadata>;
}

// ── 에러 메시지 변환 ───────────────────────────────────────────────────────────

export function toFriendlyAdminMediaMessage(error: unknown, fallback: string): string {
  if (!(error instanceof AdminApiError)) {
    return fallback;
  }

  if (error.status === 401 || error.status === 403) {
    return "권한이 없거나 로그인 정보가 만료되었습니다. 다시 로그인한 뒤 시도해 주세요.";
  }

  if (error.status === 404) {
    return "요청한 리소스를 찾을 수 없습니다.";
  }

  if (error.code === "ADMIN_SYNC_KEY_MISSING") {
    return "관리자 기능 설정이 아직 완료되지 않았습니다. 서버 설정을 확인해 주세요.";
  }

  const message = error.message.trim();

  if (message.includes("slug") && message.includes("이미 사용")) {
    return "이미 사용 중인 slug입니다.";
  }

  return fallback;
}
