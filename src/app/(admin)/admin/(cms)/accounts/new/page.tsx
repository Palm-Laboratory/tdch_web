import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import AdminAccountForm from "../_components/admin-account-form";
import { createAdminAccountAction } from "../actions";

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default async function NewAdminAccountPage() {
  const session = await getAdminSession();
  if (!isAdminSession(session)) redirect("/admin/login?callbackUrl=/admin/accounts/new");
  if (session.user.accountRole !== "SUPER_ADMIN") redirect("/admin");

  return (
    <div className="space-y-5">
      {/* ── 경로(breadcrumb) ── */}
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <Link href="/admin" className="flex items-center transition hover:text-[#3f74c7]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mr-1">
            <path d="M1.5 7.5L7 2l5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6.5V12h3V9h2v3h3V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          홈
        </Link>
        <Chevron />
        <span className="text-[#4a6484]">운영</span>
        <Chevron />
        <Link href="/admin/accounts" className="text-[#4a6484] transition hover:text-[#3f74c7]">
          관리자 계정
        </Link>
        <Chevron />
        <span className="font-medium text-[#132033]">신규 등록</span>
      </nav>

      {/* ── 페이지 헤더 ── */}
      <h1 className="text-xl font-bold text-[#0f1c2e]">관리자 계정 신규 등록</h1>

      {/* ── 폼 ── */}
      <AdminAccountForm mode="new" createAction={createAdminAccountAction} />
    </div>
  );
}
