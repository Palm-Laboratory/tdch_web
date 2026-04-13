"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminNavigationItem,
  updateAdminNavigationItem,
  deleteAdminNavigationItem,
  type AdminNavigationLinkType,
} from "@/lib/admin-navigation-api";
import { AdminApiError } from "@/lib/admin-api";

export interface NavigationFormState {
  errors?: Partial<Record<string, string>>;
  message?: string;
  messageKey?: number;
}

function parseBoolean(val: FormDataEntryValue | null): boolean {
  return val === "true" || val === "on";
}

function parseNullableString(val: FormDataEntryValue | null): string | null {
  const s = typeof val === "string" ? val.trim() : "";
  return s.length > 0 ? s : null;
}

function parseNullableNumber(val: FormDataEntryValue | null): number | null {
  const n = Number.parseInt(typeof val === "string" ? val : "", 10);
  return Number.isFinite(n) ? n : null;
}

const VALID_LINK_TYPES: AdminNavigationLinkType[] = ["INTERNAL", "ANCHOR", "EXTERNAL"];

function buildMessageState(message: string): NavigationFormState {
  return {
    message,
    messageKey: Date.now(),
  };
}

function toFriendlyNavigationMessage(error: unknown, fallback: string): string {
  if (!(error instanceof AdminApiError)) {
    return fallback;
  }

  if (error.status === 401 || error.status === 403) {
    return "로그인 정보가 확인되지 않았습니다. 다시 로그인한 뒤 시도해 주세요.";
  }

  if (error.code === "ADMIN_SYNC_KEY_MISSING") {
    return "관리자 저장 설정이 아직 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.";
  }

  const message = error.message.trim();

  if (message.includes("Request method 'POST' is not supported")) {
    return "메뉴 저장 기능이 아직 서버에 반영되지 않았습니다. 잠시 후 다시 시도해 주세요.";
  }

  if (message.includes("Request method 'PUT' is not supported")) {
    return "메뉴 수정 기능이 아직 서버에 반영되지 않았습니다. 잠시 후 다시 시도해 주세요.";
  }

  if (message.includes("이미 사용 중인 menuKey")) {
    return "이미 사용 중인 메뉴 키입니다. 다른 메뉴 키를 입력해 주세요.";
  }

  if (message.includes("상위 메뉴는 1depth")) {
    return "상위 메뉴는 1단계 메뉴만 선택할 수 있습니다.";
  }

  if (message.includes("기본 랜딩")) {
    return "기본 이동 메뉴 설정이 올바르지 않습니다. 같은 상위 메뉴에서는 하나만 선택할 수 있습니다.";
  }

  if (message.includes("ANCHOR")) {
    return "페이지 내 위치 이동 메뉴 설정을 다시 확인해 주세요.";
  }

  if (message.includes("EXTERNAL")) {
    return "외부 링크 주소를 다시 확인해 주세요.";
  }

  if (message.includes("내비게이션 세트")) {
    return "메뉴 그룹 정보를 다시 불러온 뒤 시도해 주세요.";
  }

  if (message.includes("메뉴 세트는 변경할 수 없습니다")) {
    return "현재 메뉴는 다른 메뉴 그룹으로 옮길 수 없습니다.";
  }

  if (message.includes("메뉴 자신을 상위 메뉴로 선택할 수 없습니다")) {
    return "같은 메뉴를 상위 메뉴로 선택할 수 없습니다.";
  }

  if (message.includes("하위 메뉴가 있는 1depth 메뉴는 2depth로 변경할 수 없습니다")) {
    return "하위 메뉴가 연결된 1단계 메뉴는 바로 위치를 바꿀 수 없습니다. 하위 메뉴를 먼저 정리해 주세요.";
  }

  if (message.includes("하위 메뉴가 있는 메뉴는 삭제할 수 없습니다")) {
    return "이 메뉴 안에 하위 메뉴가 있어 바로 삭제할 수 없습니다. 하위 메뉴를 먼저 정리해 주세요.";
  }

  return fallback;
}

// ── 공통 payload 파싱 & 유효성 검사 ────────────────────────────────────────
function parsePayload(formData: FormData): {
  payload?: Parameters<typeof createAdminNavigationItem>[0];
  errors?: Partial<Record<string, string>>;
} {
  const errors: Partial<Record<string, string>> = {};

  const label = (formData.get("label") as string | null)?.trim() ?? "";
  const menuKey = (formData.get("menuKey") as string | null)?.trim() ?? "";
  const href = (formData.get("href") as string | null)?.trim() ?? "";
  const linkType = (formData.get("linkType") as string | null) ?? "";

  if (!label) errors.label = "메뉴명을 입력해주세요.";
  if (!menuKey) errors.menuKey = "메뉴 키를 입력해주세요.";
  else if (!/^[a-z0-9_-]+$/.test(menuKey)) errors.menuKey = "영소문자, 숫자, -, _ 만 사용 가능합니다.";
  if (!href) errors.href = "연결 주소를 입력해주세요.";
  if (!VALID_LINK_TYPES.includes(linkType as AdminNavigationLinkType))
    errors.linkType = "올바른 링크 타입을 선택해주세요.";
  const navigationSetId = parseNullableNumber(formData.get("navigationSetId"));
  if (!navigationSetId) {
    errors.navigationSetId = "메뉴 세트 정보가 누락되었습니다.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    payload: {
      navigationSetId: navigationSetId!,
      parentId: parseNullableNumber(formData.get("parentId")),
      menuKey,
      label,
      href,
      matchPath: parseNullableString(formData.get("matchPath")),
      linkType: linkType as AdminNavigationLinkType,
      visible: parseBoolean(formData.get("visible")),
      headerVisible: parseBoolean(formData.get("headerVisible")),
      mobileVisible: parseBoolean(formData.get("mobileVisible")),
      lnbVisible: parseBoolean(formData.get("lnbVisible")),
      breadcrumbVisible: parseBoolean(formData.get("breadcrumbVisible")),
      defaultLanding: parseBoolean(formData.get("defaultLanding")),
      sortOrder: parseNullableNumber(formData.get("sortOrder")) ?? 0,
    },
  };
}

// ── 메뉴 생성 ────────────────────────────────────────────────────────────────
export async function createNavigationItemAction(
  _prev: NavigationFormState,
  formData: FormData,
): Promise<NavigationFormState> {
  const { payload, errors } = parsePayload(formData);
  if (errors) return { errors };

  try {
    await createAdminNavigationItem(payload!);
  } catch (err) {
    return buildMessageState(
      toFriendlyNavigationMessage(err, "메뉴를 추가하지 못했습니다. 입력한 내용을 확인한 뒤 다시 시도해 주세요."),
    );
  }

  revalidatePath("/admin/navigation");
  redirect("/admin/navigation");
}

// ── 메뉴 수정 ────────────────────────────────────────────────────────────────
export async function updateNavigationItemAction(
  id: number,
  _prev: NavigationFormState,
  formData: FormData,
): Promise<NavigationFormState> {
  const { payload, errors } = parsePayload(formData);
  if (errors) return { errors };

  try {
    await updateAdminNavigationItem(id, payload!);
  } catch (err) {
    return buildMessageState(
      toFriendlyNavigationMessage(err, "메뉴를 저장하지 못했습니다. 입력한 내용을 확인한 뒤 다시 시도해 주세요."),
    );
  }

  revalidatePath("/admin/navigation");
  revalidatePath(`/admin/navigation/${id}`);
  redirect("/admin/navigation");
}

// ── 메뉴 삭제 ────────────────────────────────────────────────────────────────
export async function deleteNavigationItemAction(id: number): Promise<void> {
  try {
    await deleteAdminNavigationItem(id);
  } catch (err) {
    const msg = toFriendlyNavigationMessage(err, "메뉴를 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    throw new Error(msg);
  }

  revalidatePath("/admin/navigation");
  redirect("/admin/navigation");
}
