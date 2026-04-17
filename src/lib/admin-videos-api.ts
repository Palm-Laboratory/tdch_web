import "server-only";

import { adminApiFetch, AdminApiError } from "@/lib/admin-api";

export type VideoContentForm = "LONGFORM" | "SHORTFORM";

export interface AdminVideoSummary {
  videoId: string;
  title: string;
  sourceTitle: string;
  preacherName: string | null;
  publishedAt: string | null;
  hidden: boolean;
  contentForm: VideoContentForm;
  thumbnailUrl: string | null;
  scriptureReference: string | null;
}

export interface AdminVideoListResponse {
  items: AdminVideoSummary[];
}

export interface AdminVideoDetail {
  videoId: string;
  sourceTitle: string;
  sourceDescription: string | null;
  sourcePublishedAt: string | null;
  sourceThumbnailUrl: string | null;
  title: string;
  preacherName: string | null;
  publishedAt: string | null;
  hidden: boolean;
  scriptureReference: string | null;
  scriptureBody: string | null;
  messageBody: string | null;
  summary: string | null;
  thumbnailOverrideUrl: string | null;
  contentForm: VideoContentForm;
  publicHref: string | null;
}

export interface UpdateAdminVideoMetaRequest {
  displayTitle: string | null;
  preacherName: string | null;
  displayPublishedAt: string | null;
  hidden: boolean;
  scriptureReference: string | null;
  scriptureBody: string | null;
  messageBody: string | null;
  summary: string | null;
  thumbnailOverrideUrl: string | null;
}

export async function getAdminVideos(form?: VideoContentForm): Promise<AdminVideoListResponse> {
  const query = form ? `?form=${encodeURIComponent(form)}` : "";
  const response = await adminApiFetch(`/api/v1/admin/videos${query}`);
  return response.json() as Promise<AdminVideoListResponse>;
}

export async function getAdminVideoDetail(videoId: string): Promise<AdminVideoDetail> {
  const response = await adminApiFetch(`/api/v1/admin/videos/${encodeURIComponent(videoId)}`);
  return response.json() as Promise<AdminVideoDetail>;
}

export async function updateAdminVideoMeta(
  videoId: string,
  payload: UpdateAdminVideoMetaRequest,
): Promise<AdminVideoDetail> {
  const response = await adminApiFetch(`/api/v1/admin/videos/${encodeURIComponent(videoId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json() as Promise<AdminVideoDetail>;
}

export function toFriendlyAdminVideoMessage(error: unknown, fallback: string): string {
  if (!(error instanceof AdminApiError)) {
    return fallback;
  }

  if (error.status === 401 || error.status === 403) {
    return "권한이 없거나 로그인 정보가 만료되었습니다. 다시 로그인해 주세요.";
  }

  return error.message || fallback;
}
