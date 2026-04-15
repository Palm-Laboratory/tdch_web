import { nanumMyeongjo } from "@/lib/fonts";

interface OverviewStatProps {
  title: string;
  label: string;
}

export default function OverviewStat({ title, label }: OverviewStatProps) {
  return (
    <article className="flex min-h-[96px] items-center justify-center rounded-[12px] bg-[#f8f7f4] px-4 py-5 text-center">
      <div className="flex flex-col items-center gap-3 tracking-[0.04em]">
        <p className={`${nanumMyeongjo.className} text-[22px] font-black leading-none text-[#1a2744]`}>
          {title}
        </p>
        <p className="type-body leading-none text-[#7a7060]">{label}</p>
      </div>
    </article>
  );
}
