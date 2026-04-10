import { Cormorant_Garamond } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
});

interface CoreValueCardProps {
  number: string;
  title: string;
  description: string;
  className?: string;
}

export default function CoreValueCard({
  number,
  title,
  description,
  className = "",
}: CoreValueCardProps) {
  return (
    <article
      className={`flex min-h-[132px] flex-col items-center justify-start px-5 py-5 text-center tracking-[0.02em] md:min-h-[154px] md:px-6 md:py-4 ${className}`}
    >
      <p
        className={`${cormorantGaramond.className} text-[2.5rem] font-bold leading-none tracking-[0.06em] text-[rgba(26,39,68,0.05)] md:text-[3.25rem]`}
      >
        {number}
      </p>
      <h3 className="mt-2 type-body font-bold leading-none tracking-[0.02em] text-[#1a2744] md:text-[0.95rem]">
        {title}
      </h3>
      <p className="mt-4 whitespace-pre-line type-body-small leading-[1.65] tracking-[0.02em] text-[#7a7060]">
        {description}
      </p>
    </article>
  );
}
