"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AdminMenuTreeNode,
  MenuStatus,
  MenuTreeNodePayload,
  MenuType,
} from "@/lib/admin-menu-api";

type EditorNode = AdminMenuTreeNode;

const STATUS_META: Record<MenuStatus, string> = {
  DRAFT: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  HIDDEN: "bg-slate-100 text-slate-600",
  ARCHIVED: "bg-rose-100 text-rose-700",
};

const MENU_TYPE_LABEL: Record<MenuType, string> = {
  FOLDER: "일반 메뉴 그룹",
  STATIC: "정적 페이지",
  BOARD: "게시판",
  EXTERNAL_LINK: "외부 링크",
  YOUTUBE_PLAYLIST_GROUP: "영상 그룹",
  YOUTUBE_PLAYLIST: "유튜브 재생목록",
};

const STATIC_PAGE_OPTIONS = [
  { value: "about.greeting", label: "교회 소개 / 인사말·비전" },
  { value: "about.pastor", label: "교회 소개 / 담임목사 소개" },
  { value: "about.service-times", label: "교회 소개 / 예배 시간 안내" },
  { value: "about.location", label: "교회 소개 / 오시는 길" },
  { value: "about.history", label: "교회 소개 / 교회 연혁" },
  { value: "about.giving", label: "교회 소개 / 헌금 안내" },
  { value: "newcomer.guide", label: "제자 양육 / 새가족 안내" },
  { value: "newcomer.care", label: "제자 양육 / 새가족 양육" },
  { value: "newcomer.disciples", label: "제자 양육 / 제자 훈련" },
  { value: "commission.summary", label: "지상명령 / 개요" },
  { value: "commission.nextgen", label: "지상명령 / 다음세대" },
  { value: "commission.culture", label: "지상명령 / 다문화" },
  { value: "commission.ethnic", label: "지상명령 / 다민족" },
];

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

function isDetachedPlaylist(node: EditorNode): boolean {
  return node.type === "YOUTUBE_PLAYLIST" && node.parentId === null;
}

function findInitialSelectedId(nodes: EditorNode[]): number | null {
  const visibleNode = flattenTree(nodes).find(({ node }) => !isDetachedPlaylist(node));
  return visibleNode?.node.id ?? nodes[0]?.id ?? null;
}

function mapTree(
  nodes: EditorNode[],
  targetId: number,
  updater: (node: EditorNode) => EditorNode,
): EditorNode[] {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return updater({
        ...node,
        children: cloneTree(node.children),
      });
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
    if (node.id === targetId) {
      return node;
    }

    const childMatch = findNode(node.children, targetId);
    if (childMatch) {
      return childMatch;
    }
  }

  return null;
}

function collectDescendantIds(node: EditorNode): Set<number> {
  const ids = new Set<number>();

  const visit = (current: EditorNode) => {
    current.children.forEach((child) => {
      ids.add(child.id);
      visit(child);
    });
  };

  visit(node);
  return ids;
}

function reparentNode(nodes: EditorNode[], targetId: number, nextParentId: number | null): EditorNode[] {
  const tree = cloneTree(nodes);
  const movingNode = findNode(tree, targetId);
  if (!movingNode) {
    return tree;
  }

  const withoutNode = removeNode(tree, targetId);
  if (nextParentId === null) {
    return [...withoutNode, { ...movingNode, parentId: null }];
  }

  const nextParent = findNode(withoutNode, nextParentId);
  if (!nextParent) {
    return tree;
  }

  return mapTree(withoutNode, nextParentId, (node) => ({
    ...node,
    children: [...node.children, { ...movingNode, parentId: nextParentId }],
  }));
}

function moveNodeWithinSiblings(nodes: EditorNode[], targetId: number, direction: -1 | 1): EditorNode[] {
  const tree = cloneTree(nodes);

  const moveInList = (list: EditorNode[]): EditorNode[] => {
    const index = list.findIndex((item) => item.id === targetId);
    if (index === -1) {
      return list.map((item) => ({
        ...item,
        children: moveInList(item.children),
      }));
    }

    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= list.length) {
      return list;
    }

    const nextList = [...list];
    const [moving] = nextList.splice(index, 1);
    nextList.splice(nextIndex, 0, moving);
    return nextList;
  };

  return moveInList(tree);
}

function findSiblingList(nodes: EditorNode[], targetId: number): EditorNode[] | null {
  const index = nodes.findIndex((node) => node.id === targetId);
  if (index !== -1) {
    return nodes;
  }

  for (const node of nodes) {
    const childResult = findSiblingList(node.children, targetId);
    if (childResult) {
      return childResult;
    }
  }

  return null;
}

function toPayload(nodes: EditorNode[]): MenuTreeNodePayload[] {
  return nodes.map((node) => ({
    id: node.id > 0 ? node.id : null,
    type: node.type,
    status: node.status,
    label: node.label,
    slug: node.slug,
    staticPageKey: node.staticPageKey,
    boardKey: node.boardKey,
    externalUrl: node.externalUrl,
    openInNewTab: node.openInNewTab,
    isAuto: node.isAuto,
    children: toPayload(node.children),
  }));
}

function buildNewNode(id: number, type: MenuType): EditorNode {
  return {
    id,
    type,
    status: "DRAFT",
    label: "새 메뉴",
    slug: "",
    isAuto: false,
    labelCustomized: false,
    staticPageKey: type === "STATIC" ? "about.greeting" : null,
    boardKey: type === "BOARD" ? "notice" : null,
    externalUrl: type === "EXTERNAL_LINK" ? "https://example.com" : null,
    openInNewTab: type === "EXTERNAL_LINK",
    playlistTitle: null,
    playlistSourceTitle: null,
    thumbnailUrl: null,
    itemCount: null,
    syncStatus: null,
    parentId: null,
    children: [],
  };
}

function updateNodeById(
  nodes: EditorNode[],
  targetId: number,
  updater: (node: EditorNode) => EditorNode,
): EditorNode[] {
  return mapTree(nodes, targetId, updater);
}

function gatherVideoNodes(nodes: EditorNode[]): EditorNode[] {
  return flattenTree(nodes)
    .map(({ node }) => node)
    .filter((node) => node.type === "YOUTUBE_PLAYLIST");
}

function buildVideoNodePath(node: EditorNode, menuById: Map<number, EditorNode>): string {
  const segments: string[] = [];
  let current: EditorNode | undefined = node;

  while (current) {
    segments.push(current.slug || "(저장 시 자동 생성)");
    current = current.parentId ? menuById.get(current.parentId) : undefined;
  }

  return `/videos/${segments.reverse().join("/")}`;
}

function getPublicRouteSummary(node: EditorNode, menuById: Map<number, EditorNode>): string {
  switch (node.type) {
    case "STATIC":
      if (!node.staticPageKey) {
        return "연결 페이지를 선택해 주세요";
      }
      if (!node.parentId) {
        return "상위 메뉴를 먼저 선택해 주세요";
      }
      return node.slug
        ? `/${menuById.get(node.parentId)?.slug ?? "root"}/${node.slug}`
        : `/${menuById.get(node.parentId)?.slug ?? "root"}/(저장 시 자동 생성)`;
    case "BOARD":
      return node.boardKey ? `/news#${node.boardKey}` : "/news";
    case "YOUTUBE_PLAYLIST":
      return buildVideoNodePath(node, menuById);
    case "EXTERNAL_LINK":
      return node.externalUrl ?? "외부 URL을 입력해 주세요";
    case "FOLDER":
    case "YOUTUBE_PLAYLIST_GROUP":
      return "첫 번째 하위 메뉴로 이동";
  }
}

export default function MenuManagementClient({
  initialItems,
}: {
  initialItems: AdminMenuTreeNode[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<EditorNode[]>(cloneTree(initialItems));
  const [selectedId, setSelectedId] = useState<number | null>(findInitialSelectedId(initialItems));
  const [tempId, setTempId] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const allFlatItems = useMemo(() => flattenTree(items), [items]);
  const flatItems = useMemo(
    () => allFlatItems.filter(({ node }) => !isDetachedPlaylist(node)),
    [allFlatItems],
  );
  const selectedNode = selectedId !== null ? findNode(items, selectedId) : null;
  const menuById = useMemo(
    () => new Map(allFlatItems.map(({ node }) => [node.id, node])),
    [allFlatItems],
  );
  const youtubeGroupOptions = useMemo(
    () =>
      allFlatItems
        .filter(({ node }) => node.type === "YOUTUBE_PLAYLIST_GROUP" && node.parentId === null)
        .map(({ node, depth }) => ({ id: node.id, label: node.label, depth })),
    [allFlatItems],
  );
  const playlistCards = useMemo(
    () =>
      gatherVideoNodes(items)
        .map((node) => ({
          ...node,
          parentLabel: node.parentId ? menuById.get(node.parentId)?.label ?? null : null,
        }))
        .sort((left, right) => left.label.localeCompare(right.label, "ko-KR")),
    [items, menuById],
  );
  const draftPlaylists = playlistCards.filter((playlist) => playlist.status === "DRAFT");
  const publishedPlaylists = playlistCards.filter((playlist) => playlist.status === "PUBLISHED");
  const hiddenPlaylists = playlistCards.filter((playlist) => playlist.status === "HIDDEN");
  const archivedPlaylists = playlistCards.filter((playlist) => playlist.status === "ARCHIVED");
  const descendantIds = useMemo(
    () => (selectedNode ? collectDescendantIds(selectedNode) : new Set<number>()),
    [selectedNode],
  );
  const siblingNodes = useMemo(
    () => (selectedNode ? findSiblingList(items, selectedNode.id) ?? [] : []),
    [items, selectedNode],
  );
  const selectedSiblingIndex = selectedNode
    ? siblingNodes.findIndex((node) => node.id === selectedNode.id)
    : -1;
  const canMoveUp = selectedSiblingIndex > 0;
  const canMoveDown =
    selectedSiblingIndex !== -1 && selectedSiblingIndex < siblingNodes.length - 1;

  const parentCandidates = flatItems.filter(({ node }) => {
    if (!selectedNode) {
      return false;
    }

    if (node.id === selectedNode.id) {
      return false;
    }

    if (descendantIds.has(node.id)) {
      return false;
    }

    if (selectedNode.type === "YOUTUBE_PLAYLIST") {
      return node.type === "YOUTUBE_PLAYLIST_GROUP" && node.parentId === null;
    }

    if (
      selectedNode.type === "STATIC" ||
      selectedNode.type === "BOARD" ||
      selectedNode.type === "EXTERNAL_LINK"
    ) {
      return node.type === "FOLDER" && node.parentId === null;
    }

    return false;
  });

  const markDirty = (nextItems: EditorNode[]) => {
    setItems(nextItems);
    setDirty(true);
    setMessage(null);
  };

  const handleAddRoot = (type: MenuType) => {
    const nextId = tempId;
    setTempId((prev) => prev - 1);
    const nextNode = buildNewNode(nextId, type);
    markDirty([...items, nextNode]);
    setSelectedId(nextId);
  };

  const handleAddChild = (type: MenuType) => {
    if (!selectedNode) {
      return;
    }
    const nextId = tempId;
    setTempId((prev) => prev - 1);
    const nextNode = buildNewNode(nextId, type);
    markDirty(
      mapTree(items, selectedNode.id, (node) => ({
        ...node,
        children: [...node.children, { ...nextNode, parentId: selectedNode.id }],
      })),
    );
    setSelectedId(nextId);
  };

  const updateSelectedNode = (updater: (node: EditorNode) => EditorNode) => {
    if (!selectedNode) {
      return;
    }
    markDirty(mapTree(items, selectedNode.id, updater));
  };

  const handleDelete = async () => {
    if (!selectedNode || selectedNode.isAuto) {
      return;
    }

    if (selectedNode.id < 0) {
      markDirty(removeNode(items, selectedNode.id));
      setSelectedId(null);
      return;
    }

    if (dirty) {
      setMessage("저장하지 않은 변경사항이 있습니다. 즉시 삭제 전에 먼저 저장하거나 변경을 정리해 주세요.");
      return;
    }

    if (!window.confirm(`"${selectedNode.label}" 메뉴를 즉시 삭제합니다. 계속할까요?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/menu/${selectedNode.id}`, {
        method: "DELETE",
      });
      const payload = response.status === 204 ? null : ((await response.json()) as { message?: string });
      if (!response.ok) {
        throw new Error(payload?.message || "메뉴를 삭제하지 못했습니다.");
      }

      setItems(removeNode(items, selectedNode.id));
      setSelectedId(null);
      setMessage("메뉴를 즉시 삭제했습니다.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "메뉴를 삭제하지 못했습니다.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/menu/tree", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: toPayload(items) }),
      });

      const payload = (await response.json()) as { items?: AdminMenuTreeNode[]; message?: string };
      if (!response.ok || !payload.items) {
        throw new Error(payload.message || "메뉴를 저장하지 못했습니다.");
      }

      setItems(cloneTree(payload.items));
      setSelectedId(findInitialSelectedId(payload.items));
      setDirty(false);
      setMessage("메뉴 구조를 저장했습니다.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "메뉴를 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/youtube/sync", { method: "POST" });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message || "유튜브 동기화에 실패했습니다.");
      }
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "유튜브 동기화에 실패했습니다.");
      setSyncing(false);
    }
  };

  const handleQuickPlaylistUpdate = (
    menuId: number,
    updater: (node: EditorNode) => EditorNode,
  ) => {
    markDirty(updateNodeById(items, menuId, updater));
    setSelectedId(menuId);
  };

  const renderPlaylistSection = (
    title: string,
    description: string,
    playlists: Array<EditorNode & { parentLabel: string | null }>,
    accentClass: string,
  ) => {
    if (playlists.length === 0) {
      return null;
    }

    return (
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[14px] font-bold text-[#132033]">{title}</h2>
            <p className="mt-1 text-[12px] text-[#6d7f95]">{description}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${accentClass}`}>
            {playlists.length}개
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="rounded-2xl border border-[#e2e8f0] bg-[#fbfdff] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold text-[#132033]">{playlist.label}</p>
                  <p className="mt-1 truncate text-[11px] text-[#8fa3bb]">
                    원제목: {playlist.playlistSourceTitle ?? "-"}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_META[playlist.status]}`}>
                  {playlist.status}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-[12px] text-[#5d6f86]">
                <p>소속 그룹: {playlist.parentLabel ?? "미지정"}</p>
                <p>영상 수: {playlist.itemCount ?? 0}개</p>
              </div>

              <div className="mt-4 space-y-2">
                <label className="block space-y-1">
                  <span className="text-[11px] font-semibold text-[#334155]">소속 그룹</span>
                  <select
                    value={playlist.parentId ?? ""}
                    onChange={(event) => {
                      const rawValue = event.target.value;
                      markDirty(reparentNode(items, playlist.id, rawValue ? Number(rawValue) : null));
                      setSelectedId(playlist.id);
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

                <div className="flex flex-wrap gap-2">
                  {playlist.status !== "PUBLISHED" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickPlaylistUpdate(playlist.id, (node) => ({
                          ...node,
                          status: node.parentId ? "PUBLISHED" : node.status,
                        }))
                      }
                      disabled={!playlist.parentId}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700"
                    >
                      노출
                    </button>
                  )}
                  {playlist.status !== "HIDDEN" && playlist.status !== "ARCHIVED" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickPlaylistUpdate(playlist.id, (node) => ({
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
                        handleQuickPlaylistUpdate(playlist.id, (node) => ({
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
                  <button
                    type="button"
                    onClick={() => setSelectedId(playlist.id)}
                    className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[11px] font-semibold text-[#334155]"
                  >
                    상세 편집
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#dbe4f0] bg-white px-5 py-4 shadow-sm">
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
              onClick={handleSave}
              disabled={!dirty || saving}
              className="rounded-lg bg-[#3f74c7] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
            >
              {saving ? "저장 중..." : `변경사항 저장${dirty ? "" : ""}`}
            </button>
          </div>
        </div>
        {message && (
          <p className="mt-3 text-[12px] text-[#2d5da8]">{message}</p>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#edf2f7] px-5 py-4">
            <h2 className="text-[14px] font-bold text-[#132033]">메뉴 트리</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAddRoot("FOLDER")}
                className="rounded-lg border border-[#d7e3f4] bg-[#f7fbff] px-3 py-2 text-[12px] font-semibold text-[#2d5da8]"
              >
                일반 메뉴 추가
              </button>
              <button
                type="button"
                onClick={() => handleAddRoot("YOUTUBE_PLAYLIST_GROUP")}
                className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155]"
              >
                영상 메뉴 추가
              </button>
            </div>
          </div>
          <div className="max-h-[720px] overflow-y-auto px-3 py-3">
            {flatItems.length === 0 ? (
              <p className="px-3 py-6 text-[13px] text-[#6d7f95]">등록된 메뉴가 없습니다.</p>
            ) : (
              <ul className="space-y-1">
                {flatItems.map(({ node, depth }) => (
                  <li key={node.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(node.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                        selectedId === node.id
                          ? "bg-[#edf4ff] text-[#132033]"
                          : "hover:bg-[#f8fafc] text-[#334155]"
                      }`}
                      style={{ paddingLeft: `${depth * 18 + 12}px` }}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold">{node.label}</span>
                        <span className="mt-0.5 block truncate text-[11px] text-[#8fa3bb]">
                          {MENU_TYPE_LABEL[node.type]}
                        </span>
                      </span>
                      <span className="ml-3 flex items-center gap-2">
                        {node.isAuto && (
                          <span className="rounded-full bg-[#e2e8f0] px-2 py-0.5 text-[10px] font-semibold text-[#475569]">
                            자동
                          </span>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_META[node.status]}`}>
                          {node.status}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="border-b border-[#edf2f7] px-5 py-4">
            <h2 className="text-[14px] font-bold text-[#132033]">상세 편집</h2>
          </div>
          <div className="space-y-4 px-5 py-5">
            {!selectedNode ? (
              <p className="text-[13px] text-[#6d7f95]">왼쪽에서 편집할 메뉴를 선택해 주세요.</p>
            ) : (
              <>
                <div className="grid gap-4">
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-[#334155]">메뉴 이름</span>
                    <input
                      value={selectedNode.label}
                      onChange={(event) =>
                        updateSelectedNode((node) => ({ ...node, label: event.target.value }))
                      }
                      className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                    />
                  </label>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[12px] font-semibold text-[#334155]">Slug</span>
                      {!selectedNode.isAuto && selectedNode.slug.trim().length > 0 && (
                        <button
                          type="button"
                          onClick={() => updateSelectedNode((node) => ({ ...node, slug: "" }))}
                          className="text-[11px] font-semibold text-[#2d5da8]"
                        >
                          자동 생성으로 되돌리기
                        </button>
                      )}
                    </div>
                    <input
                      value={selectedNode.slug}
                      onChange={(event) =>
                        updateSelectedNode((node) => ({ ...node, slug: event.target.value }))
                      }
                      readOnly={selectedNode.isAuto}
                      placeholder="비워두면 저장 시 메뉴명 기준으로 자동 생성됩니다."
                      className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px] read-only:bg-[#f8fafc]"
                    />
                    <p className="text-[11px] leading-5 text-[#6d7f95]">
                      {selectedNode.isAuto
                        ? "자동 생성된 유튜브 메뉴의 slug는 동기화 기준으로 유지됩니다."
                        : "공개 URL에 들어가는 주소 조각입니다. 영문 소문자, 숫자, 하이픈 기준으로 저장되며, 비워두면 서버가 메뉴명에서 자동 생성합니다."}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#334155]">타입</span>
                      <input
                        value={MENU_TYPE_LABEL[selectedNode.type]}
                        readOnly
                        className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-[13px]"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#334155]">상태</span>
                      <select
                        value={selectedNode.status}
                        onChange={(event) =>
                          updateSelectedNode((node) => ({
                            ...node,
                            status: event.target.value as MenuStatus,
                          }))
                        }
                        disabled={selectedNode.status === "ARCHIVED"}
                        className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px] disabled:bg-[#f8fafc]"
                      >
                        {selectedNode.isAuto
                          ? ["DRAFT", "PUBLISHED", "HIDDEN", "ARCHIVED"].map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))
                          : ["DRAFT", "PUBLISHED", "HIDDEN"].map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                      </select>
                    </label>
                  </div>

                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-[#334155]">공개 주소</span>
                    <input
                      value={getPublicRouteSummary(selectedNode, menuById)}
                      readOnly
                      className="w-full rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-[13px] text-[#475569]"
                    />
                  </label>

                  {selectedNode.type === "FOLDER" && selectedNode.parentId === null && (
                    <div className="grid gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => handleAddChild("STATIC")}
                        className="rounded-lg border border-[#d7e3f4] bg-[#f7fbff] px-3 py-2 text-[12px] font-semibold text-[#2d5da8]"
                      >
                        정적 페이지 추가
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddChild("BOARD")}
                        className="rounded-lg border border-[#d7e3f4] bg-[#f7fbff] px-3 py-2 text-[12px] font-semibold text-[#2d5da8]"
                      >
                        게시판 메뉴 추가
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddChild("EXTERNAL_LINK")}
                        className="rounded-lg border border-[#d7e3f4] bg-[#f7fbff] px-3 py-2 text-[12px] font-semibold text-[#2d5da8]"
                      >
                        외부 링크 추가
                      </button>
                    </div>
                  )}

                  {selectedNode.type === "YOUTUBE_PLAYLIST_GROUP" && (
                    <div className="rounded-xl border border-[#eef2f7] bg-[#f8fafc] p-4">
                      <p className="text-[12px] font-semibold text-[#334155]">영상 그룹 안내</p>
                      <p className="mt-2 text-[12px] leading-5 text-[#5d6f86]">
                        유튜브 재생목록은 수동으로 추가하지 않고, 아래 영상 관리 카드에서 그룹에 배정합니다.
                      </p>
                    </div>
                  )}

                  {selectedNode.type === "STATIC" && (
                    <label className="space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#334155]">연결 페이지</span>
                      <select
                        value={selectedNode.staticPageKey ?? ""}
                        onChange={(event) =>
                          updateSelectedNode((node) => ({ ...node, staticPageKey: event.target.value }))
                        }
                        className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                      >
                        {STATIC_PAGE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {selectedNode.type === "BOARD" && (
                    <label className="space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#334155]">게시판 키</span>
                      <input
                        value={selectedNode.boardKey ?? ""}
                        onChange={(event) =>
                          updateSelectedNode((node) => ({ ...node, boardKey: event.target.value }))
                        }
                        className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                      />
                    </label>
                  )}

                  {selectedNode.type === "EXTERNAL_LINK" && (
                    <>
                      <label className="space-y-1.5">
                        <span className="text-[12px] font-semibold text-[#334155]">외부 URL</span>
                        <input
                          value={selectedNode.externalUrl ?? ""}
                          onChange={(event) =>
                            updateSelectedNode((node) => ({ ...node, externalUrl: event.target.value }))
                          }
                          className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                        />
                      </label>
                      <label className="flex items-center gap-2 text-[12px] font-semibold text-[#334155]">
                        <input
                          type="checkbox"
                          checked={selectedNode.openInNewTab}
                          onChange={(event) =>
                            updateSelectedNode((node) => ({ ...node, openInNewTab: event.target.checked }))
                          }
                        />
                        새 탭에서 열기
                      </label>
                    </>
                  )}

                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-[#334155]">상위 메뉴</span>
                    <select
                      value={selectedNode.parentId ?? ""}
                      onChange={(event) => {
                        const rawValue = event.target.value;
                        const nextParentId = rawValue ? Number(rawValue) : null;
                        markDirty(reparentNode(items, selectedNode.id, nextParentId));
                      }}
                      disabled={
                        selectedNode.type === "FOLDER" || selectedNode.type === "YOUTUBE_PLAYLIST_GROUP"
                      }
                      className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px] disabled:bg-[#f8fafc]"
                    >
                      {(selectedNode.type === "FOLDER" || selectedNode.type === "YOUTUBE_PLAYLIST_GROUP") && (
                        <option value="">루트(GNB)</option>
                      )}
                      {selectedNode.type === "YOUTUBE_PLAYLIST" && (
                        <option value="">미분류</option>
                      )}
                      {parentCandidates.map(({ node, depth }) => (
                        <option key={node.id} value={node.id}>
                          {"　".repeat(depth)}
                          {node.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  {(selectedNode.playlistSourceTitle || selectedNode.thumbnailUrl) && (
                    <div className="rounded-xl border border-[#eef2f7] bg-[#f8fafc] p-4">
                      <p className="text-[12px] font-semibold text-[#334155]">유튜브 원본 정보</p>
                      <p className="mt-2 text-[13px] text-[#132033]">
                        원제목: {selectedNode.playlistSourceTitle ?? "-"}
                      </p>
                      <p className="mt-1 text-[12px] text-[#6d7f95]">
                        영상 수: {selectedNode.itemCount ?? 0}개
                      </p>
                      {selectedNode.labelCustomized && (
                        <p className="mt-2 text-[12px] font-semibold text-[#2d5da8]">
                          관리자가 표시 이름을 직접 수정한 메뉴입니다.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-[#edf2f7] pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!canMoveUp) {
                        return;
                      }
                      markDirty(moveNodeWithinSiblings(items, selectedNode.id, -1));
                    }}
                    disabled={!canMoveUp}
                    className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    위로 이동
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!canMoveDown) {
                        return;
                      }
                      markDirty(moveNodeWithinSiblings(items, selectedNode.id, 1));
                    }}
                    disabled={!canMoveDown}
                    className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    아래로 이동
                  </button>
                  {!selectedNode.isAuto && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700"
                    >
                      즉시 삭제
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {renderPlaylistSection("분류 대기", "그룹 지정 후 노출 상태로 바꿀 수 있습니다.", draftPlaylists, "bg-amber-100 text-amber-700")}
      {renderPlaylistSection("노출 중", "사용자 사이트에 공개되는 재생목록입니다.", publishedPlaylists, "bg-emerald-100 text-emerald-700")}
      {renderPlaylistSection("숨김", "운영자가 수동으로 비노출한 재생목록입니다.", hiddenPlaylists, "bg-slate-100 text-slate-600")}
      {renderPlaylistSection("보관", "유튜브에서 사라져 자동 보관된 재생목록입니다.", archivedPlaylists, "bg-rose-100 text-rose-700")}
    </div>
  );
}
