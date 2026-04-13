import Link from "next/link";
import { Fragment, Suspense } from "react";
import {
  getAdminNavigationItems,
  getAdminNavigationSets,
  type AdminNavigationItem,
} from "@/lib/admin-navigation-api";
import NavigationFilterBar from "./navigation-filter-bar";
import NavigationSetTabs from "./navigation-set-tabs";
import LoadMoreButton from "./load-more-button";

// 샘플 테스트: 3 / 실제 운영: 10
const PAGE_SIZE = 10;

type StatusFilter = "all" | "visible" | "hidden";

interface AdminNavigationPageProps {
  searchParams?: Promise<{
    set?: string | string[];
    limit?: string | string[];
    status?: string | string[];
    search?: string | string[];
  }>;
}

function getFirst(val: string | string[] | undefined): string {
  return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
}

// ── 링크 타입 뱃지 ────────────────────────────────────────────────────────────
const LINK_TYPE_META: Record<string, { label: string; cls: string }> = {
  INTERNAL:    { label: "내부",   cls: "bg-blue-50 text-blue-600" },
  EXTERNAL:    { label: "외부",   cls: "bg-orange-50 text-orange-600" },
  ANCHOR:      { label: "앵커",   cls: "bg-purple-50 text-purple-600" },
};

function LinkTypeBadge({ type }: { type: string }) {
  const meta = LINK_TYPE_META[type] ?? { label: type, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

// ── 1depth 행 ─────────────────────────────────────────────────────────────────
function RootRow({ item, rowNum }: { item: AdminNavigationItem; rowNum: number }) {
  const visibleChildren = item.children.filter((c) => c.visible).length;
  const updatedAt = item.updatedAt
    ? new Date(item.updatedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    : "-";

  return (
    <tr className="border-b border-[#f0f4f8] transition hover:bg-[#fafcff]">
      <td className="px-5 py-4 align-middle text-[13px] text-[#5d6f86]">{rowNum}</td>
      <td className="px-5 py-4 align-middle">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${item.visible ? "bg-emerald-50 text-emerald-600" : "bg-[#f1f5f9] text-[#8fa3bb]"}`}>
          {item.visible ? "사용 중" : "숨김"}
        </span>
      </td>
      <td className="px-5 py-4 align-middle">
        <p className="text-[13px] font-semibold text-[#0f1c2e]">{item.label}</p>
        <p className="mt-0.5 text-[11px] text-[#8fa3bb]">{item.menuKey}</p>
      </td>
      <td className="max-w-[180px] px-5 py-4 align-middle">
        <p className="truncate text-[12px] text-[#31445f]">{item.href}</p>
        {item.matchPath && item.matchPath !== item.href && (
          <p className="mt-0.5 truncate text-[11px] text-[#a0b0c3]">{item.matchPath}</p>
        )}
      </td>
      <td className="px-5 py-4 align-middle"><LinkTypeBadge type={item.linkType} /></td>
      <td className="px-5 py-4 align-middle">
        <p className="text-[13px] text-[#132033]">{item.children.length}개</p>
        <p className="mt-0.5 text-[11px] text-[#8fa3bb]">노출 {visibleChildren}개</p>
      </td>
      <td className="px-5 py-4 align-middle text-[13px] text-[#5d6f86]">{item.sortOrder}</td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{updatedAt}</td>
      <td className="px-5 py-4 align-middle">
        <Link
          href={`/admin/navigation/${item.id}`}
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#bfd0ea] bg-[#edf4ff] px-3 text-[12px] font-medium text-[#2d5da8] transition hover:bg-[#e4efff]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M1 6C2.5 3 4.5 1.5 6 1.5S9.5 3 11 6c-1.5 3-3.5 4.5-5 4.5S2.5 9 1 6z" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          상세보기
        </Link>
      </td>
    </tr>
  );
}

// ── 2depth 행 ─────────────────────────────────────────────────────────────────
function ChildRow({ item, isLast }: { item: AdminNavigationItem; isLast: boolean }) {
  const updatedAt = item.updatedAt
    ? new Date(item.updatedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    : "-";

  return (
    <tr
      className="border-b border-[#e8eef8] bg-[#f0f5ff] transition hover:bg-[#e6eeff]"
    >
      {/* 번호 — 들여쓰기 마커 */}
      <td className="align-middle py-3 pl-5 pr-2 text-[13px] font-medium text-[#3f74c7]" style={{ borderLeft: "3px solid #3f74c7" }}>
        {isLast ? "└" : "├"}
      </td>
      <td className="px-4 py-3 align-middle">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${item.visible ? "bg-emerald-50 text-emerald-600" : "bg-[#f1f5f9] text-[#8fa3bb]"}`}>
          {item.visible ? "사용 중" : "숨김"}
        </span>
      </td>
      <td className="py-3 pl-7 pr-4 align-middle">
        <p className="text-[12px] font-medium text-[#374151]">{item.label}</p>
        <p className="mt-0.5 text-[11px] text-[#7a96bb]">{item.menuKey}</p>
      </td>
      <td className="max-w-[180px] px-4 py-3 align-middle">
        <p className="truncate text-[12px] text-[#4a6484]">{item.href}</p>
        {item.matchPath && item.matchPath !== item.href && (
          <p className="mt-0.5 truncate text-[11px] text-[#a0b0c3]">{item.matchPath}</p>
        )}
      </td>
      <td className="px-4 py-3 align-middle"><LinkTypeBadge type={item.linkType} /></td>
      <td className="px-4 py-3 align-middle text-[12px] text-[#8fa3bb]">—</td>
      <td className="px-4 py-3 align-middle text-[12px] text-[#7a96bb]">{item.sortOrder}</td>
      <td className="px-4 py-3 align-middle text-[12px] text-[#7a96bb]">{updatedAt}</td>
      <td className="px-4 py-3 align-middle">
        <Link
          href={`/admin/navigation/${item.id}`}
          className="inline-flex h-7 items-center gap-1 rounded-lg border border-[#a8c4f0] bg-[#deeaff] px-3 text-[11px] font-medium text-[#2d5da8] transition hover:bg-[#d0e2ff]"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M1 6C2.5 3 4.5 1.5 6 1.5S9.5 3 11 6c-1.5 3-3.5 4.5-5 4.5S2.5 9 1 6z" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          상세보기
        </Link>
      </td>
    </tr>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────
export default async function AdminNavigationPage({ searchParams }: AdminNavigationPageProps) {
  const resolved = await searchParams;

  const currentSetKey = getFirst(resolved?.set) || "main";
  const rawStatus = getFirst(resolved?.status);
  const currentStatus: StatusFilter =
    rawStatus === "visible" || rawStatus === "hidden" ? rawStatus : "all";
  const currentSearch = getFirst(resolved?.search).trim();
  const rawLimit = getFirst(resolved?.limit);
  const parsedLimit = Number.parseInt(rawLimit || "0", 10);
  const currentLimit = parsedLimit > 0 ? parsedLimit : PAGE_SIZE;

  // 병렬 패치
  const [{ groups }, { sets }] = await Promise.all([
    getAdminNavigationItems(true, currentSetKey),
    getAdminNavigationSets(),
  ]);

  // 1depth 필터링 (검색어는 label/menuKey 또는 자식 포함)
  const filtered = groups.filter((item: AdminNavigationItem) => {
    const matchStatus =
      currentStatus === "all" ||
      (currentStatus === "visible" && item.visible) ||
      (currentStatus === "hidden" && !item.visible);

    const matchSearch =
      !currentSearch ||
      item.label.toLowerCase().includes(currentSearch.toLowerCase()) ||
      item.menuKey.toLowerCase().includes(currentSearch.toLowerCase()) ||
      item.children.some(
        (c) =>
          c.label.toLowerCase().includes(currentSearch.toLowerCase()) ||
          c.menuKey.toLowerCase().includes(currentSearch.toLowerCase()),
      );

    return matchStatus && matchSearch;
  });

  const totalCount = filtered.length; // 1depth 기준
  const pagedGroups = filtered.slice(0, currentLimit);
  const hasMore = currentLimit < totalCount;

  // 현재 세트 ID (폼에서 사용)
  const currentSet = sets.find((s) => s.setKey === currentSetKey) ?? sets[0];

  return (
    <div className="space-y-5">
      {/* ── 경로(breadcrumb) ── */}
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <Link href="/admin" className="flex items-center transition hover:text-[#3f74c7]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mr-1">
            <path d="M1.5 7.5L7 2l5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6.5V12h3V9h2v3h3V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          홈
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[#4a6484]">운영</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-medium text-[#132033]">내비게이션 메뉴</span>
      </nav>

      {/* ── 페이지 헤더 ── */}
      <h1 className="text-xl font-bold text-[#0f1c2e]">내비게이션 메뉴</h1>

      {/* ── 세트 탭 ── */}
      <Suspense fallback={<div className="h-9 w-48 animate-pulse rounded-xl bg-[#e9edf3]" />}>
        <NavigationSetTabs sets={sets} currentSetKey={currentSetKey} />
      </Suspense>

      {/* ── 필터 바 ── */}
      <Suspense fallback={<div className="h-[100px] animate-pulse rounded-2xl bg-[#f1f5f9]" />}>
        <NavigationFilterBar currentStatus={currentStatus} currentSearch={currentSearch} />
      </Suspense>

      {/* ── 결과 수 ── */}
      <p className="text-[13px] text-[#5d6f86]">
        전체 <span className="font-semibold text-[#132033]">{totalCount}</span>건
        {currentSetKey !== "main" && (
          <span className="ml-2 rounded-full bg-[#edf4ff] px-2 py-0.5 text-[11px] font-medium text-[#3f74c7]">
            {currentSetKey}
          </span>
        )}
      </p>

      {/* ── 트리 테이블 ── */}
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {["번호", "상태", "메뉴명 / 키", "연결 주소", "링크 타입", "하위 메뉴", "정렬", "수정일", "상세보기"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedGroups.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center">
                    <p className="text-[13px] font-semibold text-[#132033]">
                      {currentSearch || currentStatus !== "all" ? "검색 결과가 없습니다." : "등록된 메뉴가 없습니다."}
                    </p>
                    <p className="mt-1 text-[12px] text-[#8fa3bb]">
                      {currentSearch || currentStatus !== "all"
                        ? "다른 검색어나 필터를 사용해 보세요."
                        : "하단 메뉴 추가 버튼에서 첫 번째 메뉴를 등록할 수 있습니다."}
                    </p>
                  </td>
                </tr>
              ) : (
                pagedGroups.map((group: AdminNavigationItem, idx: number) => (
                  <Fragment key={`group-${group.id}`}>
                    {/* 1depth */}
                    <RootRow item={group} rowNum={idx + 1} />
                    {/* 2depth */}
                    {group.children.map((child, ci) => (
                      <ChildRow
                        key={`child-${child.id}`}
                        item={child}
                        isLast={ci === group.children.length - 1}
                      />
                    ))}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 더 보기 */}
        {hasMore && (
          <div className="border-t border-[#f0f4f8] px-5 py-4">
            <Suspense fallback={null}>
              <LoadMoreButton currentLimit={currentLimit} totalCount={totalCount} pageSize={PAGE_SIZE} />
            </Suspense>
          </div>
        )}

        {/* 모두 표시 */}
        {!hasMore && totalCount > PAGE_SIZE && (
          <div className="border-t border-[#f0f4f8] py-3 text-center">
            <p className="text-[11px] text-[#a0b0c3]">전체 {totalCount}건 모두 표시됨</p>
          </div>
        )}
      </div>

      {/* ── 메뉴 추가 버튼 ── */}
      <div className="flex justify-end">
        <Link
          href={`/admin/navigation/new?setId=${currentSet?.id ?? 1}&setKey=${currentSetKey}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#3f74c7] px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#4a82d7]"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          메뉴 추가
        </Link>
      </div>
    </div>
  );
}
