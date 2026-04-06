import Link from "next/link";
import type { ReactNode } from "react";
import type { MediaItemDto, SermonSiteKey, VideoDetailResponse } from "@/lib/media-api";
import { formatDisplayDate } from "@/lib/media-api";
import RelatedVideosList from "@/app/(site)/sermons/components/related-videos-list";

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

function buildScriptureReference(detail: VideoDetailResponse): string | null {
  const scripture = detail.scripture?.trim();
  return scripture || null;
}

function buildScriptureBody(detail: VideoDetailResponse): string | null {
  const scriptureBody = detail.scriptureBody?.trim();
  return scriptureBody || null;
}

function buildMetaLines(detail: VideoDetailResponse): string[] {
  return [
    detail.preacher,
    detail.scripture,
    detail.serviceType ?? contentKindLabel[detail.contentKind],
    formatDisplayDate(detail.publishedAt.slice(0, 10)),
  ].filter(Boolean) as string[];
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

interface CollapsibleSectionProps {
  title: string;
  meta: string[];
  children: ReactNode;
}

function CollapsibleSection({ title, meta, children }: CollapsibleSectionProps) {
  return (
    <details className="group mt-5 rounded-[20px] bg-black/5 px-5 py-5 md:px-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink/78">
        <span>{title}</span>
        <span className="text-ink/44 transition group-open:rotate-180">⌃</span>
      </summary>

      {meta.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-ink/72">
          {meta.map((item, index) => (
            <span key={`${title}-${item}-${index}`}>{item}</span>
          ))}
        </div>
      ) : null}

      <div className="mt-4">{children}</div>
    </details>
  );
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
      <section className="mx-auto max-w-[1520px] px-4 pb-10 pt-4 md:px-8 md:pb-14 md:pt-6">
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
  const scriptureReference = buildScriptureReference(detail);
  const scriptureBody = buildScriptureBody(detail);
  const autoplayEmbedUrl = buildAutoplayEmbedUrl(detail.embedUrl);
  const showScriptureSection = siteKey === "messages";

  return (
    <section className="mx-auto max-w-[1520px] px-4 pb-10 pt-4 md:px-8 md:pb-14 md:pt-6">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-[22px] bg-black">
            <div className={siteKey === "its-okay" ? "mx-auto aspect-[9/16] max-h-[78vh] w-full max-w-[520px]" : "aspect-video w-full"}>
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

          <div className="mt-5">
            <h1 className="text-[1rem] font-bold leading-[1.24] tracking-[-0.03em] text-ink md:text-[1.55rem]">
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

          <CollapsibleSection
            title="영상 설명"
            meta={[
              `${formatDisplayDate(detail.publishedAt.slice(0, 10))} 게시`,
              detail.serviceType ?? contentKindLabel[detail.contentKind],
              ...(scriptureReference ? [scriptureReference] : []),
            ]}
          >
            <p className="whitespace-pre-line text-[0.98rem] leading-7 text-ink/82">
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
          </CollapsibleSection>

          {!showScriptureSection ? null : (
            <CollapsibleSection
              title="본문 말씀"
              meta={[
                detail.serviceType ?? contentKindLabel[detail.contentKind],
                ...(scriptureReference ? [scriptureReference] : ["본문 정보 준비 중"]),
              ]}
            >
              {scriptureBody ? (
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink/44">
                    Scripture
                  </p>
                  {scriptureReference ? (
                    <p className="mt-2 text-[1.08rem] font-semibold leading-7 text-ink">
                      {scriptureReference}
                    </p>
                  ) : null}
                  <p className="mt-4 whitespace-pre-line text-[0.98rem] leading-7 text-ink/82">
                    {scriptureBody}
                  </p>
                </div>
              ) : scriptureReference ? (
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink/44">
                    Scripture
                  </p>
                  <p className="mt-2 text-[1.08rem] font-semibold leading-7 text-ink">
                    {scriptureReference}
                  </p>
                  <p className="mt-4 text-[0.96rem] leading-7 text-ink/72">
                    현재 페이지에는 본문 구절 참조만 연결되어 있습니다. 성경 본문 전문 데이터가 준비되면 이 영역에 함께 표시됩니다.
                  </p>
                </div>
              ) : (
                <p className="text-[0.98rem] leading-7 text-ink/82">
                  운영 메타데이터에 본문 구절이 연결되면 이 영역에서 접고 펼쳐 확인하실 수 있습니다.
                </p>
              )}
            </CollapsibleSection>
          )}
        </div>

        <aside className="min-w-0 rounded-[24px] border border-black/8 bg-[#f7f8fb] p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-ink/48">Related Videos</p>
              <h2 className="mt-1 text-[1.15rem] font-bold tracking-[-0.02em] text-ink">관련 영상</h2>
            </div>
            <Link
              href={listHref}
              className="text-sm font-semibold text-cedar transition hover:text-clay"
            >
              전체 보기
            </Link>
          </div>

          <RelatedVideosList siteKey={siteKey} items={relatedItems} />
        </aside>
      </div>
    </section>
  );
}
