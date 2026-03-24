import type { Metadata } from "next";
import SermonArchivePage from "@/components/sermon-archive-page";
import { getMediaList } from "@/lib/media-api";

export const metadata: Metadata = {
  title: "그래도 괜찮아 | The 제자교회",
  description: "The 제자교회 그래도 괜찮아 콘텐츠를 확인하실 수 있습니다.",
};

export const dynamic = "force-dynamic";

export default async function ItsOkayPage() {
  const response = await getMediaList("its-okay", 24);

  return (
    <div className="pb-20">
      <SermonArchivePage
        siteKey="its-okay"
        title="그래도 괜찮아"
        subtitle="IT'S OKAY"
        description="짧지만 선명한 위로와 회복의 메시지를 모았습니다. 운영 sync 이후 최신 영상이 이 페이지로 바로 연결됩니다."
        emptyTitle="짧은 영상 콘텐츠가 아직 준비되지 않았습니다."
        emptyDescription="백엔드 sync가 완료되면 이 페이지에서 최신 쇼츠를 확인하실 수 있습니다."
        response={response}
        showIntroCard={false}
      />
    </div>
  );
}
