import { Cormorant_Garamond } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
});

interface CoreValueCardProps {
  number: string;
  title: string;
  description: string;
}

export default function CoreValueCard({
  number,
  title,
  description,
}: CoreValueCardProps) {
  return (
    <article className="flex min-h-[120px] flex-col items-center rounded-[10px] border-t-[3px] border-[#c9a84c] bg-[#f8f7f4] px-3 py-[18px] text-center">
      <p className={`${cormorantGaramond.className} text-[1.125rem] font-bold leading-none tracking-[0.08em] text-[#c9a84c]`}>
        {number}
      </p>
      <h3 className="mt-1 type-body font-black leading-[1.3] tracking-[0.02em] text-[#1a2744]">
        {title}
      </h3>
      <p className="mt-2 whitespace-pre-line type-body-small leading-[1.5] tracking-[0.02em] text-[#7a7060]">
        {description}
      </p>
    </article>
  );
}
