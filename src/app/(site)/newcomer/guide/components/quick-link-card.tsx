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
      className="group flex min-h-[180px] flex-col justify-between rounded-[16px] border border-transparent bg-site-surface px-[22px] pt-10 pb-[18px] text-site-ink transition hover:border-site-ink hover:bg-site-ink hover:text-white"
    >
      <div>
        <h3 className="type-card-title font-section-title font-bold">
          {title}
        </h3>
        <p className="mt-2 type-body-small tracking-[0.02em] text-site-muted group-hover:text-white/60">
          {description}
        </p>
      </div>
      <p className="type-body-small font-medium tracking-[0.05em] text-site-ink group-hover:text-site-gold">
        자세히 보기 →
      </p>
    </Link>
  );
}
