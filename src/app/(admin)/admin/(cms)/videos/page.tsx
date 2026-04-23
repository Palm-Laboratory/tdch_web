import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { getAdminVideos, type AdminVideoSummary } from "@/lib/admin-videos-api";
import {
  getAdminMenuTree,
  getAdminYouTubePlaylists,
  type AdminMenuTreeNode,
  type AdminYouTubePlaylist,
} from "@/lib/admin-menu-api";
import VideoListClient from "./_components/video-list-client";
import AdminBreadcrumb from "../components/admin-breadcrumb";

async function resolveInitialState(actorId: string): Promise<{
  playlists: AdminYouTubePlaylist[];
  menuItems: AdminMenuTreeNode[];
  initialPlaylistMenuId: number | null;
  initialItems: AdminVideoSummary[];
}> {
  const [{ playlists }, menuTree] = await Promise.all([
    getAdminYouTubePlaylists(actorId),
    getAdminMenuTree(actorId),
  ]);
  const firstPlaylist = playlists[0] ?? null;

  if (!firstPlaylist) {
    return { playlists, menuItems: menuTree.items, initialPlaylistMenuId: null, initialItems: [] };
  }

  const { items } = await getAdminVideos({ menuId: firstPlaylist.menuId });

  return { playlists, menuItems: menuTree.items, initialPlaylistMenuId: firstPlaylist.menuId, initialItems: items };
}

export default async function AdminVideosPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/videos");
  }

  const { playlists, menuItems, initialPlaylistMenuId, initialItems } =
    await resolveInitialState(session.user.id ?? "");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: "운영" }, { label: "영상 관리" }]} />

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#0f1c2e]">영상 관리</h1>
        <p className="text-[13px] text-[#5d6f86]">재생목록별로 영상 메타를 관리하고 숨김 여부를 설정합니다.</p>
      </div>

      <VideoListClient
        playlists={playlists}
        initialMenuItems={menuItems}
        initialPlaylistMenuId={initialPlaylistMenuId}
        initialItems={initialItems}
      />
    </div>
  );
}
