import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SermonDetailPage from "@/app/(site)/sermons/components/sermon-detail-page";
import { VideoJsonLd } from "@/components/json-ld";
import { getMediaDetail, getMediaList, MediaNotFoundError } from "@/lib/media-api";
import { createPageMetadata, createVideoMetadata } from "@/lib/seo";

interface MessagesDetailPageProps {
  params: Promise<{
    youtubeVideoId: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: MessagesDetailPageProps): Promise<Metadata> {
  const { youtubeVideoId } = await params;
  const path = `/sermons/messages/${youtubeVideoId}`;

  try {
    const detail = await getMediaDetail(youtubeVideoId);
    const title = detail?.displayTitle || detail?.title || "말씀 / 설교";
    const description = [detail?.scripture, detail?.preacher, detail?.publishedAt?.slice(0, 10)]
      .filter(Boolean)
      .join(" — ") || "The 제자교회 말씀과 설교 페이지입니다.";
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
      title: "말씀 / 설교",
      description: "The 제자교회 말씀과 설교 페이지입니다.",
      path,
    });
  }
}

export default async function MessagesDetailPage({ params }: MessagesDetailPageProps) {
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

  const response = await getMediaList("messages", 0, 10);
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
              .join(" — ") || "The 제자교회 말씀과 설교 페이지입니다."
          }
          path={`/sermons/messages/${youtubeVideoId}`}
          thumbnailUrl={detail.thumbnailUrl}
          uploadDate={detail.publishedAt}
          embedUrl={detail.embedUrl}
          youtubeUrl={detail.youtubeUrl}
          preacher={detail.preacher}
          tags={detail.tags}
        />
      ) : null}
      <SermonDetailPage
        siteKey="messages"
        sectionTitle="말씀 / 설교"
        listHref="/sermons/messages"
        detail={detail}
        relatedItems={relatedItems}
      />
    </>
  );
}
