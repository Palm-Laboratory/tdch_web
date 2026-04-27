"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Avatar, CellBadge, OfficeBadge, StageBadge, StatusBadge } from "./badges";
import {
  MOCK_ATTENDANCE,
  MOCK_CELLS,
  MOCK_EVENTS,
  MOCK_FAMILY,
  MOCK_FAITH_PROFILES,
  MOCK_MEMBERS,
  MOCK_SERVICES,
  MOCK_SUMMARY,
} from "./mock-data";
import {
  OFFICE_LABEL,
  RELATION_LABEL,
  STAGE_META,
  STATUS_META,
  type AttendanceStatus,
  type FaithStage,
  type Member,
  type MemberEvent,
  type MemberStatus,
} from "./types";

type DrawerTab = "basic" | "family" | "service" | "history";
type SortOption = "registered-desc" | "name-asc" | "faith-desc";

const DRAWER_TABS: Array<{ id: DrawerTab; label: string }> = [
  { id: "basic", label: "기본정보" },
  { id: "family", label: "가족관계" },
  { id: "service", label: "봉사" },
  { id: "history", label: "이력" },
];

const ATTENDANCE_META: Record<AttendanceStatus, { symbol: string; className: string; label: string }> = {
  ATTEND: { symbol: "●", className: "bg-emerald-500 text-white", label: "출석" },
  ABSENT: { symbol: "○", className: "bg-slate-200 text-slate-600", label: "결석" },
  EXCUSED: { symbol: "E", className: "bg-amber-400 text-white", label: "사유" },
  ONLINE: { symbol: "△", className: "bg-sky-400 text-white", label: "온라인" },
};

const stageOptions: Array<{ value: FaithStage | "ALL"; label: string }> = [
  { value: "ALL", label: "전체" },
  ...Object.entries(STAGE_META).map(([value, meta]) => ({
    value: value as FaithStage,
    label: `Lv${meta.lv} ${meta.label}`,
  })),
];

const statusOptions: Array<{ value: MemberStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "전체" },
  ...Object.entries(STATUS_META).map(([value, meta]) => ({
    value: value as MemberStatus,
    label: meta.label,
  })),
];

const formatBirthCalendar = (calendar: Member["birthCalendar"]) => (calendar === "SOLAR" ? "양" : "음");

const formatMonthBucket = (value: string) => value.slice(0, 7);

function compareMembers(a: Member, b: Member, sort: SortOption) {
  if (sort === "name-asc") {
    return a.name.localeCompare(b.name, "ko");
  }

  if (sort === "faith-desc") {
    return STAGE_META[b.faithStage].lv - STAGE_META[a.faithStage].lv;
  }

  return b.registeredAt.localeCompare(a.registeredAt);
}

export default function MemberRegistryClient() {
  const router = useRouter();
  const pathname = usePathname() ?? "/admin/members";
  const searchParams = useSearchParams();
  const paramsString = searchParams?.toString() ?? "";

  const [query, setQuery] = useState("");
  const [selectedCell, setSelectedCell] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<MemberStatus | "ALL">("ALL");
  const [selectedStage, setSelectedStage] = useState<FaithStage | "ALL">("ALL");
  const [sort, setSort] = useState<SortOption>("registered-desc");

  const selectedMemberId = searchParams?.get("id") ?? null;
  const selectedTab = (searchParams?.get("tab") as DrawerTab | null) ?? "basic";

  const members = useMemo(() => {
    return [...MOCK_MEMBERS]
      .filter((member) => {
        const keyword = query.trim();
        const matchesQuery =
          !keyword ||
          member.name.includes(keyword) ||
          member.phone.includes(keyword) ||
          `${member.address} ${member.addressDetail ?? ""}`.includes(keyword);
        const matchesCell = selectedCell === "ALL" || member.cellId === selectedCell;
        const matchesStatus = selectedStatus === "ALL" || member.status === selectedStatus;
        const matchesStage = selectedStage === "ALL" || member.faithStage === selectedStage;
        return matchesQuery && matchesCell && matchesStatus && matchesStage;
      })
      .sort((a, b) => compareMembers(a, b, sort));
  }, [query, selectedCell, selectedStage, selectedStatus, sort]);

  const selectedMember = members.find((member) => member.id === selectedMemberId) ?? MOCK_MEMBERS.find((member) => member.id === selectedMemberId) ?? null;

  const updateSearch = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(paramsString);

    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(href, { scroll: false });
  };

  return (
    <div className="space-y-5">
      <SummaryCards />

      <section className="rounded-3xl border border-[#dbe4f0] bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <Field label="검색어" className="min-w-[240px] flex-1">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="이름, 연락처, 주소"
              className="h-10 w-full rounded-xl border border-[#d5deea] px-3 text-[13px] text-[#0f1c2e] outline-none transition focus:border-[#3f74c7]"
            />
          </Field>

          <Field label="구역 · 쉘">
            <select
              value={selectedCell}
              onChange={(event) => setSelectedCell(event.target.value)}
              className="h-10 rounded-xl border border-[#d5deea] bg-white px-3 text-[13px] text-[#0f1c2e] outline-none transition focus:border-[#3f74c7]"
            >
              <option value="ALL">전체</option>
              {MOCK_CELLS.map((cell) => (
                <option key={cell.id} value={cell.id}>
                  {cell.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="상태">
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as MemberStatus | "ALL")}
              className="h-10 rounded-xl border border-[#d5deea] bg-white px-3 text-[13px] text-[#0f1c2e] outline-none transition focus:border-[#3f74c7]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="신앙 레벨">
            <select
              value={selectedStage}
              onChange={(event) => setSelectedStage(event.target.value as FaithStage | "ALL")}
              className="h-10 rounded-xl border border-[#d5deea] bg-white px-3 text-[13px] text-[#0f1c2e] outline-none transition focus:border-[#3f74c7]"
            >
              {stageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <button className="h-10 rounded-xl bg-[#3f74c7] px-5 text-[13px] font-semibold text-white">
            검색
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCell("ALL");
              setSelectedStatus("ALL");
              setSelectedStage("ALL");
              setSort("registered-desc");
            }}
            className="h-10 rounded-xl border border-[#d5deea] bg-white px-4 text-[12px] font-medium text-[#55697f]"
          >
            초기화
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {selectedCell !== "ALL" ? (
            <FilterBadge label={`구역: ${MOCK_CELLS.find((cell) => cell.id === selectedCell)?.label ?? selectedCell}`} />
          ) : null}
          {selectedStatus !== "ALL" ? <FilterBadge label={`상태: ${STATUS_META[selectedStatus].label}`} /> : null}
          {selectedStage !== "ALL" ? <FilterBadge label={`레벨: Lv${STAGE_META[selectedStage].lv} ${STAGE_META[selectedStage].label}`} /> : null}
        </div>
      </section>

      <div className={`relative ${selectedMember ? "xl:pr-[752px]" : ""}`}>
        {selectedMember ? (
          <button
            type="button"
            aria-label="상세 닫기"
            onClick={() => updateSearch({ id: null, tab: null })}
            className="fixed inset-0 z-20 bg-[#08121f]/28 backdrop-blur-[1px]"
          />
        ) : null}

        <section className={`relative z-10 overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white shadow-sm transition ${selectedMember ? "xl:opacity-70" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2f7] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[#5d6f86]">
                전체 <span className="font-semibold text-[#132033]">{members.length}</span>건
              </span>
              <span className="text-[11px] text-[#8fa3bb]">원본 목업 요약 기준 총 {MOCK_SUMMARY.total}명</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 text-[11px] text-[#55697f]">
                정렬
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  className="h-8 rounded-lg border border-[#d5deea] bg-white px-2 text-[11px]"
                >
                  <option value="registered-desc">등록일 ↓</option>
                  <option value="name-asc">이름 가나다</option>
                  <option value="faith-desc">신앙 레벨 ↓</option>
                </select>
              </label>
              <Link
                href="/admin/members/new"
                className="inline-flex h-8 items-center rounded-lg bg-[#3f74c7] px-3 text-[11px] font-semibold text-white"
              >
                + 새 교인 등록
              </Link>
              <Link
                href="/admin/attendance"
                className="inline-flex h-8 items-center rounded-lg border border-[#bfd0ea] bg-[#edf4ff] px-3 text-[11px] font-semibold text-[#2d5da8]"
              >
                출석 관리
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1120px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                  <th className="w-[80px] px-4 py-3 text-[11px] font-semibold tracking-wide text-[#55697f]">사진</th>
                  <th className="px-4 py-3 text-[11px] font-semibold tracking-wide text-[#55697f]">이름</th>
                  <th className="px-4 py-3 text-[11px] font-semibold tracking-wide text-[#55697f]">연락처</th>
                  <th className="px-4 py-3 text-[11px] font-semibold tracking-wide text-[#55697f]">주소</th>
                  <th className="px-4 py-3 text-[11px] font-semibold tracking-wide text-[#55697f]">구역 · 쉘</th>
                  <th className="px-4 py-3 text-[11px] font-semibold tracking-wide text-[#55697f]">신앙 레벨</th>
                  <th className="px-4 py-3 text-[11px] font-semibold tracking-wide text-[#55697f]">등록일</th>
                  <th className="px-4 py-3 text-[11px] font-semibold tracking-wide text-[#55697f]">상태</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const isSelected = selectedMember?.id === member.id;

                  return (
                    <tr
                      key={member.id}
                      className={`cursor-pointer border-b border-[#f0f4f8] transition hover:bg-[#f8fbff] ${isSelected ? "bg-[#edf4ff]/50" : ""}`}
                      onClick={() => updateSearch({ id: member.id, tab: selectedTab })}
                    >
                      <td className="px-4 py-3">
                        <Avatar initial={member.initial} grad={member.avatarGrad} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[13px] font-semibold ${isSelected ? "text-[#2d5da8]" : "text-[#0f1c2e]"}`}>
                            {member.name}
                          </span>
                          <OfficeBadge office={member.office} />
                        </div>
                        <div className="mt-1 text-[11px] text-[#8fa3bb]">
                          {member.baptismName ? `세례명 ${member.baptismName} · ` : ""}
                          {member.age}세
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#55697f]">{member.phone}</td>
                      <td className="px-4 py-3 text-[12px] text-[#55697f]">{member.address}</td>
                      <td className="px-4 py-3">
                        <CellBadge label={member.cellLabel} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <StageBadge stage={member.faithStage} />
                          {member.faithStageSuggestion ? (
                            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                              제안
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#55697f]">{member.registeredAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={member.status} />
                          {member.statusSuggestion ? <span className="h-2 w-2 rounded-full bg-amber-400" /> : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {selectedMember ? (
          <MemberDrawer
            member={selectedMember}
            selectedTab={selectedTab}
            onClose={() => updateSearch({ id: null, tab: null })}
            onSelectTab={(tab) => updateSearch({ id: selectedMember.id, tab })}
          />
        ) : null}
      </div>
    </div>
  );
}

function SummaryCards() {
  return (
    <section className="overflow-x-auto pb-1">
      <div className="grid min-w-[1040px] grid-cols-5 gap-3">
        <SummaryCard label="전체 교인" value={MOCK_SUMMARY.total} suffix="명" accent="text-[#0f1c2e]" />
        <SummaryCard label="출석 교인" value={MOCK_SUMMARY.active} suffix="명" accent="text-emerald-600" />
        <SummaryCard label="새가족" value={MOCK_SUMMARY.newcomer} suffix="명" accent="text-blue-600" />
        <SummaryCard label="쉼 / 장결" value={MOCK_SUMMARY.resting} suffix="명" accent="text-yellow-600" />
        <SummaryCard label="상태 변경 제안" value={MOCK_SUMMARY.suggestionCount} suffix="건" accent="text-orange-500" />
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: number;
  suffix: string;
  accent: string;
}) {
  return (
    <div className="rounded-3xl border border-[#dbe4f0] bg-white px-5 py-4 shadow-sm">
      <p className={`text-[11px] font-semibold ${accent}`}>{label}</p>
      <p className={`mt-1 text-[22px] font-bold ${accent}`}>
        {value} <span className="text-[12px] font-normal text-[#8fa3bb]">{suffix}</span>
      </p>
    </div>
  );
}

function FilterBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#edf4ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#2d5da8]">
      {label}
    </span>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-[11px] font-semibold text-[#55697f]">{label}</span>
      {children}
    </label>
  );
}

function MemberDrawer({
  member,
  selectedTab,
  onClose,
  onSelectTab,
}: {
  member: Member;
  selectedTab: DrawerTab;
  onClose: () => void;
  onSelectTab: (tab: DrawerTab) => void;
}) {
  const family = MOCK_FAMILY[member.id] ?? [];
  const faith = MOCK_FAITH_PROFILES[member.id];
  const service = MOCK_SERVICES[member.id];
  const events = MOCK_EVENTS[member.id] ?? [];
  const attendance = MOCK_ATTENDANCE[member.id] ?? [];

  return (
    <aside className="fixed inset-y-16 right-0 z-30 w-full max-w-[720px] overflow-hidden border-l border-[#dbe4f0] bg-white shadow-2xl">
      <div className="border-b border-[#e2e8f0] px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <Avatar initial={member.initial} grad={member.avatarGrad} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[22px] font-bold text-[#0f1c2e]">{member.name}</h2>
                {member.baptismName ? <span className="text-[13px] text-[#8fa3bb]">세례명: {member.baptismName}</span> : null}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <OfficeBadge office={member.office} />
                <StatusBadge status={member.status} />
                <StageBadge stage={member.faithStage} />
                <span className="text-[11px] text-[#8fa3bb]">
                  · {member.sex === "F" ? "여" : "남"}, {member.age}세
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[#6d7f95]">
                등록일 {member.registeredAt} · 신앙연수 {member.faithYears}년
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button className="h-8 rounded-lg border border-[#d5deea] px-3 text-[12px] font-medium text-[#55697f]">
              취소
            </button>
            <button className="h-8 rounded-lg bg-[#3f74c7] px-3 text-[12px] font-semibold text-white">
              수정
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-[#8fa3bb] hover:bg-[#f1f5f9]"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border-b border-[#e2e8f0] bg-[#fafcff] px-6">
        <div className="flex min-w-max">
        {DRAWER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`h-11 border-b-2 px-4 text-[13px] transition ${
              selectedTab === tab.id
                ? "border-[#3f74c7] font-semibold text-[#0f1c2e]"
                : "border-transparent text-[#8fa3bb] hover:text-[#55697f]"
            }`}
          >
            {tab.label}
          </button>
        ))}
        </div>
      </div>

      <div className="h-[calc(100vh-129px)] overflow-y-auto p-6">
        {selectedTab === "basic" ? <BasicTab member={member} faith={faith} familyCount={family.length} attendance={attendance} /> : null}
        {selectedTab === "family" ? <FamilyTab family={family} /> : null}
        {selectedTab === "service" ? <ServiceTab service={service} /> : null}
        {selectedTab === "history" ? <HistoryTab events={events} /> : null}
      </div>
    </aside>
  );
}

function BasicTab({
  member,
  faith,
  familyCount,
  attendance,
}: {
  member: Member;
  faith?: (typeof MOCK_FAITH_PROFILES)[string];
  familyCount: number;
  attendance: (typeof MOCK_ATTENDANCE)[string];
}) {
  const completedWeeks = attendance.filter((item) => item.status !== null);
  const attendedWeeks = attendance.filter((item) => item.status === "ATTEND" || item.status === "ONLINE");
  const attendanceRate = completedWeeks.length ? Math.round((attendedWeeks.length / completedWeeks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#dbe4f0] bg-gradient-to-br from-[#edf4ff] to-white px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-[#0f1c2e]">최근 4주 출석</h3>
          <Link href="/admin/attendance" className="text-[11px] font-semibold text-[#3f74c7]">
            전체 출석 이력 보기 →
          </Link>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            {attendance.map((item) => {
              const meta = item.status ? ATTENDANCE_META[item.status] : null;
              return (
                <div key={item.date} className="flex flex-col items-center">
                  <div
                    title={meta?.label ?? "미입력"}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold shadow-sm ${
                      meta
                        ? meta.className
                        : "border-2 border-dashed border-[#d5deea] bg-white text-[#8fa3bb]"
                    }`}
                  >
                    {meta?.symbol ?? "−"}
                  </div>
                  <p className="mt-1 text-[10px] text-[#55697f]">{item.date}</p>
                </div>
              );
            })}
          </div>
          <div className="lg:ml-auto lg:text-right">
            <p className="text-[11px] text-[#55697f]">출석률 (4주)</p>
            <p className="text-[20px] font-bold text-emerald-600">{attendanceRate}%</p>
            <p className="text-[10px] text-[#8fa3bb]">
              마지막 출석 {attendance.findLast((item) => item.status)?.date ?? "기록 없음"}
            </p>
          </div>
        </div>
      </section>

      <InfoSection title="인적사항">
        <InfoGrid
          items={[
            { label: "이름 (영문)", value: `${member.name}${member.nameEn ? ` (${member.nameEn})` : ""}` },
            { label: "성별 / 생년월일", value: `${member.sex === "F" ? "여" : "남"} / ${member.birthDate} (${formatBirthCalendar(member.birthCalendar)})` },
            { label: "연락처 (본인)", value: member.phone },
            { label: "비상 연락망", value: member.emergencyPhone ? `${member.emergencyPhone}${member.emergencyRelation ? ` (${member.emergencyRelation})` : ""}` : "미등록" },
            { label: "이메일", value: member.email ?? "미등록" },
            { label: "직업", value: member.job ?? "미등록" },
            { label: "주소", value: `${member.address}${member.addressDetail ? `, ${member.addressDetail}` : ""}`, span: 2 },
            { label: "구역 · 쉘", value: member.cellLabel },
            { label: "가족 구성", value: `${familyCount}명 연결` },
          ]}
        />
        {member.memo ? (
          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
            <p className="mb-1 text-[10px] font-semibold text-[#55697f]">관리자 비공개 메모</p>
            <p className="text-[12px] leading-relaxed text-[#5d6f86]">{member.memo}</p>
          </div>
        ) : null}
      </InfoSection>

      <InfoSection title="신앙 정보">
        <InfoGrid
          items={[
            { label: "신앙 레벨", value: `Lv${STAGE_META[member.faithStage].lv} ${STAGE_META[member.faithStage].label}` },
            { label: "직분", value: OFFICE_LABEL[member.office] },
            { label: "고백일", value: faith?.confessDate ?? "미기록" },
            { label: "학습일", value: faith?.learningDate ?? "미기록" },
            { label: "세례일", value: faith?.baptismDate ?? "미기록" },
            { label: "세례 장소", value: faith?.baptismPlace ?? "미기록" },
            { label: "집례자", value: faith?.baptismOfficiant ?? "미기록" },
            { label: "이전 교회", value: faith?.previousChurch ?? "미기록" },
          ]}
        />
        {faith?.ministryTags?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {faith.ministryTags.map((tag) => (
              <span key={tag} className="rounded-md bg-amber-50 px-2.5 py-1 text-[12px] text-amber-800">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </InfoSection>
    </div>
  );
}

function FamilyTab({ family }: { family: (typeof MOCK_FAMILY)[string] }) {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe4f0] bg-gradient-to-br from-purple-50/40 to-white px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#55697f]">세대 요약</p>
            <p className="text-[15px] font-bold text-[#0f1c2e]">
              연결 가족 {family.length}명
            </p>
          </div>
          <button className="h-8 rounded-lg border border-[#bfd0ea] bg-[#edf4ff] px-3 text-[11px] font-semibold text-[#2d5da8]">
            + 가족 추가
          </button>
        </div>
      </section>

      <div className="space-y-2">
        {family.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border p-4 ${item.isLinked ? "border-[#e2e8f0] bg-white" : "border-dashed border-[#d5deea] bg-[#fafcff]"}`}
          >
            <div className="flex items-start gap-4">
              {item.isLinked ? (
                <Avatar initial={item.initial} grad={item.avatarGrad} />
              ) : (
                <div className="flex h-12 w-9 items-center justify-center rounded-md bg-[#e2e8f0] text-sm font-bold text-[#8fa3bb]">?</div>
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-bold text-[#0f1c2e]">{item.name}</span>
                  {item.isHead ? <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">세대주</span> : null}
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                    {RELATION_LABEL[item.relation]}
                  </span>
                  {item.office ? <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">{OFFICE_LABEL[item.office]}</span> : null}
                  {!item.isLinked ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">교적 미등록</span> : null}
                </div>
                <p className="mt-1 text-[12px] text-[#55697f]">
                  {item.sex === "F" ? "여" : "남"}
                  {item.birthDate ? ` · ${item.birthDate}` : ""}
                  {item.phone ? ` · ${item.phone}` : ""}
                  {item.age ? ` · ${item.age}세` : ""}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {item.status ? <StatusBadge status={item.status} /> : null}
                  {item.faithStage ? <StageBadge stage={item.faithStage} /> : null}
                  {item.groupNote ? <span className="text-[11px] text-[#8fa3bb]">· {item.groupNote}</span> : null}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button className="text-[11px] font-semibold text-[#3f74c7]">교적 보기</button>
                <button className="text-[11px] text-[#8fa3bb]">연결 해제</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceTab({ service }: { service?: (typeof MOCK_SERVICES)[string] }) {
  if (!service) {
    return <EmptyState title="봉사 정보가 없습니다." />;
  }

  return (
    <div className="space-y-6">
      <InfoSection title={`현재 봉사 (${service.active.length})`}>
        <div className="space-y-2">
          {service.active.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-bold text-[#0f1c2e]">{item.department}</span>
                    <span className="text-[#cbd5e1]">·</span>
                    <span className="text-[13px] text-[#55697f]">{item.role}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#8fa3bb]">시작일 {item.startedAt}</p>
                  {item.schedule ? <p className="mt-1 text-[12px] text-[#5d6f86]">{item.schedule}</p> : null}
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  진행중
                </span>
              </div>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title={`과거 봉사 (${service.past.length})`}>
        <div className="space-y-2">
          {service.past.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#e2e8f0] bg-[#fafcff] p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[13px] font-semibold text-[#55697f]">{item.department}</span>
                  <span className="ml-2 text-[11px] text-[#8fa3bb]">{item.role}</span>
                </div>
                <span className="text-[11px] text-[#8fa3bb]">
                  {item.startedAt} ~ {item.endedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="은사 · 달란트">
        <div className="flex flex-wrap gap-1.5">
          {service.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-amber-50 px-2.5 py-1 text-[12px] text-amber-800">
              {tag}
            </span>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="교육 이수">
        <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
          {service.trainings.map((training, index) => (
            <div
              key={training.id}
              className={`flex items-center justify-between px-4 py-3 ${index > 0 ? "border-t border-[#f0f4f8]" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-[#8fa3bb]">{training.year}</span>
                <span className="text-[13px] font-semibold text-[#0f1c2e]">{training.programName}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">수료</span>
              </div>
              <span className="text-[11px] text-[#8fa3bb]">{training.completedAt}</span>
            </div>
          ))}
        </div>
      </InfoSection>
    </div>
  );
}

function HistoryTab({ events }: { events: MemberEvent[] }) {
  if (!events.length) {
    return <EmptyState title="이력 정보가 없습니다." />;
  }

  const groups = events.reduce<Record<string, MemberEvent[]>>((acc, event) => {
    const bucket = formatMonthBucket(event.occurredAt);
    acc[bucket] = [...(acc[bucket] ?? []), event];
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#dbe4f0] bg-[#fafcff] px-4 py-3 text-[11px] text-[#8fa3bb]">
        <span>시스템 자동 기록 중심 타임라인</span>
        <span>·</span>
        <span>등록, 상태/레벨/직분, 주소, 봉사, 교육 변동 내역</span>
      </section>

      <div className="relative pl-6">
        <div className="absolute bottom-2 left-[11px] top-2 w-px bg-[#e2e8f0]" />
        {Object.entries(groups).map(([bucket, bucketEvents]) => (
          <div key={bucket} className="mb-6">
            <p className="mb-2 -ml-6 text-[11px] font-bold text-[#55697f]">{bucket}</p>
            <div className="space-y-3">
              {bucketEvents.map((event) => (
                <div key={event.id} className="relative">
                  <div className={`absolute -left-[17px] top-1 h-3 w-3 rounded-full ${event.dotColor} ring-4 ${event.ringColor}`} />
                  <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${event.badgeColor}`}>
                          {event.badgeLabel}
                        </span>
                        <span className="text-[13px] font-semibold text-[#0f1c2e]">{event.title}</span>
                      </div>
                      <span className="text-[11px] text-[#8fa3bb]">{event.occurredAt}</span>
                    </div>
                    {event.detail ? <p className="mt-1 text-[11px] text-[#6d7f95]">{event.detail}</p> : null}
                    {event.diff ? (
                      <div className="mt-2 rounded bg-[#f8fafc] px-3 py-2 text-[11px] font-mono">
                        <p className="text-[#8fa3bb]">- {event.diff.before}</p>
                        <p className="text-[#0f1c2e]">+ {event.diff.after}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-[13px] font-bold text-[#0f1c2e]">
        <span className="h-4 w-1 rounded bg-[#3f74c7]" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function InfoGrid({
  items,
}: {
  items: Array<{ label: string; value: string; span?: 1 | 2 }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className={`flex flex-col gap-1 ${item.span === 2 ? "col-span-2" : ""}`}>
          <span className="text-[11px] text-[#8fa3bb]">{item.label}</span>
          <span className="text-[13px] text-[#0f1c2e]">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d5deea] bg-[#fafcff] px-4 py-6 text-center text-[12px] text-[#8fa3bb]">
      {title}
    </div>
  );
}
