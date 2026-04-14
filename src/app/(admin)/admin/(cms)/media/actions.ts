"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, isAdminSession } from "@/auth";
import { discoverAdminPlaylists, toFriendlyAdminMediaMessage } from "@/lib/admin-media-api";

export interface AdminMediaDiscoveryActionState {
  message?: string;
  success?: boolean;
  discoveredCount?: number;
  skippedCount?: number;
  messageKey?: number;
}

function buildState(
  message: string,
  options?: Pick<AdminMediaDiscoveryActionState, "success" | "discoveredCount" | "skippedCount">,
): AdminMediaDiscoveryActionState {
  return {
    message,
    success: options?.success ?? false,
    discoveredCount: options?.discoveredCount,
    skippedCount: options?.skippedCount,
    messageKey: Date.now(),
  };
}

export async function discoverAdminPlaylistsAction(
  prev: AdminMediaDiscoveryActionState,
  formData: FormData,
): Promise<AdminMediaDiscoveryActionState> {
  void prev;
  void formData;
  const session = await getAdminSession();
  if (!isAdminSession(session)) {
    return buildState("관리자 로그인 후 다시 시도해 주세요.");
  }

  const actorId = session.user.id ?? "";
  if (!actorId) {
    return buildState("관리자 계정 정보가 확인되지 않았습니다. 다시 로그인해 주세요.");
  }

  try {
    const result = await discoverAdminPlaylists(actorId);
    revalidatePath("/admin/media");

    return buildState(
      `불러오기를 완료했습니다. 신규 ${result.discoveredCount}건, 건너뜀 ${result.skippedCount}건`,
      {
        success: true,
        discoveredCount: result.discoveredCount,
        skippedCount: result.skippedCount,
      },
    );
  } catch (error) {
    return buildState(
      toFriendlyAdminMediaMessage(error, "미연결 재생목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."),
    );
  }
}
