import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import SectionHeading from "@/components/section-heading";
import NextgenProgramTabs from "./components/nextgen-program-tabs";
import { cormorantGaramond } from "@/lib/fonts";
import { createPageMetadata } from "@/lib/seo";

const introQuote = {
  text: "또 네가 많은 증인 앞에서 내게 들은 바를 충성된 사람들에게 부탁하라 그들이 또 다른 사람들을 가르칠 수 있으리라",
  reference: "디모데후서 2:2",
} as const;

const goals = [
  {
    number: "01",
    label: "Faith Legacy",
    title: "신앙의 계승",
    description: "부모 → 자녀 → 손자 → 증손자 · 4세대 신앙 전수",
  },
  {
    number: "02",
    label: "Discipleship",
    title: "제자 양육",
    description: "어려서부터 제자훈련 · 말씀과 기도로 자라는 다음세대",
  },
  {
    number: "03",
    label: "Leader",
    title: "차세대 리더",
    description: "교회와 사회의 리더 · 세상을 변화시키는 빛과 소금",
  },
] as const;

const scriptureCards = [
  {
    text: "오늘 내가 네게 명하는 이 말씀을 너는 마음에 새기고 네 자녀에게 부지런히 가르치며 집에 앉았을 때에든지 길을 갈 때에든지 누워 있을 때에든지 일어날 때에든지 이 말씀을 강론할 것이며",
    reference: "신명기 6:6-7 (쉐마 교육)",
  },
  {
    text: "우리가 이를 그들의 자손에게 숨기지 아니하고 여호와의 영예와 그의 능력과 그가 행하신 기이한 사적을 후대에 전하리로다",
    reference: "시편 78:4-7",
  },
  {
    text: "어린 아이들이 내게 오는 것을 용납하고 금하지 말라 하나님의 나라가 이런 자의 것이니라",
    reference: "마가복음 10:14",
  },
  {
    text: "마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라",
    reference: "잠언 22:6",
  },
] as const;

const crisisReasons = [
  {
    number: "01",
    title: "형식적 신앙 교육",
    details: ["재미 위주 프로그램", "피상적 성경공부", "삶과 분리된 신앙"],
  },
  {
    number: "02",
    title: "부모의 신앙 불일치",
    details: ["말과 삶이 다른 신앙", "가정 신앙 교육 부재", "교회에만 맡기는 신앙"],
  },
  {
    number: "03",
    title: "세속화된 환경",
    details: ["물질주의", "성공 지상주의", "SNS와 미디어의 영향"],
  },
] as const;

const recoverySteps = [
  {
    number: "01",
    title: "쉐마 교육",
    description: "가정에서의 신앙 교육 — 앉을 때나 길을 갈 때나 말씀을 가르치라",
  },
  {
    number: "02",
    title: "제자 훈련",
    description: "제자훈련 중심의 양육 — 어려서부터 말씀으로 훈련받는 다음세대",
  },
  {
    number: "03",
    title: "삶의 신앙",
    description: "삶으로 보여주는 신앙 — 부모의 모습이 자녀의 신앙이 된다",
  },
  {
    number: "04",
    title: "교회·가정 협력",
    description: "교회와 가정이 함께 — 신앙 공동체가 다음세대를 품는다",
  },
] as const;

const shemaPractices = [
  {
    number: "01",
    title: "가정 예배",
    frequency: "매주 금요일 · 15-20분",
    description: "찬양 → 성경 → 기도",
  },
  {
    number: "02",
    title: "식사 기도",
    frequency: "매 식사 시간",
    description: "감사 기도 · 돌아가며 기도 · 기도 제목 나눔",
  },
  {
    number: "03",
    title: "잠자리 기도",
    frequency: "매일 밤",
    description: "하루 돌아보기 · 감사와 회개 · 축복 기도",
  },
  {
    number: "04",
    title: "일상 대화",
    frequency: "일상 속에서",
    description: "하나님 이야기 · 성경 적용 · 신앙 질문 답변",
  },
] as const;

const parentPrograms = [
  "쉐마 교육 세미나 (분기 1회)",
  "부모 기도회 (월 1회)",
  "자녀 양육 특강",
  "가정 예배 자료 제공",
] as const;

const calendarItems = [
  { monthEng: "Jan", monthKr: "1월", label: "신년 비전 캠프", tone: "white" },
  { monthEng: "Feb", monthKr: "2월", label: "부모 교육 세미나", tone: "white" },
  { monthEng: "Mar", monthKr: "3월", label: "부활절 성극", tone: "white" },
  { monthEng: "Apr", monthKr: "4월", label: "성경 암송 대회", tone: "white" },
  { monthEng: "May", monthKr: "5월", label: "어린이날 행사", tone: "cream" },
  { monthEng: "Jun", monthKr: "6월", label: "가족 캠프", tone: "cream" },
  { monthEng: "Jul", monthKr: "7월", label: "여름 성경학교", tone: "cream" },
  { monthEng: "Aug", monthKr: "8월", label: "리더십 캠프", tone: "cream" },
  { monthEng: "Sep", monthKr: "9월", label: "추석 감사 축제", tone: "white" },
  { monthEng: "Oct", monthKr: "10월", label: "선교 대회", tone: "white" },
  { monthEng: "Nov", monthKr: "11월", label: "수능 기도회 (고3)", tone: "white" },
  { monthEng: "Dec", monthKr: "12월", label: "성탄 페스티벌", tone: "white" },
] as const;

const teacherRequirements = [
  "침례(세례) 받은 정식 교인",
  "1단계 제자훈련 이수",
  "다음세대를 향한 사랑",
  "주일 헌신 가능",
] as const;

const teacherBenefits = [
  "교사 훈련 및 세미나 제공",
  "사역 커리큘럼과 자료 지원",
  "함께 섬기는 교사 공동체",
  "다음세대와 함께 자라는 영적 기쁨",
] as const;

const supportItems = ["주일학교 교재비", "여름·겨울 성경학교", "캠프 및 수련회", "장학금(저소득 가정) · 악기 및 장비"] as const;

export const metadata: Metadata = createPageMetadata({
  title: "지상명령 다음세대",
  description: "The 제자교회 지상명령 다음세대 사역과 부모·교사 참여 안내를 소개합니다.",
  path: "/commission/nextgen",
});

function QuoteCard({
  text,
  reference,
  className = "",
}: {
  text: string;
  reference: string;
  className?: string;
}) {
  return (
    <blockquote
      className={`rounded-r-[12px] border-l-[3px] border-[#8c7a5b] bg-[#f7f7f4] px-5 py-5 md:px-7 md:py-[18px] ${className}`}
    >
      <p className="font-['Nanum_Myeongjo',serif] text-[13px] font-bold leading-6 tracking-[-0.01em] text-[#1a2744]">
        &quot;{text}&quot;
      </p>
      <p className="mt-3 text-[12px] font-medium tracking-[0.08em] text-[#7a7060]">{reference}</p>
    </blockquote>
  );
}

function GoldButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-[8px] bg-[#c9a84c] px-[18px] py-[14px] text-[14px] font-bold tracking-[0.04em] text-white transition hover:bg-[#b79436]"
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

export default function CommissionNextgenPage() {
  return (
    <main className="section-shell section-shell--narrow pt-10 pb-20 md:pt-16 md:pb-24">
      <section aria-labelledby="commission-nextgen-intro-title">
        <SectionHeading id="commission-nextgen-intro-title" label="next generation" title="다음세대" />

        <p className="mt-6 type-body leading-[1.7] tracking-[0.02em] text-[#1a2744]">
          신앙의 계승, 미래의 리더
        </p>

        <QuoteCard text={introQuote.text} reference={introQuote.reference} className="mt-4" />
      </section>

      <SectionBlock label="next generation" title="다음세대 사역의 3대 목표" className="mt-20 md:mt-[68px]">
        <div className="mt-5 max-w-[740px] space-y-3">
          <p className="type-body leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
            다음세대가 곧 교회의 미래입니다.
          </p>
          <p className="type-body-small leading-[1.8] tracking-[0.02em] text-[#6f675d]">
            더 제자교회는 다음세대를 단순히 &quot;미래의 일꾼&quot;이 아니라 &quot;지금의 제자&quot;로 세웁니다.
            어린 시절부터 예수님을 만나고 말씀으로 양육받아 세상을 변화시키는 차세대 리더로 자라게 합니다.
          </p>
        </div>

        <div className="mt-8 divide-y divide-[#ebe6de]">
          {goals.map((goal) => (
            <div
              key={goal.number}
              className="flex flex-col gap-5 py-6 md:flex-row md:items-center md:gap-0 md:py-5"
            >
              <div className="flex items-center md:w-[112px] md:shrink-0">
                <span
                  className={`${cormorantGaramond.className} text-[34px] leading-6 tracking-[0.04em] text-[#c9a84c] md:text-[36px]`}
                >
                  {goal.number}
                </span>
              </div>

              <div className="border-l border-[#d8d1c9] pl-5 md:flex-1 md:pl-6">
                <p className={`${cormorantGaramond.className} text-[12px] not-italic tracking-[0.08em] text-[#888580]`}>
                  {goal.label}
                </p>
                <p className="mt-2 text-[16px] font-bold tracking-[0.02em] text-[#1a2744]">{goal.title}</p>
                <p className="mt-3 text-[14px] leading-[1.7] tracking-[0.02em] text-[#888580]">{goal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock label="bible verses" title="성경적 근거" className="mt-20 md:mt-[68px]">
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {scriptureCards.map((card) => (
            <QuoteCard key={card.reference} text={card.text} reference={card.reference} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock label="family crisis" title="다음세대 위기" className="mt-20 md:mt-[68px]">
        <div className="mt-8 rounded-[12px] bg-[#1a2744] px-6 py-7 text-center text-white md:px-10 md:py-8">
          <p className="font-['Noto_Serif_KR',serif] text-[22px] font-black tracking-[0.02em]">
            &quot;청소년 10명 중 7명 교회 이탈&quot;
          </p>
          <p className="mt-3 text-[12px] tracking-[0.08em] text-white/70">20-30대 이탈률 급증 · 다음세대 신앙 공백</p>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <div className="h-6 w-px bg-[#d8d0c2]" />
          <p className="text-[12px] font-medium tracking-[0.08em] text-[#7a7060]">원인</p>
        </div>

        <div className="mt-4 grid gap-8 border-y border-[#ece6db] py-6 md:grid-cols-3 md:gap-10 md:px-4">
          {crisisReasons.map((item) => (
            <article key={item.number} className="text-center">
              <p className={`${cormorantGaramond.className} text-[14px] uppercase tracking-[0.16em] text-[#c9a84c]`}>
                {item.number}
              </p>
              <h3 className="mt-2 text-[16px] font-bold tracking-[0.02em] text-[#0f2044]">{item.title}</h3>
              <div className="mt-4 space-y-1 text-[12px] leading-[1.5] tracking-[0.04em] text-[#888580]">
                {item.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center">
          <div className="h-6 w-px bg-[#d8d0c2]" />
          <p className="text-[12px] font-medium tracking-[0.08em] text-[#7a7060]">해결</p>
          <div className="mt-4 text-center">
            <p className="type-card-title font-section-title font-bold tracking-[0.02em] text-[#111111]">
              &quot;가정에서 시작되는 신앙 회복&quot;
            </p>
            <div className="mx-auto mt-4 h-px w-9 bg-[#c9a84c]" />
          </div>
        </div>

        <div className="mt-8">
          {recoverySteps.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col items-center gap-4 border-t px-1 py-5 text-center md:flex-row md:justify-center md:gap-6 ${
                index === 0 ? "border-[#b7ab94]/60" : "border-[#f2f0ec]"
              }`}
            >
              <div className="flex items-center justify-center gap-5 md:w-[260px] md:shrink-0 md:justify-end">
                <span className={`${cormorantGaramond.className} w-[28px] text-right text-[20px] text-[#d0cdca]`}>
                  {step.number}
                </span>
                <h3 className="w-[132px] text-left text-[16px] font-bold tracking-[0.02em] text-[#0f2044]">
                  {step.title}
                </h3>
              </div>
              <p className="text-[15px] leading-[1.7] tracking-[0.02em] text-[#888580] md:w-[520px] md:text-left">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock label="next generation" title="다음세대 사역 프로그램" className="mt-20 md:mt-[68px]">
        <NextgenProgramTabs />
      </SectionBlock>

      <SectionBlock label="parent education" title="부모 교육" className="mt-20 md:mt-[68px]">
        <p className="mt-5 text-[14px] leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
          신앙 계승의 핵심은 가정입니다. 쉐마 교육의 4가지 실천으로 가정에서 신앙을 전수합니다.
        </p>

        <div className="mt-8">
          {shemaPractices.map((practice) => (
            <div
              key={practice.number}
              className="flex flex-col gap-3 border-b border-[#e5ded3] px-2 py-5 md:min-h-[78px] md:flex-row md:items-center md:gap-0 md:px-2"
            >
              <div className="flex items-center md:w-[112px] md:shrink-0 md:justify-center">
                <span className={`${cormorantGaramond.className} text-[30px] font-bold tracking-[0.06em] text-[#c9a84c]/60`}>
                  {practice.number}
                </span>
              </div>
              <div className="hidden self-stretch w-px bg-[#e1ddd6] md:block" />

              <div className="md:w-[280px] md:shrink-0 md:px-9">
                <p className="text-[16px] font-bold tracking-[0.02em] text-[#1a2744]">{practice.title}</p>
                <p className="mt-1 text-[14px] tracking-[0.02em] text-[#7a7060]">{practice.frequency}</p>
              </div>
              <div className="hidden self-stretch w-px bg-[#e1ddd6] md:block" />

              <p className="text-[14px] leading-[1.8] tracking-[0.02em] text-[#7a7060] md:px-9">
                {practice.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[12px] bg-[#f8f7f4] px-6 py-[18px]">
          <p className="text-[12px] font-bold tracking-[0.12em] text-[#b08e30]">부모 교육 프로그램</p>
          <div className="mt-4 grid gap-3 text-[14px] tracking-[0.02em] text-[#4a4845] md:grid-cols-2">
            {parentPrograms.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="pt-[2px] text-[#c9a84c]">·</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock label="yearly roadmap" title="연간 일정" className="mt-20 md:mt-[68px]">
        <div className="mt-8 overflow-hidden rounded-[12px] border border-[#d0cdca]">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {calendarItems.map((item, index) => (
              <div
                key={`${item.monthEng}-${item.monthKr}`}
                className={`border-[#d0cdca] px-4 py-[18px] ${
                  index % 4 !== 3 ? "md:border-r" : ""
                } ${index % 2 === 0 ? "border-r md:border-r" : ""} ${index < 8 ? "border-b" : ""} ${
                  item.tone === "cream" ? "bg-[#f8f7f4]" : "bg-white"
                }`}
              >
                <p className={`${cormorantGaramond.className} text-[22px] font-bold text-[#c9a84c]`}>{item.monthEng}</p>
                <p className="mt-2 text-[15px] font-bold tracking-[0.02em] text-[#0f2044]">{item.monthKr}</p>
                <p className="mt-2 text-[12px] leading-[1.4] tracking-[0.02em] text-[#888580]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock label="teacher recruit" title="교사 모집" className="mt-20 md:mt-[68px]">
        <p className="mt-5 text-[14px] leading-[1.8] tracking-[0.02em] text-black">
          다음세대는 교회와 가정이 함께 세웁니다. 예배와 양육의 현장에서 다음세대를 품을 교사를 모집합니다.
        </p>

        <div className="mt-8 overflow-hidden rounded-[16px] border border-[#d0cdca] md:grid md:grid-cols-[1fr_auto_1fr]">
          <div className="px-7 py-7">
            <p className="text-[12px] font-bold tracking-[0.12em] text-[#c9a84c]">자격 조건</p>
            <div className="mt-5 space-y-4">
              {teacherRequirements.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-[4px] border border-black/10" />
                  <span className="text-[14px] font-medium tracking-[0.02em] text-[#888580]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden bg-[#d0cdca] md:block md:w-px" />

          <div className="bg-[#f8f7f4] px-7 py-7">
            <p className="text-[12px] font-bold tracking-[0.12em] text-[#c9a84c]">혜택</p>
            <div className="mt-5 space-y-4">
              {teacherBenefits.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-[14px] font-bold leading-none text-[#c9a84c]">
                    ✓
                  </span>
                  <span className="text-[14px] font-medium tracking-[0.02em] text-[#888580]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <GoldButton href="/about/location#contact-info">교사 지원하기</GoldButton>
        </div>
      </SectionBlock>

      <section className="mt-20 md:mt-[68px]" aria-labelledby="commission-nextgen-support-title">
        <div className="flex flex-col gap-8 rounded-[12px] bg-[#1a2744] px-6 py-8 md:flex-row md:items-end md:justify-between md:px-9 md:py-9">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#c9a84c]">support</p>
            <h2
              id="commission-nextgen-support-title"
              className="mt-4 text-[24px] font-black tracking-[0.02em] text-white"
            >
              다음세대 사역 후원
            </h2>
            <div className="mt-5 max-w-[340px] space-y-3 text-[12px] font-medium tracking-[0.02em] text-white/60">
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
