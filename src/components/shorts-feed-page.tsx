import Link from "next/link";
import type { MediaItemDto, VideoDetailResponse } from "@/lib/media-api";
import { formatDisplayDate } from "@/lib/media-api";

const youtubeChannelUrl =
  process.env.NEXT_PUBLIC_YOUTUBE_URL ??
  "https://www.youtube.com/@%EB%8D%94%EC%A0%9C%EC%9E%90%EA%B5%90%ED%9A%8C";

interface ShortsFeedPageProps {
  detail: VideoDetailResponse | null;
  relatedItems: MediaItemDto[];
}

function buildAutoplayEmbedUrl(embedUrl: string): string {
  try {
    const url = new URL(embedUrl);
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("playsinline", "1");
    url.searchParams.set("rel", "0");
    return url.toString();
  } catch {
    const separator = embedUrl.includes("?") ? "&" : "?";
    return `${embedUrl}${separator}autoplay=1&playsinline=1&rel=0`;
  }
}

export default function ShortsFeedPage({ detail, relatedItems }: ShortsFeedPageProps) {
  if (!detail) {
    return (
      <section className="h-[100svh] overflow-hidden bg-[#0b0b0c] px-4 py-6 text-white md:px-8">
        <div className="mx-auto flex h-full max-w-[1520px] items-center justify-center">
          <div className="rounded-[28px] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">Shorts</p>
            <h1 className="mt-3 text-[1.9rem] font-bold tracking-[-0.03em] text-white">
              쇼츠를 불러오지 못했습니다.
            </h1>
          </div>
        </div>
      </section>
    );
  }

  const autoplayEmbedUrl = buildAutoplayEmbedUrl(detail.embedUrl);
  const nextItem = relatedItems[0] ?? null;

  return (
    <section className="h-[100svh] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(58,82,132,0.22),transparent_18%),linear-gradient(180deg,#0b0b0c_0%,#111214_55%,#0b0b0c_100%)] px-4 py-4 text-white md:px-8 md:py-6">
      <div className="mx-auto flex h-full max-w-[1520px] items-center justify-center gap-6">
        <div className="hidden xl:flex xl:w-[320px] xl:justify-end">
          <div className="w-full max-w-[280px] self-end pb-6">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-white/42">
              IT&apos;S OKAY
            </p>
            <h1 className="mt-4 text-[1.55rem] font-bold leading-[1.24] tracking-[-0.04em] text-white">
              {detail.displayTitle}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#d9485d] text-sm font-bold text-white">
                제
              </span>
              <div className="min-w-0">
                <p className="truncate text-[1rem] font-semibold text-white">The 제자교회</p>
                <p className="truncate text-sm text-white/52">
                  {[detail.preacher, formatDisplayDate(detail.publishedAt.slice(0, 10))].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={detail.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#111318] transition hover:bg-white/90"
              >
                YouTube에서 열기
              </a>
              <Link
                href={`/sermons/its-okay/${detail.youtubeVideoId}`}
                className="inline-flex items-center rounded-full border border-white/14 bg-white/6 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                상세 보기
              </Link>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-1 justify-center">
          <div className="relative h-full w-full max-w-[calc((100svh-2rem)*9/16)] md:max-w-[calc((100svh-3rem)*9/16)]">
            <div className="overflow-hidden rounded-[34px] bg-black shadow-[0_28px_100px_rgba(0,0,0,0.52)]">
              <div className="h-[calc(100svh-2rem)] w-full md:h-[calc(100svh-3rem)]">
                <iframe
                  src={autoplayEmbedUrl}
                  title={detail.displayTitle}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden xl:flex xl:h-full xl:w-[120px] xl:items-end">
          <div className="flex flex-col items-center gap-5 pb-6">
            <ActionButton href={detail.youtubeUrl} label="열기">
              ↗
            </ActionButton>
            <ActionButton href={youtubeChannelUrl} label="채널">
              ◎
            </ActionButton>
            <Link
              href={`/sermons/its-okay/${detail.youtubeVideoId}`}
              className="flex flex-col items-center gap-2 text-center text-white/74 transition hover:text-white"
            >
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/8 text-[1.15rem] font-semibold">
                i
              </span>
              <span className="text-xs font-semibold tracking-[0.08em]">상세</span>
            </Link>
            {nextItem ? (
              <Link
                href={`/sermons/its-okay/${nextItem.youtubeVideoId}`}
                className="flex flex-col items-center gap-2 text-center text-white/74 transition hover:text-white"
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/8 text-[1.15rem] font-semibold">
                  ↓
                </span>
                <span className="text-xs font-semibold tracking-[0.08em]">다음</span>
              </Link>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

interface ActionButtonProps {
  href: string;
  label: string;
  children: string;
}

function ActionButton({ href, label, children }: ActionButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col items-center gap-2 text-center text-white/74 transition hover:text-white"
    >
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/8 text-[1.35rem] font-semibold">
        {children}
      </span>
      <span className="text-xs font-semibold tracking-[0.08em]">{label}</span>
    </a>
  );
}
