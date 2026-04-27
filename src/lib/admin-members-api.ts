import "server-only";

import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import type {
  AttendanceWeek,
  FamilyMember,
  FaithProfile,
  Member,
  MemberEvent,
  MemberStatus,
  ServiceAssignment,
  TrainingRecord,
} from "@/app/(admin)/admin/(cms)/members/_components/types";

type FaithStage = Member["faithStage"];
type Office = Member["office"];
type MemberSex = Member["sex"];
type BirthCalendar = Member["birthCalendar"];

export interface AdminMemberListResult {
  members: Member[];
  totalElements: number;
  hasNext: boolean;
}

export interface AdminMemberDetailResult {
  member: Member;
  faith?: FaithProfile;
  family: FamilyMember[];
  services: {
    active: ServiceAssignment[];
    past: ServiceAssignment[];
    tags: string[];
    trainings: TrainingRecord[];
  };
  events: MemberEvent[];
  attendance: AttendanceWeek[];
}

export interface CreateAdminMemberPayload {
  name: string;
  nameEn?: string | null;
  baptismName?: string | null;
  sex: MemberSex;
  birthDate: string;
  birthCalendar: BirthCalendar;
  phone: string;
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;
  email?: string | null;
  address: string;
  addressDetail?: string | null;
  job?: string | null;
  photoPath?: string | null;
  cellId?: string | null;
  cellLabel?: string | null;
  status: MemberStatus;
  faithStage: FaithStage;
  office: Office;
  officeAppointedAt?: string | null;
  registeredAt: string;
  memo?: string | null;
  faith?: {
    confessDate?: string | null;
    learningDate?: string | null;
    baptismDate?: string | null;
    baptismPlace?: string | null;
    baptismOfficiant?: string | null;
    confirmationDate?: string | null;
    previousChurch?: string | null;
    transferredInAt?: string | null;
  } | null;
}

interface BackendMemberSummary {
  id: number;
  name: string;
  nameEn?: string | null;
  baptismName?: string | null;
  sex: MemberSex;
  birthDate: string;
  birthCalendar: BirthCalendar;
  phone: string;
  address: string;
  addressDetail?: string | null;
  cellId?: string | null;
  cellLabel?: string | null;
  status: MemberStatus;
  faithStage: FaithStage;
  office: Office;
  registeredAt: string;
}

interface BackendMemberListResponse {
  members: BackendMemberSummary[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

interface BackendFaithProfile {
  memberId: number;
  confessDate?: string | null;
  learningDate?: string | null;
  baptismDate?: string | null;
  baptismPlace?: string | null;
  baptismOfficiant?: string | null;
  confirmationDate?: string | null;
  previousChurch?: string | null;
  transferredInAt?: string | null;
}

interface BackendFamily {
  id: number;
  memberId: number;
  relatedMemberId?: number | null;
  externalName?: string | null;
  relation: FamilyMember["relation"];
  relationDetail?: string | null;
  isHead: boolean;
  sex?: MemberSex | null;
  phone?: string | null;
  birthDate?: string | null;
  groupNote?: string | null;
}

interface BackendService {
  id: number;
  department: string;
  team?: string | null;
  role: string;
  startedAt: string;
  endedAt?: string | null;
  schedule?: string | null;
  note?: string | null;
}

interface BackendTraining {
  id: number;
  programName: string;
  completedAt: string;
  note?: string | null;
}

interface BackendEvent {
  id: number;
  type: MemberEvent["type"] | "FAMILY_UNLINKED";
  payload?: string | null;
  actorId: number;
  createdAt: string;
}

interface BackendAttendanceWeek {
  serviceDateId: number;
  serviceDate: string;
  serviceType: string;
  status: AttendanceWeek["status"];
  reason?: string | null;
}

interface BackendMemberDetail extends BackendMemberSummary {
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;
  email?: string | null;
  job?: string | null;
  photoPath?: string | null;
  officeAppointedAt?: string | null;
  memo?: string | null;
  createdAt: string;
  updatedAt: string;
  faith?: BackendFaithProfile | null;
  family: BackendFamily[];
  services: BackendService[];
  trainings: BackendTraining[];
  tags: string[];
  events: BackendEvent[];
  recentAttendance: BackendAttendanceWeek[];
}

interface BackendMemberCreateResponse extends BackendMemberDetail {}

function toFrontendId(value: string | number) {
  return String(value);
}

function normalizeNullable(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function computeAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

function computeFaithYears(source?: string | null) {
  if (!source) return 0;
  const date = new Date(source);
  if (Number.isNaN(date.getTime())) return 0;
  return Math.max(0, new Date().getFullYear() - date.getFullYear());
}

function deriveAvatarGrad(id: string) {
  const numeric = Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (numeric % 8) + 1;
}

function deriveInitial(name: string) {
  return name.trim().slice(0, 1) || "?";
}

function formatMonthDay(date: string) {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${Number(month)}/${Number(day)}`;
}

function parsePayload(payload?: string | null) {
  if (!payload) return null;
  try {
    return JSON.parse(payload) as Record<string, string | null>;
  } catch {
    return null;
  }
}

function eventMeta(type: BackendEvent["type"]) {
  switch (type) {
    case "REGISTERED":
      return { badgeLabel: "등록", dotColor: "bg-blue-500", ringColor: "ring-blue-50", badgeColor: "bg-blue-50 text-blue-700" };
    case "STATUS_CHANGED":
      return { badgeLabel: "상태", dotColor: "bg-emerald-500", ringColor: "ring-emerald-50", badgeColor: "bg-emerald-50 text-emerald-700" };
    case "STAGE_CHANGED":
      return { badgeLabel: "레벨", dotColor: "bg-[#3f74c7]", ringColor: "ring-[#edf4ff]", badgeColor: "bg-[#edf4ff] text-[#2d5da8]" };
    case "OFFICE_CHANGED":
      return { badgeLabel: "직분", dotColor: "bg-amber-500", ringColor: "ring-amber-50", badgeColor: "bg-amber-50 text-amber-700" };
    case "CELL_MOVED":
      return { badgeLabel: "공동체", dotColor: "bg-cyan-500", ringColor: "ring-cyan-50", badgeColor: "bg-cyan-50 text-cyan-700" };
    case "SERVICE_ASSIGNED":
    case "SERVICE_ENDED":
      return { badgeLabel: "봉사", dotColor: "bg-purple-500", ringColor: "ring-purple-50", badgeColor: "bg-purple-50 text-purple-700" };
    case "TRAINING_COMPLETED":
      return { badgeLabel: "교육", dotColor: "bg-emerald-500", ringColor: "ring-emerald-50", badgeColor: "bg-emerald-50 text-emerald-700" };
    case "ADDRESS_CHANGED":
      return { badgeLabel: "주소", dotColor: "bg-sky-500", ringColor: "ring-sky-50", badgeColor: "bg-sky-50 text-sky-700" };
    case "PHOTO_CHANGED":
      return { badgeLabel: "사진", dotColor: "bg-pink-500", ringColor: "ring-pink-50", badgeColor: "bg-pink-50 text-pink-700" };
    default:
      return { badgeLabel: "가족", dotColor: "bg-slate-500", ringColor: "ring-slate-50", badgeColor: "bg-slate-100 text-slate-700" };
  }
}

function eventTitle(type: BackendEvent["type"], payload: Record<string, string | null> | null) {
  switch (type) {
    case "REGISTERED":
      return "교적 등록";
    case "STATUS_CHANGED":
      return `상태 변경${payload?.before || payload?.after ? `: ${payload?.before ?? "-"} → ${payload?.after ?? "-"}` : ""}`;
    case "STAGE_CHANGED":
      return `신앙 레벨 변경${payload?.before || payload?.after ? `: ${payload?.before ?? "-"} → ${payload?.after ?? "-"}` : ""}`;
    case "OFFICE_CHANGED":
      return `직분 변경${payload?.before || payload?.after ? `: ${payload?.before ?? "-"} → ${payload?.after ?? "-"}` : ""}`;
    case "CELL_MOVED":
      return "공동체 변경";
    case "SERVICE_ASSIGNED":
      return "봉사 배정";
    case "SERVICE_ENDED":
      return "봉사 종료";
    case "TRAINING_COMPLETED":
      return "교육 이수 기록";
    case "ADDRESS_CHANGED":
      return "주소 변경";
    case "PHOTO_CHANGED":
      return "사진 변경";
    case "FAMILY_LINKED":
      return "가족 연결";
    case "FAMILY_UNLINKED":
      return "가족 연결 해제";
    default:
      return type;
  }
}

function normalizeMember(summary: BackendMemberSummary, faith?: BackendFaithProfile | null): Member {
  const id = toFrontendId(summary.id);
  return {
    id,
    name: summary.name,
    nameEn: normalizeNullable(summary.nameEn),
    baptismName: normalizeNullable(summary.baptismName),
    sex: summary.sex,
    birthDate: summary.birthDate,
    birthCalendar: summary.birthCalendar,
    phone: summary.phone,
    address: summary.address,
    addressDetail: normalizeNullable(summary.addressDetail),
    cellId: summary.cellId ?? "",
    cellLabel: summary.cellLabel ?? "",
    status: summary.status,
    faithStage: summary.faithStage,
    office: summary.office,
    registeredAt: summary.registeredAt,
    avatarGrad: deriveAvatarGrad(id),
    initial: deriveInitial(summary.name),
    age: computeAge(summary.birthDate),
    faithYears: computeFaithYears(faith?.confessDate ?? faith?.baptismDate ?? summary.registeredAt),
  };
}

function normalizeFaithProfile(faith: BackendFaithProfile | null | undefined, tags: string[]): FaithProfile | undefined {
  if (!faith) return undefined;
  return {
    memberId: toFrontendId(faith.memberId),
    confessDate: normalizeNullable(faith.confessDate),
    learningDate: normalizeNullable(faith.learningDate),
    baptismDate: normalizeNullable(faith.baptismDate),
    baptismPlace: normalizeNullable(faith.baptismPlace),
    baptismOfficiant: normalizeNullable(faith.baptismOfficiant),
    confirmationDate: normalizeNullable(faith.confirmationDate),
    previousChurch: normalizeNullable(faith.previousChurch),
    transferredInAt: normalizeNullable(faith.transferredInAt),
    ministryTags: tags,
  };
}

function normalizeFamilyItem(item: BackendFamily): FamilyMember {
  const name = item.externalName ?? (item.relatedMemberId ? `연결 교인 #${item.relatedMemberId}` : "미상");
  return {
    id: toFrontendId(item.id),
    memberId: item.relatedMemberId ? toFrontendId(item.relatedMemberId) : undefined,
    externalName: normalizeNullable(item.externalName),
    relation: item.relation,
    isHead: item.isHead,
    name,
    age: item.birthDate ? computeAge(item.birthDate) : undefined,
    sex: item.sex ?? "F",
    phone: normalizeNullable(item.phone),
    birthDate: normalizeNullable(item.birthDate),
    groupNote: normalizeNullable(item.groupNote ?? item.relationDetail),
    avatarGrad: deriveAvatarGrad(toFrontendId(item.id)),
    initial: deriveInitial(name),
    isLinked: Boolean(item.relatedMemberId),
  };
}

function normalizeServices(services: BackendService[]) {
  const mapped = services.map<ServiceAssignment>((item) => ({
    id: toFrontendId(item.id),
    department: item.department,
    team: normalizeNullable(item.team),
    role: item.role,
    startedAt: item.startedAt,
    endedAt: normalizeNullable(item.endedAt),
    schedule: normalizeNullable(item.schedule),
    isActive: !item.endedAt,
  }));
  return {
    active: mapped.filter((item) => item.isActive),
    past: mapped.filter((item) => !item.isActive),
  };
}

function normalizeTrainings(trainings: BackendTraining[]): TrainingRecord[] {
  return trainings.map((item) => ({
    id: toFrontendId(item.id),
    programName: item.programName,
    completedAt: item.completedAt,
    year: item.completedAt.slice(0, 4),
  }));
}

function normalizeEvents(events: BackendEvent[]): MemberEvent[] {
  return events.map((event) => {
    const payload = parsePayload(event.payload);
    const meta = eventMeta(event.type);
    return {
      id: toFrontendId(event.id),
      type: event.type === "FAMILY_UNLINKED" ? "FAMILY_LINKED" : event.type,
      occurredAt: event.createdAt.replace("T", " ").slice(0, 16),
      title: eventTitle(event.type, payload),
      detail:
        event.type === "ADDRESS_CHANGED" || event.type === "CELL_MOVED"
          ? undefined
          : payload?.after
            ? `변경값: ${payload.after}`
            : undefined,
      diff:
        payload?.before || payload?.after
          ? { before: payload?.before ?? "-", after: payload?.after ?? "-" }
          : undefined,
      actor: `관리자 #${event.actorId}`,
      badgeLabel: meta.badgeLabel,
      dotColor: meta.dotColor,
      ringColor: meta.ringColor,
      badgeColor: meta.badgeColor,
    };
  });
}

function normalizeAttendance(attendance: BackendAttendanceWeek[]): AttendanceWeek[] {
  return attendance.map((item) => ({
    date: formatMonthDay(item.serviceDate),
    status: item.status,
  }));
}

function actorHeaders(actorId: string, contentType = false) {
  return {
    ...(contentType ? { "Content-Type": "application/json" } : {}),
    "X-Admin-Actor-Id": actorId,
  };
}

export async function getAdminMembers(
  actorId: string,
  options?: {
    query?: string | null;
    status?: MemberStatus | "ALL" | null;
    stage?: FaithStage | "ALL" | null;
    cellId?: string | null;
    page?: number;
    size?: number;
  },
): Promise<AdminMemberListResult> {
  const params = new URLSearchParams();
  if (options?.query?.trim()) params.set("query", options.query.trim());
  if (options?.status && options.status !== "ALL") params.set("status", options.status);
  if (options?.stage && options.stage !== "ALL") params.set("stage", options.stage);
  if (options?.cellId?.trim()) params.set("cellId", options.cellId.trim());
  if (options?.page != null) params.set("page", String(options.page));
  if (options?.size != null) params.set("size", String(options.size));
  const query = params.size > 0 ? `?${params.toString()}` : "";

  const response = await adminApiFetch(`/api/v1/admin/members${query}`, {
    headers: actorHeaders(actorId),
  });
  const payload = (await response.json()) as BackendMemberListResponse;

  return {
    members: payload.members.map((item) => normalizeMember(item)),
    totalElements: payload.totalElements,
    hasNext: payload.hasNext,
  };
}

export async function getAdminMemberDetail(actorId: string, memberId: string | number): Promise<AdminMemberDetailResult> {
  const response = await adminApiFetch(`/api/v1/admin/members/${memberId}`, {
    headers: actorHeaders(actorId),
  });
  const payload = (await response.json()) as BackendMemberDetail;
  const member = normalizeMember(payload, payload.faith);
  const services = normalizeServices(payload.services);

  return {
    member: {
      ...member,
      emergencyPhone: normalizeNullable(payload.emergencyPhone),
      emergencyRelation: normalizeNullable(payload.emergencyRelation),
      email: normalizeNullable(payload.email),
      job: normalizeNullable(payload.job),
      officeAppointedAt: normalizeNullable(payload.officeAppointedAt),
      memo: normalizeNullable(payload.memo),
    },
    faith: normalizeFaithProfile(payload.faith, payload.tags),
    family: payload.family.map(normalizeFamilyItem),
    services: {
      active: services.active,
      past: services.past,
      tags: payload.tags,
      trainings: normalizeTrainings(payload.trainings),
    },
    events: normalizeEvents(payload.events),
    attendance: normalizeAttendance(payload.recentAttendance),
  };
}

export async function createAdminMember(actorId: string, payload: CreateAdminMemberPayload): Promise<AdminMemberDetailResult> {
  const response = await adminApiFetch("/api/v1/admin/members", {
    method: "POST",
    headers: actorHeaders(actorId, true),
    body: JSON.stringify(payload),
  });
  const created = (await response.json()) as BackendMemberCreateResponse;
  return getAdminMemberDetail(actorId, created.id);
}

export function toFriendlyAdminMemberMessage(error: unknown, fallback: string): string {
  if (!(error instanceof AdminApiError)) {
    return fallback;
  }

  if (error.status === 401 || error.status === 403) {
    return "권한이 없거나 로그인 정보가 만료되었습니다. 다시 로그인해 주세요.";
  }

  if (error.code === "ADMIN_SYNC_KEY_MISSING") {
    return "교적부 관리 기능 설정이 아직 완료되지 않았습니다. 서버 설정을 확인해 주세요.";
  }

  if (error.status >= 500) {
    return "교적부 서버와 통신하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }

  return error.message.trim() || fallback;
}
