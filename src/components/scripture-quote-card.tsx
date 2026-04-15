type ScriptureQuoteCardProps = {
  quote: string;
  reference: string;
  className?: string;
  quoteClassName?: string;
  referenceClassName?: string;
};

export default function ScriptureQuoteCard({
  quote,
  reference,
  className,
  quoteClassName,
  referenceClassName,
}: ScriptureQuoteCardProps) {
  return (
    <blockquote
      className={`rounded-r-[12px] border-l-[3px] border-[#8c7a5b] bg-[#f7f7f4] px-5 py-6 md:px-[30px] md:py-7 ${className ?? ""}`}
    >
      <p className={`quote-card-title font-normal tracking-[-0.01em] text-[#1a2744] ${quoteClassName ?? ""}`}>
        &quot;{quote}&quot;
      </p>
      <p className={`mt-4 type-body-small font-medium tracking-[0.08em] text-[#7a7060] ${referenceClassName ?? ""}`}>
        {reference}
      </p>
    </blockquote>
  );
}
