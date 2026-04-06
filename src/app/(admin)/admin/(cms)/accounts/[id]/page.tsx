import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { getAdminAccount } from "@/lib/admin-accounts-api";
import { AdminApiError } from "@/lib/admin-api";
import AdminAccountForm from "../_components/admin-account-form";
import {
  createAdminAccountAction,
  updateAdminAccountAction,
  deleteAdminAccountAction,
} from "../actions";

interface AdminAccountDetailPageProps {
  params: Promise<{ id: string }>;
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "슈퍼 관리자",
  ADMIN: "관리자",
};

export default async function AdminAccountDetailPage({ params }: AdminAccountDetailPageProps) {
  const session = await getAdminSession();
  if (!isAdminSession(session)) redirect("/admin/login?callbackUrl=/admin/accounts");
  if (session.user.accountRole !== "SUPER_ADMIN") redirect("/admin");

  const { id: rawId } = await params;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isFinite(id) || id <= 0) notFound();

  let account;
  try {
    account = await getAdminAccount(session.user.id ?? "", id);
  } catch (err) {
    if (err instanceof AdminApiError && err.status === 404) notFound();
    throw err;
  }

  const boundUpdateAction = updateAdminAccountAction.bind(null, id);
  const boundDeleteAction = deleteAdminAccountAction.bind(null, id);

  const updatedAt = new Date(account.updatedAt).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  const lastLogin = account.lastLoginAt
    ? new Date(account.lastLoginAt).toLocaleDateString("ko-KR", {
        year: "numeric", month: "2-digit", day: "2-digit",
      })
    : null;

  // 본인 계정 여부 (삭제 버튼 숨기기용으로 활용 가능)
  const isSelf = String(account.id) === (session.user.id ?? "");

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
        <span className="font-medium text-[#132033]">{account.displayName}</span>
      </nav>

      {/* ── 페이지 헤더 ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* 아바타 */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3f74c7]/15 text-[15px] font-bold text-[#3f74c7]">
            {account.displayName.slice(0, 1)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0f1c2e]">{account.displayName}</h1>
            <p className="mt-0.5 font-mono text-[12px] text-[#8fa3bb]">{account.username}</p>
          </div>
          {/* 권한 뱃지 */}
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${account.role === "SUPER_ADMIN" ? "bg-[#dbeafe] text-[#1d4ed8]" : "bg-[#ecfdf5] text-[#047857]"}`}>
            {ROLE_LABEL[account.role] ?? account.role}
          </span>
          {/* 상태 뱃지 */}
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${account.active ? "bg-emerald-50 text-emerald-600" : "bg-[#f1f5f9] text-[#5d6f86]"}`}>
            {account.active ? "활성" : "비활성"}
          </span>
          {/* 본인 계정 표시 */}
          {isSelf && (
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
              내 계정
            </span>
          )}
        </div>

        {/* 수정일 / 마지막 로그인 */}
        <div className="shrink-0 rounded-xl border border-[#e9edf3] bg-[#f8fafc] px-3 py-2 text-right">
          <p className="text-[10px] text-[#8fa3bb]">마지막 수정</p>
          <p className="mt-0.5 text-[12px] font-medium text-[#374151]">{updatedAt}</p>
          {lastLogin && (
            <>
              <p className="mt-2 text-[10px] text-[#8fa3bb]">마지막 로그인</p>
              <p className="mt-0.5 text-[12px] font-medium text-[#374151]">{lastLogin}</p>
            </>
          )}
        </div>
      </div>

      {/* ── 폼 ── */}
      <AdminAccountForm
        mode="edit"
        item={account}
        createAction={createAdminAccountAction}
        updateAction={boundUpdateAction}
        deleteAction={isSelf ? undefined : boundDeleteAction}
      />

      {/* 본인 계정 삭제 불가 안내 */}
      {isSelf && (
        <p className="text-center text-[12px] text-[#8fa3bb]">
          현재 로그인 중인 본인 계정은 삭제할 수 없습니다.
        </p>
      )}
    </div>
  );
}
