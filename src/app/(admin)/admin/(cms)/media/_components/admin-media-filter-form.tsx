"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type StatusFilter = "all" | "draft" | "published" | "inactive";
type SyncFilter = "all" | "enabled" | "disabled";

interface AdminMediaFilterFormProps {
  currentStatus: StatusFilter;
  currentSync: SyncFilter;
  currentSearch: string;
  currentPath: string;
}

function mergeQueryParams(
  searchParams: URLSearchParams,
  updates: Record<string, string>,
): URLSearchParams {
  const next = new URLSearchParams(searchParams.toString());

  for (const [key, value] of Object.entries(updates)) {
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
  }

  return next;
}

function getTargetPath(currentPath: string, pathname: string | null): string {
  return currentPath || pathname || "/admin/media";
}

export default function AdminMediaFilterForm({
  currentStatus,
  currentSync,
  currentSearch,
  currentPath,
}: AdminMediaFilterFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const submitQueryUpdates = useCallback(
    (updates: Record<string, string>) => {
      const next = mergeQueryParams(new URLSearchParams(searchParams?.toString() ?? ""), updates);
      next.delete("page");
      router.push(`${getTargetPath(currentPath, pathname)}?${next.toString()}`);
    },
    [currentPath, pathname, router, searchParams],
  );

  return (
    <form
      className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        submitQueryUpdates({
          status: String(formData.get("status") ?? ""),
          sync: String(formData.get("sync") ?? ""),
          search: String(formData.get("search") ?? ""),
        });
      }}
    >
      <div className="grid gap-4 lg:grid-cols-[180px_180px_1fr_auto] lg:items-end">
        <label className="space-y-1.5">
          <span className="text-[12px] font-semibold text-[#55697f]">상태</span>
          <select
            name="status"
            defaultValue={currentStatus}
            className="h-10 w-full rounded-lg border border-[#d1dbe6] bg-[#f8fafc] px-3 text-[13px] text-[#132033] focus:border-[#3f74c7] focus:outline-none focus:ring-1 focus:ring-[#3f74c7]/30"
          >
            <option value="all">전체</option>
            <option value="draft">초안</option>
            <option value="published">게시</option>
            <option value="inactive">비활성</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-[12px] font-semibold text-[#55697f]">Sync</span>
          <select
            name="sync"
            defaultValue={currentSync}
            className="h-10 w-full rounded-lg border border-[#d1dbe6] bg-[#f8fafc] px-3 text-[13px] text-[#132033] focus:border-[#3f74c7] focus:outline-none focus:ring-1 focus:ring-[#3f74c7]/30"
          >
            <option value="all">전체</option>
            <option value="enabled">사용</option>
            <option value="disabled">중지</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-[12px] font-semibold text-[#55697f]">검색</span>
          <input
            name="search"
            type="text"
            defaultValue={currentSearch}
            placeholder="메뉴명, slug, playlist ID"
            className="h-10 w-full rounded-lg border border-[#d1dbe6] bg-[#f8fafc] px-3 text-[13px] text-[#132033] placeholder:text-[#a0aec0] focus:border-[#3f74c7] focus:outline-none focus:ring-1 focus:ring-[#3f74c7]/30"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="h-10 rounded-lg bg-[#3f74c7] px-4 text-[13px] font-semibold text-white transition hover:bg-[#4a82d7]"
          >
            적용
          </button>
          <button
            type="button"
            onClick={() => router.push(currentPath || pathname || "/admin/media")}
            className="h-10 rounded-lg border border-[#d1dbe6] bg-white px-4 text-[13px] font-semibold text-[#45576e] transition hover:bg-[#f8fafc]"
          >
            초기화
          </button>
        </div>
      </div>
    </form>
  );
}
