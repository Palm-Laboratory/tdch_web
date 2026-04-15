export type AdminPlaylistStatus = "DRAFT" | "PUBLISHED" | "INACTIVE";
export type AdminContentKind = "LONG_FORM" | "SHORT";
export type AdminPlaylistOperationStatus = "SYNC_DISABLED" | "SYNC_FAILED" | "READY" | "PENDING_SYNC";

export const ADMIN_PLAYLIST_STATUS_META = {
  DRAFT: { label: "초안", cls: "bg-[#fff7ed] text-[#c2410c]" },
  PUBLISHED: { label: "게시", cls: "bg-[#ecfdf5] text-[#047857]" },
  INACTIVE: { label: "비활성", cls: "bg-[#f1f5f9] text-[#64748b]" },
} as const satisfies Record<AdminPlaylistStatus, { label: string; cls: string }>;

export const ADMIN_CONTENT_KIND_META = {
  LONG_FORM: { label: "롱폼", cls: "bg-[#eff6ff] text-[#1d4ed8]" },
  SHORT: { label: "숏폼", cls: "bg-[#f5f3ff] text-[#7c3aed]" },
} as const satisfies Record<AdminContentKind, { label: string; cls: string }>;

export const ADMIN_SYNC_JOB_STATUS_META = {
  SUCCEEDED: { label: "성공", cls: "bg-emerald-50 text-emerald-600" },
  PARTIAL_FAILED: { label: "부분 실패", cls: "bg-amber-50 text-amber-700" },
  FAILED: { label: "실패", cls: "bg-rose-50 text-rose-700" },
  RUNNING: { label: "실행 중", cls: "bg-sky-50 text-sky-700" },
} as const satisfies Record<string, { label: string; cls: string }>;

export const ADMIN_PLAYLIST_OPERATION_STATUS_META = {
  SYNC_DISABLED: {
    label: "Sync 꺼짐",
    cls: "bg-slate-100 text-slate-700",
    description: "정기 sync 대상에서 제외되어 있습니다.",
  },
  SYNC_FAILED: {
    label: "점검 필요",
    cls: "bg-rose-50 text-rose-700",
    description: "최근 sync 실패를 먼저 확인해야 합니다.",
  },
  READY: {
    label: "정상 운영",
    cls: "bg-emerald-50 text-emerald-700",
    description: "최근 sync 기준으로 운영 상태가 정상입니다.",
  },
  PENDING_SYNC: {
    label: "첫 sync 대기",
    cls: "bg-amber-50 text-amber-700",
    description: "아직 유효한 sync 이력이 없습니다.",
  },
} as const satisfies Record<AdminPlaylistOperationStatus, { label: string; cls: string; description: string }>;

export function getAdminSyncJobStatusMeta(status: string): { label: string; cls: string } {
  return ADMIN_SYNC_JOB_STATUS_META[status as keyof typeof ADMIN_SYNC_JOB_STATUS_META] ?? {
    label: status,
    cls: "bg-[#f1f5f9] text-[#64748b]",
  };
}

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
  lastDiscoveredAt: string | null;
  publishedAt: string | null;
  lastModifiedBy: number | null;
  youtubePlaylistId: string;
  itemCount: number;
  syncEnabled: boolean;
  lastSyncedAt: string | null;
  lastSyncSucceededAt: string | null;
  lastSyncFailedAt: string | null;
  lastSyncErrorMessage: string | null;
  discoverySource: string | null;
  operationStatus: AdminPlaylistOperationStatus;
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

export interface AdminPlaylistDetailResponse {
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
  lastDiscoveredAt: string | null;
  publishedAt: string | null;
  lastModifiedBy: number | null;
  youtubePlaylistId: string;
  youtubeTitle: string;
  youtubeDescription: string;
  channelTitle: string;
  thumbnailUrl: string;
  itemCount: number;
  syncEnabled: boolean;
  lastSyncedAt: string | null;
  lastSyncSucceededAt: string | null;
  lastSyncFailedAt: string | null;
  lastSyncErrorMessage: string | null;
  discoverySource: string | null;
  operationStatus: AdminPlaylistOperationStatus;
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

export interface AdminSyncJobItem {
  id: number;
  status: string;
  siteKey: string | null;
  menuName: string | null;
  youtubePlaylistId: string | null;
  processedItems: number;
  insertedVideos: number;
  updatedVideos: number;
  deactivatedPlaylistVideos: number;
  errorMessage: string | null;
  startedAt: string;
  finishedAt: string | null;
}

export interface AdminSyncJobDetailResponse {
  id: number;
  triggerType: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  totalPlaylists: number;
  succeededPlaylists: number;
  failedPlaylists: number;
  errorSummary: string | null;
  items: AdminSyncJobItem[];
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

export interface AdminVideoMetadataResponse {
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
  manualKind: string | null;
  preacher: string | null;
  scripture: string | null;
  scriptureBody: string | null;
  serviceType: string | null;
  summary: string | null;
  tags: string[];
}

export interface UpdateAdminPlaylistPayload {
  menuName: string;
  slug: string;
  contentKind: AdminContentKind;
  youtubePlaylistId?: string | null;
  syncEnabled: boolean;
  active: boolean;
  status: AdminPlaylistStatus;
  navigationVisible: boolean;
  sortOrder: number;
  description?: string | null;
}

export interface UpdateAdminVideoMetadataPayload {
  visible: boolean;
  featured: boolean;
  pinnedRank?: number | null;
  manualTitle?: string | null;
  manualThumbnailUrl?: string | null;
  manualPublishedDate?: string | null;
  manualKind?: string | null;
  preacher?: string | null;
  scripture?: string | null;
  scriptureBody?: string | null;
  serviceType?: string | null;
  summary?: string | null;
  tags: string[];
}

export function formatAdminMediaDate(value: string | null, fallback: string): string {
  if (!value) {
    return fallback;
  }

  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatAdminMediaDateTime(value: string | null, fallback: string): string {
  if (!value) {
    return fallback;
  }

  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
