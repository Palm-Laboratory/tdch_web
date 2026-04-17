import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import PageHeader from "@/components/page-header";
import type { PublicPlaylistDetail, PublicVideoList, PublicVideoSummary } from "@/lib/videos-api";

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

function PlaylistVideoCard({ video }: { video: PublicVideoSummary }) {
  const publishedAt = formatDate(video.publishedAt);

  return (
    <Link
      href={video.href}
      className="grid gap-4 rounded-3xl border border-[#dbe4f0] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:grid-cols-[280px_minmax(0,1fr)]"
    >
      <div className="overflow-hidden rounded-2xl bg-[#0f172a]">
        {video.thumbnailUrl ? (
          <div className="relative aspect-video w-full">
            <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" sizes="(min-width: 768px) 280px, 100vw" />
          </div>
        ) : (
          <div className="aspect-video bg-[#e2e8f0]" />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#64748b]">
          {publishedAt ? <span>{publishedAt}</span> : null}
          {video.preacherName ? <span>{video.preacherName}</span> : null}
          {video.scriptureReference ? <span>{video.scriptureReference}</span> : null}
        </div>
        <h2 className="mt-3 text-xl font-bold text-[#13243a]">{video.title}</h2>
        <p className="mt-3 line-clamp-3 text-[14px] leading-7 text-[#475569]">
          {video.summary || "영상 요약이 아직 등록되지 않았습니다."}
        </p>
      </div>
    </Link>
  );
}

export default function PublicVideoPlaylistView({
  playlist,
  videos,
}: {
  playlist: PublicPlaylistDetail;
  videos: PublicVideoList;
}) {
  const allItems = [videos.featured, ...videos.items].filter(Boolean) as PublicVideoSummary[];

  return (
    <div className="pb-16">
      <PageHeader title={playlist.title} subtitle={playlist.groupLabel ?? "Worship Videos"} />
      <Breadcrumb />

      <section className="section-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-[#dbe4f0] bg-white shadow-sm">
              <div className="aspect-video">
                <iframe
                  title={playlist.title}
                  src={`https://www.youtube.com/embed/videoseries?list=${playlist.playlistId}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="rounded-3xl border border-[#dbe4f0] bg-white p-6 shadow-sm">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-themeBlue/70">
                {playlist.groupLabel ?? "Playlist"}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-ink">{playlist.title}</h1>
              <p className="mt-3 text-[13px] leading-7 text-ink/70">
                {playlist.description || "이 재생목록의 설명이 아직 등록되지 않았습니다."}
              </p>
              <p className="mt-4 text-[13px] font-medium text-[#2d5da8]">
                총 {playlist.itemCount}개 영상
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-bold text-[#13243a]">재생목록 영상</h2>
                <a
                  href={`https://www.youtube.com/playlist?list=${playlist.playlistId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] font-semibold text-[#2d5da8]"
                >
                  유튜브에서 보기
                </a>
              </div>

              {allItems.length > 0 ? (
                <div className="space-y-4">
                  {allItems.map((video) => (
                    <PlaylistVideoCard key={video.videoId} video={video} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-[#cbd5e1] bg-white px-6 py-12 text-center text-[14px] text-[#64748b]">
                  이 재생목록에 공개된 영상이 아직 없습니다.
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-3">
            <div className="rounded-3xl border border-[#dbe4f0] bg-white p-5 shadow-sm">
              <p className="text-[13px] font-semibold text-[#132033]">같은 그룹의 재생목록</p>
              <ul className="mt-4 space-y-2">
                {playlist.siblings.map((sibling) => (
                  <li key={sibling.href}>
                    <Link
                      href={sibling.href}
                      className={`block rounded-xl px-3 py-2 text-[13px] transition ${
                        sibling.href === playlist.fullPath
                          ? "bg-[#edf4ff] font-semibold text-[#2d5da8]"
                          : "text-[#334155] hover:bg-[#f8fafc]"
                      }`}
                    >
                      {sibling.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
