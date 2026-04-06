import "server-only";

import { SERVER_MEDIA_API_BASE_URL } from "@/lib/server-config";

const ADMIN_SYNC_KEY = process.env.ADMIN_SYNC_KEY?.trim() || "";

interface UpstreamApiErrorResponse {
  code?: string;
  message?: string;
}

export class AdminApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
  }
}

function ensureAdminSyncKey() {
  if (!ADMIN_SYNC_KEY) {
    throw new AdminApiError(500, "ADMIN_SYNC_KEY_MISSING", "관리자 API 키가 설정되지 않았습니다.");
  }
}

async function parseUpstreamError(response: Response) {
  try {
    const data = (await response.json()) as UpstreamApiErrorResponse;
    return {
      code: data.code || "UPSTREAM_ERROR",
      message: data.message || `관리자 API 호출에 실패했습니다. (${response.status})`,
    };
  } catch {
    return {
      code: "UPSTREAM_ERROR",
      message: `관리자 API 호출에 실패했습니다. (${response.status})`,
    };
  }
}

export async function adminApiFetch(path: string, init?: RequestInit) {
  ensureAdminSyncKey();

  const response = await fetch(`${SERVER_MEDIA_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "X-Admin-Key": ADMIN_SYNC_KEY,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await parseUpstreamError(response);
    throw new AdminApiError(response.status, error.code, error.message);
  }

  return response;
}

export interface AdminMediaSyncResponse {
  status: string;
  totalPlaylists: number;
  succeededPlaylists: number;
  failedPlaylists: number;
  completedAt: string;
}
