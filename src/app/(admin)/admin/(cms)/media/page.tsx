import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { getAdminPlaylists, type AdminPlaylist, type ContentKind } from "@/lib/admin-media-api";

// ── SVG 아이콘 ───────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mr-1">
      <path d="M1.5 7.5L7 2l5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 6.5V12h3V9h2v3h3V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1 6C2.5 3 4.5 1.5 6 1.5S9.5 3 11 6c-1.5 3-3.5 4.5-5 4.5S2.5 9 1 6z" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa3bb]">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

// ── 배지 ──────────────────────────────────────────────────────────────────────

const KIND_BADGE: Record<ContentKind, { label: string; cls: string }> = {
  LONG_FORM: { label: "LONG", cls: "bg-[#dbeafe] text-[#1d4ed8]" },
  SHORT:     { label: "SHORT", cls: "bg-[#f3e8ff] text-[#7c3aed]" },
};

function KindBadge({ kind }: { kind: ContentKind }) {
  const meta = KIND_BADGE[kind];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

function SyncBadge({ enabled }: { enabled: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${enabled ? "bg-[#ecfdf5] text-[#047857]" : "bg-[#f1f5f9] text-[#5d6f86]"}`}>
      {enabled ? "ON" : "OFF"}
    </span>
  );
}

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${active ? "bg-emerald-50 text-emerald-600" : "bg-[#f1f5f9] text-[#5d6f86]"}`}>
      {active ? "활성" : "비활성"}
    </span>
  );
}

// ── 탭 필터 ──────────────────────────────────────────────────────────────────

const TABS = [
  { label: "전체", value: "" },
  { label: "말씀 (LONG_FORM)", value: "LONG_FORM" },
  { label: "쇼츠 (SHORT)", value: "SHORT" },
] as const;

function TabFilter({ current }: { current: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {TABS.map((tab) => {
        const isActive = tab.value === current;
        const params = new URLSearchParams();
        if (tab.value) params.set("kind", tab.value);
        const href = `/admin/media${params.toString() ? `?${params.toString()}` : ""}`;
        return (
          <Link
            key={tab.value}
            href={href}
            className={
              isActive
                ? "rounded-lg bg-[#3f74c7] px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition"
                : "rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#5d6f86] transition hover:bg-[#f1f5f9]"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

// ── 행 ───────────────────────────────────────────────────────────────────────

function PlaylistRow({ playlist }: { playlist: AdminPlaylist }) {
  const lastSynced = playlist.lastSyncedAt
    ? new Date(playlist.lastSyncedAt).toLocaleDateString("ko-KR", {
        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
      })
    : "---";

  return (
    <tr className="border-b border-[#f0f4f8] transition hover:bg-[#fafcff]">
      <td className="px-5 py-4 align-middle text-[13px] font-semibold text-[#0f1c2e]">
        {playlist.menuName}
      </td>
      <td className="px-5 py-4 align-middle font-mono text-[12px] text-[#5d6f86]">
        {playlist.siteKey}
      </td>
      <td className="px-5 py-4 align-middle">
        <span className="block max-w-[100px] truncate font-mono text-[12px] text-[#8fa3bb]">
          {playlist.slug}
        </span>
      </td>
      <td className="px-5 py-4 align-middle text-center">
        <KindBadge kind={playlist.contentKind} />
      </td>
      <td className="px-5 py-4 align-middle">
        <span className="block max-w-[80px] truncate font-mono text-[11px] text-[#8fa3bb]">
          {playlist.youtubePlaylistId}
        </span>
      </td>
      <td className="px-5 py-4 align-middle text-right text-[13px] font-semibold text-[#132033]">
        {playlist.itemCount}
      </td>
      <td className="px-5 py-4 align-middle text-center">
        <SyncBadge enabled={playlist.syncEnabled} />
      </td>
      <td className="whitespace-nowrap px-5 py-4 align-middle text-[12px] text-[#5d6f86]">
        {lastSynced}
      </td>
      <td className="px-5 py-4 align-middle text-center">
        <ActiveBadge active={playlist.active} />
      </td>
      <td className="px-5 py-4 align-middle text-center">
        <Link
          href={`/admin/media/${playlist.siteKey}`}
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#bfd0ea] bg-[#edf4ff] px-3 text-[12px] font-medium text-[#2d5da8] transition hover:bg-[#e4efff]"
        >
          <EyeIcon />
          상세
        </Link>
      </td>
    </tr>
  );
}

// ── 페이지네이션 ─────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  baseHref,
}: {
  page: number;
  totalPages: number;
  baseHref: string;
}) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  function buildHref(p: number) {
    const url = new URL(baseHref, "http://localhost");
    url.searchParams.set("page", String(p));
    return `${url.pathname}${url.search}`;
  }

  return (
    <div className="flex items-center justify-center gap-1">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5d6f86] transition hover:bg-[#f1f5f9]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      ) : (
        <button disabled className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5d6f86] disabled:opacity-40">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] transition ${
            p === page
              ? "bg-[#3f74c7] font-semibold text-white"
              : "font-medium text-[#5d6f86] hover:bg-[#f1f5f9]"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5d6f86] transition hover:bg-[#f1f5f9]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      ) : (
        <button disabled className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5d6f86] disabled:opacity-40">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────

interface PlaylistListPageProps {
  searchParams: Promise<{
    kind?: string;
    search?: string;
    page?: string;
    sort?: string;
    order?: string;
  }>;
}

export default async function PlaylistListPage({ searchParams }: PlaylistListPageProps) {
  const session = await getAdminSession();
  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/media");
  }

  const params = await searchParams;
  const kind = params.kind ?? "";
  const search = params.search ?? "";
  const page = Number(params.page) || 1;
  const sort = params.sort ?? "";
  const order = params.order ?? "";

  const { data: playlists, pagination } = await getAdminPlaylists(session.user.id ?? "", {
    kind: kind || undefined,
    search: search || undefined,
    page,
    size: 20,
    sort: sort || undefined,
    order: order || undefined,
  });

  // Build base href for pagination
  const baseParams = new URLSearchParams();
  if (kind) baseParams.set("kind", kind);
  if (search) baseParams.set("search", search);
  if (sort) baseParams.set("sort", sort);
  if (order) baseParams.set("order", order);
  const baseHref = `/admin/media${baseParams.toString() ? `?${baseParams.toString()}` : ""}`;

  const HEADERS = [
    "재생목록명", "siteKey", "slug", "콘텐츠 유형", "YT PL ID",
    "영상 수", "동기화", "마지막 동기화", "활성 여부", "상세",
  ];

  return (
    <div className="space-y-5">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <Link href="/admin" className="flex items-center transition hover:text-[#3f74c7]">
          <HomeIcon />
          홈
        </Link>
        <Chevron />
        <span className="text-[#4a6484]">콘텐츠</span>
        <Chevron />
        <span className="font-medium text-[#132033]">재생목록 관리</span>
      </nav>

      {/* 페이지 제목 */}
      <h1 className="text-xl font-bold text-[#0f1c2e]">재생목록 관리</h1>

      {/* 탭 필터 */}
      <TabFilter current={kind} />

      {/* 검색 바 + 결과 수 */}
      <div className="flex items-center justify-between gap-4">
        <form method="get" action="/admin/media" className="relative max-w-sm flex-1">
          {kind && <input type="hidden" name="kind" value={kind} />}
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="재생목록명 또는 siteKey 검색"
            className="w-full rounded-xl border border-[#dde4ef] bg-white py-2.5 pl-10 pr-4 text-[13px] text-[#132033] outline-none transition focus:border-[#3f74c7] focus:ring-2 focus:ring-[#3f74c7]/30"
          />
          <SearchIcon />
        </form>
        <p className="text-[13px] text-[#5d6f86]">
          전체 <span className="font-semibold text-[#132033]">{pagination.totalElements}</span>건
        </p>
      </div>

      {/* 테이블 */}
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {HEADERS.map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playlists.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center">
                    <p className="text-[13px] font-semibold text-[#132033]">재생목록이 없습니다.</p>
                    <p className="mt-1 text-[12px] text-[#8fa3bb]">검색 조건을 변경해 보세요.</p>
                  </td>
                </tr>
              ) : (
                playlists.map((playlist) => (
                  <PlaylistRow key={playlist.id} playlist={playlist} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <Pagination page={pagination.page} totalPages={pagination.totalPages} baseHref={baseHref} />
    </div>
  );
}
