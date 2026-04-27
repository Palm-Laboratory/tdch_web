export type MemberStatus =
  | "ACTIVE"
  | "NEW"
  | "RESTING"
  | "LONG_ABSENT"
  | "TRANSFERRED_OUT"
  | "DECEASED"
  | "REMOVED";

export type FaithStage =
  | "SEEKER"
  | "NEW_COMER"
  | "SETTLED"
  | "GROWING"
  | "DISCIPLE"
  | "MINISTER"
  | "LEADER";

export type FamilyRelation = "SPOUSE" | "PARENT" | "CHILD" | "SIBLING" | "OTHER";

export type AttendanceStatus = "ATTEND" | "ABSENT" | "EXCUSED" | "ONLINE";

export type Office =
  | "LAY"
  | "DEACON_TEMP"
  | "DEACON"
  | "GWONSA"
  | "ELDER"
  | "ELDER_EMERITUS"
  | "EVANGELIST"
  | "PASTOR";

export interface Member {
  id: string;
  name: string;
  nameEn?: string;
  baptismName?: string;
  sex: "M" | "F";
  birthDate: string;
  birthCalendar: "SOLAR" | "LUNAR";
  phone: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  email?: string;
  address: string;
  addressDetail?: string;
  job?: string;
  cellId: string;
  cellLabel: string;
  status: MemberStatus;
  faithStage: FaithStage;
  office: Office;
  officeAppointedAt?: string;
  registeredAt: string;
  memo?: string;
  avatarGrad: number;
  initial: string;
  statusSuggestion?: MemberStatus;
  faithStageSuggestion?: FaithStage;
  faithYears: number;
  age: number;
}

export interface FaithProfile {
  memberId: string;
  confessDate?: string;
  learningDate?: string;
  baptismDate?: string;
  baptismPlace?: string;
  baptismOfficiant?: string;
  confirmationDate?: string;
  previousChurch?: string;
  transferredInAt?: string;
  ministryTags: string[];
}

export interface FamilyMember {
  id: string;
  memberId?: string;
  externalName?: string;
  relation: FamilyRelation;
  isHead: boolean;
  name: string;
  age?: number;
  sex: "M" | "F";
  phone?: string;
  birthDate?: string;
  status?: MemberStatus;
  faithStage?: FaithStage;
  office?: Office;
  groupNote?: string;
  avatarGrad: number;
  initial: string;
  isLinked: boolean;
}

export interface ServiceAssignment {
  id: string;
  department: string;
  team?: string;
  role: string;
  startedAt: string;
  endedAt?: string;
  schedule?: string;
  isActive: boolean;
}

export interface TrainingRecord {
  id: string;
  programName: string;
  completedAt: string;
  year: string;
}

export interface MemberEvent {
  id: string;
  type:
    | "REGISTERED"
    | "STATUS_CHANGED"
    | "STAGE_CHANGED"
    | "OFFICE_CHANGED"
    | "CELL_MOVED"
    | "SERVICE_ASSIGNED"
    | "SERVICE_ENDED"
    | "TRAINING_COMPLETED"
    | "ADDRESS_CHANGED"
    | "PHOTO_CHANGED"
    | "FAMILY_LINKED"
    | "STAGE_PROMOTION_CANDIDATE";
  occurredAt: string;
  title: string;
  detail?: string;
  diff?: { before: string; after: string };
  actor: string;
  badgeLabel: string;
  dotColor: string;
  ringColor: string;
  badgeColor: string;
}

export interface AttendanceWeek {
  date: string;
  status: AttendanceStatus | null;
}

export const STATUS_META: Record<
  MemberStatus,
  { label: string; badge: string; dot: string }
> = {
  ACTIVE: { label: "출석", badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  NEW: { label: "새가족", badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  RESTING: { label: "쉼", badge: "bg-yellow-50 text-yellow-700", dot: "bg-yellow-500" },
  LONG_ABSENT: { label: "장결", badge: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  TRANSFERRED_OUT: { label: "이명", badge: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  DECEASED: { label: "소천", badge: "bg-gray-200 text-gray-800", dot: "bg-gray-700" },
  REMOVED: { label: "제적", badge: "bg-gray-100 text-gray-500 line-through", dot: "bg-gray-400" },
};

export const STAGE_META: Record<
  FaithStage,
  { lv: number; label: string; badge: string }
> = {
  SEEKER: { lv: 0, label: "구도자", badge: "bg-slate-100 text-slate-700" },
  NEW_COMER: { lv: 1, label: "새가족", badge: "bg-blue-50 text-blue-700" },
  SETTLED: { lv: 2, label: "정착교인", badge: "bg-teal-50 text-teal-700" },
  GROWING: { lv: 3, label: "양육교인", badge: "bg-cyan-50 text-cyan-700" },
  DISCIPLE: { lv: 4, label: "제자", badge: "bg-[#edf4ff] text-[#2d5da8]" },
  MINISTER: { lv: 5, label: "사역자", badge: "bg-pink-50 text-pink-700" },
  LEADER: { lv: 6, label: "리더", badge: "bg-purple-50 text-purple-700" },
};

export const OFFICE_LABEL: Record<Office, string> = {
  LAY: "평신도",
  DEACON_TEMP: "서리집사",
  DEACON: "안수집사",
  GWONSA: "권사",
  ELDER: "장로",
  ELDER_EMERITUS: "원로장로",
  EVANGELIST: "전도사",
  PASTOR: "목사",
};

export const RELATION_LABEL: Record<FamilyRelation, string> = {
  SPOUSE: "배우자",
  PARENT: "부모",
  CHILD: "자녀",
  SIBLING: "형제자매",
  OTHER: "기타",
};
