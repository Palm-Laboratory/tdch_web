"use client";

import { useActionState, useEffect, useRef, useState, useCallback } from "react";
import type { VideoMetadataFormState } from "../../actions";
import type { AdminVideoWithMetadata } from "@/lib/admin-media-api";

// ── 태그 입력 ────────────────────────────────────────────────────────────────

function TagInput({ defaultTags }: { defaultTags: string[] }) {
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [input, setInput] = useState("");

  const addTag = useCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setInput("");
  }, [tags]);

  const removeTag = useCallback((index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }, [input, tags, addTag, removeTag]);

  return (
    <>
      <input type="hidden" name="tags" value={tags.join(",")} />
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#dde4ef] bg-white px-3 py-2 transition focus-within:border-[#3f74c7] focus-within:ring-2 focus-within:ring-[#3f74c7]/30">
        {tags.map((tag, i) => (
          <span key={`${tag}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-[#edf4ff] px-2.5 py-0.5 text-[12px] font-medium text-[#2d5da8]">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-[#8fa3bb] transition hover:text-red-400"
              aria-label={`태그 "${tag}" 삭제`}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addTag(input); }}
          placeholder={tags.length === 0 ? "태그 입력 후 Enter" : ""}
          className="min-w-[100px] flex-1 border-none bg-transparent py-0.5 text-[13px] text-[#132033] outline-none placeholder:text-[#8fa3bb]"
        />
      </div>
    </>
  );
}

// ── 토글 ─────────────────────────────────────────────────────────────────────

function Toggle({ name, checked, onChange }: { name: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <>
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          checked ? "bg-[#3f74c7]" : "bg-[#d1d5db]"
        }`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`} />
      </button>
    </>
  );
}

// ── 인풋 클래스 ──────────────────────────────────────────────────────────────

const inputCls = "w-full rounded-xl border border-[#dde4ef] bg-white px-4 py-2.5 text-[13px] text-[#132033] outline-none transition focus:border-[#3f74c7] focus:ring-2 focus:ring-[#3f74c7]/30";
const selectCls = "w-full rounded-xl border border-[#dde4ef] bg-white px-4 py-2.5 text-[13px] text-[#132033] outline-none transition focus:border-[#3f74c7] focus:ring-2 focus:ring-[#3f74c7]/30";
const textareaCls = "w-full resize-y rounded-xl border border-[#dde4ef] bg-white px-4 py-2.5 text-[13px] text-[#132033] outline-none transition focus:border-[#3f74c7] focus:ring-2 focus:ring-[#3f74c7]/30";

// ── 스켈레톤 ─────────────────────────────────────────────────────────────────

function DrawerSkeleton() {
  return (
    <div className="space-y-5 px-6 py-5">
      <div className="rounded-xl bg-[#f8fafc] p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-[#e2e8f0]" />
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-[#e2e8f0]" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-[#e2e8f0]" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-[#e2e8f0]" />
        </div>
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-3">
          <div className="h-3 w-20 animate-pulse rounded bg-[#e2e8f0]" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-[#e2e8f0]" />
          <div className="h-3 w-20 animate-pulse rounded bg-[#e2e8f0]" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-[#e2e8f0]" />
        </div>
      ))}
    </div>
  );
}

// ── 확인 다이얼로그 ──────────────────────────────────────────────────────────

function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40" />
      <div className="fixed left-1/2 top-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xl">
        <h3 className="text-[15px] font-bold text-[#0f1c2e]">저장하지 않은 변경사항</h3>
        <p className="mt-2 text-[13px] text-[#5d6f86]">저장하지 않은 변경사항이 있습니다. 닫으시겠습니까?</p>
        <div className="mt-5 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 items-center rounded-lg border border-[#dde4ef] px-4 text-[13px] text-[#5d6f86] transition hover:bg-[#f1f5f9]"
          >
            계속 편집
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-9 items-center rounded-lg bg-red-500 px-4 text-[13px] font-semibold text-white transition hover:bg-red-600"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}

// ── 드로어 메인 ──────────────────────────────────────────────────────────────

interface VideoMetadataDrawerProps {
  open: boolean;
  videoId: string | null;
  siteKey: string;
  onClose: () => void;
  updateAction: (prev: VideoMetadataFormState, formData: FormData) => Promise<VideoMetadataFormState>;
}

export default function VideoMetadataDrawer({
  open,
  videoId,
  siteKey,
  onClose,
  updateAction,
}: VideoMetadataDrawerProps) {
  const [metadata, setMetadata] = useState<AdminVideoWithMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, formAction, isPending] = useActionState<VideoMetadataFormState, FormData>(updateAction, {});

  // Form field state
  const [visible, setVisible] = useState(true);
  const [featured, setFeatured] = useState(false);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handledMessageKeyRef = useRef<number | null>(null);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  // Fetch metadata when videoId changes
  useEffect(() => {
    if (!videoId || !open) {
      setMetadata(null);
      setIsDirty(false);
      return;
    }

    setLoading(true);
    setIsDirty(false);
    setToast(null);

    // Fetch via API route - since we can't call server functions directly from client
    // We'll use a fetch call to load metadata
    fetch(`/api/admin/media/videos/${videoId}/metadata`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .then((data: AdminVideoWithMetadata) => {
        setMetadata(data);
        setVisible(data.visible);
        setFeatured(data.featured);
      })
      .catch(() => {
        // If API is not available yet, use empty state for development
        setMetadata(null);
      })
      .finally(() => setLoading(false));
  }, [videoId, open]);

  // Toast on state change
  useEffect(() => {
    if (!state.message || !state.messageKey || handledMessageKeyRef.current === state.messageKey) {
      return;
    }

    handledMessageKeyRef.current = state.messageKey;
    setToast({ message: state.message, success: Boolean(state.success) });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);

    if (state.success) {
      setIsDirty(false);
      onClose();
    }

    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, [state.message, state.messageKey, state.success, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ESC key
  useEffect(() => {
    if (!open) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  });

  const handleClose = useCallback(() => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  const handleFormChange = useCallback(() => {
    setIsDirty(true);
  }, []);

  return (
    <>
      {/* 토스트 */}
      {toast && (
        <div
          role="alert"
          className={`fixed bottom-6 right-6 z-[80] flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-lg ${
            toast.success ? "border-emerald-100 bg-white" : "border-red-100 bg-white"
          }`}
        >
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
            toast.success ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
          }`}>
            {toast.success ? "\u2713" : "!"}
          </span>
          <p className="text-[13px] text-[#1e2f45]">{toast.message}</p>
          <button onClick={() => setToast(null)} className="ml-auto shrink-0 text-[#8fa3bb] hover:text-[#374151]" aria-label="닫기">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}

      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* 드로어 패널 */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 헤더 */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <h2 id="drawer-title" className="text-[16px] font-bold text-[#0f1c2e]">영상 메타데이터 수정</h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8fa3bb] transition hover:bg-[#f1f5f9] hover:text-[#5d6f86]"
            aria-label="닫기"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* 스크롤 본문 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <DrawerSkeleton />
          ) : !metadata ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[13px] text-[#5d6f86]">메타데이터를 불러오는 중입니다...</p>
            </div>
          ) : (
            <form
              key={metadata.youtubeVideoId}
              action={formAction}
              onChange={handleFormChange}
              className="space-y-5 px-6 py-5"
            >
              {/* 숨겨진 필드: videoId */}
              <input type="hidden" name="videoId" value={videoId ?? ""} />

              {/* 섹션 1: YouTube 정보 (읽기 전용) */}
              <div className="rounded-xl bg-[#f8fafc] p-4">
                <h3 className="mb-3 text-[13px] font-bold text-[#0f1c2e]">YouTube 정보</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8fa3bb]">Video ID</span>
                    <span className="font-mono text-[12px] text-[#5d6f86]">{metadata.youtubeVideoId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#8fa3bb]">원본 제목</span>
                    <p className="mt-0.5 text-[13px] text-[#132033]">{metadata.originalTitle}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8fa3bb]">공개일</span>
                    <span className="text-[12px] text-[#5d6f86]">
                      {new Date(metadata.publishedAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <div>
                    <a
                      href={metadata.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3f74c7] transition hover:text-[#4a82d7]"
                    >
                      YouTube에서 보기
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M4 1h6v6M10 1L4.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* 섹션 2: 공개 노출 설정 */}
              <div className="border-b border-[#f0f4f8] pb-5">
                <h3 className="mb-3 text-[13px] font-bold text-[#0f1c2e]">공개 노출 설정</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-[#1e2f45]">노출</label>
                    <Toggle name="visible" checked={visible} onChange={setVisible} />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      name="featured"
                      id="drawer-featured"
                      defaultChecked={metadata.featured}
                      className="h-4 w-4 rounded border-[#dde4ef] accent-[#3f74c7]"
                    />
                    <label htmlFor="drawer-featured" className="text-[13px] font-semibold text-[#1e2f45]">대표 영상</label>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">고정 순위</label>
                    <input
                      type="number"
                      name="pinnedRank"
                      defaultValue={metadata.pinnedRank ?? ""}
                      placeholder="미지정"
                      className="w-24 rounded-xl border border-[#dde4ef] bg-white px-4 py-2.5 text-[13px] text-[#132033] outline-none transition focus:border-[#3f74c7] focus:ring-2 focus:ring-[#3f74c7]/30"
                    />
                    <p className="mt-1.5 text-[11px] text-[#8fa3bb]">비워두면 고정하지 않습니다.</p>
                  </div>
                </div>
              </div>

              {/* 섹션 3: 표시 정보 오버라이드 */}
              <div className="border-b border-[#f0f4f8] pb-5">
                <h3 className="mb-3 text-[13px] font-bold text-[#0f1c2e]">표시 정보 오버라이드</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">표시 제목</label>
                    <input
                      type="text"
                      name="manualTitle"
                      defaultValue={metadata.manualTitle ?? ""}
                      placeholder={metadata.originalTitle}
                      className={inputCls}
                    />
                    <p className="mt-1.5 text-[11px] text-[#8fa3bb]">비워두면 원본 제목이 사용됩니다.</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">썸네일 URL</label>
                    <input
                      type="url"
                      name="manualThumbnailUrl"
                      defaultValue={metadata.manualThumbnailUrl ?? ""}
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">표시 공개일</label>
                    <input
                      type="date"
                      name="manualPublishedDate"
                      defaultValue={metadata.manualPublishedDate ?? ""}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">콘텐츠 유형</label>
                    <select
                      name="manualKind"
                      defaultValue={metadata.manualKind ?? ""}
                      className={selectCls}
                    >
                      <option value="">선택 안함 (기본값 사용)</option>
                      <option value="LONG_FORM">LONG_FORM</option>
                      <option value="SHORT">SHORT</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 섹션 4: 설교 메타 */}
              <div className="border-b border-[#f0f4f8] pb-5">
                <h3 className="mb-3 text-[13px] font-bold text-[#0f1c2e]">설교 메타</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">설교자</label>
                    <input
                      type="text"
                      name="preacher"
                      defaultValue={metadata.preacher ?? ""}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">본문</label>
                    <input
                      type="text"
                      name="scripture"
                      defaultValue={metadata.scripture ?? ""}
                      placeholder="예: 요한복음 3:16"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">본문 내용</label>
                    <textarea
                      name="scriptureBody"
                      rows={3}
                      defaultValue={metadata.scriptureBody ?? ""}
                      maxLength={2000}
                      className={textareaCls}
                    />
                    <p className="mt-1.5 text-[11px] text-[#8fa3bb]">최대 2,000자</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">예배 유형</label>
                    <select
                      name="serviceType"
                      defaultValue={metadata.serviceType ?? ""}
                      className={selectCls}
                    >
                      <option value="">선택 안함</option>
                      <option value="주일예배">주일예배</option>
                      <option value="수요예배">수요예배</option>
                      <option value="금요기도회">금요기도회</option>
                      <option value="특별집회">특별집회</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 섹션 5: 설명 메타 */}
              <div>
                <h3 className="mb-3 text-[13px] font-bold text-[#0f1c2e]">설명 메타</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">요약</label>
                    <textarea
                      name="summary"
                      rows={2}
                      defaultValue={metadata.summary ?? ""}
                      maxLength={500}
                      className={textareaCls}
                    />
                    <p className="mt-1.5 text-[11px] text-[#8fa3bb]">최대 500자</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">태그</label>
                    <TagInput defaultTags={metadata.tags} />
                  </div>
                </div>
              </div>

              {/* 하단 버튼 (form 내부에 포함하여 submit 가능하게) */}
              <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-2.5 border-t border-[#e2e8f0] bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex h-9 items-center rounded-lg border border-[#dde4ef] px-4 text-[13px] text-[#5d6f86] transition hover:bg-[#f1f5f9]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#3f74c7] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#4a82d7] disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin" width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" strokeLinecap="round" />
                      </svg>
                      저장 중...
                    </>
                  ) : (
                    "저장"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </aside>

      {/* 확인 다이얼로그 */}
      <ConfirmDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          setIsDirty(false);
          onClose();
        }}
      />
    </>
  );
}
