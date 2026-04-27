import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import AdminBreadcrumb from "../components/admin-breadcrumb";
import MemberRegistryClient from "./_components/member-registry-client";

export default async function AdminMembersPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/members");
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: "교회 관리" }, { label: "교적부 관리" }]} />
      <div>
        <h1 className="text-xl font-bold text-[#0f1c2e]">교적부 관리</h1>
        <p className="mt-1 text-[12px] text-[#6d7f95]">
          교인 목록, 상태 제안, 가족관계, 봉사, 이력을 한 화면에서 관리합니다.
        </p>
      </div>
      <MemberRegistryClient />
    </div>
  );
}
