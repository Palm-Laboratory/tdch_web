import "server-only";

import { getOrSetPublicRequestCache } from "@/lib/public-request-cache";
import { type ServerFetchInit, serverFetchJsonOrNull } from "@/lib/server-fetch";

const MENU_REVALIDATE_OPTIONS: NonNullable<ServerFetchInit["next"]> = {
  revalidate: 300,
  tags: ["menu"],
};

const VIDEO_REVALIDATE_OPTIONS: NonNullable<ServerFetchInit["next"]> = {
  revalidate: 300,
  tags: ["menu", "videos"],
};

export interface PublicVideoSibling {
  label: string;
  href: string;
}

export interface PublicPlaylistDetail {
  title: string;
  sourceTitle: string;
  playlistId: string;
  slug: string;
  fullPath: string;
  description: string | null;
  thumbnailUrl: string | null;
  itemCount: number;
  contentForm: VideoContentForm;
  groupLabel: string | null;
  siblings: PublicVideoSibling[];
}

export type VideoContentForm = "LONGFORM" | "SHORTFORM";

export interface PublicVideoSummary {
  videoId: string;
  title: string;
  preacherName: string | null;
  publishedAt: string | null;
  thumbnailUrl: string | null;
  scriptureReference: string | null;
  summary: string | null;
  contentForm: VideoContentForm;
  href: string;
}

export interface PublicVideoList {
  form: VideoContentForm;
  featured: PublicVideoSummary | null;
  items: PublicVideoSummary[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PublicVideoPlaylistLink {
  label: string;
  href: string;
}

export interface PublicShortformPlaylistWindow {
  items: PublicVideoSummary[];
  currentIndexInWindow: number;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PublicVideoDetail {
  videoId: string;
  title: string;
  sourceTitle: string;
  preacherName: string | null;
  publishedAt: string | null;
  thumbnailUrl: string | null;
  scriptureReference: string | null;
  scriptureBody: string | null;
  messageBody: string | null;
  summary: string | null;
  description: string | null;
  contentForm: VideoContentForm;
  playlists: PublicVideoPlaylistLink[];
  related: PublicVideoSummary[];
  shortformPlaylist: PublicShortformPlaylistWindow | null;
}

function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function fetchVideoResourceOrNull<T>(
  path: string,
  next: NonNullable<ServerFetchInit["next"]>,
): Promise<T | null> {
  return serverFetchJsonOrNull<T>(path, { next });
}

function buildPlaylistSlugPath(slug: string): string {
  return encodeURIComponent(normalizeSlug(slug));
}

export async function getPublicPlaylistDetail(slug: string): Promise<PublicPlaylistDetail | null> {
  return fetchVideoResourceOrNull<PublicPlaylistDetail>(
    `/api/v1/public/videos/${buildPlaylistSlugPath(slug)}`,
    MENU_REVALIDATE_OPTIONS,
  );
}

export async function getPublicPlaylistDetailByPath(path: string): Promise<PublicPlaylistDetail | null> {
  return getOrSetPublicRequestCache(`playlist-detail-by-path:${path}`, () =>
    fetchVideoResourceOrNull<PublicPlaylistDetail>(
      `/api/v1/public/videos?path=${encodeURIComponent(path)}`,
      MENU_REVALIDATE_OPTIONS,
    ),
  );
}

export async function getPublicPlaylistVideoList(
  slug: string,
  page = 1,
  size = 6,
): Promise<PublicVideoList | null> {
  return fetchVideoResourceOrNull<PublicVideoList>(
    `/api/v1/public/videos/${buildPlaylistSlugPath(slug)}/items?page=${page}&size=${size}`,
    VIDEO_REVALIDATE_OPTIONS,
  );
}

export async function getPublicPlaylistVideoListByPath(
  path: string,
  page = 1,
  size = 6,
): Promise<PublicVideoList | null> {
  return getOrSetPublicRequestCache(`playlist-video-list-by-path:${path}:${page}:${size}`, () =>
    fetchVideoResourceOrNull<PublicVideoList>(
      `/api/v1/public/videos/items?path=${encodeURIComponent(path)}&page=${page}&size=${size}`,
      VIDEO_REVALIDATE_OPTIONS,
    ),
  );
}

export async function getPublicPlaylistVideoDetail(
  slug: string,
  videoId: string,
): Promise<PublicVideoDetail | null> {
  return fetchVideoResourceOrNull<PublicVideoDetail>(
    `/api/v1/public/videos/${buildPlaylistSlugPath(slug)}/${encodeURIComponent(videoId)}`,
    VIDEO_REVALIDATE_OPTIONS,
  );
}

export async function getPublicPlaylistVideoDetailByPath(
  path: string,
  videoId: string,
): Promise<PublicVideoDetail | null> {
  return getOrSetPublicRequestCache(`playlist-video-detail-by-path:${path}:${videoId}`, () =>
    fetchVideoResourceOrNull<PublicVideoDetail>(
      `/api/v1/public/videos/detail?path=${encodeURIComponent(path)}&videoId=${encodeURIComponent(videoId)}`,
      VIDEO_REVALIDATE_OPTIONS,
    ),
  );
}
