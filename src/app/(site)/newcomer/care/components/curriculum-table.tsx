import { cormorantGaramond } from "@/lib/fonts";

interface CurriculumWeek {
  week: string;
  title: string;
  details: readonly string[];
}

interface CurriculumTableProps {
  weeks: readonly CurriculumWeek[];
}

export default function CurriculumTable({ weeks }: CurriculumTableProps) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#7a7060]/30 bg-white">
      <div className="grid grid-cols-[64px_minmax(0,1fr)] md:grid-cols-[80px_minmax(0,1fr)]">
        <div className="flex h-10 items-center rounded-tl-[12px] bg-[#1a2744] px-4">
          <p className="type-body tracking-[0.08em] text-white">주차</p>
        </div>
        <div className="flex h-10 items-center rounded-tr-[12px] bg-[#1a2744] px-4 md:px-6">
          <p className="type-body tracking-[0.08em] text-white">주제 및 내용</p>
        </div>
      </div>

      {weeks.map((week, index) => {
        const isLast = index === weeks.length - 1;
        const surfaceClassName = index % 2 === 1 ? "bg-[#f8f7f4]" : "bg-white";

        return (
          <div
            key={week.week}
            className={`grid grid-cols-[64px_minmax(0,1fr)] md:grid-cols-[80px_minmax(0,1fr)] ${surfaceClassName}`}
          >
            <div
              className={`flex items-center justify-center border-r border-black/10 px-3 py-5 ${!isLast ? "border-b border-[#7a7060]/20" : "rounded-bl-[12px]"}`}
            >
              <span
                className={`${cormorantGaramond.className} type-card-title font-bold leading-none tracking-[0.08em] text-[#c9a84c]`}
              >
                {week.week}
              </span>
            </div>
            <div
              className={`px-4 py-3 md:px-6 md:py-[14px] ${!isLast ? "border-b border-[#7a7060]/20" : "rounded-br-[12px]"}`}
            >
              <p className="type-body font-bold leading-[1.3] tracking-[-0.01em] text-[#1a2744]">
                {week.title}
              </p>
              <p className="mt-1 type-body-small leading-[1.5] tracking-[0.02em] text-[#7a7060]">
                {week.details.join(" · ")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
