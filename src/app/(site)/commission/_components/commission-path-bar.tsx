"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labelByPathname: Record<string, string> = {
  "/commission/summary": "개요",
  "/commission/nextgen": "다음세대",
  "/commission/culture": "다문화",
  "/commission/ethnic": "다민족",
};

export default function CommissionPathBar() {
  const pathname = usePathname() ?? "";
  const currentLabel = labelByPathname[pathname] ?? "개요";

  return (
    <nav className="border-b border-[#ece7df] bg-[#fbfaf7]" aria-label="Breadcrumb">
      <div className="section-shell section-shell--narrow px-4 py-3">
        <ol className="flex items-center gap-2 text-[12px] tracking-[0.08em] text-[#1a2744]/52">
          <li>
            <Link href="/" className="transition hover:text-[#1a2744]">
              홈
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span>지상명령</span>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-[#1a2744]">{currentLabel}</li>
        </ol>
      </div>
    </nav>
  );
}
