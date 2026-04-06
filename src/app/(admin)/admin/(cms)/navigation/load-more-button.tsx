"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface LoadMoreButtonProps {
  /** 현재까지 보여주고 있는 아이템 수 */
  currentLimit: number;
  /** 전체 아이템 수 */
  totalCount: number;
  /** 한 번에 추가로 불러올 수 */
  pageSize: number;
}

export default function LoadMoreButton({
  currentLimit,
  totalCount,
  pageSize,
}: LoadMoreButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const remaining = totalCount - currentLimit;
  const nextLimit = currentLimit + pageSize;

  function handleLoadMore() {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("limit", String(nextLimit));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <button
        type="button"
        onClick={handleLoadMore}
        className="inline-flex items-center gap-2 rounded-xl border border-[#d1dbe6] bg-white px-6 py-2.5 text-[13px] font-semibold text-[#31445f] shadow-sm transition hover:border-[#bfd0ea] hover:bg-[#f5f9ff] hover:text-[#2d5da8]"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        더 보기
        <span className="rounded-full bg-[#edf4ff] px-2 py-0.5 text-[11px] font-bold text-[#3f74c7]">
          +{Math.min(remaining, pageSize)}
        </span>
      </button>
      <p className="text-[11px] text-[#a0b0c3]">
        {currentLimit} / {totalCount}건 표시 중
      </p>
    </div>
  );
}
