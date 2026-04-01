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
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-[#c9a84c] md:text-[0.6875rem]">
          {label}
        </p>
        <HeadingTag
          id={id}
          className={`font-[var(--font-serif)] text-[1.75rem] font-bold leading-none tracking-[-0.02em] md:text-[2rem] ${inverted ? "text-white" : "text-[#1a2744]"}`}
        >
          {title}
        </HeadingTag>
      </div>
      <div className="h-px w-9 bg-[#c9a84c]" />
    </div>
  );
}
