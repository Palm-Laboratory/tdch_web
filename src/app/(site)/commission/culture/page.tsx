import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import SectionHeading from "@/components/section-heading";
import ScriptureQuoteCard from "@/components/scripture-quote-card";
import { createPageMetadata } from "@/lib/seo";
import { cormorantGaramond, nanumMyeongjo } from "@/lib/fonts";
import MulticulturalProgramTabs from "./components/multicultural-program-tabs";
import MulticulturalRealitySection from "./components/multicultural-reality-section";

export const metadata: Metadata = createPageMetadata({
  title: "지상명령 다문화",
  description: "The 제자교회 지상명령 다문화 사역과 참여 안내를 소개합니다.",
  path: "/commission/culture",
});

const introQuote = {
  text: "너희는 나그네를 압제하지 말며 너희도 애굽 땅에서 나그네 되었었은즉 나그네의 정서를 아느니라",
  reference: "출애굽기 23:9",
} as const;

const goals = [
  {
    number: "01",
    label: "Gospel Mission",
    title: "복음 전파",
    description: "예수 그리스도의 사랑 전하기 · 다문화 가정의 구원",
  },
  {
    number: "02",
    label: "Cultural Bridge",
    title: "문화 통합",
    description: "한국 사회 적응 돕기 · 한국어 교육 및 문화 교류",
  },
  {
    number: "03",
    label: "Build Community",
    title: "공동체 세우기",
    description: "다문화 가정 네트워크 · 서로 돕고 격려하는 공동체",
  },
] as const;

const scriptureCards = [
  {
    text: "타국인이 너희의 땅에 거류하여 함께 있거든 너희는 그를 학대하지 말고 너희와 함께 있는 타국인을 너희 중에서 난 자 같이 여기며 자기 같이 사랑하라",
    reference: "레위기 19:33-34",
  },
  {
    text: "나그네 대접하기를 잊지 말라 이로써 부지중에 천사들을 대접한 이들이 있었느니라",
    reference: "히브리서 13:2",
  },
  {
    text: "그러므로 이제부터 너희는 외인도 아니요 나그네도 아니요 오직 성도들과 동일한 시민이요 하나님의 권속이라",
    reference: "에베소서 2:19",
  },
  {
    text: "내가 나그네 되었을 때에 영접하였고",
    reference: "마태복음 25:35",
  },
] as const;

const missionLessons = [
  {
    number: "01",
    title: "인내",
    description: "언어와 문화는 시간이 필요합니다. 천천히, 반복해서 — 조급함 없이 함께 걷는 것이 진정한 섬김입니다.",
  },
  {
    number: "02",
    title: "존중",
    description: "다름을 인정하고, 우월감을 배제합니다. 서로에게서 배우는 자세가 진정한 문화 통합의 시작입니다.",
  },
  {
    number: "03",
    title: "사랑",
    description: "조건 없는 환대와 실제적 도움, 진심 어린 관심 — 예수님의 사랑이 언어의 장벽을 넘습니다.",
  },
] as const;

const volunteerItems = [
  "한국어 교사",
  "통역 (영어·필리핀어·베트남어·중국어)",
  "상담 (법률·가정·진로)",
  "멘토 (1:1 또는 가정)",
  "교통 지원 · 아이 돌봄 · 요리 봉사",
] as const;

const supportItems = ["한국어 교재비", "생활 지원 기금", "자녀 장학금", "문화 행사비"] as const;

function GoldButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="type-body-small inline-flex items-center justify-center rounded-[8px] bg-[#c9a84c] px-[18px] py-[14px] font-bold tracking-[0.04em] text-white transition hover:bg-[#b79436]"
    >
      <span>{children}</span>
      <span className="ml-1">→</span>
    </Link>
  );
}

function SectionBlock({
  label,
  title,
  children,
  className = "",
}: {
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <SectionHeading label={label} title={title} />
      {children}
    </section>
  );
}

export default function CommissionCulturePage() {
  return (
    <main className="section-shell section-shell--narrow pt-10 pb-20 md:pt-16 md:pb-24">
      <section aria-labelledby="commission-culture-intro-title">
        <SectionHeading id="commission-culture-intro-title" label="multicultural ministry" title="다문화" />

        <p className="mt-6 type-body leading-[1.7] tracking-[0.02em] text-black">함께 사는 세상, 서로 섬기는 교회</p>

        <ScriptureQuoteCard quote={introQuote.text} reference={introQuote.reference} className="mt-4" />
      </section>

      <SectionBlock label="vision" title="다문화 사역의 3대 목표" className="mt-20 md:mt-[68px]">
        <div className="mt-5 max-w-[780px] space-y-0">
          <p className="type-body leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
            더 제자교회는 17년 필리핀 선교 경험을 통해 다문화 가정의 아픔과 필요를 압니다.
          </p>
          <p className="type-body leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
            한국 사회에서 소외되기 쉬운 다문화 가정과 이주민을 예수님의 사랑으로 품고 함께 하나님 나라를 세워갑니다.
          </p>
        </div>

        <div className="mt-8">
          {goals.map((goal) => (
            <article
              key={goal.number}
              className="flex gap-4 border-b border-black/10 py-5 first:pt-0 last:border-b-0 last:pb-0 md:gap-7 md:py-5"
            >
              <div className="flex items-start pt-2">
                <span
                  className={`${cormorantGaramond.className} text-[2rem] leading-none tracking-[0.08em] text-[#c9a84c] md:text-[2.25rem]`}
                >
                  {goal.number}
                </span>
              </div>

              <div className="border-l border-black/10 pl-4 md:pl-6">
                <p
                  className={`${cormorantGaramond.className} type-body-small tracking-[0.12em] text-[#888580]`}
                >
                  {goal.label}
                </p>
                <h3
                  className={`${nanumMyeongjo.className} mt-2 type-lead font-bold leading-none tracking-[0.02em] text-[#1a2744]`}
                >
                  {goal.title}
                </h3>
                <p className="mt-2 type-body-small leading-[1.7] tracking-[0.02em] text-[#7a7060]">
                  {goal.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock label="biblical basis" title="성경적 근거" className="mt-20 md:mt-[68px]">
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {scriptureCards.map((card) => (
            <ScriptureQuoteCard key={card.reference} quote={card.text} reference={card.reference} />
          ))}
        </div>
      </SectionBlock>

      <MulticulturalRealitySection />

      <SectionBlock label="ministry program" title="다문화 사역 프로그램" className="mt-20 md:mt-[68px]">
        <MulticulturalProgramTabs />
      </SectionBlock>

      <SectionBlock label="mission experience" title="필리핀 선교 경험" className="mt-20 md:mt-[68px]">
        <p className="mt-5 type-body-small leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
          산타로사 꿈의교회 17년 — 한국·필리핀 다문화 가정 10여 가정을 섬기며 배운 것들입니다.
        </p>

        <div className="mt-8">
          {missionLessons.map((lesson, index) => (
            <div
              key={lesson.number}
              className={`flex flex-col gap-3 py-6 md:flex-row md:items-start md:gap-6 ${
                index === 0 ? "border-t border-[#d0cdca]" : "border-t border-[#f2f0ec]"
              }`}
            >
              <div className="flex items-center gap-5 md:w-[170px] md:shrink-0">
                <span className={`${cormorantGaramond.className} text-[20px] text-[#d0cdca]`}>{lesson.number}</span>
                <h3 className="type-card-title font-section-title font-bold tracking-[0.02em] text-[#0f2044]">{lesson.title}</h3>
              </div>
              <p className="type-body-small text-[15px] leading-[1.75] tracking-[0.02em] text-[#888580]">{lesson.description}</p>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock label="participate" title="참여 방법" className="mt-20 md:mt-[68px]">
        <div className="mt-8 overflow-hidden rounded-[16px] border border-[#d0cdca] bg-[#f8f7f4] md:flex md:items-end md:justify-between md:px-9 md:py-9">
          <div className="px-6 py-7 md:w-[440px] md:px-0 md:py-0">
            <p className="type-label font-bold tracking-[0.12em] text-[#c9a84c]">봉사자 모집</p>
            <div className="mt-5 space-y-4">
              {volunteerItems.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-[4px] border border-[#d0cdca] bg-white" />
                  <span className="type-body-small font-medium tracking-[0.02em] text-[#4a4845]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-7 md:px-0 md:pb-0">
            <GoldButton href="/about/location#contact-info">지원하기</GoldButton>
          </div>
        </div>
      </SectionBlock>

      <section className="mt-20 md:mt-[68px]" aria-labelledby="commission-culture-support-title">
        <div className="flex flex-col gap-8 rounded-[12px] bg-[#1a2744] px-6 py-8 md:flex-row md:items-end md:justify-between md:px-9 md:py-9">
          <div>
            <p className="type-label font-bold uppercase tracking-[0.28em] text-[#c9a84c]">support</p>
            <h2
              id="commission-culture-support-title"
              className="mt-4 type-subsection-title font-section-title font-extrabold tracking-[0.02em] text-white"
            >
              다문화 사역 후원
            </h2>
            <div className="mt-5 max-w-[340px] space-y-3 type-body-small font-medium tracking-[0.02em] text-white/60">
              {supportItems.map((item) => (
                <div key={item} className="flex items-start gap-1.5">
                  <span>·</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <GoldButton href="/about/giving">후원하기</GoldButton>
          </div>
        </div>
      </section>
    </main>
  );
}
