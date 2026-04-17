import "server-only";

import { SERVER_MEDIA_API_BASE_URL } from "@/lib/server-config";

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
}

export interface PublicVideoPlaylistLink {
  label: string;
  href: string;
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
}

function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function getPublicPlaylistDetail(slug: string): Promise<PublicPlaylistDetail | null> {
  try {
    const normalizedSlug = normalizeSlug(slug);
    const response = await fetch(
      `${SERVER_MEDIA_API_BASE_URL}/api/v1/public/videos/${encodeURIComponent(normalizedSlug)}`,
      {
        next: {
          revalidate: 300,
          tags: ["menu"],
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<PublicPlaylistDetail>;
  } catch {
    return null;
  }
}

export async function getPublicPlaylistDetailByPath(path: string): Promise<PublicPlaylistDetail | null> {
  try {
    const response = await fetch(
      `${SERVER_MEDIA_API_BASE_URL}/api/v1/public/videos?path=${encodeURIComponent(path)}`,
      {
        next: {
          revalidate: 300,
          tags: ["menu"],
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<PublicPlaylistDetail>;
  } catch {
    return null;
  }
}

export async function getPublicPlaylistVideoList(slug: string): Promise<PublicVideoList | null> {
  try {
    const normalizedSlug = normalizeSlug(slug);
    const response = await fetch(
      `${SERVER_MEDIA_API_BASE_URL}/api/v1/public/videos/${encodeURIComponent(normalizedSlug)}/items`,
      {
        next: {
          revalidate: 300,
          tags: ["menu", "videos"],
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<PublicVideoList>;
  } catch {
    return null;
  }
}

export async function getPublicPlaylistVideoListByPath(path: string): Promise<PublicVideoList | null> {
  try {
    const response = await fetch(
      `${SERVER_MEDIA_API_BASE_URL}/api/v1/public/videos/items?path=${encodeURIComponent(path)}`,
      {
        next: {
          revalidate: 300,
          tags: ["menu", "videos"],
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<PublicVideoList>;
  } catch {
    return null;
  }
}

export async function getPublicPlaylistVideoDetail(
  slug: string,
  videoId: string,
): Promise<PublicVideoDetail | null> {
  try {
    const normalizedSlug = normalizeSlug(slug);
    const response = await fetch(
      `${SERVER_MEDIA_API_BASE_URL}/api/v1/public/videos/${encodeURIComponent(normalizedSlug)}/${encodeURIComponent(videoId)}`,
      {
        next: {
          revalidate: 300,
          tags: ["menu", "videos"],
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<PublicVideoDetail>;
  } catch {
    return null;
  }
}

export async function getPublicPlaylistVideoDetailByPath(
  path: string,
  videoId: string,
): Promise<PublicVideoDetail | null> {
  try {
    const response = await fetch(
      `${SERVER_MEDIA_API_BASE_URL}/api/v1/public/videos/detail?path=${encodeURIComponent(path)}&videoId=${encodeURIComponent(videoId)}`,
      {
        next: {
          revalidate: 300,
          tags: ["menu", "videos"],
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<PublicVideoDetail>;
  } catch {
    return null;
  }
}

export async function getLegacyVideoHref(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${SERVER_MEDIA_API_BASE_URL}/api/v1/public/videos/by-id/${encodeURIComponent(videoId)}`,
      {
        next: {
          revalidate: 300,
          tags: ["menu", "videos"],
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { href?: string | null };
    return payload.href ?? null;
  } catch {
    return null;
  }
}
