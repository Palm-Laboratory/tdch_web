"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MobileNav from "@/components/mobile-nav";

import { navMenuGroups } from "@/lib/site-data";

export default function SiteHeader() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const nextCondensed = currentScrollY > 24;

      setIsCondensed((prev) => (prev === nextCondensed ? prev : nextCondensed));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-cedar/10 bg-[#ffffff] backdrop-blur-lg animate-header-item transition-[box-shadow,background-color] duration-300 ${
        isCondensed ? "shadow-[0_10px_30px_rgba(16,33,63,0.08)]" : ""
      }`}
    >
      <div
        className={`section-shell transition-[padding] duration-300 ${
          isCondensed ? "py-3 md:py-4" : "py-[25px]"
        }`}
      >
        <div className="relative flex items-center justify-between gap-4 md:gap-6">
          {/* 모바일 환경: 좌측 여백(가상 요소)을 주어 로고가 완벽히 중앙에 오도록 맞춤 */}
          <div className="w-11 lg:hidden"></div>

          {/* 로고 (모바일/태블릿에서는 중앙, 데스크탑에서는 좌측) */}
          <Link
            href="/"
            className="lg:shrink-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-[transform,font-size] duration-300 lg:static lg:translate-x-0 lg:translate-y-0"
          >
            <div>
              <p
                className={`hidden font-semibold uppercase tracking-[0.18em] text-themeBlue/70 transition-[font-size,opacity] duration-300 lg:block ${
                  isCondensed ? "text-[9px] opacity-80" : "text-[10px]"
                }`}
              >
                The Disciples Church
              </p>
              <p
                className={`whitespace-nowrap font-serif font-bold text-ink transition-[font-size] duration-300 ${
                  isCondensed ? "text-[18px] md:text-[21px]" : "text-[20px] md:text-[24px]"
                }`}
              >
                The 제자교회
              </p>
            </div>
          </Link>

          {/* 데스크탑 내비게이션 */}
          <nav
            className={`hidden items-center justify-center font-semibold text-ink/85 transition-[gap,font-size] duration-300 lg:mr-auto lg:flex lg:pl-10 ${
              isCondensed ? "gap-5 text-[18px] xl:gap-6" : "gap-6 text-[20px] xl:gap-8"
            }`}
          >
            {navMenuGroups.map((menu) => (
              <div
                key={menu.label}
                className="group/menu relative pb-2 -mb-2"
              >
                <Link
                  href={menu.href}
                  className={`inline-flex whitespace-nowrap rounded-full border border-transparent transition duration-300 group-hover/menu:border-cedar/20 group-hover/menu:bg-white group-hover/menu:text-themeBlue ${
                    isCondensed ? "px-5 py-2" : "px-6 py-2.5"
                  }`}
                >
                  <span>{menu.label}</span>
                </Link>

                <div className="pointer-events-none absolute left-0 top-full z-50 w-64 translate-y-1 opacity-0 transition duration-150 group-hover/menu:pointer-events-auto group-hover/menu:translate-y-0 group-hover/menu:opacity-100">
                  <div className="relative overflow-hidden rounded-2xl border border-cedar/15 bg-white p-3 shadow-[0_18px_40px_rgba(16,33,63,0.14)]">
                    <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cedar/60">
                      {menu.label}
                    </p>
                    {menu.items.map((item) => (
                      <Link
                        key={`${menu.label}-${item.href}`}
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-cedar/5 hover:text-themeBlue"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* 모바일 햄버거 버튼 & 전체 화면 메뉴 */}
          <div className="lg:hidden flex items-center shrink-0">
            <MobileNav isOpen={isMobileNavOpen} setIsOpen={setIsMobileNavOpen} />
          </div>
        </div>
      </div>
    </header>
  );
}
