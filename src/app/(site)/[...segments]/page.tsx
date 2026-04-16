import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import MenuStaticPageRenderer from "@/components/menu-static-page-renderer";
import PublicVideoPlaylistView from "@/components/public-video-playlist-view";
import { resolvePublicMenuPath } from "@/lib/public-menu-api";
import { getPublicVideoDetailByPath } from "@/lib/videos-api";

interface DynamicRoutePageProps {
  params: Promise<{
    segments: string[];
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: DynamicRoutePageProps): Promise<Metadata> {
  const { segments } = await params;
  const path = `/${segments.join("/")}`;
  const resolved = await resolvePublicMenuPath(path);

  if (!resolved || resolved.redirectTo) {
    return {
      title: "페이지를 찾을 수 없습니다",
      description: "요청하신 페이지를 찾을 수 없습니다.",
    };
  }

  return {
    title: resolved.label,
    description: `${resolved.label} 페이지입니다.`,
  };
}

export default async function DynamicRoutePage({
  params,
}: DynamicRoutePageProps) {
  const { segments } = await params;
  const path = `/${segments.join("/")}`;
  const resolved = await resolvePublicMenuPath(path);

  if (!resolved) {
    notFound();
  }

  if (resolved.redirectTo && resolved.redirectTo !== path) {
    redirect(resolved.redirectTo);
  }

  switch (resolved.type) {
    case "STATIC":
      if (!resolved.staticPageKey) {
        notFound();
      }
      return <MenuStaticPageRenderer staticPageKey={resolved.staticPageKey} />;
    case "YOUTUBE_PLAYLIST": {
      const video = await getPublicVideoDetailByPath(path);
      if (!video) {
        notFound();
      }
      return <PublicVideoPlaylistView video={video} />;
    }
    case "BOARD":
      notFound();
    default:
      notFound();
  }
}
