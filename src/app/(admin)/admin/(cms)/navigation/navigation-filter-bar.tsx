"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type StatusFilter = "all" | "visible" | "hidden";

interface NavigationFilterBarProps {
  currentStatus: StatusFilter;
  currentSearch: string;
}

export default function NavigationFilterBar({
  currentStatus,
  currentSearch,
}: NavigationFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
    { label: "전체", value: "all" },
    { label: "사용 중", value: "visible" },
    { label: "숨김", value: "hidden" },
  ];

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm">
      {/* 상태 필터 */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <span className="w-16 shrink-0 text-[12px] font-semibold text-[#55697f]">검색옵션</span>
        <div className="flex flex-wrap items-center gap-4">
          {STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-1.5 select-none"
            >
              <input
                type="checkbox"
                checked={currentStatus === opt.value}
                onChange={() =>
                  updateParams({ status: opt.value === "all" ? "" : opt.value })
                }
                className="h-4 w-4 rounded border-[#c8d5e3] accent-[#3f74c7] cursor-pointer"
              />
              <span className="text-[13px] text-[#374151]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div className="my-3 border-t border-[#f1f5f9]" />

      {/* 검색 */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-16 shrink-0 text-[12px] font-semibold text-[#55697f]">검색명</span>
        <div className="flex flex-1 items-center gap-2">
          <input
            type="text"
            defaultValue={currentSearch}
            placeholder="메뉴명 또는 연결 주소를 입력하세요."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParams({ search: (e.target as HTMLInputElement).value });
              }
            }}
            className="h-9 flex-1 rounded-lg border border-[#d1dbe6] bg-[#f8fafc] px-3 text-[13px] text-[#132033] placeholder:text-[#a0aec0] focus:border-[#3f74c7] focus:outline-none focus:ring-1 focus:ring-[#3f74c7]/30"
          />
          <button
            type="button"
            onClick={(e) => {
              const input = (e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement)?.value ?? "";
              updateParams({ search: input });
            }}
            className="h-9 rounded-lg bg-[#3f74c7] px-4 text-[13px] font-semibold text-white transition hover:bg-[#4a82d7]"
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
}
