import "server-only";

import { SERVER_MEDIA_API_BASE_URL } from "@/lib/server-config";

export type VideoContentForm = "LONGFORM" | "SHORTFORM";

export interface PublicMediaVideoSummary {
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

export interface PublicMediaVideoList {
  form: VideoContentForm;
  featured: PublicMediaVideoSummary | null;
  items: PublicMediaVideoSummary[];
}

export interface PublicMediaVideoPlaylistLink {
  label: string;
  href: string;
}

export interface PublicMediaVideoDetail {
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
  playlists: PublicMediaVideoPlaylistLink[];
  related: PublicMediaVideoSummary[];
}

export async function getPublicMediaVideoList(form: VideoContentForm): Promise<PublicMediaVideoList | null> {
  try {
    const response = await fetch(
      `${SERVER_MEDIA_API_BASE_URL}/api/v1/public/media/videos?form=${encodeURIComponent(form)}`,
      {
        next: {
          revalidate: 300,
          tags: ["media-videos"],
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<PublicMediaVideoList>;
  } catch {
    return null;
  }
}

export async function getPublicMediaVideoDetail(videoId: string): Promise<PublicMediaVideoDetail | null> {
  try {
    const response = await fetch(
      `${SERVER_MEDIA_API_BASE_URL}/api/v1/public/media/videos/${encodeURIComponent(videoId)}`,
      {
        next: {
          revalidate: 300,
          tags: ["media-videos"],
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<PublicMediaVideoDetail>;
  } catch {
    return null;
  }
}
