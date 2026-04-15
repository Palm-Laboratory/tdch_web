import Link from "next/link";
import { getAdminNavigationItems } from "@/lib/admin-navigation-api";
import NavigationForm from "../_components/navigation-form";
import { createNavigationItemAction } from "../actions";

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function NavigationNewPage() {
  const { groups } = await getAdminNavigationItems(true);
  const parentOptions = groups.map(({ id, label }) => ({ id, label }));

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <Link href="/admin">홈</Link>
        <Chevron />
        <span className="text-[#4a6484]">운영</span>
        <Chevron />
        <Link href="/admin/navigation" className="text-[#4a6484] transition hover:text-[#3f74c7]">
          메뉴 관리
        </Link>
        <Chevron />
        <span className="font-medium text-[#132033]">메뉴 추가</span>
      </nav>

      <h1 className="text-xl font-bold text-[#0f1c2e]">메뉴 추가</h1>

      <NavigationForm
        mode="new"
        parentOptions={parentOptions}
        createAction={createNavigationItemAction}
      />
    </div>
  );
}
