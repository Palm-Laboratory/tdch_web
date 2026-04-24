import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { getAdminMenuTree } from "@/lib/admin-menu-api";
import AdminBreadcrumb from "../../components/admin-breadcrumb";
import VideoSyncClient from "../_components/video-sync-client";

export default async function AdminVideoSyncPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/videos/sync");
  }

  const menuTree = await getAdminMenuTree(session.user.id ?? "");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: "운영" }, { label: "영상" }, { label: "영상 싱크" }]} />

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#0f1c2e]">영상 싱크</h1>
        <p className="text-[13px] text-[#5d6f86]">유튜브 재생목록 동기화 상태를 확인하고 수동 동기화를 실행합니다.</p>
      </div>

      <VideoSyncClient initialMenuItems={menuTree.items} />
    </div>
  );
}
