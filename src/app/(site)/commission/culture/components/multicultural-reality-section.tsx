"use client";

import { useState } from "react";
import SectionHeading from "@/components/section-heading";
import { cormorantGaramond } from "@/lib/fonts";

const stats = [
  { value: "38만", label: "다문화 가구" },
  { value: "17만", label: "결혼 이민자" },
  { value: "85만", label: "이주 노동자" },
  { value: "16만", label: "다문화 학생" },
] as const;

const countryRanks = [
  { rank: "1", country: "베트남" },
  { rank: "2", country: "중국" },
  { rank: "3", country: "태국" },
  { rank: "4", country: "필리핀" },
  { rank: "5", country: "캄보디아" },
] as const;

const difficulties = [
  {
    number: "1",
    title: "언어 장벽",
    items: ["한국어 미숙 · 의사소통 어려움", "정보 접근 제한"],
  },
  {
    number: "2",
    title: "문화 차이",
    items: ["한국 문화 적응 · 정체성 혼란", "세대 간 갈등"],
  },
  {
    number: "3",
    title: "사회적 편견",
    items: ["차별 경험 · 소외감", "낮은 자존감"],
  },
  {
    number: "4",
    title: "경제적 어려움",
    items: ["낮은 임금 · 불안정한 고용", "빈곤"],
  },
  {
    number: "5",
    title: "자녀 양육",
    items: ["이중 언어 교육 · 문화 정체성", "진로 지도"],
  },
] as const;

function AccordionItem({
  number,
  title,
  items,
  open,
  onToggle,
}: {
  number: string;
  title: string;
  items: readonly string[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[12px] border border-[#d0cdca] bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 border-b border-[#e5e7eb] px-4 py-5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#0f2044] text-[10px] font-bold text-[#0f2044]">
            {number}
          </span>
          <span className="type-accordion-title font-bold tracking-[0.02em] text-[#0f2044]">{title}</span>
        </div>
        <span className="text-[22px] leading-none text-[#c9a84c]">{open ? "×" : "+"}</span>
      </button>

      {open ? (
        <div className="space-y-4 px-4 py-5">
          {items.map((item) => (
            <div key={item} className="type-body-small flex items-start gap-3 tracking-[0.02em] text-[#4a4845]">
              <span className="pt-1 text-[#c9a84c]">·</span>
              <span className="leading-[1.7]">{item}</span>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function MulticulturalRealitySection() {
  const [openNumbers, setOpenNumbers] = useState<string[]>([]);

  const toggleItem = (number: string) => {
    setOpenNumbers((current) =>
      current.includes(number) ? current.filter((item) => item !== number) : [...current, number],
    );
  };

  return (
    <section className="mt-20 md:mt-[68px]">
      <SectionHeading label="reality" title="한국의 다문화 현실" />

      <div className="mt-8 overflow-hidden rounded-[12px] border border-[#d0cdca] bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center gap-0 px-4 py-7 text-center ${
                index % 2 === 0 ? "border-r border-[#d0cdca]" : ""
              } ${index < 2 ? "border-b border-[#d0cdca] md:border-b-0" : ""} ${
                index < stats.length - 1 ? "md:border-r md:border-[#d0cdca]" : ""
              }`}
            >
              <p className="type-subsection-title font-section-title font-black tracking-[0.02em] text-[#0f2044]">
                {stat.value}
              </p>
              <p className="type-body-small tracking-[0.02em] text-[#0f2044]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-start md:gap-[58px]">
        <div className="md:w-[265px] md:shrink-0">
          <p className="type-label font-bold uppercase tracking-[0.28em] text-[#c9a84c]">출신국 순위</p>
          <div className="mt-4">
            {countryRanks.map((item, index) => (
              <div
                key={item.rank}
                className={`flex items-center gap-8 py-4 ${
                  index === 0 ? "border-t border-[#d0cdca]" : "border-t border-[#f2f0ec]"
                }`}
              >
                <span className={`${cormorantGaramond.className} w-4 text-[18px] text-[#d0cdca]`}>{item.rank}</span>
                <span className="type-body font-bold tracking-[0.02em] text-[#0f2044]">{item.country}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <p className="type-label font-bold uppercase tracking-[0.28em] text-[#c9a84c]">주요 어려움</p>
          <div className="mt-4 space-y-2">
            {difficulties.map((item) => (
              <AccordionItem
                key={item.number}
                number={item.number}
                title={item.title}
                items={item.items}
                open={openNumbers.includes(item.number)}
                onToggle={() => toggleItem(item.number)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
