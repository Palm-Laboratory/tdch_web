import Image from "next/image";

interface SermonVideoCardProps {
  href: string;
  thumbnail: string;
  thumbnailAlt: string;
  category: string;
  type: string;
  title: string;
  meta: string;
  date: string;
}

export default function SermonVideoCard({
  href,
  thumbnail,
  thumbnailAlt,
  category,
  type,
  title,
  meta,
  date,
}: SermonVideoCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group overflow-hidden rounded-3xl border border-cedar/14 bg-white shadow-[0_16px_34px_rgba(16,33,63,0.13)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(16,33,63,0.18)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={thumbnail}
          alt={thumbnailAlt}
          fill
          className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/32 to-black/10" />
        <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-md transition group-hover:scale-110">
          <svg className="ml-0.5 h-5 w-5 text-ink" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-cedar">
          <span>{category}</span>
          <span className="text-cedar/40">|</span>
          <span>{type}</span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-ink md:text-lg">
          {title}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-4 text-xs">
          <p className="line-clamp-1 text-ink/55">{meta}</p>
          <p className="shrink-0 font-medium text-ink/40">{date}</p>
        </div>
      </div>
    </a>
  );
}
