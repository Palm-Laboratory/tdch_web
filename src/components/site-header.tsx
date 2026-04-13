"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "@/components/mobile-nav";
import { useNavigation } from "@/lib/navigation-context";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function SiteHeader() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const [isHiddenOnMobile, setIsHiddenOnMobile] = useState(false);
  const [resolvedPathname, setResolvedPathname] = useState<string | null>(null);
  const { navMenuGroups } = useNavigation();
  const pathname = usePathname();
  const currentPathname = resolvedPathname ?? pathname ?? "";
  const hasResolvedPathname = resolvedPathname !== null || Boolean(pathname);
  const hideOnMobile = /^\/sermons\/its-okay\/[^/]+$/.test(currentPathname);
  const isHomePage = currentPathname === "/";
  const shouldRenderHeader = hasResolvedPathname && !isHomePage;
  const previousScrollYRef = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    // Production hard refreshes can briefly lag `usePathname()`.
    // Sync with the browser pathname before paint to avoid the wrong header style flashing.
    const browserPathname = window.location.pathname;
    setResolvedPathname(pathname ?? browserPathname);
  }, [pathname]);

  useEffect(() => {
    if (!shouldRenderHeader) {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = previousScrollYRef.current;
      const scrollDelta = currentScrollY - previousScrollY;
      const isMobileViewport = window.innerWidth < 1024;

      if (isMobileViewport) {
        setIsCondensed(false);
      } else {
        setIsCondensed((prev) => {
          if (currentScrollY <= 0) {
            return false;
          }

          if (currentScrollY > 24) {
            return true;
          }

          return prev;
        });
      }

      if (!isMobileViewport || isMobileNavOpen || currentScrollY <= 8) {
        setIsHiddenOnMobile(false);
      } else if (scrollDelta > 8) {
        setIsHiddenOnMobile(true);
      } else if (scrollDelta < -8) {
        setIsHiddenOnMobile(false);
      }

      previousScrollYRef.current = currentScrollY;
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsHiddenOnMobile(false);
        setIsCondensed(window.scrollY > 24);
      } else {
        setIsCondensed(false);
      }
    };

    previousScrollYRef.current = window.scrollY;
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileNavOpen, shouldRenderHeader]);

  useEffect(() => {
    if (!shouldRenderHeader) {
      document.documentElement.style.removeProperty("--site-header-height");
      return;
    }

    const headerElement = headerRef.current;

    if (!headerElement) {
      return;
    }

    const updateHeaderHeight = () => {
      const root = document.documentElement;
      const styles = window.getComputedStyle(headerElement);
      const isHidden = styles.display === "none";
      const isDesktopViewport = window.innerWidth >= 1024;
      const headerHeight = isHidden || isDesktopViewport
        ? 0
        : headerElement.getBoundingClientRect().height;

      root.style.setProperty("--site-header-height", `${headerHeight}px`);
    };

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    resizeObserver.observe(headerElement);

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
      document.documentElement.style.removeProperty("--site-header-height");
    };
  }, [hideOnMobile, shouldRenderHeader]);

  useEffect(() => {
    if (!shouldRenderHeader) {
      return;
    }

    // 상세 쇼츠 페이지에서 돌아온 직후에도 헤더가 화면 밖에 남지 않도록
    // 경로가 바뀌면 모바일 숨김 상태를 즉시 초기화한다.
    previousScrollYRef.current = window.scrollY;
    setIsHiddenOnMobile(false);

    if (window.scrollY <= 0) {
      setIsCondensed(false);
      return;
    }

    setIsCondensed(window.innerWidth >= 1024 && window.scrollY > 24);
  }, [currentPathname, shouldRenderHeader]);

  if (!shouldRenderHeader) {
    return null;
  }

  return (
    <header
      ref={headerRef}
      className={`${hideOnMobile ? "hidden md:block" : ""} fixed inset-x-0 top-0 z-50 transition-[transform,box-shadow,background-color] duration-300 lg:sticky
        border-b border-cedar/10 bg-[#ffffff] backdrop-blur-lg
        ${isHiddenOnMobile ? "-translate-y-full pointer-events-none lg:translate-y-0 lg:pointer-events-auto" : "translate-y-0"}
        ${isCondensed ? "shadow-[0_10px_30px_rgba(16,33,63,0.08)]" : ""}
      `}
    >
      <div
        className={`section-shell animate-header-item transition-[padding] duration-300 ${isCondensed ? "py-3 md:py-4" : "py-[25px]"
          }`}
      >
        <div className="relative flex items-center justify-between gap-4 md:gap-6">
          {/* 모바일/태블릿 로고 또는 텍스트 (홈페이지 여부에 따라 다르게 표시) */}

          {/* 로고 (모바일/태블릿에서는 좌측, 데스크탑에서는 좌측) */}
          <Link
            href="/"
            className="transition-[transform,font-size] duration-300 lg:static lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:translate-y-0"
          >
            <div className="lg:hidden">
              <div className="flex flex-col">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-themeBlue/70">
                  The Disciples Church
                </p>
                <p className="font-serif font-bold text-[20px] text-ink leading-tight">
                  The 제자교회
                </p>
              </div>
            </div>
            <div className="hidden lg:block">
              <p
                className={`hidden font-semibold uppercase tracking-[0.18em] text-themeBlue/70 transition-[font-size,opacity] duration-300 lg:block ${isCondensed ? "text-[9px] opacity-80" : "text-[10px]"
                  }`}
              >
                The Disciples Church
              </p>
              <p
                className={`truncate font-serif font-bold text-ink transition-[font-size] duration-300 ${isCondensed ? "text-[18px] md:text-[21px]" : "text-[20px] md:text-[24px]"
                  }`}
              >
                The 제자교회
              </p>
            </div>
          </Link>

          {/* 데스크탑 내비게이션 */}
          <nav
            className={`hidden items-center justify-center font-semibold text-ink/85 transition-[gap,font-size] duration-300 lg:mr-auto lg:flex lg:pl-10 ${isCondensed ? "gap-5 text-[18px] xl:gap-6" : "gap-6 text-[20px] xl:gap-8"
              }`}
          >
            {navMenuGroups.filter((menu) => !menu.hiddenInHeader).map((menu) => {
              const menuHref = menu.defaultLandingHref ?? menu.href;

              return (
                <div
                  key={menu.key}
                  className="group/menu relative pb-2 -mb-2"
                >
                  <Link
                    href={menuHref}
                    className={`inline-flex whitespace-nowrap rounded-full border border-transparent transition duration-300 group-hover/menu:border-cedar/20 group-hover/menu:bg-white group-hover/menu:text-themeBlue ${isCondensed ? "px-5 py-2" : "px-6 py-2.5"
                      }`}
                  >
                    <span>{menu.label}</span>
                  </Link>

                  <div className="pointer-events-none absolute left-0 top-full z-50 w-64 translate-y-1 opacity-0 transition duration-150 group-hover/menu:pointer-events-auto group-hover/menu:translate-y-0 group-hover/menu:opacity-100">
                    <div className="relative overflow-hidden rounded-2xl border border-cedar/15 bg-white p-3 shadow-[0_18px_40px_rgba(16,33,63,0.14)]">
                      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cedar/60">
                        {menu.label}
                      </p>
                      {menu.items.filter((item) => !item.hiddenInHeader).map((item) => (
                        <Link
                          key={item.key}
                          href={item.href}
                          className="block rounded-xl px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-cedar/5 hover:text-themeBlue"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* 모바일 햄버거 버튼 & 전체 화면 메뉴 */}
          <div className="relative z-10 flex shrink-0 items-center lg:hidden">
            <MobileNav
              isOpen={isMobileNavOpen}
              setIsOpen={setIsMobileNavOpen}
              isTransparent={false}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
