import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SermonDetailPage from "@/components/sermon-detail-page";
import { getMediaDetail, getMediaList, MediaNotFoundError } from "@/lib/media-api";

interface BetterDevotionDetailPageProps {
  params: Promise<{
    youtubeVideoId: string;
  }>;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "더 좋은 묵상 | The 제자교회",
  description: "The 제자교회 더 좋은 묵상 페이지입니다.",
};

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
