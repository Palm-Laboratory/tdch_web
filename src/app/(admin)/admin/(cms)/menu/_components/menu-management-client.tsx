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

const STATUS_LABEL: Record<MenuStatus, string> = {
  DRAFT: "분류 대기",
  PUBLISHED: "공개",
  HIDDEN: "숨김",
  ARCHIVED: "보관",
};

const MANAGED_STATUS_OPTIONS: Array<{ value: Extract<MenuStatus, "PUBLISHED" | "HIDDEN">; label: string }> = [
  { value: "PUBLISHED", label: STATUS_LABEL.PUBLISHED },
  { value: "HIDDEN", label: STATUS_LABEL.HIDDEN },
];

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
    status: !node.isAuto && node.status === "DRAFT" ? "HIDDEN" : node.status,
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

function buildNewNode(id: number, type: MenuType): EditorNode {
  return {
    id,
    type,
    status: "HIDDEN",
    label: "새 메뉴",
    slug: "",
    isAuto: false,
    labelCustomized: false,
    slugCustomized: false,
    staticPageKey: type === "STATIC" ? "about.greeting" : null,
    boardKey: null,
    boardTypeId: null,
    boardTypeKey: null,
    boardTypeLabel: null,
    externalUrl: type === "EXTERNAL_LINK" ? "https://example.com" : null,
    openInNewTab: type === "EXTERNAL_LINK",
    playlistTitle: null,
    playlistSourceTitle: null,
    thumbnailUrl: null,
    itemCount: null,
    syncStatus: null,
    playlistContentForm: type === "YOUTUBE_PLAYLIST" ? "LONGFORM" : null,
    parentId: null,
    children: [],
  };
}

function hideNodeTree(node: EditorNode): EditorNode {
  return {
    ...node,
    status: node.status === "ARCHIVED" ? node.status : "HIDDEN",
    children: node.children.map(hideNodeTree),
  };
}

function buildVideoNodePath(node: EditorNode, menuById: Map<number, EditorNode>): string {
  const segments: string[] = [];
  let current: EditorNode | undefined = node;

  while (current) {
    segments.push(current.slug || "(저장 시 자동 생성)");
    current = current.parentId ? menuById.get(current.parentId) : undefined;
  }

  return `/${segments.reverse().join("/")}`;
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
      if (!node.parentId) {
        return "상위 메뉴를 먼저 선택해 주세요";
      }
      return node.slug
        ? `/${menuById.get(node.parentId)?.slug ?? "root"}/${node.slug}`
        : `/${menuById.get(node.parentId)?.slug ?? "root"}/(저장 시 자동 생성)`;
    case "YOUTUBE_PLAYLIST":
      return buildVideoNodePath(node, menuById);
    case "EXTERNAL_LINK":
      return node.externalUrl ?? "외부 URL을 입력해 주세요";
    case "FOLDER":
    case "YOUTUBE_PLAYLIST_GROUP":
      return "첫 번째 하위 메뉴로 이동";
  }
}

function isManualSlugMode(node: EditorNode): boolean {
  return node.isAuto ? node.slugCustomized : node.slugCustomized || node.slug.trim().length > 0;
}

function getParentRuleDescription(node: EditorNode): string {
  switch (node.type) {
    case "FOLDER":
      return "일반 메뉴 그룹은 최상위 GNB에만 배치됩니다. 하위에는 정적 페이지, 게시판, 외부 링크를 추가할 수 있습니다.";
    case "YOUTUBE_PLAYLIST_GROUP":
      return "영상 그룹은 최상위 GNB에만 배치됩니다. 유튜브 재생목록을 묶는 전용 그룹입니다.";
    case "YOUTUBE_PLAYLIST":
      return "유튜브 재생목록은 최상위 영상 그룹 아래에만 배치할 수 있습니다.";
    case "STATIC":
    case "BOARD":
    case "EXTERNAL_LINK":
      return "정적 페이지, 게시판, 외부 링크는 최상위 일반 메뉴 그룹 아래에만 배치할 수 있습니다.";
  }
}

// 상태 변경 체크 함수
function buildNodeChangeSignatures(
  nodes: EditorNode[],
  parentId: number | null = null,
): Map<number, string> {
  const signatures = new Map<number, string>();

  nodes.forEach((node, index) => {
    signatures.set(
      node.id,
      JSON.stringify({
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
        parentId,
        order: index,
      }),
    );
    buildNodeChangeSignatures(node.children, node.id).forEach((signature, id) => {
      signatures.set(id, signature);
    });
  });

  return signatures;
}

export default function MenuManagementClient({
  initialItems,
}: {
  initialItems: AdminMenuTreeNode[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<EditorNode[]>(cloneTree(initialItems));
  const [savedItems, setSavedItems] = useState<EditorNode[]>(cloneTree(initialItems));
  const [selectedId, setSelectedId] = useState<number | null>(findInitialSelectedId(initialItems));
  const [tempId, setTempId] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [manualSlugDrafts, setManualSlugDrafts] = useState<Record<number, string>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

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
  const changedMenuIds = useMemo(() => {
    const savedSignatures = buildNodeChangeSignatures(savedItems);

    return new Set(
      Array.from(buildNodeChangeSignatures(items).entries())
        .filter(([id, signature]) => id < 0 || savedSignatures.get(id) !== signature)
        .map(([id]) => id),
    );
  }, [items, savedItems]);
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
  const selectedManualSlugMode = selectedNode ? isManualSlugMode(selectedNode) : false;
  const hiddenStatusAffectsDescendants =
    Boolean(selectedNode) && selectedNode?.parentId === null && descendantIds.size > 0;
  const confirmingSelectedDelete = selectedNode ? deleteConfirmId === selectedNode.id : false;
  const selectedPublicRoute = selectedNode ? getPublicRouteSummary(selectedNode, menuById) : "";
  const canMoveUp = selectedSiblingIndex > 0;
  const canMoveDown =
    selectedSiblingIndex !== -1 && selectedSiblingIndex < siblingNodes.length - 1;
  const selectedOrderLabel = selectedSiblingIndex >= 0
    ? `현재 ${selectedSiblingIndex + 1} / ${siblingNodes.length}번째`
    : "현재 순서를 확인할 수 없습니다.";

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
    setDeleteConfirmId(null);
  };

  const switchSelectedSlugMode = (manual: boolean) => {
    if (!selectedNode) {
      return;
    }

    if (!manual) {
      const currentSlug = selectedNode.slug.trim();
      if (currentSlug) {
        setManualSlugDrafts((prev) => ({
          ...prev,
          [selectedNode.id]: selectedNode.slug,
        }));
      }
      updateSelectedNode((node) => ({
        ...node,
        slug: "",
        slugCustomized: false,
      }));
      return;
    }

    const rememberedSlug = manualSlugDrafts[selectedNode.id] ?? "";
    updateSelectedNode((node) => ({
      ...node,
      slug: node.slug.trim() ? node.slug : rememberedSlug,
      slugCustomized: true,
    }));
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

  const handleRequestDelete = () => {
    if (!selectedNode || selectedNode.isAuto) {
      return;
    }

    if (selectedNode.id < 0) {
      markDirty(removeNode(items, selectedNode.id));
      setSelectedId(null);
      return;
    }

    if (selectedNode.status === "PUBLISHED") {
      setMessage("공개 중인 메뉴는 바로 삭제할 수 없습니다. 먼저 상태를 숨김으로 변경하고 저장한 뒤 삭제해 주세요.");
      setDeleteConfirmId(null);
      return;
    }

    if (dirty) {
      setMessage("저장하지 않은 변경사항이 있습니다. 즉시 삭제 전에 먼저 저장하거나 변경을 정리해 주세요.");
      setDeleteConfirmId(null);
      return;
    }

    setDeleteConfirmId(selectedNode.id);
  };

  const handleConfirmDelete = async () => {
    if (!selectedNode || selectedNode.isAuto || selectedNode.id < 0 || deleteConfirmId !== selectedNode.id) {
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
      setSavedItems(removeNode(savedItems, selectedNode.id));
      setSelectedId(null);
      setDeleteConfirmId(null);
      setMessage("메뉴를 즉시 삭제했습니다.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "메뉴를 삭제하지 못했습니다.");
      setDeleteConfirmId(null);
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

      const nextItems = cloneTree(payload.items);
      setItems(nextItems);
      setSavedItems(nextItems);
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

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#dbe4f0] bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-semibold text-[#132033]">
              메뉴 구조 편집
            </p>
            <p className="mt-1 text-[12px] text-[#6d7f95]">
              공개 사이트의 메뉴 그룹, 페이지 연결, 노출 상태와 순서를 관리합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <section className="flex max-h-[calc(100vh-220px)] min-h-[520px] flex-col rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
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
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
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
                        {changedMenuIds.has(node.id) && (
                          <span className="rounded-full bg-[#fff4d6] px-2 py-0.5 text-[10px] font-semibold text-[#9a5b00]">
                            {node.id < 0 ? "신규" : "수정됨"}
                          </span>
                        )}
                        {node.isAuto && (
                          <span className="rounded-full bg-[#e2e8f0] px-2 py-0.5 text-[10px] font-semibold text-[#475569]">
                            자동
                          </span>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_META[node.status]}`}>
                          {STATUS_LABEL[node.status]}
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
                <div className="grid gap-5">
                  <div className="space-y-4 rounded-xl border border-[#eef2f7] bg-[#fbfdff] p-4">
                    <div>
                      <h3 className="text-[12px] font-bold text-[#132033]">기본 정보</h3>
                      <p className="mt-1 text-[11px] text-[#6d7f95]">관리자와 사용자 사이트에 표시되는 기본 속성입니다.</p>
                    </div>

                    <label className="space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#334155]">메뉴 이름</span>
                      <input
                        value={selectedNode.label}
                        onChange={(event) =>
                          updateSelectedNode((node) => ({ ...node, label: event.target.value }))
                        }
                        className="w-full rounded-lg border border-[#d5deea] bg-white px-3 py-2 text-[13px]"
                      />
                    </label>

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
                          value={selectedNode.status === "DRAFT" ? "" : selectedNode.status}
                          onChange={(event) => {
                            const nextStatus = event.target.value as Extract<MenuStatus, "PUBLISHED" | "HIDDEN">;
                            updateSelectedNode((node) => ({
                              ...(node.parentId === null && nextStatus === "HIDDEN" ? hideNodeTree(node) : node),
                              status: nextStatus,
                            }));
                          }}
                          disabled={selectedNode.status === "ARCHIVED"}
                          className="w-full rounded-lg border border-[#d5deea] bg-white px-3 py-2 text-[13px] disabled:bg-[#f8fafc]"
                        >
                          {selectedNode.status === "DRAFT" && (
                            <option value="" disabled>
                              {STATUS_LABEL.DRAFT}
                            </option>
                          )}
                          {selectedNode.status === "ARCHIVED" && (
                            <option value="ARCHIVED">
                              {STATUS_LABEL.ARCHIVED}
                            </option>
                          )}
                          {MANAGED_STATUS_OPTIONS.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                        {hiddenStatusAffectsDescendants && (
                          <p className="text-[11px] leading-5 text-[#9a5b00]">
                            이 루트 메뉴를 숨기면 하위 메뉴 {descendantIds.size}개도 함께 숨김 처리됩니다.
                          </p>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-xl border border-[#eef2f7] bg-[#fbfdff] p-4">
                    <div>
                      <h3 className="text-[12px] font-bold text-[#132033]">공개 경로</h3>
                      <p className="mt-1 text-[11px] text-[#6d7f95]">사이트에서 접근할 URL 경로를 확인하고 조정합니다.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-semibold text-[#334155]">URL 경로</span>
                          <span className="rounded-full bg-[#e8f0fb] px-2 py-0.5 text-[10px] font-semibold text-[#2d5da8]">
                            {selectedManualSlugMode ? "직접 입력" : "자동 생성"}
                          </span>
                        </div>
                        <div className="inline-flex rounded-lg border border-[#d5deea] bg-white p-0.5">
                          <button
                            type="button"
                            onClick={() => switchSelectedSlugMode(false)}
                            className={`rounded-md px-3 py-1.5 text-[11px] font-semibold ${
                              selectedManualSlugMode
                                ? "text-[#64748b] hover:bg-[#f8fafc]"
                                : "bg-[#3f74c7] text-white"
                            }`}
                          >
                            자동
                          </button>
                          <button
                            type="button"
                            onClick={() => switchSelectedSlugMode(true)}
                            className={`rounded-md px-3 py-1.5 text-[11px] font-semibold ${
                              selectedManualSlugMode
                                ? "bg-[#3f74c7] text-white"
                                : "text-[#64748b] hover:bg-[#f8fafc]"
                            }`}
                          >
                            직접 입력
                          </button>
                        </div>
                      </div>
                      <input
                        value={selectedNode.slug}
                        onChange={(event) =>
                          updateSelectedNode((node) => ({
                            ...node,
                            slug: event.target.value,
                            slugCustomized: true,
                          }))
                        }
                        disabled={!selectedManualSlugMode}
                        placeholder="비워두면 저장 시 메뉴명 기준으로 자동 생성됩니다."
                        className="w-full rounded-lg border border-[#d5deea] bg-white px-3 py-2 text-[13px] disabled:bg-[#f8fafc] disabled:text-[#94a3b8]"
                      />
                      <p className="text-[11px] leading-5 text-[#6d7f95]">
                        {selectedManualSlugMode
                          ? selectedNode.isAuto
                            ? "저장 후 유튜브 동기화가 실행되어도 이 URL 경로를 유지합니다."
                            : "입력한 값이 공개 URL에 사용됩니다. 비워두면 저장 시 자동 생성 모드로 돌아갑니다."
                          : selectedNode.isAuto
                            ? "유튜브 원제목 기준으로 URL 경로가 동기화됩니다. 고정하려면 직접 입력으로 전환하세요."
                            : "저장 시 메뉴 이름 기준으로 URL 경로가 자동 생성됩니다."}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#334155]">공개 주소</span>
                      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2">
                        <code className="min-w-0 flex-1 break-all text-[13px] text-[#475569]">
                          {selectedPublicRoute}
                        </code>
                      </div>
                      <p className="text-[11px] leading-5 text-[#6d7f95]">
                        저장 전 자동 생성 경로는 저장 후 서버에서 확정됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-xl border border-[#eef2f7] bg-[#fbfdff] p-4">
                    <div>
                      <h3 className="text-[12px] font-bold text-[#132033]">연결 대상</h3>
                      <p className="mt-1 text-[11px] text-[#6d7f95]">메뉴가 열어야 할 페이지, 게시판, 외부 링크 또는 영상 정보를 설정합니다.</p>
                    </div>

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
                      <div className="rounded-xl border border-[#eef2f7] bg-white p-4">
                      <p className="text-[12px] font-semibold text-[#334155]">영상 그룹 안내</p>
                      <p className="mt-2 text-[12px] leading-5 text-[#5d6f86]">
                        유튜브 재생목록은 수동으로 추가하지 않고, 영상 관리에서 동기화하고 그룹에 배정합니다.
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
                          className="w-full rounded-lg border border-[#d5deea] bg-white px-3 py-2 text-[13px]"
                        >
                          {STATIC_PAGE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
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
                            className="w-full rounded-lg border border-[#d5deea] bg-white px-3 py-2 text-[13px]"
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

                    {(selectedNode.playlistSourceTitle || selectedNode.thumbnailUrl) && (
                      <div className="rounded-xl border border-[#eef2f7] bg-white p-4">
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

                  <div className="space-y-4 rounded-xl border border-[#eef2f7] bg-[#fbfdff] p-4">
                    <div>
                      <h3 className="text-[12px] font-bold text-[#132033]">배치와 순서</h3>
                      <p className="mt-1 text-[11px] text-[#6d7f95]">상위 메뉴와 같은 단계 안의 노출 순서를 조정합니다.</p>
                    </div>

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
                        className="w-full rounded-lg border border-[#d5deea] bg-white px-3 py-2 text-[13px] disabled:bg-[#f8fafc]"
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
                      <p className="rounded-lg border border-[#e8edf5] bg-white px-3 py-2 text-[11px] leading-5 text-[#5d6f86]">
                        {getParentRuleDescription(selectedNode)}
                      </p>
                    </label>

                    <div className="flex flex-wrap items-center gap-2">
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
                      <span className="text-[12px] font-semibold text-[#64748b]">
                        {selectedOrderLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-[#edf2f7] pt-4">
                  {!selectedNode.isAuto && (
                    confirmingSelectedDelete ? (
                      <div className="w-full rounded-xl border-2 border-rose-300 bg-rose-50 p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-600 text-[13px] font-black text-white">
                            !
                          </span>
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold text-rose-900">
                              {selectedNode.label} 메뉴를 즉시 삭제합니다.
                            </p>
                            <p className="mt-2 text-[12px] leading-5 text-rose-800">
                              이 작업은 저장 버튼과 별개로 바로 반영됩니다.
                              {descendantIds.size > 0 ? ` 하위 메뉴 ${descendantIds.size}개도 함께 삭제됩니다.` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={handleConfirmDelete}
                            className="rounded-lg bg-rose-700 px-5 py-2.5 text-[13px] font-bold text-white shadow-sm hover:bg-rose-800"
                          >
                            삭제 확정
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-rose-700 hover:bg-rose-50"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestDelete}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700"
                      >
                        즉시 삭제
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

    </div>
  );
}
