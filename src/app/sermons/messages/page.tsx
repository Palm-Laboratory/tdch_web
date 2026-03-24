import type { Metadata } from "next";
import SermonArchivePage from "@/components/sermon-archive-page";
import { getMediaList } from "@/lib/media-api";

export const metadata: Metadata = {
  title: "말씀 / 설교 | The 제자교회",
  description: "The 제자교회 말씀과 설교 영상을 확인하실 수 있습니다.",
};

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const response = await getMediaList("messages", 24);

  return (
    <SermonArchivePage
      title="말씀 / 설교"
      subtitle="SERMON MESSAGES"
      description="주일 설교와 말씀 영상을 한곳에서 확인하실 수 있습니다. 운영 메타데이터를 추가하면 본문과 설교자 정보도 함께 더 정제해서 보여줄 수 있습니다."
      emptyTitle="말씀 영상이 아직 준비되지 않았습니다."
      emptyDescription="백엔드 sync 후 이 영역에서 최신 설교 목록이 자동으로 노출됩니다."
      response={response}
    />
  );
}
