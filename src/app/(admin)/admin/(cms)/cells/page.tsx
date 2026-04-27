import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import AdminBreadcrumb from "../components/admin-breadcrumb";

export default async function AdminCellsPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/cells");
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: "교회 관리" }, { label: "구역/쉘 관리" }]} />
      <div>
        <h1 className="text-xl font-bold text-[#0f1c2e]">구역/쉘 관리</h1>
        <p className="mt-1 text-[12px] text-[#6d7f95]">
          교회별 공동체 구조가 아직 확정되지 않아, 이 화면은 기준 관리 모듈 placeholder로 먼저 열어둔 상태입니다.
        </p>
      </div>

      <section className="rounded-3xl border border-[#dbe4f0] bg-white p-6 shadow-sm">
        <div className="rounded-2xl border border-dashed border-[#d5deea] bg-[#fafcff] p-6">
          <p className="text-[13px] font-semibold text-[#132033]">다음 구현 예정</p>
          <ul className="mt-3 space-y-2 text-[12px] text-[#5d6f86]">
            <li>구역/쉘 체계 정의 및 정렬</li>
            <li>활성/비활성 상태 관리</li>
            <li>교적부 선택 필드와 참조 연동</li>
            <li>교회별 명칭 커스터마이징</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
