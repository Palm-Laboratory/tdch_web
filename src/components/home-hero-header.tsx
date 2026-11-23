"use client";

import { useState } from "react";
import Link from "next/link";
import MobileNav from "@/components/mobile-nav";
import { useNavigation } from "@/lib/navigation-context";
import { shouldOpenNavigationInNewTab } from "@/lib/navigation-utils";
import { SITE_ALTERNATE_NAME, SITE_NAME } from "@/lib/site-config";

export default function HomeHeroHeader() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { navMenuGroups } = useNavigation();

  return (
    <div className="flex w-full items-start justify-between gap-4 lg:items-center lg:gap-12">
      <Link
        href="/"
        className="transition-[transform,font-size] duration-300"
      >
        <div className="flex flex-col">
          <p className="font-serif text-[20px] font-bold leading-tight text-white">
            {SITE_NAME}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
            {SITE_ALTERNATE_NAME}
          </p>
        </div>
      </Link>

      <nav className="hidden items-center justify-end gap-7 text-lg font-semibold text-white lg:flex xl:gap-9 xl:text-[1.28rem]">
        {navMenuGroups.filter((menu) => !menu.hiddenInHeader).map((menu) => {
          const menuHref = menu.defaultLandingHref ?? menu.href;
          const openMenuInNewTab = shouldOpenNavigationInNewTab(menuHref, {
            linkType: menu.linkType,
            openInNewTab: menu.openInNewTab,
          });

          return (
            <div
              key={menu.key}
              className="group/menu relative pb-2 -mb-2"
            >
              <Link
                href={menuHref}
                target={openMenuInNewTab ? "_blank" : undefined}
                rel={openMenuInNewTab ? "noopener noreferrer" : undefined}
                className="inline-flex whitespace-nowrap rounded-full border border-transparent px-5 py-2 text-white transition duration-300 group-hover/menu:border-white/25 group-hover/menu:bg-white/10"
              >
                <span>{menu.label}</span>
              </Link>

              <div className="pointer-events-none absolute left-0 top-full z-50 w-64 translate-y-1 opacity-0 transition duration-150 group-hover/menu:pointer-events-auto group-hover/menu:translate-y-0 group-hover/menu:opacity-100">
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white p-3 shadow-[0_18px_40px_rgba(16,33,63,0.28)]">
                  <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cedar/60">
                    {menu.label}
                  </p>
                  {menu.items.filter((item) => !item.hiddenInHeader).map((item) => {
                    const openItemInNewTab = shouldOpenNavigationInNewTab(item.href, {
                      linkType: item.linkType,
                      openInNewTab: item.openInNewTab,
                    });

                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        target={openItemInNewTab ? "_blank" : undefined}
                        rel={openItemInNewTab ? "noopener noreferrer" : undefined}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-cedar/5 hover:text-themeBlue"
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="relative z-10 flex shrink-0 items-center lg:hidden">
        <MobileNav
          isOpen={isMobileNavOpen}
          setIsOpen={setIsMobileNavOpen}
          isTransparent
        />
      </div>
    </div>
  );
}
