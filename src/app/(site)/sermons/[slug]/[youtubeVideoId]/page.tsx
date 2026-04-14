import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SermonDetailPage from "@/app/(site)/sermons/components/sermon-detail-page";
import ShortsDetailPage from "@/app/(site)/sermons/components/shorts-detail-page";
import { VideoJsonLd } from "@/components/json-ld";
import {
  getMediaDetail,
  getMediaListStrict,
  MediaListResponse,
  MediaNotFoundError,
  VideoDetailResponse,
} from "@/lib/media-api";
import { createPageMetadata, createVideoMetadata } from "@/lib/seo";

const LONG_FORM_RELATED_PAGE_SIZE = 10;
const SHORT_FORM_PLAYLIST_SIZE = 100;

interface SermonDetailRouteProps {
  params: Promise<{
    slug: string;
    youtubeVideoId: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: SermonDetailRouteProps): Promise<Metadata> {
  const { slug, youtubeVideoId } = await params;
  const path = `/sermons/${slug}/${youtubeVideoId}`;

  try {
    const [preview, detail] = await Promise.all([
      getMediaListStrict(slug, 0, 1),
      getMediaDetailStrict(youtubeVideoId),
    ]);

    return createVideoMetadata({
      title: detail.displayTitle || detail.title || preview.menu.name,
      description: buildVideoDescription(preview, detail),
      path,
      ogImage: detail.thumbnailUrl
        ? { url: detail.thumbnailUrl, width: 1280, height: 720, alt: detail.displayTitle || detail.title }
        : undefined,
      publishedTime: detail.publishedAt,
    });
  } catch {
    return createPageMetadata({
      title: "예배 영상",
      description: "The 제자교회 예배 영상 상세 페이지입니다.",
      path,
    });
  }
}

export default async function SermonDetailRoute({ params }: SermonDetailRouteProps) {
  const { slug, youtubeVideoId } = await params;
  const preview = await loadPreview(slug);
  const detail = await getMediaDetailStrict(youtubeVideoId);

  if (preview.menu.contentKind === "SHORT") {
    const response = await loadShortsPlaylist(slug);
    return (
      <>
        <VideoJsonLd
          title={detail.displayTitle || detail.title}
          description={buildVideoDescription(preview, detail)}
          path={`/sermons/${slug}/${youtubeVideoId}`}
          thumbnailUrl={detail.thumbnailUrl}
          uploadDate={detail.publishedAt}
          embedUrl={detail.embedUrl}
          youtubeUrl={detail.youtubeUrl}
          preacher={detail.preacher}
          tags={detail.tags}
        />
        <ShortsDetailPage
          listHref={`/sermons/${slug}`}
          detail={detail}
          playlistItems={response.items}
        />
      </>
    );
  }

  const response = await loadLongFormRelated(slug);
  const relatedItems = response.items
    .filter((item) => item.youtubeVideoId !== youtubeVideoId)
    .slice(0, 8);

  return (
    <>
      <VideoJsonLd
        title={detail.displayTitle || detail.title}
        description={buildVideoDescription(preview, detail)}
        path={`/sermons/${slug}/${youtubeVideoId}`}
        thumbnailUrl={detail.thumbnailUrl}
        uploadDate={detail.publishedAt}
        embedUrl={detail.embedUrl}
        youtubeUrl={detail.youtubeUrl}
        preacher={detail.preacher}
        tags={detail.tags}
      />
      <SermonDetailPage
        siteKey={slug}
        sectionTitle={preview.menu.name}
        listHref={`/sermons/${slug}`}
        detail={detail}
        relatedItems={relatedItems}
      />
    </>
  );
}

async function loadPreview(slug: string): Promise<MediaListResponse> {
  try {
    return await getMediaListStrict(slug, 0, 1);
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      notFound();
    }
    throw error;
  }
}

async function loadShortsPlaylist(slug: string): Promise<MediaListResponse> {
  try {
    return await getMediaListStrict(slug, 0, SHORT_FORM_PLAYLIST_SIZE);
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      notFound();
    }
    throw error;
  }
}

async function loadLongFormRelated(slug: string): Promise<MediaListResponse> {
  try {
    return await getMediaListStrict(slug, 0, LONG_FORM_RELATED_PAGE_SIZE);
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      notFound();
    }
    throw error;
  }
}

async function getMediaDetailStrict(youtubeVideoId: string): Promise<VideoDetailResponse> {
  try {
    const detail = await getMediaDetail(youtubeVideoId);
    if (!detail) {
      throw new Error(`Media detail missing for ${youtubeVideoId}`);
    }
    return detail;
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      notFound();
    }
    throw error;
  }
}

function buildVideoDescription(
  preview: MediaListResponse,
  detail: VideoDetailResponse,
): string {
  const baseSegments =
    preview.menu.contentKind === "SHORT"
      ? [detail.preacher, detail.publishedAt.slice(0, 10)]
      : [detail.scripture, detail.preacher, detail.publishedAt.slice(0, 10)];

  return (
    baseSegments.filter(Boolean).join(" — ") ||
    `The 제자교회 ${preview.menu.name} 상세 페이지입니다.`
  );
}
