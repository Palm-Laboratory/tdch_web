import { Cormorant_Garamond } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
});

interface ClassStructureCardProps {
  minute: number;
  title: string;
  details: readonly string[];
}

export default function ClassStructureCard({
  minute,
  title,
  details,
}: ClassStructureCardProps) {
  return (
    <article className="relative flex flex-col items-center gap-3 text-center">
      <div className="flex items-end gap-1">
        <span
          className={`${cormorantGaramond.className} type-section-title font-bold leading-none text-[#c9a84c]`}
        >
          {minute}
        </span>
        <span className="pb-[2px] type-body leading-none text-[#888580]">분</span>
      </div>
      <h3 className="type-body font-bold leading-none tracking-[-0.01em] text-[#1a2744]">
        {title}
      </h3>
      <div className="flex flex-col gap-2 type-label leading-none text-[#888580]">
        {details.map((detail) => (
          <p key={detail}>{detail}</p>
        ))}
      </div>
    </article>
  );
}
