import Link from "next/link";
import { Suspense } from "react";
import { getAdminNavigationItems, type AdminNavigationItem } from "@/lib/admin-navigation-api";
import NavigationFilterBar from "./navigation-filter-bar";
import LoadMoreButton from "./load-more-button";

// 페이지에 불러올 컨텐츠 개수
const PAGE_SIZE = 10;

type StatusFilter = "all" | "visible" | "hidden";

interface AdminNavigationPageProps {
  searchParams?: Promise<{
    limit?: string | string[];
    status?: string | string[];
    search?: string | string[];
  }>;
}

function getFirst(val: string | string[] | undefined): string {
  return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
}

// ────────────────────────────────────────────
// 링크 타입 뱃지
// ────────────────────────────────────────────
const LINK_TYPE_META: Record<string, { label: string; bg: string; text: string }> = {
  INTERNAL: { label: "내부", bg: "bg-blue-500/10", text: "text-blue-600" },
  EXTERNAL: { label: "외부", bg: "bg-orange-500/10", text: "text-orange-600" },
  ANCHOR: { label: "앵커", bg: "bg-purple-500/10", text: "text-purple-600" },
  CONTENT_REF: { label: "콘텐츠", bg: "bg-teal-500/10", text: "text-teal-600" },
};

function LinkTypeBadge({ type }: { type: string }) {
  const meta = LINK_TYPE_META[type] ?? { label: type, bg: "bg-gray-100", text: "text-gray-600" };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.bg} ${meta.text}`}>
      {meta.label}
    </span>
  );
}

// ────────────────────────────────────────────
// 메인 페이지
// ────────────────────────────────────────────
export default async function AdminNavigationPage({ searchParams }: AdminNavigationPageProps) {
  const resolved = await searchParams;

  const rawStatus = getFirst(resolved?.status);
  const currentStatus: StatusFilter =
    rawStatus === "visible" || rawStatus === "hidden" ? rawStatus : "all";
  const currentSearch = getFirst(resolved?.search).trim();

  const rawLimit = getFirst(resolved?.limit);
  const parsedLimit = Number.parseInt(rawLimit || "0", 10);
  const currentLimit = parsedLimit > 0 ? parsedLimit : PAGE_SIZE;

  // 데이터 패치
  const { groups } = await getAdminNavigationItems(true);

  // 필터링
  const filtered = groups.filter((item: AdminNavigationItem) => {
    const matchStatus =
      currentStatus === "all" ||
      (currentStatus === "visible" && item.visible) ||
      (currentStatus === "hidden" && !item.visible);

    const matchSearch =
      !currentSearch ||
      item.label.toLowerCase().includes(currentSearch.toLowerCase()) ||
      item.menuKey.toLowerCase().includes(currentSearch.toLowerCase());

    return matchStatus && matchSearch;
  });

  const totalCount = filtered.length;
  const visibleItems = filtered.slice(0, currentLimit);
  const hasMore = currentLimit < totalCount;

  return (
    <div className="space-y-5">
      {/* ── 경로(breadcrumb) ── */}
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <Link href="/admin" className="flex items-center transition hover:text-[#3f74c7]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mr-1">
            <path d="M1.5 7.5L7 2l5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 6.5V12h3V9h2v3h3V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          홈
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[#4a6484]">운영</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-medium text-[#132033]">내비게이션 메뉴</span>
      </nav>

      {/* ── 페이지 헤더 ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0f1c2e]">내비게이션 메뉴</h1>
        <Link
          href="/admin/navigation/new"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#3f74c7] px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#4a82d7]"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          메뉴 추가
        </Link>
      </div>

      {/* ── 필터 바 ── */}
      <Suspense fallback={<div className="h-[100px] animate-pulse rounded-2xl bg-[#f1f5f9]" />}>
        <NavigationFilterBar currentStatus={currentStatus} currentSearch={currentSearch} />
      </Suspense>

      {/* ── 결과 수 ── */}
      <p className="text-[13px] text-[#5d6f86]">
        전체 <span className="font-semibold text-[#132033]">{totalCount}</span>건
      </p>

      {/* ── 리스트 테이블 ── */}
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">번호</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">상태</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">메뉴명 / 키</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">연결 주소</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">링크 타입</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">하위 메뉴</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">정렬</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">수정일</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">상세보기</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center">
                    <p className="text-[13px] font-semibold text-[#132033]">
                      {currentSearch || currentStatus !== "all"
                        ? "검색 결과가 없습니다."
                        : "등록된 메뉴가 없습니다."}
                    </p>
                    <p className="mt-1 text-[12px] text-[#8fa3bb]">
                      {currentSearch || currentStatus !== "all"
                        ? "다른 검색어나 필터를 사용해 보세요."
                        : "우측 상단 메뉴 추가 버튼에서 첫 번째 메뉴를 등록할 수 있습니다."}
                    </p>
                  </td>
                </tr>
              ) : (
                visibleItems.map((item: AdminNavigationItem, idx: number) => {
                  const rowNum = idx + 1;
                  const visibleChildren = item.children.filter((c) => c.visible).length;
                  const updatedAt = item.updatedAt
                    ? new Date(item.updatedAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    : "-";

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#f0f4f8] last:border-b-0 transition hover:bg-[#fafcff]"
                    >
                      {/* 번호 */}
                      <td className="px-5 py-4 align-middle">
                        <span className="text-[13px] text-[#5d6f86]">{rowNum}</span>
                      </td>

                      {/* 상태 */}
                      <td className="px-5 py-4 align-middle">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${item.visible
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-[#f1f5f9] text-[#8fa3bb]"
                            }`}
                        >
                          {item.visible ? "사용 중" : "숨김"}
                        </span>
                      </td>

                      {/* 메뉴명 / 키 */}
                      <td className="px-5 py-4 align-middle">
                        <p className="text-[13px] font-semibold text-[#0f1c2e]">{item.label}</p>
                        <p className="mt-0.5 text-[11px] text-[#8fa3bb]">{item.menuKey}</p>
                      </td>

                      {/* 연결 주소 */}
                      <td className="max-w-[200px] px-5 py-4 align-middle">
                        <p className="truncate text-[12px] text-[#31445f]">{item.href}</p>
                        {item.matchPath && item.matchPath !== item.href && (
                          <p className="mt-0.5 truncate text-[11px] text-[#a0b0c3]">{item.matchPath}</p>
                        )}
                      </td>

                      {/* 링크 타입 */}
                      <td className="px-5 py-4 align-middle">
                        <LinkTypeBadge type={item.linkType} />
                      </td>

                      {/* 하위 메뉴 */}
                      <td className="px-5 py-4 align-middle">
                        <p className="text-[13px] text-[#132033]">{item.children.length}개</p>
                        <p className="mt-0.5 text-[11px] text-[#8fa3bb]">노출 {visibleChildren}개</p>
                      </td>

                      {/* 정렬 */}
                      <td className="px-5 py-4 align-middle">
                        <span className="text-[13px] text-[#5d6f86]">{item.sortOrder}</span>
                      </td>

                      {/* 수정일 */}
                      <td className="px-5 py-4 align-middle">
                        <span className="text-[12px] text-[#5d6f86]">{updatedAt}</span>
                      </td>

                      {/* 상세보기 */}
                      <td className="px-5 py-4 align-middle">
                        <Link
                          href={`/admin/navigation/${item.id}`}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#bfd0ea] bg-[#edf4ff] px-3 text-[12px] font-medium text-[#2d5da8] transition hover:border-[#a9c0e4] hover:bg-[#e4efff]"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M1 6C2.5 3 4.5 1.5 6 1.5S9.5 3 11 6c-1.5 3-3.5 4.5-5 4.5S2.5 9 1 6z" stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                          상세보기
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── 더 보기 버튼 (테이블 하단, 테두리 안쪽) ── */}
        {hasMore && (
          <div className="border-t border-[#f0f4f8] px-5 py-4">
            <Suspense fallback={null}>
              <LoadMoreButton
                currentLimit={currentLimit}
                totalCount={totalCount}
                pageSize={PAGE_SIZE}
              />
            </Suspense>
          </div>
        )}

        {/* ── 모두 불러온 경우 카운트 표시 ── */}
        {!hasMore && totalCount > PAGE_SIZE && (
          <div className="border-t border-[#f0f4f8] px-5 py-3 text-center">
            <p className="text-[11px] text-[#a0b0c3]">전체 {totalCount}건 모두 표시됨</p>
          </div>
        )}
      </div>
    </div>
  );
}
