"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { PlaylistFormState } from "../../actions";
import type { AdminPlaylistDetail } from "@/lib/admin-media-api";

// ── 공통 UI ───────────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-500">
      <span aria-hidden="true">●</span>{msg}
    </p>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-xl border px-4 py-2.5 text-[13px] text-[#132033] outline-none transition focus:ring-2 focus:ring-[#3f74c7]/30 ${
    hasError
      ? "border-red-300 bg-red-50/40 focus:border-red-400"
      : "border-[#dde4ef] bg-white focus:border-[#3f74c7]"
  }`;
}

function Toggle({
  name,
  defaultChecked,
}: {
  name: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <>
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          checked ? "bg-[#3f74c7]" : "bg-[#d1d5db]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

interface PlaylistInfoCardProps {
  playlist: AdminPlaylistDetail;
  updateAction: (prev: PlaylistFormState, formData: FormData) => Promise<PlaylistFormState>;
}

export default function PlaylistInfoCard({ playlist, updateAction }: PlaylistInfoCardProps) {
  const [state, formAction, isPending] = useActionState<PlaylistFormState, FormData>(updateAction, {});
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  useEffect(() => {
    if (!state.message) return;
    setToast({ message: state.message, success: Boolean(state.success) });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, [state.message, state.messageKey, state.success]);

  return (
    <>
      {/* 토스트 */}
      {toast && (
        <div
          role="alert"
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-lg ${
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
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="border-b border-[#f0f4f8] px-6 py-4">
          <h2 className="text-[14px] font-bold text-[#0f1c2e]">기본 정보</h2>
        </div>
        <form action={formAction} className="space-y-4 px-6 py-5">
          {/* 메뉴명 */}
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">
              메뉴명 <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              name="menuName"
              defaultValue={playlist.menuName}
              className={inputCls(!!state.errors?.menuName)}
            />
            <FieldError msg={state.errors?.menuName} />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">
              Slug <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              defaultValue={playlist.slug}
              className={`${inputCls(!!state.errors?.slug)} font-mono`}
            />
            <p className="mt-1.5 text-[11px] text-[#8fa3bb]">영소문자, 숫자, 하이픈만 사용 가능합니다.</p>
            <FieldError msg={state.errors?.slug} />
          </div>

          {/* 동기화 토글 */}
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#1e2f45]">동기화</label>
            <Toggle name="syncEnabled" defaultChecked={playlist.syncEnabled} />
          </div>

          {/* 활성 토글 */}
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#1e2f45]">활성</label>
            <Toggle name="active" defaultChecked={playlist.active} />
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end pt-2">
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
      </section>
    </>
  );
}
