import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import SectionHeading from "@/components/section-heading";
import { cormorantGaramond, gowunBatang } from "@/lib/fonts";
import { createPageMetadata } from "@/lib/seo";
import EthnicProgramTabs from "./components/ethnic-program-tabs";

export const metadata: Metadata = createPageMetadata({
  title: "지상명령 다민족",
  description: "The 제자교회 지상명령 다민족 사역과 선교 참여 안내를 소개합니다.",
  path: "/commission/ethnic",
});

const introQuote = {
  text: "이 천국 복음이 모든 민족에게 증언되기 위하여 온 세상에 전파되리니 그제야 끝이 오리라",
  reference: "마태복음 24:14",
} as const;

const goals = [
  {
    number: "01",
    label: "Unreached",
    title: "미전도 종족 선교",
    description: "복음을 듣지 못한 종족에게 예수 그리스도를 전함",
  },
  {
    number: "02",
    label: "Send",
    title: "선교사 파송 및 후원",
    description: "세계 곳곳에 선교사 파송 · 기도와 재정으로 후원",
  },
  {
    number: "03",
    label: "Network",
    title: "선교 네트워크 구축",
    description: "교회 간 협력 · 선교 정보 공유 · 효과적 선교 전략",
  },
] as const;

const scriptureCards = [
  {
    text: "오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라",
    reference: "사도행전 1:8",
  },
  {
    text: "그런즉 그들이 믿지 아니하는 이를 어찌 부르리요 듣지도 못한 이를 어찌 믿으리요 전파하는 자가 없이 어찌 들으리요",
    reference: "로마서 10:14-15",
  },
  {
    text: "각 족속과 방언과 백성과 나라 가운데에서 사람들을 피로 사서 하나님께 드리시고",
    reference: "요한계시록 5:9",
  },
  {
    text: "그러므로 너희는 가서 모든 민족을 제자로 삼아",
    reference: "마태복음 28:19",
  },
] as const;

const globalStats = [
  {
    label: "세계 인구",
    title: "80억",
    lines: ["기독교인 24억 (30%)", "비기독교인 56억 (70%)"],
  },
  {
    label: "미전도 종족",
    title: "3,200개",
    lines: ["약 30억 명", "복음 접근 0-2%"],
    emphasized: true,
  },
  {
    label: "10/40 창",
    title: "90%",
    lines: ["미전도 종족의 90%", "아시아 · 중동 · 북아프리카"],
  },
] as const;

const missionHistory = [
  {
    period: "2009 — 2025",
    title: "필리핀 산타로사 꿈의교회",
    items: [
      "17년간 필리핀 선교",
      "산타로사 한국학교 운영",
      "현지인 리더 양성 · 현지 8교회 성장",
      "4세대 재생산 제자훈련 실현",
      "2025년 자립 교회로 이양 완료",
    ],
  },
  {
    period: "2026 — 현재",
    title: "한국 더 제자교회 (수원/동탄/용인)",
    items: ["3D 선교 비전 계승", "다음세대 사역 확장", "다문화 가정 섬김", "세계 선교 네트워크 구축"],
  },
] as const;

const missionLessons = [
  {
    number: "01",
    title: "제자훈련 중심",
    lines: ["4세대 재생산 원리", "현지인 리더 양성"],
  },
  {
    number: "02",
    title: "문화 이해",
    lines: ["필리핀 문화 존중", "맥락화된 복음"],
    emphasized: true,
  },
  {
    number: "03",
    title: "자립 목표",
    lines: ["의존성 탈피", "스스로 서는 교회"],
  },
  {
    number: "04",
    title: "협력 선교",
    lines: ["현지 교회와 협력", "단독 사역 지양"],
    emphasized: true,
  },
] as const;

const missionaries = [
  {
    label: "Philippines",
    title: "필리핀 산타로사",
    subtitle: "꿈의교회 (형제교회)",
    items: [
      "전영 목사 (현지인, 담임목사)",
      "이진욱 목사 (고문, 정기 방문)",
      "사역: 교회 목회 · 한국학교 · 제자훈련",
      "후원: 기도 · 재정 · 단기 선교팀",
    ],
  },
  {
    label: "Preparing",
    title: "기타 지역",
    subtitle: "준비 중",
    items: ["10/40 창 지역 · 미전도 종족", "선교사 후보 기도 중"],
  },
] as const;

const missionFields = [
  {
    label: "Philippines",
    title: "필리핀",
    details: [
      ["인구", "약 1억 1천만 명"],
      ["종교", "가톨릭 80% · 개신교 10% · 이슬람 5%"],
      ["언어", "타갈로그어, 영어"],
      ["필요", "제자훈련, 차세대 양육"],
    ],
    sectionLabel: "우리 사역",
    sectionBody: "산타로사 드림교회 · 한국학교",
  },
  {
    label: "10/40 Window",
    title: "미전도 종족",
    groups: [
      {
        title: "기도 중인 지역",
        items: ["중앙 아시아", "중동", "북아프리카"],
      },
      {
        title: "특징",
        items: ["복음 접근 어려움 · 핍박과 위험", "창의적 접근 필요 (비즈니스, 교육)"],
      },
    ],
  },
  {
    label: "North Korea",
    title: "북한 선교 준비",
    groups: [
      {
        title: "현재",
        items: ["탈북민 지원", "통일 준비 기도", "북한 선교 세미나"],
      },
      {
        title: "미래",
        items: ["통일 시대 선교 전략", "북한 교회 개척 준비", "북한 지도자 양성 계획"],
      },
    ],
  },
] as const;

const missionEducation = [
  {
    label: "Mission Sunday",
    title: "선교 주일",
    subtitle: "분기별",
    items: ["선교사 소개", "후원 헌금"],
  },
  {
    label: "Seminar",
    title: "선교 세미나",
    subtitle: "연 2회 (봄·가을)",
    items: ["선교 전문가 초청", "세계 선교 동향 · 미전도 종족 · 창의적 접근 · 선교사 생활"],
  },
  {
    label: "Books",
    title: "선교 도서",
    subtitle: "상시",
    items: ["선교 도서 코너", "추천 도서 목록", "독서 모임"],
  },
  {
    label: "Film",
    title: "선교 영화",
    subtitle: "분기 1회",
    items: ["선교 관련 영화 상영", "토론 및 나눔"],
  },
] as const;

const calendarItems = [
  ["Jan", "1월", "신년 선교 기도회 · 단기선교"],
  ["Feb", "2월", "탈북민 주일"],
  ["Mar", "3월", "선교사 자녀 축복 예배"],
  ["Apr", "4월", "부활절 선교 헌금"],
  ["May", "5월", "선교사의 날"],
  ["Jun", "6월", "선교 세미나 (봄)"],
  ["Jul", "7월", "여름 단기 선교 (필리핀)"],
  ["Aug", "8월", "선교 대회"],
  ["Sep", "9월", "추석 선교사 돌봄"],
  ["Oct", "10월", "세계 선교 주일"],
  ["Nov", "11월", "선교 세미나 (가을)"],
  ["Dec", "12월", "성탄 선교 헌금"],
] as const;

const participationMethods = [
  "선교 기도회 참여",
  "선교 헌금",
  "단기 선교 (필리핀)",
  "장기 선교사 지원",
  "선교사 입양 (기도/후원)",
  "선교 교육 봉사",
] as const;

const interestRegions = ["필리핀", "10/40 창", "북한/탈북민", "기타"] as const;

const ctaCards = [
  {
    label: "Pray",
    title: "선교 기도회 참여",
    description: "매월 마지막 주 금요일",
  },
  {
    label: "Send",
    title: "선교 헌금 후원",
    description: "매월 넷째 주일 선교 주일",
  },
  {
    label: "Go",
    title: "단기 선교 참여",
    description: "연 2회 (여름 · 겨울)",
  },
] as const;

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

function GoldButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-[8px] bg-[#c9a84c] px-[18px] py-[14px] text-[14px] font-bold tracking-[0.04em] text-white transition hover:bg-[#b79436] ${className}`}
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

function BulletLines({ items, className = "" }: { items: readonly string[]; className?: string }) {
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

function StaticCheckbox({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-3 text-[14px] tracking-[0.02em] text-[#4a4845]">
      <span className="h-4 w-4 rounded-[4px] border border-[#d0cdca] bg-white" />
      <span>{label}</span>
    </label>
  );
}

export default function CommissionEthnicPage() {
  return (
    <main className="section-shell section-shell--narrow pt-10 pb-20 md:pt-16 md:pb-24">
      <section aria-labelledby="commission-ethnic-intro-title">
        <SectionHeading id="commission-ethnic-intro-title" label="Multi-Ethnic" title="다민족" />

        <p className="mt-6 type-body leading-[1.7] tracking-[0.02em] text-black">땅 끝까지, 모든 민족에게</p>

        <QuoteCard text={introQuote.text} reference={introQuote.reference} className="mt-4" />
      </section>

      <SectionBlock label="vision" title="다민족 선교의 3대 목표" className="mt-20 md:mt-[68px]">
        <div className="mt-5 max-w-[780px] space-y-0">
          <p className="type-body leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
            더 제자교회는 필리핀 17년 선교의 경험을 바탕으로 세계 선교에 헌신합니다.
          </p>
          <p className="type-body leading-[1.8] tracking-[0.02em] text-[#4f4a42]">
            예수님의 마지막 명령인 &quot;모든 민족을 제자로 삼으라&quot;는 지상명령을 이루기 위해 땅
            끝까지 복음을 전합니다.
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

      <SectionBlock label="biblical basis" title="성경적 근거" className="mt-20 md:mt-[68px]">
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {scriptureCards.map((card) => (
            <QuoteCard key={card.reference} text={card.text} reference={card.reference} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock label="Global Status" title="세계 선교 현황" className="mt-20 md:mt-[68px]">
        <div className="mt-8 overflow-hidden rounded-[12px] border border-[#d0cdca] md:grid md:grid-cols-3">
          {globalStats.map((stat, index) => (
            <article
              key={stat.label}
              className={`px-6 py-6 text-center ${
                stat.emphasized ? "bg-[#f8f7f4]" : "bg-white"
              } ${index < globalStats.length - 1 ? "border-b border-[#d0cdca] md:border-b-0 md:border-r" : ""}`}
            >
              <p className="text-[11px] tracking-[0.08em] text-[#888580]">{stat.label}</p>
              <h3 className="mt-3 font-section-title text-[34px] font-black tracking-[-0.02em] text-[#0f2044] md:text-[40px]">
                {stat.title}
              </h3>
              <div className="mt-4 space-y-2 text-[14px] tracking-[0.02em] text-[#888580]">
                {stat.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1.05fr]">
          <div className="rounded-[16px] bg-[#f2f0ec] px-6 py-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#c9a84c]">10/40 창 (Window)</p>
            <BulletLines
              items={[
                "북위 10도-40도 사이 지역",
                "아시아, 중동, 북아프리카",
                "세계 인구의 60% 거주",
                "세계 빈곤의 대부분 집중",
              ]}
              className="mt-5"
            />
          </div>

          <div className="rounded-[16px] bg-[#1a2744] px-6 py-7 text-white">
            <p className="text-[12px] font-bold tracking-[0.22em] text-[#c9a84c]">긴급성</p>
            <h3 className="mt-5 font-section-title text-[20px] font-black tracking-[0.02em]">매일 15만 명 사망</h3>
            <p className="mt-4 text-[15px] leading-[1.8] tracking-[0.02em] text-white/60">
              그 중 약 10만명이
              <br />
              복음을 한번도 듣지 못한 채 세상을 떠납니다.
            </p>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock label="Mission history" title="더 제자교회 선교 사역" className="mt-20 md:mt-[68px]">
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
            <h3 className="mt-5 text-[16px] font-bold tracking-[0.04em] text-[#4a4840]">{missionHistory[0].title}</h3>
            <BulletLines items={missionHistory[0].items} className="mt-6" />
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
            <h3 className="mt-5 text-[16px] font-bold tracking-[0.04em] text-[#4a4840]">{missionHistory[1].title}</h3>
            <BulletLines items={missionHistory[1].items} className="mt-6" />
          </div>
        </div>

        <div className="mt-10 border-t border-[#d0cdca] pt-8">
          <p className="text-[12px] font-bold tracking-[0.22em] text-[#c9a84c]">선교에서 배운 교훈</p>
          <div className="mt-5 overflow-hidden rounded-[12px] border border-[#d0cdca] md:grid md:grid-cols-4">
            {missionLessons.map((lesson, index) => (
              <article
                key={lesson.number}
                className={`px-5 py-6 ${lesson.emphasized ? "bg-[#f8f7f4]" : "bg-white"} ${
                  index < missionLessons.length - 1 ? "border-b border-[#d0cdca] md:border-b-0 md:border-r" : ""
                }`}
              >
                <p className={`${cormorantGaramond.className} text-[20px] tracking-[0.1em] text-[#c9a84c]`}>
                  {lesson.number}
                </p>
                <h3 className="mt-2 font-section-title text-[18px] font-bold tracking-[0.02em] text-[#0f2044]">
                  {lesson.title}
                </h3>
                <div className="text-[14px] leading-[1.6] tracking-[0.02em] text-[#888580]">
                  {lesson.lines.map((line, lineIndex) => (
                    <p key={line} className={lineIndex === 0 ? "mt-3" : "mt-1"}>
                      {line}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock label="Missionaries" title="현재 파송 선교사" className="mt-20 md:mt-[68px]">
        <div className="mt-8">
          {missionaries.map((missionary, index) => (
            <div
              key={missionary.title}
              className={`flex flex-col gap-6 py-6 md:flex-row md:gap-10 ${
                index === 0 ? "border-t border-[#d0cdca]" : "border-t border-[#f2f0ec]"
              }`}
            >
              <div className="md:w-[220px] md:shrink-0">
                <p className="text-[11px] tracking-[0.24em] text-[#c9a84c] uppercase">{missionary.label}</p>
                <h3 className="mt-3 text-[20px] font-bold tracking-[0.02em] text-[#0f2044]">{missionary.title}</h3>
                <p className="mt-2 text-[13px] tracking-[0.02em] text-[#888580]">{missionary.subtitle}</p>
              </div>
              <BulletLines items={missionary.items} className="flex-1" />
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock label="Programs" title="선교 프로그램" className="mt-20 md:mt-[68px]">
        <EthnicProgramTabs />
      </SectionBlock>

      <SectionBlock label="Mission Fields" title="선교 지역 소개" className="mt-20 md:mt-[68px]">
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {missionFields.map((field) => (
            <article key={field.title} className="overflow-hidden rounded-[12px] border border-[#d0cdca] bg-white">
              <div className="bg-[#1a2744] px-4 py-[14px]">
                <p className={`${cormorantGaramond.className} text-[12px] tracking-[0.28em] text-[#c9a84c] uppercase`}>
                  {field.label}
                </p>
                <h3 className="mt-2 font-section-title text-[20px] font-black tracking-[0.02em] text-white">
                  {field.title}
                </h3>
              </div>

              <div className="space-y-3 px-4 py-[14px]">
                {"details" in field && field.details ? (
                  <>
                    <div className="space-y-3 text-[13px] tracking-[0.02em]">
                      {field.details.map(([label, value]) => (
                        <div key={label} className="flex gap-4">
                          <span className="w-10 shrink-0 text-[#888580]">{label}</span>
                          <span className="leading-[1.55] text-[#4a4845]">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-[#f0ece5] pt-3">
                      <p className="text-[11px] font-medium tracking-[0.18em] text-[#c9a84c]">{field.sectionLabel}</p>
                      <p className="mt-3 text-[13px] leading-[1.55] tracking-[0.02em] text-[#4a4845]">{field.sectionBody}</p>
                    </div>
                  </>
                ) : null}

                {"groups" in field && field.groups
                  ? field.groups.map((group, index) => (
                      <div key={group.title} className={index > 0 ? "border-t border-[#f0ece5] pt-3" : ""}>
                        <p className="text-[12px] font-medium tracking-[0.08em] text-[#c9a84c]">{group.title}</p>
                        <BulletLines items={group.items} className="mt-3 !space-y-2" />
                      </div>
                    ))
                  : null}
              </div>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock label="Mission Education" title="선교 교육" className="mt-20 md:mt-[68px]">
        <div className="mt-8">
          {missionEducation.map((item, index) => (
            <div
              key={item.title}
              className={`flex flex-col gap-6 py-6 md:flex-row md:gap-10 ${
                index === 0 ? "border-t border-[#d0cdca]" : "border-t border-[#f2f0ec]"
              }`}
            >
              <div className="md:w-[220px] md:shrink-0">
                <p className="text-[11px] tracking-[0.24em] text-[#c9a84c] uppercase">{item.label}</p>
                <h3 className="mt-3 text-[20px] font-bold tracking-[0.02em] text-[#0f2044]">{item.title}</h3>
                <p className="mt-2 text-[13px] tracking-[0.02em] text-[#888580]">{item.subtitle}</p>
              </div>
              <BulletLines items={item.items} className="flex-1" />
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock label="Annual Calendar" title="선교 달력" className="mt-20 md:mt-[68px]">
        <div className="mt-8 overflow-hidden rounded-[12px] border border-[#d0cdca] md:grid md:grid-cols-4">
          {calendarItems.map(([eng, kr, desc], index) => {
            const isCreamRow = index >= 4 && index <= 7;
            return (
              <article
                key={eng}
                className={`px-4 py-[18px] ${isCreamRow ? "bg-[#f8f7f4]" : "bg-white"} ${
                  index % 4 !== 3 ? "md:border-r md:border-[#d0cdca]" : ""
                } ${
                  index < 8 ? "border-b border-[#d0cdca]" : ""
                }`}
              >
                <p className={`${cormorantGaramond.className} text-[22px] tracking-[0.04em] text-[#c9a84c]`}>{eng}</p>
                <h3 className="text-[22px] font-bold tracking-[0.02em] text-[#0f2044]">{kr}</h3>
                <p className="mt-2 text-[13px] leading-[1.55] tracking-[0.02em] text-[#888580]">{desc}</p>
              </article>
            );
          })}
        </div>
      </SectionBlock>

      <SectionBlock label="Participate" title="참여 방법" className="mt-20 md:mt-[68px]">
        <div className="mt-8 overflow-hidden rounded-[12px] border border-[#d0cdca]">
          <div className="bg-[#1a2744] px-5 py-[18px]">
            <p className={`${cormorantGaramond.className} text-[12px] tracking-[0.28em] text-[#c9a84c] uppercase`}>
              Mission participation form
            </p>
          </div>

          <div className="grid gap-10 bg-white p-7 md:grid-cols-2">
            <div className="space-y-10">
              <div>
                <p className="text-[12px] font-bold tracking-[0.08em] text-[#c9a84c]">기본 정보</p>
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-[12px] font-medium tracking-[0.02em] text-[#888580]">이름</label>
                    <input
                      value=""
                      readOnly
                      placeholder="이름을 입력하세요"
                      className="mt-1.5 h-[42px] w-full rounded-[6px] border border-[#d0cdca] bg-[#f8f7f4] px-5 text-[12px] text-[#888580] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium tracking-[0.02em] text-[#888580]">연락처</label>
                    <input
                      value=""
                      readOnly
                      placeholder="연락처를 입력하세요"
                      className="mt-1.5 h-[42px] w-full rounded-[6px] border border-[#d0cdca] bg-[#f8f7f4] px-5 text-[12px] text-[#888580] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[12px] font-bold tracking-[0.08em] text-[#c9a84c]">참여 방법</p>
                <div className="mt-5 space-y-4">
                  {participationMethods.map((item) => (
                    <StaticCheckbox key={item} label={item} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="text-[12px] font-bold tracking-[0.08em] text-[#c9a84c]">관심 지역</p>
                <div className="mt-5 space-y-4">
                  {interestRegions.map((item) => (
                    <StaticCheckbox key={item} label={item} />
                  ))}
                  <input
                    value=""
                    readOnly
                    placeholder="기타 지역을 입력하세요"
                    className="h-[42px] w-full rounded-[6px] border border-[#d0cdca] bg-[#f8f7f4] px-5 text-[12px] text-[#888580] outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-[#f0ece5] pt-5">
                <div className="space-y-2 text-[12px] font-medium tracking-[0.02em] text-[#888580]">
                  <p>담당자가 연락드립니다.</p>
                  <p>선교부 문의: 선교 위원회</p>
                </div>
                <GoldButton href="/about/location#contact-info" className="mt-5 w-full">
                  신청하기
                </GoldButton>
              </div>
            </div>
          </div>
        </div>
      </SectionBlock>

      <section className="mt-20 md:mt-[68px]" aria-labelledby="commission-ethnic-cta-title">
        <div className="rounded-[12px] bg-[#1a2744] px-6 py-9 md:px-9 md:py-9">
          <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#c9a84c]">join us</p>
          <h2
            id="commission-ethnic-cta-title"
            className="mt-3 text-[28px] font-section-title font-black tracking-[0.02em] text-white"
          >
            모든 민족이 제자가 되는 그날까지
          </h2>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {ctaCards.map((card) => (
              <article key={card.title} className="rounded-[8px] bg-white/5 px-[14px] py-4">
                <p className={`${cormorantGaramond.className} text-[10px] tracking-[0.3em] uppercase text-[#c9a84c]`}>
                  {card.label}
                </p>
                <h3 className="mt-2 text-[18px] font-bold tracking-[0.02em] text-white">{card.title}</h3>
                <p className="mt-2 text-[12px] tracking-[0.02em] text-white/50">{card.description}</p>
              </article>
            ))}
          </div>

          <GoldButton href="/about/giving" className="mt-8">
            후원하기
          </GoldButton>
        </div>
      </section>
    </main>
  );
}
