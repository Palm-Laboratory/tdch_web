"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AdminMediaVideoDetail,
  AdminMediaVideoSummary,
  VideoContentForm,
  UpdateAdminMediaVideoMetaRequest,
} from "@/lib/admin-media-videos-api";

const FORM_META: Record<VideoContentForm, { label: string; description: string }> = {
  LONGFORM: {
    label: "롱폼 영상",
    description: "메인 목록과 상세에 노출되는 기본 영상 콘텐츠입니다.",
  },
  SHORTFORM: {
    label: "숏폼 영상",
    description: "세로형 카드와 상세에 노출되는 짧은 영상 콘텐츠입니다.",
  },
};

type MediaVideoDraft = {
  displayTitle: string;
  preacherName: string;
  displayPublishedAt: string;
  hidden: boolean;
  scriptureReference: string;
  scriptureBody: string;
  messageBody: string;
  summary: string;
  thumbnailOverrideUrl: string;
};

function pad(value: number) {
  return `${value}`.padStart(2, "0");
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toDateTimeLocalValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function createDraft(detail: AdminMediaVideoDetail): MediaVideoDraft {
  return {
    displayTitle: detail.title === detail.sourceTitle ? "" : detail.title,
    preacherName: detail.preacherName ?? "",
    displayPublishedAt:
      detail.publishedAt && detail.publishedAt !== detail.sourcePublishedAt
        ? toDateTimeLocalValue(detail.publishedAt)
        : "",
    hidden: detail.hidden,
    scriptureReference: detail.scriptureReference ?? "",
    scriptureBody: detail.scriptureBody ?? "",
    messageBody: detail.messageBody ?? "",
    summary: detail.summary ?? "",
    thumbnailOverrideUrl: detail.thumbnailOverrideUrl ?? "",
  };
}

function toUpdatePayload(draft: MediaVideoDraft): UpdateAdminMediaVideoMetaRequest {
  return {
    displayTitle: draft.displayTitle.trim() || null,
    preacherName: draft.preacherName.trim() || null,
    displayPublishedAt: draft.displayPublishedAt ? new Date(draft.displayPublishedAt).toISOString() : null,
    hidden: draft.hidden,
    scriptureReference: draft.scriptureReference.trim() || null,
    scriptureBody: draft.scriptureBody.trim() || null,
    messageBody: draft.messageBody.trim() || null,
    summary: draft.summary.trim() || null,
    thumbnailOverrideUrl: draft.thumbnailOverrideUrl.trim() || null,
  };
}

function toUpdatedSummary(detail: AdminMediaVideoDetail): AdminMediaVideoSummary {
  return {
    videoId: detail.videoId,
    title: detail.title,
    sourceTitle: detail.sourceTitle,
    preacherName: detail.preacherName,
    publishedAt: detail.publishedAt,
    hidden: detail.hidden,
    contentForm: detail.contentForm,
    thumbnailUrl: detail.thumbnailOverrideUrl || detail.sourceThumbnailUrl,
    scriptureReference: detail.scriptureReference,
  };
}

export default function MediaVideoManagementClient({
  initialForm,
  initialItems,
  initialDetail,
}: {
  initialForm: VideoContentForm;
  initialItems: AdminMediaVideoSummary[];
  initialDetail: AdminMediaVideoDetail | null;
}) {
  const router = useRouter();
  const [currentForm, setCurrentForm] = useState<VideoContentForm>(initialForm);
  const [listByForm, setListByForm] = useState<Partial<Record<VideoContentForm, AdminMediaVideoSummary[]>>>({
    [initialForm]: initialItems,
  });
  const [detailByVideoId, setDetailByVideoId] = useState<Record<string, AdminMediaVideoDetail>>(
    initialDetail ? { [initialDetail.videoId]: initialDetail } : {},
  );
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(initialDetail?.videoId ?? initialItems[0]?.videoId ?? null);
  const [draft, setDraft] = useState<MediaVideoDraft | null>(initialDetail ? createDraft(initialDetail) : null);
  const [listLoading, setListLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const currentItems = useMemo(
    () => listByForm[currentForm] ?? [],
    [currentForm, listByForm],
  );
  const selectedDetail = selectedVideoId ? detailByVideoId[selectedVideoId] ?? null : null;

  useEffect(() => {
    if (listByForm[currentForm]) {
      return;
    }

    let cancelled = false;

    const loadList = async () => {
      setListLoading(true);
      setMessage(null);

      try {
        const response = await fetch(`/api/admin/media/videos?form=${encodeURIComponent(currentForm)}`);
        const payload = (await response.json()) as { items?: AdminMediaVideoSummary[]; message?: string };

        if (!response.ok || !payload.items) {
          throw new Error(payload.message || "영상 목록을 불러오지 못했습니다.");
        }

        if (!cancelled) {
          setListByForm((prev) => ({
            ...prev,
            [currentForm]: payload.items,
          }));
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "영상 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    };

    void loadList();

    return () => {
      cancelled = true;
    };
  }, [currentForm, listByForm]);

  useEffect(() => {
    if (currentItems.length === 0) {
      setSelectedVideoId(null);
      setDraft(null);
      return;
    }

    if (!selectedVideoId || !currentItems.some((item) => item.videoId === selectedVideoId)) {
      setSelectedVideoId(currentItems[0].videoId);
    }
  }, [currentItems, selectedVideoId]);

  useEffect(() => {
    if (!selectedVideoId) {
      return;
    }

    if (detailByVideoId[selectedVideoId]) {
      return;
    }

    let cancelled = false;

    const loadDetail = async () => {
      setDetailLoading(true);
      setMessage(null);

      try {
        const response = await fetch(`/api/admin/media/videos/${encodeURIComponent(selectedVideoId)}`);
        const payload = (await response.json()) as AdminMediaVideoDetail & { message?: string };

        if (!response.ok) {
          throw new Error(payload.message || "영상 상세를 불러오지 못했습니다.");
        }

        if (!cancelled) {
          setDetailByVideoId((prev) => ({
            ...prev,
            [selectedVideoId]: payload,
          }));
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "영상 상세를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setDetailLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [detailByVideoId, selectedVideoId]);

  useEffect(() => {
    if (!selectedDetail) {
      setDraft(null);
      return;
    }

    setDraft(createDraft(selectedDetail));
  }, [selectedDetail]);

  const currentMeta = useMemo(() => FORM_META[currentForm], [currentForm]);

  const handleSave = async () => {
    if (!selectedVideoId || !draft) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/media/videos/${encodeURIComponent(selectedVideoId)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toUpdatePayload(draft)),
      });

      const payload = (await response.json()) as AdminMediaVideoDetail & { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "영상 메타를 저장하지 못했습니다.");
      }

      setDetailByVideoId((prev) => ({
        ...prev,
        [payload.videoId]: payload,
      }));
      setListByForm((prev) => ({
        ...prev,
        [payload.contentForm]: (prev[payload.contentForm] ?? []).map((item) =>
          item.videoId === payload.videoId ? toUpdatedSummary(payload) : item,
        ),
      }));
      setDraft(createDraft(payload));
      setMessage("영상 메타를 저장했습니다.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "영상 메타를 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe4f0] bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-semibold text-[#132033]">{currentMeta.label}</p>
            <p className="mt-1 text-[12px] text-[#6d7f95]">{currentMeta.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(FORM_META) as VideoContentForm[]).map((form) => {
              const active = form === currentForm;
              return (
                <button
                  key={form}
                  type="button"
                  onClick={() => {
                    setCurrentForm(form);
                    setMessage(null);
                  }}
                  className={`rounded-lg px-3 py-2 text-[12px] font-semibold transition ${
                    active
                      ? "bg-[#3f74c7] text-white"
                      : "border border-[#d7e3f4] bg-white text-[#334155]"
                  }`}
                >
                  {FORM_META[form].label}
                </button>
              );
            })}
          </div>
        </div>
        {message && (
          <p className="mt-3 text-[12px] text-[#2d5da8]">{message}</p>
        )}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
        <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#edf2f7] px-5 py-4">
            <div>
              <h2 className="text-[14px] font-bold text-[#132033]">영상 목록</h2>
              <p className="mt-1 text-[12px] text-[#6d7f95]">
                전체 {currentItems.length}건
              </p>
            </div>
            {listLoading && (
              <span className="text-[12px] text-[#6d7f95]">불러오는 중...</span>
            )}
          </div>
          <div className="max-h-[720px] overflow-y-auto px-3 py-3">
            {currentItems.length === 0 ? (
              <p className="px-3 py-10 text-[13px] text-[#6d7f95]">등록된 영상이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {currentItems.map((item) => {
                  const active = item.videoId === selectedVideoId;

                  return (
                    <li key={item.videoId}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVideoId(item.videoId);
                          setMessage(null);
                        }}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                          active
                            ? "border-[#b9d1f7] bg-[#edf4ff]"
                            : "border-[#edf2f7] bg-white hover:bg-[#fafcff]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold text-[#132033]">{item.title}</p>
                            <p className="mt-1 truncate text-[11px] text-[#8fa3bb]">원제목: {item.sourceTitle}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {item.hidden && (
                              <span className="rounded-full bg-[#fff1f2] px-2 py-0.5 text-[10px] font-semibold text-[#be123c]">
                                숨김
                              </span>
                            )}
                            <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-semibold text-[#475569]">
                              {item.contentForm === "SHORTFORM" ? "SHORT" : "LONG"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-1 text-[12px] text-[#5d6f86]">
                          <p>발행자: {item.preacherName || "미입력"}</p>
                          <p>본문: {item.scriptureReference || "미입력"}</p>
                          <p>노출일: {formatDateTime(item.publishedAt)}</p>
                        </div>
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
            <h2 className="text-[14px] font-bold text-[#132033]">상세 편집</h2>
            {(saving || detailLoading) && (
              <span className="text-[12px] text-[#6d7f95]">
                {saving ? "저장 중..." : "불러오는 중..."}
              </span>
            )}
          </div>

          <div className="space-y-5 px-5 py-5">
            {!selectedVideoId ? (
              <p className="text-[13px] text-[#6d7f95]">편집할 영상을 선택해 주세요.</p>
            ) : !selectedDetail || !draft ? (
              <p className="text-[13px] text-[#6d7f95]">영상 상세를 불러오는 중입니다.</p>
            ) : (
              <>
                <div className="rounded-2xl border border-[#eef2f7] bg-[#f8fafc] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-bold text-[#132033]">{selectedDetail.sourceTitle}</p>
                      <p className="mt-1 text-[12px] text-[#6d7f95]">
                        영상 ID: <span className="font-mono text-[#475569]">{selectedDetail.videoId}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`https://www.youtube.com/watch?v=${encodeURIComponent(selectedDetail.videoId)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155]"
                      >
                        유튜브 열기
                      </a>
                      <a
                        href={selectedDetail.contentForm === "SHORTFORM"
                          ? `/media/videos/shorts/${selectedDetail.videoId}`
                          : `/media/videos/${selectedDetail.videoId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155]"
                      >
                        공개 화면 보기
                      </a>
                    </div>
                  </div>

                  <dl className="mt-4 grid gap-3 text-[12px] text-[#5d6f86] sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-[#334155]">원본 공개일</dt>
                      <dd className="mt-1">{formatDateTime(selectedDetail.sourcePublishedAt)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[#334155]">현재 공개일</dt>
                      <dd className="mt-1">{formatDateTime(selectedDetail.publishedAt)}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-[#334155]">원본 설명</dt>
                      <dd className="mt-1 whitespace-pre-wrap leading-6">{selectedDetail.sourceDescription || "—"}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-[#334155]">원본 썸네일</dt>
                      <dd className="mt-1 break-all">
                        {selectedDetail.sourceThumbnailUrl ? (
                          <a
                            href={selectedDetail.sourceThumbnailUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#2d5da8] underline-offset-2 hover:underline"
                          >
                            {selectedDetail.sourceThumbnailUrl}
                          </a>
                        ) : "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="grid gap-4">
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-[#334155]">표시 제목</span>
                    <input
                      value={draft.displayTitle}
                      onChange={(event) => setDraft((prev) => prev ? { ...prev, displayTitle: event.target.value } : prev)}
                      placeholder={selectedDetail.sourceTitle}
                      className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                    />
                    <p className="text-[11px] text-[#8fa3bb]">비우면 유튜브 원본 제목을 그대로 사용합니다.</p>
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#334155]">발행자</span>
                      <input
                        value={draft.preacherName}
                        onChange={(event) => setDraft((prev) => prev ? { ...prev, preacherName: event.target.value } : prev)}
                        className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#334155]">표시 공개일</span>
                      <input
                        type="datetime-local"
                        value={draft.displayPublishedAt}
                        onChange={(event) => setDraft((prev) => prev ? { ...prev, displayPublishedAt: event.target.value } : prev)}
                        className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                      />
                      <p className="text-[11px] text-[#8fa3bb]">비우면 원본 공개일을 사용합니다.</p>
                    </label>
                  </div>

                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-[#334155]">본문 레퍼런스</span>
                    <input
                      value={draft.scriptureReference}
                      onChange={(event) => setDraft((prev) => prev ? { ...prev, scriptureReference: event.target.value } : prev)}
                      placeholder="예: 요한복음 3:16-21"
                      className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-[#334155]">요약</span>
                    <textarea
                      value={draft.summary}
                      onChange={(event) => setDraft((prev) => prev ? { ...prev, summary: event.target.value } : prev)}
                      rows={4}
                      className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-[#334155]">본문 말씀</span>
                    <textarea
                      value={draft.scriptureBody}
                      onChange={(event) => setDraft((prev) => prev ? { ...prev, scriptureBody: event.target.value } : prev)}
                      rows={6}
                      className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-[#334155]">상세 내용</span>
                    <textarea
                      value={draft.messageBody}
                      onChange={(event) => setDraft((prev) => prev ? { ...prev, messageBody: event.target.value } : prev)}
                      rows={8}
                      className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-[12px] font-semibold text-[#334155]">썸네일 Override URL</span>
                    <input
                      value={draft.thumbnailOverrideUrl}
                      onChange={(event) => setDraft((prev) => prev ? { ...prev, thumbnailOverrideUrl: event.target.value } : prev)}
                      className="w-full rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
                    />
                    <p className="text-[11px] text-[#8fa3bb]">비우면 유튜브 원본 썸네일을 사용합니다.</p>
                  </label>

                  <label className="flex items-center gap-2 rounded-xl border border-[#eef2f7] bg-[#f8fafc] px-4 py-3 text-[13px] font-semibold text-[#334155]">
                    <input
                      type="checkbox"
                      checked={draft.hidden}
                      onChange={(event) => setDraft((prev) => prev ? { ...prev, hidden: event.target.checked } : prev)}
                    />
                    공개 영상 목록과 상세에서 숨김 처리
                  </label>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-[#edf2f7] pt-4">
                  <button
                    type="button"
                    onClick={() => selectedDetail && setDraft(createDraft(selectedDetail))}
                    className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155]"
                  >
                    변경 취소
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-[#3f74c7] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
                  >
                    {saving ? "저장 중..." : "메타 저장"}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
