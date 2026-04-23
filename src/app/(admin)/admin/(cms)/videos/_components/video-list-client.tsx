"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AdminVideoSummary } from "@/lib/admin-videos-api";
import type {
  AdminMenuTreeNode,
  AdminYouTubePlaylist,
  MenuStatus,
  MenuTreeNodePayload,
  YouTubeContentForm,
} from "@/lib/admin-menu-api";

type PageSize = 10 | 20 | 50;
const PAGE_SIZE_OPTIONS: PageSize[] = [10, 20, 50];
type EditorNode = AdminMenuTreeNode;

// menuId === null(전체)일 때 캐시에서 사용할 sentinel 키. 실제 menuId는 양의 정수이므로 충돌 없음.
const ALL_KEY = 0;

type AppliedFilters = {
  menuId: number | null;
  search: string;
};

const STATUS_META: Record<MenuStatus, string> = {
  DRAFT: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  HIDDEN: "bg-slate-100 text-slate-600",
  ARCHIVED: "bg-rose-100 text-rose-700",
};

const STATUS_LABEL: Record<MenuStatus, string> = {
  DRAFT: "분류 대기",
  PUBLISHED: "노출 중",
  HIDDEN: "숨김",
  ARCHIVED: "보관",
};

function flattenTree(nodes: EditorNode[], depth = 0): Array<{ node: EditorNode; depth: number }> {
  return nodes.flatMap((node) => [
    { node, depth },
    ...flattenTree(node.children, depth + 1),
  ]);
}

function cloneTree(nodes: EditorNode[]): EditorNode[] {
  return nodes.map((node) => ({
    ...node,
    children: cloneTree(node.children),
  }));
}

function mapTree(
  nodes: EditorNode[],
  targetId: number,
  updater: (node: EditorNode) => EditorNode,
): EditorNode[] {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return updater({ ...node, children: cloneTree(node.children) });
    }

    return {
      ...node,
      children: mapTree(node.children, targetId, updater),
    };
  });
}

function removeNode(nodes: EditorNode[], targetId: number): EditorNode[] {
  return nodes
    .filter((node) => node.id !== targetId)
    .map((node) => ({
      ...node,
      children: removeNode(node.children, targetId),
    }));
}

function findNode(nodes: EditorNode[], targetId: number): EditorNode | null {
  for (const node of nodes) {
    if (node.id === targetId) return node;
    const childMatch = findNode(node.children, targetId);
    if (childMatch) return childMatch;
  }
  return null;
}

function reparentNode(nodes: EditorNode[], targetId: number, nextParentId: number | null): EditorNode[] {
  const tree = cloneTree(nodes);
  const movingNode = findNode(tree, targetId);
  if (!movingNode) return tree;

  const withoutNode = removeNode(tree, targetId);
  if (nextParentId === null) {
    return [...withoutNode, { ...movingNode, parentId: null }];
  }

  const nextParent = findNode(withoutNode, nextParentId);
  if (!nextParent) return tree;

  return mapTree(withoutNode, nextParentId, (node) => ({
    ...node,
    children: [...node.children, { ...movingNode, parentId: nextParentId }],
  }));
}

function toPayload(nodes: EditorNode[]): MenuTreeNodePayload[] {
  return nodes.map((node) => ({
    id: node.id > 0 ? node.id : null,
    type: node.type,
    status: !node.isAuto && node.status === "DRAFT" ? "HIDDEN" : node.status,
    label: node.label,
    slug: node.slug,
    slugCustomized: node.slugCustomized,
    staticPageKey: node.staticPageKey,
    boardKey: node.boardKey,
    boardTypeId: node.boardTypeId,
    externalUrl: node.externalUrl,
    openInNewTab: node.openInNewTab,
    isAuto: node.isAuto,
    playlistContentForm: node.playlistContentForm,
    children: toPayload(node.children),
  }));
}

function gatherVideoNodes(nodes: EditorNode[]): EditorNode[] {
  return flattenTree(nodes)
    .map(({ node }) => node)
    .filter((node) => node.type === "YOUTUBE_PLAYLIST");
}

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
  initialMenuItems,
  initialPlaylistMenuId,
  initialItems,
}: {
  playlists: AdminYouTubePlaylist[];
  initialMenuItems: AdminMenuTreeNode[];
  initialPlaylistMenuId: number | null;
  initialItems: AdminVideoSummary[];
}) {
  const [menuItems, setMenuItems] = useState<EditorNode[]>(cloneTree(initialMenuItems));
  const [menuDirty, setMenuDirty] = useState(false);
  const [menuSaving, setMenuSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [menuMessage, setMenuMessage] = useState<string | null>(null);

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
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── 페이지네이션 ────────────────────────────────────────────────────────────
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const allMenuItems = useMemo(() => flattenTree(menuItems), [menuItems]);
  const menuById = useMemo(
    () => new Map(allMenuItems.map(({ node }) => [node.id, node])),
    [allMenuItems],
  );
  const youtubeGroupOptions = useMemo(
    () =>
      allMenuItems
        .filter(({ node }) => node.type === "YOUTUBE_PLAYLIST_GROUP" && node.parentId === null)
        .map(({ node, depth }) => ({ id: node.id, label: node.label, depth })),
    [allMenuItems],
  );
  const playlistCards = useMemo(
    () =>
      gatherVideoNodes(menuItems)
        .map((node) => ({
          ...node,
          parentLabel: node.parentId ? menuById.get(node.parentId)?.label ?? null : null,
        }))
        .sort((left, right) => left.label.localeCompare(right.label, "ko-KR")),
    [menuById, menuItems],
  );
  const draftPlaylists = playlistCards.filter((playlist) => playlist.status === "DRAFT");
  const publishedPlaylists = playlistCards.filter((playlist) => playlist.status === "PUBLISHED");
  const hiddenPlaylists = playlistCards.filter((playlist) => playlist.status === "HIDDEN");
  const archivedPlaylists = playlistCards.filter((playlist) => playlist.status === "ARCHIVED");

  const markMenuDirty = (nextItems: EditorNode[]) => {
    setMenuItems(nextItems);
    setMenuDirty(true);
    setMenuMessage(null);
  };

  const updatePlaylistNode = (
    menuId: number,
    updater: (node: EditorNode) => EditorNode,
  ) => {
    markMenuDirty(mapTree(menuItems, menuId, updater));
  };

  const handleSaveMenuTree = async () => {
    setMenuSaving(true);
    setMenuMessage(null);
    try {
      const response = await fetch("/api/admin/menu/tree", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: toPayload(menuItems) }),
      });
      const payload = (await response.json()) as { items?: AdminMenuTreeNode[]; message?: string };
      if (!response.ok || !payload.items) {
        throw new Error(payload.message || "재생목록 설정을 저장하지 못했습니다.");
      }

      setMenuItems(cloneTree(payload.items));
      setMenuDirty(false);
      setMenuMessage("재생목록 설정을 저장했습니다.");
    } catch (error) {
      setMenuMessage(error instanceof Error ? error.message : "재생목록 설정을 저장하지 못했습니다.");
    } finally {
      setMenuSaving(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMenuMessage(null);
    try {
      const response = await fetch("/api/admin/youtube/sync", { method: "POST" });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message || "유튜브 동기화에 실패했습니다.");
      }
      window.location.reload();
    } catch (error) {
      setMenuMessage(error instanceof Error ? error.message : "유튜브 동기화에 실패했습니다.");
      setSyncing(false);
    }
  };

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
          setFetchError(error instanceof Error ? error.message : "영상 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    };

    void loadList();
    return () => { cancelled = true; };
  }, [applied, itemsByMenuId]);

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

  const renderPlaylistSection = (
    title: string,
    description: string,
    sectionPlaylists: Array<EditorNode & { parentLabel: string | null }>,
    accentClass: string,
  ) => {
    if (sectionPlaylists.length === 0) return null;

    return (
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[14px] font-bold text-[#132033]">{title}</h2>
            <p className="mt-1 text-[12px] text-[#6d7f95]">{description}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${accentClass}`}>
            {sectionPlaylists.length}개
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sectionPlaylists.map((playlist) => (
            <div key={playlist.id} className="rounded-2xl border border-[#e2e8f0] bg-[#fbfdff] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold text-[#132033]">{playlist.label}</p>
                  <p className="mt-1 truncate text-[11px] text-[#8fa3bb]">
                    원제목: {playlist.playlistSourceTitle ?? "-"}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_META[playlist.status]}`}>
                  {STATUS_LABEL[playlist.status]}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-[12px] text-[#5d6f86]">
                <p>소속 그룹: {playlist.parentLabel ?? "미지정"}</p>
                <p>영상 수: {playlist.itemCount ?? 0}개</p>
                <p>노출 형식: {(playlist.playlistContentForm ?? "LONGFORM") === "SHORTFORM" ? "쇼츠" : "롱폼"}</p>
              </div>

              <div className="mt-4 space-y-2">
                <label className="block space-y-1">
                  <span className="text-[11px] font-semibold text-[#334155]">소속 그룹</span>
                  <select
                    value={playlist.parentId ?? ""}
                    onChange={(event) => {
                      const rawValue = event.target.value;
                      markMenuDirty(reparentNode(menuItems, playlist.id, rawValue ? Number(rawValue) : null));
                    }}
                    className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[12px]"
                  >
                    <option value="">미지정</option>
                    {youtubeGroupOptions.map((group) => (
                      <option key={group.id} value={group.id}>
                        {"　".repeat(group.depth)}
                        {group.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-1">
                  <span className="text-[11px] font-semibold text-[#334155]">노출 형식</span>
                  <select
                    value={playlist.playlistContentForm ?? "LONGFORM"}
                    onChange={(event) => {
                      const nextValue = event.target.value as YouTubeContentForm;
                      updatePlaylistNode(playlist.id, (node) => ({
                        ...node,
                        playlistContentForm: nextValue,
                      }));
                    }}
                    className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[12px]"
                  >
                    <option value="LONGFORM">롱폼</option>
                    <option value="SHORTFORM">쇼츠</option>
                  </select>
                </label>

                <div className="flex flex-wrap gap-2">
                  {playlist.status !== "PUBLISHED" && (
                    <button
                      type="button"
                      onClick={() =>
                        updatePlaylistNode(playlist.id, (node) => ({
                          ...node,
                          status: node.parentId ? "PUBLISHED" : node.status,
                        }))
                      }
                      disabled={!playlist.parentId}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700 disabled:opacity-50"
                    >
                      노출
                    </button>
                  )}
                  {playlist.status !== "HIDDEN" && playlist.status !== "ARCHIVED" && (
                    <button
                      type="button"
                      onClick={() =>
                        updatePlaylistNode(playlist.id, (node) => ({
                          ...node,
                          status: "HIDDEN",
                        }))
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700"
                    >
                      숨기기
                    </button>
                  )}
                  {playlist.playlistSourceTitle && playlist.label !== playlist.playlistSourceTitle && (
                    <button
                      type="button"
                      onClick={() =>
                        updatePlaylistNode(playlist.id, (node) => ({
                          ...node,
                          label: playlist.playlistSourceTitle ?? node.label,
                          labelCustomized: false,
                        }))
                      }
                      className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[11px] font-semibold text-[#2d5da8]"
                    >
                      원제목 복원
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // ── 렌더 ─────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[#dbe4f0] bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-semibold text-[#132033]">
              분류 대기 유튜브 재생목록 {draftPlaylists.length}개
            </p>
            <p className="mt-1 text-[12px] text-[#6d7f95]">
              자동 동기화는 매일 오전 8시와 오후 11시에 실행되고, 수동 동기화는 언제든 가능합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSync}
              disabled={syncing}
              className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#132033] disabled:opacity-60"
            >
              {syncing ? "동기화 중..." : "지금 동기화"}
            </button>
            <button
              type="button"
              onClick={handleSaveMenuTree}
              disabled={!menuDirty || menuSaving}
              className="rounded-lg bg-[#3f74c7] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
            >
              {menuSaving ? "저장 중..." : "재생목록 설정 저장"}
            </button>
          </div>
        </div>
        {menuMessage && (
          <p className="mt-3 text-[12px] text-[#2d5da8]">{menuMessage}</p>
        )}
      </section>

      {renderPlaylistSection("분류 대기", "그룹 지정 후 노출 상태로 바꿀 수 있습니다.", draftPlaylists, "bg-amber-100 text-amber-700")}
      {renderPlaylistSection("노출 중", "사용자 사이트에 공개되는 재생목록입니다.", publishedPlaylists, "bg-emerald-100 text-emerald-700")}
      {renderPlaylistSection("숨김", "운영자가 수동으로 비노출한 재생목록입니다.", hiddenPlaylists, "bg-slate-100 text-slate-600")}
      {renderPlaylistSection("보관", "유튜브에서 사라져 자동 보관된 재생목록입니다.", archivedPlaylists, "bg-rose-100 text-rose-700")}

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
        {fetchError && (
          <p className="px-5 py-4 text-[12px] text-[#e53e3e]">{fetchError}</p>
        )}

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
