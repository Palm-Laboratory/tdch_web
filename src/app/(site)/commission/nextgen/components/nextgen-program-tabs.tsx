"use client";

import { useState } from "react";
import { cormorantGaramond } from "@/lib/fonts";

type ProgramSection = {
  label: string;
  items: string[];
};

type ProgramTab = {
  key: string;
  title: string;
  ageLabel: string;
  ageParts: string[];
  description: string;
  descriptionClassName?: string;
  sections: ProgramSection[];
};

const tabs: ProgramTab[] = [
  {
    key: "infant",
    title: "영유아부",
    ageLabel: "0-7세",
    ageParts: ["0", "~", "7", "세"],
    description: "신앙의 씨앗을 심는 시기",
    sections: [
      { label: "목표", items: ["하나님 사랑 경험", "예배의 기쁨", "기도 습관"] },
      { label: "프로그램", items: ["주일 예배", "부모 교육", "성경 암송"] },
      { label: "교재", items: ["성경 이야기 책", "찬양 율동", "가정 예배 가이드"] },
    ],
  },
  {
    key: "children",
    title: "유년부",
    ageLabel: "초등 1-3학년",
    ageParts: ["초등", "1", "~", "3", "학년"],
    description: "신앙의 기초를 다지는 시기",
    sections: [
      { label: "목표", items: ["성경 이야기 익히기", "기도 생활 시작", "교회 사랑"] },
      { label: "프로그램", items: ["주일 예배 및 공과", "성경 암송 대회", "여름·겨울 성경학교", "가족 캠프"] },
      { label: "특별 활동", items: ["찬양팀", "성극", "성경 퀴즈 대회"] },
    ],
  },
  {
    key: "elementary",
    title: "소년부",
    ageLabel: "초등 4-6학년",
    ageParts: ["초등", "4", "~", "6", "학년"],
    description: "신앙의 정체성을 세우는 시기",
    descriptionClassName: "md:whitespace-nowrap",
    sections: [
      { label: "목표", items: ["구원의 확신", "말씀 묵상 습관", "전도 경험"] },
      { label: "프로그램", items: ["주일 예배 및 제자훈련", "QT 훈련", "전도 훈련 (3분 복음)", "리더십 캠프"] },
      { label: "침례 준비", items: ["새가족 양육(어린이용)", "침례 교육", "침례식"] },
    ],
  },
  {
    key: "middle",
    title: "중등부",
    ageLabel: "중등 1-3학년",
    ageParts: ["중등", "1", "~", "3", "학년"],
    description: "신앙의 도전을 이기는 시기",
    sections: [
      { label: "목표", items: ["확고한 신앙 정체성", "말씀 기반 세계관", "또래 제자 양육"] },
      { label: "프로그램", items: ["중등 제자훈련 1-3단계", "또래 멘토링", "수련회 및 MT"] },
      { label: "특별 사역", items: ["찬양팀 (밴드·보컬)", "미디어팀", "전도팀"] },
    ],
  },
  {
    key: "high",
    title: "고등부",
    ageLabel: "고등 1-3학년",
    ageParts: ["고등", "1", "~", "3", "학년"],
    description: "신앙의 사명을 발견하는 시기",
    descriptionClassName: "md:whitespace-nowrap",
    sections: [
      { label: "목표", items: ["평생 신앙 다짐", "소명 발견", "리더십 개발"] },
      { label: "프로그램", items: ["고등 제자훈련", "리더 양성 과정", "대학 준비 과정", "단기 선교 참여"] },
      { label: "졸업 후", items: ["대학생부 연결", "평생 제자 서약", "멘토링 지속"] },
    ],
  },
  {
    key: "young-adult",
    title: "대학·청년부",
    ageLabel: "20-30대",
    ageParts: ["20", "~", "30", "대"],
    description: "신앙의 리더로 서는 시기",
    sections: [
      { label: "목표", items: ["독립적 신앙 생활", "캠퍼스 제자 양육", "사회 선교"] },
      { label: "프로그램", items: ["대학생 제자훈련", "캠퍼스 선교 동아리", "직장인 멘토링"] },
      { label: "특별 사역", items: ["주일학교 교사", "제자훈련 리더", "창업·진로 네트워크"] },
    ],
  },
];

function AgeLabel({ ageParts }: { ageParts: string[] }) {
  if (ageParts.length === 4) {
    return (
      <div className="flex items-start gap-2 text-[#c9a84c]">
        <span className={`${cormorantGaramond.className} text-[18px] leading-none tracking-[0.08em]`}>
          {ageParts[0]}
        </span>
        <span className="pt-0.5 text-[13px]">{ageParts[1]}</span>
        <span className={`${cormorantGaramond.className} text-[18px] leading-none tracking-[0.08em]`}>
          {ageParts[2]}
        </span>
        <span className="pt-[2px] font-['Nanum_Myeongjo',serif] text-[12px]">{ageParts[3]}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-1.5 text-[#c9a84c]">
      <span className="pt-[1px] font-['Nanum_Myeongjo',serif] text-[12px]">{ageParts[0]}</span>
      <span className={`${cormorantGaramond.className} text-[18px] leading-none tracking-[0.08em]`}>{ageParts[1]}</span>
      <span className="pt-0.5 text-[13px]">{ageParts[2]}</span>
      <span className={`${cormorantGaramond.className} text-[18px] leading-none tracking-[0.08em]`}>{ageParts[3]}</span>
      <span className="pt-[1px] font-['Nanum_Myeongjo',serif] text-[12px]">{ageParts[4]}</span>
    </div>
  );
}

export default function NextgenProgramTabs() {
  const [activeKey, setActiveKey] = useState<string>(tabs[0].key);
  const activeTab = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];

  return (
    <div className="mt-8">
      <div className="border-b-2 border-[#d0cdca]">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {tabs.map((tab) => {
            const isActive = tab.key === activeKey;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveKey(tab.key)}
                className={`type-body-small border-b-2 px-1 pb-4 font-bold tracking-[0.04em] transition ${
                  isActive ? "border-[#0f2044] text-[#0f2044]" : "border-transparent text-[#888580]"
                }`}
                aria-pressed={isActive}
              >
                {tab.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 pb-8 flex flex-col gap-10 md:flex-row md:items-start md:gap-[68px]">
        <div className="md:w-[180px] md:shrink-0">
          <AgeLabel ageParts={activeTab.ageParts} />
          <h3 className="mt-4 type-subsection-title font-section-title font-extrabold tracking-[0.02em] text-black">
            {activeTab.title}
          </h3>
          <p
            className={`type-body-small mt-4 whitespace-pre-line leading-5 tracking-[0.04em] text-[#888580] ${activeTab.descriptionClassName ?? ""}`}
          >
            &quot;{activeTab.description}&quot;
          </p>
        </div>

        <div className={`grid flex-1 gap-8 ${activeTab.sections.length >= 3 ? "md:grid-cols-3 md:gap-10" : "md:grid-cols-2 md:gap-12"}`}>
          {activeTab.sections.map((section) => (
            <div key={section.label}>
              <p className="type-label font-medium tracking-[0.08em] text-[#c9a84c]">{section.label}</p>
              <div className="mt-3 space-y-3">
                {section.items.map((item) => (
                  <div key={item} className="type-body-small flex items-start gap-2 tracking-[0.04em]">
                    <span className="pt-[2px] text-[#888580]">·</span>
                    <span className="leading-[1.45] text-[#4a4845]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
