"use client";

import { useState } from "react";

type TabKey = "prayer" | "financial" | "short-term" | "hospitality";

type TextColumn = {
  title: string;
  lines?: string[];
  bullets?: string[];
};

type CalloutCard = {
  title: string;
  description: string;
};

type TabData = {
  label: string;
  columns?: TextColumn[];
  cards?: TextColumn[];
  callout?: CalloutCard;
  listRows?: Array<{ title: string; description: string }>;
};

const tabs: Record<TabKey, TabData> = {
  prayer: {
    label: "기도 선교",
    columns: [
      {
        title: "선교 기도회",
        lines: ["시간 매월 마지막 주 금요일 밤 8:30", "장소 교회 본당 (아트홀)"],
        bullets: ["선교사 기도", "선교지 기도", "미전도 종족 기도", "선교 헌신자 기도"],
      },
      {
        title: "선교 기도 수집",
        bullets: ["매월 발행", "선교사 소식 · 기도 제목", "선교지 정보"],
      },
      {
        title: "입양 선교사 제도",
        bullets: ["가정/소그룹이 선교사 1명 입양", "정기 기도 · 정기 편지", "정기 후원"],
      },
    ],
  },
  financial: {
    label: "재정 선교",
    columns: [
      {
        title: "선교 헌금",
        bullets: ["매월 넷째 주일 선교 주일", "선교 헌금 (상시)", "생일/기념일 헌금"],
      },
      {
        title: "선교비 사용",
        bullets: ["선교사 생활비 지원", "사역비 지원", "단기 선교 지원"],
      },
      {
        title: "투명한 회계",
        bullets: ["분기별 보고", "선교사 영수증", "감사 제도"],
      },
    ],
  },
  "short-term": {
    label: "단기 선교",
    cards: [
      {
        title: "필리핀 단기 선교",
        lines: ["시기 여름 (7-8월) · 겨울(1-2월)", "기간 1주일", "대상 중고등부 · 청년부 · 장년", "사역 VBS · 의료 봉사 · 건축 봉사 · 전도 집회", "비용 약 80-100만원 (항공료 포함)"],
      },
      {
        title: "사전 교육 (6주)",
        bullets: ["선교 이해 · 문화 이해", "현지어 기초 · 간증 준비", "팀 빌딩"],
      },
      {
        title: "사후 관리",
        bullets: ["간증 나눔 · 기도 지속", "재방문 계획"],
      },
    ],
    callout: {
      title: "장기 선교사 준비",
      description: "선교사 지원자 발굴 · 1-2년 훈련 · 파송 및 후원",
    },
  },
  hospitality: {
    label: "환대 선교",
    listRows: [
      {
        title: "선교사 안식년",
        description: "충분한 휴식과 재충전을 위한 공간과 공동체를 제공합니다.",
      },
      {
        title: "선교사 자녀 교육",
        description: "멘토링 · 교회 활동 참여 지원",
      },
      {
        title: "선교사 건강",
        description: "건강 검진 지원 · 병원 동행 · 회복 돌봄",
      },
    ],
  },
};

function BulletList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <div key={item} className="flex items-start gap-2 text-[14px] tracking-[0.02em] text-[#4a4845]">
          <span className="pt-[2px] text-[#888580]">·</span>
          <span className="leading-[1.6]">{item}</span>
        </div>
      ))}
    </div>
  );
}

export default function EthnicProgramTabs() {
  const [activeKey, setActiveKey] = useState<TabKey>("prayer");
  const activeTab = tabs[activeKey];
  const shortTermTraining = activeTab.cards?.[1];
  const shortTermFollowUp = activeTab.cards?.[2];

  return (
    <div className="mt-8">
      <div className="border-b-2 border-[#d0cdca]">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {(Object.keys(tabs) as TabKey[]).map((key) => {
            const tab = tabs[key];
            const isActive = key === activeKey;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveKey(key)}
                className={`border-b-2 px-1 pb-4 text-[14px] font-bold tracking-[0.04em] transition ${
                  isActive ? "border-[#0f2044] text-[#0f2044]" : "border-transparent text-[#888580]"
                }`}
                aria-pressed={isActive}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab.columns ? (
        <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
          {activeTab.columns.map((column) => (
            <div key={column.title}>
              <p className="text-[12px] font-medium tracking-[0.08em] text-[#c9a84c]">{column.title}</p>
              {column.lines ? (
                <div className="mt-4 space-y-2 text-[14px] tracking-[0.02em] text-[#4a4845]">
                  {column.lines.map((line) => (
                    <p key={line} className="leading-[1.6]">
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
              {column.bullets ? <BulletList items={column.bullets} className="mt-4" /> : null}
            </div>
          ))}
        </div>
      ) : null}

      {activeTab.cards ? (
        <div className="mt-8">
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            <div>
              <p className="text-[12px] font-medium tracking-[0.08em] text-[#c9a84c]">{activeTab.cards[0].title}</p>
              <div className="mt-4 overflow-hidden rounded-[8px] border border-[#d0cdca]">
              {activeTab.cards[0].lines?.map((line, index) => {
                const [label, ...valueParts] = line.split(" ");
                return (
                  <div
                    key={line}
                    className={`flex ${index < activeTab.cards[0].lines!.length - 1 ? "border-b border-[#d0cdca]" : ""}`}
                  >
                    <div className="w-[72px] shrink-0 bg-[#f8f7f4] px-4 py-3 text-[12px] font-medium tracking-[0.02em] text-[#888580]">
                      {label}
                    </div>
                    <div className="flex-1 px-4 py-3 text-[12px] tracking-[0.02em] text-[#4a4845]">
                      {valueParts.join(" ")}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            <div className="space-y-8">
              <p className="text-[12px] font-medium tracking-[0.08em] text-[#c9a84c]">선교 훈련</p>

              {shortTermTraining ? (
                <div>
                  <p className="text-[16px] font-bold tracking-[0.02em] text-[#0f2044]">
                    {shortTermTraining.title}
                  </p>
                  {shortTermTraining.bullets ? (
                    <BulletList items={shortTermTraining.bullets} className="mt-4" />
                  ) : null}
                </div>
              ) : null}

              {shortTermFollowUp ? (
                <div>
                  <p className="text-[16px] font-bold tracking-[0.02em] text-[#0f2044]">
                    {shortTermFollowUp.title}
                  </p>
                  {shortTermFollowUp.bullets ? (
                    <BulletList items={shortTermFollowUp.bullets} className="mt-4" />
                  ) : null}
                </div>
              ) : null}

              {activeTab.callout ? (
                <div className="rounded-[16px] bg-[#f8f7f4] px-6 py-5">
                  <h3 className="text-[16px] font-bold tracking-[0.02em] text-[#1a2744]">
                    {activeTab.callout.title}
                  </h3>
                  <p className="mt-3 text-[14px] tracking-[0.02em] text-[#888580]">
                    {activeTab.callout.description}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab.listRows ? (
        <div>
          {activeTab.listRows.map((row, index) => (
            <div
              key={row.title}
              className={`flex flex-col gap-4 py-5 md:flex-row md:items-center md:gap-10 ${
                index === 0 ? "" : "border-t border-[#f2f0ec]"
              }`}
            >
              <div className="md:w-[180px] md:shrink-0">
                <p className="text-[16px] font-bold tracking-[0.04em] text-[#0f2044]">{row.title}</p>
              </div>
              <p className="text-[15px] leading-[1.7] tracking-[0.02em] text-[#888580]">{row.description}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
