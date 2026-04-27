import { redirect } from "next/navigation";

import { getAdminSession, isAdminSession } from "@/auth";
import { getAdminBoards } from "@/lib/admin-board-api";
import { getAdminMenuItems } from "@/lib/admin-menu-api";
import BoardManagementClient from "./_components/board-management-client";
import AdminBreadcrumb from "../components/admin-breadcrumb";

export default async function AdminBoardsPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    redirect("/admin/login");
  }

  const [boards, menuItems] = await Promise.all([
    getAdminBoards(session.user.id),
    getAdminMenuItems(session.user.id),
  ]);
  const boardMenus = menuItems.filter((item) => item.type === "BOARD" && item.boardKey && !item.isAuto);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: "운영" }, { label: "게시판 관리" }]} />

      <h1 className="text-xl font-bold text-[#0f1c2e]">게시판 관리</h1>

      <BoardManagementClient
        initialBoards={boards}
        initialBoardMenus={boardMenus}
        currentUserId={session.user.id}
        currentUserRole={session.user.accountRole}
      />
    </div>
  );
}
