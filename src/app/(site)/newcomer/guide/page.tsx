import type { Metadata } from "next";
import CoreValueCard from "./components/core-value-card";
import NewcomerFaqAccordion from "./components/newcomer-faq-accordion";
import NewcomerContactSection from "./components/newcomer-contact-section";
import TimelineStep from "./components/timeline-step";
import Breadcrumb from "@/components/breadcrumb";
import PageHeader from "@/components/page-header";
import SectionHeading from "@/components/section-heading";
import ScriptureQuoteCard from "@/components/scripture-quote-card";
import { redirectToCanonicalStaticPathIfNeeded } from "@/lib/canonical-menu-path";
import { cormorantGaramond, nanumMyeongjo } from "@/lib/fonts";
import { createPageMetadata } from "@/lib/seo";

const newcomerIntroParagraphs = [
  "대천침례교회는 예수님의 지상명령에 따라 사람을 제자로 세우고, 그 제자가 또 다른 사람을 세워 가는 교회가 되기를 소망합니다.",
  "필리핀 17년 선교 현장에서 배운 제자훈련의 경험을 바탕으로 한 분 한 분과 천천히 함께 걷겠습니다. 처음 오셨다면 편안하게 앉아 계시기만 해도 괜찮습니다.",
] as const;

const coreValues = [
  { number: "01", title: "기도", description: "위로부터 부어지는\n능력을 받는 교회" },
  { number: "02", title: "전도", description: "제자 삼는 교회\n(예수님의 3대 사역)" },
  { number: "03", title: "목장", description: "성령공동체" },
  { number: "04", title: "훈련", description: "모든 것을 가르쳐\n지키게 하는 교회" },
  { number: "05", title: "선교", description: "함께하는 교회\n(땅 끝까지)" },
] as const;

const gettingStartedSteps = [
  {
    number: "01",
    title: "첫 방문",
    details: ["주일 예배 참석", "환영 선물 수령", "새가족 카드 작성"],
  },
  {
    number: "02",
    title: "새가족 환영",
    details: ["담임목사 인사", "새가족부 인사", "교회 안내", "목장 안내"],
  },
  {
    number: "03",
    title: "새가족 양육 신청",
    details: ["5주 과정 안내", "교재 제공", "멘토 연결", "일정 조율"],
  },
  {
    number: "04",
    title: "교인 정식 등록",
    details: ["새가족 양육 5주 이수 후 정식 교인 등록", "목장 배치", "침례식"],
  },
  {
    number: "05",
    title: "제자 훈련 시작",
    details: ["1단계 제자훈련 신청(12주)", "섬김 사역", "평신도 제자도의 시작"],
  },
] as const;

const newcomerFaqItems = [
  {
    question: "새가족 양육은 꼭 받아야 하나요?",
    answer:
      "정식 교인이 되기 위해서는 새가족 양육 5주 과정을 이수해야 합니다. 신앙의 기초를 든든히 하고 교회 가족이 되는 중요한 과정입니다.",
  },
  {
    question: "양육은 언제 시작하나요?",
    answer: "새가족 양육은 주일반과 주중반으로 진행합니다. 연중 언제든지 신청가능합니다.\n다만, 새가족 양육 이후 제자훈련반은 각 분기별로 실시합니다.",
  },
  {
    question: "양육 시간은 어떻게 되나요?",
    answer: "주일과 주중 반 모임에 각 1시간이 소요됩니다.",
  },
  {
    question: "신앙이 확실하지 않아도 받을 수 있나요?",
    answer:
      "물론입니다! 새가족 양육은 바로 그런 분들을 위한 과정입니다. 하나님, 인간, 예수님, 교회, 제자에 대해 차근차근 배우게 됩니다.",
  },
  {
    question: "혼자 오기 부담스러워요.",
    answer: "가족, 친구와 함께 오셔도 좋습니다. 담당 교사가 친절하게 안내해 드립니다.",
  },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "새가족 안내",
  description: "대천침례교회 새가족 안내와 제자 양육 비전을 소개합니다.",
  path: "/newcomer/guide",
});

// 페이지 UI 마크업 시작
export default async function NewcomerGuidePage() {
  await redirectToCanonicalStaticPathIfNeeded("newcomer.guide", "/newcomer/guide");

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        title="새가족 안내"
        subtitle="NEWCOMER"
        backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
      />
      <Breadcrumb />

      <main className="section-shell section-shell--narrow pt-12 pb-20 md:pt-16 md:pb-24">
        <section aria-labelledby="newcomer-intro-title">
          <SectionHeading id="newcomer-intro-title" label="newcomer" title="새가족 안내" />

          <ScriptureQuoteCard
            quote="그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 침례를 베풀고 내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라"
            reference="마태복음 28:19-20"
            className="mt-8"
            quoteClassName={nanumMyeongjo.className}
            referenceClassName="type-body"
          />

          <div className="mt-6 max-w-[727px] space-y-2">
            {newcomerIntroParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="type-body leading-[1.7] tracking-[0.02em] text-[#1a2744]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="newcomer-vision-title"
          className="mt-20 md:mt-[68px]"
        >
          <SectionHeading
            id="newcomer-vision-title"
            label="church vision"
            title="대천침례교회는?"
          />

          <p className="mt-5 max-w-[787px] type-body leading-[1.7] tracking-[0.02em] text-[#1a2744]">
            대천침례교회는 1971년 미국 교회들의 사랑과 기도로 세워졌습니다. 받은 사랑을 나누는 선교의 마음을 교회의 DNA로 간직하며, 지금도 예수님의 지상명령을 따라 걸어갑니다.
          </p>

          <div className="mt-7">
            <h3 className="text-[18px] font-normal leading-[1] tracking-[3px] text-[#c9a84c]">
              5대 핵심가치
            </h3>
            <div className="mt-3 border-y border-black/10 py-4 md:py-5">
              <div className="lg:hidden">
                {coreValues.map((item, index) => (
                  <div
                    key={item.number}
                    className={`flex items-start gap-4 px-1 py-5 text-left md:gap-6 ${
                      index === 0 ? "" : "border-t border-[#f2f0ec]"
                    }`}
                  >
                    <div className="flex w-[112px] shrink-0 gap-4 md:w-[210px] md:gap-5">
                      <span
                        className={`${cormorantGaramond.className} w-[32px] translate-y-[0.02em] text-left text-[1.8rem] font-normal leading-[0.8] tracking-[0.08em] text-[#c9a84c] md:text-[2rem] md:leading-[0.5]`}
                      >
                        {item.number}
                      </span>
                      <h3
                        className={`${nanumMyeongjo.className} text-[1.125rem] font-bold leading-[2] tracking-[0.02em] text-[#0f2044] md:text-[1.375rem] md:leading-[1.3]`}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p className="flex-1 pt-0.5 type-body-small leading-[1.7] tracking-[0.02em] text-[#888580] md:leading-[1.2]">
                      {item.description.replace(/\n/g, " ")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="hidden lg:grid lg:grid-cols-5 lg:gap-y-0">
                {coreValues.map((item, index) => (
                  <CoreValueCard
                    key={item.number}
                    {...item}
                    className={index === coreValues.length - 1 ? "border-r-0" : "border-r border-black/10"}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="newcomer-getting-started-title"
          className="mt-20 md:mt-[68px]"
        >
          <SectionHeading
            id="newcomer-getting-started-title"
            label="getting started"
            title="새가족을 위한 안내"
          />

          <div className="mt-8 space-y-4 md:space-y-4">
            {gettingStartedSteps.map((step, index) => (
              <TimelineStep
                key={step.number}
                {...step}
                surfaceClassName={index % 2 === 1 ? "bg-white" : "bg-[#f8f7f4]"}
                isFirst={index === 0}
                isLast={index === gettingStartedSteps.length - 1}
              />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="newcomer-faq-title"
          className="mt-20 md:mt-[68px]"
        >
          <SectionHeading id="newcomer-faq-title" label="faq" title="자주 묻는 질문" />
          <div className="mt-8">
            <NewcomerFaqAccordion items={newcomerFaqItems} />
          </div>
        </section>

        <NewcomerContactSection />
      </main>
    </div>
  );
}
