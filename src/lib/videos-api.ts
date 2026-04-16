import "server-only";

import { SERVER_MEDIA_API_BASE_URL } from "@/lib/server-config";

export interface PublicVideoSibling {
  label: string;
  href: string;
}

export interface PublicVideoDetail {
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

export async function getPublicVideoDetail(slug: string): Promise<PublicVideoDetail | null> {
  try {
    const response = await fetch(`${SERVER_MEDIA_API_BASE_URL}/api/v1/public/videos/${encodeURIComponent(slug)}`, {
      next: {
        revalidate: 300,
        tags: ["menu"],
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<PublicVideoDetail>;
  } catch {
    return null;
  }
}

export async function getPublicVideoDetailByPath(path: string): Promise<PublicVideoDetail | null> {
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

    return response.json() as Promise<PublicVideoDetail>;
  } catch {
    return null;
  }
}
