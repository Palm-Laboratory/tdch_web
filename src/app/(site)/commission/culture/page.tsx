import type { Metadata } from "next";
import type { ReactNode } from "react";
import SectionHeading from "@/components/section-heading";
import ScriptureQuoteCard from "@/components/scripture-quote-card";
import { createPageMetadata } from "@/lib/seo";
import { cormorantGaramond, nanumMyeongjo } from "@/lib/fonts";

export const metadata: Metadata = createPageMetadata({
  title: "지상명령 다문화·다민족",
  description: "대천침례교회의 다문화·다민족 사역과 세계 선교 참여 안내입니다.",
  path: "/commission/culture",
});

const introQuote = {
  text: "너희는 나그네를 압제하지 말며 너희도 애굽 땅에서 나그네 되었었은즉 나그네의 정서를 아느니라",
  reference: "출애굽기 23:9",
} as const;

const goals = [
  {
    number: "01",
    label: "Welcome",
    title: "환대",
    description:
      "한국 사회에 적응하는 일을 돕고, 조건 없이 맞이합니다. 언어와 문화는 시간이 필요하니 천천히, 반복해서, 조급함 없이 함께 걷겠습니다.",
  },
  {
    number: "02",
    label: "Gospel",
    title: "복음",
    description:
      "언어의 벽을 넘는 예수님의 사랑을 나눕니다. 다름을 존중하며, 서로에게서 배우는 자세로 다가갑니다.",
  },
  {
    number: "03",
    label: "Send",
    title: "땅 끝 선교",
    description: "선교사를 기도와 후원으로 보내고, 교회 간 협력으로 세계 선교에 함께합니다.",
  },
] as const;

const scriptureCards = [
  {
    text: "타국인이 너희 땅에 우거하여 함께 있거든 너희는 그를 학대하지 말고 너희와 함께 있는 타국인을 너희 중에서 낳은 자 같이 여기며 자기 같이 사랑하라 너희도 애굽 땅에서 객이 되었더니라 나는 너희 하나님 여호와니라",
    reference: "레위기 19:33-34",
  },
  {
    text: "손님 대접하기를 잊지 말라 이로써 부지중에 천사들을 대접한 이들이 있었느니라",
    reference: "히브리서 13:2",
  },
  {
    text: "그러므로 이제부터 너희는 외인도 아니요 나그네도 아니요 오직 성도들과 동일한 시민이요 하나님의 권속이라",
    reference: "에베소서 2:19",
  },
  {
    text: "내가 주릴 때에 너희가 먹을 것을 주었고 목마를 때에 마시게 하였고 나그네 되었을 때에 영접하였고",
    reference: "마태복음 25:35",
  },
] as const;

const missionLessons = [
  {
    number: "01",
    title: "인내",
    description: "조급함 없이 함께 걷기",
  },
  {
    number: "02",
    title: "존중",
    description: "다름을 인정하고 서로 배우기",
  },
  {
    number: "03",
    title: "사랑",
    description: "조건 없는 환대와 실제적 도움",
  },
  {
    number: "04",
    title: "협력",
    description: "현지 교회와 함께, 스스로 서는 교회 세우기",
  },
] as const;

const participationItems = [
  {
    label: "봉사",
    description: "한국어 교사 · 통역(영어·필리핀어·베트남어·중국어 등) · 1:1 멘토 · 아이 돌봄 · 요리 봉사",
  },
  {
    label: "선교",
    description: "기도 · 선교 헌금 · 단기 선교",
  },
] as const;

const supportItems = ["한국어 교재비", "생활 지원 기금", "자녀 장학금", "문화 행사비"] as const;

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
        <SectionHeading id="commission-culture-intro-title" label="multicultural and multi ethnic" title="다문화·다민족" />

        <p className="mt-6 type-body leading-[1.7] tracking-[0.02em] text-black">함께 사는 세상, 땅 끝까지</p>

        <ScriptureQuoteCard quote={introQuote.text} reference={introQuote.reference} className="mt-4" />
      </section>

      <SectionBlock label="vision" title="다문화·다민족 사역의 3대 목표" className="mt-20 md:mt-[68px]">
        <div className="mt-5 max-w-[780px] space-y-0">
          <p className="type-body leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
            대천침례교회는 선교로 세워졌고, 17년간 낯선 땅에서 사역한 목사와 함께합니다.
          </p>
          <p className="type-body leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
            우리 곁의 이주민 이웃에서 땅 끝의 미전도 종족까지 모든 민족이 예수님의 제자가 되도록 섬깁니다.
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

      <SectionBlock label="ministry program" title="함께 준비하는 사역" className="mt-20 md:mt-[68px]">
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            "한국어 교실 — 한글 읽기·쓰기부터 일상 회화까지",
            "다문화 가정 환대 — 예배와 식탁 교제, 생활 정착 돕기",
            "자녀 학습·돌봄 지원",
            "선교 기도회 — 선교사와 선교지, 미전도 종족을 위한 기도",
          ].map((item) => (
            <li key={item} className="rounded-[12px] border border-black/10 bg-[#f8f7f4] px-6 py-5 type-body font-semibold text-[#1a2744]">{item}</li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock label="mission principles" title="선교에서 배운 것" className="mt-20 md:mt-[68px]">
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

      <SectionBlock label="mission partnership" title="협력 선교" className="mt-20 md:mt-[68px]">
        <p className="mt-5 type-body-small leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
          필리핀 산타로사 꿈의교회(형제교회, 전영 목사)와 기도로 동역합니다.
        </p>
      </SectionBlock>

      <SectionBlock label="participate" title="참여 방법" className="mt-20 md:mt-[68px]">
        <div className="mt-8 divide-y divide-[#f2f0ec] border-y border-[#d0cdca]">
          {participationItems.map((item) => (
            <div key={item.label} className="grid gap-2 py-5 md:grid-cols-[140px_1fr] md:gap-6">
              <h3 className="type-body font-bold tracking-[0.02em] text-[#0f2044]">{item.label}</h3>
              <p className="type-body-small leading-[1.8] tracking-[0.02em] text-[#4a4845]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </SectionBlock>

      <section className="mt-20 md:mt-[68px]" aria-labelledby="commission-culture-support-title">
        <div className="rounded-[12px] bg-[#1a2744] px-6 py-8 md:px-9 md:py-9">
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

        </div>
      </section>
    </main>
  );
}
