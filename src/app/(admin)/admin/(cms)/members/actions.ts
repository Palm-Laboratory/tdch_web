"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { createAdminMember, toFriendlyAdminMemberMessage, type CreateAdminMemberPayload } from "@/lib/admin-members-api";
import { MOCK_CELLS } from "./_components/mock-data";

async function requireAdminActor() {
  const session = await getAdminSession();
  if (!isAdminSession(session) || !session.user.id) {
    return "";
  }
  return session.user.id;
}

export async function createAdminMemberAction(formData: FormData): Promise<void> {
  const actorId = await requireAdminActor();
  if (!actorId) {
    throw new Error("관리자 로그인 후 다시 시도해 주세요.");
  }

  const payload: CreateAdminMemberPayload = {
    cellId: String(formData.get("cellId") ?? "").trim() || null,
    name: String(formData.get("name") ?? "").trim(),
    nameEn: String(formData.get("nameEn") ?? "").trim() || null,
    baptismName: String(formData.get("baptismName") ?? "").trim() || null,
    sex: (String(formData.get("sex") ?? "F") === "M" ? "M" : "F"),
    birthDate: String(formData.get("birthDate") ?? ""),
    birthCalendar: (String(formData.get("birthCalendar") ?? "SOLAR") === "LUNAR" ? "LUNAR" : "SOLAR"),
    phone: String(formData.get("phone") ?? "").trim(),
    emergencyPhone: String(formData.get("emergencyPhone") ?? "").trim() || null,
    emergencyRelation: String(formData.get("emergencyRelation") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim(),
    addressDetail: String(formData.get("addressDetail") ?? "").trim() || null,
    job: String(formData.get("job") ?? "").trim() || null,
    cellLabel: MOCK_CELLS.find((cell) => cell.id === String(formData.get("cellId") ?? "").trim())?.label ?? null,
    status: (formData.get("status") as CreateAdminMemberPayload["status"]) ?? "NEW",
    faithStage: (formData.get("faithStage") as CreateAdminMemberPayload["faithStage"]) ?? "NEW_COMER",
    office: (formData.get("office") as CreateAdminMemberPayload["office"]) ?? "LAY",
    officeAppointedAt: String(formData.get("officeAppointedAt") ?? "").trim() || null,
    registeredAt: String(formData.get("registeredAt") ?? ""),
    memo: String(formData.get("memo") ?? "").trim() || null,
    faith: {
      confessDate: String(formData.get("confessDate") ?? "").trim() || null,
      learningDate: String(formData.get("learningDate") ?? "").trim() || null,
      baptismDate: String(formData.get("baptismDate") ?? "").trim() || null,
      baptismPlace: String(formData.get("baptismPlace") ?? "").trim() || null,
      baptismOfficiant: String(formData.get("baptismOfficiant") ?? "").trim() || null,
      confirmationDate: String(formData.get("confirmationDate") ?? "").trim() || null,
      previousChurch: String(formData.get("previousChurch") ?? "").trim() || null,
      transferredInAt: String(formData.get("transferredInAt") ?? "").trim() || null,
    },
  };

  try {
    const result = await createAdminMember(actorId, payload);
    revalidatePath("/admin/members");
    redirect(`/admin/members?id=${result.member.id}`);
  } catch (error) {
    throw new Error(
      toFriendlyAdminMemberMessage(error, "교인을 등록하지 못했습니다. 입력한 내용을 확인한 뒤 다시 시도해 주세요."),
    );
  }
}
