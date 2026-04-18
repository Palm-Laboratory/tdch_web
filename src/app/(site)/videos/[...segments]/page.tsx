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
  searchParams: Promise<{ page?: string | string[] }>;
}

const LONGFORM_PAGE_SIZE = 6;
const SHORTFORM_PAGE_SIZE = 8;

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
  searchParams,
}: VideoSegmentsPageProps): Promise<Metadata> {
  const { segments } = await params;
  const { page } = await searchParams;
  const playlistPath = toPlaylistPath(segments);
  const playlist = await getPublicPlaylistDetailByPath(playlistPath);
  const pageValue = Array.isArray(page) ? page[0] : page;
  const pageNumber = Number.parseInt(pageValue ?? "1", 10);
  const normalizedPage = Number.isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;

  if (playlist) {
    return createPageMetadata({
      title: playlist.title,
      description: playlist.description || `${playlist.title} 재생목록입니다.`,
      path:
        playlist.contentForm === "SHORTFORM" || normalizedPage <= 1
          ? playlist.fullPath
          : `${playlist.fullPath}?page=${normalizedPage}`,
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
  searchParams,
}: VideoSegmentsPageProps) {
  const { segments } = await params;
  const { page } = await searchParams;
  const playlistPath = toPlaylistPath(segments);
  const playlist = await getPublicPlaylistDetailByPath(playlistPath);
  const pageValue = Array.isArray(page) ? page[0] : page;
  const pageNumber = Number.parseInt(pageValue ?? "1", 10);
  const normalizedPage = Number.isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;

  if (playlist) {
    const requestedPageSize = playlist.contentForm === "SHORTFORM" ? SHORTFORM_PAGE_SIZE : LONGFORM_PAGE_SIZE;
    const initialVideos = await getPublicPlaylistVideoListByPath(playlistPath, normalizedPage, requestedPageSize);

    if (!initialVideos) {
      notFound();
    }

    const videos =
      initialVideos.form === "SHORTFORM" && requestedPageSize !== SHORTFORM_PAGE_SIZE
        ? await getPublicPlaylistVideoListByPath(playlistPath, normalizedPage, SHORTFORM_PAGE_SIZE)
        : initialVideos;

    if (!videos) {
      notFound();
    }

    if (playlist.fullPath !== playlistPath) {
      redirect(playlist.fullPath);
    }

    if (videos.form === "SHORTFORM") {
      if (normalizedPage !== 1) {
        redirect(playlist.fullPath);
      }

      return <PublicVideoPlaylistView playlist={playlist} videos={videos} />;
    }

    if (videos.currentPage !== normalizedPage) {
      const target = videos.currentPage > 1 ? `${playlist.fullPath}?page=${videos.currentPage}` : playlist.fullPath;
      redirect(target);
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
