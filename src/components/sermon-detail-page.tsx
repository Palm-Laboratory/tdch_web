import Link from "next/link";
import type { SermonSiteKey, VideoDetailResponse } from "@/lib/media-api";
import { formatDisplayDate } from "@/lib/media-api";

interface SermonDetailPageProps {
  siteKey: SermonSiteKey;
  sectionTitle: string;
  sectionSubtitle: string;
  listHref: string;
  detail: VideoDetailResponse | null;
}

const contentKindLabel: Record<VideoDetailResponse["contentKind"], string> = {
  LONG_FORM: "예배 영상",
  SHORT: "짧은 영상",
};

function buildInfoRows(detail: VideoDetailResponse) {
  return [
    { label: "설교자", value: detail.preacher ?? "운영 메타데이터 준비 중" },
    { label: "본문", value: detail.scripture ?? "본문 정보 준비 중" },
    { label: "분류", value: detail.serviceType ?? contentKindLabel[detail.contentKind] },
    { label: "게시일", value: formatDisplayDate(detail.publishedAt.slice(0, 10)) },
  ];
}

export default function SermonDetailPage({
  siteKey,
  sectionTitle,
  sectionSubtitle,
  listHref,
  detail,
}: SermonDetailPageProps) {
  if (!detail) {
    return (
      <section className="space-y-6 pb-20">
        <div className="rounded-[32px] border border-dashed border-cedar/20 bg-white px-8 py-12 text-center shadow-[0_20px_60px_rgba(16,33,63,0.06)]">
          <p className="type-label font-semibold uppercase tracking-[0.2em] text-cedar/70">
            {sectionSubtitle}
          </p>
          <h2 className="mt-3 type-section-title font-serif font-bold text-ink">
            상세 영상을 불러오지 못했습니다.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl type-body leading-8 text-ink/68">
            백엔드 API 연결 상태를 확인한 뒤 다시 시도해 주세요. 영상 목록으로 돌아가면 현재 적재된 다른 영상을 확인할 수 있습니다.
          </p>
          <Link
            href={listHref}
            className="mt-8 inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-cedar"
          >
            {sectionTitle} 목록으로 돌아가기
          </Link>
        </div>
      </section>
    );
  }

  const infoRows = buildInfoRows(detail);

  return (
    <section className="space-y-8 pb-20">
      <div className="overflow-hidden rounded-[34px] border border-cedar/10 bg-white shadow-[0_24px_80px_rgba(16,33,63,0.10)]">
        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(109,166,240,0.26),transparent_32%),linear-gradient(135deg,#10213f_0%,#20426f_55%,#315c8f_100%)] px-8 py-10 text-white md:px-12 md:py-12">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="relative z-10 max-w-4xl">
            <p className="type-label font-semibold uppercase tracking-[0.24em] text-white/65">
              {sectionSubtitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/88">
                {contentKindLabel[detail.contentKind]}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/88">
                {formatDisplayDate(detail.publishedAt.slice(0, 10))}
              </span>
              {detail.serviceType ? (
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/88">
                  {detail.serviceType}
                </span>
              ) : null}
            </div>
            <h1 className="mt-5 type-page-title max-w-4xl font-serif font-bold leading-tight text-white">
              {detail.displayTitle}
            </h1>
            <p className="mt-5 max-w-3xl type-body leading-8 text-white/78">
              {detail.summary ?? "유튜브 동기화된 설교 상세 페이지입니다. 운영 메타데이터가 채워지면 요약과 본문 정보를 더 정제해서 노출할 수 있습니다."}
            </p>
          </div>
        </div>

        <div className="grid gap-8 px-6 py-6 md:px-8 lg:grid-cols-[minmax(0,1.45fr),320px] lg:gap-6 lg:px-10 lg:py-10">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[28px] border border-cedar/12 bg-[#091326] shadow-[0_18px_50px_rgba(9,19,38,0.24)]">
              <div className={siteKey === "its-okay" ? "aspect-[9/16] w-full" : "aspect-video w-full"}>
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

            <div className="rounded-[28px] border border-cedar/10 bg-[#f7fbff] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="type-label font-semibold uppercase tracking-[0.18em] text-cedar/72">Description</p>
                  <h2 className="mt-2 type-card-title font-bold text-ink">영상 설명</h2>
                </div>
                <a
                  href={detail.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-cedar/14 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-clay/35 hover:text-clay"
                >
                  유튜브에서 보기
                </a>
              </div>
              <div className="mt-5 rounded-[24px] border border-white/70 bg-white px-5 py-5 shadow-[0_12px_28px_rgba(16,33,63,0.06)]">
                <p className="whitespace-pre-line type-body leading-8 text-ink/82">
                  {detail.description}
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-cedar/10 bg-white p-6 shadow-[0_18px_45px_rgba(16,33,63,0.08)]">
              <p className="type-label font-semibold uppercase tracking-[0.18em] text-cedar/72">Information</p>
              <div className="mt-5 space-y-4">
                {infoRows.map((row) => (
                  <div key={row.label} className="rounded-[20px] border border-cedar/8 bg-[#f8fbff] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cedar/60">{row.label}</p>
                    <p className="mt-2 type-body font-semibold text-ink">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-cedar/10 bg-[linear-gradient(180deg,#ffffff_0%,#f5faff_100%)] p-6 shadow-[0_18px_45px_rgba(16,33,63,0.08)]">
              <p className="type-label font-semibold uppercase tracking-[0.18em] text-cedar/72">Tags</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {detail.tags.length > 0 ? (
                  detail.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cedar/12 bg-white px-3 py-1.5 text-sm font-medium text-ink"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <p className="type-body-small leading-7 text-ink/62">
                    아직 운영 태그가 입력되지 않았습니다.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-cedar/10 bg-ink p-6 text-white shadow-[0_18px_45px_rgba(16,33,63,0.14)]">
              <p className="type-label font-semibold uppercase tracking-[0.18em] text-white/62">Navigate</p>
              <h3 className="mt-3 type-card-title font-bold">다음 작업 동선</h3>
              <p className="mt-3 type-body leading-8 text-white/74">
                목록으로 돌아가 다른 영상을 이어서 보거나, 유튜브 원본 페이지에서 공유와 구독 동선을 이어갈 수 있습니다.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={listHref}
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white/90"
                >
                  {sectionTitle} 목록으로 가기
                </Link>
                <a
                  href={detail.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
                >
                  원본 유튜브 열기
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
