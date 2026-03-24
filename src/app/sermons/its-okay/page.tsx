import type { Metadata } from "next";
import ShortsArchivePage from "@/components/shorts-archive-page";
import { getMediaList } from "@/lib/media-api";

export const metadata: Metadata = {
  title: "그래도 괜찮아 | The 제자교회",
  description: "The 제자교회 그래도 괜찮아 콘텐츠를 확인하실 수 있습니다.",
};

export const dynamic = "force-dynamic";

export default async function ItsOkayPage() {
  const response = await getMediaList("its-okay", 0, 24);

  return (
    <div className="pb-20">
      <ShortsArchivePage response={response} />
    </div>
  );
}
