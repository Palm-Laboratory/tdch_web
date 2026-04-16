import Link from "next/link";
import PageHeader from "@/components/page-header";
import type { PublicMediaVideoList, PublicMediaVideoSummary, VideoContentForm } from "@/lib/media-videos-api";

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function VideoTabs({ currentForm }: { currentForm: VideoContentForm }) {
  return (
    <div className="border-b border-[#e2e8f0] bg-white">
      <div className="section-shell flex gap-2 overflow-x-auto py-3">
        {[
          { href: "/media/videos", label: "롱폼 영상", form: "LONGFORM" as const },
          { href: "/media/videos/shorts", label: "숏폼 영상", form: "SHORTFORM" as const },
        ].map((tab) => {
          const active = tab.form === currentForm;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                active
                  ? "bg-[#13243a] text-white"
                  : "bg-[#f8fafc] text-[#475569] hover:bg-[#edf4ff] hover:text-[#2d5da8]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SummaryMeta({ video }: { video: PublicMediaVideoSummary }) {
  const publishedAt = formatDate(video.publishedAt);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#64748b]">
      {publishedAt && <span>{publishedAt}</span>}
      {video.preacherName && <span>{video.preacherName}</span>}
      {video.scriptureReference && <span>{video.scriptureReference}</span>}
    </div>
  );
}

function LongformCard({ video }: { video: PublicMediaVideoSummary }) {
  return (
    <Link
      href={video.href}
      className="grid gap-4 rounded-3xl border border-[#dbe4f0] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:grid-cols-[280px_minmax(0,1fr)]"
    >
      <div className="overflow-hidden rounded-2xl bg-[#0f172a]">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="aspect-video h-full w-full object-cover" />
        ) : (
          <div className="aspect-video bg-[#e2e8f0]" />
        )}
      </div>
      <div className="min-w-0">
        <SummaryMeta video={video} />
        <h2 className="mt-3 text-xl font-bold text-[#13243a]">{video.title}</h2>
        <p className="mt-3 line-clamp-3 text-[14px] leading-7 text-[#475569]">
          {video.summary || "영상 요약이 아직 등록되지 않았습니다."}
        </p>
      </div>
    </Link>
  );
}

function ShortformCard({ video }: { video: PublicMediaVideoSummary }) {
  return (
    <Link
      href={video.href}
      className="overflow-hidden rounded-[28px] border border-[#dbe4f0] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="overflow-hidden bg-[#0f172a]">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="aspect-[9/14] h-full w-full object-cover" />
        ) : (
          <div className="aspect-[9/14] bg-[#e2e8f0]" />
        )}
      </div>
      <div className="space-y-2 p-4">
        <SummaryMeta video={video} />
        <h2 className="line-clamp-2 text-[17px] font-bold leading-6 text-[#13243a]">{video.title}</h2>
        <p className="line-clamp-2 text-[13px] leading-6 text-[#64748b]">
          {video.summary || "영상 요약이 아직 등록되지 않았습니다."}
        </p>
      </div>
    </Link>
  );
}

export default function PublicMediaVideoListView({
  videos,
}: {
  videos: PublicMediaVideoList;
}) {
  const isShortform = videos.form === "SHORTFORM";

  return (
    <div className="pb-16">
      <PageHeader
        title={isShortform ? "숏폼 영상" : "영상"}
        subtitle={isShortform ? "Shortform Videos" : "Videos"}
      />
      <VideoTabs currentForm={videos.form} />

      <section className="section-shell py-10">
        {!isShortform && videos.featured && (
          <div className="mb-8">
            <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2d5da8]">
              Latest Video
            </div>
            <LongformCard video={videos.featured} />
          </div>
        )}

        {isShortform ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.items.map((video) => (
              <ShortformCard key={video.videoId} video={video} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {videos.items.map((video) => (
              <LongformCard key={video.videoId} video={video} />
            ))}
          </div>
        )}

        {videos.featured === null && videos.items.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#cbd5e1] bg-white px-6 py-12 text-center text-[14px] text-[#64748b]">
            아직 공개된 영상이 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}
