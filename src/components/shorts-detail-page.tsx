import Image from "next/image";
import Link from "next/link";
import type { MediaItemDto, VideoDetailResponse } from "@/lib/media-api";
import { formatDisplayDate } from "@/lib/media-api";

const youtubeChannelUrl =
  process.env.NEXT_PUBLIC_YOUTUBE_URL ??
  "https://www.youtube.com/@%EB%8D%94%EC%A0%9C%EC%9E%90%EA%B5%90%ED%9A%8C";

interface ShortsDetailPageProps {
  detail: VideoDetailResponse | null;
  relatedItems: MediaItemDto[];
  listHref: string;
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

function buildMeta(detail: VideoDetailResponse): string[] {
  return [
    detail.preacher,
    detail.serviceType ?? "짧은 영상",
    formatDisplayDate(detail.publishedAt.slice(0, 10)),
  ].filter(Boolean) as string[];
}

function buildDescription(detail: VideoDetailResponse): string {
  const summary = detail.summary?.trim();
  const description = detail.description?.trim();

  if (summary && description && summary !== description) {
    return `${summary}\n\n${description}`;
  }

  return summary || description || "영상 설명이 준비되면 이 영역에 함께 표시됩니다.";
}

export default function ShortsDetailPage({
  detail,
  relatedItems,
  listHref,
}: ShortsDetailPageProps) {
  if (!detail) {
    return (
      <section className="h-[100svh] overflow-hidden bg-[#07090d] px-4 py-6 text-white md:px-8 md:py-8">
        <div className="mx-auto flex h-full max-w-[1520px] items-center">
          <div className="w-full rounded-[28px] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">Shorts</p>
          <h1 className="mt-3 text-[1.9rem] font-bold tracking-[-0.03em] text-white">
            쇼츠 영상을 불러오지 못했습니다.
          </h1>
          <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-white/70">
            API 연결 상태를 확인한 뒤 다시 시도해 주세요. 목록으로 돌아가 다른 쇼츠를 먼저 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={listHref}
              className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-white/90"
            >
              쇼츠 목록
            </Link>
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
            >
              유튜브 채널 열기
            </a>
          </div>
        </div>
        </div>
      </section>
    );
  }

  const autoplayEmbedUrl = buildAutoplayEmbedUrl(detail.embedUrl);
  const meta = buildMeta(detail);
  const description = buildDescription(detail);
  const nextItem = relatedItems[0] ?? null;

  return (
    <section className="h-[100svh] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(38,75,126,0.3),transparent_22%),linear-gradient(180deg,#0a0a0b_0%,#111214_42%,#0a0a0b_100%)] px-4 py-4 text-white md:px-8 md:py-6">
      <div className="mx-auto flex h-full max-w-[1520px] items-center justify-center gap-8">
        <div className="hidden h-full xl:block xl:w-[360px]">
          <div className="flex h-full flex-col rounded-[28px] border border-white/8 bg-black/20 p-5 backdrop-blur">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-white/42">그래도 괜찮아</p>
            <h1 className="mt-4 text-[1.65rem] font-bold leading-[1.25] tracking-[-0.04em] text-white">
              {detail.displayTitle}
            </h1>
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-[0.95rem] text-white/60">
              {meta.map((line) => (
                <span key={line} className="inline-flex items-center gap-3">
                  <span className="hidden text-white/20 sm:inline">•</span>
                  <span>{line}</span>
                </span>
              ))}
            </div>

            <p className="mt-5 line-clamp-5 whitespace-pre-line text-[0.98rem] leading-7 text-white/72">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={detail.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f1115] transition hover:bg-white/90"
              >
                YouTube에서 보기
              </a>
              <a
                href={youtubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                채널 홈
              </a>
            </div>

            {relatedItems.length > 0 ? (
              <div className="mt-auto border-t border-white/8 pt-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-white/38">More Shorts</p>
                  <Link href={listHref} className="text-sm font-semibold text-white/72 transition hover:text-white">
                    최신으로 이동
                  </Link>
                </div>
                <div className="space-y-3">
                  {relatedItems.slice(0, 2).map((item) => (
                    <Link
                      key={item.youtubeVideoId}
                      href={`/sermons/its-okay/${item.youtubeVideoId}`}
                      className="group flex items-center gap-3 rounded-[20px] border border-white/6 bg-white/5 p-3 transition hover:border-white/14 hover:bg-white/8"
                    >
                      <div className="relative h-[94px] w-[56px] shrink-0 overflow-hidden rounded-[14px] bg-black">
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.displayTitle}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-[0.96rem] font-semibold leading-6 tracking-[-0.02em] text-white">
                          {item.displayTitle}
                        </p>
                        <p className="mt-1 text-sm text-white/50">
                          {[item.preacher, item.displayDate.replaceAll("-", ".")].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex h-full w-full flex-1 justify-center">
          <div className="relative h-full w-full max-w-[calc((100svh-2rem)*9/16)] md:max-w-[calc((100svh-3rem)*9/16)]">
            <div className="overflow-hidden rounded-[34px] border border-white/10 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.48)]">
              <div className="mx-auto h-[calc(100svh-2rem)] w-full md:h-[calc(100svh-3rem)]">
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

        <aside className="hidden xl:flex xl:h-full xl:w-[110px] xl:items-end">
          <div className="flex flex-col items-center gap-4 pb-8">
            <ActionButton href={detail.youtubeUrl} label="열기">
              ↗
            </ActionButton>
            <ActionButton href={youtubeChannelUrl} label="채널">
              ◎
            </ActionButton>
            {nextItem ? (
              <Link
                href={`/sermons/its-okay/${nextItem.youtubeVideoId}`}
                className="flex flex-col items-center gap-2 text-center text-white/74 transition hover:text-white"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-[18px] border border-white/10 bg-black">
                  <Image
                    src={nextItem.thumbnailUrl}
                    alt={nextItem.displayTitle}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
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
