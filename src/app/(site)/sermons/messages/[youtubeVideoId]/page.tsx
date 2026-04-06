import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SermonDetailPage from "@/app/(site)/sermons/components/sermon-detail-page";
import { getMediaDetail, getMediaList, MediaNotFoundError } from "@/lib/media-api";
import { SITE_URL, SITE_NAME, SITE_LOCALE } from "@/lib/seo";

interface MessagesDetailPageProps {
  params: Promise<{
    youtubeVideoId: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: MessagesDetailPageProps): Promise<Metadata> {
  const { youtubeVideoId } = await params;

  try {
    const detail = await getMediaDetail(youtubeVideoId);
    const title = detail?.displayTitle || detail?.title || "말씀 / 설교";
    const description = [detail?.scripture, detail?.preacher, detail?.publishedAt?.slice(0, 10)]
      .filter(Boolean)
      .join(" — ") || "The 제자교회 말씀과 설교 페이지입니다.";
    const ogImage = detail?.thumbnailUrl
      ? { url: detail.thumbnailUrl, width: 1280, height: 720, alt: title }
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | ${SITE_NAME}`,
        description,
        url: `${SITE_URL}/sermons/messages/${youtubeVideoId}`,
        siteName: SITE_NAME,
        locale: SITE_LOCALE,
        type: "article",
        ...(ogImage && { images: [ogImage] }),
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ${SITE_NAME}`,
        description,
        ...(ogImage && { images: [ogImage.url] }),
      },
    };
  } catch {
    return {
      title: "말씀 / 설교",
      description: "The 제자교회 말씀과 설교 페이지입니다.",
    };
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
    <SermonDetailPage
      siteKey="messages"
      sectionTitle="말씀 / 설교"
      listHref="/sermons/messages"
      detail={detail}
      relatedItems={relatedItems}
    />
  );
}
