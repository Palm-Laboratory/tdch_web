import "server-only";

import { PUBLIC_VIDEO_REVALIDATE_OPTIONS } from "@/lib/public-cache-policy";
import { getOrSetPublicRequestCache } from "@/lib/public-request-cache";
import { type ServerFetchInit, serverFetchJsonOrNull } from "@/lib/server-fetch";

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

function fetchVideoResourceOrNull<T>(
  path: string,
  next: NonNullable<ServerFetchInit["next"]>,
): Promise<T | null> {
  return serverFetchJsonOrNull<T>(path, { next });
}

export async function getPublicPlaylistDetailByPath(path: string): Promise<PublicPlaylistDetail | null> {
  return getOrSetPublicRequestCache(`playlist-detail-by-path:${path}`, () =>
    fetchVideoResourceOrNull<PublicPlaylistDetail>(
      `/api/v1/public/videos?path=${encodeURIComponent(path)}`,
      PUBLIC_VIDEO_REVALIDATE_OPTIONS,
    ),
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
      PUBLIC_VIDEO_REVALIDATE_OPTIONS,
    ),
  );
}

export async function getPublicPlaylistVideoDetailByPath(
  path: string,
  videoId: string,
): Promise<PublicVideoDetail | null> {
  return getOrSetPublicRequestCache(`playlist-video-detail-by-path:${path}:${videoId}`, () =>
    fetchVideoResourceOrNull<PublicVideoDetail>(
      `/api/v1/public/videos/detail?path=${encodeURIComponent(path)}&videoId=${encodeURIComponent(videoId)}`,
      PUBLIC_VIDEO_REVALIDATE_OPTIONS,
    ),
  );
}
