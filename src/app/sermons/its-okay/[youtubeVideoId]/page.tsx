import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShortsDetailPage from "@/components/shorts-detail-page";
import { getMediaDetail, getMediaList, MediaNotFoundError } from "@/lib/media-api";

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
    <ShortsDetailPage
      listHref="/sermons/its-okay"
      detail={detail}
      playlistItems={items}
    />
  );
}
