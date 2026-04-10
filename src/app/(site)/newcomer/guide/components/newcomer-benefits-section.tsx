import { Cormorant_Garamond } from "next/font/google";
import SectionHeading from "@/components/section-heading";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const newcomerBenefits = [
  {
    number: "01",
    title: "새가족 환영 선물",
    description: "처음 오신 날, 마음을 담은 환영 선물을 드려요",
  },
  {
    number: "02",
    title: "양육 교재 무료 제공",
    description: "새가족 양육 5주 과정의 교재를 무료로 드려요",
  },
  {
    number: "03",
    title: "담당 교사 1:1 멘토링",
    description: "전담 교사가 신앙의 첫 걸음을 함께 걸어드려요",
  },
  {
    number: "04",
    title: "교회 생활 안내 책자",
    description: "교회를 더 잘 알 수 있는 안내 책자를 드려요",
  },
  {
    number: "05",
    title: "침례 기념 사진 및 증서",
    description: "침례의 소중한 순간을 사진과 증서로 기념해요",
  },
  {
    number: "06",
    title: "소그룹 우선 배정",
    description: "함께할 소그룹 가족을 우선적으로 연결해 드려요",
  },
] as const;

function BenefitItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="flex items-start gap-4 border-b border-black/10 px-1 py-6 md:gap-5 md:py-7">
      <div className="min-w-[3.5rem] pt-1 text-center md:min-w-[4.25rem]">
        <p
          className={`${cormorantGaramond.className} text-[3.25rem] font-bold leading-[20px] tracking-[0.06em] text-[rgba(201,168,76,0.3)]`}
        >
          {number}
        </p>
      </div>
      <div className="min-w-0">
        <h3 className="text-[14px] font-bold leading-[14px] tracking-[0.02em] text-[#1a2744]">
          {title}
        </h3>
        <p className="mt-[10px] text-[14px] font-normal leading-[14px] tracking-[0.02em] text-[#7a7060]">
          {description}
        </p>
      </div>
    </article>
  );
}

export default function NewcomerBenefitsSection() {
  const leftColumn = newcomerBenefits.slice(0, 3);
  const rightColumn = newcomerBenefits.slice(3);

  return (
    <section
      aria-labelledby="newcomer-benefits-title"
      className="mt-20 md:mt-[68px]"
    >
      <SectionHeading
        id="newcomer-benefits-title"
        label="benefits"
        title="새가족을 위한 특전"
      />

      <div className="mt-7 grid gap-x-9 md:mt-8 md:grid-cols-2">
        <div>
          {leftColumn.map((item) => (
            <BenefitItem key={item.number} {...item} />
          ))}
        </div>
        <div>
          {rightColumn.map((item) => (
            <BenefitItem key={item.number} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
