import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PublicVideoPlaylistDetailView from "@/components/public-video-playlist-detail-view";
import PublicVideoPlaylistView from "@/components/public-video-playlist-view";
import { createPageMetadata, createVideoMetadata } from "@/lib/seo";
import {
  getPublicPlaylistDetailByPath,
  getPublicPlaylistVideoDetailByPath,
  getPublicPlaylistVideoListByPath,
} from "@/lib/videos-api";

interface VideoSegmentsPageProps {
  params: Promise<{ segments: string[] }>;
}

function toPlaylistPath(segments: string[]): string {
  return `/videos/${segments.join("/")}`;
}

function toDetailTarget(segments: string[]) {
  if (segments.length < 2) {
    return null;
  }

  return {
    videoId: segments.at(-1) ?? "",
    playlistPath: `/videos/${segments.slice(0, -1).join("/")}`,
  };
}

export async function generateMetadata({
  params,
}: VideoSegmentsPageProps): Promise<Metadata> {
  const { segments } = await params;
  const playlistPath = toPlaylistPath(segments);
  const playlist = await getPublicPlaylistDetailByPath(playlistPath);

  if (playlist) {
    return createPageMetadata({
      title: playlist.title,
      description: playlist.description || `${playlist.title} 재생목록입니다.`,
      path: playlist.fullPath,
    });
  }

  const detailTarget = toDetailTarget(segments);
  if (!detailTarget) {
    return {};
  }

  const [detailPlaylist, video] = await Promise.all([
    getPublicPlaylistDetailByPath(detailTarget.playlistPath),
    getPublicPlaylistVideoDetailByPath(detailTarget.playlistPath, detailTarget.videoId),
  ]);

  if (!detailPlaylist || !video) {
    return {};
  }

  return createVideoMetadata({
    title: video.title,
    description: video.summary || video.description || `${detailPlaylist.title} 재생목록 영상입니다.`,
    path: `${detailPlaylist.fullPath}/${video.videoId}`,
    publishedTime: video.publishedAt ?? undefined,
  });
}

export default async function VideoSegmentsPage({
  params,
}: VideoSegmentsPageProps) {
  const { segments } = await params;
  const playlistPath = toPlaylistPath(segments);
  const playlist = await getPublicPlaylistDetailByPath(playlistPath);

  if (playlist) {
    const videos = await getPublicPlaylistVideoListByPath(playlistPath);

    if (!videos) {
      notFound();
    }

    if (playlist.fullPath !== playlistPath) {
      redirect(playlist.fullPath);
    }

    return <PublicVideoPlaylistView playlist={playlist} videos={videos} />;
  }

  const detailTarget = toDetailTarget(segments);
  if (!detailTarget) {
    notFound();
  }

  const [detailPlaylist, video] = await Promise.all([
    getPublicPlaylistDetailByPath(detailTarget.playlistPath),
    getPublicPlaylistVideoDetailByPath(detailTarget.playlistPath, detailTarget.videoId),
  ]);

  if (!detailPlaylist || !video) {
    notFound();
  }

  const canonicalDetailPath = `${detailPlaylist.fullPath}/${video.videoId}`;
  if (canonicalDetailPath !== playlistPath) {
    redirect(canonicalDetailPath);
  }

  return <PublicVideoPlaylistDetailView playlist={detailPlaylist} video={video} />;
}
