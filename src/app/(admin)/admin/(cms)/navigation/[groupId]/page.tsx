import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminNavigationItems } from "@/lib/admin-navigation-api";

interface AdminNavigationDetailPageProps {
  params: Promise<{
    groupId: string;
  }>;
}

function VisibilityChip({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
        enabled
          ? "bg-emerald-500/12 text-emerald-200"
          : "bg-white/[0.06] text-white/35"
      }`}
    >
      {label}
    </span>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#0c1622] px-4 py-3">
      <p className="text-[11px] text-white/28">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

export default async function AdminNavigationDetailPage({ params }: AdminNavigationDetailPageProps) {
  const { groupId } = await params;
  const parsedId = Number.parseInt(groupId, 10);

  if (!Number.isFinite(parsedId)) {
    notFound();
  }

  const { groups } = await getAdminNavigationItems(true);
  const group = groups.find((item) => item.id === parsedId);

  if (!group) {
    notFound();
  }

  const defaultChild = group.children.find((item) => item.defaultLanding);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/navigation"
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white"
        >
          목록으로
        </Link>
        <Link
          href={`/admin/navigation/${group.id}/children/new`}
          className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#3f74c7] px-4 text-sm font-semibold text-white transition hover:bg-[#4a82d7]"
        >
          2단계 메뉴 추가하기
        </Link>
      </div>

      <header className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(63,116,199,0.18),rgba(255,255,255,0.03))] px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6ca6f0]/65">
          Menu Detail
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
          {group.label}
        </h1>
        <p className="mt-2 text-sm leading-6 text-white/45">
          이 화면에서는 선택한 1단계 메뉴 안의 2단계 메뉴를 관리합니다.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoBox label="메뉴 주소" value={group.href} />
        <InfoBox label="현재 위치 기준" value={group.matchPath ?? "-"} />
        <InfoBox label="2단계 메뉴 수" value={`${group.children.length}개`} />
        <InfoBox label="대표 메뉴" value={defaultChild?.label ?? "아직 지정되지 않음"} />
      </section>

      <section className="space-y-3">
        {group.children.length === 0 ? (
          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] px-6 py-10 text-center">
            <p className="text-base font-semibold text-white">아직 등록된 2단계 메뉴가 없습니다.</p>
            <p className="mt-2 text-sm text-white/40">
              아래 추가하기 버튼에서 이 메뉴 아래의 세부 메뉴를 등록할 수 있습니다.
            </p>
          </div>
        ) : (
          group.children.map((item) => (
            <article
              key={item.id}
              className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] px-6 py-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">{item.label}</h2>
                    <VisibilityChip enabled={item.visible} label={item.visible ? "사용 중" : "숨김"} />
                    {item.defaultLanding ? (
                      <span className="rounded-full bg-amber-500/12 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-amber-200">
                        대표 메뉴
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-white/42">주소: {item.href}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <VisibilityChip enabled={item.headerVisible} label="상단 메뉴" />
                  <VisibilityChip enabled={item.mobileVisible} label="모바일 메뉴" />
                  <VisibilityChip enabled={item.lnbVisible} label="왼쪽 메뉴" />
                  <VisibilityChip enabled={item.breadcrumbVisible} label="현재 위치 경로" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoBox label="메뉴 코드" value={item.menuKey} />
                <InfoBox label="현재 위치 기준" value={item.matchPath ?? "-"} />
                <InfoBox label="연결 방식" value={item.linkType} />
                <InfoBox label="영상 메뉴 연결" value={item.contentSiteKey ?? "사용 안 함"} />
              </div>
            </article>
          ))
        )}
      </section>

      <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] px-6 py-6">
        <p className="text-sm leading-6 text-white/45">
          이후 여기에서 2단계 메뉴의 추가, 수정, 숨김, 대표 메뉴 변경 기능을 연결합니다.
        </p>
        <div className="mt-4">
          <Link
            href={`/admin/navigation/${group.id}/children/new`}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#3f74c7] px-6 text-sm font-semibold text-white transition hover:bg-[#4a82d7]"
          >
            2단계 메뉴 추가하기
          </Link>
        </div>
      </section>
    </div>
  );
}
