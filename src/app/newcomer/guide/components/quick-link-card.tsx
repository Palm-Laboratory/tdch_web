import Link from "next/link";

interface QuickLinkCardProps {
  href: string;
  title: string;
  description: string;
  active: boolean;
}

export default function QuickLinkCard({
  href,
  title,
  description,
  active,
}: QuickLinkCardProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="group flex min-h-[180px] flex-col justify-between rounded-[16px] border border-transparent bg-[#f8f7f4] px-[22px] pt-10 pb-[18px] text-[#1a2744] transition hover:border-[#1a2744] hover:bg-[#1a2744] hover:text-white"
    >
      <div>
        <h3 className="font-[var(--font-serif)] text-[1.125rem] font-bold leading-[1.35]">
          {title}
        </h3>
        <p className="mt-2 type-body-small leading-[1.6] tracking-[0.02em] text-[#7a7060] group-hover:text-white/60">
          {description}
        </p>
      </div>
      <p className="text-[0.875rem] font-medium tracking-[0.05em] text-[#1a2744] group-hover:text-[#c9a84c]">
        자세히 보기 →
      </p>
    </Link>
  );
}
