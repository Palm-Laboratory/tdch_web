import SectionHeading from "@/components/section-heading";
import SermonVideoCard from "@/app/sermons/components/sermon-video-card";
import type { MediaItemDto, MediaListResponse, SermonSiteKey } from "@/lib/media-api";
import { buildMediaDetailPath, buildMediaMeta } from "@/lib/media-api";
import { YOUTUBE_CHANNEL_URL } from "@/lib/site-config";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface SermonArchivePageProps {
  title: string;
  subtitle: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  siteKey: SermonSiteKey;
  response: MediaListResponse | null;
  showIntroCard?: boolean;
  showLatestEmbed?: boolean;
  latestEmbedTitle?: string;
  latestEmbedSubtitle?: string;
  showPlaylistRows?: boolean;
  playlistTitle?: string;
  playlistSubtitle?: string;
  currentPage?: number;
  latestEmbedItem?: MediaItemDto | null;
}

function getItemCategory(item: MediaItemDto, fallbackName: string): string {
  if (item.contentKind === "SHORT") {
    return "쇼츠";
  }

  return fallbackName;
}

function getItemType(item: MediaItemDto): string {
  if (item.serviceType) {
    return item.serviceType;
  }

  return item.contentKind === "SHORT" ? "짧은 영상" : "예배 영상";
}

export default function SermonArchivePage({
  title,
  subtitle,
  description,
  emptyTitle,
  emptyDescription,
  siteKey,
  response,
  showIntroCard = true,
  showLatestEmbed = false,
  latestEmbedTitle,
  latestEmbedSubtitle,
  showPlaylistRows = false,
  playlistTitle,
  playlistSubtitle,
  currentPage = 1,
  latestEmbedItem = null,
}: SermonArchivePageProps) {
  const items = response?.items ?? [];
  const menuName = response?.menu.name ?? title;
  const latestItem = latestEmbedItem ?? items[0];

  return (
    <section className="space-y-8">
      {showIntroCard ? (
        <div className="overflow-hidden rounded-[32px] border border-cedar/10 bg-white shadow-[0_20px_60px_rgba(16,33,63,0.08)]">
          <div className="bg-[linear-gradient(135deg,rgba(19,36,58,0.96),rgba(38,84,124,0.88))] px-8 py-12 text-ivory md:px-12">
            <p className="type-label font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
              {subtitle}
            </p>
            <h2 className="mt-3 type-section-title font-bold">
              {title}
            </h2>
            <p className="mt-4 max-w-3xl type-body leading-8 text-ivory/78">
              {description}
            </p>
          </div>

          <div className="grid gap-4 border-t border-cedar/10 bg-[#f8fbff] px-8 py-6 text-sm text-ink/72 md:grid-cols-3 md:px-12">
            <div>
              <p className="type-label font-semibold uppercase tracking-[0.16em] text-cedar/70">Menu</p>
              <p className="mt-2 type-body font-semibold text-ink">{menuName}</p>
            </div>
            <div>
              <p className="type-label font-semibold uppercase tracking-[0.16em] text-cedar/70">Count</p>
              <p className="mt-2 type-body font-semibold text-ink">{response?.totalElements ?? 0}개 영상</p>
            </div>
            <div>
              <p className="type-label font-semibold uppercase tracking-[0.16em] text-cedar/70">Source</p>
              <p className="mt-2 type-body font-semibold text-ink">YouTube Sync Database</p>
            </div>
          </div>
        </div>
      ) : null}

      {showLatestEmbed && latestItem ? (
        <div className="w-full">
          {(latestEmbedTitle || latestEmbedSubtitle) ? (
            <div className="mb-4">
              {latestEmbedTitle && latestEmbedSubtitle ? (
                <SectionHeading
                  label={latestEmbedSubtitle}
                  title={latestEmbedTitle}
                />
              ) : null}
            </div>
          ) : null}
          <div className="aspect-video w-full overflow-hidden bg-black">
            <iframe
              src={latestItem.embedUrl}
              title={latestItem.displayTitle}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}

      {items.length > 0 ? (
        showPlaylistRows ? (
          <div className="w-full">
            <div className="space-y-7 border-y border-black/10 py-7 md:space-y-9 md:py-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <SectionHeading
                    label={playlistSubtitle ?? "PLAYLIST"}
                    title={playlistTitle ?? `${menuName} 목록`}
                  />
                </div>
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex self-end items-center gap-2 whitespace-nowrap text-[1.1rem] font-medium tracking-[-0.01em] text-ink transition hover:text-cedar"
                >
                  <span>YouTube</span>
                  <span aria-hidden="true" className="text-[1.4rem] leading-none">→</span>
                </a>
              </div>

              <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
                {items.map((item) => (
                  <PlaylistRow
                    key={item.youtubeVideoId}
                    href={buildMediaDetailPath(siteKey, item.youtubeVideoId)}
                    thumbnail={item.thumbnailUrl}
                    thumbnailAlt={item.displayTitle}
                    label={getPlaylistLabel(item)}
                    title={item.displayTitle}
                    meta={buildPlaylistMeta(item)}
                  />
                ))}
              </div>

              <Pagination
                siteKey={siteKey}
                currentPage={currentPage}
                totalPages={response?.totalPages ?? 0}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <SermonVideoCard
                key={item.youtubeVideoId}
                href={buildMediaDetailPath(siteKey, item.youtubeVideoId)}
                thumbnail={item.thumbnailUrl}
                thumbnailAlt={item.displayTitle}
                category={getItemCategory(item, menuName)}
                type={getItemType(item)}
                title={item.displayTitle}
                meta={buildMediaMeta(item)}
                date={item.displayDate.replaceAll("-", ".")}
              />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-[32px] border border-dashed border-cedar/20 bg-white px-8 py-12 text-center shadow-[0_20px_60px_rgba(16,33,63,0.06)]">
          <p className="type-label font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">Media Pending</p>
          <h3 className="mt-3 type-card-title font-bold text-ink">{emptyTitle}</h3>
          <p className="mx-auto mt-3 max-w-2xl type-body leading-8 text-ink/68">
            {emptyDescription}
          </p>
        </div>
      )}
    </section>
  );
}

interface PaginationProps {
  siteKey: SermonSiteKey;
  currentPage: number;
  totalPages: number;
}

function Pagination({ siteKey, currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 0) {
    return null;
  }

  const normalizedCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const pages = buildPageNumbers(normalizedCurrentPage, totalPages);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 pt-2" aria-label="페이지 이동">
      <PaginationLink
        siteKey={siteKey}
        page={normalizedCurrentPage - 1}
        disabled={normalizedCurrentPage <= 1}
      >
        이전
      </PaginationLink>

      {pages.map((page) => (
        <PaginationLink
          key={page}
          siteKey={siteKey}
          page={page}
          active={page === normalizedCurrentPage}
        >
          {page}
        </PaginationLink>
      ))}

      <PaginationLink
        siteKey={siteKey}
        page={normalizedCurrentPage + 1}
        disabled={normalizedCurrentPage >= totalPages}
      >
        다음
      </PaginationLink>
    </nav>
  );
}

interface PaginationLinkProps {
  siteKey: SermonSiteKey;
  page: number;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

function PaginationLink({
  siteKey,
  page,
  active = false,
  disabled = false,
  children,
}: PaginationLinkProps) {
  if (disabled) {
    return (
      <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-black/8 px-4 text-sm font-medium text-ink/32">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={buildSermonListPath(siteKey, page)}
      scroll={false}
      prefetch
      aria-current={active ? "page" : undefined}
      className={[
        "inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-4 text-sm font-medium transition",
        active
          ? "border-ink bg-ink text-white"
          : "border-black/10 bg-white text-ink hover:border-cedar/30 hover:text-cedar",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function buildSermonListPath(siteKey: SermonSiteKey, page: number): string {
  if (page <= 1) {
    return `/sermons/${siteKey}`;
  }

  return `/sermons/${siteKey}?page=${page}`;
}

function buildPageNumbers(currentPage: number, totalPages: number): number[] {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pages: number[] = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

function getPlaylistLabel(item: MediaItemDto): string {
  return item.serviceType ?? item.scripture ?? "";
}

function buildPlaylistMeta(item: MediaItemDto): string {
  const meta = [item.displayDate.replaceAll("-", "."), item.preacher].filter(Boolean);
  return meta.join("   ");
}

interface PlaylistRowProps {
  href: string;
  thumbnail: string;
  thumbnailAlt: string;
  label: string;
  title: string;
  meta: string;
}

function PlaylistRow({
  href,
  thumbnail,
  thumbnailAlt,
  label,
  title,
  meta,
}: PlaylistRowProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-5 bg-transparent py-1 transition"
    >
      <div className="relative h-[112px] w-[192px] shrink-0 overflow-hidden rounded-[6px] bg-[#243a62]">
        <Image
          src={thumbnail}
          alt={thumbnailAlt}
          fill
          className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/16 shadow-[0_8px_20px_rgba(7,16,32,0.2)] backdrop-blur-sm">
            <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        {label ? (
          <p className="text-sm font-medium tracking-[0.01em] text-cedar/46 md:text-[0.95rem]">
            {label}
          </p>
        ) : null}
        <h3 className="mt-2 line-clamp-2 text-[1.12rem] font-bold leading-[1.32] tracking-[-0.01em] text-ink md:text-[1.2rem]">
          {title}
        </h3>
        <p className="mt-3 text-[0.98rem] font-medium tracking-[0.01em] text-cedar/42 md:text-[1.05rem]">
          {meta}
        </p>
      </div>
    </Link>
  );
}
