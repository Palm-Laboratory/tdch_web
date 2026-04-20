"use client";

import { useEffect, useMemo, useState } from "react";

import {
  collectAssetIdsFromTiptapDocument,
  createEmptyTiptapDocument,
  type TiptapDocument,
} from "@/lib/admin-board-editor-content";
import {
  uploadAdminAssetDirect,
  type AdminUploadAssetKind,
  type AdminUploadAssetMetadata,
} from "@/lib/admin-upload-client";
import type {
  AdminBoardPostDetail,
  AdminBoardPostSummary,
  AdminBoardSummary,
  BoardPostSavePayload,
} from "@/lib/admin-board-api";
import BoardPostEditor from "./board-post-editor";

interface BoardManagementClientProps {
  initialBoards: AdminBoardSummary[];
  initialPosts?: AdminBoardPostSummary[];
  initialPost?: AdminBoardPostDetail | null;
}

type Draft = {
  title: string;
  isPublic: boolean;
  contentJson: TiptapDocument | Record<string, unknown>;
  contentHtml: string;
};

function createEmptyDraft(): Draft {
  const contentJson = createEmptyTiptapDocument();
  return {
    title: "",
    isPublic: false,
    contentJson,
    contentHtml: "",
  };
}

function createDraftFromPost(post: AdminBoardPostDetail): Draft {
  return {
    title: post.title,
    isPublic: post.isPublic,
    contentJson: post.contentJson,
    contentHtml: post.contentHtml,
  };
}

function getAttachmentAssetIds(post: AdminBoardPostDetail) {
  return post.assets
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

export default function BoardManagementClient({
  initialBoards,
  initialPosts = [],
  initialPost = null,
}: BoardManagementClientProps) {
  const [selectedBoardSlug, setSelectedBoardSlug] = useState(initialBoards[0]?.slug ?? "");
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(initialPost?.id ?? initialPosts[0]?.id ?? null);
  const [draft, setDraft] = useState<Draft>(initialPost ? createDraftFromPost(initialPost) : createEmptyDraft());
  const [attachmentAssetIds, setAttachmentAssetIds] = useState<string[]>(initialPost ? getAttachmentAssetIds(initialPost) : []);
  const [loading, setLoading] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const selectedBoard = useMemo(
    () => initialBoards.find((board) => board.slug === selectedBoardSlug) ?? initialBoards[0] ?? null,
    [initialBoards, selectedBoardSlug],
  );

  const savePayload = useMemo<BoardPostSavePayload>(() => ({
    title: draft.title.trim(),
    contentJson: draft.contentJson,
    contentHtml: draft.contentHtml,
    isPublic: draft.isPublic,
    assetIds: [...new Set([
      ...collectAssetIdsFromTiptapDocument(draft.contentJson),
      ...attachmentAssetIds,
    ])],
  }), [attachmentAssetIds, draft]);

  useEffect(() => {
    if (!selectedBoardSlug) {
      setPosts([]);
      setSelectedPostId(null);
      setDraft(createEmptyDraft());
      setAttachmentAssetIds([]);
      return;
    }

    let cancelled = false;

    const loadPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/boards/${selectedBoardSlug}/posts`);
        const payload = (await response.json()) as { posts?: AdminBoardPostSummary[]; message?: string };

        if (!response.ok) {
          throw new Error(payload.message || "게시글 목록을 불러오지 못했습니다.");
        }

        if (cancelled) {
          return;
        }

        const nextPosts = payload.posts ?? [];
        setPosts(nextPosts);
        setSelectedPostId(nextPosts[0]?.id ?? null);
        if (nextPosts.length === 0) {
          setDraft(createEmptyDraft());
          setAttachmentAssetIds([]);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "게시글 목록을 불러오지 못했습니다.");
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
  }, [reloadToken, selectedBoardSlug]);

  useEffect(() => {
    if (!selectedBoardSlug || !selectedPostId) {
      return;
    }

    let cancelled = false;

    const loadPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/boards/${selectedBoardSlug}/posts/${selectedPostId}`);
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
          setError(loadError instanceof Error ? loadError.message : "게시글 상세를 불러오지 못했습니다.");
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
  }, [selectedBoardSlug, selectedPostId]);

  const handleUpload = async (file: File): Promise<AdminUploadAssetMetadata> => {
    if (!selectedBoard) {
      throw new Error("이미지를 업로드할 게시판을 먼저 선택해 주세요.");
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
      setError("첨부 파일을 업로드할 게시판을 먼저 선택해 주세요.");
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
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, "첨부 파일 업로드에 실패했습니다."));
    } finally {
      setUploadingAttachment(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      if (!selectedBoard) {
        throw new Error("게시판을 선택해 주세요.");
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

      setDraft(createDraftFromPost(payload));
      setAttachmentAssetIds(getAttachmentAssetIds(payload));
      setSelectedPostId(payload.id);
      setPosts((current) => {
        const nextPost = {
          id: payload.id,
          boardId: payload.boardId,
          title: payload.title,
          isPublic: payload.isPublic,
          authorId: payload.authorId,
          createdAt: payload.createdAt,
          updatedAt: payload.updatedAt,
        };

        const exists = current.some((post) => post.id === payload.id);
        return exists
          ? current.map((post) => (post.id === payload.id ? nextPost : post))
          : [nextPost, ...current];
      });
      setNotice("게시글을 저장했습니다.");
    } catch (saveError) {
      setError(getErrorMessage(saveError, "게시글을 저장하지 못했습니다."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe4f0] bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-semibold text-[#132033]">게시판</p>
            <p className="mt-1 text-[12px] text-[#6d7f95]">게시판을 선택하고 게시글 목록과 본문을 관리합니다.</p>
          </div>
          <select
            value={selectedBoardSlug}
            onChange={(event) => {
              setSelectedBoardSlug(event.target.value);
              setPosts([]);
              setSelectedPostId(null);
              setDraft(createEmptyDraft());
              setAttachmentAssetIds([]);
              setNotice("선택한 게시판의 게시글을 불러오는 중입니다.");
              setError(null);
            }}
            className="rounded-lg border border-[#d5deea] bg-white px-3 py-2 text-[13px] font-semibold text-[#334155]"
          >
            {initialBoards.map((board) => (
              <option key={board.id} value={board.slug}>
                {board.title}
              </option>
            ))}
          </select>
        </div>
        {notice && <p className="mt-3 text-[12px] text-[#2d5da8]">{notice}</p>}
        {error && <p className="mt-3 text-[12px] text-[#be123c]">오류: {error}</p>}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(520px,1.15fr)]">
        <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#edf2f7] px-5 py-4">
            <div>
              <h2 className="text-[14px] font-bold text-[#132033]">게시글 목록</h2>
              <p className="mt-1 text-[12px] text-[#6d7f95]">전체 {posts.length}건</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setReloadToken((current) => current + 1);
                setNotice("게시글 목록을 다시 불러옵니다.");
              }}
              className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155]"
            >
              목록 불러오기
            </button>
          </div>
          <div className="max-h-[640px] overflow-y-auto px-3 py-3">
            {loading && <p className="px-3 py-3 text-[12px] text-[#6d7f95]">로딩 중...</p>}
            {posts.length === 0 ? (
              <p className="px-3 py-10 text-[13px] text-[#6d7f95]">게시글 목록이 비어 있습니다.</p>
            ) : (
              <ul className="space-y-2">
                {posts.map((post) => {
                  const active = post.id === selectedPostId;
                  return (
                    <li key={post.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPostId(post.id);
                          setError(null);
                        }}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                          active
                            ? "border-[#b9d1f7] bg-[#edf4ff]"
                            : "border-[#edf2f7] bg-white hover:bg-[#fafcff]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="min-w-0 truncate text-[13px] font-semibold text-[#132033]">{post.title}</p>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            post.isPublic ? "bg-[#ecfdf5] text-[#047857]" : "bg-[#f8fafc] text-[#64748b]"
                          }`}>
                            {post.isPublic ? "공개" : "비공개"}
                          </span>
                        </div>
                        <p className="mt-2 text-[12px] text-[#6d7f95]">수정일: {formatDate(post.updatedAt)}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#edf2f7] px-5 py-4">
            <div>
              <h2 className="text-[14px] font-bold text-[#132033]">게시글 편집</h2>
              <p className="mt-1 text-[12px] text-[#6d7f95]">
                {selectedBoard ? selectedBoard.title : "게시판 없음"}
              </p>
            </div>
            {saving && <span className="text-[12px] text-[#6d7f95]">저장 중...</span>}
          </div>

          <div className="space-y-5 px-5 py-5">
            <label className="space-y-1.5">
              <span className="text-[12px] font-semibold text-[#334155]">제목</span>
              <input
                value={draft.title}
                onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
              />
            </label>

            <label className="flex items-center gap-2 rounded-xl border border-[#eef2f7] bg-[#f8fafc] px-4 py-3 text-[13px] font-semibold text-[#334155]">
              <input
                type="checkbox"
                checked={draft.isPublic}
                onChange={(event) => setDraft((prev) => ({ ...prev, isPublic: event.target.checked }))}
              />
              공개 게시글로 노출
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
                      setError(getErrorMessage(uploadError, "첨부 파일 업로드에 실패했습니다."));
                    });
                    event.target.value = "";
                  }}
                />
              </label>
              <span className="text-[12px] text-[#6d7f95]">
                저장 대상 첨부 파일 {attachmentAssetIds.length}개
              </span>
              {uploadingAttachment && <span className="text-[12px] text-[#6d7f95]">첨부 파일 업로드 중...</span>}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-[#edf2f7] pt-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedPostId(null);
                  setDraft(createEmptyDraft());
                  setAttachmentAssetIds([]);
                  setError(null);
                  setNotice("새 게시글 작성 모드입니다.");
                }}
                className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155]"
              >
                새 게시글
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
    </div>
  );
}
