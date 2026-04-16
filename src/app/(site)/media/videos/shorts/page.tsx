import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicMediaVideoListView from "@/components/public-media-video-list-view";
import { createPageMetadata } from "@/lib/seo";
import { getPublicMediaVideoList } from "@/lib/media-videos-api";

export const metadata: Metadata = createPageMetadata({
  title: "숏폼 영상",
  description: "The 제자교회의 짧은 숏폼 영상을 확인하실 수 있습니다.",
  path: "/media/videos/shorts",
});

export default async function MediaVideoShortsPage() {
  const videos = await getPublicMediaVideoList("SHORTFORM");

  if (!videos) {
    notFound();
  }

  return <PublicMediaVideoListView videos={videos} />;
}
