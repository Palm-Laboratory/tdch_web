import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SermonDetailPage from "@/app/(site)/sermons/components/sermon-detail-page";
import { getMediaDetail, getMediaList, MediaNotFoundError } from "@/lib/media-api";
import { SITE_URL, SITE_NAME, SITE_LOCALE } from "@/lib/seo";

interface BetterDevotionDetailPageProps {
  params: Promise<{
    youtubeVideoId: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: BetterDevotionDetailPageProps): Promise<Metadata> {
  const { youtubeVideoId } = await params;

  try {
    const detail = await getMediaDetail(youtubeVideoId);
    const title = detail?.displayTitle || detail?.title || "더 좋은 묵상";
    const description = [detail?.scripture, detail?.preacher, detail?.publishedAt?.slice(0, 10)]
      .filter(Boolean)
      .join(" — ") || "The 제자교회 더 좋은 묵상 페이지입니다.";
    const ogImage = detail?.thumbnailUrl
      ? { url: detail.thumbnailUrl, width: 1280, height: 720, alt: title }
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | ${SITE_NAME}`,
        description,
        url: `${SITE_URL}/sermons/better-devotion/${youtubeVideoId}`,
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
      title: "더 좋은 묵상",
      description: "The 제자교회 더 좋은 묵상 페이지입니다.",
    };
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
    <SermonDetailPage
      siteKey="better-devotion"
      sectionTitle="더 좋은 묵상"
      listHref="/sermons/better-devotion"
      detail={detail}
      relatedItems={relatedItems}
    />
  );
}
