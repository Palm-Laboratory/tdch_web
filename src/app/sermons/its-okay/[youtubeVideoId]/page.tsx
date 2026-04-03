import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShortsDetailPage from "@/app/sermons/components/shorts-detail-page";
import { getMediaDetail, getMediaList, MediaNotFoundError } from "@/lib/media-api";
import { SITE_URL, SITE_NAME, SITE_LOCALE } from "@/lib/seo";

interface ItsOkayDetailPageProps {
  params: Promise<{
    youtubeVideoId: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ItsOkayDetailPageProps): Promise<Metadata> {
  const { youtubeVideoId } = await params;

  try {
    const detail = await getMediaDetail(youtubeVideoId);
    const title = detail?.displayTitle || detail?.title || "그래도 괜찮아";
    const description = [detail?.preacher, detail?.publishedAt?.slice(0, 10)]
      .filter(Boolean)
      .join(" — ") || "The 제자교회 그래도 괜찮아 페이지입니다.";
    const ogImage = detail?.thumbnailUrl
      ? { url: detail.thumbnailUrl, width: 1280, height: 720, alt: title }
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | ${SITE_NAME}`,
        description,
        url: `${SITE_URL}/sermons/its-okay/${youtubeVideoId}`,
        siteName: SITE_NAME,
        locale: SITE_LOCALE,
        type: "article",
        ...(ogImage && { images: [ogImage] }),
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ${SITE_NAME}`,
        description,
        ...(ogImage && { images: [ogImage.url] }),
      },
    };
  } catch {
    return {
      title: "그래도 괜찮아",
      description: "The 제자교회 그래도 괜찮아 페이지입니다.",
    };
  }
}

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
