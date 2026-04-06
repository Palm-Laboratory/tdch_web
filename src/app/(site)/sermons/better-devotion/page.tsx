import type { Metadata } from "next";
import SermonArchivePage from "@/app/(site)/sermons/components/sermon-archive-page";
import { getMediaList } from "@/lib/media-api";
import { createPageMetadata } from "@/lib/seo";

const PAGE_SIZE = 6;

interface BetterDevotionPageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: BetterDevotionPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const currentPage = parsePageParam(resolvedSearchParams?.page);
  const path =
    currentPage > 1
      ? `/sermons/better-devotion?page=${currentPage}`
      : "/sermons/better-devotion";

  return createPageMetadata({
    title: "더 좋은 묵상",
    description: "The 제자교회 더 좋은 묵상 콘텐츠를 확인하실 수 있습니다.",
    path,
  });
}

export default async function BetterDevotionPage({ searchParams }: BetterDevotionPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parsePageParam(resolvedSearchParams?.page);
  const [response, latestResponse] = await Promise.all([
    getMediaList("better-devotion", currentPage - 1, PAGE_SIZE),
    getMediaList("better-devotion", 0, 1),
  ]);

  return (
    <div className="pb-20">
      <SermonArchivePage
        siteKey="better-devotion"
        title="더 좋은 묵상"
        subtitle="BETTER DEVOTION"
        description="하루를 시작하는 묵상 콘텐츠를 모아두었습니다. 목록은 백엔드 YouTube sync 결과를 기반으로 자동으로 갱신됩니다."
        emptyTitle="더 좋은 묵상 영상이 아직 준비되지 않았습니다."
        emptyDescription="재생목록에 영상이 쌓이면 이 페이지에 자동으로 노출됩니다."
        response={response}
        showIntroCard={false}
        showLatestEmbed
        latestEmbedItem={latestResponse?.items[0] ?? null}
        showPlaylistRows
        playlistTitle="묵상 목록"
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
