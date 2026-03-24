import type { Metadata } from "next";
import SermonDetailPage from "@/components/sermon-detail-page";
import { getMediaDetail, getMediaList } from "@/lib/media-api";

interface ItsOkayDetailPageProps {
  params: Promise<{
    youtubeVideoId: string;
  }>;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "그래도 괜찮아 상세 | The 제자교회",
  description: "The 제자교회 그래도 괜찮아 상세 페이지입니다.",
};

export default async function ItsOkayDetailPage({ params }: ItsOkayDetailPageProps) {
  const { youtubeVideoId } = await params;
  const [detail, response] = await Promise.all([
    getMediaDetail(youtubeVideoId),
    getMediaList("its-okay", 0, 10),
  ]);
  const relatedItems = (response?.items ?? [])
    .filter((item) => item.youtubeVideoId !== youtubeVideoId)
    .slice(0, 8);

  return (
    <SermonDetailPage
      siteKey="its-okay"
      sectionTitle="그래도 괜찮아"
      listHref="/sermons/its-okay"
      detail={detail}
      relatedItems={relatedItems}
    />
  );
}
