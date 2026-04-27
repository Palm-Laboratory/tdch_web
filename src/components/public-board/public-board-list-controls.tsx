"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type PublicBoardListControlsProps = {
  totalItems: number;
  pageSize: number;
};

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export default function PublicBoardListControls({
  totalItems,
  pageSize,
}: PublicBoardListControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handlePageSizeChange(nextPageSize: number) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (nextPageSize === 20) {
      params.delete("size");
    } else {
      params.set("size", String(nextPageSize));
    }

    params.delete("page");

    const nextQuery = params.toString();
    const basePath = pathname ?? "";
    const nextHref = nextQuery ? `${basePath}?${nextQuery}` : basePath;

    startTransition(() => {
      router.push(nextHref, { scroll: false });
    });
  }

  return (
    <div className="mt-6 flex items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
      <p className="type-body-small text-[#475569]">
        전체 <span className="font-semibold text-[#10213f]">{totalItems.toLocaleString("ko-KR")}</span>건
      </p>
      <label className="type-body-small flex items-center gap-2 text-[#475569]">
        <span className="shrink-0">보기</span>
        <select
          value={String(pageSize)}
          disabled={isPending}
          onChange={(event) => handlePageSizeChange(Number(event.target.value))}
          className="rounded-full border border-[#d7dde6] bg-white px-4 py-2 text-[#10213f] outline-none transition hover:border-[#2a4f8f] focus:border-[#2a4f8f]"
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}개씩
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
