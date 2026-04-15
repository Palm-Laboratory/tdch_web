import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminNavigationItem,
  getAdminNavigationItems,
  type AdminNavigationItem,
} from "@/lib/admin-navigation-api";
import { AdminApiError } from "@/lib/admin-api";
import NavigationForm from "../_components/navigation-form";
import {
  createNavigationItemAction,
  updateNavigationItemAction,
  deleteNavigationItemAction,
} from "../actions";

interface NavigationDetailPageProps {
  params: Promise<{ id: string }>;
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function NavigationDetailPage({ params }: NavigationDetailPageProps) {
  const { id: rawId } = await params;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  const [itemResult, groupsResult] = await Promise.allSettled([
    getAdminNavigationItem(id),
    getAdminNavigationItems(true),
  ]);

  if (itemResult.status === "rejected") {
    const error = itemResult.reason;
    if (error instanceof AdminApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const item = itemResult.value;
  const allGroups = groupsResult.status === "fulfilled" ? groupsResult.value.groups : [];
  const parentOptions = allGroups
    .filter((group: AdminNavigationItem) => group.id !== id)
    .map(({ id: groupId, label }) => ({ id: groupId, label }));

  const boundUpdateAction = updateNavigationItemAction.bind(null, id);
  const boundDeleteAction = deleteNavigationItemAction.bind(null, id);

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
        <span className="font-medium text-[#132033]">{item.label}</span>
      </nav>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#0f1c2e]">{item.label}</h1>
            <p className="mt-0.5 text-[12px] text-[#8fa3bb]">{item.parentId ? "2depth 메뉴" : "1depth 메뉴"}</p>
          </div>
        </div>
        <div className="shrink-0 rounded-xl border border-[#e9edf3] bg-[#f8fafc] px-3 py-2 text-right">
          <p className="text-[10px] text-[#8fa3bb]">마지막 수정</p>
          <p className="mt-0.5 text-[12px] font-medium text-[#374151]">
            {new Date(item.updatedAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </p>
        </div>
      </div>

      <NavigationForm
        mode="edit"
        item={item}
        parentOptions={parentOptions}
        createAction={createNavigationItemAction}
        updateAction={boundUpdateAction}
        deleteAction={boundDeleteAction}
      />
    </div>
  );
}
