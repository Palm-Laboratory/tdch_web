"use client";

import { useState } from "react";

interface CurriculumCourse {
  week: string;
  title: string;
}

interface CurriculumStage {
  level: string;
  title: string;
  duration: string;
  target: string;
  objective: string;
  courses: readonly CurriculumCourse[];
  requirements: readonly string[];
}

interface DisciplesCurriculumProps {
  stages: readonly CurriculumStage[];
  weekNumberClassName: string;
}

export default function DisciplesCurriculum({
  stages,
  weekNumberClassName,
}: DisciplesCurriculumProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedStage = stages[selectedIndex] ?? stages[0];

  return (
    <div className="space-y-7">
      <div className="overflow-hidden rounded-[12px] border border-black/20 bg-white">
        <div className="grid grid-cols-3">
          {stages.map((stage, index) => {
            const isActive = index === selectedIndex;
            const activeClassName = isActive
              ? "bg-[#1a2744] text-white"
              : "bg-white text-[#888580]";

            return (
              <button
                key={stage.level}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedIndex(index)}
                className={`px-3 py-5 text-center transition-colors ${activeClassName} ${index < stages.length - 1 ? "border-r border-black/10" : ""}`}
              >
                <p className="text-[1.125rem] font-black leading-none tracking-[0.02em]">
                  {stage.level}
                </p>
                <p className="mt-2 text-[1rem] leading-none tracking-[0.02em] md:mt-3 md:text-[1.125rem]">
                  {stage.title}
                  <span className="mx-3 opacity-70">·</span>
                  {stage.duration}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <p className="type-body-small tracking-[0.02em] text-[#888580]">
        대상: {selectedStage.target}
        <span className="mx-2">·</span>
        목표: <span className="font-bold text-[#1a2744]">{selectedStage.objective}</span>
      </p>

      <div className="overflow-hidden rounded-[12px] border border-[#7a7060]/30 bg-white">
        <div className="grid grid-cols-[64px_minmax(0,1fr)] md:grid-cols-[80px_minmax(0,1fr)]">
          <div className="flex items-center rounded-tl-[12px] bg-[#1a2744] px-4 py-2">
            <p className="type-body-small tracking-[0.08em] text-white">주차</p>
          </div>
          <div className="flex items-center rounded-tr-[12px] bg-[#1a2744] px-4 py-2 md:px-6">
            <p className="type-body-small tracking-[0.08em] text-white">과목</p>
          </div>
        </div>

        {selectedStage.courses.map((course, index) => {
          const isLast = index === selectedStage.courses.length - 1;
          const surfaceClassName = index % 2 === 0 ? "bg-[#f8f7f4]" : "bg-white";

          return (
            <div
              key={course.week}
              className={`grid grid-cols-[64px_minmax(0,1fr)] md:grid-cols-[80px_minmax(0,1fr)] ${surfaceClassName}`}
            >
              <div
                className={`flex items-center justify-center border-r border-black/10 px-3 py-4 ${!isLast ? "border-b border-[#7a7060]/20" : "rounded-bl-[12px]"}`}
              >
                <span
                  className={`${weekNumberClassName} text-[1.25rem] font-bold leading-none tracking-[0.08em] text-[#c9a84c]`}
                >
                  {course.week}
                </span>
              </div>
              <div
                className={`px-4 py-4 md:px-6 ${!isLast ? "border-b border-[#7a7060]/20" : "rounded-br-[12px]"}`}
              >
                <p className="type-body font-medium leading-[1.5] tracking-[0.02em] text-[#1a2744]">
                  {course.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-[8px] border-l-[3px] border-[#c9a84c] bg-[#f8f7f4] px-6 py-4">
        <p className="type-body font-bold leading-none tracking-[0.02em] text-[#1a2744]">
          수료 요건
        </p>
        <p className="mt-3 type-body-small leading-[1.7] tracking-[0.02em] text-[#7a7060]">
          {selectedStage.requirements.join(" · ")}
        </p>
      </div>
    </div>
  );
}
