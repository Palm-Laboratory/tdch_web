import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import PageHeader from "@/components/page-header";
import PublicShortformPlaylistGrid from "@/components/public-shortform-playlist-grid";
import SectionHeading from "@/components/section-heading";
import type { PublicPlaylistDetail, PublicVideoList, PublicVideoSummary } from "@/lib/videos-api";

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

function buildMetaLine(video: PublicVideoSummary) {
  return [video.scriptureReference, video.preacherName].filter(Boolean).join("  |  ");
}

function buildPageHref(basePath: string, page: number) {
  return page > 1 ? `${basePath}?page=${page}` : basePath;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);

  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 6.5V17.5L17 12L8 6.5Z" fill="currentColor" />
    </svg>
  );
}

function LongformHero({
  featured,
}: {
  featured: PublicVideoSummary | null;
}) {
  return (
    <section className="space-y-8">
      <SectionHeading
        label="Recent Video"
        title="최신 영상"
      />

      <div className="overflow-hidden rounded-[4px] bg-[#242c39] shadow-[0_18px_40px_rgba(16,33,63,0.12)]">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#242c39]">
          {featured ? (
            <iframe
              title={featured.title}
              src={`https://www.youtube.com/embed/${featured.videoId}`}
              className="absolute inset-0 block h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#242c39] text-sm text-white/60">
              대표 영상이 아직 없습니다.
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function LongformPlaylistCard({ video }: { video: PublicVideoSummary }) {
  const publishedAt = formatLongDate(video.publishedAt);
  const metaLine = buildMetaLine(video);

  return (
    <Link
      href={video.href}
      className="group flex items-center gap-4 rounded-[4px] py-1 transition hover:opacity-90"
    >
      <div className="relative h-[84px] w-[132px] shrink-0 overflow-hidden rounded-[4px] bg-[#242c39]">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover opacity-72 transition duration-300 group-hover:scale-[1.03]"
            sizes="132px"
          />
        ) : null}
        <div className="absolute inset-0 bg-[#242c39]/82" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.1)] backdrop-blur-sm">
            <PlayIcon className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[20px] font-bold tracking-[-0.03em] text-[#10213f] md:line-clamp-1 md:text-[18px]">
          {video.title}
        </h3>
        {metaLine ? (
          <p className="mt-1 truncate text-[12px] font-medium text-[#10213f]/60">
            {metaLine}
          </p>
        ) : null}
        {publishedAt ? (
          <p className="mt-2 text-[14px] font-normal text-[#10213f]">{publishedAt}</p>
        ) : null}
      </div>
    </Link>
  );
}

function PlaylistPagination({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-2 pt-2" aria-label="영상 목록 페이지네이션">
      {currentPage === 1 ? (
        <span className="rounded-full border border-[#e6e7eb] px-[14px] py-[10px] text-[14px] leading-[1] text-[#9aa4b4]">
          이전
        </span>
      ) : (
        <Link
          href={buildPageHref(basePath, currentPage - 1)}
          prefetch={false}
          className="rounded-full border border-[#e6e7eb] px-[14px] py-[10px] text-[14px] leading-[1] text-[#10213f] transition hover:bg-[#f7f8fb]"
        >
          이전
        </Link>
      )}

      {visiblePages.map((page) => {
        const active = page === currentPage;
        if (active) {
          return (
            <span
              key={page}
              aria-current="page"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a2744] text-[12px] font-medium leading-none text-white"
            >
              {page}
            </span>
          );
        }

        return (
          <Link
            key={page}
            href={buildPageHref(basePath, page)}
            prefetch={false}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e6e7eb] text-[12px] font-medium leading-none text-[#10213f] transition hover:bg-[#f7f8fb]"
          >
            {page}
          </Link>
        );
      })}

      {currentPage === totalPages ? (
        <span className="rounded-full border border-[#e6e7eb] px-[14px] py-[10px] text-[14px] leading-[1] text-[#9aa4b4]">
          다음
        </span>
      ) : (
        <Link
          href={buildPageHref(basePath, currentPage + 1)}
          prefetch={false}
          className="rounded-full border border-[#e6e7eb] px-[14px] py-[10px] text-[14px] leading-[1] text-[#10213f] transition hover:bg-[#f7f8fb]"
        >
          다음
        </Link>
      )}
    </nav>
  );
}

function LongformPlaylistView({
  playlist,
  videos,
}: {
  playlist: PublicPlaylistDetail;
  videos: PublicVideoList;
}) {
  return (
    <div className="pb-16">
      <PageHeader title={playlist.title} subtitle={playlist.groupLabel ?? "Worship Videos"} />
      <Breadcrumb />

      <section className="bg-white">
        <div className="section-shell flex flex-col gap-10 pb-20 pt-16">
          <LongformHero featured={videos.featured} />

          <div className="h-px w-full bg-[#dfe3ea]" />

          <section className="space-y-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <SectionHeading label="Playlist" title="목록" />
              <a
                href={`https://www.youtube.com/playlist?list=${playlist.playlistId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 self-start text-[18px] font-medium tracking-[-0.03em] text-[#10213f] transition hover:text-[#1a2744]/70"
              >
                YouTube
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M7 17L17 7M17 7H9M17 7V15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            {videos.items.length > 0 ? (
              <>
                <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
                  {videos.items.map((video) => (
                    <LongformPlaylistCard key={video.videoId} video={video} />
                  ))}
                </div>
                <PlaylistPagination
                  basePath={playlist.fullPath}
                  currentPage={videos.currentPage}
                  totalPages={videos.totalPages}
                />
              </>
            ) : (
              <div className="rounded-[4px] border border-dashed border-[#d8dde6] px-6 py-14 text-center text-[15px] text-[#64748b]">
                공개된 영상이 아직 없습니다.
              </div>
            )}
          </section>

          <div className="h-px w-full bg-[#dfe3ea]" />
        </div>
      </section>
    </div>
  );
}

function ShortformPlaylistView({
  playlist,
  videos,
}: {
  playlist: PublicPlaylistDetail;
  videos: PublicVideoList;
}) {
  return (
    <div className="pb-16">
      <PageHeader title={playlist.title} subtitle={playlist.groupLabel ?? "Worship Videos"} />
      <Breadcrumb />

      <section className="bg-white">
        <div className="section-shell flex flex-col gap-10 pb-20 pt-16">
          <section className="w-full space-y-10">
            <SectionHeading label="SHORTS" title={playlist.title} />

            <PublicShortformPlaylistGrid
              path={playlist.fullPath}
              initialItems={videos.items}
              initialPage={videos.currentPage}
              initialPageSize={videos.pageSize}
              initialTotalPages={videos.totalPages}
            />
          </section>
        </div>
      </section>
    </div>
  );
}

export default function PublicVideoPlaylistView({
  playlist,
  videos,
}: {
  playlist: PublicPlaylistDetail;
  videos: PublicVideoList;
}) {
  if (videos.form === "SHORTFORM") {
    return <ShortformPlaylistView playlist={playlist} videos={videos} />;
  }

  return <LongformPlaylistView playlist={playlist} videos={videos} />;
}
