interface SectionHeadingProps {
  id?: string;
  label: string;
  title: string;
  inverted?: boolean;
  as?: "h1" | "h2" | "h3";
}

export default function SectionHeading({
  id,
  label,
  title,
  inverted = false,
  as: HeadingTag = "h2",
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="type-label font-semibold uppercase tracking-[0.28em] text-site-gold">
          {label}
        </p>
        <HeadingTag
          id={id}
          className={`type-section-title font-section-title font-bold tracking-[-0.02em] ${inverted ? "text-white" : "text-site-ink"}`}
        >
          {title}
        </HeadingTag>
      </div>
      <div className="h-px w-9 bg-site-gold" />
    </div>
  );
}
