import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PublicMediaVideoDetailView from "@/components/public-media-video-detail-view";
import { createVideoMetadata } from "@/lib/seo";
import { getPublicMediaVideoDetail } from "@/lib/media-videos-api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ videoId: string }>;
}): Promise<Metadata> {
  const { videoId } = await params;
  const video = await getPublicMediaVideoDetail(videoId);

  if (!video) {
    return {};
  }

  return createVideoMetadata({
    title: video.title,
    description: video.summary || video.description || "The 제자교회 영상입니다.",
    path: `/media/videos/${video.videoId}`,
    publishedTime: video.publishedAt ?? undefined,
  });
}

export default async function MediaVideoDetailPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  const video = await getPublicMediaVideoDetail(videoId);

  if (!video) {
    notFound();
  }

  if (video.contentForm === "SHORTFORM") {
    redirect(`/media/videos/shorts/${video.videoId}`);
  }

  return <PublicMediaVideoDetailView video={video} />;
}
