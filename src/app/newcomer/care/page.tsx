import type { Metadata } from "next";
import ApplicationForm from "./components/application-form";
import BulletList from "./components/bullet-list";
import ClassStructureCard from "./components/class-structure-card";
import CurriculumTable from "./components/curriculum-table";
import OverviewStat from "./components/overview-stat";
import VerseCard from "./components/verse-card";
import Breadcrumb from "@/components/breadcrumb";
import PageHeader from "@/components/page-header";
import SectionHeading from "@/components/section-heading";

const overviewStats = [
  { title: "5주", label: "기간" },
  { title: "주 1회", label: "빈도" },
  { title: "60분", label: "수업시간" },
  { title: "무료", label: "교재" },
] as const;

const curriculumWeeks = [
  {
    week: "01",
    title: "하나님은 어떤 분이신가?",
    details: ["창조주 하나님", "전능하신 하나님", "사랑이신 하나님", "거룩하신 하나님"],
  },
  {
    week: "02",
    title: "인간은 어떤 존재인가?",
    details: ["하나님의 형상으로 창조됨", "아담의 타락과 원죄", "죄의 결과", "사망"],
  },
  {
    week: "03",
    title: "예수님은 누구신가?",
    details: ["그리스도", "약속된 메시아", "구원자", "십자가와 부활", "유일의 길"],
  },
  {
    week: "04",
    title: "교회란 무엇인가? + 핵심 가치 1-3",
    details: ["그리스도의 몸", "기도", "전도", "침례 핵심 가치"],
  },
  {
    week: "05",
    title: "제자란 무엇인가? + 핵심 가치 4-5",
    details: ["그리스도를 따르는 자", "훈련", "선교(3D) 핵심 가치"],
  },
] as const;

const classStructure = [
  {
    minute: 10,
    title: "환영 및 교제",
    details: ["찬양", "지난주 나눔", "출석 확인"],
    widthClassName: "w-2/12",
    toneClassName: "bg-[#dccaae]",
  },
  {
    minute: 30,
    title: "말씀 공부",
    details: ["교재 함께 읽기", "핵심 내용 설명", "질의응답"],
    widthClassName: "w-6/12",
    toneClassName: "bg-[#1a2744]",
  },
  {
    minute: 15,
    title: "나눔 및 적용",
    details: ["나눔 질문 토의", "개인 적용", "실천 과제 안내"],
    widthClassName: "w-3/12",
    toneClassName: "bg-[#b8955a]",
  },
  {
    minute: 5,
    title: "기도",
    details: ["서로를 위한 기도", "파송 기도"],
    widthClassName: "w-1/12",
    toneClassName: "bg-[#d9d9d9]",
  },
] as const;

const baptismMeaning = [
  "예수님과 함께 죽고 다시 사는 연합",
  "왕이신 예수님께 공개적으로 항복",
  "삼위일체 하나님의 가족이 되는 표지",
  "교회 공동체의 정식 구성원",
] as const;

const baptismSchedule = [
  "매월 마지막 주일",
  "담임 목사 + 전도자(양육 교사) 함께 집례",
  "온 몸을 물에 담그는 침수례",
  "침례 후 환영 및 축하",
] as const;

const applicationNotes = [
  "온라인 신청: 우측 양식 작성",
  "오프라인: 주일 예배 후 안내데스크 방문",
] as const;

const timeOptions = [
  { id: "sunday-1pm", label: "주일 오후 1시", defaultChecked: true },
  { id: "wednesday-7pm", label: "수요일 저녁 7시", defaultChecked: false },
] as const;

export const metadata: Metadata = {
  title: "새가족 양육",
  description: "The 제자교회 새가족 양육 5주 과정과 침례 안내 페이지입니다.",
};

export default function NewcomerCarePage() {
  return (
    <div className="flex w-full flex-col">
      <PageHeader
        title="새가족 양육"
        subtitle="DISCIPLESHIP"
        backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
      />
      <Breadcrumb />

      <main className="section-shell section-shell--narrow pt-12 pb-20 md:pt-16 md:pb-24">
        <section aria-labelledby="newcomer-care-intro-title">
          <SectionHeading id="newcomer-care-intro-title" label="5 weeks" title="새가족 양육" />
          <div className="mt-8">
            <VerseCard />
          </div>
        </section>

        <section
          aria-labelledby="newcomer-care-overview-title"
          className="mt-20 md:mt-[68px]"
        >
          <SectionHeading
            id="newcomer-care-overview-title"
            label="overview"
            title="과정 개요"
          />

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {overviewStats.map((stat) => (
              <OverviewStat key={stat.label} title={stat.title} label={stat.label} />
            ))}
          </div>

          <p className="mt-[18px] max-w-[727px] type-body-small leading-[1.7] tracking-[0.02em] text-[#1a2744]">
            새롭게 신앙을 시작하시는 분들을 위한 5주 집중 양육 과정입니다.
            <br className="hidden md:block" />
            소그룹(2-5명) 또는 일대일로 진행되며, 침례 및 정식 교인 등록이 목표입니다.
          </p>
        </section>

        <section
          aria-labelledby="newcomer-care-curriculum-title"
          className="mt-20 md:mt-[68px]"
        >
          <SectionHeading
            id="newcomer-care-curriculum-title"
            label="curriculum"
            title="5주 교육 일정"
          />

          <div className="mt-8">
            <CurriculumTable weeks={curriculumWeeks} />
          </div>
        </section>

        <section
          aria-labelledby="newcomer-care-structure-title"
          className="mt-20 md:mt-[68px]"
        >
          <SectionHeading
            id="newcomer-care-structure-title"
            label="class structure"
            title="매주 60분 수업 구조"
          />

          <div className="mt-8">
            <div className="flex h-[9px] w-full overflow-hidden rounded-full">
              {classStructure.map((item, index) => {
                const edgeClassName = index === 0
                  ? "rounded-l-full"
                  : index === classStructure.length - 1
                    ? "rounded-r-full"
                    : "";

                return (
                  <div
                    key={item.title}
                    className={`${item.widthClassName} ${item.toneClassName} ${edgeClassName}`}
                  />
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 border-b border-black/10 pb-6 md:grid-cols-4 md:gap-x-4 md:pb-6">
              {classStructure.map((item, index) => (
                <div key={item.title} className="relative">
                  {index > 0 ? (
                    <span className="absolute -left-5 top-[30px] hidden text-[#b8955a] md:block">
                      →
                    </span>
                  ) : null}
                  <ClassStructureCard
                    minute={item.minute}
                    title={item.title}
                    details={item.details}
                  />
                </div>
              ))}
            </div>

            <p className="mt-4 type-label leading-none tracking-[0.02em] text-[#888580]">
              총 <span className="font-bold text-[#1a2744]">60분</span> · 소그룹 2-5명 또는
              일대일 진행
            </p>
          </div>
        </section>

        <section
          aria-labelledby="newcomer-care-baptism-title"
          className="mt-20 md:mt-[68px]"
        >
          <SectionHeading
            id="newcomer-care-baptism-title"
            label="baptism"
            title="침례식"
          />

          <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2 md:gap-8">
            <article className="py-2 md:py-8">
              <h3 className="type-lead font-bold leading-none tracking-[0.02em] text-[#1a2744]">
                침례의 의미
              </h3>
              <div className="mt-4">
                <BulletList items={baptismMeaning} />
              </div>
            </article>

            <article className="rounded-[16px] bg-[#1a2744] px-6 py-8 md:px-6">
              <h3 className="type-lead font-bold leading-none tracking-[0.08em] text-[#c9a84c]">
                침례 일정
              </h3>
              <div className="mt-4">
                <BulletList items={baptismSchedule} theme="dark" />
              </div>
            </article>
          </div>
        </section>

        <section
          id="apply"
          className="mt-20 scroll-mt-32 md:mt-[68px] md:scroll-mt-36"
          aria-labelledby="newcomer-care-apply-title"
        >
          <div className="rounded-[12px] bg-[#1a2744] p-6 md:flex md:items-start md:justify-between md:gap-10 md:p-9">
            <div className="md:max-w-[226px]">
              <SectionHeading
                id="newcomer-care-apply-title"
                label="apply"
                title="새가족 양육 신청"
                inverted
              />

              <ul className="mt-6 flex flex-col gap-3">
                {applicationNotes.map((note) => (
                  <li key={note} className="flex items-start gap-1 type-body tracking-[0.02em] text-white">
                    <span aria-hidden="true">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ApplicationForm timeOptions={timeOptions} />
          </div>
        </section>
      </main>
    </div>
  );
}
