"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import type { AdminVideoMetadataResponse } from "@/lib/admin-media-shared";
import type { AdminMediaVideoActionState } from "../actions";

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[12px] text-red-500">{message}</p>;
}

function inputCls(hasError = false) {
  return `w-full rounded-xl border px-4 py-2.5 text-[13px] text-[#132033] outline-none transition focus:ring-2 focus:ring-[#3f74c7]/30 ${
    hasError ? "border-red-300 bg-red-50/40 focus:border-red-400" : "border-[#dde4ef] bg-white focus:border-[#3f74c7]"
  }`;
}

function ToggleField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
      <div>
        <p className="text-[13px] font-semibold text-[#132033]">{label}</p>
        <p className="mt-1 text-[11px] text-[#8fa3bb]">{description}</p>
      </div>
      <div className="shrink-0">
        <input type="hidden" name={name} value={checked ? "true" : "false"} />
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => setChecked((prev) => !prev)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            checked ? "bg-[#3f74c7]" : "bg-[#d1dbe6]"
          }`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${checked ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </label>
  );
}

interface AdminMediaVideoDetailFormProps {
  video: AdminVideoMetadataResponse;
  saveAction: (
    prev: AdminMediaVideoActionState,
    formData: FormData,
  ) => Promise<AdminMediaVideoActionState>;
}

export default function AdminMediaVideoDetailForm({ video, saveAction }: AdminMediaVideoDetailFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<AdminMediaVideoActionState, FormData>(saveAction, {});
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  useEffect(() => {
    if (!state.message) return;
    setToast({ message: state.message, success: Boolean(state.success) });
    if (state.success) {
      router.refresh();
    }
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [router, state.message, state.messageKey, state.success]);

  return (
    <>
      {toast && (
        <div
          role="alert"
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-lg ${
            toast.success ? "border-emerald-100 bg-white" : "border-red-100 bg-white"
          }`}
        >
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
              toast.success ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
            }`}
          >
            {toast.success ? "✓" : "!"}
          </span>
          <p className="text-[13px] text-[#1e2f45]">{toast.message}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="border-b border-[#f0f4f8] px-6 py-4">
            <h2 className="text-[14px] font-bold text-[#0f1c2e]">노출 및 고정</h2>
          </div>
          <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
            <ToggleField
              name="visible"
              label="목록 노출"
              description="사용자 목록과 상세 경로에 이 영상을 노출합니다."
              defaultChecked={video.visible}
            />
            <ToggleField
              name="featured"
              label="대표 노출"
              description="홈이나 상단 영역에서 우선 노출될 수 있습니다."
              defaultChecked={video.featured}
            />
            <div>
              <Label htmlFor="pinnedRank">고정 순서</Label>
              <input id="pinnedRank" name="pinnedRank" defaultValue={video.pinnedRank ?? ""} className={inputCls(!!state.errors?.pinnedRank)} />
              <FieldError message={state.errors?.pinnedRank} />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="border-b border-[#f0f4f8] px-6 py-4">
            <h2 className="text-[14px] font-bold text-[#0f1c2e]">표시 메타데이터</h2>
          </div>
          <div className="grid gap-5 px-6 py-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="manualTitle">표시 제목</Label>
              <input id="manualTitle" name="manualTitle" defaultValue={video.manualTitle ?? ""} className={inputCls(!!state.errors?.manualTitle)} />
              <FieldError message={state.errors?.manualTitle} />
            </div>
            <div>
              <Label htmlFor="manualPublishedDate">표시 날짜</Label>
              <input
                id="manualPublishedDate"
                name="manualPublishedDate"
                type="date"
                defaultValue={video.manualPublishedDate ?? ""}
                className={inputCls(!!state.errors?.manualPublishedDate)}
              />
              <FieldError message={state.errors?.manualPublishedDate} />
            </div>
            <div>
              <Label htmlFor="manualKind">표시 유형</Label>
              <select id="manualKind" name="manualKind" defaultValue={video.manualKind ?? ""} className={inputCls(!!state.errors?.manualKind)}>
                <option value="">원본 유지</option>
                <option value="LONG_FORM">LONG_FORM</option>
                <option value="SHORT">SHORT</option>
              </select>
              <FieldError message={state.errors?.manualKind} />
            </div>
            <div>
              <Label htmlFor="manualThumbnailUrl">표시 썸네일 URL</Label>
              <input id="manualThumbnailUrl" name="manualThumbnailUrl" defaultValue={video.manualThumbnailUrl ?? ""} className={inputCls()} />
            </div>
            <div>
              <Label htmlFor="preacher">설교자</Label>
              <input id="preacher" name="preacher" defaultValue={video.preacher ?? ""} className={inputCls()} />
            </div>
            <div>
              <Label htmlFor="serviceType">예배 유형</Label>
              <input id="serviceType" name="serviceType" defaultValue={video.serviceType ?? ""} className={inputCls()} />
            </div>
            <div>
              <Label htmlFor="scripture">본문 표기</Label>
              <input id="scripture" name="scripture" defaultValue={video.scripture ?? ""} className={inputCls()} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="scriptureBody">본문 전문</Label>
              <textarea id="scriptureBody" name="scriptureBody" rows={4} defaultValue={video.scriptureBody ?? ""} className={`${inputCls()} resize-y`} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="summary">요약</Label>
              <textarea id="summary" name="summary" rows={5} defaultValue={video.summary ?? ""} className={`${inputCls()} resize-y`} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="tags">태그</Label>
              <input id="tags" name="tags" defaultValue={video.tags.join(", ")} className={inputCls()} />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-[#d7e0ea] px-4 py-2.5 text-[13px] font-semibold text-[#4a6484] transition hover:bg-[#f8fafc]"
          >
            돌아가기
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-[#3f74c7] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#325ea1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </>
  );
}
