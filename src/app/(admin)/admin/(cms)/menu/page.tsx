import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { getAdminMenuTree } from "@/lib/admin-menu-api";
import MenuManagementClient from "./_components/menu-management-client";
import AdminBreadcrumb from "../components/admin-breadcrumb";

export default async function AdminMenuPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/menu");
  }

  const actorId = session.user.id ?? "";
  const menuTree = await getAdminMenuTree(actorId);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: "운영" }, { label: "메뉴 관리" }]} />

      <div>
        <h1 className="text-xl font-bold text-[#0f1c2e]">메뉴 관리</h1>
      </div>

      <MenuManagementClient
        initialItems={menuTree.items}
      />
    </div>
  );
}
