import { Cormorant_Garamond } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
});

interface TimelineStepProps {
  number: string;
  title: string;
  details: readonly string[];
  surfaceClassName: string;
  isFirst: boolean;
  isLast: boolean;
}

export default function TimelineStep({
  number,
  title,
  details,
  surfaceClassName,
  isFirst,
  isLast,
}: TimelineStepProps) {
  return (
    <article className="relative pl-10 md:pl-14">
      {!isFirst ? (
        <div className="absolute left-[10.5px] top-[-16px] bottom-1/2 w-px bg-[#d0cdca] md:left-[28.5px]" />
      ) : null}
      {!isLast ? (
        <div className="absolute left-[10.5px] top-1/2 bottom-[-16px] w-px bg-[#d0cdca] md:left-[28.5px]" />
      ) : null}
      <div className="absolute left-0 top-1/2 flex h-[22px] w-[22px] -translate-y-1/2 items-center justify-center rounded-full border border-[#c9a84c] bg-[#1a2744] md:left-2 md:h-[42px] md:w-[42px] md:border-[1.5px]">
        <span className={`${cormorantGaramond.className} text-[0.75rem] font-bold leading-none tracking-[0.08em] text-[#c9a84c] md:text-[1.125rem]`}>
          {number}
        </span>
      </div>
      <div className={`rounded-[8px] px-4 py-4 md:px-6 md:py-[18px] ${surfaceClassName}`}>
        <h3 className="type-body font-bold leading-none tracking-[0.02em] text-[#1a2744]">
          {title}
        </h3>
        <p className="mt-2 type-body-small leading-[1.5] tracking-[0.02em] text-[#7a7060]">
          {details.join(" · ")}
        </p>
      </div>
    </article>
  );
}
