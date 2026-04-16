import Link from "next/link";
import PageHeader from "@/components/page-header";
import Breadcrumb from "@/components/breadcrumb";
import type { PublicVideoDetail } from "@/lib/videos-api";

export default function PublicVideoPlaylistView({
  video,
}: {
  video: PublicVideoDetail;
}) {
  return (
    <div className="pb-16">
      <PageHeader title={video.title} subtitle={video.groupLabel ?? "Worship Videos"} />
      <Breadcrumb />

      <section className="section-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-3xl border border-[#dbe4f0] bg-white shadow-sm">
              <div className="aspect-video">
                <iframe
                  title={video.title}
                  src={`https://www.youtube.com/embed/videoseries?list=${video.playlistId}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="rounded-3xl border border-[#dbe4f0] bg-white p-6 shadow-sm">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-themeBlue/70">
                {video.groupLabel ?? "Playlist"}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-ink">{video.title}</h1>
              <p className="mt-3 text-[13px] leading-7 text-ink/70">
                {video.description || "이 재생목록의 설명이 아직 등록되지 않았습니다."}
              </p>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="rounded-3xl border border-[#dbe4f0] bg-white p-5 shadow-sm">
              <p className="text-[13px] font-semibold text-[#132033]">같은 그룹의 재생목록</p>
              <ul className="mt-4 space-y-2">
                {video.siblings.map((sibling) => (
                  <li key={sibling.href}>
                    <Link
                      href={sibling.href}
                      className={`block rounded-xl px-3 py-2 text-[13px] transition ${
                        sibling.href === video.fullPath
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
