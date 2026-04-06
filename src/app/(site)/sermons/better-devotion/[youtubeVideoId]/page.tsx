import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SermonDetailPage from "@/app/(site)/sermons/components/sermon-detail-page";
import { VideoJsonLd } from "@/components/json-ld";
import { getMediaDetail, getMediaList, MediaNotFoundError } from "@/lib/media-api";
import { createPageMetadata, createVideoMetadata } from "@/lib/seo";

interface BetterDevotionDetailPageProps {
  params: Promise<{
    youtubeVideoId: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: BetterDevotionDetailPageProps): Promise<Metadata> {
  const { youtubeVideoId } = await params;
  const path = `/sermons/better-devotion/${youtubeVideoId}`;

  try {
    const detail = await getMediaDetail(youtubeVideoId);
    const title = detail?.displayTitle || detail?.title || "더 좋은 묵상";
    const description = [detail?.scripture, detail?.preacher, detail?.publishedAt?.slice(0, 10)]
      .filter(Boolean)
      .join(" — ") || "The 제자교회 더 좋은 묵상 페이지입니다.";
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
      title: "더 좋은 묵상",
      description: "The 제자교회 더 좋은 묵상 페이지입니다.",
      path,
    });
  }
}

export default async function BetterDevotionDetailPage({
  params,
}: BetterDevotionDetailPageProps) {
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

  const response = await getMediaList("better-devotion", 0, 10);
  const relatedItems = (response?.items ?? [])
    .filter((item) => item.youtubeVideoId !== youtubeVideoId)
    .slice(0, 8);

  return (
    <>
      {detail ? (
        <VideoJsonLd
          title={detail.displayTitle || detail.title}
          description={
            [detail.scripture, detail.preacher, detail.publishedAt.slice(0, 10)]
              .filter(Boolean)
              .join(" — ") || "The 제자교회 더 좋은 묵상 페이지입니다."
          }
          path={`/sermons/better-devotion/${youtubeVideoId}`}
          thumbnailUrl={detail.thumbnailUrl}
          uploadDate={detail.publishedAt}
          embedUrl={detail.embedUrl}
          youtubeUrl={detail.youtubeUrl}
          preacher={detail.preacher}
          tags={detail.tags}
        />
      ) : null}
      <SermonDetailPage
        siteKey="better-devotion"
        sectionTitle="더 좋은 묵상"
        listHref="/sermons/better-devotion"
        detail={detail}
        relatedItems={relatedItems}
      />
    </>
  );
}
