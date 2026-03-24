import type { Metadata } from "next";
import SermonDetailPage from "@/components/sermon-detail-page";
import { getMediaDetail } from "@/lib/media-api";

interface BetterDevotionDetailPageProps {
  params: Promise<{
    youtubeVideoId: string;
  }>;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "더 좋은 묵상 상세 | The 제자교회",
  description: "The 제자교회 더 좋은 묵상 상세 페이지입니다.",
};

export default async function BetterDevotionDetailPage({
  params,
}: BetterDevotionDetailPageProps) {
  const { youtubeVideoId } = await params;
  const detail = await getMediaDetail(youtubeVideoId);

  return (
    <div className="pb-20">
      <SermonDetailPage
        siteKey="better-devotion"
        sectionTitle="더 좋은 묵상"
        sectionSubtitle="BETTER DEVOTION DETAIL"
        listHref="/sermons/better-devotion"
        detail={detail}
      />
    </div>
  );
}
