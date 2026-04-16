import Link from "next/link";
import PageHeader from "@/components/page-header";
import type { PublicMediaVideoDetail, PublicMediaVideoSummary } from "@/lib/media-videos-api";

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

function RelatedCard({ video }: { video: PublicMediaVideoSummary }) {
  return (
    <Link
      href={video.href}
      className="rounded-2xl border border-[#dbe4f0] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {video.thumbnailUrl ? (
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`w-full rounded-xl object-cover ${
            video.contentForm === "SHORTFORM" ? "aspect-[9/14]" : "aspect-video"
          }`}
        />
      ) : (
        <div className={`w-full rounded-xl bg-[#e2e8f0] ${video.contentForm === "SHORTFORM" ? "aspect-[9/14]" : "aspect-video"}`} />
      )}
      <p className="mt-3 line-clamp-2 text-[14px] font-semibold text-[#13243a]">{video.title}</p>
    </Link>
  );
}

export default function PublicMediaVideoDetailView({
  video,
}: {
  video: PublicMediaVideoDetail;
}) {
  const isShortform = video.contentForm === "SHORTFORM";
  const publishedAt = formatDate(video.publishedAt);

  return (
    <div className="pb-16">
      <PageHeader
        title={video.title}
        subtitle={isShortform ? "Shortform Video" : "Video Detail"}
      />

      <div className="border-b border-[#e2e8f0] bg-white">
        <div className="section-shell flex gap-2 overflow-x-auto py-3">
          <Link
            href="/media/videos"
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
              !isShortform ? "bg-[#13243a] text-white" : "bg-[#f8fafc] text-[#475569]"
            }`}
          >
            롱폼 영상
          </Link>
          <Link
            href="/media/videos/shorts"
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
              isShortform ? "bg-[#13243a] text-white" : "bg-[#f8fafc] text-[#475569]"
            }`}
          >
            숏폼 영상
          </Link>
        </div>
      </div>

      <section className="section-shell py-10">
        <div className={`grid gap-8 ${isShortform ? "lg:grid-cols-[420px_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_320px]"}`}>
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-[#dbe4f0] bg-[#0f172a] shadow-sm">
              <div className={isShortform ? "mx-auto max-w-[420px]" : ""}>
                <div className={isShortform ? "aspect-[9/16]" : "aspect-video"}>
                  <iframe
                    title={video.title}
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#dbe4f0] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#64748b]">
                {publishedAt && <span>{publishedAt}</span>}
                {video.preacherName && <span>{video.preacherName}</span>}
                {video.scriptureReference && <span>{video.scriptureReference}</span>}
              </div>
              <h1 className="mt-3 text-3xl font-bold text-[#13243a]">{video.title}</h1>
              {(video.summary || video.description) && (
                <p className="mt-4 text-[15px] leading-8 text-[#475569]">
                  {video.summary || video.description}
                </p>
              )}
            </div>

            {(video.scriptureBody || video.messageBody || video.description) && (
              <div className="grid gap-5">
                {(video.scriptureReference || video.scriptureBody) && (
                  <article className="rounded-[28px] border border-[#dbe4f0] bg-[#f8fafc] p-6">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#2d5da8]">
                      Reference
                    </p>
                    {video.scriptureReference && (
                      <h2 className="mt-3 text-xl font-bold text-[#13243a]">{video.scriptureReference}</h2>
                    )}
                    {video.scriptureBody && (
                      <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-[#334155]">
                        {video.scriptureBody}
                      </p>
                    )}
                  </article>
                )}

                <article className="rounded-[28px] border border-[#dbe4f0] bg-white p-6 shadow-sm">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#2d5da8]">
                    Content
                  </p>
                  <div className="mt-4 whitespace-pre-line text-[15px] leading-8 text-[#334155]">
                    {video.messageBody || video.description || "상세 내용이 아직 등록되지 않았습니다."}
                  </div>
                </article>
              </div>
            )}
          </div>

          <aside className="space-y-5">
            {video.playlists.length > 0 && (
              <div className="rounded-[28px] border border-[#dbe4f0] bg-white p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-[#13243a]">연결된 재생목록</p>
                <div className="mt-4 space-y-2">
                  {video.playlists.map((playlist) => (
                    <Link
                      key={playlist.href}
                      href={playlist.href}
                      className="block rounded-xl bg-[#f8fafc] px-3 py-2 text-[13px] font-medium text-[#334155] transition hover:bg-[#edf4ff] hover:text-[#2d5da8]"
                    >
                      {playlist.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {video.related.length > 0 && (
              <div className="rounded-[28px] border border-[#dbe4f0] bg-white p-5 shadow-sm">
                <p className="text-[13px] font-semibold text-[#13243a]">
                  {isShortform ? "다른 숏폼 영상" : "관련 영상"}
                </p>
                <div className={`mt-4 grid gap-3 ${isShortform ? "grid-cols-2" : "grid-cols-1"}`}>
                  {video.related.map((related) => (
                    <RelatedCard key={related.videoId} video={related} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
