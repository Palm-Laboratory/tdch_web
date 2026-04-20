import { redirect } from "next/navigation";

import { getAdminSession, isAdminSession } from "@/auth";
import { getAdminBoards } from "@/lib/admin-board-api";
import BoardManagementClient from "./_components/board-management-client";

export default async function AdminBoardsPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    redirect("/admin/login");
  }

  const boards = await getAdminBoards(session.user.id);

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <span className="text-[#4a6484]">운영</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-medium text-[#132033]">게시판 관리</span>
      </nav>

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#0f1c2e]">게시판 관리</h1>
        <p className="text-[13px] text-[#5d6f86]">
          공지와 소식 게시글을 작성하고 본문 이미지와 유튜브 임베드를 관리합니다.
        </p>
      </div>

      <BoardManagementClient initialBoards={boards} />
    </div>
  );
}
