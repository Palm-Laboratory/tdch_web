import type { Metadata } from "next";
import SermonArchivePage from "@/components/sermon-archive-page";
import { getMediaList } from "@/lib/media-api";

export const metadata: Metadata = {
  title: "더 좋은 묵상 | The 제자교회",
  description: "The 제자교회 더 좋은 묵상 콘텐츠를 확인하실 수 있습니다.",
};

export const dynamic = "force-dynamic";

export default async function BetterDevotionPage() {
  const response = await getMediaList("better-devotion", 24);

  return (
    <SermonArchivePage
      title="더 좋은 묵상"
      subtitle="BETTER DEVOTION"
      description="하루를 시작하는 묵상 콘텐츠를 모아두었습니다. 목록은 백엔드 YouTube sync 결과를 기반으로 자동으로 갱신됩니다."
      emptyTitle="더 좋은 묵상 영상이 아직 준비되지 않았습니다."
      emptyDescription="재생목록에 영상이 쌓이면 이 페이지에 자동으로 노출됩니다."
      response={response}
    />
  );
}
