"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  AdminMenuTreeNode,
  MenuTreeNodePayload,
  MenuStatus,
  YouTubeContentForm,
} from "@/lib/admin-menu-api";
import { useAdminToast } from "../../components/admin-toast-provider";

type EditorNode = AdminMenuTreeNode;

const STATUS_META: Record<MenuStatus, string> = {
  DRAFT: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  HIDDEN: "bg-slate-100 text-slate-700",
  ARCHIVED: "bg-rose-100 text-rose-700",
};

const STATUS_LABEL: Record<MenuStatus, string> = {
  DRAFT: "분류 대기",
  PUBLISHED: "노출 중",
  HIDDEN: "숨김",
  ARCHIVED: "보관",
};

function cloneTree(nodes: EditorNode[]): EditorNode[] {
  return nodes.map((node) => ({
    ...node,
    children: cloneTree(node.children),
  }));
}

function flattenTree(nodes: EditorNode[], depth = 0): Array<{ node: EditorNode; depth: number }> {
  return nodes.flatMap((node) => [
    { node, depth },
    ...flattenTree(node.children, depth + 1),
  ]);
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
    const child = findNode(node.children, targetId);
    if (child) return child;
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

function applyNodeSnapshot(nodes: EditorNode[], snapshot: EditorNode): EditorNode[] {
  const tree = cloneTree(nodes);
  const existing = findNode(tree, snapshot.id);
  if (!existing) return tree;

  if (existing.parentId === snapshot.parentId) {
    return mapTree(tree, snapshot.id, () => ({
      ...snapshot,
      children: cloneTree(snapshot.children),
    }));
  }

  const withoutNode = removeNode(tree, snapshot.id);
  const movedNode = {
    ...snapshot,
    children: cloneTree(snapshot.children),
  };

  if (snapshot.parentId === null) {
    return [...withoutNode, movedNode];
  }

  const nextParent = findNode(withoutNode, snapshot.parentId);
  if (!nextParent) return tree;

  return mapTree(withoutNode, snapshot.parentId, (node) => ({
    ...node,
    children: [...node.children, movedNode],
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

function SyncMetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-[#dbe4f0] bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold text-[#7b8ba1]">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

export default function VideoSyncClient({
  initialMenuItems,
}: {
  initialMenuItems: AdminMenuTreeNode[];
}) {
  const router = useRouter();
  const toast = useAdminToast();
  const [syncing, setSyncing] = useState(false);
  const [savedMenuItems, setSavedMenuItems] = useState<EditorNode[]>(cloneTree(initialMenuItems));
  const [menuItems, setMenuItems] = useState<EditorNode[]>(cloneTree(initialMenuItems));
  const [dirtyPlaylistIds, setDirtyPlaylistIds] = useState<Set<number>>(new Set());
  const [savingPlaylistId, setSavingPlaylistId] = useState<number | null>(null);
  const menuItemsRef = useRef(menuItems);
  const dirtyPlaylistIdsRef = useRef(dirtyPlaylistIds);

  useEffect(() => {
    menuItemsRef.current = menuItems;
    dirtyPlaylistIdsRef.current = dirtyPlaylistIds;
  }, [dirtyPlaylistIds, menuItems]);

  useEffect(() => {
    const nextItems = cloneTree(initialMenuItems);
    const pendingIds = Array.from(dirtyPlaylistIdsRef.current);
    const mergedItems = pendingIds.reduce((acc, dirtyId) => {
      const dirtySnapshot = findNode(menuItemsRef.current, dirtyId);
      return dirtySnapshot ? applyNodeSnapshot(acc, dirtySnapshot) : acc;
    }, cloneTree(nextItems));

    setSavedMenuItems(nextItems);
    setMenuItems(mergedItems);
    setDirtyPlaylistIds(new Set(pendingIds.filter((dirtyId) => findNode(mergedItems, dirtyId) != null)));
  }, [initialMenuItems]);

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
  const editablePlaylists = useMemo(
    () =>
      gatherVideoNodes(menuItems)
        .map((node) => ({
          ...node,
          parentLabel: node.parentId ? menuById.get(node.parentId)?.label ?? null : null,
        }))
        .sort((left, right) => left.label.localeCompare(right.label, "ko-KR")),
    [menuById, menuItems],
  );

  const activeCount = editablePlaylists.filter((playlist) => playlist.syncStatus === "ACTIVE").length;
  const removedCount = editablePlaylists.filter((playlist) => playlist.syncStatus === "REMOVED").length;
  const hiddenCount = editablePlaylists.filter((playlist) => playlist.status === "HIDDEN").length;
  const assignedCount = editablePlaylists.filter((playlist) => playlist.parentId != null).length;
  const uncategorizedCount = editablePlaylists.filter((playlist) => playlist.parentId == null).length;

  const handleSync = async () => {
    setSyncing(true);

    try {
      const response = await fetch("/api/admin/youtube/sync", { method: "POST" });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "유튜브 동기화에 실패했습니다.");
      }

      toast.success(payload.message || "유튜브 동기화를 실행했습니다.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "유튜브 동기화에 실패했습니다.");
    } finally {
      setSyncing(false);
    }
  };

  const markPlaylistDirty = (playlistId: number, nextItems: EditorNode[]) => {
    setMenuItems(nextItems);
    setDirtyPlaylistIds((prev) => {
      const next = new Set(prev);
      next.add(playlistId);
      return next;
    });
  };

  const updatePlaylistNode = (menuId: number, updater: (node: EditorNode) => EditorNode) => {
    markPlaylistDirty(menuId, mapTree(menuItems, menuId, updater));
  };

  const handleSavePlaylist = async (playlistId: number) => {
    const snapshot = findNode(menuItems, playlistId);
    if (!snapshot) {
      toast.error("저장할 재생목록을 찾지 못했습니다.");
      return;
    }

    const itemsForSave = applyNodeSnapshot(savedMenuItems, snapshot);
    setSavingPlaylistId(playlistId);
    try {
      const response = await fetch("/api/admin/menu/tree", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: toPayload(itemsForSave) }),
      });
      const payload = (await response.json()) as { items?: AdminMenuTreeNode[]; message?: string };
      if (!response.ok || !payload.items) {
        throw new Error(payload.message || "재생목록 운영 설정을 저장하지 못했습니다.");
      }

      const nextSavedItems = cloneTree(payload.items);
      const pendingIds = Array.from(dirtyPlaylistIds).filter((id) => id !== playlistId);
      const mergedItems = pendingIds.reduce((acc, dirtyId) => {
        const dirtySnapshot = findNode(menuItems, dirtyId);
        return dirtySnapshot ? applyNodeSnapshot(acc, dirtySnapshot) : acc;
      }, cloneTree(nextSavedItems));

      setSavedMenuItems(nextSavedItems);
      setMenuItems(mergedItems);
      setDirtyPlaylistIds(new Set(pendingIds));
      toast.success("재생목록 운영 설정을 저장했습니다.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "재생목록 운영 설정을 저장하지 못했습니다.");
    } finally {
      setSavingPlaylistId(null);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe4f0] bg-white px-5 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[13px] font-semibold text-[#132033]">유튜브 재생목록 동기화</p>
            <p className="text-[12px] leading-5 text-[#6d7f95]">
              자동 동기화는 매일 오전 8시와 오후 11시에 실행됩니다. 운영 중 반영을 서둘러야 할 때만 수동 동기화를 사용하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="rounded-lg border border-[#d7e3f4] bg-white px-4 py-2 text-[12px] font-semibold text-[#132033] disabled:opacity-60"
          >
            {syncing ? "동기화 중..." : "지금 동기화"}
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SyncMetricCard label="전체 재생목록" value={editablePlaylists.length} tone="text-[#132033]" />
        <SyncMetricCard label="정상 연동" value={activeCount} tone="text-emerald-600" />
        <SyncMetricCard label="제거 감지" value={removedCount} tone="text-rose-600" />
        <SyncMetricCard label="메뉴 지정" value={assignedCount} tone="text-[#2d5da8]" />
        <SyncMetricCard label="메뉴 미지정" value={uncategorizedCount} tone="text-amber-600" />
      </section>

      <section className="rounded-2xl border border-[#dbe4f0] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-[#edf2f7] px-5 py-4">
          <div>
            <h2 className="text-[14px] font-bold text-[#132033]">재생목록 동기화 현황</h2>
            <p className="mt-1 text-[12px] text-[#6d7f95]">재생목록별로 소속 메뉴와 노출 방식을 조정한 뒤 행 단위로 저장합니다.</p>
          </div>
          <span className="text-[12px] font-semibold text-[#6d7f95]">숨김 {hiddenCount}개</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {["재생목록", "소속 메뉴", "영상 수", "형식", "연동 상태", "운영 상태", "빠른 작업", "저장"].map((header) => (
                  <th
                    key={header}
                    className="whitespace-nowrap px-5 py-3 text-[11px] font-semibold tracking-wide text-[#55697f]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editablePlaylists.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[13px] text-[#6d7f95]">
                    동기화된 재생목록이 없습니다.
                  </td>
                </tr>
              ) : (
                editablePlaylists.map((playlist) => (
                  <tr key={playlist.id} className="border-b border-[#f0f4f8] last:border-0">
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-[#132033]">{playlist.label}</p>
                      <p className="mt-0.5 text-[11px] text-[#8fa3bb]">{playlist.playlistSourceTitle ?? "-"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={playlist.parentId ?? ""}
                        onChange={(event) => {
                          const rawValue = event.target.value;
                          markPlaylistDirty(playlist.id, reparentNode(menuItems, playlist.id, rawValue ? Number(rawValue) : null));
                        }}
                        className="w-[148px] rounded-lg border border-[#d5deea] bg-white px-3 py-2 text-[12px] text-[#334155]"
                      >
                        <option value="">미지정</option>
                        {youtubeGroupOptions.map((group) => (
                          <option key={group.id} value={group.id}>
                            {"　".repeat(group.depth)}
                            {group.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-[#5d6f86]">{playlist.itemCount}개</td>
                    <td className="px-5 py-4">
                      <select
                        value={playlist.playlistContentForm ?? "LONGFORM"}
                        onChange={(event) => {
                          const nextValue = event.target.value as YouTubeContentForm;
                          updatePlaylistNode(playlist.id, (node) => ({
                            ...node,
                            playlistContentForm: nextValue,
                          }));
                        }}
                        className="w-[92px] rounded-lg border border-[#d5deea] bg-white px-3 py-2 text-[12px] text-[#334155]"
                      >
                        <option value="LONGFORM">롱폼</option>
                        <option value="SHORTFORM">쇼츠</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          playlist.syncStatus === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {playlist.syncStatus === "ACTIVE" ? "정상" : "제거됨"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_META[playlist.status]}`}
                      >
                        {STATUS_LABEL[playlist.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
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
                            공개
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
                            disabled={playlist.status === "DRAFT"}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700 disabled:opacity-50"
                          >
                            숨김
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
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleSavePlaylist(playlist.id)}
                        disabled={!dirtyPlaylistIds.has(playlist.id) || savingPlaylistId !== null}
                        className="whitespace-nowrap rounded-lg bg-[#3f74c7] px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
                      >
                        {savingPlaylistId === playlist.id ? "저장 중..." : "저장"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
