import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { getAdminMenuTree } from "@/lib/admin-menu-api";
import MenuManagementClient from "./_components/menu-management-client";

export default async function AdminMenuPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/menu");
  }

  const actorId = session.user.id ?? "";
  const menuTree = await getAdminMenuTree(actorId);

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <span className="text-[#4a6484]">운영</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-medium text-[#132033]">메뉴 관리</span>
      </nav>

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#0f1c2e]">메뉴 관리</h1>
        <p className="text-[13px] text-[#5d6f86]">
          로컬에서 구조를 정리한 뒤 한 번에 저장하는 배치 저장형 편집기입니다.
        </p>
      </div>

      <MenuManagementClient
        initialItems={menuTree.items}
      />
    </div>
  );
}
