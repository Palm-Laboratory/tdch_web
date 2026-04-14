import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/section-heading";
import { cormorantGaramond } from "@/lib/fonts";
import { gowunBatang } from "@/lib/fonts";
import { CHURCH_EMAIL, CHURCH_PHONE } from "@/lib/site-config";
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
    label: "multicultural",
    title: "다문화",
    description: "함께 사는 세상 · 다가간 섬김",
  },
  {
    href: "/commission/ethnic",
    label: "multi ethnic",
    title: "다민족",
    description: "창끝선교 · 세계 선교",
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

const historyLeftItems = [
  "17년간 필리핀 선교",
  "산타로사 한국학교 운영",
  "현지인 리더 양성 · 현지 8교회 성장",
  "4세대 재생산 제자훈련 실현",
  "2025년 자립 교회로 이양 완료",
] as const;

const historyRightItems = [
  "3D 선교 비전 계승",
  "다음세대 사역 확장",
  "다문화 가정 섬김",
  "세계 선교 네트워크 구축",
] as const;

const visionPhotos = [
  {
    src: "/images/commission/vision-culture.jpg",
    alt: "다문화 공동체",
    frameClassName: "z-[2] right-[-144px] top-[-160px] w-[232px] -rotate-[7deg]",
  },
  {
    src: "/images/commission/vision-nextgen.jpg",
    alt: "다음세대 아이들",
    frameClassName: "z-[3] right-[48px] top-[-36px] w-[274px] rotate-[4deg]",
  },
  {
    src: "/images/commission/vision-ethnic.jpg",
    alt: "다민족 공동체",
    frameClassName: "z-[1] right-[-156px] top-[144px] w-[226px] rotate-[9deg]",
  },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "지상명령 개요",
  description: "The 제자교회 지상명령 개요와 3D 선교 비전을 소개합니다.",
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
    <div className="relative h-[200px] w-full max-w-[420px] overflow-hidden md:h-[230px]">
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

        <blockquote className="mt-8 rounded-r-[12px] border-l-[3px] border-[#8c7a5b] bg-[#f7f7f4] px-5 py-6 md:px-[30px] md:py-7">
          <p className="font-['Nanum_Myeongjo',serif] text-[14px] font-bold leading-[24px] tracking-[-0.01em] text-[#1a2744] md:text-[15px]">
            &quot;그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의
            이름으로 침례를 베풀고 내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라
            볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라&quot;
          </p>
          <p className="mt-4 text-[12px] font-medium tracking-[0.08em] text-[#7a7060]">
            마태복음 28:19-20
          </p>
        </blockquote>

        <div className="mt-6 max-w-[780px] space-y-3">
          <p className="type-body leading-[1.7] tracking-[0.02em] text-[#1a2744]">
            더 제자교회는 예수님의 지상명령을 교회의 최우선 사명으로 여깁니다.
          </p>
          <p className="type-body leading-[1.7] tracking-[0.02em] text-[#1a2744]">
            필리핀 17년 선교 사역의 열매로 3D 선교 전략을 세우고, 다음세대 · 다문화 ·
            다민족을 향한 하나님 나라 확장에 헌신합니다.
          </p>
        </div>
      </section>

      <section aria-labelledby="commission-vision-title" className="relative mt-20 md:mt-[68px]">
        <SectionHeading
          id="commission-vision-title"
          label="3D mission vision"
          title="3D 선교 비전"
        />

        <p className="mt-5 max-w-[720px] text-[14px] leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
          &quot;모든 민족을 제자로&quot; - 지상명령의 부르심에 따라 더 제자교회는 세 방향으로
          사명을 감당합니다.
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
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-[0.28em] text-[#c9a84c]/75">
                    {item.label}
                  </span>
                  <span className="font-[var(--font-serif)] text-[22px] font-bold leading-none tracking-[0.02em] text-[#2c2424]">
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

        <blockquote className="mt-8 rounded-r-[12px] border-l-[3px] border-[#8c7a5b] bg-[#f7f7f4] px-5 py-4 md:px-[28px]">
          <p className="text-[12px] leading-[1.8] tracking-[0.02em] text-[#4b463e]">
            &quot;오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와
            사마리아와 땅 끝까지 이르러 내 증인이 되리라&quot;
          </p>
          <p className="mt-2 text-[12px] tracking-[0.08em] text-[#8d7f67]">사도행전 1:8</p>
        </blockquote>

        <div className="mt-8 border-b border-[#eee6db] pb-5 md:flex md:items-center md:gap-10">
          <MissionRingDiagram />

          <div className="mt-8 grid gap-x-8 gap-y-6 md:mt-0 md:grid-cols-2">
            {scopeItems.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="flex h-[24px] w-[14px] shrink-0 items-start justify-center pt-[10px]">
                  <span
                    className="block h-[10px] w-[10px] rotate-45"
                    style={{ backgroundColor: item.diamondColor }}
                  />
                </span>
                <div>
                  <h3 className="font-[var(--font-serif)] text-[18px] font-bold tracking-[0.02em] text-[#1a2744]">
                    {item.title}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {item.lines.map((line) => (
                      <p
                        key={line}
                        className="text-[12px] leading-[1.45] tracking-[0.02em] text-[#6d6558]"
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
      </section>

      <section aria-labelledby="commission-history-title" className="mt-20 md:mt-[68px]">
        <SectionHeading
          id="commission-history-title"
          label="mission history"
          title="더 제자교회 선교 사역"
        />

        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_auto_1fr] md:items-start">
          <div>
            <div className="flex items-center gap-2">
              <p
                className={`${cormorantGaramond.className} text-[26px] font-bold leading-none tracking-[0.04em] text-[#0f2044]`}
              >
                2009
              </p>
              <span className="h-px w-[18px] bg-[#0f2044]" />
              <p
                className={`${cormorantGaramond.className} text-[26px] font-bold leading-none tracking-[0.04em] text-[#0f2044]`}
              >
                2025
              </p>
            </div>
            <p className="mt-5 text-[16px] font-bold tracking-[0.04em] text-[#4a4840]">
              필리핀 산타로사 꿈의교회
            </p>
            <ul className="mt-6 space-y-3">
              {historyLeftItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[14px] tracking-[0.02em] text-[#4a4840]">
                  <span className="mt-[5px] text-[#c9a84c]">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto hidden h-[128px] w-[12px] md:block">
            <div className="relative flex h-full items-center justify-center">
              <div className="h-full w-[2px] bg-[linear-gradient(180deg,#c9a84c_10%,#d9d9d9_100%)]" />
              <div className="absolute top-0 h-[7px] w-[7px] rounded-full bg-[#c9a84c]" />
              <div className="absolute bottom-0 translate-y-[3px] border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#d9d9d9]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p
                className={`${cormorantGaramond.className} text-[26px] font-bold leading-none tracking-[0.04em] text-[#0f2044]`}
              >
                2026
              </p>
              <span className="h-px w-[18px] bg-[#0f2044]" />
              <p className={`${gowunBatang.className} text-[24px] font-bold leading-none tracking-[0.04em] text-[#0f2044]`}>
                현재
              </p>
            </div>
            <p className="mt-5 text-[16px] font-bold tracking-[0.04em] text-[#4a4840]">
              한국 더 제자교회 (수원/동탄/용인)
            </p>
            <ul className="mt-6 space-y-3">
              {historyRightItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[14px] tracking-[0.02em] text-[#4a4840]">
                  <span className="mt-[5px] text-[#c9a84c]">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="commission-participate-title" className="mt-20 md:mt-[68px]">
        <SectionHeading
          id="commission-participate-title"
          label="how to participate"
          title="참여 방법"
        />

        <div className="mt-8 border-y border-[#eee6db] py-5">
          <div className="grid gap-6 md:grid-cols-4 md:gap-0">
            {participateItems.map((item, index) => (
              <div
                key={item.number}
                className={`px-4 text-center md:px-6 ${index < participateItems.length - 1 ? "md:border-r md:border-[#ece5da]" : ""
                  }`}
              >
                <p
                  className={`${cormorantGaramond.className} text-[18px] tracking-[0.16em] text-[#c9a84c]`}
                >
                  {item.number}
                </p>
                <h3 className="mt-2 font-[var(--font-serif)] text-[20px] font-bold text-[#1a2744]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[#d0cdca]">
                  {item.label}
                </p>
                <div className="mt-4 space-y-1.5">
                  {item.details.map((detail) => (
                    <p
                      key={detail}
                      className="text-[12px] leading-[1.5] tracking-[0.02em] text-[#6d6558]"
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

      <section className="mt-20 md:mt-[68px]" aria-labelledby="commission-contact-title">
        <div className="rounded-[16px] bg-[#1a2744] px-6 py-8 md:flex md:items-end md:justify-between md:px-9 md:py-9">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.32em] text-[#c9a84c]">
              Contact
            </p>
            <h2
              id="commission-contact-title"
              className="mt-4 font-[var(--font-serif)] text-[28px] font-bold leading-none tracking-[0.02em] text-white"
            >
              문의
            </h2>

            <div className="mt-6 space-y-2 text-[14px] tracking-[0.02em]">
              <p>
                <span className="text-white/60">전화</span>
                <span className="ml-3 text-white/85">{CHURCH_PHONE}</span>
              </p>
              <p>
                <span className="text-white/60">이메일</span>
                <span className="ml-3 text-white/85">{CHURCH_EMAIL}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start gap-2 md:mt-0 md:items-end">
            <Link
              href="/about/location"
              className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#c9a84c] px-5 text-[14px] font-bold tracking-[0.05em] text-white transition hover:bg-[#d4b261]"
            >
              지금 참여하기 →
            </Link>
            <p className="text-[12px] tracking-[0.02em] text-white/55">
              선교 문의: 선교 위원회
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
