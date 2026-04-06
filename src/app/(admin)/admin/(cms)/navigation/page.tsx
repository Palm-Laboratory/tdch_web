import Link from "next/link";
import { getAdminNavigationItems } from "@/lib/admin-navigation-api";

const PAGE_SIZE = 6;

interface AdminNavigationPageProps {
  searchParams?: Promise<{
    page?: string | string[];
  }>;
}

function buildPageHref(page: number) {
  return page <= 1 ? "/admin/navigation" : `/admin/navigation?page=${page}`;
}

function PaginationLink({
  href,
  label,
  active = false,
  disabled = false,
}: {
  href: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 text-sm text-white/20">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border px-4 text-sm transition ${active
        ? "border-[#6ca6f0]/30 bg-[#3f74c7]/16 font-semibold text-[#9cc0ff]"
        : "border-white/[0.06] bg-white/[0.03] text-white/60 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white"
        }`}
    >
      {label}
    </Link>
  );
}

export default async function AdminNavigationPage({ searchParams }: AdminNavigationPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawPage = Array.isArray(resolvedSearchParams?.page)
    ? resolvedSearchParams?.page[0]
    : resolvedSearchParams?.page;
  const parsedPage = Number.parseInt(rawPage ?? "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { groups } = await getAdminNavigationItems(true);
  const totalPages = Math.max(1, Math.ceil(groups.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagedGroups = groups.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        {pagedGroups.length === 0 ? (
          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] px-6 py-10 text-center">
            <p className="text-base font-semibold text-white">등록된 1단계 메뉴가 없습니다.</p>
            <p className="mt-2 text-sm text-white/40">
              아래 추가하기 버튼에서 첫 번째 메뉴를 등록할 수 있습니다.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.04]">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.03] text-left">
                    <th className="px-5 py-4 text-[11px] font-semibold tracking-wide text-white/35">메뉴 이름</th>
                    <th className="px-5 py-4 text-[11px] font-semibold tracking-wide text-white/35">상태</th>
                    <th className="px-5 py-4 text-[11px] font-semibold tracking-wide text-white/35">연결 주소</th>
                    <th className="px-5 py-4 text-[11px] font-semibold tracking-wide text-white/35">하위 메뉴</th>
                    <th className="px-5 py-4 text-[11px] font-semibold tracking-wide text-white/35">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedGroups.map((group) => {
                    const visibleChildrenCount = group.children.filter((item) => item.visible).length;

                    return (
                      <tr
                        key={group.id}
                        className="border-b border-white/[0.05] last:border-b-0 transition hover:bg-white/[0.03]"
                      >
                        <td className="px-5 py-4 align-middle">
                          <div>
                            <p className="text-sm font-semibold text-white">{group.label}</p>
                            <p className="mt-1 text-[12px] text-white/35">{group.menuKey}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 align-middle">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${group.visible
                            ? "bg-emerald-500/12 text-emerald-200"
                            : "bg-white/[0.06] text-white/35"
                            }`}>
                            {group.visible ? "사용 중" : "숨김"}
                          </span>
                        </td>
                        <td className="px-5 py-4 align-middle">
                          <p className="text-sm text-white/70">{group.href}</p>
                        </td>
                        <td className="px-5 py-4 align-middle">
                          <p className="text-sm text-white/80">{group.children.length}개</p>
                          <p className="mt-1 text-[12px] text-white/35">노출 중 {visibleChildrenCount}개</p>
                        </td>
                        <td className="px-5 py-4 align-middle">
                          <Link
                            href={`/admin/navigation/${group.id}`}
                            className="inline-flex h-10 items-center justify-center rounded-2xl border border-[#6ca6f0]/20 bg-[#3f74c7]/12 px-4 text-sm font-medium text-[#9cc0ff] transition hover:bg-[#3f74c7]/18"
                          >
                            상세 관리
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <Link
          href="/admin/navigation/new"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#3f74c7] px-6 text-sm font-semibold text-white transition hover:bg-[#4a82d7]"
        >
          1단계 메뉴 추가하기
        </Link>
      </div>

      <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] px-6 py-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <PaginationLink
            href={buildPageHref(safePage - 1)}
            label="이전"
            disabled={safePage <= 1}
          />
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <PaginationLink
              key={page}
              href={buildPageHref(page)}
              label={`${page}`}
              active={page === safePage}
            />
          ))}
          <PaginationLink
            href={buildPageHref(safePage + 1)}
            label="다음"
            disabled={safePage >= totalPages}
          />
        </div>
      </section>
    </div>
  );
}
