"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, isAdminSession } from "@/auth";
import {
  updateAdminPlaylist,
  updateAdminVideoMetadata,
  toFriendlyAdminMediaMessage,
  type ContentKind,
} from "@/lib/admin-media-api";

// ── 재생목록 설정 업데이트 ────────────────────────────────────────────────────

export interface PlaylistFormState {
  errors?: Partial<Record<"menuName" | "slug" | "syncEnabled" | "active", string>>;
  message?: string;
  success?: boolean;
  messageKey?: number;
}

function buildPlaylistState(message: string, success = false): PlaylistFormState {
  return { message, success, messageKey: Date.now() };
}

export async function updatePlaylistAction(
  siteKey: string,
  _prev: PlaylistFormState,
  formData: FormData,
): Promise<PlaylistFormState> {
  const session = await getAdminSession();
  if (!isAdminSession(session)) return buildPlaylistState("로그인이 필요합니다.");

  const actorId = session.user.id ?? "";
  const menuName = String(formData.get("menuName") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const syncEnabled = formData.get("syncEnabled") === "true";
  const active = formData.get("active") === "true";

  const errors: PlaylistFormState["errors"] = {};
  if (!menuName) errors.menuName = "메뉴명을 입력해 주세요.";
  else if (menuName.length > 100) errors.menuName = "메뉴명은 100자 이하로 입력해 주세요.";
  if (!slug) errors.slug = "Slug를 입력해 주세요.";
  else if (!/^[a-z0-9-]+$/.test(slug)) errors.slug = "영소문자, 숫자, 하이픈만 사용 가능합니다.";

  if (Object.keys(errors).length > 0) return { errors };

  try {
    await updateAdminPlaylist(actorId, siteKey, { menuName, slug, syncEnabled, active });
  } catch (error) {
    return buildPlaylistState(
      toFriendlyAdminMediaMessage(error, "재생목록 설정을 저장하지 못했습니다. 다시 시도해 주세요."),
    );
  }

  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${siteKey}`);
  return buildPlaylistState("저장되었습니다.", true);
}

// ── 영상 메타데이터 업데이트 ──────────────────────────────────────────────────

export interface VideoMetadataFormState {
  errors?: Partial<Record<string, string>>;
  message?: string;
  success?: boolean;
  messageKey?: number;
}

function buildVideoState(message: string, success = false): VideoMetadataFormState {
  return { message, success, messageKey: Date.now() };
}

export async function updateVideoMetadataAction(
  siteKey: string,
  _prev: VideoMetadataFormState,
  formData: FormData,
): Promise<VideoMetadataFormState> {
  const session = await getAdminSession();
  if (!isAdminSession(session)) return buildVideoState("로그인이 필요합니다.");

  const actorId = session.user.id ?? "";
  const videoId = String(formData.get("videoId") ?? "").trim();
  if (!videoId) return buildVideoState("영상 ID가 없습니다.");
  const visible = formData.get("visible") === "true";
  const featured = formData.get("featured") === "on" || formData.get("featured") === "true";
  const pinnedRankRaw = String(formData.get("pinnedRank") ?? "").trim();
  const pinnedRank = pinnedRankRaw ? Number(pinnedRankRaw) : null;

  const manualTitle = String(formData.get("manualTitle") ?? "").trim() || null;
  const manualThumbnailUrl = String(formData.get("manualThumbnailUrl") ?? "").trim() || null;
  const manualPublishedDate = String(formData.get("manualPublishedDate") ?? "").trim() || null;
  const manualKindRaw = String(formData.get("manualKind") ?? "").trim();
  const manualKind = (manualKindRaw === "LONG_FORM" || manualKindRaw === "SHORT") ? manualKindRaw as ContentKind : null;

  const preacher = String(formData.get("preacher") ?? "").trim() || null;
  const scripture = String(formData.get("scripture") ?? "").trim() || null;
  const scriptureBody = String(formData.get("scriptureBody") ?? "").trim() || null;
  const serviceType = String(formData.get("serviceType") ?? "").trim() || null;
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  // validation
  const errors: VideoMetadataFormState["errors"] = {};
  if (pinnedRank !== null && (!Number.isFinite(pinnedRank) || pinnedRank < 0)) {
    errors.pinnedRank = "올바른 숫자를 입력해 주세요.";
  }
  if (manualThumbnailUrl && !manualThumbnailUrl.startsWith("http")) {
    errors.manualThumbnailUrl = "올바른 URL을 입력해 주세요.";
  }
  if (scriptureBody && scriptureBody.length > 2000) {
    errors.scriptureBody = "본문 내용은 2,000자 이하로 입력해 주세요.";
  }
  if (summary && summary.length > 500) {
    errors.summary = "요약은 500자 이하로 입력해 주세요.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  try {
    await updateAdminVideoMetadata(actorId, videoId, {
      visible,
      featured,
      pinnedRank,
      manualTitle,
      manualThumbnailUrl,
      manualPublishedDate,
      manualKind,
      preacher,
      scripture,
      scriptureBody,
      serviceType,
      summary,
      tags,
    });
  } catch (error) {
    return buildVideoState(
      toFriendlyAdminMediaMessage(error, "메타데이터를 저장하지 못했습니다. 다시 시도해 주세요."),
    );
  }

  revalidatePath(`/admin/media/${siteKey}`);
  return buildVideoState("메타데이터가 저장되었습니다.", true);
}
