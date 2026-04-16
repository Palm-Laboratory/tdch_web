import { notFound, redirect } from "next/navigation";
import PublicVideoPlaylistView from "@/components/public-video-playlist-view";
import { getPublicVideoDetail } from "@/lib/videos-api";

export default async function VideoPlaylistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = await getPublicVideoDetail(slug);

  if (!video) {
    notFound();
  }

  if (video.fullPath !== `/videos/${video.slug}`) {
    redirect(video.fullPath);
  }

  return <PublicVideoPlaylistView video={video} />;
}
