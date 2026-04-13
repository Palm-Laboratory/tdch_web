import Link from "next/link";
import { getAdminNavigationItems, getAdminNavigationSets } from "@/lib/admin-navigation-api";
import NavigationForm from "../_components/navigation-form";
import { createNavigationItemAction } from "../actions";

interface NavigationNewPageProps {
  searchParams?: Promise<{
    setId?: string | string[];
    setKey?: string | string[];
  }>;
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default async function NavigationNewPage({ searchParams }: NavigationNewPageProps) {
  const resolved = await searchParams;
  const rawSetKey = Array.isArray(resolved?.setKey) ? resolved.setKey[0] : (resolved?.setKey ?? "main");
  const currentSetKey = rawSetKey || "main";

  const [{ groups }, { sets }] = await Promise.all([
    getAdminNavigationItems(true, currentSetKey),
    getAdminNavigationSets(),
  ]);

  // 현재 세트 정보
  const currentSet = sets.find((s) => s.setKey === currentSetKey) ?? sets[0] ?? { id: 1, setKey: "main" };

  // 1depth 메뉴만 상위 선택지로 제공
  const parentOptions = groups.map(({ id, label, menuKey }) => ({ id, label, menuKey }));

  return (
    <div className="space-y-5">
      {/* ── 경로(breadcrumb) ── */}
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <Link href="/admin" className="flex items-center transition hover:text-[#3f74c7]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mr-1">
            <path d="M1.5 7.5L7 2l5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6.5V12h3V9h2v3h3V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          홈
        </Link>
        <Chevron />
        <span className="text-[#4a6484]">운영</span>
        <Chevron />
        <Link href={`/admin/navigation?set=${currentSetKey}`} className="text-[#4a6484] transition hover:text-[#3f74c7]">
          내비게이션 메뉴
        </Link>
        <Chevron />
        <span className="font-medium text-[#132033]">메뉴 추가</span>
      </nav>

      {/* ── 페이지 헤더 ── */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-[#0f1c2e]">메뉴 추가</h1>
        <span className="rounded-full bg-[#edf4ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#3f74c7]">
          {currentSetKey}
        </span>
      </div>

      {/* ── 폼 ── */}
      <NavigationForm
        mode="new"
        navigationSetId={currentSet.id}
        parentOptions={parentOptions}
        createAction={createNavigationItemAction}
      />
    </div>
  );
}
