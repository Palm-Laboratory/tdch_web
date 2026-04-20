"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_GROUPS = [
  {
    label: "운영",
    items: [
      {
        href: "/admin/menu",
        label: "메뉴 관리",
        exact: false,
        icon: (
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <path d="M3 4.25h11M3 8.5h11M3 12.75h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        href: "/admin/videos",
        label: "영상 관리",
        exact: false,
        icon: (
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <path d="M4 3.75h9a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 6.25h5M6 8.5h5M6 10.75h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        href: "/admin/boards",
        label: "게시판 관리",
        exact: false,
        icon: (
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <path d="M4 3.75h9a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5.75 6.25h5.5M5.75 8.5h5.5M5.75 10.75h3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        href: "/admin/accounts",
        label: "관리자 계정",
        exact: false,
        icon: (
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <path d="M8.5 9.2a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 14.3c.9-2 3.1-3.3 5.5-3.3s4.6 1.3 5.5 3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
];

interface CmsSidebarProps {
  canManageAccounts: boolean;
  operatorEntries?: Array<{
    href: string;
    label: string;
    exact?: boolean;
    icon?: ReactNode;
  }>;
}

export default function CmsSidebar({ canManageAccounts, operatorEntries = [] }: CmsSidebarProps) {
  const pathname = usePathname();
  const currentPath = pathname ?? "";
  const navGroups = NAV_GROUPS.map((group) =>
    group.label === "운영" && canManageAccounts
      ? {
        ...group,
        items: [
          ...operatorEntries,
          ...group.items,
        ],
      }
      : group
  );

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return currentPath === href;
    }

    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-white/[0.06] bg-[#080f1a]">
      {/* 로고 */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3f74c7]/20">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1L12.196 4.5V11.5L7 15L1.804 11.5V4.5L7 1Z" stroke="#6ca6f0" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-bold leading-none tracking-wide text-white">TDCH</p>
          <p className="mt-0.5 text-[10px] leading-none text-white/35">Admin CMS</p>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label ?? "__root"} className="mb-5">
            {group.label && (
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact ?? false);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-100 ${active
                        ? "bg-[#3f74c7]/15 text-[#6ca6f0]"
                        : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
                        }`}
                    >
                      <span className={active ? "text-[#6ca6f0]" : "text-white/35"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* 하단 */}
      <div className="shrink-0 border-t border-white/[0.06] px-4 py-4">
        <p className="text-[10px] text-white/20">The 제자교회 © 2025</p>
      </div>
    </aside>
  );
}
