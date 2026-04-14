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
    <nav className="w-full border-b border-cedar/8 bg-white overflow-x-auto no-scrollbar" aria-label="LNB">
      <ul className="section-shell flex items-center justify-start md:justify-center gap-1 min-w-max px-4">
          {commissionItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`type-body-small block whitespace-nowrap border-b-[2.5px] px-3 py-3.5 font-medium transition-colors md:px-4 ${
                    isActive
                      ? "border-themeBlue text-themeBlue font-bold"
                      : "border-transparent text-ink/65 hover:text-themeBlue hover:border-themeBlue/30"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
