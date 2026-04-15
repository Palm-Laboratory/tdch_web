import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { AdminApiError } from "@/lib/admin-api";
import {
  ADMIN_CONTENT_KIND_META,
  ADMIN_PLAYLIST_OPERATION_STATUS_META,
  ADMIN_PLAYLIST_STATUS_META,
  formatAdminMediaDate,
  formatAdminMediaDateTime,
  getAdminPlaylist,
  getAdminPlaylistVideos,
  type AdminPlaylistDetailResponse,
  type AdminVideo,
} from "@/lib/admin-media-api";
import AdminMediaDetailForm from "./_components/admin-media-detail-form";
import { updateAdminMediaDetailAction } from "./actions";

function Badge({ label, cls }: { label: string; cls: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>{label}</span>;
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white px-4 py-3">
      <p className="text-[11px] font-medium text-[#8fa3bb]">{label}</p>
      <p className="mt-1 break-words text-[13px] font-medium text-[#132033]">{value}</p>
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-[14px] font-bold text-[#0f1c2e]">{title}</h2>
      <p className="mt-1 text-[12px] text-[#8fa3bb]">{description}</p>
    </div>
  );
}

function DetailFieldGrid({
  fields,
}: {
  fields: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
      {fields.map((field) => (
        <DetailField key={field.label} label={field.label} value={field.value} />
      ))}
    </div>
  );
}

function VideoRow({ siteKey, video }: { siteKey: string; video: AdminVideo }) {
  return (
    <tr className="border-b border-[#f0f4f8] transition hover:bg-[#fafcff]">
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{video.position + 1}</td>
      <td className="px-5 py-4 align-middle">
        <Link
          href={`/admin/media/${encodeURIComponent(siteKey)}/videos/${encodeURIComponent(video.youtubeVideoId)}`}
          className="text-[13px] font-semibold text-[#0f1c2e] transition hover:text-[#3f74c7]"
        >
          {video.displayTitle}
        </Link>
        <p className="mt-0.5 text-[11px] text-[#8fa3bb]">{video.originalTitle}</p>
      </td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{video.displayPublishedDate}</td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{video.preacher || "—"}</td>
      <td className="px-5 py-4 align-middle">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${video.visible ? "bg-emerald-50 text-emerald-600" : "bg-[#f1f5f9] text-[#8fa3bb]"}`}>
          {video.visible ? "노출" : "숨김"}
        </span>
      </td>
      <td className="px-5 py-4 align-middle">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${video.featured ? "bg-[#eff6ff] text-[#1d4ed8]" : "bg-[#f1f5f9] text-[#8fa3bb]"}`}>
          {video.featured ? "대표" : "일반"}
        </span>
      </td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{video.pinnedRank ?? "—"}</td>
    </tr>
  );
}

async function loadPlaylist(actorId: string, siteKey: string): Promise<AdminPlaylistDetailResponse> {
  try {
    return await getAdminPlaylist(actorId, siteKey);
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function AdminMediaDetailPage({
  params,
}: {
  params: Promise<{ siteKey: string }>;
}) {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/media");
  }

  const { siteKey } = await params;
  const actorId = session.user.id ?? "";
  const [playlist, videosResponse] = await Promise.all([
    loadPlaylist(actorId, siteKey),
    getAdminPlaylistVideos(actorId, siteKey, { page: 1, size: 20 }),
  ]);
  const saveAction = updateAdminMediaDetailAction.bind(null, siteKey);
  const videos = videosResponse.data;
  const operationStatusMeta = ADMIN_PLAYLIST_OPERATION_STATUS_META[playlist.operationStatus];

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <Link href="/admin" className="transition hover:text-[#3f74c7]">
          홈
        </Link>
        <span>·</span>
        <Link href="/admin/media" className="transition hover:text-[#3f74c7]">
          예배 영상
        </Link>
        <span>·</span>
        <span className="font-medium text-[#132033]">{playlist.menuName}</span>
      </nav>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f1c2e]">{playlist.menuName}</h1>
          <p className="mt-1 text-[13px] text-[#5d6f86]">
            메뉴 정보와 public 노출 설정을 이 화면에서 바로 수정할 수 있습니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge {...ADMIN_PLAYLIST_STATUS_META[playlist.status]} />
          <Badge {...ADMIN_CONTENT_KIND_META[playlist.contentKind]} />
          <Badge label={operationStatusMeta.label} cls={operationStatusMeta.cls} />
        </div>
      </div>

      <section className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-5 py-4 shadow-sm">
        <h2 className="text-[14px] font-bold text-[#0f1c2e]">운영 안내</h2>
        <p className="mt-2 text-[13px] text-[#45576e]">{operationStatusMeta.description}</p>
        {playlist.operationStatus === "SYNC_FAILED" && playlist.lastSyncErrorMessage ? (
          <p className="mt-1 text-[12px] text-[#8fa3bb]">최근 오류: {playlist.lastSyncErrorMessage}</p>
        ) : null}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <AdminMediaDetailForm playlist={playlist} saveAction={saveAction} />

        <div className="space-y-5">
          <DetailFieldGrid
            fields={[
              { label: "YouTube Playlist", value: playlist.youtubePlaylistId },
              { label: "slug", value: playlist.slug },
              { label: "siteKey", value: playlist.siteKey },
              { label: "영상 수", value: `${playlist.itemCount}개` },
            ]}
          />

          <section className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm">
            <SectionTitle title="메타 정보" description="관리자가 입력한 부가 정보와 이력입니다." />
            <DetailFieldGrid
              fields={[
                { label: "발견일", value: formatAdminMediaDate(playlist.discoveredAt, "—") },
                { label: "최근 발견", value: formatAdminMediaDateTime(playlist.lastDiscoveredAt, "—") },
                { label: "게시일", value: formatAdminMediaDate(playlist.publishedAt, "—") },
                { label: "마지막 수정자", value: playlist.lastModifiedBy ? String(playlist.lastModifiedBy) : "—" },
                { label: "마지막 sync", value: formatAdminMediaDate(playlist.lastSyncedAt, "—") },
                { label: "sync 성공", value: formatAdminMediaDateTime(playlist.lastSyncSucceededAt, "—") },
                { label: "sync 실패", value: formatAdminMediaDateTime(playlist.lastSyncFailedAt, "—") },
                { label: "sync 오류", value: playlist.lastSyncErrorMessage ?? "—" },
                { label: "발견 원본", value: playlist.discoverySource ?? "—" },
              ]}
            />
          </section>

          <section className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm">
            <SectionTitle title="YouTube 정보" description="현재 연결된 재생목록의 원본 메타 정보입니다." />
            <DetailFieldGrid
              fields={[
                { label: "채널명", value: playlist.channelTitle },
                { label: "썸네일", value: playlist.thumbnailUrl },
                { label: "원본 제목", value: playlist.youtubeTitle },
                { label: "원본 설명", value: playlist.youtubeDescription || "—" },
              ]}
            />
          </section>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-[#edf2f7] px-5 py-4">
          <div>
            <h2 className="text-[14px] font-bold text-[#0f1c2e]">영상 메타데이터</h2>
            <p className="mt-1 text-[12px] text-[#8fa3bb]">최근 {videos.length}개 영상을 보고 개별 메타데이터 편집 화면으로 이동합니다.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {["순번", "영상", "표시 날짜", "설교자", "노출", "대표", "고정"].map((header) => (
                  <th key={header} className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-[13px] text-[#5d6f86]">
                    아직 sync된 영상이 없습니다.
                  </td>
                </tr>
              ) : (
                videos.map((video) => <VideoRow key={video.youtubeVideoId} siteKey={siteKey} video={video} />)
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
