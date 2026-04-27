"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  collectAssetIdsFromTiptapDocument,
  createEmptyTiptapDocument,
  normalizeTiptapDocumentImageMetadata,
  type TiptapDocument,
} from "@/lib/admin-board-editor-content";
import {
  uploadAdminAssetDirect,
  type AdminUploadAssetKind,
  type AdminUploadAssetMetadata,
} from "@/lib/admin-upload-client";
import type {
  AdminBoardPostDetail,
  AdminBoardPostsPage,
  AdminBoardPostSummary,
  AdminBoardSummary,
  BoardPostSavePayload,
} from "@/lib/admin-board-api";
import type { AdminMenuTreeNode } from "@/lib/admin-menu-api";
import { useAdminToast } from "../../components/admin-toast-provider";
import BoardPostEditor from "./board-post-editor";

interface BoardManagementClientProps {
  initialBoards: AdminBoardSummary[];
  initialBoardMenus: AdminMenuTreeNode[];
  initialPosts?: AdminBoardPostSummary[];
  initialPost?: AdminBoardPostDetail | null;
}

type Draft = {
  title: string;
  isPublic: boolean;
  isPinned: boolean;
  contentJson: TiptapDocument | Record<string, unknown>;
  contentHtml: string;
};

type ScreenMode = "list" | "editor";

type BoardPostListItem = AdminBoardPostSummary & {
  boardSlug: string;
  boardMenuId: number;
  boardMenuLabel: string;
};

const BOARD_POSTS_PAGE_SIZE = 100;

function createEmptyDraft(): Draft {
  const contentJson = createEmptyTiptapDocument();
  return {
    title: "",
    isPublic: true,
    isPinned: false,
    contentJson,
    contentHtml: "",
  };
}

function createDraftFromPost(post: AdminBoardPostDetail): Draft {
  return {
    title: post.title ?? "",
    isPublic: post.isPublic ?? false,
    isPinned: post.isPinned ?? false,
    contentJson: post.contentJson ?? createEmptyTiptapDocument(),
    contentHtml: post.contentHtml ?? "",
  };
}

function getAttachmentAssetIds(post: AdminBoardPostDetail) {
  return (post.assets ?? [])
    .filter((asset) => asset.kind === "FILE_ATTACHMENT")
    .map((asset) => asset.id);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

async function requestUploadToken(boardId: string, kind: AdminUploadAssetKind) {
  const response = await fetch("/api/admin/uploads/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kind,
      boardId,
    }),
  });
  const payload = (await response.json()) as { rawToken?: string; message?: string };

  if (!response.ok || !payload.rawToken) {
    throw new Error(payload.message || "업로드 토큰을 발급하지 못했습니다.");
  }

  return payload.rawToken;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function formatBoardMenuOptionLabel(boardMenu: AdminMenuTreeNode) {
  return boardMenu.label;
}

function toBoardPostListItem(
  post: AdminBoardPostSummary,
  boardMenu: AdminMenuTreeNode,
): BoardPostListItem {
  return {
    ...post,
    boardSlug: boardMenu.boardKey ?? "",
    boardMenuId: boardMenu.id,
    boardMenuLabel: boardMenu.label,
  };
}

function sortPostsByUpdatedAt(posts: BoardPostListItem[]) {
  return [...posts].sort((left, right) => {
    if (left.isPinned !== right.isPinned) {
      return left.isPinned ? -1 : 1;
    }

    const leftTime = new Date(left.updatedAt).getTime();
    const rightTime = new Date(right.updatedAt).getTime();
    return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
  });
}

function buildBoardPostsListUrl(
  boardSlug: string,
  options: {
    menuId?: number;
    page?: number;
    size?: number;
    title?: string;
  },
) {
  const params = new URLSearchParams();
  if (options.menuId != null) {
    params.set("menuId", String(options.menuId));
  }
  if (options.page != null) {
    params.set("page", String(options.page));
  }
  if (options.size != null) {
    params.set("size", String(options.size));
  }
  if (options.title && options.title.trim().length > 0) {
    params.set("title", options.title.trim());
  }
  const query = params.size > 0 ? `?${params.toString()}` : "";
  return `/api/admin/boards/${boardSlug}/posts${query}`;
}

export default function BoardManagementClient({
  initialBoards,
  initialBoardMenus,
  initialPosts = [],
  initialPost = null,
}: BoardManagementClientProps) {
  const toast = useAdminToast();
  const boardsBySlug = useMemo(
    () => new Map(initialBoards.map((board) => [board.slug, board])),
    [initialBoards],
  );
  const disconnectedBoardMenus = useMemo(
    () =>
      initialBoardMenus.filter(
        (boardMenu) =>
          boardMenu.type === "BOARD" &&
          Boolean(boardMenu.boardKey) &&
          !boardMenu.isAuto &&
          !boardsBySlug.has(boardMenu.boardKey ?? ""),
      ),
    [boardsBySlug, initialBoardMenus],
  );
  const boardMenus = useMemo(
    () =>
      initialBoardMenus.filter(
        (boardMenu) =>
          boardMenu.type === "BOARD" &&
          Boolean(boardMenu.boardKey) &&
          !boardMenu.isAuto &&
          boardsBySlug.has(boardMenu.boardKey ?? ""),
      ),
    [boardsBySlug, initialBoardMenus],
  );
  const initialMenuId = boardMenus[0]?.id ?? 0;
  const [screenMode, setScreenMode] = useState<ScreenMode>("list");
  const [selectedMenuId, setSelectedMenuId] = useState(initialMenuId);
  const [posts, setPosts] = useState<BoardPostListItem[]>(() => {
    const firstMenu = boardMenus[0] ?? null;
    return firstMenu ? initialPosts.map((post) => toBoardPostListItem(post, firstMenu)) : [];
  });
  const [selectedPostId, setSelectedPostId] = useState<string | null>(initialPost?.id ?? null);
  const [draft, setDraft] = useState<Draft>(initialPost ? createDraftFromPost(initialPost) : createEmptyDraft());
  const [attachmentAssetIds, setAttachmentAssetIds] = useState<string[]>(initialPost ? getAttachmentAssetIds(initialPost) : []);
  const [loading, setLoading] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [, setNotice] = useState<string | null>(null);
  const [boardMenuFilter, setBoardMenuFilter] = useState("ALL");
  const [titleQuery, setTitleQuery] = useState("");
  const [appliedBoardMenu, setAppliedBoardMenu] = useState("ALL");
  const [appliedTitle, setAppliedTitle] = useState("");
  const [listReloadTick, setListReloadTick] = useState(0);

  // 브라우저 뒤로가기로 editor → list 복귀를 위한 히스토리 추적
  const editorPushedRef = useRef(false);
  const pendingNoticeRef = useRef<string | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      if (!editorPushedRef.current) return;
      editorPushedRef.current = false;
      const msg = pendingNoticeRef.current;
      pendingNoticeRef.current = null;
      setScreenMode("list");
      setSelectedPostId(null);
      setDraft(createEmptyDraft());
      setAttachmentAssetIds([]);
      setError(null);
      setNotice(msg);
      if (msg) {
        toast.success(msg);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [toast]);

  const selectedBoardMenu = useMemo(
    () => boardMenus.find((boardMenu) => boardMenu.id === selectedMenuId) ?? boardMenus[0] ?? null,
    [boardMenus, selectedMenuId],
  );

  const selectedBoard = useMemo(
    () => initialBoards.find((board) => board.slug === selectedBoardMenu?.boardKey) ?? null,
    [initialBoards, selectedBoardMenu],
  );

  const filteredPosts = posts;

  const handleBoardSearch = () => {
    setAppliedBoardMenu(boardMenuFilter);
    setAppliedTitle(titleQuery);
  };

  const savePayload = useMemo<BoardPostSavePayload>(() => {
    const contentJson = normalizeTiptapDocumentImageMetadata(draft.contentJson);

    return {
      menuId: selectedMenuId,
      title: (draft.title ?? "").trim(),
      contentJson,
      contentHtml: draft.contentHtml,
      isPublic: draft.isPublic,
      isPinned: draft.isPinned,
      assetIds: [...new Set([
        ...collectAssetIdsFromTiptapDocument(contentJson),
        ...attachmentAssetIds,
      ])],
    };
  }, [attachmentAssetIds, draft, selectedMenuId]);

  useEffect(() => {
    if (boardMenus.length === 0) {
      setPosts([]);
      return;
    }

    let cancelled = false;

    const loadPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const targetMenus = appliedBoardMenu === "ALL"
          ? boardMenus
          : boardMenus.filter((boardMenu) => String(boardMenu.id) === appliedBoardMenu);
        const groupedPosts = await Promise.all(
          targetMenus.map(async (boardMenu) => {
            if (!boardMenu.boardKey) {
              return [];
            }

            const loadedPosts: BoardPostListItem[] = [];
            let page = 0;

            while (true) {
              const response = await fetch(
                buildBoardPostsListUrl(boardMenu.boardKey, {
                  menuId: boardMenu.id,
                  page,
                  size: BOARD_POSTS_PAGE_SIZE,
                  title: appliedTitle,
                }),
              );
              const payload = (await response.json()) as AdminBoardPostsPage & { message?: string };

              if (!response.ok) {
                throw new Error(payload.message || "게시글 목록을 불러오지 못했습니다.");
              }

              loadedPosts.push(...(payload.posts ?? []).map((post) => toBoardPostListItem(post, boardMenu)));

              if (!payload.hasNext) {
                break;
              }

              page += 1;
            }

            return loadedPosts;
          }),
        );

        if (cancelled) {
          return;
        }

        setPosts(sortPostsByUpdatedAt(groupedPosts.flat()));
      } catch (loadError) {
        if (!cancelled) {
          const message = getErrorMessage(loadError, "게시글 목록을 불러오지 못했습니다.");
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPosts();

    return () => {
      cancelled = true;
    };
  }, [appliedBoardMenu, appliedTitle, boardMenus, listReloadTick, toast]);

  useEffect(() => {
    if (screenMode !== "editor" || !selectedBoardMenu?.boardKey || !selectedMenuId || !selectedPostId) {
      return;
    }

    let cancelled = false;

    const loadPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/boards/${selectedBoardMenu.boardKey}/posts/${selectedPostId}?menuId=${selectedMenuId}`);
        const payload = (await response.json()) as AdminBoardPostDetail & { message?: string };

        if (!response.ok) {
          throw new Error(payload.message || "게시글 상세를 불러오지 못했습니다.");
        }

        if (cancelled) {
          return;
        }

        setDraft(createDraftFromPost(payload));
        setAttachmentAssetIds(getAttachmentAssetIds(payload));
      } catch (loadError) {
        if (!cancelled) {
          const message = getErrorMessage(loadError, "게시글 상세를 불러오지 못했습니다.");
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPost();

    return () => {
      cancelled = true;
    };
  }, [screenMode, selectedBoardMenu, selectedMenuId, selectedPostId, toast]);

  const handleUpload = async (file: File): Promise<AdminUploadAssetMetadata> => {
    if (!selectedBoard) {
      throw new Error("이미지를 업로드할 게시판 메뉴를 먼저 선택해 주세요.");
    }

    const rawToken = await requestUploadToken(selectedBoard.id, "INLINE_IMAGE");
    return uploadAdminAssetDirect({
      file,
      kind: "INLINE_IMAGE",
      rawToken,
    });
  };

  const handleAttachmentUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    if (!selectedBoard) {
      const message = "첨부 파일을 업로드할 게시판 메뉴를 먼저 선택해 주세요.";
      setError(message);
      toast.error(message);
      return;
    }

    setUploadingAttachment(true);
    setError(null);
    setNotice(null);

    try {
      const uploadedAssetIds: string[] = [];

      for (const file of Array.from(files)) {
        const rawToken = await requestUploadToken(selectedBoard.id, "FILE_ATTACHMENT");
        const asset = await uploadAdminAssetDirect({
          file,
          kind: "FILE_ATTACHMENT",
          rawToken,
        });
        uploadedAssetIds.push(asset.assetId);
      }

      setAttachmentAssetIds((current) => Array.from(new Set([...current, ...uploadedAssetIds])));
      setNotice("첨부 파일을 저장용 자산으로 업로드했습니다.");
      toast.success("첨부 파일을 저장용 자산으로 업로드했습니다.");
    } catch (uploadError) {
      const message = getErrorMessage(uploadError, "첨부 파일 업로드에 실패했습니다.");
      setError(message);
      toast.error(message);
    } finally {
      setUploadingAttachment(false);
    }
  };

  const openNewPost = () => {
    const preferredMenu = boardMenuFilter === "ALL"
      ? boardMenus[0]
      : boardMenus.find((boardMenu) => String(boardMenu.id) === boardMenuFilter) ?? boardMenus[0];

    setSelectedMenuId(preferredMenu?.id ?? 0);
    setSelectedPostId(null);
    setDraft(createEmptyDraft());
    setAttachmentAssetIds([]);
    setScreenMode("editor");
    setError(null);
    setNotice("새 게시글 작성 모드입니다.");
    toast.info("새 게시글 작성 모드입니다.");
    window.history.pushState({ boardEditor: true }, "");
    editorPushedRef.current = true;
  };

  const openPost = (post: BoardPostListItem) => {
    setSelectedMenuId(post.boardMenuId);
    setSelectedPostId(post.id);
    setScreenMode("editor");
    setError(null);
    setNotice(null);
    window.history.pushState({ boardEditor: true }, "");
    editorPushedRef.current = true;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      if (!selectedBoard || !selectedBoardMenu) {
        throw new Error("게시판 메뉴를 선택해 주세요.");
      }

      if (!savePayload.title) {
        throw new Error("게시글 제목을 입력해 주세요.");
      }

      const response = selectedPostId
        ? await fetch(`/api/admin/boards/${selectedBoard.slug}/posts/${selectedPostId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(savePayload),
          })
        : await fetch(`/api/admin/boards/${selectedBoard.slug}/posts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(savePayload),
          });
      const payload = (await response.json()) as AdminBoardPostDetail & { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "게시글을 저장하지 못했습니다.");
      }

      setPosts((current) => {
        const nextPost = toBoardPostListItem(payload, selectedBoardMenu);
        const exists = current.some((post) => post.id === payload.id);
        return sortPostsByUpdatedAt(
          exists
            ? current.map((post) => (post.id === payload.id ? nextPost : post))
            : [nextPost, ...current],
        );
      });
      setListReloadTick((current) => current + 1);
      if (editorPushedRef.current) {
        pendingNoticeRef.current = "게시글을 저장했습니다.";
        window.history.back(); // popstate가 목록 복귀 처리
      } else {
        setSelectedPostId(null);
        setDraft(createEmptyDraft());
        setAttachmentAssetIds([]);
        setScreenMode("list");
        setNotice("게시글을 저장했습니다.");
        toast.success("게시글을 저장했습니다.");
      }
    } catch (saveError) {
      const message = getErrorMessage(saveError, "게시글을 저장하지 못했습니다.");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBoard || !selectedPostId) {
      return;
    }

    const confirmed = window.confirm("이 게시글을 삭제하시겠습니까?");
    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(
        `/api/admin/boards/${selectedBoard.slug}/posts/${selectedPostId}?menuId=${selectedMenuId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message || "게시글을 삭제하지 못했습니다.");
      }

      setPosts((current) => current.filter((post) => post.id !== selectedPostId));
      setListReloadTick((current) => current + 1);
      setSelectedPostId(null);
      setDraft(createEmptyDraft());
      setAttachmentAssetIds([]);
      if (editorPushedRef.current) {
        pendingNoticeRef.current = "게시글을 삭제했습니다.";
        window.history.back();
      } else {
        setScreenMode("list");
        setNotice("게시글을 삭제했습니다.");
        toast.success("게시글을 삭제했습니다.");
      }
    } catch (deleteError) {
      const message = getErrorMessage(deleteError, "게시글을 삭제하지 못했습니다.");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (screenMode === "list") {
    return (
      <div className="space-y-4">
        {/* ── 필터 ── */}
        <section className="rounded-2xl border border-[#dbe4f0] bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1.5" style={{ minWidth: "160px" }}>
              <span className="text-[11px] font-semibold text-[#55697f]">게시판</span>
              <select
                value={boardMenuFilter}
                onChange={(event) => setBoardMenuFilter(event.target.value)}
                className="h-9 rounded-lg border border-[#d5deea] bg-white px-3 text-[13px] focus:border-[#3f74c7] focus:outline-none"
              >
                <option value="ALL">전체</option>
                {boardMenus.map((boardMenu) => (
                  <option key={boardMenu.id} value={boardMenu.id}>
                    {boardMenu.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-w-0 flex-1 flex-col gap-1.5" style={{ minWidth: "180px" }}>
              <span className="text-[11px] font-semibold text-[#55697f]">제목 검색</span>
              <input
                value={titleQuery}
                onChange={(event) => setTitleQuery(event.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBoardSearch()}
                placeholder="게시글 제목을 입력하세요"
                className="h-9 rounded-lg border border-[#d5deea] px-3 text-[13px] focus:border-[#3f74c7] focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={handleBoardSearch}
              className="h-9 rounded-lg bg-[#3f74c7] px-5 text-[13px] font-semibold text-white transition hover:bg-[#4a82d7]"
            >
              검색
            </button>
          </div>
          {disconnectedBoardMenus.length > 0 && (
            <p className="mt-3 rounded-lg bg-[#fff7ed] px-3 py-2 text-[12px] text-[#9a3412]">
              연결 게시판이 사라진 메뉴 {disconnectedBoardMenus.length}개는 목록에서 제외했습니다.
              메뉴 관리에서 저장하면 메뉴 전용 게시판이 다시 생성됩니다.
            </p>
          )}
        </section>

        {/* ── 테이블 ── */}
        <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#edf2f7] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[#5d6f86]">
                <span className="font-semibold text-[#132033]">{filteredPosts.length}</span>건 표시
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openNewPost}
                disabled={boardMenus.length === 0}
                className="h-9 rounded-lg bg-[#3f74c7] px-4 text-[13px] font-semibold text-white transition hover:bg-[#4a82d7] disabled:opacity-60"
              >
                새 게시글 등록
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                  {["번호", "게시판", "제목", "공개", "고정", "수정일", ""].map((h) => (
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[13px] text-[#6d7f95]">
                      로딩 중...
                    </td>
                  </tr>
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[13px] text-[#6d7f95]">
                      조건에 맞는 게시글이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post, idx) => (
                    <tr
                      key={`${post.boardMenuId}-${post.id}`}
                      className="border-b border-[#f0f4f8] last:border-0 transition hover:bg-[#fafcff]"
                    >
                      <td className="px-5 py-4 text-[13px] text-[#5d6f86]">{idx + 1}</td>
                      <td className="px-5 py-4 text-[12px] text-[#5d6f86]">{post.boardMenuLabel}</td>
                      <td className="px-5 py-4">
                        <p className="max-w-[300px] truncate text-[13px] font-semibold text-[#132033]">
                          {post.title}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            post.isPublic
                              ? "bg-[#ecfdf5] text-[#047857]"
                              : "bg-[#f8fafc] text-[#64748b]"
                          }`}
                        >
                          {post.isPublic ? "공개" : "비공개"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {post.isPinned ? (
                          <span className="rounded-full bg-[#fff7ed] px-2.5 py-0.5 text-[10px] font-semibold text-[#c2410c]">
                            고정
                          </span>
                        ) : (
                          <span className="text-[12px] text-[#c0cbd8]">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-[12px] text-[#5d6f86]">
                        {formatDate(post.updatedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => openPost(post)}
                          className="inline-flex h-8 items-center rounded-lg border border-[#bfd0ea] bg-[#edf4ff] px-3 text-[12px] font-medium text-[#2d5da8] transition hover:bg-[#e4efff]"
                        >
                          편집
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

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf2f7] px-5 py-4">
          <div>
            <h2 className="text-[15px] font-bold text-[#132033]">{selectedPostId ? "게시글 상세" : "새 게시글 작성"}</h2>
            <p className="mt-1 text-[12px] text-[#6d7f95]">상세와 새 게시글 작성은 같은 편집 화면에서 관리합니다.</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedPostId ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-[12px] font-semibold text-[#b42318] disabled:opacity-60"
              >
                삭제
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (editorPushedRef.current) {
                  window.history.back(); // popstate가 목록 복귀 처리
                } else {
                  setScreenMode("list");
                  setSelectedPostId(null);
                  setDraft(createEmptyDraft());
                  setAttachmentAssetIds([]);
                  setError(null);
                  setNotice(null);
                }
              }}
              className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155]"
            >
              목록으로
            </button>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          <label className="space-y-1.5">
            <span className="text-[12px] font-semibold text-[#334155]">게시판</span>
            <select
              value={selectedMenuId}
              onChange={(event) => {
                setSelectedMenuId(Number(event.target.value));
                setSelectedPostId(null);
                setDraft(createEmptyDraft());
                setAttachmentAssetIds([]);
                setError(null);
              }}
              disabled={Boolean(selectedPostId)}
              className="w-full rounded-lg border border-[#d5deea] bg-white px-3 py-2 text-[13px] font-semibold text-[#334155] disabled:bg-[#f8fafc]"
            >
              {boardMenus.map((boardMenu) => (
                <option key={boardMenu.id} value={boardMenu.id}>
                  {formatBoardMenuOptionLabel(boardMenu)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-[12px] font-semibold text-[#334155]">제목</span>
            <input
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
            />
          </label>

          <fieldset className="rounded-xl border border-[#eef2f7] bg-[#f8fafc] px-4 py-3">
            <legend className="text-[13px] font-semibold text-[#334155]">공개 여부</legend>
            <div className="mt-3 flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#334155]">
                <input
                  type="radio"
                  name="board-post-visibility"
                  checked={draft.isPublic}
                  onChange={() => setDraft((prev) => ({ ...prev, isPublic: true }))}
                />
                공개
              </label>
              <label className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#334155]">
                <input
                  type="radio"
                  name="board-post-visibility"
                  checked={!draft.isPublic}
                  onChange={() => setDraft((prev) => ({ ...prev, isPublic: false }))}
                />
                비공개
              </label>
            </div>
          </fieldset>

          <label className="flex items-center gap-2 rounded-xl border border-[#eef2f7] bg-[#f8fafc] px-4 py-3 text-[13px] font-semibold text-[#334155]">
            <input
              type="checkbox"
              checked={draft.isPinned}
              onChange={(event) => setDraft((prev) => ({ ...prev, isPinned: event.target.checked }))}
            />
            상단 고정
          </label>

          <BoardPostEditor
            value={draft.contentJson}
            onImageUpload={handleUpload}
            onChange={(contentJson, contentHtml) => {
              setDraft((prev) => ({
                ...prev,
                contentJson,
                contentHtml,
              }));
            }}
            disabled={saving}
          />

          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#eef2f7] bg-[#f8fafc] px-4 py-3">
            <label className="inline-flex cursor-pointer items-center rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155]">
              첨부 파일 업로드
              <input
                type="file"
                multiple
                className="sr-only"
                disabled={saving || uploadingAttachment}
                onChange={(event) => {
                  void handleAttachmentUpload(event.target.files).catch((uploadError) => {
                    const message = getErrorMessage(uploadError, "첨부 파일 업로드에 실패했습니다.");
                    setError(message);
                    toast.error(message);
                  });
                  event.target.value = "";
                }}
              />
            </label>
            <span className="text-[12px] text-[#6d7f95]">저장 대상 첨부 파일 {attachmentAssetIds.length}개</span>
            {uploadingAttachment && <span className="text-[12px] text-[#6d7f95]">첨부 파일 업로드 중...</span>}
          </div>

          <div className="flex justify-end gap-2 border-t border-[#edf2f7] pt-4">
            <button
              type="button"
              onClick={() => {
                if (editorPushedRef.current) {
                  window.history.back(); // popstate가 목록 복귀 처리
                } else {
                  setScreenMode("list");
                  setSelectedPostId(null);
                  setDraft(createEmptyDraft());
                  setAttachmentAssetIds([]);
                }
              }}
              className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#3f74c7] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
            >
              {saving ? "저장 중..." : "게시글 저장"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
