import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/section-heading";
import ScriptureQuoteCard from "@/components/scripture-quote-card";
import { cormorantGaramond } from "@/lib/fonts";
import { createPageMetadata } from "@/lib/seo";

const visionItems = [
  {
    href: "/commission/nextgen",
    label: "next generation",
    title: "다음 세대",
    description: "신앙 계승 · 차세대 리더 양성",
  },
  {
    href: "/commission/culture",
    label: "multicultural and multi ethnic",
    title: "다문화·다민족",
    description: "함께 사는 세상 · 땅끝 선교 · 세계 선교",
  },
  {
    href: "/commission/senior",
    label: "senior",
    title: "시니어",
    description: "존귀하게 섬김 · 믿음의 유산 전수",
  },
] as const;

const scopeItems = [
  {
    title: "예루살렘",
    diamondColor: "#C0BAB0",
    lines: ["예배 공동체 · 우리 가정", "(다음세대 · 신앙 계승)"],
  },
  {
    title: "온 유대",
    diamondColor: "#AEA89E",
    lines: ["우리 지역 · 국내 도시", "(디아스포라 가정 · 유학생)"],
  },
  {
    title: "사마리아",
    diamondColor: "#969189",
    lines: ["소외된 민족 · 차별받는 이들", "(다문화 · 북한 탈주민)"],
  },
  {
    title: "땅 끝",
    diamondColor: "#7A7060",
    lines: ["전 세계 · 미전도 종족", "(세계 선교 · 다민족)"],
  },
] as const;

const participateItems = [
  {
    number: "01",
    title: "기도",
    label: "pray",
    details: ["다음세대를 위한 중보기도", "다문화 가정을 위한 기도", "선교사와 선교지를 위한 기도"],
  },
  {
    number: "02",
    title: "보냄",
    label: "send",
    details: ["선교 헌금 후원", "다문화 사역 후원", "차세대 사역 후원"],
  },
  {
    number: "03",
    title: "파송",
    label: "go",
    details: ["단기 선교 참여", "다문화 사역 봉사", "주일학교 교사"],
  },
  {
    number: "04",
    title: "환대",
    label: "welcome",
    details: ["선교사 환대 예배", "다문화 가정 초청", "다음세대 멘토링"],
  },
] as const;

const historyItems = [
  {
    period: "1971 – 2004",
    pastor: "초대 김성조 목사",
    theme: "받은 사랑을 나눈 시기",
    description:
      "미국 교회들의 후원으로 세워진 교회는 1973년 스스로 서고, 곧바로 보내는 교회가 되었습니다. 1975년 성문침례교회를 시작으로 2000년까지 열두 교회를 개척하고, 대만 선교신학교와 극동방송 등을 후원했으며, 1994년 카자흐스탄에 선교사를 파송했습니다. 1996년 창립 25주년에는 후원해 준 미국 교회 지도자들을 초청해 감사를 전했습니다.",
  },
  {
    period: "2004 – 2026",
    pastor: "제2대 조성훈 목사",
    theme: "선교의 마음을 이어간 시기",
    description:
      "앞선 세대가 심은 선교의 마음을 이어받아, 지역과 성도를 섬기며 선교하는 교회의 정체성을 지켜 왔습니다.",
  },
  {
    period: "2026 –",
    pastor: "제3대 이진욱 목사",
    theme: "선교사 출신 목회자와 함께",
    description:
      "2009년부터 2025년까지 17년간 필리핀에서 선교하며 산타로사꿈의교회를 세우고 한글학교를 운영했습니다. 2025년 현지 목회자에게 자립 교회로 이양하고 돌아와, 선교로 세워진 교회에서 다시 선교를 이어 갑니다.",
  },
] as const;

const visionPhotos = [
  {
    src: "/images/commission/vision-culture.jpg",
    alt: "다문화 공동체",
    frameClassName: "z-[12] right-[-144px] top-[-130px] w-[232px] -rotate-[7deg]",
  },
  {
    src: "/images/commission/vision-nextgen.jpg",
    alt: "다음세대 아이들",
    frameClassName: "z-[13] right-[48px] top-[-6px] w-[274px] rotate-[4deg]",
  },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "지상명령 개요",
  description: "대천침례교회가 다음 세대, 다문화·다민족, 시니어와 함께 감당하는 지상명령을 소개합니다.",
  path: "/commission/summary",
});

function MissionRingDiagram() {
  const rings = [
    { diameter: 176.4, stroke: "#C0BAB0", strokeWidth: 0.8, cx: 0 },
    { diameter: 235.2, stroke: "#AEA89E", strokeWidth: 1.1, cx: 24 },
    { diameter: 305.76, stroke: "#969189", strokeWidth: 1.2, cx: 48 },
    { diameter: 366.91, stroke: "#7A7060", strokeWidth: 2, cx: 72 },
  ] as const;

  return (
    <div className="relative h-[200px] w-[420px] max-w-none overflow-hidden md:h-[230px]">
      <svg
        className="h-full w-full"
        viewBox="0 0 420 240"
        aria-hidden="true"
        preserveAspectRatio="xMinYMid meet"
      >
        <line
          x1="0"
          y1="120"
          x2="420"
          y2="120"
          stroke="#d8cfbf"
          strokeWidth="1"
          strokeDasharray="3 6"
          opacity="0.7"
        />

        {rings.map((ring) => {
          const radius = ring.diameter / 2;
          const cy = 120;
          const dotX = ring.cx + radius;

          return (
            <g key={ring.diameter}>
              <circle
                cx={ring.cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={ring.stroke}
                strokeWidth={ring.strokeWidth}
              />
              <circle cx={dotX} cy={cy} r="5" fill={ring.stroke} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function CommissionSummaryPage() {
  return (
    <main className="section-shell section-shell--narrow pt-10 pb-20 md:pt-16 md:pb-24">
      <section aria-labelledby="commission-summary-intro-title">
        <SectionHeading
          id="commission-summary-intro-title"
          label="great commission"
          title="지상명령"
        />

        <ScriptureQuoteCard
          quote="그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 침례를 베풀고 내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라 볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라"
          reference="마태복음 28:19-20"
          className="mt-8"
        />

        <div className="mt-6 max-w-[780px] space-y-3">
          <p className="type-body leading-[1.7] tracking-[0.02em] text-[#1a2744]">
            대천침례교회는 예수님의 지상명령을 교회의 최우선 사명으로 여깁니다.
          </p>
          <p className="type-body leading-[1.7] tracking-[0.02em] text-[#1a2744]">
            선교로 세워진 교회, 선교사 출신 이진욱 목사와 함께 다음 세대 · 다문화·다민족 ·
            시니어를 향한 하나님 나라 확장에 헌신합니다.
          </p>
        </div>
      </section>

      <section aria-labelledby="commission-vision-title" className="relative mt-20 md:mt-[68px]">
        <SectionHeading
          id="commission-vision-title"
          label="mission vision"
          title="선교 비전"
        />

        <p className="mt-5 max-w-[720px] type-body leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
          &quot;모든 민족을 제자로&quot; - 지상명령의 부르심에 따라{" "}
          <br className="hidden md:block lg:hidden" />대천침례교회는 세 방향으로 사명을 감당합니다.
        </p>

        <div className="relative mt-8">
          <div className="relative z-10 max-w-[520px] divide-y divide-[#ece5da] border-y border-[#ece5da]">
            {visionItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-5 py-5 pr-4 transition"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e3d5bc] bg-white transition group-hover:border-[#c9a84c] group-hover:bg-[#f6eed7]">
                  <span className="text-[16px] font-semibold leading-none text-[#c9a84c] transition group-hover:translate-x-[1px]">
                    ›
                  </span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-3">
                  <span className="type-label font-semibold uppercase tracking-[0.28em] text-[#c9a84c]/75">
                    {item.label}
                  </span>
                  <span className="type-card-title font-section-title font-bold leading-none tracking-[0.02em] text-[#2c2424]">
                    {item.title}
                  </span>
                  <span className="type-body-small leading-[1.55] tracking-[0.02em] text-[#6e6464]">
                    {item.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          {visionPhotos.map((photo) => (
            <div
              key={photo.src}
              aria-hidden="true"
              className={`pointer-events-none absolute hidden rounded-[4px] bg-white p-[10px] pb-[34px] shadow-[0_24px_60px_rgba(44,36,36,0.18)] md:block ${photo.frameClassName}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="274px"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="commission-scope-title" className="mt-20 md:mt-[68px]">
        <SectionHeading
          id="commission-scope-title"
          label="scope"
          title="지상명령 범위"
        />

        <ScriptureQuoteCard
          quote="오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라"
          reference="사도행전 1:8"
          className="mt-8 py-4 md:px-[28px]"
          quoteClassName="leading-[1.8] tracking-[0.02em] text-[#4b463e]"
          referenceClassName="mt-2 text-[#8d7f67]"
        />

        <div className="mt-8 border-b border-[#eee6db] pb-5 md:flex md:items-center md:overflow-visible lg:justify-between">
          <div className="relative z-0 md:w-[420px] md:shrink-0">
            <MissionRingDiagram />
          </div>

          <div className="relative z-10 mt-8 md:mt-0 md:shrink-0 md:[margin-left:clamp(-120px,calc(100vw-920px),0px)] lg:ml-auto">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 min-[500px]:grid-cols-2 md:grid-cols-2">
              {scopeItems.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="flex h-[24px] w-[14px] shrink-0 items-start justify-center pt-[10px]">
                    <span
                      className="block h-[10px] w-[10px] rotate-45"
                      style={{ backgroundColor: item.diamondColor }}
                    />
                  </span>
                  <div>
                    <h3 className="type-card-title whitespace-nowrap font-section-title font-bold tracking-[0.02em] text-[#1a2744]">
                      {item.title}
                    </h3>
                    <div className="mt-2 space-y-1">
                      {item.lines.map((line) => (
                        <p
                          key={line}
                          className="type-body-small whitespace-nowrap leading-[1.45] tracking-[0.02em] text-[#6d6558]"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="commission-history-title" className="mt-20 md:mt-[68px]">
        <SectionHeading
          id="commission-history-title"
          label="mission history"
          title="대천침례교회 선교 사역"
        />

        <div className="mt-8 divide-y divide-[#eee6db] border-y border-[#eee6db]">
          {historyItems.map((item) => (
            <article key={item.period} className="grid gap-4 py-6 md:grid-cols-[minmax(220px,0.8fr)_2fr] md:gap-10 md:py-7">
              <div>
                <p
                  className={`${cormorantGaramond.className} text-[30px] font-bold leading-none tracking-[0.04em] text-[#0f2044]`}
                >
                  {item.period}
                </p>
                <h3 className="mt-4 type-body font-bold tracking-[0.04em] text-[#4a4840]">
                  {item.pastor}
                </h3>
                <p className="mt-1 type-body-small leading-[1.6] tracking-[0.02em] text-[#8d7f67]">
                  {item.theme}
                </p>
              </div>
              <p className="type-body-small leading-[1.8] tracking-[0.02em] text-[#4a4840]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="commission-participate-title" className="mt-20 md:mt-[68px]">
        <SectionHeading
          id="commission-participate-title"
          label="how to participate"
          title="참여 방법"
        />

        <div className="mt-8 border-y border-[#eee6db] py-5">
          <div className="lg:hidden">
            {participateItems.map((item, index) => (
              <div
                key={item.number}
                className={`flex items-center gap-4 px-1 py-5 text-left md:gap-6 ${index === 0 ? "" : "border-t border-[#f2f0ec]"
                  }`}
              >
                <div className="flex w-[112px] shrink-0 items-center gap-4 md:w-[210px] md:gap-5">
                  <span
                    className={`${cormorantGaramond.className} w-[32px] -translate-y-[0.14em] text-left text-[1.8rem] font-normal leading-[0.8] tracking-[0.08em] text-[#c9a84c] md:text-[2rem] md:leading-[0.5]`}
                  >
                    {item.number}
                  </span>
                  <div>
                    <p className="type-label-fixed font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">
                      {item.label}
                    </p>
                    <h3 className="mt-2 text-[1.125rem] font-section-title font-bold leading-[1.3] tracking-[0.02em] text-[#0f2044] md:text-[1.375rem]">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <p className="flex-1 pt-0.5 type-body-small leading-[1.7] tracking-[0.02em] text-[#888580] md:leading-[1.7]">
                  {item.details.join(" · ")}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-0">
            {participateItems.map((item, index) => (
              <div
                key={item.number}
                className={`px-4 text-center lg:px-6 ${index < participateItems.length - 1 ? "lg:border-r lg:border-[#ece5da]" : ""
                  }`}
              >
                <p className="type-label-fixed font-semibold uppercase tracking-[0.28em] text-[#c9a84c]">
                  {item.label}
                </p>
                <h3 className="mt-3 type-card-title font-section-title font-bold text-[#1a2744]">
                  {item.title}
                </h3>
                <div className="mt-4 space-y-1.5">
                  {item.details.map((detail) => (
                    <p
                      key={detail}
                      className="type-body-xsmall leading-[1.5] tracking-[0.02em] text-[#6d6558]"
                    >
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
