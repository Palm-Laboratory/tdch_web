"use client";

import { useState } from "react";

type TabKey =
  | "korean-education"
  | "multicultural-worship"
  | "gospel-outreach"
  | "life-support"
  | "child-education"
  | "cultural-exchange";

const tabLabels: { key: TabKey; label: string }[] = [
  { key: "korean-education", label: "한국어 교육" },
  { key: "multicultural-worship", label: "다문화 예배" },
  { key: "gospel-outreach", label: "복음 전도" },
  { key: "life-support", label: "생활 지원" },
  { key: "child-education", label: "자녀 교육" },
  { key: "cultural-exchange", label: "문화 교류" },
];

type KoreanEducationCourse = {
  level: string;
  title: string;
  details: readonly (readonly [string, string])[];
  highlighted?: boolean;
};

const koreanEducationCourses: readonly KoreanEducationCourse[] = [
  {
    level: "초급반",
    title: "한글 읽기·쓰기",
    details: [
      ["대상", "한글을 모르는 분"],
      ["기간", "3개월 (주 2회)"],
      ["내용", "한글 자모, 기본 단어"],
      ["교재", "무료 제공"],
    ],
  },
  {
    level: "중급반",
    title: "일상 회화",
    details: [
      ["대상", "기본 한글을 아는 분"],
      ["기간", "6개월 (주 2회)"],
      ["내용", "생활 회화, 현장 학습"],
      ["교재", "무료 제공"],
    ],
    highlighted: true,
  },
  {
    level: "고급반",
    title: "한국 문화 이해",
    details: [
      ["대상", "회화 가능한 분"],
      ["기간", "6개월 (주 1회)"],
      ["내용", "문화·예절·역사, 체험"],
      ["교재", "무료 제공"],
    ],
  },
] as const;

const worshipInfo = [
  ["일정", "매월 마지막 주 주일 오후 3시"],
  ["찬양", "다국어 찬양 (한국어, 영어, 각국 언어)"],
  ["통역", "필리핀어 등 다국어 통역 제공"],
  ["교제", "다문화 가정 간증 · 각국 음식 친교"],
] as const;

const worshipScheduleCards = [
  ["설날", "음력 1월 1일"],
  ["추석", "음력 8월 15일"],
  ["성탄절", "12월 25일"],
] as const;

const gospelRows = [
  ["3분 복음", "각국 언어로 번역 · 문화적 맥락을 고려한 쉽게 이해하는 복음 제시"],
  ["새가족 양육", "모국어 교재 제공 · 통역 지원 · 천천히, 반복해서 진행"],
  ["침례", "철저한 준비 · 가족 초청 · 기념 사진"],
] as const;

const lifeSupportColumns = [
  {
    title: "상담 서비스",
    items: ["법률 상담 (비자·체류·귀화)", "가정 상담 (부부·자녀 양육)", "진로 상담 (취업·창업)"],
  },
  {
    title: "실제적 도움",
    items: ["병원 동행", "관공서 서류 작성 돕기", "통역 지원", "긴급 지원 (식료품·의류)"],
  },
  {
    title: "네트워크",
    items: ["다문화 가정 모임 (월 1회)", "정보 공유 · 서로 돕기", "멘토-멘티 연결"],
  },
] as const;

const childEducationColumns = [
  {
    title: "방과 후 교실",
    items: ["한국어 지도", "숙제 도움", "멘토링"],
  },
  {
    title: "이중 언어 교육",
    items: ["한국어 + 부모 모국어", "문화 정체성 확립", "강점으로 개발"],
  },
  {
    title: "진로 지도",
    items: ["진학 상담", "장학금 안내", "직업 탐색"],
  },
] as const;

const festivalItems = ["각국 전통 의상 패션쇼", "각국 전통 음식 나눔", "전통 공연 (노래, 춤)", "문화 체험 부스 · 사진 전시"] as const;
const gatheringItems = ["각국 요리 교실 (월 1회)", "언어 교환 (Language Exchange)", "함께 여행 (연 1-2회)"] as const;
const cultureExperiences = ["한복 입기", "김치 담그기", "전통 차 마시기", "한국 명절 체험"] as const;

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`type-body-small border-b-2 px-1 pb-4 font-bold tracking-[0.04em] transition ${
        active ? "border-[#0f2044] text-[#0f2044]" : "border-transparent text-[#888580]"
      }`}
    >
      {label}
    </button>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item} className="type-body-small flex items-start gap-2 tracking-[0.02em] text-[#4a4845]">
          <span className="pt-1 text-[#888580]">·</span>
          <span className="leading-[1.65]">{item}</span>
        </div>
      ))}
    </div>
  );
}

function KoreanEducationPanel() {
  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[12px] border border-[#d0cdca] md:grid md:grid-cols-3">
        {koreanEducationCourses.map((course, index) => (
          <article
            key={course.level}
            className={`px-5 py-6 ${course.highlighted ? "bg-[#f8f7f4]" : "bg-white"} ${
              index < koreanEducationCourses.length - 1 ? "border-b border-[#d0cdca] md:border-b-0 md:border-r" : ""
            }`}
          >
            <p className="type-label font-bold tracking-[0.08em] text-[#c9a84c]">{course.level}</p>
            <h3 className="mt-4 type-card-title font-section-title font-bold tracking-[0.02em] text-[#0f2044]">{course.title}</h3>
            <div className="mt-4 space-y-2 type-body-small tracking-[0.02em] text-[#4a4845]">
              {course.details.map(([label, value]) => (
                <p key={label} className="leading-[1.65]">
                  <span className="text-[#888580]">{label}</span> {value}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-[8px] bg-[#f8f7f4] px-5 py-5 md:flex md:items-center md:gap-12">
        <div className="type-body flex items-center gap-3 tracking-[0.02em] text-[#888580]">
          <span className="font-bold text-[#1a2744]">화요일</span>
          <span>오전 10-12시 (주부반)</span>
        </div>
        <div className="type-body mt-3 flex items-center gap-3 tracking-[0.02em] text-[#888580] md:mt-0">
          <span className="font-bold text-[#1a2744]">토요일</span>
          <span>오후 2-4시 (주말반)</span>
        </div>
      </div>
    </div>
  );
}

function MulticulturalWorshipPanel() {
  return (
    <div className="grid gap-8 md:grid-cols-[1.08fr_0.92fr] md:gap-8">
      <div>
        <p className="type-label font-medium tracking-[0.08em] text-[#c9a84c]">정기 예배</p>
        <div className="mt-5 space-y-0">
          {worshipInfo.map(([label, value], index) => (
            <div
              key={label}
              className={`py-5 ${index === 0 ? "border-t border-[#d0cdca]" : "border-t border-[#f2f0ec]"}`}
            >
              <p className="type-body-small font-bold tracking-[0.08em] text-[#1a2744]">{label}</p>
              <p className="type-body mt-2 leading-[1.7] tracking-[0.02em] text-[#4a4845]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="type-label font-medium tracking-[0.08em] text-[#c9a84c]">특별 예배</p>
        <div className="mt-5 space-y-3">
          {worshipScheduleCards.map(([title, date], index) => (
            <div
              key={`${title}-${date}-${index}`}
              className="type-body flex items-center justify-between rounded-[8px] bg-[#f8f7f4] px-5 py-[18px] tracking-[0.02em] text-[#888580]"
            >
              <span className="font-bold text-[#1a2744]">{title}</span>
              <span>{date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GospelOutreachPanel() {
  return (
    <div className="divide-y divide-[#d0cdca]">
      {gospelRows.map(([title, description], index) => (
        <div
          key={title}
          className={`flex flex-col gap-3 pb-6 md:flex-row md:items-start md:gap-10 ${
            index === 0 ? "pt-0" : "pt-6"
          }`}
        >
          <div className="md:w-[180px] md:shrink-0">
            <h3 className="type-card-title font-section-title font-bold tracking-[0.02em] text-[#0f2044]">{title}</h3>
          </div>
          <p className="type-body leading-[1.75] tracking-[0.02em] text-[#888580]">{description}</p>
        </div>
      ))}
    </div>
  );
}

function ColumnPanel({
  columns,
}: {
  columns: ReadonlyArray<{ title: string; items: readonly string[] }>;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-3 md:gap-10">
      {columns.map((column) => (
        <div key={column.title}>
          <p className="type-label font-medium tracking-[0.08em] text-[#c9a84c]">{column.title}</p>
          <div className="mt-4">
            <BulletList items={column.items} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CulturalExchangePanel() {
  return (
    <div className="grid gap-8 md:grid-cols-[0.92fr_1.08fr] md:gap-10">
      <div className="space-y-8">
        <div>
          <p className="type-label font-medium tracking-[0.08em] text-[#c9a84c]">다문화 축제 (연 1회)</p>
          <div className="mt-4">
            <BulletList items={festivalItems} />
          </div>
        </div>

        <div>
          <p className="type-label font-medium tracking-[0.08em] text-[#c9a84c]">정기 모임</p>
          <div className="mt-4">
            <BulletList items={gatheringItems} />
          </div>
        </div>
      </div>

      <div>
        <p className="type-label font-medium tracking-[0.08em] text-[#c9a84c]">한국 문화 체험</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {cultureExperiences.map((item) => (
            <div
              key={item}
              className="type-body flex items-center justify-center rounded-[8px] bg-[#f8f7f4] px-5 py-4 text-center font-bold tracking-[0.02em] text-[#0f2044]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MulticulturalProgramTabs() {
  const [activeKey, setActiveKey] = useState<TabKey>("korean-education");

  return (
    <div className="mt-8">
      <div className="border-b-2 border-[#d0cdca]">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {tabLabels.map((tab) => (
            <TabButton
              key={tab.key}
              active={tab.key === activeKey}
              label={tab.label}
              onClick={() => setActiveKey(tab.key)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 pb-8">
        {activeKey === "korean-education" ? <KoreanEducationPanel /> : null}
        {activeKey === "multicultural-worship" ? <MulticulturalWorshipPanel /> : null}
        {activeKey === "gospel-outreach" ? <GospelOutreachPanel /> : null}
        {activeKey === "life-support" ? <ColumnPanel columns={lifeSupportColumns} /> : null}
        {activeKey === "child-education" ? <ColumnPanel columns={childEducationColumns} /> : null}
        {activeKey === "cultural-exchange" ? <CulturalExchangePanel /> : null}
      </div>
    </div>
  );
}
