"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navMenuGroups } from "@/lib/site-data";
import { createPortal } from "react-dom";

export default function MobileNav({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // URL 경로가 변경되면(이동하면) 메뉴 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  // 메뉴가 열렸을 때 백그라운드 스크롤 방지
  useEffect(() => {
    const { body, documentElement } = document;
    const prevBodyOverflowY = body.style.overflowY;
    const prevHtmlOverflowY = documentElement.style.overflowY;

    if (isOpen) {
      body.style.overflowY = "hidden";
      documentElement.style.overflowY = "hidden";
    }

    return () => {
      body.style.overflowY = prevBodyOverflowY;
      documentElement.style.overflowY = prevHtmlOverflowY;
    };
  }, [isOpen]);

  return (
    <>
      {/* 햄버거 토글 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-themeBlue/20 text-xl text-themeBlue transition hover:border-themeBlue/40 hover:bg-themeBlue/5"
        aria-label="메뉴 열기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* 전체화면 애니메이션 오버레이: Portal을 통해 최상단 body에 렌더링 (Hydration 에러 방지용 mounted 체크 추가) */}
      {mounted && typeof document !== "undefined" && createPortal(
        <div
          className={`fixed inset-0 z-[99999] bg-white transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible pointer-events-none -translate-y-2"
          }`}
        >
        <div className="flex h-full flex-col pt-4 md:pt-6">
          {/* 헤더 영역 (로고 & 닫기 버튼) */}
          <div className="flex h-[60px] items-center justify-between px-4 md:px-6">
            <Link href="/" onClick={() => setIsOpen(false)} className="shrink-0 pt-1 lg:hidden">
              <div className="text-left">
                <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-themeBlue/70 md:block">The Disciples Church</p>
                <p className="whitespace-nowrap font-serif text-[24px] font-bold text-ink hover:text-themeBlue transition">The 제자교회</p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-cedar/5 text-ink/70 transition hover:bg-cedar/10 hover:text-ink"
              aria-label="메뉴 닫기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 스크롤 가능한 메뉴 영역 */}
          <nav className="flex-1 overflow-y-auto px-6 pb-20 pt-10">
            <ul className="space-y-10 md:space-y-0 md:grid md:grid-cols-5 md:gap-x-4 lg:gap-x-8">
              {navMenuGroups.filter((menu) => !menu.hiddenInHeader).map((menu) => (
                <li key={menu.label} className="flex flex-col">
                  {/* 대분류 이름 (태블릿에서는 폰트 크기 조절 및 밑줄) */}
                  <div className="mb-5 md:mb-6 md:border-b md:border-cedar/10 md:pb-4">
                    <Link
                      href={menu.href}
                      className="text-3xl md:text-xl md:font-bold font-black tracking-tight text-ink/90 transition hover:text-themeBlue"
                    >
                      {menu.label}
                    </Link>
                  </div>
                  
                  {/* 소분류 링크들 (태블릿에서는 좌측 테두리 제거) */}
                  <ul className="grid gap-y-4 pl-4 border-l-2 border-cedar/10 md:pl-0 md:border-none">
                    {menu.items.map((item) => (
                      <li key={`${menu.label}-${item.href}`}>
                        <Link
                          href={item.href}
                          className="block text-xl font-semibold text-ink/65 transition hover:text-themeBlue hover:translate-x-1 duration-200"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>

          {/* 하단 푸터 영역 (선택사항) */}
          <div className="px-6 py-6 text-center text-xs font-medium text-ink/40">
            <p>The Disciples Church</p>
          </div>
        </div>
      </div>, document.body)}
    </>
  );
}
