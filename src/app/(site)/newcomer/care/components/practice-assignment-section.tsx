"use client";

import { useState } from "react";
import SectionHeading from "@/components/section-heading";

const practiceAssignments = [
  {
    weekLabel: "1주차",
    title: "하나님은 어떤 분이신가?",
    tasks: ["창세기 1-2장 읽기", "하나님께 감사 제목 10가지 적기"],
  },
  {
    weekLabel: "2주차",
    title: "인간은 어떤 존재인가?",
    tasks: ["로마서 3:23 읽기", "나의 연약함과 죄를 돌아보며 짧게 기록하기"],
  },
  {
    weekLabel: "3주차",
    title: "예수님은 누구신가?",
    tasks: ["마가복음 15-16장 읽기", "예수님이 나에게 어떤 분이신지 적어보기"],
  },
  {
    weekLabel: "4주차",
    title: "교회란 무엇인가?",
    tasks: ["교회 공동체에서 기대하는 것 3가지 적기", "핵심 가치 1-3 중 가장 마음에 남는 내용 나누기"],
  },
  {
    weekLabel: "5주차",
    title: "제자란 무엇인가?",
    tasks: ["이번 주 실천할 제자도의 한 가지 정하기", "핵심 가치 4-5를 삶에 어떻게 적용할지 적기"],
  },
] as const;

function ToggleMark({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[25px] leading-none ${
        isOpen ? "text-[#7a7060]" : "text-[#c9a84c]"
      }`}
    >
      {isOpen ? "×" : "+"}
    </span>
  );
}

function CheckItem({ task, withTopBorder }: { task: string; withTopBorder: boolean }) {
  return (
    <li className={`flex items-center gap-4 py-[10px] ${withTopBorder ? "border-t border-black/10" : ""}`}>
      <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border border-[#7a7060]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="h-[11px] w-[11px]" fill="none">
          <path
            d="M2 6.2 4.6 8.8 10 3.5"
            stroke="#7a7060"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-[16px] font-normal leading-[1.35] tracking-[0.02em] text-[#7a7060]">
        {task}
      </span>
    </li>
  );
}

export default function PracticeAssignmentSection() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section
      aria-labelledby="newcomer-care-practice-title"
      className="mt-20 md:mt-[68px]"
    >
      <div className="flex flex-col gap-8">
        <div>
          <SectionHeading
            id="newcomer-care-practice-title"
            label="practice"
            title="실천 과제"
          />
          <p className="mt-8 max-w-[787px] text-[15px] font-normal leading-[24px] tracking-[0.02em] text-[#1a2744]">
            매주 주어지는 과제를 통해 배운 것을 삶에 적용합니다.
          </p>
        </div>

        <div>
          {practiceAssignments.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article
                key={item.weekLabel}
                className={`border-black/10 ${isOpen || index < practiceAssignments.length - 1 ? "border-b" : ""}`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-4 text-left md:py-5"
                  aria-expanded={isOpen}
                  onClick={() => {
                    setOpenIndex((current) => (current === index ? -1 : index));
                  }}
                >
                  <div className="flex flex-col gap-2 tracking-[0.02em]">
                    <span className="text-[14px] font-normal leading-[14px] text-[#c9a84c]">
                      {item.weekLabel}
                    </span>
                    <h3 className="type-accordion-title font-medium text-[#1a2744]">
                      {item.title}
                    </h3>
                  </div>
                  <ToggleMark isOpen={isOpen} />
                </button>

                {isOpen ? (
                  <div className="pb-4 md:pb-5">
                    <ul className="flex flex-col">
                      {item.tasks.map((task, taskIndex) => (
                        <CheckItem
                          key={task}
                          task={task}
                          withTopBorder={taskIndex > 0}
                        />
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
