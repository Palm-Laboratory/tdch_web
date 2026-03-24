import Image from "next/image";
import Link from "next/link";
import type { MediaItemDto, SermonSiteKey, VideoDetailResponse } from "@/lib/media-api";
import { buildMediaDetailPath, formatDisplayDate } from "@/lib/media-api";

const youtubeChannelUrl =
  process.env.NEXT_PUBLIC_YOUTUBE_URL ??
  "https://www.youtube.com/@%EB%8D%94%EC%A0%9C%EC%9E%90%EA%B5%90%ED%9A%8C";

interface SermonDetailPageProps {
  siteKey: SermonSiteKey;
  sectionTitle: string;
  listHref: string;
  detail: VideoDetailResponse | null;
  relatedItems: MediaItemDto[];
}

const contentKindLabel: Record<VideoDetailResponse["contentKind"], string> = {
  LONG_FORM: "예배 영상",
  SHORT: "짧은 영상",
};

function buildDescription(detail: VideoDetailResponse): string {
  const summary = detail.summary?.trim();
  const description = detail.description?.trim();

  if (summary && description && summary !== description) {
    return `${summary}\n\n${description}`;
  }

  return summary || description || "운영 메타데이터가 준비되면 영상 요약과 상세 설명이 이 영역에 표시됩니다.";
}

function buildMetaLines(detail: VideoDetailResponse): string[] {
  return [
    detail.preacher,
    detail.scripture,
    detail.serviceType ?? contentKindLabel[detail.contentKind],
    formatDisplayDate(detail.publishedAt.slice(0, 10)),
  ].filter(Boolean) as string[];
}

function buildRelatedMeta(item: MediaItemDto): string {
  const segments = [
    item.preacher ?? "The 제자교회",
    item.serviceType ?? (item.contentKind === "SHORT" ? "짧은 영상" : "예배 영상"),
    `${formatDisplayDate(item.displayDate)} 업로드`,
  ];

  return segments.join(" · ");
}

export default function SermonDetailPage({
  siteKey,
  sectionTitle,
  listHref,
  detail,
  relatedItems,
}: SermonDetailPageProps) {
  if (!detail) {
    return (
      <section className="pb-10 pt-4 md:pb-14 md:pt-6">
        <div className="rounded-[24px] bg-[#171717] px-6 py-10 text-white md:px-8">
          <p className="text-sm font-medium text-white/60">영상을 불러오지 못했습니다.</p>
          <h1 className="mt-3 text-[1.9rem] font-bold tracking-[-0.03em] text-white">
            상세 플레이어를 표시할 수 없습니다.
          </h1>
          <p className="mt-4 max-w-3xl text-[0.98rem] leading-7 text-white/72">
            백엔드 API 연결 상태를 먼저 확인해 주세요. 영상 목록으로 돌아가 현재 동기화된 다른 영상을 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={listHref}
              className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white/90"
            >
              목록으로 돌아가기
            </Link>
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              유튜브 채널 열기
            </a>
          </div>
        </div>
      </section>
    );
  }

  const metaLines = buildMetaLines(detail);
  const description = buildDescription(detail);

  return (
    <section className="pb-10 pt-4 md:pb-14 md:pt-6">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-[22px] bg-black shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
            <div className={siteKey === "its-okay" ? "mx-auto aspect-[9/16] max-h-[78vh] w-full max-w-[520px]" : "aspect-video w-full"}>
              <iframe
                src={detail.embedUrl}
                title={detail.displayTitle}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-[1.7rem] font-bold leading-[1.24] tracking-[-0.03em] text-ink md:text-[2rem]">
              {detail.displayTitle}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.95rem] text-ink/56">
              <span className="font-medium text-ink/72">{sectionTitle}</span>
              {metaLines.map((line) => (
                <span key={line} className="inline-flex items-center gap-2">
                  <span className="text-ink/28">•</span>
                  <span>{line}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 border-b border-black/8 pb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full bg-[#10213f]">
                <Image
                  src="/images/logo/church_logo.png"
                  alt="The 제자교회"
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <p className="text-[1.02rem] font-bold tracking-[-0.02em] text-ink">The 제자교회</p>
                <p className="mt-1 text-sm text-ink/58">
                  {detail.preacher ?? sectionTitle} · {detail.serviceType ?? contentKindLabel[detail.contentKind]}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={listHref}
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/88"
              >
                <ActionIcon type="list" />
                <span>목록</span>
              </Link>
              <a
                href={youtubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-black/6 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-black/10"
              >
                <ActionIcon type="channel" />
                <span>채널</span>
              </a>
              <a
                href={detail.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-black/6 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-black/10"
              >
                <ActionIcon type="play" />
                <span>원본 보기</span>
              </a>
            </div>
          </div>

          <div className="mt-5 rounded-[20px] bg-black/5 px-5 py-5 md:px-6">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-ink/72">
              <span>{formatDisplayDate(detail.publishedAt.slice(0, 10))} 게시</span>
              <span>{detail.serviceType ?? contentKindLabel[detail.contentKind]}</span>
              {detail.scripture ? <span>{detail.scripture}</span> : null}
            </div>
            <p className="mt-4 whitespace-pre-line text-[0.98rem] leading-7 text-ink/82">
              {description}
            </p>

            {detail.tags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {detail.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-ink/76 ring-1 ring-black/6"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <aside className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-ink/48">Next Up</p>
              <h2 className="mt-1 text-[1.15rem] font-bold tracking-[-0.02em] text-ink">다음 영상</h2>
            </div>
            <Link
              href={listHref}
              className="text-sm font-semibold text-cedar transition hover:text-clay"
            >
              전체 보기
            </Link>
          </div>

          <div className="space-y-3">
            {relatedItems.length > 0 ? (
              relatedItems.map((item) => (
                <Link
                  key={item.youtubeVideoId}
                  href={buildMediaDetailPath(siteKey, item.youtubeVideoId)}
                  className="group flex gap-3 rounded-[18px] p-2 transition hover:bg-black/4"
                >
                  <div
                    className={`relative shrink-0 overflow-hidden rounded-[14px] bg-black ${
                      item.contentKind === "SHORT" ? "h-[180px] w-[104px]" : "aspect-video w-[180px]"
                    }`}
                  >
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.displayTitle}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      sizes={item.contentKind === "SHORT" ? "104px" : "180px"}
                    />
                  </div>
                  <div className="min-w-0 pt-1">
                    <p className="line-clamp-2 text-[1rem] font-semibold leading-6 tracking-[-0.02em] text-ink">
                      {item.displayTitle}
                    </p>
                    <p className="mt-2 text-sm text-ink/62">
                      {buildRelatedMeta(item)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[18px] bg-black/4 px-5 py-5 text-sm text-ink/64">
                아직 추천할 영상이 더 없습니다.
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ActionIcon({ type }: { type: "list" | "channel" | "play" }) {
  if (type === "list") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
        <path strokeLinecap="round" d="M8 7h11M8 12h11M8 17h11" />
        <circle cx="4" cy="7" r="1" fill="currentColor" stroke="none" />
        <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="4" cy="17" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "channel") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
        <circle cx="12" cy="8" r="3.5" />
        <path strokeLinecap="round" d="M5.5 19c1.7-3.1 4-4.5 6.5-4.5s4.8 1.4 6.5 4.5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M8 6.5v11l9-5.5-9-5.5Z" />
    </svg>
  );
}
