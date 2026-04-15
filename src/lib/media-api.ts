import "server-only";
import type { SermonCardData } from "@/lib/site-data";
import { SERVER_MEDIA_API_BASE_URL } from "@/lib/server-config";

export type SermonSiteKey = string;

export interface MediaItemDto {
  menuSiteKey: string | null;
  menuSlug: string | null;
  youtubeVideoId: string;
  title: string;
  displayTitle: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  embedUrl: string;
  publishedAt: string;
  displayDate: string;
  contentKind: "LONG_FORM" | "SHORT";
  preacher: string | null;
  scripture: string | null;
  serviceType: string | null;
  featured: boolean;
}

export interface MediaListResponse {
  menu: {
    siteKey: string;
    name: string;
    slug: string;
    contentKind: "LONG_FORM" | "SHORT";
  };
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  items: MediaItemDto[];
}

export interface HomeMediaResponse {
  featuredSermons: MediaItemDto[];
  latestSermons: MediaItemDto[];
}

export interface VideoDetailResponse {
  youtubeVideoId: string;
  title: string;
  displayTitle: string;
  description: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  embedUrl: string;
  contentKind: "LONG_FORM" | "SHORT";
  publishedAt: string;
  preacher: string | null;
  scripture: string | null;
  scriptureBody: string | null;
  serviceType: string | null;
  summary: string | null;
  tags: string[];
}

export class MediaNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaNotFoundError";
  }
}

async function fetchMedia<T>(path: string): Promise<T> {
  return requestMedia(path, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });
}

async function fetchRevalidatedMedia<T>(path: string, revalidateSeconds: number): Promise<T> {
  return requestMedia(path, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: revalidateSeconds,
    },
  });
}

async function requestMedia<T>(path: string, init: RequestInit & { next?: { revalidate: number } }): Promise<T> {
  const response = await fetch(`${SERVER_MEDIA_API_BASE_URL}${path}`, {
    ...init,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new MediaNotFoundError(`Media API resource not found: ${path}`);
    }
    throw new Error(`Media API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getHomeMedia(): Promise<HomeMediaResponse | null> {
  try {
    return await fetchRevalidatedMedia<HomeMediaResponse>("/api/v1/media/home", 300);
  } catch (error) {
    console.error("Failed to fetch home media.", error);
    return null;
  }
}

export async function getMediaList(
  slug: SermonSiteKey,
  page = 0,
  size = 24,
): Promise<MediaListResponse | null> {
  try {
    return await getMediaListStrict(slug, page, size);
  } catch (error) {
    console.error(`Failed to fetch media list for ${slug}.`, error);
    return null;
  }
}

export async function getMediaListStrict(
  slug: SermonSiteKey,
  page = 0,
  size = 24,
): Promise<MediaListResponse> {
  return fetchMedia<MediaListResponse>(buildMediaListPath(slug, page, size));
}

export async function getMediaDetail(youtubeVideoId: string): Promise<VideoDetailResponse | null> {
  try {
    return await fetchMedia<VideoDetailResponse>(`/api/v1/media/videos/${youtubeVideoId}`);
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      throw error;
    }
    console.error(`Failed to fetch media detail for ${youtubeVideoId}.`, error);
    return null;
  }
}

export async function getOwnedMediaDetail(
  slug: SermonSiteKey,
  youtubeVideoId: string,
): Promise<VideoDetailResponse | null> {
  try {
    return await fetchMedia<VideoDetailResponse>(`/api/v1/media/menus/${slug}/videos/${youtubeVideoId}`);
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      throw error;
    }
    console.error(`Failed to fetch owned media detail for ${slug}/${youtubeVideoId}.`, error);
    return null;
  }
}

export function toHomeSermonCards(
  items: MediaItemDto[] | undefined,
  fallbackCards: SermonCardData[],
  resolveDetailHref?: (item: MediaItemDto) => string | undefined,
): SermonCardData[] {
  if (!items?.length) {
    return fallbackCards;
  }

  return items.slice(0, 2).map((item) => ({
    href: resolveDetailHref?.(item) ?? item.youtubeUrl,
    thumbnail: item.thumbnailUrl,
    thumbnailAlt: item.displayTitle,
    category: item.contentKind === "SHORT" ? "쇼츠" : "말씀",
    type: item.serviceType ?? (item.contentKind === "SHORT" ? "짧은 영상" : "예배 영상"),
    title: item.displayTitle,
    scripture: item.scripture ?? "본문 준비 중",
    pastor: item.preacher ?? "The 제자교회",
    date: item.displayDate.replaceAll("-", "."),
  }));
}

export function buildMediaMeta(item: MediaItemDto): string {
  const segments = [item.scripture, item.preacher, item.serviceType].filter(Boolean);
  if (segments.length > 0) {
    return segments.join(" | ");
  }

  return item.contentKind === "SHORT" ? "짧은 영상 콘텐츠" : "예배 영상";
}

export function formatDisplayDate(dateText: string): string {
  return dateText.replaceAll("-", ".");
}

function buildMediaListPath(slug: SermonSiteKey, page: number, size: number): string {
  return `/api/v1/media/menus/${slug}/videos?page=${page}&size=${size}`;
}
