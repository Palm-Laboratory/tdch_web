"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import type { AdminAccount } from "@/lib/admin-accounts-api";
import type { AdminAccountFormState } from "../actions";

// ── 공통 UI ───────────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[12px] text-red-500">
      <span aria-hidden="true">●</span>{msg}
    </p>
  );
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-[#1e2f45]">
      {children}
      {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
    </label>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-xl border px-4 py-2.5 text-[13px] text-[#132033] outline-none transition focus:ring-2 focus:ring-[#3f74c7]/30 ${hasError
      ? "border-red-300 bg-red-50/40 focus:border-red-400"
      : "border-[#dde4ef] bg-white focus:border-[#3f74c7]"
    }`;
}

// ── 폼 컴포넌트 ───────────────────────────────────────────────────────────────

interface AdminAccountFormProps {
  mode: "new" | "edit";
  item?: AdminAccount;
  isSelf?: boolean;
  createAction: (prev: AdminAccountFormState, formData: FormData) => Promise<AdminAccountFormState>;
  updateAction?: (prev: AdminAccountFormState, formData: FormData) => Promise<AdminAccountFormState>;
  deleteAction?: () => Promise<void>;
}

export default function AdminAccountForm({
  mode,
  item,
  isSelf = false,
  createAction,
  updateAction,
  deleteAction,
}: AdminAccountFormProps) {
  const action = mode === "new" ? createAction : (updateAction ?? createAction);
  const [state, formAction, isPending] = useActionState<AdminAccountFormState, FormData>(action, {});
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  useEffect(() => {
    if (!state.message) return;
    setToast({ message: state.message, success: Boolean(state.success) });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, [state.message, state.messageKey, state.success]);

  async function handleDelete() {
    if (!deleteAction || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteAction();
      router.replace("/admin/accounts");
      router.refresh();
    } catch (err) {
      setIsDeleting(false);
      setDeleteConfirm(false);
      alert(err instanceof Error ? err.message : "계정을 삭제하지 못했습니다.");
    }
  }

  return (
    <>
      {/* 토스트 */}
      {toast && (
        <div
          role="alert"
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-lg ${toast.success ? "border-emerald-100 bg-white" : "border-red-100 bg-white"
            }`}
        >
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${toast.success ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
            {toast.success ? "✓" : "!"}
          </span>
          <p className="text-[13px] text-[#1e2f45]">{toast.message}</p>
          <button onClick={() => setToast(null)} className="ml-auto shrink-0 text-[#8fa3bb] hover:text-[#374151]" aria-label="닫기">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {/* ── 기본 정보 ── */}
        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="border-b border-[#f0f4f8] px-6 py-4">
            <h2 className="text-[14px] font-bold text-[#0f1c2e]">기본 정보</h2>
          </div>
          <div className="grid gap-5 px-6 py-5 sm:grid-cols-2">
            {/* 아이디 */}
            <div>
              <Label htmlFor="username" required={mode === "new"}>아이디</Label>
              {mode === "edit" ? (
                <>
                  {isSelf ? (
                    <>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="off"
                        defaultValue={item?.username ?? ""}
                        className={`${inputCls(!!state.errors?.username)} font-mono`}
                      />
                      <p className="mt-1.5 text-[11px] text-[#8fa3bb]">본인 계정은 아이디를 변경할 수 있습니다.</p>
                    </>
                  ) : (
                    <>
                      <input type="hidden" name="username" value={item?.username ?? ""} />
                      <p className={`${inputCls(false)} cursor-not-allowed bg-[#f8fafc] font-mono text-[#5d6f86]`}>
                        {item?.username}
                      </p>
                      <p className="mt-1.5 text-[11px] text-[#8fa3bb]">아이디는 변경할 수 없습니다.</p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    placeholder="new-admin"
                    className={inputCls(!!state.errors?.username)}
                  />
                  <p className="mt-1.5 text-[11px] text-[#8fa3bb]">영소문자, 숫자, -, _ 만 사용 가능합니다.</p>
                </>
              )}
              <FieldError msg={state.errors?.username} />
            </div>

            {/* 이름(표시명) */}
            <div>
              <Label htmlFor="displayName" required>이름</Label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="off"
                defaultValue={item?.displayName ?? ""}
                readOnly={false}
                placeholder="홍길동"
                className={inputCls(!!state.errors?.displayName)}
              />
              {mode === "edit" && isSelf && (
                <p className="mt-1.5 text-[11px] text-[#8fa3bb]">본인 계정은 이름을 변경할 수 있습니다.</p>
              )}
              <FieldError msg={state.errors?.displayName} />
            </div>

            {/* 권한 */}
            <div>
              <Label htmlFor="role" required>권한</Label>
              {mode === "edit" && isSelf ? (
                <>
                  <input type="hidden" name="role" value={item?.role ?? "ADMIN"} />
                  <p className={`${inputCls(false)} cursor-not-allowed bg-[#f8fafc] text-[#5d6f86]`}>
                    {item?.role === "SUPER_ADMIN" ? "슈퍼 관리자" : "관리자"}
                  </p>
                </>
              ) : (
                <select
                  id="role"
                  name="role"
                  defaultValue={item?.role ?? "ADMIN"}
                  className={inputCls(!!state.errors?.role)}
                >
                  <option value="SUPER_ADMIN">슈퍼 관리자</option>
                  <option value="ADMIN">관리자</option>
                </select>
              )}
              <p className="mt-1.5 text-[11px] text-[#8fa3bb]">
                {mode === "edit" && isSelf
                  ? "본인 계정은 권한을 변경할 수 없습니다."
                  : "슈퍼 관리자: 모든 기능 접근 가능 · 관리자: 콘텐츠 및 운영 관리 가능"}
              </p>
              <FieldError msg={state.errors?.role} />
            </div>

            {/* 계정 상태 (수정 모드) */}
            {mode === "edit" && (
              <div>
                <Label htmlFor="active">계정 상태</Label>
                {isSelf ? (
                  <>
                    <input type="hidden" name="active" value={item?.active ? "true" : "false"} />
                    <p className={`${inputCls(false)} cursor-not-allowed bg-[#f8fafc] text-[#5d6f86]`}>
                      {item?.active ? "활성" : "비활성"}
                    </p>
                    <p className="mt-1.5 text-[11px] text-[#8fa3bb]">본인 계정은 상태를 변경할 수 없습니다.</p>
                  </>
                ) : (
                  <div className="flex gap-3">
                    {[
                      { value: "true", label: "활성", active: true },
                      { value: "false", label: "비활성", active: false },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#dde4ef] px-4 py-2.5 transition has-[:checked]:border-[#3f74c7] has-[:checked]:bg-[#edf4ff]"
                      >
                        <input
                          type="radio"
                          name="active"
                          value={opt.value}
                          defaultChecked={item?.active === opt.active}
                          className="accent-[#3f74c7]"
                        />
                        <span className="text-[13px] font-semibold text-[#132033]">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── 비밀번호 ── */}
        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="border-b border-[#f0f4f8] px-6 py-4">
            <h2 className="text-[14px] font-bold text-[#0f1c2e]">
              {mode === "new" ? "비밀번호" : "비밀번호 변경"}
            </h2>
          </div>
          <div className="px-6 py-5">
            <Label htmlFor="password" required={mode === "new"}>
              {mode === "new" ? "초기 비밀번호" : "새 비밀번호"}
            </Label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={mode === "new" ? "8자 이상 입력" : "변경할 경우에만 입력 (빈 칸이면 유지)"}
                className={`${inputCls(!!state.errors?.password)} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fa3bb] hover:text-[#374151]"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2l12 12M6.5 6.6A2 2 0 0 0 9.4 9.5M4.5 4.6C2.8 5.6 1.5 7.1 1 8c1.2 2.4 4 4 7 4 1.3 0 2.5-.3 3.5-.9M6.5 4.1C7 4 7.5 4 8 4c3 0 5.8 1.6 7 4-.4.8-1 1.6-1.8 2.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M1 8C2.5 4.8 5 3 8 3s5.5 1.8 7 5c-1.5 3.2-4 5-7 5S2.5 11.2 1 8z" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                )}
              </button>
            </div>
            <FieldError msg={state.errors?.password} />
          </div>
        </section>

        {/* ── 버튼 영역 ── */}
        <div className="flex items-center justify-between gap-3">
          {/* 삭제 버튼 (수정 모드) */}
          <div>
            {mode === "edit" && deleteAction && (
              deleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#5d6f86]">정말 삭제하시겠습니까?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-red-500 px-4 text-[13px] font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                  >
                    {isDeleting ? "삭제 중…" : "삭제 확인"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(false)}
                    className="inline-flex h-9 items-center rounded-lg border border-[#dde4ef] px-4 text-[13px] text-[#5d6f86] transition hover:bg-[#f1f5f9]"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-4 text-[13px] font-medium text-red-500 transition hover:bg-red-50"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2 3.5h9M4.5 3.5V2.5h4v1M5 6v4M8 6v4M3 3.5l.5 7h6l.5-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  계정 삭제
                </button>
              )
            )}
          </div>

          {/* 저장/취소 버튼 */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/accounts"
              className="inline-flex h-9 items-center rounded-lg border border-[#dde4ef] px-4 text-[13px] text-[#5d6f86] transition hover:bg-[#f1f5f9]"
            >
              취소
            </Link>
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
                  저장 중…
                </>
              ) : mode === "new" ? "계정 등록" : "저장"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
