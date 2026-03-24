import SermonVideoCard from "@/components/sermon-video-card";
import type { MediaItemDto, MediaListResponse } from "@/lib/media-api";
import { buildMediaMeta } from "@/lib/media-api";

interface SermonArchivePageProps {
  title: string;
  subtitle: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  response: MediaListResponse | null;
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
  response,
}: SermonArchivePageProps) {
  const items = response?.items ?? [];
  const menuName = response?.menu.name ?? title;

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-[32px] border border-cedar/10 bg-white shadow-[0_20px_60px_rgba(16,33,63,0.08)]">
        <div className="bg-[linear-gradient(135deg,rgba(19,36,58,0.96),rgba(38,84,124,0.88))] px-8 py-12 text-ivory md:px-12">
          <p className="type-label font-semibold uppercase tracking-[0.2em] text-ivory/65">
            {subtitle}
          </p>
          <h2 className="mt-3 type-section-title font-serif font-bold">
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

      {items.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <SermonVideoCard
              key={item.youtubeVideoId}
              href={item.youtubeUrl}
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
      ) : (
        <div className="rounded-[32px] border border-dashed border-cedar/20 bg-white px-8 py-12 text-center shadow-[0_20px_60px_rgba(16,33,63,0.06)]">
          <p className="type-label font-semibold uppercase tracking-[0.2em] text-cedar/70">Media Pending</p>
          <h3 className="mt-3 type-card-title font-bold text-ink">{emptyTitle}</h3>
          <p className="mx-auto mt-3 max-w-2xl type-body leading-8 text-ink/68">
            {emptyDescription}
          </p>
        </div>
      )}
    </section>
  );
}
