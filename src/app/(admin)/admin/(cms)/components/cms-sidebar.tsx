"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_GROUPS = [
  {
    label: null,
    items: [
      {
        href: "/admin",
        label: "대시보드",
        exact: true,
        icon: (
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="1" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="10" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "콘텐츠",
    items: [
      {
        href: "/admin/media/messages",
        label: "설교 영상",
        exact: false,
        badge: "messages",
        icon: (
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <rect x="1" y="3" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6.5 6.2l4 2.3-4 2.3V6.2z" fill="currentColor"/>
          </svg>
        ),
      },
      {
        href: "/admin/media/its-okay",
        label: "그래도 괜찮아",
        exact: false,
        badge: "its-okay",
        icon: (
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <path d="M8.5 2C5.46 2 3 4.46 3 7.5c0 1.74.82 3.29 2.1 4.28L4.5 15l3.2-1.6a5.49 5.49 0 0 0 .8.06c3.04 0 5.5-2.46 5.5-5.5C14 4.46 11.54 2 8.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        href: "/admin/media/better-devotion",
        label: "더 좋은 묵상",
        exact: false,
        badge: "better-devotion",
        icon: (
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <path d="M3 4h11M3 8h8M3 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "운영",
    items: [
      {
        href: "/admin/navigation",
        label: "내비게이션",
        exact: false,
        icon: (
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <path d="M2 4h13M2 8.5h9M2 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },
];

interface CmsSidebarProps {
  canManageAccounts: boolean;
}

export default function CmsSidebar({ canManageAccounts }: CmsSidebarProps) {
  const pathname = usePathname();
  const currentPath = pathname ?? "";
  const navGroups = NAV_GROUPS.map((group) =>
    group.label === "운영" && canManageAccounts
      ? {
          ...group,
          items: [
            ...group.items,
            {
              href: "/admin/accounts",
              label: "관리자 계정",
              exact: false,
              icon: (
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
                  <path d="M8.5 9.2a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 14.3c.9-2 3.1-3.3 5.5-3.3s4.6 1.3 5.5 3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
            },
          ],
        }
      : group
  );

  const isActive = (href: string, exact: boolean) =>
    exact ? currentPath === href : currentPath.startsWith(href);

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-white/[0.06] bg-[#080f1a]">
      {/* 로고 */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3f74c7]/20">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1L12.196 4.5V11.5L7 15L1.804 11.5V4.5L7 1Z" stroke="#6ca6f0" strokeWidth="1.3" strokeLinejoin="round"/>
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
                const active = isActive(item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-100 ${
                        active
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
