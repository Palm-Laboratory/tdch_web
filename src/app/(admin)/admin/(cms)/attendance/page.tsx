import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import AdminBreadcrumb from "../components/admin-breadcrumb";
import AttendanceGridClient from "./_components/attendance-grid-client";

export default async function AdminAttendancePage() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/attendance");
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: "교회 관리" }, { label: "출석 관리" }]} />
      <div>
        <h1 className="text-xl font-bold text-[#0f1c2e]">출석 관리</h1>
        <p className="mt-1 text-[12px] text-[#6d7f95]">
          주간 그리드 입력, 세대 단위 확인, 엑셀 업로드 연결 지점을 위한 초기 화면입니다.
        </p>
      </div>
      <AttendanceGridClient />
    </div>
  );
}
