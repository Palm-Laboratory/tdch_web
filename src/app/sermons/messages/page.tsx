"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { sermonList } from "@/lib/site-data";

type ViewMode = "thumbnail" | "list";
type PageSize = 10 | 20 | 50;

export default function MessagesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("thumbnail");
  const [pageSize, setPageSize] = useState<PageSize>(20);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const youtubeUrl =
    process.env.NEXT_PUBLIC_YOUTUBE_URL ??
    "https://www.youtube.com/@%EB%8D%94%EC%A0%9C%EC%9E%90%EA%B5%90%ED%9A%8C";

  const visibleSermons = useMemo(
    () => sermonList.slice(0, pageSize),
    [pageSize]
  );

  const pageSizeOptions: PageSize[] = [10, 20, 50];

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl md:text-4xl">
          말씀 / 설교 영상
        </h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-cedar/60">
          Sermon Videos
        </p>
      </div>

      {/* 툴바: 뷰 전환 + 개수 선택 */}
      <div className="flex items-center justify-between gap-4">
        {/* 뷰 전환 버튼 */}
        <div className="flex overflow-hidden rounded-xl border border-cedar/12 bg-white shadow-sm">
          <button
            onClick={() => setViewMode("thumbnail")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              viewMode === "thumbnail"
                ? "bg-themeBlue text-white shadow-md"
                : "text-ink/60 hover:bg-themeBlue/5 hover:text-themeBlue"
            }`}
            aria-label="썸네일 보기"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="hidden sm:inline">썸네일</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              viewMode === "list"
                ? "bg-themeBlue text-white shadow-md"
                : "text-ink/60 hover:bg-themeBlue/5 hover:text-themeBlue"
            }`}
            aria-label="리스트 보기"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">리스트</span>
          </button>
        </div>

        {/* 개수 선택 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-cedar/12 bg-white px-4 py-2.5 text-sm font-semibold text-ink/70 shadow-sm transition hover:border-cedar/25 hover:text-ink"
          >
            {pageSize}개씩 보기
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {dropdownOpen && (
            <>
              {/* 외부 클릭 감지용 오버레이 */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <ul className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-xl border border-cedar/12 bg-white py-1 shadow-lg">
                {pageSizeOptions.map((size) => (
                  <li key={size}>
                    <button
                      onClick={() => {
                        setPageSize(size);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition ${
                        pageSize === size
                          ? "bg-themeBlue/8 text-themeBlue font-semibold"
                          : "text-ink/65 hover:bg-themeBlue/5 hover:text-themeBlue"
                      }`}
                    >
                      {size}개씩 보기
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* 컨텐츠: 썸네일 뷰 */}
      {viewMode === "thumbnail" && (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleSermons.map((sermon, i) => {
            const href = sermon.href || youtubeUrl;
            return (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-cedar/10 bg-white shadow-[0_8px_24px_rgba(16,33,63,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(16,33,63,0.14)]"
              >
                {/* 썸네일 */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={sermon.thumbnail}
                    alt={sermon.thumbnailAlt}
                    fill
                    className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {/* 플레이 버튼 */}
                  <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition group-hover:scale-110">
                    <svg className="ml-0.5 h-4 w-4 text-ink" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* 텍스트 영역 */}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cedar">
                    <span>{sermon.category}</span>
                    <span className="text-cedar/30">|</span>
                    <span>{sermon.type}</span>
                  </div>
                  <h3 className="mt-1.5 text-base font-bold leading-snug text-ink line-clamp-2">
                    {sermon.title}
                  </h3>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-ink/50">
                    <p className="line-clamp-1">
                      {sermon.scripture} <span className="mx-1 text-ink/25">|</span> {sermon.pastor}
                    </p>
                    <p className="shrink-0 font-medium">{sermon.date}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </section>
      )}

      {/* 컨텐츠: 리스트 뷰 */}
      {viewMode === "list" && (
        <div className="overflow-x-auto rounded-2xl border border-cedar/10 bg-white shadow-[0_8px_24px_rgba(16,33,63,0.08)]">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-cedar/10 bg-[#f8fafd]">
                <th className="px-5 py-3.5 text-left font-semibold text-ink/70">날짜</th>
                <th className="px-5 py-3.5 text-left font-semibold text-ink/70">제목</th>
                <th className="hidden px-5 py-3.5 text-left font-semibold text-ink/70 md:table-cell">성경 구절</th>
                <th className="hidden px-5 py-3.5 text-left font-semibold text-ink/70 sm:table-cell">설교자</th>
                <th className="px-5 py-3.5 text-left font-semibold text-ink/70">분류</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cedar/6">
              {visibleSermons.map((sermon, i) => {
                const href = sermon.href || youtubeUrl;
                return (
                  <tr
                    key={i}
                    className="group cursor-pointer transition duration-200 hover:bg-themeBlue/3"
                    onClick={() => window.open(href, "_blank")}
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-ink/50">{sermon.date}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-ink transition group-hover:text-themeBlue">
                        {sermon.title}
                      </span>
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-4 text-ink/55 md:table-cell">
                      {sermon.scripture}
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-4 text-ink/55 sm:table-cell">
                      {sermon.pastor}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="inline-block rounded-full bg-themeBlue/8 px-3 py-1 text-xs font-semibold text-themeBlue">
                        {sermon.type}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 표시 개수 안내 */}
      <p className="text-center text-xs text-ink/40">
        전체 {sermonList.length}건 중 {visibleSermons.length}건 표시
      </p>
    </div>
  );
}
