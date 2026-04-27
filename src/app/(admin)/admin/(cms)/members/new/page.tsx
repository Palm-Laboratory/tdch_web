import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import AdminBreadcrumb from "../../components/admin-breadcrumb";
import { createAdminMemberAction } from "../actions";
import { MOCK_CELLS } from "../_components/mock-data";

export default async function AdminMembersNewPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/members/new");
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: "교회 관리" },
          { label: "교적부 관리", href: "/admin/members" },
          { label: "새 교인 등록" },
        ]}
      />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0f1c2e]">새 교인 등록</h1>
          <p className="mt-1 text-[12px] text-[#6d7f95]">
            Phase 1 범위의 신규 등록 흐름을 미리보기 수준으로 연결했습니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/members"
            className="inline-flex h-9 items-center rounded-lg border border-[#d5deea] bg-white px-4 text-[12px] font-medium text-[#55697f]"
          >
            취소
          </Link>
          <button className="h-9 rounded-lg border border-[#bfd0ea] bg-[#edf4ff] px-4 text-[12px] font-semibold text-[#2d5da8]">
            임시 저장
          </button>
          <button className="h-9 rounded-lg bg-[#3f74c7] px-5 text-[13px] font-semibold text-white">
            등록
          </button>
        </div>
      </div>

      <form action={createAdminMemberAction} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-5 rounded-3xl border border-[#dbe4f0] bg-white p-6 shadow-sm">
          <SectionTitle title="인적사항" />
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="name" label="이름" placeholder="예: 김은혜" />
            <Input name="nameEn" label="영문 이름" placeholder="예: Kim Eunhye" />
            <Input name="baptismName" label="세례명" placeholder="예: 안나" />
            <Select name="sex" label="성별" options={[{ label: "여", value: "F" }, { label: "남", value: "M" }]} />
            <Input name="birthDate" label="생년월일" type="date" />
            <Select name="birthCalendar" label="달력 구분" options={[{ label: "양력", value: "SOLAR" }, { label: "음력", value: "LUNAR" }]} />
            <Input name="phone" label="연락처" placeholder="010-0000-0000" />
            <Input name="emergencyPhone" label="비상 연락망" placeholder="010-0000-0000" />
            <Input name="emergencyRelation" label="비상 연락 관계" placeholder="예: 배우자" />
            <Input name="email" label="이메일" placeholder="example@tdch.co.kr" />
            <Input name="job" label="직업" placeholder="예: 초등학교 교사" />
            <div className="md:col-span-2">
              <Input name="address" label="주소" placeholder="카카오 주소 검색 연동 예정" />
            </div>
            <div className="md:col-span-2">
              <Input name="addressDetail" label="상세주소" placeholder="101동 1502호" />
            </div>
            <div>
              <Select
                name="cellId"
                label="공동체 ID(임시 참조)"
                options={[{ label: "선택", value: "" }, ...MOCK_CELLS.map((cell) => ({ label: cell.id, value: cell.id }))]}
              />
              <input type="hidden" name="cellLabel" value="" />
            </div>
            <Select
              name="status"
              label="상태"
              options={[
                { label: "새가족", value: "NEW" },
                { label: "출석", value: "ACTIVE" },
                { label: "쉼", value: "RESTING" },
                { label: "장결", value: "LONG_ABSENT" },
                { label: "이명", value: "TRANSFERRED_OUT" },
                { label: "소천", value: "DECEASED" },
                { label: "제적", value: "REMOVED" },
              ]}
            />
            <Select
              name="faithStage"
              label="신앙 레벨"
              options={[
                { label: "Lv1 새가족", value: "NEW_COMER" },
                { label: "Lv0 구도자", value: "SEEKER" },
                { label: "Lv2 정착교인", value: "SETTLED" },
                { label: "Lv3 양육교인", value: "GROWING" },
                { label: "Lv4 제자", value: "DISCIPLE" },
                { label: "Lv5 사역자", value: "MINISTER" },
                { label: "Lv6 리더", value: "LEADER" },
              ]}
            />
            <Select
              name="office"
              label="직분"
              options={[
                { label: "평신도", value: "LAY" },
                { label: "서리집사", value: "DEACON_TEMP" },
                { label: "안수집사", value: "DEACON" },
                { label: "권사", value: "GWONSA" },
                { label: "장로", value: "ELDER" },
                { label: "원로장로", value: "ELDER_EMERITUS" },
                { label: "전도사", value: "EVANGELIST" },
                { label: "목사", value: "PASTOR" },
              ]}
            />
            <Input name="officeAppointedAt" label="직분 임명일" type="date" />
            <Input name="registeredAt" label="등록일" type="date" />
          </div>

          <SectionTitle title="신앙 정보" />
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="confessDate" label="고백일" type="date" />
            <Input name="learningDate" label="학습일" type="date" />
            <Input name="baptismDate" label="세례일" type="date" />
            <Input name="confirmationDate" label="입교일" type="date" />
            <Input name="baptismPlace" label="세례 장소" placeholder="예: 더제자교회" />
            <Input name="baptismOfficiant" label="집례자" placeholder="예: 김○○ 담임목사" />
            <Input name="previousChurch" label="이전 교회" placeholder="예: 사랑교회" />
            <Input name="transferredInAt" label="이명 전입일" type="date" />
          </div>

          <SectionTitle title="관리 메모" />
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold text-[#55697f]">
              비공개 메모
            </span>
            <textarea
              name="memo"
              rows={5}
              className="w-full rounded-xl border border-[#d5deea] px-3 py-2.5 text-[13px] text-[#0f1c2e] outline-none transition focus:border-[#3f74c7]"
              placeholder="새가족 심방 일정, 양육 요청사항 등을 기록"
            />
          </label>
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-[#dbe4f0] bg-white p-5 shadow-sm">
            <p className="text-[11px] font-semibold text-[#55697f]">등록 체크리스트</p>
            <ul className="mt-3 space-y-2 text-[12px] text-[#5d6f86]">
              <li>이름, 연락처, 생년월일은 필수입니다.</li>
              <li>상태 기본값은 `새가족`, 신앙 레벨 기본값은 `Lv1` 입니다.</li>
              <li>공동체 값은 별도 `구역/쉘 관리` 모듈 확정 전까지 임시 참조값입니다.</li>
              <li>등록 완료 시 시스템 이력에 `REGISTERED` 이벤트가 남습니다.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-[#dbe4f0] bg-gradient-to-br from-[#edf4ff] to-white p-5 shadow-sm">
            <p className="text-[11px] font-semibold text-[#55697f]">후속 구현 메모</p>
            <ul className="mt-3 space-y-2 text-[12px] text-[#5d6f86]">
              <li>증명사진 업로드 토큰 연동</li>
              <li>주소 검색 API 연동</li>
              <li>서버 액션 또는 API POST 연결</li>
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-4 w-1 rounded bg-[#3f74c7]" />
      <h2 className="text-[13px] font-bold text-[#0f1c2e]">{title}</h2>
    </div>
  );
}

function Input({
  name,
  label,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-[#55697f]">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-[#d5deea] px-3 text-[13px] text-[#0f1c2e] outline-none transition focus:border-[#3f74c7]"
      />
    </label>
  );
}

function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-[#55697f]">{label}</span>
      <select name={name} className="h-10 w-full rounded-xl border border-[#d5deea] bg-white px-3 text-[13px] text-[#0f1c2e] outline-none transition focus:border-[#3f74c7]">
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
