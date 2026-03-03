import Link from "next/link";

import { navMenuGroups } from "@/lib/site-data";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-cedar/10 bg-[#ffffff] backdrop-blur-lg">
      <div className="section-shell py-[31px] md:py-[35px]">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6">
          <Link href="/" className="shrink-0">
            <div>
              <p className="hidden text-[10px] uppercase tracking-[0.18em] text-cedar/70 sm:block">The Disciples Church</p>
              <p className="whitespace-nowrap font-serif text-xl font-semibold text-ink md:text-2xl">The 제자교회</p>
            </div>
          </Link>

          <nav className="hidden items-center justify-center gap-6 text-lg font-semibold text-ink/85 lg:flex xl:gap-8">
            {navMenuGroups.map((menu) => (
              <div key={menu.label} className="group/menu relative pb-2 -mb-2">
                <Link
                  href={menu.href}
                  className="inline-flex whitespace-nowrap rounded-full border border-transparent px-6 py-2.5 transition group-focus-within/menu:border-cedar/20 group-focus-within/menu:bg-white group-focus-within/menu:text-clay group-hover/menu:border-cedar/20 group-hover/menu:bg-white group-hover/menu:text-clay"
                >
                  <span>{menu.label}</span>
                </Link>

                <div className="pointer-events-none absolute left-0 top-full z-50 w-64 translate-y-1 opacity-0 transition duration-150 group-focus-within/menu:pointer-events-auto group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100 group-hover/menu:pointer-events-auto group-hover/menu:translate-y-0 group-hover/menu:opacity-100">
                  <div className="relative overflow-hidden rounded-2xl border border-cedar/15 bg-white p-3 shadow-[0_18px_40px_rgba(16,33,63,0.14)]">
                    <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cedar/60">
                      {menu.label}
                    </p>
                    {menu.items.map((item) => (
                      <Link
                        key={`${menu.label}-${item.href}`}
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-cedar/5 hover:text-clay"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          <details className="group relative shrink-0">
            <summary className="inline-flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-cedar/20 text-xl leading-none text-cedar transition hover:border-cedar/40 hover:text-clay">
              ☰
            </summary>
            <div className="surface-card-strong absolute right-0 top-[calc(100%+0.6rem)] z-50 w-[min(19rem,calc(100vw-2rem))] rounded-2xl p-3">
              <nav className="space-y-3">
                {navMenuGroups.map((menu) => (
                  <details key={`mobile-${menu.label}`} className="group/sub rounded-xl border border-cedar/12 bg-white/90 px-2 py-1">
                    <summary className="flex cursor-pointer list-none items-center rounded-lg px-2 py-2 text-sm font-semibold text-ink transition hover:bg-cedar/5 hover:text-clay">
                      <span>{menu.label}</span>
                    </summary>
                    <div className="grid gap-1 pb-2 pl-2">
                      <Link
                        href={menu.href}
                        className="block rounded-lg px-2 py-1.5 text-xs font-semibold text-cedar transition hover:bg-cedar/5 hover:text-clay"
                      >
                        {menu.label} 메인
                      </Link>
                      {menu.items.map((item) => (
                        <Link
                          key={`mobile-${menu.label}-${item.href}`}
                          href={item.href}
                          className="block rounded-lg px-2 py-1.5 text-xs font-medium text-ink/75 transition hover:bg-cedar/5 hover:text-clay"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ))}
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
