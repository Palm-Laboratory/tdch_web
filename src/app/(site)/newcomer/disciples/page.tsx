import { Cormorant_Garamond } from "next/font/google";
import type { Metadata } from "next";
import DisciplesApplicationForm from "./components/disciples-application-form";
import DisciplesCurriculum from "./components/disciples-curriculum";
import DisciplesRoadmap from "./components/disciples-roadmap";
import Breadcrumb from "@/components/breadcrumb";
import PageHeader from "@/components/page-header";
import SectionHeading from "@/components/section-heading";
import { createPageMetadata } from "@/lib/seo";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const discipleshipPrinciples = [
  {
    number: "01",
    englishTitle: "Repitition",
    title: "반복",
    details: ["168회 이상 반복 노출", "듣기 → 암송 → 묵상 → 나눔 → 가르침", "완전 내재화"],
  },
  {
    number: "02",
    englishTitle: "Concentration",
    title: "집중",
    details: ["소수 정예 (2-3명)", "1시간 기도 + 성경공부", "한 주제에 깊이 있게"],
  },
  {
    number: "03",
    englishTitle: "Realization",
    title: "실현 / 나눔",
    details: ["배운 것을 즉시 실천", "다른 사람에게 나눔", "가르치는 자가 가장 많이 배움"],
  },
] as const;

const roadmapItems = [
  {
    kind: "newcomer",
    label: "NEWCOMER",
    duration: "5주",
    title: "새가족 과정",
    tags: ["새가족 안내", "새가족 양육", "제자 훈련"],
    activeTagIndex: 2,
  },
  {
    kind: "step",
    number: "01",
    label: "STEP 1",
    duration: "12주",
    title: "믿음의 기초",
    details: ["구원의 확신", "기본 신앙생활", "영적 전쟁"],
  },
  {
    kind: "step",
    number: "02",
    label: "STEP 2",
    duration: "12주",
    title: "신앙 성장",
    details: ["개인 영역", "가정 영역", "교회 영역"],
    badge: "+ 1단계 리더 섬김",
  },
  {
    kind: "step",
    number: "03",
    label: "STEP 3",
    duration: "12주",
    title: "신앙 성숙",
    details: ["사회 영역", "민족 영역", "세상 영역"],
    badge: "+ 2단계 리더 섬김",
  },
  {
    kind: "goal",
    title: "사역자 / 평생 제자",
  },
] as const;

const curriculumStages = [
  {
    level: "1단계",
    title: "믿음의 기초",
    duration: "12주",
    target: "침례 받은 새신자",
    objective: "구원의 확신과 기본 신앙생활 확립",
    courses: [
      { week: "01", title: "하나님은 어떤 분이신가?" },
      { week: "02", title: "거듭남 - 새로운 피조물" },
      { week: "03", title: "성경 - 하나님의 말씀" },
      { week: "04", title: "기도 - 하나님과의 대화" },
      { week: "05", title: "예배 - 하나님을 만나는 시간" },
      { week: "06", title: "교제 - 함께하는 믿음" },
      { week: "07", title: "성령 - 보혜사 하나님" },
      { week: "08", title: "순종 - 사랑의 증거" },
      { week: "09", title: "시험과 유혹" },
      { week: "10", title: "영적 전쟁" },
      { week: "11", title: "십일조와 헌금" },
      { week: "12", title: "제자의 삶 - 평생의 여정" },
    ],
    requirements: [
      "10주 이상 출석",
      "매주 과제 완수",
      "3분 복음 암송",
      "전도 대상자 3명 기도",
      "2단계 신청",
    ],
  },
  {
    level: "2단계",
    title: "신앙 성장",
    duration: "12주",
    target: "1단계 수료자",
    objective: "그리스도 안에서 균형 잡힌 성장",
    courses: [
      { week: "01", title: "예수님을 닮아가는 삶" },
      { week: "02", title: "영적 훈련 - 경건의 시간" },
      { week: "03", title: "청지기의 삶 (시간, 재능, 재물)" },
      { week: "04", title: "그리스도인의 가정 - 결혼과 부부" },
      { week: "05", title: "자녀 양육 - 신앙의 유산" },
      { week: "06", title: "부모 공경과 효도" },
      { week: "07", title: "형제자매 - 서로 사랑하라" },
      { week: "08", title: "은사 - 각자의 부름" },
      { week: "09", title: "섬김의 리더십" },
      { week: "10", title: "교회의 사명" },
      { week: "11", title: "갈등 해결과 화해" },
      { week: "12", title: "성장하는 제자" },
    ],
    requirements: [
      "10주 이상 출석",
      "매주 과제 완수",
      "경건의 시간 정착",
      "교회 섬김 참여",
      "1단계 리더 섬김",
      "3단계 신청",
    ],
  },
  {
    level: "3단계",
    title: "신앙 성숙",
    duration: "12주",
    target: "2단계 수료자",
    objective: "세상 속의 빛과 소금, 사명자",
    courses: [
      { week: "01", title: "빛과 소금 - 세상 속의 그리스도인" },
      { week: "02", title: "정직과 성실 - 일터에서의 신앙" },
      { week: "03", title: "공의와 정의 - 사회적 책임" },
      { week: "04", title: "문화 명령 - 창조 세계 돌보기" },
      { week: "05", title: "한국교회와 민족 복음화" },
      { week: "06", title: "다음 세대 - 신앙의 계승" },
      { week: "07", title: "다문화 가정과 이주민" },
      { week: "08", title: "북한 선교와 통일 준비" },
      { week: "09", title: "세계 선교의 비전" },
      { week: "10", title: "고난과 박해" },
      { week: "11", title: "재림과 영원" },
      { week: "12", title: "평생 제자도 - 세상 끝날까지 함께" },
    ],
    requirements: [
      "10주 이상 출석",
      "매주 과제 완수",
      "졸업 간증문 작성",
      "사회 선교 참여",
      "2단계 리더 섬김",
      "4세대 재생산 시작",
    ],
  },
] as const;

const multiplicationStages = [
  {
    year: "1년차",
    generation: "1",
    items: ["제자훈련 이수", "순종하는 삶"],
  },
  {
    year: "2년차",
    generation: "2",
    items: ["1단계 리더 섬김", "제자 2-3명 양육"],
  },
  {
    year: "3년차",
    generation: "3",
    items: ["2단계 리더 섬김", "3세대 4-6명 양육"],
    highlight: true,
  },
  {
    year: "4년차",
    generation: "4",
    items: ["3단계 리더 섬김", "기하급수적 확장"],
    highlight: true,
  },
] as const;

const annualSchedule = [
  ["1기", "1-3월"],
  ["2기", "4-6월"],
  ["3기", "7-9월"],
  ["4기", "10-12월"],
] as const;

const weeklySchedule = [
  ["월요일", "저녁 7-9시 (A그룹)"],
  ["화요일", "저녁 7-9시 (B그룹)"],
  ["수요일", "저녁 7-9시 (C그룹)"],
  ["목요일", "저녁 7-9시 (D그룹)"],
  ["금요일", "오전 10-12시 (E그룹)"],
] as const;

const applicationNotes = [
  "모든 교재 무료 제공",
  "이전 수료 과정 확인 후 단계 배정",
  "문의: 교육부 이진욱 목사",
] as const;

const applicationStages = [
  { id: "disciples-step-1", label: "1단계: 믿음의 기초 (12주)", defaultChecked: true },
  { id: "disciples-step-2", label: "2단계: 신앙 성장 (12주)" },
  { id: "disciples-step-3", label: "3단계: 신앙 성숙 (12주)" },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "제자 훈련",
  description: "The 제자교회 제자훈련 3단계 로드맵, 교육 과정, 재생산 시스템과 신청 안내 페이지입니다.",
  path: "/newcomer/disciples",
});

function PrincipleItem({
  number,
  englishTitle,
  title,
  details,
}: {
  number: string;
  englishTitle: string;
  title: string;
  details: readonly string[];
}) {
  return (
    <article className="flex gap-4 border-b border-black/10 py-6 first:pt-0 last:border-b-0 last:pb-0 md:gap-7 md:py-7">
      <div className="flex items-start pt-2">
        <span className={`${cormorantGaramond.className} text-[2rem] leading-none tracking-[0.08em] text-[#c9a84c] md:text-[2.25rem]`}>
          {number}
        </span>
      </div>

      <div className="border-l border-black/10 pl-4 md:pl-6">
        <p
          className={`${cormorantGaramond.className} type-body-small tracking-[0.12em] text-[#888580]`}
        >
          {englishTitle}
        </p>
        <h3 className="mt-2 type-body font-bold leading-none tracking-[0.02em] text-[#1a2744]">
          {title}
        </h3>
        <p className="mt-3 type-body-small leading-[1.7] tracking-[0.02em] text-[#7a7060]">
          {details.join(" · ")}
        </p>
      </div>
    </article>
  );
}

function GenerationCard({
  year,
  generation,
  items,
  highlight = false,
}: {
  year: string;
  generation: string;
  items: readonly string[];
  highlight?: boolean;
}) {
  return (
    <article className="flex flex-col items-center px-4 py-3 text-center md:px-6 md:py-4">
      <p className="type-label tracking-[0.08em] text-[#888580]">{year}</p>
      <div className="mt-3 flex items-end justify-center gap-1">
        <span
          className={`${cormorantGaramond.className} text-[2.75rem] leading-none tracking-[0.08em] ${highlight ? "text-[#c9a84c]" : "text-[#1a2744]"}`}
        >
          {generation}
        </span>
        <span className="pb-1 text-[1.125rem] tracking-[0.04em] text-[#888580]">세대</span>
      </div>
      <div className="mt-3 space-y-1">
        {items.map((item) => (
          <p key={item} className="type-label leading-[1.35] tracking-[0.02em] text-[#888580]">
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}

function ScheduleCard({
  title,
  items,
}: {
  title: string;
  items: readonly (readonly [string, string])[];
}) {
  return (
    <article className="rounded-[12px] bg-[#f8f7f4] p-6 md:p-8">
      <h3 className="type-card-title font-bold leading-none tracking-[0.02em] text-black">
        {title}
      </h3>
      <div className="mt-5">
        {items.map(([left, right]) => (
          <div
            key={`${left}-${right}`}
            className="flex items-center justify-between gap-6 border-b border-black/10 py-3"
          >
            <span className="type-body-small tracking-[0.02em] text-[#888580]">{left}</span>
            <span className="type-body-small font-semibold tracking-[0.02em] text-[#1a2744]">
              {right}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function NewcomerDisciplesPage() {
  return (
    <div className="flex w-full flex-col">
      <PageHeader
        title="제자 훈련"
        subtitle="DISCIPLESHIP"
        backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
      />
      <Breadcrumb />

      <main className="section-shell section-shell--narrow pt-12 pb-20 md:pt-16 md:pb-24">
        <section aria-labelledby="disciples-intro-title">
          <SectionHeading id="disciples-intro-title" label="Discipleship" title="제자훈련" />

          <blockquote className="mt-8 rounded-r-[12px] border-l-[3px] border-[#8c7a5b] bg-[#f7f7f4] px-6 py-7 md:px-7 md:py-8">
            <p className="type-body font-[var(--font-section-title)] leading-[1.9] tracking-[0.01em] text-[#1a2744]">
              &quot;또 네가 많은 증인 앞에서 내게 들은 바를 충성된 사람들에게 부탁하라
              그들이 또 다른 사람들을 가르칠 수 있으리라&quot;
            </p>
            <p className="mt-4 type-body-small font-medium tracking-[0.08em] text-[#7a7060]">
              디모데후서 2:2
            </p>
          </blockquote>
        </section>

        <section
          aria-labelledby="disciples-principles-title"
          className="mt-20 md:mt-[68px]"
        >
          <SectionHeading
            id="disciples-principles-title"
            label="Philosophy"
            title="제자훈련의 3대 원리"
          />

          <div className="mt-8">
            {discipleshipPrinciples.map((principle) => (
              <PrincipleItem key={principle.number} {...principle} />
            ))}
          </div>
        </section>

        <section aria-labelledby="disciples-roadmap-title" className="mt-20 md:mt-[68px]">
          <DisciplesRoadmap
            id="disciples-roadmap-title"
            items={roadmapItems}
            numberClassName={cormorantGaramond.className}
          />
        </section>

        <section
          aria-labelledby="disciples-curriculum-title"
          className="mt-20 md:mt-[68px]"
        >
          <SectionHeading
            id="disciples-curriculum-title"
            label="Curriculum"
            title="단계별 교육 과정"
          />

          <div className="mt-8">
            <DisciplesCurriculum
              stages={curriculumStages}
              weekNumberClassName={cormorantGaramond.className}
            />
          </div>
        </section>

        <section
          aria-labelledby="disciples-multiplication-title"
          className="mt-20 md:mt-[68px]"
        >
          <SectionHeading
            id="disciples-multiplication-title"
            label="Multiplication"
            title="4세대 재생산 시스템"
          />

          <div className="mt-8 overflow-hidden border-y border-black/10 py-5">
            <div className="grid grid-cols-2 gap-y-6 lg:grid-cols-4 lg:gap-y-0">
              {multiplicationStages.map((stage, index) => (
                <div
                  key={stage.year}
                  className={
                    index === 0
                      ? "border-b border-r border-black/10 lg:border-b-0"
                      : index === 1
                        ? "border-b border-black/10 lg:border-b-0 lg:border-r lg:border-black/10"
                        : index === 2
                          ? "border-r border-black/10 lg:border-r lg:border-black/10"
                          : ""
                  }
                >
                  <GenerationCard {...stage} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="disciples-schedule-title" className="mt-20 md:mt-[68px]">
          <SectionHeading
            id="disciples-schedule-title"
            label="Schedule"
            title="훈련 일정"
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-6">
            <ScheduleCard title="연간 일정" items={annualSchedule} />
            <ScheduleCard title="주간 일정" items={weeklySchedule} />
          </div>
        </section>

        <section
          id="apply"
          aria-labelledby="disciples-apply-title"
          className="mt-20 scroll-mt-32 md:mt-[68px] md:scroll-mt-36"
        >
          <div className="rounded-[12px] bg-[#1a2744] p-6 md:flex md:items-start md:justify-between md:gap-10 md:p-9">
            <div className="md:max-w-[320px] lg:max-w-[360px]">
              <SectionHeading
                id="disciples-apply-title"
                label="Apply"
                title="제자 훈련 신청"
                inverted
              />

              <ul className="mt-6 flex flex-col gap-3">
                {applicationNotes.map((note) => (
                  <li key={note} className="flex items-start gap-1 type-body tracking-[0.02em] text-white">
                    <span aria-hidden="true">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <DisciplesApplicationForm stageOptions={applicationStages} />
          </div>
        </section>
      </main>
    </div>
  );
}
