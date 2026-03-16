"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navMenuGroups } from "@/lib/site-data";

// Breadscrumb(브레드크럼)
// 현재 위치의 계층 표시
export default function Breadcrumb() {
  const pathname = usePathname();

  // 현재 경로에 맞는 메뉴 그룹 찾기
  const menuGroup = navMenuGroups.find(
    (g) => pathname === g.href || pathname.startsWith(`${g.href}/`)
  );

  // 현재 경로에 맞는 하위 아이템 찾기
  const currentItem = menuGroup?.items.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <div className="w-full border-b border-cedar/8 bg-[#f8fafd]">
      <nav className="section-shell py-3" aria-label="Breadcrumb">
        <ol className="flex items-center justify-center gap-1.5 text-sm">
          {/* 홈 */}
          <li>
            <Link
              href="/"
              className="font-medium text-ink/40 transition hover:text-themeBlue"
            >
              홈
            </Link>
          </li>

          {/* 구분자 + 메뉴 그룹 */}
          {menuGroup && (
            <>
              <li className="text-ink/25" aria-hidden="true">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>
              <li>
                <Link
                  href={menuGroup.href}
                  className={`font-medium transition hover:text-themeBlue ${
                    currentItem ? "text-ink/40" : "text-ink/80"
                  }`}
                >
                  {menuGroup.label}
                </Link>
              </li>
            </>
          )}

          {/* 구분자 + 현재 아이템 */}
          {currentItem && (
            <>
              <li className="text-ink/25" aria-hidden="true">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>
              <li>
                <span className="font-semibold text-ink/80">
                  {currentItem.label}
                </span>
              </li>
            </>
          )}
        </ol>
      </nav>
    </div>
  );
}
