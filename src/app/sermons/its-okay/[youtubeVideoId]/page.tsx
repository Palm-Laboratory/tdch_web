import type { Metadata } from "next";
import SermonDetailPage from "@/components/sermon-detail-page";
import { getMediaDetail } from "@/lib/media-api";

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
  const detail = await getMediaDetail(youtubeVideoId);

  return (
    <div className="pb-20">
      <SermonDetailPage
        siteKey="its-okay"
        sectionTitle="그래도 괜찮아"
        sectionSubtitle="IT'S OKAY DETAIL"
        listHref="/sermons/its-okay"
        detail={detail}
      />
    </div>
  );
}
