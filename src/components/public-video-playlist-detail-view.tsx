import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import PageHeader from "@/components/page-header";
import PublicShortformVideoDetailExperience from "@/components/public-shortform-video-detail-experience";
import type { PublicPlaylistDetail, PublicVideoDetail, PublicVideoSummary } from "@/lib/videos-api";

function formatLongDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function buildMetaLine(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(" · ");
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LongformRelatedCard({ video }: { video: PublicVideoSummary }) {
  const publishedAt = formatLongDate(video.publishedAt);
  const metaLine = buildMetaLine([video.scriptureReference, video.preacherName, "The 제자교회"]);

  return (
    <Link
      href={video.href}
      className="group flex items-center gap-3 rounded-[12px] px-2 py-1 transition hover:bg-white/70"
    >
      <div className="relative h-[78px] w-[120px] shrink-0 overflow-hidden rounded-[12px] bg-[#242c39]">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover opacity-70 transition duration-300 group-hover:scale-[1.03]"
            sizes="120px"
          />
        ) : null}
        <div className="absolute inset-0 bg-[#242c39]/78" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[14px] font-medium leading-[1.55] text-[#10213f] md:line-clamp-1">
          {video.title}
        </p>
        {metaLine ? (
          <p className="mt-1 line-clamp-2 text-[12px] leading-[1.35] text-[#10213f]/78">
            {metaLine}
          </p>
        ) : null}
        {publishedAt ? (
          <p className="mt-1 text-[12px] leading-[1.3] text-[#10213f]">
            {publishedAt} 업로드
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function DetailAccordion({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <details className="group rounded-[20px] bg-[#f2f2f2] px-[30px] open:pb-7">
      <summary className="flex h-[60px] cursor-pointer list-none items-center justify-between text-[#10213f]">
        <span className="type-accordion-title font-medium">{title}</span>
        <ChevronIcon className="h-4 w-4 transition group-open:rotate-180" />
      </summary>
      <div className="whitespace-pre-line pb-1 text-[15px] leading-8 text-[#334155]">
        {content}
      </div>
    </details>
  );
}

function LongformDetailView({
  playlist,
  video,
}: {
  playlist: PublicPlaylistDetail;
  video: PublicVideoDetail;
}) {
  const publishedAt = formatLongDate(video.publishedAt);
  const metaLine = buildMetaLine([video.scriptureReference, video.preacherName]);
  const taxonomyLine = buildMetaLine(["말씀 / 설교", playlist.groupLabel ?? "예배 영상", publishedAt]);
  const descriptionContent = video.summary || video.description;
  const scriptureContent = buildMetaLine([video.scriptureReference, video.scriptureBody])
    ? [video.scriptureReference, video.scriptureBody].filter(Boolean).join("\n\n")
    : null;

  return (
    <div className="pb-16">
      <PageHeader title={video.title} subtitle={playlist.title} />
      <Breadcrumb />

      <section className="section-shell py-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,935px)_367px] xl:items-start">
          <div className="min-w-0 space-y-4">
            <div className="w-full overflow-hidden rounded-[16px] bg-[#242c39] shadow-[0_18px_40px_rgba(16,33,63,0.12)]">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#242c39]">
                <iframe
                  title={video.title}
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  className="absolute inset-0 block h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              </div>
            </div>

            <div className="space-y-6 px-1">
              <div className="space-y-4 text-[#10213f]">
                <h1 className="line-clamp-2 text-[30px] font-bold leading-[1.15] tracking-[-0.04em] lg:line-clamp-1 md:text-[24px]">
                  {video.title}
                  {metaLine ? ` | ${metaLine}` : ""}
                  {" | The 제자교회"}
                </h1>
                {taxonomyLine ? (
                  <p className="text-[16px] font-normal leading-none text-[#10213f]/90">
                    {taxonomyLine}
                  </p>
                ) : null}
              </div>

              <div className="space-y-[15px]">
                {descriptionContent ? <DetailAccordion title="영상 설명" content={descriptionContent} /> : null}
                {scriptureContent ? <DetailAccordion title="본문 말씀" content={scriptureContent} /> : null}
              </div>
            </div>
          </div>

          <aside className="rounded-[16px] border border-[#e6e7eb] bg-[#f7f8fb] p-[18px]">
            <div className="flex items-center justify-between">
              <div className="space-y-[10px] text-[#10213f]">
                <p className="text-[12px] font-normal uppercase tracking-[0.18em]">Related Videos</p>
                <h2 className="text-[14px] font-bold leading-none">관련 영상</h2>
              </div>
              <Link
                href={playlist.fullPath}
                className="text-[12px] font-medium leading-none text-[#2a4f8f] transition hover:text-[#1f3b6d]"
              >
                전체 보기
              </Link>
            </div>

            <div className="mt-6 space-y-[18px]">
              {video.related.map((related) => (
                <LongformRelatedCard key={related.videoId} video={related} />
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default function PublicVideoPlaylistDetailView({
  playlist,
  video,
}: {
  playlist: PublicPlaylistDetail;
  video: PublicVideoDetail;
}) {
  if (video.contentForm === "SHORTFORM") {
    return <PublicShortformVideoDetailExperience playlist={playlist} initialVideo={video} />;
  }

  return <LongformDetailView playlist={playlist} video={video} />;
}
