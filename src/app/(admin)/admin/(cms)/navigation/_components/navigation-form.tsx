"use client";

import { useActionState, useEffect, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AdminNavigationItem,
  AdminNavigationEditableLinkType,
  AdminNavigationMenuType,
  AdminNavigationContentKindFilter,
} from "@/lib/admin-navigation-api";
import type { NavigationFormState } from "../actions";

// ── 타입 ─────────────────────────────────────────────────────────────────────
interface NavigationFormProps {
  mode: "new" | "edit";
  item?: AdminNavigationItem;
  parentOptions: Pick<AdminNavigationItem, "id" | "label">[];
  createAction: (prev: NavigationFormState, formData: FormData) => Promise<NavigationFormState>;
  updateAction?: (prev: NavigationFormState, formData: FormData) => Promise<NavigationFormState>;
  deleteAction?: () => Promise<void>;
}

// ── 상수 ─────────────────────────────────────────────────────────────────────
const LINK_TYPES: { value: AdminNavigationEditableLinkType; label: string; desc: string }[] = [
  { value: "INTERNAL", label: "내부",   desc: "사이트 내부 페이지" },
  { value: "EXTERNAL", label: "외부",   desc: "외부 URL (새 탭)" },
  { value: "ANCHOR",   label: "앵커",   desc: "페이지 내 앵커 (#)" },
];

const MENU_TYPES: { value: AdminNavigationMenuType; label: string; desc: string }[] = [
  { value: "STATIC_PAGE", label: "일반 페이지", desc: "고정 페이지 링크" },
  { value: "BOARD_PAGE", label: "게시판", desc: "게시판/목록 페이지" },
  { value: "VIDEO_PAGE", label: "영상 페이지", desc: "영상 메뉴 루트" },
];

const VIDEO_ROOT_OPTIONS = [{ value: "sermons", label: "예배 영상" }] as const;
const VIDEO_CONTENT_KIND_FILTER_OPTIONS: { value: AdminNavigationContentKindFilter | ""; label: string }[] = [
  { value: "", label: "전체 영상" },
  { value: "LONG_FORM", label: "말씀/설교" },
  { value: "SHORT", label: "짧은 영상" },
];

// ── 공통 UI 컴포넌트 ─────────────────────────────────────────────────────────
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[12px] font-semibold text-[#374151]">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] text-red-500">{message}</p>;
}

function TextInput({
  name, defaultValue, placeholder, error, disabled,
}: {
  name: string; defaultValue?: string; placeholder?: string; error?: string; disabled?: boolean;
}) {
  return (
    <>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        className={`h-9 w-full rounded-lg border px-3 text-[13px] text-[#132033] placeholder:text-[#a0aec0]
          focus:outline-none focus:ring-1 focus:ring-[#3f74c7]/40 transition
          ${error ? "border-red-400 bg-red-50 focus:border-red-400" : "border-[#d1dbe6] bg-[#f8fafc] focus:border-[#3f74c7]"}
          disabled:cursor-not-allowed disabled:opacity-50`}
      />
      <FieldError message={error} />
    </>
  );
}

function Toggle({
  name, defaultChecked, label, description, disabled, checked, onCheckedChange,
}: {
  name: string; defaultChecked?: boolean; label: string; description?: string;
  disabled?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? true);
  const isControlled = checked !== undefined;
  const resolvedChecked = isControlled ? checked : internalChecked;

  function handleToggle() {
    if (disabled) {
      return;
    }

    const nextChecked = !resolvedChecked;

    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
  }

  return (
    <label
      className={`flex items-start justify-between gap-3 rounded-xl border border-[#e9edf3] px-4 py-3 transition
        ${disabled ? "cursor-not-allowed bg-[#f3f5f8] opacity-70" : "cursor-pointer bg-[#f8fafc] hover:bg-[#f3f7ff]"}`}
    >
      <div>
        <p className="text-[13px] font-medium text-[#132033]">{label}</p>
        {description && <p className="mt-0.5 text-[11px] text-[#8fa3bb]">{description}</p>}
      </div>
      <div className="relative mt-0.5 shrink-0">
        <input
          type="hidden"
          name={name}
          value={resolvedChecked ? "true" : "false"}
        />
        <button
          type="button"
          role="switch"
          aria-checked={resolvedChecked}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none
            ${resolvedChecked ? "bg-[#3f74c7]" : "bg-[#d1dbe6]"}
            ${disabled ? "cursor-not-allowed" : ""}`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200
              ${resolvedChecked ? "translate-x-4" : "translate-x-1"}`}
          />
        </button>
      </div>
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
      <div className="border-b border-[#f0f4f8] bg-[#f8fafc] px-5 py-3.5">
        <h2 className="text-[13px] font-semibold text-[#374151]">{title}</h2>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

function BottomToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2">
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-[#fff5f5] px-4 py-3 shadow-[0_18px_40px_rgba(15,28,46,0.16)] backdrop-blur">
        <div className="mt-0.5 shrink-0 rounded-full bg-red-500/10 p-1.5 text-red-500">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 5.2v3.6M8 11.4h.01M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[#8b1e1e]">저장하지 못했습니다</p>
          <p className="mt-1 text-[13px] leading-5 text-[#a12d2d]">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#b85b5b] transition hover:bg-red-100 hover:text-[#8b1e1e]"
          aria-label="오류 메시지 닫기"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── 메인 폼 ──────────────────────────────────────────────────────────────────
export default function NavigationForm({
  mode,
  item,
  parentOptions,
  createAction,
  updateAction,
  deleteAction,
}: NavigationFormProps) {
  const router = useRouter();
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [selectedParentId, setSelectedParentId] = useState(item?.parentId ? String(item.parentId) : "");
  const [selectedMenuType, setSelectedMenuType] = useState<AdminNavigationMenuType>(item?.menuType ?? "STATIC_PAGE");
  const [defaultLandingChecked, setDefaultLandingChecked] = useState(item?.defaultLanding ?? false);
  const [visibleChecked, setVisibleChecked] = useState(item?.visible ?? true);
  const [headerVisibleChecked, setHeaderVisibleChecked] = useState(item?.headerVisible ?? true);
  const [mobileVisibleChecked, setMobileVisibleChecked] = useState(item?.mobileVisible ?? true);
  const [lnbVisibleChecked, setLnbVisibleChecked] = useState(item?.lnbVisible ?? true);
  const [breadcrumbVisibleChecked, setBreadcrumbVisibleChecked] = useState(item?.breadcrumbVisible ?? true);

  const action = mode === "edit" && updateAction ? updateAction : createAction;
  const [state, formAction, isPending] = useActionState<NavigationFormState, FormData>(action, {});

  const [linkType, setLinkType] = useState<AdminNavigationEditableLinkType>(
    item?.linkType === "EXTERNAL" || item?.linkType === "ANCHOR" ? item.linkType : "INTERNAL",
  );
  const isStaticPage = selectedMenuType === "STATIC_PAGE";
  const isBoardPage = selectedMenuType === "BOARD_PAGE";
  const isVideoPage = selectedMenuType === "VIDEO_PAGE";

  useEffect(() => {
    if (!state.message) {
      return;
    }

    const id = state.messageKey ?? Date.now();
    setToast({ id, message: state.message });

    const timer = window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [state.message, state.messageKey]);

  useEffect(() => {
    if (!selectedParentId && defaultLandingChecked) {
      setDefaultLandingChecked(false);
    }
  }, [selectedParentId, defaultLandingChecked]);

  useEffect(() => {
    if (!visibleChecked) {
      setHeaderVisibleChecked(false);
      setMobileVisibleChecked(false);
      setLnbVisibleChecked(false);
      setBreadcrumbVisibleChecked(false);
    }
  }, [visibleChecked]);

  useEffect(() => {
    if (!isStaticPage) {
      setLinkType("INTERNAL");
    }
  }, [isStaticPage]);

  function handleDelete() {
    if (!deleteAction) return;
    startDeleteTransition(async () => {
      try {
        await deleteAction();
      } catch (error) {
        const message = error instanceof Error
          ? error.message
          : "메뉴를 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.";
        setToast({ id: Date.now(), message });
        setShowDeleteConfirm(false);
      }
    });
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* ── 기본 정보 ── */}
      <SectionCard title="기본 정보">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 메뉴명 */}
          <div>
            <FieldLabel required>메뉴명</FieldLabel>
            <TextInput
              name="label"
              defaultValue={item?.label}
              placeholder="예) 설교 영상"
              error={state.errors?.label}
            />
          </div>

          {/* 메뉴 타입 */}
          <div>
            <FieldLabel required>메뉴 타입</FieldLabel>
            <select
              name="menuType"
              value={selectedMenuType}
              onChange={(e) => setSelectedMenuType(e.target.value as AdminNavigationMenuType)}
              className={`h-9 w-full rounded-lg border px-3 text-[13px] text-[#132033]
                bg-[#f8fafc] focus:border-[#3f74c7] focus:outline-none focus:ring-1 focus:ring-[#3f74c7]/40 transition
                ${state.errors?.menuType ? "border-red-400" : "border-[#d1dbe6]"}`}
            >
              {MENU_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label} — {t.desc}
                </option>
              ))}
            </select>
            <FieldError message={state.errors?.menuType} />
          </div>

          {/* 링크 타입 */}
          <div>
            <FieldLabel required>링크 타입</FieldLabel>
            {isStaticPage ? (
              <>
                <select
                  name="linkType"
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value as AdminNavigationEditableLinkType)}
                  className={`h-9 w-full rounded-lg border px-3 text-[13px] text-[#132033]
                    bg-[#f8fafc] focus:border-[#3f74c7] focus:outline-none focus:ring-1 focus:ring-[#3f74c7]/40 transition
                    ${state.errors?.linkType ? "border-red-400" : "border-[#d1dbe6]"}`}
                >
                  {LINK_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label} — {t.desc}
                    </option>
                  ))}
                </select>
                <FieldError message={state.errors?.linkType} />
              </>
            ) : (
              <>
                <input type="hidden" name="linkType" value="INTERNAL" />
                <div className="rounded-lg border border-[#d1dbe6] bg-[#f3f5f8] px-3 py-2.5 text-[13px] text-[#5d6f86]">
                  내부 페이지로 자동 설정됩니다.
                </div>
              </>
            )}
          </div>

          {/* 상위 메뉴 */}
          <div>
            <FieldLabel>상위 메뉴 (2depth)</FieldLabel>
            <select
              name="parentId"
              value={selectedParentId}
              onChange={(e) => setSelectedParentId(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#d1dbe6] bg-[#f8fafc] px-3 text-[13px] text-[#132033]
                focus:border-[#3f74c7] focus:outline-none focus:ring-1 focus:ring-[#3f74c7]/40 transition"
            >
              <option value="">없음 (1depth)</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* 연결 주소 */}
          <div className="sm:col-span-2">
            <FieldLabel required={!isVideoPage}>
              {isVideoPage ? "루트 경로" : isBoardPage ? "게시판 경로" : "연결 주소 (href)"}
            </FieldLabel>
            <TextInput
              key={`href-${selectedMenuType}`}
              name="href"
              defaultValue={item?.href ?? (isVideoPage ? "/sermons" : "")}
              placeholder={
                isVideoPage
                  ? "영상 페이지에서는 자동으로 설정됩니다."
                  : isBoardPage
                    ? "예) /boards/notices"
                    : "예) /about"
              }
              disabled={isVideoPage}
              error={state.errors?.href}
            />
          </div>

          {/* 매치 경로 */}
          {!isVideoPage && (
            <div className="sm:col-span-2">
              <FieldLabel>{isBoardPage ? "매치 경로 (선택)" : "매치 경로 (match_path)"}</FieldLabel>
              <TextInput
                key={`match-${selectedMenuType}`}
                name="matchPath"
                defaultValue={item?.matchPath ?? ""}
                placeholder={isBoardPage ? "비우면 게시판 경로를 그대로 사용합니다." : "예) /about/location (비우면 href 사용)"}
              />
              <p className="mt-1 text-[11px] text-[#8fa3bb]">
                {isBoardPage
                  ? "보통은 비워두고, 게시판 상세를 별도 패턴으로 매칭해야 할 때만 사용합니다."
                  : "현재 보고 있는 페이지와 메뉴를 연결할 기준 경로입니다. 보통은 비워두고, 앵커 메뉴처럼 href에 #이 들어갈 때만 hash 없는 경로를 입력합니다."}
              </p>
            </div>
          )}

          {isStaticPage && (
            <div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>정적 페이지 키 (선택)</FieldLabel>
                <TextInput
                  name="pageKey"
                  defaultValue={item?.pageKey ?? ""}
                  placeholder="예) about"
                />
              </div>
              <div>
                <FieldLabel>정적 페이지 경로 (선택)</FieldLabel>
                <TextInput
                  name="pagePath"
                  defaultValue={item?.pagePath ?? ""}
                  placeholder="예) /about"
                />
              </div>
            </div>
          )}

          {isBoardPage && (
            <div className="sm:col-span-2 rounded-2xl border border-[#e9edf3] bg-[#f8fafc] p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel required>게시판 종류</FieldLabel>
                  <TextInput
                    name="boardKey"
                    defaultValue={item?.boardKey ?? ""}
                    placeholder="예) notices"
                    error={state.errors?.boardKey}
                  />
                </div>
                <div>
                  <FieldLabel>카테고리 키 (선택)</FieldLabel>
                  <TextInput
                    name="categoryKey"
                    defaultValue={item?.categoryKey ?? ""}
                    placeholder="예) sunday"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel>목록 경로</FieldLabel>
                  <TextInput
                    name="listPath"
                    defaultValue={item?.listPath ?? item?.href ?? ""}
                    placeholder="비우면 게시판 경로를 그대로 사용합니다."
                  />
                  <p className="mt-1 text-[11px] text-[#8fa3bb]">
                    별도 입력이 없으면 위 게시판 경로를 그대로 목록 경로로 사용합니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isVideoPage && (
            <div className="sm:col-span-2 rounded-2xl border border-[#e9edf3] bg-[#f8fafc] p-4">
              <input type="hidden" name="landingMode" value="ROOT" />
              <div className="space-y-3">
                <div>
                  <FieldLabel required>연결된 영상 관리 영역</FieldLabel>
                  <select
                    name="videoRootKey"
                    defaultValue={item?.videoRootKey ?? "sermons"}
                    className="h-9 w-full rounded-lg border border-[#d1dbe6] bg-white px-3 text-[13px] text-[#132033]
                      focus:border-[#3f74c7] focus:outline-none focus:ring-1 focus:ring-[#3f74c7]/40 transition"
                  >
                    {VIDEO_ROOT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-[#8fa3bb]">
                    실제 영상 목록과 개별 영상 데이터는 미디어 관리 시스템에서 유지됩니다.
                  </p>
                  <FieldError message={state.errors?.videoRootKey} />
                </div>

                <div>
                  <FieldLabel>노출할 영상 범위</FieldLabel>
                  <select
                    name="contentKindFilter"
                    defaultValue={item?.contentKindFilter ?? ""}
                    className="h-9 w-full rounded-lg border border-[#d1dbe6] bg-white px-3 text-[13px] text-[#132033]
                      focus:border-[#3f74c7] focus:outline-none focus:ring-1 focus:ring-[#3f74c7]/40 transition"
                  >
                    {VIDEO_CONTENT_KIND_FILTER_OPTIONS.map((option) => (
                      <option key={option.value || "ALL"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-[#8fa3bb]">
                    비워두면 연결된 영상 메뉴 전체를 노출합니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── 표시 설정 ── */}
      <SectionCard title="표시 설정">
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#d8e2ee] bg-[#f8fbff] p-3">
            <Toggle
              name="visible"
              checked={visibleChecked}
              onCheckedChange={setVisibleChecked}
              label="전체 노출"
              description="끄면 사이트의 모든 메뉴 영역에서 숨겨집니다."
            />
          </div>

          <div className="rounded-2xl border border-[#e9edf3] bg-[#fcfdff] p-4">
            <div className="mb-3">
              <p className="text-[12px] font-semibold text-[#374151]">세부 노출 위치</p>
              <p className="mt-1 text-[11px] text-[#8fa3bb]">
                전체 노출이 켜져 있을 때만 각 위치별로 따로 표시할 수 있습니다.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <Toggle
                name="headerVisible"
                checked={visibleChecked ? headerVisibleChecked : false}
                onCheckedChange={setHeaderVisibleChecked}
                disabled={!visibleChecked}
                label="헤더 노출"
                description="PC/모바일 상단 헤더"
              />
              <Toggle
                name="mobileVisible"
                checked={visibleChecked ? mobileVisibleChecked : false}
                onCheckedChange={setMobileVisibleChecked}
                disabled={!visibleChecked}
                label="모바일 노출"
                description="모바일 전체 메뉴"
              />
              <Toggle
                name="lnbVisible"
                checked={visibleChecked ? lnbVisibleChecked : false}
                onCheckedChange={setLnbVisibleChecked}
                disabled={!visibleChecked}
                label="하위 메뉴 탭 노출"
                description="브레드크럼 아래 하위 메뉴 탭"
              />
              <Toggle
                name="breadcrumbVisible"
                checked={visibleChecked ? breadcrumbVisibleChecked : false}
                onCheckedChange={setBreadcrumbVisibleChecked}
                disabled={!visibleChecked}
                label="브레드크럼 노출"
                description="페이지 상단 현재 위치 경로"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#e9edf3] bg-[#fcfdff] p-3">
            <Toggle
              name="defaultLanding"
              checked={selectedParentId ? defaultLandingChecked : false}
              onCheckedChange={setDefaultLandingChecked}
              disabled={!selectedParentId}
              label="기본 랜딩"
              description={selectedParentId ? "상위 메뉴 클릭 시 이 페이지로 이동합니다." : "2단계 메뉴에서만 설정할 수 있습니다."}
            />
          </div>
        </div>
      </SectionCard>

      {/* ── 기타 설정 ── */}
      <SectionCard title="기타 설정">
        <div className="max-w-xs">
          <FieldLabel>정렬 순서</FieldLabel>
          <input
            type="number"
            name="sortOrder"
            defaultValue={item?.sortOrder ?? 0}
            min={0}
            className="h-9 w-full rounded-lg border border-[#d1dbe6] bg-[#f8fafc] px-3 text-[13px] text-[#132033]
              focus:border-[#3f74c7] focus:outline-none focus:ring-1 focus:ring-[#3f74c7]/40 transition"
          />
          <p className="mt-1 text-[11px] text-[#8fa3bb]">숫자가 낮을수록 앞에 노출됩니다.</p>
        </div>
      </SectionCard>

      {/* ── 액션 버튼 ── */}
      <div className="flex items-center justify-between pt-1">
        {/* 삭제 (수정 모드에서만) */}
        <div>
          {mode === "edit" && deleteAction && (
            <>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#e53e3e]">정말 삭제하시겠습니까?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPendingDelete}
                    className="inline-flex h-8 items-center rounded-lg bg-red-500 px-3 text-[12px] font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                  >
                    {isPendingDelete ? "삭제 중…" : "삭제 확인"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="inline-flex h-8 items-center rounded-lg border border-[#d1dbe6] bg-white px-3 text-[12px] text-[#5d6f86] transition hover:bg-[#f1f5f9]"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 text-[13px] font-medium text-red-500 transition hover:border-red-300 hover:bg-red-100"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2 3h9M5 3V2h3v1M4 3v7h5V3H4z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  메뉴 삭제
                </button>
              )}
            </>
          )}
        </div>

        {/* 취소 / 저장 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-9 items-center rounded-lg border border-[#d1dbe6] bg-white px-4 text-[13px] font-medium text-[#5d6f86] transition hover:bg-[#f1f5f9]"
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
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 8" />
                </svg>
                저장 중…
              </>
            ) : (
              mode === "edit" ? "변경 저장" : "메뉴 추가"
            )}
          </button>
        </div>
      </div>

      {toast && (
        <BottomToast
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
}
