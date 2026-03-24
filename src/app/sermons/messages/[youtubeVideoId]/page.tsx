import type { Metadata } from "next";
import SermonDetailPage from "@/components/sermon-detail-page";
import { getMediaDetail, getMediaList } from "@/lib/media-api";

interface MessagesDetailPageProps {
  params: Promise<{
    youtubeVideoId: string;
  }>;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "말씀 / 설교 상세 | The 제자교회",
  description: "The 제자교회 말씀과 설교 상세 페이지입니다.",
};

export default async function MessagesDetailPage({ params }: MessagesDetailPageProps) {
  const { youtubeVideoId } = await params;
  const [detail, response] = await Promise.all([
    getMediaDetail(youtubeVideoId),
    getMediaList("messages", 0, 10),
  ]);
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
