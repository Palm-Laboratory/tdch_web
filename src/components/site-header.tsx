import Link from "next/link";

import { navMenuGroups } from "@/lib/site-data";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-cedar/10 bg-[#ffffff] backdrop-blur-lg">
      <div className="section-shell py-[31px] md:py-[35px]">
        <div className="relative flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <div>
              <p className="hidden text-[10px] uppercase tracking-[0.18em] text-cedar/70 sm:block">The Disciples Church</p>
              <p className="whitespace-nowrap font-serif text-xl font-semibold text-ink md:text-2xl">더 제자교회</p>
            </div>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 text-base font-semibold text-ink/85 lg:flex">
            {navMenuGroups.map((menu) => (
              <div key={menu.label} className="group/menu relative">
                <Link
                  href={menu.href}
                  className="inline-flex whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-cedar/5 hover:text-clay"
                >
                  {menu.label}
                </Link>

                <div className="pointer-events-none absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-focus-within/menu:pointer-events-auto group-focus-within/menu:opacity-100 group-hover/menu:pointer-events-auto group-hover/menu:opacity-100">
                  <div className="surface-card-strong rounded-2xl p-2">
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
              <nav className="space-y-4">
                {navMenuGroups.map((menu) => (
                  <div key={`mobile-${menu.label}`} className="space-y-2">
                    <Link
                      href={menu.href}
                      className="block rounded-xl border border-cedar/10 bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-cedar/20 hover:bg-cedar/5 hover:text-clay"
                    >
                      {menu.label}
                    </Link>
                    <div className="grid gap-2 pl-2">
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
                  </div>
                ))}
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
