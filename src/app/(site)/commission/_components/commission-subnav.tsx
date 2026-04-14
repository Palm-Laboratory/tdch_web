"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const commissionItems = [
  { href: "/commission/summary", label: "개요" },
  { href: "/commission/nextgen", label: "다음세대" },
  { href: "/commission/culture", label: "다문화" },
  { href: "/commission/ethnic", label: "다민족" },
] as const;

export default function CommissionSubnav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="border-b border-[#ece7df] bg-white" aria-label="지상명령 서브 메뉴">
      <div className="section-shell section-shell--narrow overflow-x-auto no-scrollbar">
        <ul className="flex min-w-max items-center justify-center gap-2 px-4">
          {commissionItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block whitespace-nowrap border-b-2 px-3 py-3 text-[14px] tracking-[0.04em] transition md:px-4 md:text-[15px] ${
                    isActive
                      ? "border-[#1a2744] font-bold text-[#1a2744]"
                      : "border-transparent font-medium text-[#1a2744]/55 hover:border-[#c9a84c]/40 hover:text-[#1a2744]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
