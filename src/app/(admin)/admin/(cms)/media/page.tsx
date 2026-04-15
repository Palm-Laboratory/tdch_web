import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import {
  ADMIN_CONTENT_KIND_META,
  ADMIN_PLAYLIST_OPERATION_STATUS_META,
  ADMIN_PLAYLIST_STATUS_META,
  formatAdminMediaDateTime,
  formatAdminMediaDate,
  getAdminSyncJobStatusMeta,
  getAdminPlaylists,
  getAdminSyncJobs,
  type AdminSyncJob,
  type AdminPlaylist,
} from "@/lib/admin-media-api";
import DiscoverPlaylistsButton from "./_components/discover-playlists-button";
import AdminMediaSyncButton from "./_components/admin-media-sync-button";
import AdminMediaFilterForm from "./_components/admin-media-filter-form";
import { discoverAdminPlaylistsAction, runAdminMediaSyncAction } from "./actions";

function Badge({ label, className }: { label: string; className: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}>{label}</span>;
}

type StatusFilter = "all" | "draft" | "published" | "inactive";
type SyncFilter = "all" | "enabled" | "disabled";

interface AdminMediaPageProps {
  searchParams?: Promise<{
    status?: string | string[];
    sync?: string | string[];
    search?: string | string[];
  }>;
}

interface AdminMediaFilters {
  status: StatusFilter;
  sync: SyncFilter;
  search: string;
}

interface SummaryCardProps {
  label: string;
  value: number;
  tone: string;
}

function getFirst(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function normalizeStatus(value: string): StatusFilter {
  if (value === "draft" || value === "published" || value === "inactive") {
    return value;
  }

  return "all";
}

function normalizeSync(value: string): SyncFilter {
  if (value === "enabled" || value === "disabled") {
    return value;
  }

  return "all";
}

function getAdminMediaFilters(searchParams?: { status?: string | string[]; sync?: string | string[]; search?: string | string[] }): AdminMediaFilters {
  const status = normalizeStatus(getFirst(searchParams?.status).trim().toLowerCase());
  const sync = normalizeSync(getFirst(searchParams?.sync).trim().toLowerCase());
  const search = getFirst(searchParams?.search).trim();

  return { status, sync, search };
}

function matchesStatusFilter(item: AdminPlaylist, status: StatusFilter): boolean {
  return (
    status === "all" ||
    (status === "draft" && item.status === "DRAFT") ||
    (status === "published" && item.status === "PUBLISHED") ||
    (status === "inactive" && item.status === "INACTIVE")
  );
}

function matchesSyncFilter(item: AdminPlaylist, sync: SyncFilter): boolean {
  return sync === "all" || (sync === "enabled" && item.syncEnabled) || (sync === "disabled" && !item.syncEnabled);
}

function matchesSearchFilter(item: AdminPlaylist, search: string): boolean {
  const loweredSearch = search.toLowerCase();

  return (
    !loweredSearch ||
    item.menuName.toLowerCase().includes(loweredSearch) ||
    item.siteKey.toLowerCase().includes(loweredSearch) ||
    item.slug.toLowerCase().includes(loweredSearch) ||
    item.youtubePlaylistId.toLowerCase().includes(loweredSearch)
  );
}

function filterAdminPlaylists(playlists: AdminPlaylist[], filters: AdminMediaFilters): AdminPlaylist[] {
  return playlists.filter((item) => matchesStatusFilter(item, filters.status) && matchesSyncFilter(item, filters.sync) && matchesSearchFilter(item, filters.search));
}

function buildSummaryCards(playlists: AdminPlaylist[]): SummaryCardProps[] {
  return [
    { label: "전체 메뉴", value: playlists.length, tone: "bg-white border-[#e2e8f0]" },
    { label: "초안", value: countByStatus(playlists, "DRAFT"), tone: "bg-[#fffaf0] border-[#fde7c7]" },
    { label: "게시", value: countByStatus(playlists, "PUBLISHED"), tone: "bg-[#f0fdf4] border-[#dcfce7]" },
    { label: "비활성", value: countByStatus(playlists, "INACTIVE"), tone: "bg-[#f8fafc] border-[#e2e8f0]" },
    { label: "Sync 사용", value: countEnabledSync(playlists), tone: "bg-[#eff6ff] border-[#dbeafe]" },
  ];
}

function countByStatus(playlists: AdminPlaylist[], status: AdminPlaylist["status"]): number {
  return playlists.filter((item) => item.status === status).length;
}

function countEnabledSync(playlists: AdminPlaylist[]): number {
  return playlists.filter((item) => item.syncEnabled).length;
}

function SummaryCard({ label, value, tone }: SummaryCardProps) {
  return (
    <section className={`rounded-2xl border px-5 py-4 shadow-sm ${tone}`}>
      <p className="text-[12px] font-medium text-[#5d6f86]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#132033]">{value}</p>
    </section>
  );
}

function LatestSyncJobSummary({
  latestSyncJob,
  latestSyncJobStatusMeta,
}: {
  latestSyncJob: AdminSyncJob | null;
  latestSyncJobStatusMeta: { label: string; cls: string } | null;
}) {
  return (
    <section className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[14px] font-bold text-[#0f1c2e]">최근 Sync 상태</h2>
          <p className="mt-1 text-[12px] text-[#8fa3bb]">정기 sync와 수동 sync의 최신 실행 결과입니다.</p>
        </div>
        {latestSyncJob ? (
          <Link
            href={`/admin/media/sync-jobs/${latestSyncJob.id}`}
            className="transition hover:opacity-80"
            aria-label="최근 sync 상세 보기"
          >
            <Badge
              label={latestSyncJobStatusMeta?.label ?? latestSyncJob.status}
              className={latestSyncJobStatusMeta?.cls ?? "bg-[#f1f5f9] text-[#64748b]"}
            />
          </Link>
        ) : (
          <Badge label="이력 없음" className="bg-[#f1f5f9] text-[#64748b]" />
        )}
      </div>

      {latestSyncJob ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div>
            <p className="text-[11px] text-[#8fa3bb]">시작 시각</p>
            <p className="mt-1 text-[13px] text-[#132033]">{formatAdminMediaDateTime(latestSyncJob.startedAt, "—")}</p>
          </div>
          <div>
            <p className="text-[11px] text-[#8fa3bb]">대상 재생목록</p>
            <p className="mt-1 text-[13px] text-[#132033]">{latestSyncJob.totalPlaylists}개</p>
          </div>
          <div>
            <p className="text-[11px] text-[#8fa3bb]">성공 / 실패</p>
            <p className="mt-1 text-[13px] text-[#132033]">
              {latestSyncJob.succeededPlaylists} / {latestSyncJob.failedPlaylists}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#8fa3bb]">오류 요약</p>
            <p className="mt-1 text-[13px] text-[#132033]">{latestSyncJob.errorSummary || "없음"}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-[13px] text-[#5d6f86]">아직 실행된 sync 이력이 없습니다.</p>
      )}
    </section>
  );
}

function PlaylistRow({ item, rowNum }: { item: AdminPlaylist; rowNum: number }) {
  const discoveredAt = formatAdminMediaDate(item.discoveredAt, "—");
  const lastDiscoveredAt = formatAdminMediaDateTime(item.lastDiscoveredAt, "—");
  const lastSyncedAt = formatAdminMediaDate(item.lastSyncedAt, "미동기화");
  const lastSyncSucceededAt = formatAdminMediaDateTime(item.lastSyncSucceededAt, "—");
  const lastSyncFailedAt = formatAdminMediaDateTime(item.lastSyncFailedAt, "—");
  const operationStatusMeta = ADMIN_PLAYLIST_OPERATION_STATUS_META[item.operationStatus];

  return (
    <tr className="border-b border-[#f0f4f8] transition hover:bg-[#fafcff]">
      <td className="px-5 py-4 align-middle text-[13px] text-[#5d6f86]">{rowNum}</td>
      <td className="px-5 py-4 align-middle">
        <Badge label={ADMIN_PLAYLIST_STATUS_META[item.status].label} className={ADMIN_PLAYLIST_STATUS_META[item.status].cls} />
      </td>
      <td className="px-5 py-4 align-middle">
        <Badge label={ADMIN_CONTENT_KIND_META[item.contentKind].label} className={ADMIN_CONTENT_KIND_META[item.contentKind].cls} />
      </td>
      <td className="px-5 py-4 align-middle">
        <Link
          href={`/admin/media/${encodeURIComponent(item.siteKey)}`}
          className="text-[13px] font-semibold text-[#0f1c2e] transition hover:text-[#3f74c7]"
        >
          {item.menuName}
        </Link>
        <p className="mt-0.5 text-[11px] text-[#8fa3bb]">
          {item.siteKey} / {item.slug}
        </p>
      </td>
      <td className="px-5 py-4 align-middle">
        <p className="font-mono text-[12px] text-[#31445f]">{item.youtubePlaylistId}</p>
      </td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">
        <p>{item.itemCount}개</p>
        <p className="mt-0.5 text-[11px] text-[#8fa3bb]">정렬 {item.sortOrder}</p>
      </td>
      <td className="px-5 py-4 align-middle">
        <Badge label={operationStatusMeta.label} className={operationStatusMeta.cls} />
        <p className="mt-1 text-[11px] text-[#8fa3bb]">{operationStatusMeta.description}</p>
      </td>
      <td className="px-5 py-4 align-middle">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
            item.syncEnabled ? "bg-emerald-50 text-emerald-600" : "bg-[#f1f5f9] text-[#8fa3bb]"
          }`}
        >
          {item.syncEnabled ? "Sync 사용" : "Sync 중지"}
        </span>
        <p className="mt-1 text-[11px] text-[#8fa3bb]">{lastSyncedAt}</p>
        <div className="mt-1 space-y-0.5 text-[11px] text-[#8fa3bb]">
          <p>발견 {lastDiscoveredAt}</p>
          <p>성공 {lastSyncSucceededAt}</p>
          <p>실패 {lastSyncFailedAt}</p>
          <p>원본 {item.discoverySource ?? "—"}</p>
        </div>
      </td>
      <td className="px-5 py-4 align-middle">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
            item.navigationVisible ? "bg-[#edf4ff] text-[#2d5da8]" : "bg-[#f8fafc] text-[#94a3b8]"
          }`}
        >
          {item.navigationVisible ? "메뉴 노출" : "메뉴 숨김"}
        </span>
        <p className="mt-1 text-[11px] text-[#8fa3bb]">{item.active ? "활성 URL" : "비활성 URL"}</p>
      </td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{discoveredAt}</td>
    </tr>
  );
}

export default async function AdminMediaPage({ searchParams }: AdminMediaPageProps) {
  const session = await getAdminSession();
  const resolvedSearchParams = await searchParams;
  const { status: currentStatus, sync: currentSync, search: currentSearch } = getAdminMediaFilters(resolvedSearchParams);

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/media");
  }

  const actorId = session.user.id ?? "";
  const [{ data: playlists }, syncJobs] = await Promise.all([
    getAdminPlaylists(actorId, {
      search: currentSearch || undefined,
      page: 1,
      size: 100,
      sort: "menuName",
      order: "asc",
    }),
    getAdminSyncJobs(actorId),
  ]);

  const filteredPlaylists = filterAdminPlaylists(playlists, { status: currentStatus, sync: currentSync, search: currentSearch });
  const summaryCards = buildSummaryCards(filteredPlaylists);
  const latestSyncJob = syncJobs.data[0] ?? null;
  const latestSyncJobStatusMeta = latestSyncJob ? getAdminSyncJobStatusMeta(latestSyncJob.status) : null;

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <Link href="/admin" className="flex items-center transition hover:text-[#3f74c7]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="mr-1">
            <path d="M1.5 7.5L7 2l5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 6.5V12h3V9h2v3h3V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          홈
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[#4a6484]">운영</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-medium text-[#132033]">예배 영상</span>
      </nav>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f1c2e]">예배 영상 관리</h1>
          <p className="mt-1 text-[13px] text-[#5d6f86]">
            메뉴, 유튜브 재생목록, sync 상태를 한 화면에서 확인합니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminMediaSyncButton action={runAdminMediaSyncAction} />
          <DiscoverPlaylistsButton action={discoverAdminPlaylistsAction} />
        </div>
      </div>

      <AdminMediaFilterForm
        currentStatus={currentStatus}
        currentSync={currentSync}
        currentSearch={currentSearch}
        currentPath="/admin/media"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      <LatestSyncJobSummary latestSyncJob={latestSyncJob} latestSyncJobStatusMeta={latestSyncJobStatusMeta} />

      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {["번호", "상태", "유형", "메뉴 / slug", "YouTube Playlist", "영상 수", "운영 상태", "Sync", "노출", "발견일"].map((header) => (
                  <th key={header} className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playlists.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center">
                    <p className="text-[13px] font-semibold text-[#132033]">등록된 예배 영상 메뉴가 없습니다.</p>
                    <p className="mt-1 text-[12px] text-[#8fa3bb]">우측 상단 버튼으로 미연결 재생목록을 먼저 불러오세요.</p>
                  </td>
                </tr>
              ) : filteredPlaylists.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center">
                    <p className="text-[13px] font-semibold text-[#132033]">검색 결과가 없습니다.</p>
                    <p className="mt-1 text-[12px] text-[#8fa3bb]">상태, Sync, 검색어를 다시 조정해 보세요.</p>
                  </td>
                </tr>
              ) : (
                filteredPlaylists.map((item, index) => <PlaylistRow key={item.id} item={item} rowNum={index + 1} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
