import Link from "next/link";
import type { MediaItemDto, VideoDetailResponse } from "@/lib/media-api";
import ShortsDetailViewer from "@/app/(site)/sermons/components/shorts-detail-viewer";

interface ShortsDetailPageProps {
  detail: VideoDetailResponse | null;
  playlistItems: MediaItemDto[];
  listHref: string;
}

export default function ShortsDetailPage({
  detail,
  playlistItems,
  listHref,
}: ShortsDetailPageProps) {
  if (!detail) {
    return (
      <section className="h-[100svh] overflow-hidden px-0 py-0 text-ink md:h-[calc(100svh-92px)] md:px-8 md:py-8">
        <div className="mx-auto flex h-full max-w-[1520px] items-center">
          <div className="w-full rounded-[28px] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">Shorts</p>
            <h1 className="mt-3 text-[1.9rem] font-bold tracking-[-0.03em] text-white">
              쇼츠 영상을 불러오지 못했습니다.
            </h1>
            <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-white/70">
              API 연결 상태를 확인한 뒤 다시 시도해 주세요. 목록으로 돌아가 다른 쇼츠를 먼저 확인할 수 있습니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={listHref}
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-white/90"
              >
                쇼츠 목록
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const normalizedItems = playlistItems.some(
    (item) => item.youtubeVideoId === detail.youtubeVideoId,
  )
    ? playlistItems
    : [
        {
          youtubeVideoId: detail.youtubeVideoId,
          title: detail.title,
          displayTitle: detail.displayTitle,
          thumbnailUrl: detail.thumbnailUrl,
          youtubeUrl: detail.youtubeUrl,
          embedUrl: detail.embedUrl,
          publishedAt: detail.publishedAt,
          displayDate: detail.publishedAt.slice(0, 10),
          contentKind: detail.contentKind,
          preacher: detail.preacher,
          scripture: detail.scripture,
          serviceType: detail.serviceType,
          featured: false,
        },
        ...playlistItems,
      ];

  return (
    <section className="h-[100svh] overflow-hidden bg-black px-0 py-0 text-ink md:h-[calc(100svh-92px)] md:bg-transparent md:px-8 md:py-6">
      <div className="relative h-full w-full md:mx-auto md:flex md:max-w-[1520px] md:items-center md:justify-center">
        <ShortsDetailViewer
          initialVideoId={detail.youtubeVideoId}
          items={normalizedItems}
          listHref={listHref}
        />
      </div>
    </section>
  );
}
