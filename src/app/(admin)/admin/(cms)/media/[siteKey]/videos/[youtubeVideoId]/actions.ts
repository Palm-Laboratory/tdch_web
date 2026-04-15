"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, isAdminSession } from "@/auth";
import { toFriendlyAdminMediaMessage, updateAdminVideoMetadata } from "@/lib/admin-media-api";

export interface AdminMediaVideoActionState {
  errors?: Partial<Record<"manualTitle" | "manualPublishedDate" | "manualKind" | "pinnedRank", string>>;
  message?: string;
  success?: boolean;
  messageKey?: number;
}

function buildState(message: string, success = false): AdminMediaVideoActionState {
  return { message, success, messageKey: Date.now() };
}

function parseBoolean(formData: FormData, key: string) {
  return String(formData.get(key) ?? "false") === "true";
}

function optionalString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

export async function updateAdminMediaVideoAction(
  siteKey: string,
  youtubeVideoId: string,
  _prev: AdminMediaVideoActionState,
  formData: FormData,
): Promise<AdminMediaVideoActionState> {
  const session = await getAdminSession();
  if (!isAdminSession(session)) {
    return buildState("관리자 로그인 후 다시 시도해 주세요.");
  }

  const actorId = session.user.id ?? "";
  if (!actorId) {
    return buildState("관리자 계정 정보가 확인되지 않았습니다. 다시 로그인해 주세요.");
  }

  const manualTitle = optionalString(formData, "manualTitle");
  const manualPublishedDate = optionalString(formData, "manualPublishedDate");
  const manualKind = optionalString(formData, "manualKind");
  const pinnedRankRaw = String(formData.get("pinnedRank") ?? "").trim();
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const errors: AdminMediaVideoActionState["errors"] = {};
  if (manualPublishedDate && !/^\d{4}-\d{2}-\d{2}$/.test(manualPublishedDate)) {
    errors.manualPublishedDate = "날짜 형식은 YYYY-MM-DD 이어야 합니다.";
  }
  if (manualKind && !["LONG_FORM", "SHORT"].includes(manualKind)) {
    errors.manualKind = "콘텐츠 유형은 LONG_FORM 또는 SHORT만 가능합니다.";
  }

  let pinnedRank: number | null = null;
  if (pinnedRankRaw) {
    pinnedRank = Number.parseInt(pinnedRankRaw, 10);
    if (!Number.isFinite(pinnedRank)) {
      errors.pinnedRank = "고정 순서는 숫자로 입력해 주세요.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    await updateAdminVideoMetadata(actorId, youtubeVideoId, {
      visible: parseBoolean(formData, "visible"),
      featured: parseBoolean(formData, "featured"),
      pinnedRank,
      manualTitle,
      manualThumbnailUrl: optionalString(formData, "manualThumbnailUrl"),
      manualPublishedDate,
      manualKind,
      preacher: optionalString(formData, "preacher"),
      scripture: optionalString(formData, "scripture"),
      scriptureBody: optionalString(formData, "scriptureBody"),
      serviceType: optionalString(formData, "serviceType"),
      summary: optionalString(formData, "summary"),
      tags,
    });
  } catch (error) {
    return buildState(
      toFriendlyAdminMediaMessage(error, "비디오 메타데이터를 저장하지 못했습니다. 입력한 내용을 확인한 뒤 다시 시도해 주세요."),
    );
  }

  revalidatePath(`/admin/media/${siteKey}`);
  revalidatePath(`/admin/media/${siteKey}/videos/${youtubeVideoId}`);
  return buildState("비디오 메타데이터를 저장했습니다.", true);
}
