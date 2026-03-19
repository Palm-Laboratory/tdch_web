"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navMenuGroups } from "@/lib/site-data";

interface SideNavProps {
  groupLabel: string;
}

export default function SideNav({ groupLabel }: SideNavProps) {
  const pathname = usePathname();

  const menuGroup = navMenuGroups.find((g) => g.label === groupLabel);
  const items = menuGroup?.items || [];

  return (
    <aside>
      {/* 데스크탑: 좌측 고정 패널 — 본문과 분리된 배경 */}
      <div className="hidden lg:block absolute left-0 top-0 w-60 xl:w-64 border-r border-cedar/8 bg-[#f5f7fb] min-h-full">
        <nav className="sticky top-28 p-6 pt-10" aria-label="사이드 메뉴">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cedar/50">
            {groupLabel}
          </p>
          <ul className="space-y-1">
            {items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-themeBlue text-white shadow-md shadow-themeBlue/15 font-semibold"
                        : "text-ink/60 hover:bg-themeBlue/5 hover:text-themeBlue"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* 모바일/태블릿: 가로 스크롤 탭 */}
      <nav className="lg:hidden overflow-x-auto no-scrollbar border-b border-cedar/8 bg-white px-4 md:px-6 py-3" aria-label="사이드 메뉴">
        <ul className="flex min-w-max items-center gap-2 py-1">
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`block whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-themeBlue text-white shadow-md shadow-themeBlue/20"
                      : "text-ink/55 bg-white border border-cedar/10 hover:bg-themeBlue/5 hover:text-themeBlue"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
