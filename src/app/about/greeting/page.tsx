import Image from "next/image";
import type { ReactNode } from "react";

const missionCards: Array<{
  eyebrow: string;
  title: string;
  description: string;
  letter: string;
  theme?: "light" | "dark";
}> = [
    {
      eyebrow: "TEACHING",
      title: "가르치는 사명",
      description:
        "강단에서 진리를 가르치셨고, 말씀으로 세상을 살아가는 힘을 주셨습니다.",
      letter: "T"
    },
    {
      eyebrow: "HEALING",
      title: "치유하는 사명",
      description:
        "부서진 사람 앞에서 무릎을 꿇으셨고, 사랑으로 그 마음을 회복시키셨습니다.",
      letter: "H",
      theme: "dark"
    },
    {
      eyebrow: "EVANGELIZING",
      title: "전파하는 사명",
      description:
        "아무도 찾지 않는 사람에게 먼저 찾아가셨어요. 삶으로 복음을 전하는 것.",
      letter: "E"
    }
  ];

const communityFocus = [
  "청소년 · 청년",
  "다문화 가정",
  "MK · TCK",
  "이주민 · 이웃",
  "교회에서 상처받은 분들"
] as const;

function SectionEyebrow({
  children,
  className = "",
  isHero = false,
  inverse = false
}: {
  children: ReactNode;
  className?: string;
  isHero?: boolean;
  inverse?: boolean;
}) {
  return isHero ? (
    <p className={`text-[15px] font-normal uppercase tracking-[0.3em] ${className}`}>
      {children}
    </p>
  ) : (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className={`block h-[3px] w-8 rounded-full ${inverse ? "bg-white/80" : "bg-themeBlue"}`} />
      <p className={`text-[13px] font-semibold uppercase tracking-[0.28em] ${inverse ? "text-white/80" : "text-themeBlue"}`}>
        {children}
      </p>
    </div>
  );
}

function QuotePanel({
  lines,
  className = ""
}: {
  lines: readonly string[];
  className?: string;
}) {
  return (
    <div
      className={`rounded-r-[12px] border-l-[3px] border-black bg-black/5 px-5 py-7 md:px-[30px] md:py-[36px] ${className}`}
    >
      <div className="space-y-1 font-serif text-lg font-bold leading-[1.78] tracking-[0.02em] text-black md:text-[18px]">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function ImagePanel({
  src,
  alt,
  className = "",
  imageClassName = ""
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[12px] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 460px"
        className={`object-cover ${imageClassName}`}
      />
    </div>
  );
}

function MissionCard({
  eyebrow,
  title,
  description,
  letter,
  theme = "light"
}: {
  eyebrow: string;
  title: string;
  description: string;
  letter: string;
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";

  return (
    <article
      className={`relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[12px] border px-6 py-8 shadow-sm transition-colors ${isDark ? "border-transparent bg-[#1c2a39]" : "border-black/30 bg-white"
        }`}
    >
      <div className="space-y-[18px]">
        <div className="space-y-4">
          <SectionEyebrow inverse={isDark}>{eyebrow}</SectionEyebrow>
          <h3 className={`max-w-[13rem] font-serif text-[22px] font-bold leading-[1.35] tracking-[0.03em] ${isDark ? "text-white" : "text-black"}`}>
            {title}
          </h3>
        </div>
        <p className={`max-w-[15rem] text-sm leading-[1.7] tracking-[0.02em] ${isDark ? "text-white/80" : "text-black"}`}>
          {description}
        </p>
      </div>
      <span className={`absolute right-6 top-4 font-serif text-[52px] leading-none ${isDark ? "text-white/40" : "text-black/50"}`}>
        {letter}
      </span>
    </article>
  );
}

function FocusChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black px-4 py-3 text-sm tracking-[0.05em] text-black">
      {children}
    </span>
  );
}

export default function GreetingPage() {
  return (
    <div className="bg-white text-black w-full pb-0 pt-0 overflow-x-hidden">
      <section className="relative w-full min-h-[420px] md:min-h-[360px] overflow-hidden">
        {/* 히어로 배경 이미지 */}
        <div className="absolute inset-0">
          <Image
            src="/images/greeting/greeting_banner.png"
            alt="The 제자교회 인사말 배경 이미지"
            fill
            priority
            className="object-cover object-center"
          />
          {/* 어두운 오버레이 그라데이션 (메인과 유사하게) */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/52 to-ink/18" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-transparent" />
        </div>

        {/* 히어로 컨텐츠 */}
        <div className="relative z-10 flex h-full min-h-[420px] md:min-h-[360px] items-end py-12 md:py-16">
          <div className="section-shell w-full">
            <div className="space-y-5">
              <SectionEyebrow isHero className="text-ivory/80">Pastor's Greeting</SectionEyebrow>
              <div className="space-y-4">
                <h2 className="font-serif text-[38px] font-bold leading-[1.18] tracking-[0.02em] text-ivory md:text-[48px] md:leading-[1.18]">
                  <span className="block">당신이 여기 있어서,</span>
                  <span className="block">정말 다행입니다.</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/20 py-14 md:py-12">
        <div className="section-shell">
          <div className="w-full space-y-10">
            <SectionEyebrow>WELCOME</SectionEyebrow>
            <QuotePanel
              lines={[
                "솔직히 교회가 힘들었던 적 있으신가요?",
                "기대했다가 상처받고, 지쳐서 떠났다가,",
                "그래도 어딘가 하나님은 믿고 싶은 그 마음."
              ]}
            />
            <p className="text-lg leading-[1.8] tracking-[0.02em] text-black">
              The 제자교회는 바로 그 자리에서 시작된 교회입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-black/20 py-14 md:py-12">
        <div className="section-shell space-y-10 md:space-y-12">
          <div className="max-w-[566px] space-y-5">
            <SectionEyebrow>OUR MISSION</SectionEyebrow>
            <div className="space-y-4">
              <h2 className="font-serif text-[32px] font-bold leading-[1.45] tracking-[0.03em] text-black md:text-[40px] md:leading-[1.46]">
                예수님이 하신 세 가지
              </h2>
              <div className="space-y-2 text-lg leading-[1.75] tracking-[0.02em] text-black">
                <p>
                  예수님은 평생 세 가지 일을 하셨어요.<br />
                  가르치고, 치유하고, 복음을 전하셨습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {missionCards.map((card) => (
              <MissionCard key={card.title} {...card} />
            ))}
          </div>
          <p className="text-lg leading-[1.75] tracking-[0.02em] text-black">
            The 제자교회도 그렇게 하고 싶습니다.<br />
            거창하지 않아도 됩니다. 예수님이 하신 것처럼, 그냥 그렇게요.
          </p>
        </div>
      </section>

      <section className="border-b border-black/20 py-14 md:py-12">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[minmax(0,489px)_minmax(280px,460px)] lg:justify-between">
          <div className="space-y-8 py-2">
            <div className="max-w-[566px] space-y-5">
              <SectionEyebrow>OUR COMMUNITY</SectionEyebrow>
              <div className="space-y-4">
                <h2 className="font-serif text-[32px] font-bold leading-[1.45] tracking-[0.03em] text-black md:text-[40px] md:leading-[1.46]">
                  <span className="block">저희가 특히</span>
                  <span className="block">마음을 두는 사람들</span>
                </h2>
                <p className="text-lg leading-[1.75] tracking-[0.02em] text-black">
                  하나님 나라엔 국적도, 언어도, 배경도 따로 없으니까요.
                  <br />이 모두가 저희 교회가 꿈꾸는 가족입니다.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex flex-wrap gap-3 md:gap-4">
                {communityFocus.slice(0, 3).map((item) => (
                  <FocusChip key={item}>{item}</FocusChip>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {communityFocus.slice(3, 5).map((item) => (
                  <FocusChip key={item}>{item}</FocusChip>
                ))}
              </div>
            </div>
          </div>

          <ImagePanel
            src="/images/mission_bak.png"
            alt="The 제자교회가 마음 두는 공동체를 설명하는 소개 이미지"
            className="min-h-[280px] lg:min-h-[360px]"
            imageClassName="object-contain bg-white p-6"
          />
        </div>
      </section>

      <section className="border-b border-black/20 py-14 md:py-12">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[minmax(280px,460px)_minmax(0,489px)] lg:justify-between">
          <ImagePanel
            src="/images/greeting/greeting4.jpg"
            alt="기도하는 손을 담은 교회 비주얼 이미지"
            className="min-h-[440px] md:min-h-[520px]"
            imageClassName="object-contain p-2"
          />

          <div className="space-y-8 py-2">
            <div className="space-y-4">
              <SectionEyebrow>OPEN DOOR</SectionEyebrow>
              <h2 className="font-serif text-[32px] font-bold leading-[1.45] tracking-[0.03em] text-black md:text-[40px] md:leading-[1.46]">
                <span className="block">완벽하지 않아도</span>
                <span className="block">됩니다</span>
              </h2>
              <div className="space-y-2 text-lg leading-[1.75] tracking-[0.02em] text-black">
                <p>
                  더제자교회는 완벽한 사람들이 모인 곳이 아닙니다. 의심해도
                  되고, 넘어져도 되고, 질문해도 됩니다. 그냥 와도 됩니다.
                </p>
                <p>
                  성령님이 이 공동체를 이끄실 거라 믿기 때문에, 우리는 오늘도
                  함께 배우면서 걸어가고 있어요.
                </p>
              </div>
            </div>

            <QuotePanel
              className="max-w-[489px]"
              lines={[
                "지쳤다면, 여기서 쉬어가세요.",
                "다시 시작하고 싶다면, 함께 걸어가요."
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
