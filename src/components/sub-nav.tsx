"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navMenuGroups } from "@/lib/site-data";

interface SubNavProps {
  groupLabel: string; // 예: "교회소개"
}

export default function SubNav({ groupLabel }: SubNavProps) {
  const pathname = usePathname();

  const menuGroup = navMenuGroups.find((g) => g.label === groupLabel);
  const items = menuGroup?.items || [];

  return (
    <div className="sticky top-[86px] z-40 w-full bg-white shadow-sm ring-1 ring-cedar/5">
      <div className="section-shell overflow-x-auto no-scrollbar">
        <ul className="flex min-w-max items-center justify-start gap-1 py-1 sm:justify-center sm:gap-4 md:py-2">
          {items.map((item) => {
            // pathname이 item.href와 정확히 일치하거나, 해당 경로로 시작할 때 활성화 상태로 표시
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`block rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-themeBlue text-white shadow-md shadow-themeBlue/20"
                      : "text-ink/65 hover:bg-themeBlue/5 hover:text-themeBlue"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
