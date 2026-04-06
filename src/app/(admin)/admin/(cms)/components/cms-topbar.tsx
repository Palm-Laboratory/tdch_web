import type { Session } from "next-auth";
import SignOutButton from "../../sign-out-button";

interface CmsTopbarProps {
  session: Session;
}

export default function CmsTopbar({ session }: CmsTopbarProps) {
  const displayName =
    session.user?.name?.trim() ||
    session.user?.username ||
    session.user?.email ||
    "관리자";
  const accountId = session.user?.email || session.user?.username || "";
  const initials = displayName.slice(0, 1).toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0b1520] px-6">
      {/* 왼쪽 - 타이틀 (추후 breadcrumb로 교체) */}
      <div />

      {/* 오른쪽 - 관리자 정보 + 로그아웃 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3f74c7]/25 text-xs font-bold text-[#6ca6f0]">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold leading-none text-white">{displayName}</p>
            <p className="mt-0.5 text-[11px] leading-none text-white/40">
              {accountId}
              {session.user?.accountRole === "SUPER_ADMIN" ? " · 슈퍼 관리자" : " · 관리자"}
            </p>
          </div>
        </div>

        <div className="h-4 w-px bg-white/10" />

        <SignOutButton authProvider={session.user.authProvider} />
      </div>
    </header>
  );
}
