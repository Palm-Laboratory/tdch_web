import "server-only";
import type { SermonCardData } from "@/lib/site-data";

export type SermonSiteKey = "messages" | "better-devotion" | "its-okay";

export interface MediaItemDto {
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
  latestMessages: MediaItemDto[];
  latestDevotions: MediaItemDto[];
  latestShorts: MediaItemDto[];
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
  serviceType: string | null;
  summary: string | null;
  tags: string[];
}

const DEFAULT_MEDIA_API_BASE_URL = "http://localhost:8080";
const mediaApiBaseUrl =
  process.env.MEDIA_API_BASE_URL ??
  process.env.NEXT_PUBLIC_MEDIA_API_BASE_URL ??
  DEFAULT_MEDIA_API_BASE_URL;

export class MediaNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaNotFoundError";
  }
}

async function fetchMedia<T>(path: string): Promise<T> {
  const response = await fetch(`${mediaApiBaseUrl}${path}`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
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
    return await fetchMedia<HomeMediaResponse>("/api/v1/media/home");
  } catch (error) {
    console.error("Failed to fetch home media.", error);
    return null;
  }
}

export async function getMediaList(
  siteKey: SermonSiteKey,
  page = 0,
  size = 24,
): Promise<MediaListResponse | null> {
  try {
    return await fetchMedia<MediaListResponse>(
      `/api/v1/media/menus/${siteKey}/videos?page=${page}&size=${size}`,
    );
  } catch (error) {
    console.error(`Failed to fetch media list for ${siteKey}.`, error);
    return null;
  }
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

export function buildMediaDetailPath(siteKey: SermonSiteKey, youtubeVideoId: string): string {
  return `/sermons/${siteKey}/${youtubeVideoId}`;
}

export function toHomeSermonCards(
  items: MediaItemDto[] | undefined,
  fallbackCards: SermonCardData[],
): SermonCardData[] {
  if (!items?.length) {
    return fallbackCards;
  }

  return items.slice(0, 2).map((item) => ({
    href: buildMediaDetailPath("messages", item.youtubeVideoId),
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
