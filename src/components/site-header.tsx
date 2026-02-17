"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/lib/site-data";

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-cedar/10 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:gap-4 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="h-7 w-7 rounded-full bg-gradient-to-br from-gold to-clay md:h-8 md:w-8" />
            <div>
              <p className="hidden text-xs uppercase tracking-[0.2em] text-cedar/70 sm:block">The Disciple Church</p>
              <p className="font-serif text-base font-semibold text-ink md:text-lg">더 제자교회</p>
            </div>
          </Link>

          <Link
            href="/newcomer"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-clay px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-clay transition hover:bg-clay hover:text-ivory md:px-4 md:tracking-[0.12em]"
          >
            <span className="sm:hidden">처음방문</span>
            <span className="hidden sm:inline">처음 오셨나요</span>
          </Link>
        </div>

        <nav className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto whitespace-nowrap px-1 pb-1 text-sm font-medium text-ink/80 md:gap-5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "text-clay" : "transition hover:text-clay"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
