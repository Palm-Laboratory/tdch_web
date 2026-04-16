import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicMediaVideoListView from "@/components/public-media-video-list-view";
import { createPageMetadata } from "@/lib/seo";
import { getPublicMediaVideoList } from "@/lib/media-videos-api";

export const metadata: Metadata = createPageMetadata({
  title: "영상",
  description: "The 제자교회의 롱폼 영상과 요약 콘텐츠를 확인하실 수 있습니다.",
  path: "/media/videos",
});

export default async function MediaVideosPage() {
  const videos = await getPublicMediaVideoList("LONGFORM");

  if (!videos) {
    notFound();
  }

  return <PublicMediaVideoListView videos={videos} />;
}
