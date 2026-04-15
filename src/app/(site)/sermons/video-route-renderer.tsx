import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SermonArchivePage from "@/app/(site)/sermons/components/sermon-archive-page";
import SermonDetailPage from "@/app/(site)/sermons/components/sermon-detail-page";
import ShortsArchivePage from "@/app/(site)/sermons/components/shorts-archive-page";
import ShortsDetailPage from "@/app/(site)/sermons/components/shorts-detail-page";
import { VideoJsonLd } from "@/components/json-ld";
import {
  getMediaListStrict,
  getOwnedMediaDetail,
  MediaListResponse,
  MediaNotFoundError,
  VideoDetailResponse,
} from "@/lib/media-api";
import { createPageMetadata, createVideoMetadata } from "@/lib/seo";
import { buildVideoDetailPath, buildVideoListPath } from "@/lib/video-route-utils";

const LONG_FORM_PAGE_SIZE = 6;
const LONG_FORM_RELATED_PAGE_SIZE = 10;
const SHORT_FORM_PAGE_SIZE = 24;
const SHORT_FORM_PLAYLIST_SIZE = 100;

export async function generateVideoListMetadata({
  rootHref,
  slug,
  currentPage,
}: {
  rootHref: string;
  slug: string;
  currentPage: number;
}): Promise<Metadata> {
  const listPath = buildVideoListPath(rootHref);
  const path = currentPage > 1 ? `${listPath}?page=${currentPage}` : listPath;

  try {
    const preview = await getMediaListStrict(slug, 0, 1);
    return createPageMetadata({
      title: preview.menu.name,
      description: buildListDescription(preview),
      path,
    });
  } catch {
    return createPageMetadata({
      title: "예배 영상",
      description: "The 제자교회 예배 영상 아카이브입니다.",
      path,
    });
  }
}

export async function renderVideoListPage({
  rootHref,
  slug,
  currentPage,
}: {
  rootHref: string;
  slug: string;
  currentPage: number;
}) {
  const preview = await loadMediaPreview(slug);
  const listHref = buildVideoListPath(rootHref);

  if (preview.menu.contentKind === "SHORT") {
    const response = await loadMediaListOrNotFound(slug, 0, SHORT_FORM_PAGE_SIZE);

    return (
      <div className="pb-20">
        <ShortsArchivePage
          rootHref={listHref}
          response={response}
          title={response.menu.name}
          subtitle="SHORTS"
          emptyDescription="재생목록에 영상이 쌓이면 이 페이지에 자동으로 노출됩니다."
        />
      </div>
    );
  }

  const [response, latestResponse] = await Promise.all([
    loadLongFormResponse(slug, currentPage),
    loadMediaListOrNotFound(slug, 0, 1),
  ]);

  return (
    <div className="pb-20">
      <SermonArchivePage
        listHref={listHref}
        title={response.menu.name}
        subtitle="SERMON PLAYLIST"
        description={`${response.menu.name} 예배 영상을 한곳에서 확인하실 수 있습니다. 운영 메타데이터를 추가하면 본문과 설교자 정보를 함께 더 정제해서 보여줄 수 있습니다.`}
        emptyTitle={`${response.menu.name} 영상이 아직 준비되지 않았습니다.`}
        emptyDescription="백엔드 sync 후 이 영역에서 최신 영상 목록이 자동으로 노출됩니다."
        response={response}
        showIntroCard={false}
        showLatestEmbed
        latestEmbedItem={latestResponse.items[0] ?? null}
        latestEmbedTitle="최신 영상"
        latestEmbedSubtitle="LATEST VIDEO"
        showPlaylistRows
        playlistTitle={`${response.menu.name} 목록`}
        playlistSubtitle="PLAYLIST"
        currentPage={currentPage}
      />
    </div>
  );
}

export async function generateVideoDetailMetadata({
  rootHref,
  slug,
  youtubeVideoId,
}: {
  rootHref: string;
  slug: string;
  youtubeVideoId: string;
}): Promise<Metadata> {
  const path = buildVideoDetailPath(rootHref, youtubeVideoId);

  try {
    const [preview, detail] = await Promise.all([
      loadMediaListOrNotFound(slug, 0, 1),
      loadOwnedMediaDetailOrNotFound(slug, youtubeVideoId),
    ]);
    const detailTitle = resolveDetailTitle(detail);

    return createVideoMetadata({
      title: detailTitle || preview.menu.name,
      description: buildVideoDescription(preview, detail),
      path,
      ogImage: detail.thumbnailUrl
        ? { url: detail.thumbnailUrl, width: 1280, height: 720, alt: detailTitle }
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

export async function renderVideoDetailPage({
  rootHref,
  slug,
  youtubeVideoId,
}: {
  rootHref: string;
  slug: string;
  youtubeVideoId: string;
}) {
  const preview = await loadMediaPreview(slug);
  const detail = await loadOwnedMediaDetailOrNotFound(slug, youtubeVideoId);
  const detailTitle = resolveDetailTitle(detail);
  const detailPath = buildVideoDetailPath(rootHref, youtubeVideoId);
  const listHref = buildVideoListPath(rootHref);

  if (preview.menu.contentKind === "SHORT") {
    const response = await loadMediaListOrNotFound(slug, 0, SHORT_FORM_PLAYLIST_SIZE);
    return (
      <>
        <VideoJsonLd
          title={detailTitle}
          description={buildVideoDescription(preview, detail)}
          path={detailPath}
          thumbnailUrl={detail.thumbnailUrl}
          uploadDate={detail.publishedAt}
          embedUrl={detail.embedUrl}
          youtubeUrl={detail.youtubeUrl}
          preacher={detail.preacher}
          tags={detail.tags}
        />
        <ShortsDetailPage
          listHref={listHref}
          detail={detail}
          playlistItems={response.items}
        />
      </>
    );
  }

  const response = await loadMediaListOrNotFound(slug, 0, LONG_FORM_RELATED_PAGE_SIZE);
  const relatedItems = response.items
    .filter((item) => item.youtubeVideoId !== youtubeVideoId)
    .slice(0, 8);

  return (
    <>
      <VideoJsonLd
        title={detailTitle}
        description={buildVideoDescription(preview, detail)}
        path={detailPath}
        thumbnailUrl={detail.thumbnailUrl}
        uploadDate={detail.publishedAt}
        embedUrl={detail.embedUrl}
        youtubeUrl={detail.youtubeUrl}
        preacher={detail.preacher}
        tags={detail.tags}
      />
      <SermonDetailPage
        sectionTitle={preview.menu.name}
        listHref={listHref}
        detail={detail}
        relatedItems={relatedItems}
      />
    </>
  );
}

export function parsePageParam(page: string | undefined): number {
  const parsed = Number(page);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

async function loadMediaPreview(slug: string): Promise<MediaListResponse> {
  return loadMediaListOrNotFound(slug, 0, 1);
}

async function loadMediaListOrNotFound(
  slug: string,
  page: number,
  size: number,
): Promise<MediaListResponse> {
  try {
    return await getMediaListStrict(slug, page, size);
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      notFound();
    }
    throw error;
  }
}

async function loadLongFormResponse(slug: string, currentPage: number): Promise<MediaListResponse> {
  return loadMediaListOrNotFound(slug, currentPage - 1, LONG_FORM_PAGE_SIZE);
}

async function loadOwnedMediaDetailOrNotFound(
  slug: string,
  youtubeVideoId: string,
): Promise<VideoDetailResponse> {
  try {
    const detail = await getOwnedMediaDetail(slug, youtubeVideoId);
    if (!detail) {
      throw new Error(`Media detail missing for ${slug}/${youtubeVideoId}`);
    }
    return detail;
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      notFound();
    }
    throw error;
  }
}

function buildListDescription(response: MediaListResponse): string {
  return response.menu.contentKind === "SHORT"
    ? `${response.menu.name} 쇼츠 콘텐츠를 확인하실 수 있습니다.`
    : `${response.menu.name} 예배 영상을 확인하실 수 있습니다.`;
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

function resolveDetailTitle(detail: VideoDetailResponse): string {
  return detail.displayTitle || detail.title;
}
