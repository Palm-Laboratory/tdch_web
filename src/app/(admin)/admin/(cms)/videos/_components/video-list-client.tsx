"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AdminVideoSummary } from "@/lib/admin-videos-api";
import type { AdminYouTubePlaylist } from "@/lib/admin-menu-api";
import { useAdminToast } from "../../components/admin-toast-provider";

type PageSize = 10 | 20 | 50;
const PAGE_SIZE_OPTIONS: PageSize[] = [10, 20, 50];

// menuId === null(전체)일 때 캐시에서 사용할 sentinel 키. 실제 menuId는 양의 정수이므로 충돌 없음.
const ALL_KEY = 0;

type AppliedFilters = {
  menuId: number | null;
  search: string;
};

function formatDateTime(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function matchesSearch(item: AdminVideoSummary, search: string): boolean {
  if (!search) return true;
  const q = search.toLowerCase();
  return (
    item.title.toLowerCase().includes(q) ||
    item.sourceTitle.toLowerCase().includes(q) ||
    (item.preacherName?.toLowerCase().includes(q) ?? false) ||
    (item.scriptureReference?.toLowerCase().includes(q) ?? false)
  );
}

function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  // 최대 7개 페이지 버튼 표시
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, -1, totalPages];
    if (currentPage >= totalPages - 3) return [1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, -1, currentPage - 1, currentPage, currentPage + 1, -2, totalPages];
  };

  return (
    <div className="flex items-center justify-center gap-1 px-5 py-4">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#334155] transition hover:bg-[#f0f6ff] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="이전 페이지"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M7.5 2.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {getPageNumbers().map((page, idx) =>
        page < 0 ? (
          <span key={`ellipsis-${idx}`} className="flex h-8 w-8 items-center justify-center text-[12px] text-[#8fa3bb]">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-semibold transition ${
              page === currentPage
                ? "bg-[#3f74c7] text-white"
                : "border border-[#e2e8f0] bg-white text-[#334155] hover:bg-[#f0f6ff]"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#334155] transition hover:bg-[#f0f6ff] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="다음 페이지"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default function VideoListClient({
  playlists,
  initialPlaylistMenuId,
  initialItems,
}: {
  playlists: AdminYouTubePlaylist[];
  initialPlaylistMenuId: number | null;
  initialItems: AdminVideoSummary[];
}) {
  const toast = useAdminToast();

  // ── 필터 입력 상태 (아직 적용 전) ──────────────────────────────────────────
  const [filterMenuId, setFilterMenuId] = useState<number | null>(initialPlaylistMenuId);
  const [filterSearch, setFilterSearch] = useState("");

  // ── 실제 적용된 필터 ────────────────────────────────────────────────────────
  const [applied, setApplied] = useState<AppliedFilters>({
    menuId: initialPlaylistMenuId,
    search: "",
  });

  // ── 데이터 캐시 ─────────────────────────────────────────────────────────────
  const [itemsByMenuId, setItemsByMenuId] = useState<Partial<Record<number, AdminVideoSummary[]>>>(
    initialPlaylistMenuId != null ? { [initialPlaylistMenuId]: initialItems } : {},
  );
  const [listLoading, setListLoading] = useState(false);
  const [, setFetchError] = useState<string | null>(null);

  // ── 페이지네이션 ────────────────────────────────────────────────────────────
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── 적용된 menuId의 영상 목록 로드 ──────────────────────────────────────────
  useEffect(() => {
    const { menuId } = applied;
    const cacheKey = menuId ?? ALL_KEY;
    if (itemsByMenuId[cacheKey] !== undefined) return;

    let cancelled = false;

    const loadList = async () => {
      setListLoading(true);
      setFetchError(null);

      try {
        const url = menuId != null
          ? `/api/admin/videos?menuId=${encodeURIComponent(menuId)}`
          : `/api/admin/videos`;
        const response = await fetch(url);
        const payload = (await response.json()) as { items?: AdminVideoSummary[]; message?: string };

        if (!response.ok || !payload.items) {
          throw new Error(payload.message ?? "영상 목록을 불러오지 못했습니다.");
        }

        if (!cancelled) {
          setItemsByMenuId((prev) => ({ ...prev, [cacheKey]: payload.items }));
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "영상 목록을 불러오지 못했습니다.";
          setFetchError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    };

    void loadList();
    return () => { cancelled = true; };
  }, [applied, itemsByMenuId, toast]);

  // ── 필터 적용 후 페이지 리셋 ────────────────────────────────────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [applied, pageSize]);

  // ── 현재 선택된 플레이리스트의 전체 아이템 ────────────────────────────────
  const rawItems = useMemo(
    () => itemsByMenuId[applied.menuId ?? ALL_KEY] ?? [],
    [applied.menuId, itemsByMenuId],
  );

  // ── 검색어 필터링 ────────────────────────────────────────────────────────────
  const filteredItems = useMemo(
    () => rawItems.filter((item) => matchesSearch(item, applied.search)),
    [rawItems, applied.search],
  );

  // ── 페이지네이션 ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedItems = useMemo(() => {
    const from = (safePage - 1) * pageSize;
    return filteredItems.slice(from, from + pageSize);
  }, [filteredItems, safePage, pageSize]);

  const selectedPlaylist = useMemo(
    () => playlists.find((p) => p.menuId === applied.menuId) ?? null,
    [playlists, applied.menuId],
  );

  const handleSearch = () => {
    setApplied({ menuId: filterMenuId, search: filterSearch.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // ── 렌더 ─────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* 필터 영역 */}
      <section className="rounded-2xl border border-[#dbe4f0] bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          {/* 검색어 */}
          <label className="flex min-w-0 flex-1 flex-col gap-1.5" style={{ minWidth: "180px" }}>
            <span className="text-[11px] font-semibold text-[#55697f]">검색어</span>
            <input
              ref={searchInputRef}
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="제목, 발행자, 본문..."
              className="h-9 rounded-lg border border-[#d5deea] px-3 text-[13px] focus:border-[#3f74c7] focus:outline-none"
            />
          </label>

          {/* 메뉴 필터 */}
          <label className="flex flex-col gap-1.5" style={{ minWidth: "160px" }}>
            <span className="text-[11px] font-semibold text-[#55697f]">재생목록</span>
            <select
              value={filterMenuId ?? ""}
              onChange={(e) => setFilterMenuId(e.target.value ? Number(e.target.value) : null)}
              className="h-9 rounded-lg border border-[#d5deea] bg-white px-3 text-[13px] focus:border-[#3f74c7] focus:outline-none"
            >
              <option value="">전체</option>
              {playlists.map((p) => (
                <option key={p.menuId} value={p.menuId}>
                  {p.menuLabel}{p.parentLabel ? ` (${p.parentLabel})` : ""}
                </option>
              ))}
            </select>
          </label>

          {/* 검색 버튼 */}
          <button
            type="button"
            onClick={handleSearch}
            className="h-9 rounded-lg bg-[#3f74c7] px-5 text-[13px] font-semibold text-white transition hover:bg-[#4a82d7]"
          >
            검색
          </button>
        </div>

        {/* 현재 적용된 필터 뱃지 */}
        {(applied.search || applied.menuId !== initialPlaylistMenuId) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-[#8fa3bb]">적용된 필터:</span>
            {selectedPlaylist && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#edf4ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#2d5da8]">
                {selectedPlaylist.menuLabel}
              </span>
            )}
            {applied.search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#edf4ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#2d5da8]">
                &quot;{applied.search}&quot;
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setFilterMenuId(initialPlaylistMenuId);
                setFilterSearch("");
                setApplied({ menuId: initialPlaylistMenuId, search: "" });
              }}
              className="text-[11px] text-[#8fa3bb] underline-offset-2 hover:text-[#3f74c7] hover:underline"
            >
              초기화
            </button>
          </div>
        )}
      </section>

      {/* 영상 목록 */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        {/* 목록 헤더 */}
        <div className="flex items-center justify-between gap-3 border-b border-[#edf2f7] px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-bold text-[#132033]">영상 목록</h2>
            {listLoading ? (
              <span className="text-[12px] text-[#8fa3bb]">불러오는 중...</span>
            ) : (
              <span className="text-[12px] text-[#6d7f95]">
                전체 <span className="font-semibold text-[#132033]">{filteredItems.length}</span>건
                {applied.search && rawItems.length !== filteredItems.length && (
                  <span className="ml-1 text-[#8fa3bb]">/ {rawItems.length}건</span>
                )}
              </span>
            )}
          </div>

          {/* 페이지당 개수 */}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value) as PageSize)}
            className="h-8 rounded-lg border border-[#d5deea] bg-white px-2 text-[12px] font-semibold text-[#334155] focus:border-[#3f74c7] focus:outline-none"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}개</option>
            ))}
          </select>
        </div>

        {/* 오류 */}
        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {["번호", "제목", "발행자", "노출일", "유형", "상태"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-5 py-3 text-[11px] font-semibold tracking-wide text-[#55697f]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[13px] text-[#6d7f95]">
                    불러오는 중...
                  </td>
                </tr>
              ) : pagedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[13px] text-[#6d7f95]">
                    {applied.search ? "검색 결과가 없습니다." : "등록된 영상이 없습니다."}
                  </td>
                </tr>
              ) : (
                pagedItems.map((item, idx) => (
                  <tr
                    key={item.videoId}
                    className="border-b border-[#f0f4f8] last:border-0 transition hover:bg-[#fafcff]"
                  >
                    <td className="px-5 py-4 text-[13px] text-[#5d6f86]">
                      {(safePage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/videos/${encodeURIComponent(item.videoId)}`} className="block">
                        <p className="max-w-[300px] truncate text-[13px] font-semibold text-[#132033] hover:text-[#3f74c7]">
                          {item.title}
                        </p>
                        <p className="mt-0.5 max-w-[300px] truncate text-[11px] text-[#8fa3bb]">
                          {item.sourceTitle}
                        </p>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-[#5d6f86]">
                      {item.preacherName || "—"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[12px] text-[#5d6f86]">
                      {formatDateTime(item.publishedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-[10px] font-semibold text-[#475569]">
                        {item.contentForm === "SHORTFORM" ? "SHORT" : "LONG"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {item.hidden ? (
                        <span className="rounded-full bg-[#fff1f2] px-2.5 py-0.5 text-[10px] font-semibold text-[#be123c]">
                          숨김
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-[10px] font-semibold text-[#047857]">
                          노출
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {!listLoading && filteredItems.length > pageSize && (
          <div className="border-t border-[#edf2f7]">
            <PaginationBar
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </section>
    </div>
  );
}
