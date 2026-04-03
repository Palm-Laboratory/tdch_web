import type { Metadata } from "next";
import SermonArchivePage from "@/app/sermons/components/sermon-archive-page";
import { getMediaList } from "@/lib/media-api";

const PAGE_SIZE = 6;

interface MessagesPageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "말씀 / 설교",
  description: "The 제자교회 말씀과 설교 영상을 확인하실 수 있습니다.",
};

export const dynamic = "force-dynamic";

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parsePageParam(resolvedSearchParams?.page);
  const [response, latestResponse] = await Promise.all([
    getMediaList("messages", currentPage - 1, PAGE_SIZE),
    getMediaList("messages", 0, 1),
  ]);

  return (
    <div className="pb-20">
      <SermonArchivePage
        siteKey="messages"
        title="말씀 / 설교"
        subtitle="SERMON MESSAGES"
        description="주일 설교와 말씀 영상을 한곳에서 확인하실 수 있습니다. 운영 메타데이터를 추가하면 본문과 설교자 정보도 함께 더 정제해서 보여줄 수 있습니다."
        emptyTitle="말씀 영상이 아직 준비되지 않았습니다."
        emptyDescription="백엔드 sync 후 이 영역에서 최신 설교 목록이 자동으로 노출됩니다."
        response={response}
        showIntroCard={false}
        showLatestEmbed
        latestEmbedItem={latestResponse?.items[0] ?? null}
        latestEmbedTitle="주일 예배"
        latestEmbedSubtitle="SUNDAY WORSHIP"
        showPlaylistRows
        playlistTitle="설교 목록"
        playlistSubtitle="PLAYLIST"
        currentPage={currentPage}
      />
    </div>
  );
}

function parsePageParam(page: string | undefined): number {
  const parsed = Number(page);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}
