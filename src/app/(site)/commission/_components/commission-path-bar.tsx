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
    <div className="w-full flex flex-col bg-[#f8fafd]">
      <nav className="section-shell py-3 border-b border-cedar/8" aria-label="Breadcrumb">
        <ol className="type-body-small flex items-center justify-center gap-1.5">
          <li>
            <Link
              href="/"
              className="font-medium text-ink/40 transition hover:text-themeBlue"
            >
              홈
            </Link>
          </li>

          <li className="text-ink/25" aria-hidden="true">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </li>
          <li>
            <span className="font-medium text-ink/40">지상명령</span>
          </li>

          <li className="text-ink/25" aria-hidden="true">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </li>
          <li>
            <span className="font-semibold text-ink/80">{currentLabel}</span>
          </li>
        </ol>
      </nav>
    </div>
  );
}
