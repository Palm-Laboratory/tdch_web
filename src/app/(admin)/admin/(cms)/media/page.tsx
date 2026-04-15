import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import {
  ADMIN_CONTENT_KIND_META,
  ADMIN_PLAYLIST_STATUS_META,
  formatAdminMediaDateTime,
  formatAdminMediaDate,
  getAdminSyncJobStatusMeta,
  getAdminPlaylists,
  getAdminSyncJobs,
  type AdminPlaylist,
} from "@/lib/admin-media-api";
import DiscoverPlaylistsButton from "./_components/discover-playlists-button";
import { discoverAdminPlaylistsAction } from "./actions";

function Badge({ label, cls }: { label: string; cls: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>{label}</span>;
}

function PlaylistRow({ item, rowNum }: { item: AdminPlaylist; rowNum: number }) {
  const discoveredAt = formatAdminMediaDate(item.discoveredAt, "—");
  const lastSyncedAt = formatAdminMediaDate(item.lastSyncedAt, "미동기화");

  return (
    <tr className="border-b border-[#f0f4f8] transition hover:bg-[#fafcff]">
      <td className="px-5 py-4 align-middle text-[13px] text-[#5d6f86]">{rowNum}</td>
      <td className="px-5 py-4 align-middle">
        <Badge {...ADMIN_PLAYLIST_STATUS_META[item.status]} />
      </td>
      <td className="px-5 py-4 align-middle">
        <Badge {...ADMIN_CONTENT_KIND_META[item.contentKind]} />
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
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
            item.syncEnabled ? "bg-emerald-50 text-emerald-600" : "bg-[#f1f5f9] text-[#8fa3bb]"
          }`}
        >
          {item.syncEnabled ? "Sync 사용" : "Sync 중지"}
        </span>
        <p className="mt-1 text-[11px] text-[#8fa3bb]">{lastSyncedAt}</p>
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

export default async function AdminMediaPage(props: Record<string, never>) {
  void props;
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/media");
  }

  const actorId = session.user.id ?? "";
  const [{ data: playlists }, syncJobs] = await Promise.all([
    getAdminPlaylists(actorId, { page: 1, size: 100, sort: "menuName", order: "asc" }),
    getAdminSyncJobs(actorId),
  ]);

  const draftCount = playlists.filter((item) => item.status === "DRAFT").length;
  const publishedCount = playlists.filter((item) => item.status === "PUBLISHED").length;
  const inactiveCount = playlists.filter((item) => item.status === "INACTIVE").length;
  const syncEnabledCount = playlists.filter((item) => item.syncEnabled).length;
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
        <DiscoverPlaylistsButton action={discoverAdminPlaylistsAction} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "전체 메뉴", value: playlists.length, tone: "bg-white border-[#e2e8f0]" },
          { label: "초안", value: draftCount, tone: "bg-[#fffaf0] border-[#fde7c7]" },
          { label: "게시", value: publishedCount, tone: "bg-[#f0fdf4] border-[#dcfce7]" },
          { label: "비활성", value: inactiveCount, tone: "bg-[#f8fafc] border-[#e2e8f0]" },
          { label: "Sync 사용", value: syncEnabledCount, tone: "bg-[#eff6ff] border-[#dbeafe]" },
        ].map((card) => (
          <section key={card.label} className={`rounded-2xl border px-5 py-4 shadow-sm ${card.tone}`}>
            <p className="text-[12px] font-medium text-[#5d6f86]">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-[#132033]">{card.value}</p>
          </section>
        ))}
      </div>

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
              <Badge label={latestSyncJobStatusMeta?.label ?? latestSyncJob.status} cls={latestSyncJobStatusMeta?.cls ?? "bg-[#f1f5f9] text-[#64748b]"} />
            </Link>
          ) : (
            <Badge label="이력 없음" cls="bg-[#f1f5f9] text-[#64748b]" />
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

      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {["번호", "상태", "유형", "메뉴 / slug", "YouTube Playlist", "영상 수", "Sync", "노출", "발견일"].map((header) => (
                  <th key={header} className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playlists.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center">
                    <p className="text-[13px] font-semibold text-[#132033]">등록된 예배 영상 메뉴가 없습니다.</p>
                    <p className="mt-1 text-[12px] text-[#8fa3bb]">우측 상단 버튼으로 미연결 재생목록을 먼저 불러오세요.</p>
                  </td>
                </tr>
              ) : (
                playlists.map((item, index) => <PlaylistRow key={item.id} item={item} rowNum={index + 1} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
