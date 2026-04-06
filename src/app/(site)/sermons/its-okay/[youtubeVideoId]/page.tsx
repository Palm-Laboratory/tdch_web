import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShortsDetailPage from "@/app/(site)/sermons/components/shorts-detail-page";
import { VideoJsonLd } from "@/components/json-ld";
import { getMediaDetail, getMediaList, MediaNotFoundError } from "@/lib/media-api";
import { createPageMetadata, createVideoMetadata } from "@/lib/seo";

interface ItsOkayDetailPageProps {
  params: Promise<{
    youtubeVideoId: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ItsOkayDetailPageProps): Promise<Metadata> {
  const { youtubeVideoId } = await params;
  const path = `/sermons/its-okay/${youtubeVideoId}`;

  try {
    const detail = await getMediaDetail(youtubeVideoId);
    const title = detail?.displayTitle || detail?.title || "그래도 괜찮아";
    const description = [detail?.preacher, detail?.publishedAt?.slice(0, 10)]
      .filter(Boolean)
      .join(" — ") || "The 제자교회 그래도 괜찮아 페이지입니다.";
    const ogImage = detail?.thumbnailUrl
      ? { url: detail.thumbnailUrl, width: 1280, height: 720, alt: title }
      : undefined;

    return createVideoMetadata({
      title,
      description,
      path,
      ogImage,
      publishedTime: detail?.publishedAt,
    });
  } catch {
    return createPageMetadata({
      title: "그래도 괜찮아",
      description: "The 제자교회 그래도 괜찮아 페이지입니다.",
      path,
    });
  }
}

export default async function ItsOkayDetailPage({ params }: ItsOkayDetailPageProps) {
  const { youtubeVideoId } = await params;
  let detail;

  try {
    [detail] = await Promise.all([
      getMediaDetail(youtubeVideoId),
    ]);
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      notFound();
    }
    throw error;
  }

  const response = await getMediaList("its-okay", 0, 100);
  const items = response?.items ?? [];

  return (
    <>
      {detail ? (
        <VideoJsonLd
          title={detail.displayTitle || detail.title}
          description={
            [detail.preacher, detail.publishedAt.slice(0, 10)]
              .filter(Boolean)
              .join(" — ") || "The 제자교회 그래도 괜찮아 페이지입니다."
          }
          path={`/sermons/its-okay/${youtubeVideoId}`}
          thumbnailUrl={detail.thumbnailUrl}
          uploadDate={detail.publishedAt}
          embedUrl={detail.embedUrl}
          youtubeUrl={detail.youtubeUrl}
          preacher={detail.preacher}
          tags={detail.tags}
        />
      ) : null}
      <ShortsDetailPage
        listHref="/sermons/its-okay"
        detail={detail}
        playlistItems={items}
      />
    </>
  );
}
