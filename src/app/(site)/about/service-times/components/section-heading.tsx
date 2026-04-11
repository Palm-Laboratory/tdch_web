interface SectionHeadingProps {
  title: string;
  subtitle: string;
  as?: "h1" | "h2" | "h3";
}

export default function SectionHeading({
  title,
  subtitle,
  as: HeadingTag = "h2",
}: SectionHeadingProps) {
  return (
    <div className="mb-5">
      <p className="type-label mb-2 font-semibold uppercase tracking-[0.2em] text-site-gold">
        {subtitle}
      </p>
      <HeadingTag className="type-section-title font-section-title font-bold tracking-[0.01em] text-ink">
        {title}
      </HeadingTag>
    </div>
  );
}
