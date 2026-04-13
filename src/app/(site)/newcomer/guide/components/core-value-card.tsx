import { cormorantGaramond } from "@/lib/fonts";

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
        className={`${cormorantGaramond.className} text-[2.5rem] font-bold leading-none tracking-[0.06em] text-site-ink/5 md:text-[3.25rem]`}
      >
        {number}
      </p>
      <h3 className="mt-2 type-card-title font-section-title font-bold leading-none tracking-[0.02em] text-site-ink">
        {title}
      </h3>
      <p className="mt-4 whitespace-pre-line type-body-small tracking-[0.02em] text-site-muted">
        {description}
      </p>
    </article>
  );
}
