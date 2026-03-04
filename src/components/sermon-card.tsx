import Image from "next/image";
import Link from "next/link";
import type { SermonCardData } from "@/lib/site-data";

interface SermonCardProps {
    data: SermonCardData;
    youtubeUrl: string;
    shadowClass?: string;
}

export default function SermonCard({ data, youtubeUrl, shadowClass = "shadow-[0_16px_34px_rgba(16,33,63,0.15)]" }: SermonCardProps) {
    const href = data.href || youtubeUrl;
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={`group overflow-hidden rounded-3xl border border-cedar/14 bg-white ${shadowClass} transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(16,33,63,0.18)]`}
        >
            {/* 썸네일 */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                    src={data.thumbnail}
                    alt={data.thumbnailAlt}
                    fill
                    className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/10" />
                {/* 플레이 버튼 */}
                <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-md transition group-hover:scale-110">
                    <svg className="ml-0.5 h-5 w-5 text-ink" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>

            {/* 텍스트 영역 */}
            <div className="p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-cedar">
                    <span>{data.category}</span>
                    <span className="text-cedar/40">|</span>
                    <span>{data.type}</span>
                </div>
                <h3 className="mt-2 text-base font-bold leading-snug text-ink md:text-lg">
                    {data.title}
                </h3>
                <p className="mt-1 text-xs text-ink/55 line-clamp-1">
                    {data.scripture} <span className="mx-1 text-ink/30">|</span> {data.pastor}
                </p>
                <p className="mt-4 text-xs font-medium text-ink/40">
                    {data.date}
                </p>
            </div>
        </a>
    );
}
