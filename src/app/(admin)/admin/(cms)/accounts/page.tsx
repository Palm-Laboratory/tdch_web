import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { getAdminAccounts, type AdminAccount, type AdminAccountRole } from "@/lib/admin-accounts-api";

// ── 역할 뱃지 ─────────────────────────────────────────────────────────────────
const ROLE_META: Record<AdminAccountRole, { label: string; cls: string }> = {
  SUPER_ADMIN: { label: "슈퍼 관리자", cls: "bg-[#dbeafe] text-[#1d4ed8]" },
  ADMIN:       { label: "관리자",     cls: "bg-[#ecfdf5] text-[#047857]" },
};

function RoleBadge({ role }: { role: AdminAccountRole }) {
  const meta = ROLE_META[role] ?? { label: role, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

// ── 계정 행 ───────────────────────────────────────────────────────────────────
function AccountRow({ account, rowNum }: { account: AdminAccount; rowNum: number }) {
  const isActive = account.active;
  const lastLogin = account.lastLoginAt
    ? new Date(account.lastLoginAt).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    : "—";
  const createdAt = new Date(account.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });

  return (
    <tr className="border-b border-[#f0f4f8] transition hover:bg-[#fafcff]">
      <td className="px-5 py-4 align-middle text-[13px] text-[#5d6f86]">{rowNum}</td>
      <td className="px-5 py-4 align-middle">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${isActive ? "bg-emerald-50 text-emerald-600" : "bg-[#f1f5f9] text-[#8fa3bb]"}`}>
          {isActive ? "활성" : "비활성"}
        </span>
      </td>
      <td className="px-5 py-4 align-middle">
        <p className="text-[13px] font-semibold text-[#0f1c2e]">{account.displayName}</p>
        <p className="mt-0.5 font-mono text-[11px] text-[#8fa3bb]">{account.username}</p>
      </td>
      <td className="px-5 py-4 align-middle">
        <RoleBadge role={account.role} />
      </td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{lastLogin}</td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{createdAt}</td>
      <td className="px-5 py-4 align-middle">
        <Link
          href={`/admin/accounts/${account.id}`}
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#bfd0ea] bg-[#edf4ff] px-3 text-[12px] font-medium text-[#2d5da8] transition hover:bg-[#e4efff]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M1 6C2.5 3 4.5 1.5 6 1.5S9.5 3 11 6c-1.5 3-3.5 4.5-5 4.5S2.5 9 1 6z" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          상세보기
        </Link>
      </td>
    </tr>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────
export default async function AdminAccountsPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/accounts");
  }
  if (session.user.accountRole !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const { accounts } = await getAdminAccounts(session.user.id ?? "");

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
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[#4a6484]">운영</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-medium text-[#132033]">관리자 계정</span>
      </nav>

      {/* ── 페이지 헤더 ── */}
      <h1 className="text-xl font-bold text-[#0f1c2e]">관리자 계정</h1>

      {/* ── 결과 수 ── */}
      <p className="text-[13px] text-[#5d6f86]">
        전체 <span className="font-semibold text-[#132033]">{accounts.length}</span>건
      </p>

      {/* ── 테이블 ── */}
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {["번호", "상태", "이름 / 아이디", "권한", "마지막 로그인", "등록일", "상세보기"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-[13px] font-semibold text-[#132033]">등록된 관리자 계정이 없습니다.</p>
                    <p className="mt-1 text-[12px] text-[#8fa3bb]">하단 버튼에서 첫 번째 계정을 등록할 수 있습니다.</p>
                  </td>
                </tr>
              ) : (
                accounts.map((account, idx) => (
                  <AccountRow key={account.id} account={account} rowNum={idx + 1} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 계정 추가 버튼 ── */}
      <div className="flex justify-end">
        <Link
          href="/admin/accounts/new"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#3f74c7] px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#4a82d7]"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          계정 추가
        </Link>
      </div>
    </div>
  );
}
