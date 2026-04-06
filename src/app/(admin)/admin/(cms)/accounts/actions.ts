"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import {
  createAdminAccount,
  updateAdminAccount,
  deleteAdminAccount,
  toFriendlyAdminAccountMessage,
  type AdminAccountRole,
} from "@/lib/admin-accounts-api";

export interface AdminAccountFormState {
  errors?: Partial<Record<"username" | "displayName" | "password" | "role", string>>;
  message?: string;
  success?: boolean;
  messageKey?: number;
}

function buildMessageState(message: string, success = false): AdminAccountFormState {
  return { message, success, messageKey: Date.now() };
}

async function requireSuperAdmin() {
  const session = await getAdminSession();
  if (!isAdminSession(session) || session.user.accountRole !== "SUPER_ADMIN") {
    return { session: null, actorId: "" };
  }
  return { session, actorId: session.user.id ?? "" };
}

// ── 계정 생성 ──────────────────────────────────────────────────────────────────
export async function createAdminAccountAction(
  _prev: AdminAccountFormState,
  formData: FormData,
): Promise<AdminAccountFormState> {
  const { actorId, session } = await requireSuperAdmin();
  if (!session) return buildMessageState("슈퍼 관리자만 관리자 계정을 발급할 수 있습니다.");

  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const errors: AdminAccountFormState["errors"] = {};
  if (!username) errors.username = "아이디를 입력해 주세요.";
  else if (!/^[a-z0-9_-]+$/.test(username)) errors.username = "영소문자, 숫자, -, _ 만 사용 가능합니다.";
  if (!displayName) errors.displayName = "이름을 입력해 주세요.";
  if (!password) errors.password = "비밀번호를 입력해 주세요.";
  else if (password.length < 8) errors.password = "비밀번호는 8자 이상이어야 합니다.";

  if (Object.keys(errors).length > 0) return { errors };

  try {
    await createAdminAccount(actorId, { username, displayName, password });
  } catch (error) {
    return buildMessageState(
      toFriendlyAdminAccountMessage(error, "계정을 추가하지 못했습니다. 입력한 내용을 확인한 뒤 다시 시도해 주세요."),
    );
  }

  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}

// ── 계정 수정 ──────────────────────────────────────────────────────────────────
export async function updateAdminAccountAction(
  id: number,
  _prev: AdminAccountFormState,
  formData: FormData,
): Promise<AdminAccountFormState> {
  const { actorId, session } = await requireSuperAdmin();
  if (!session) return buildMessageState("슈퍼 관리자만 계정을 수정할 수 있습니다.");

  const displayName = String(formData.get("displayName") ?? "").trim();
  const role = String(formData.get("role") ?? "") as AdminAccountRole;
  const active = formData.get("active") === "true";
  const password = String(formData.get("password") ?? "").trim() || null;

  const errors: AdminAccountFormState["errors"] = {};
  if (!displayName) errors.displayName = "이름을 입력해 주세요.";
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") errors.role = "올바른 권한을 선택해 주세요.";
  if (password !== null && password.length < 8) errors.password = "비밀번호는 8자 이상이어야 합니다.";

  if (Object.keys(errors).length > 0) return { errors };

  try {
    await updateAdminAccount(actorId, id, { displayName, role, active, password });
  } catch (error) {
    return buildMessageState(
      toFriendlyAdminAccountMessage(error, "계정을 저장하지 못했습니다. 입력한 내용을 확인한 뒤 다시 시도해 주세요."),
    );
  }

  revalidatePath("/admin/accounts");
  revalidatePath(`/admin/accounts/${id}`);
  redirect("/admin/accounts");
}

// ── 계정 삭제 ──────────────────────────────────────────────────────────────────
export async function deleteAdminAccountAction(id: number): Promise<void> {
  const { actorId, session } = await requireSuperAdmin();
  if (!session) throw new Error("슈퍼 관리자만 계정을 삭제할 수 있습니다.");

  try {
    await deleteAdminAccount(actorId, id);
  } catch (error) {
    throw new Error(toFriendlyAdminAccountMessage(error, "계정을 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요."));
  }

  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}
