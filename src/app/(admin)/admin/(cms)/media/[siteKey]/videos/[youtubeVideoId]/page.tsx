import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { AdminApiError } from "@/lib/admin-api";
import { formatAdminMediaDate, getAdminPlaylist, getAdminVideoMetadata } from "@/lib/admin-media-api";
import type { AdminPlaylistDetailResponse, AdminVideoMetadataResponse } from "@/lib/admin-media-shared";
import AdminMediaVideoDetailForm from "./_components/admin-media-video-detail-form";
import { updateAdminMediaVideoAction } from "./actions";

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white px-4 py-3">
      <p className="text-[11px] font-medium text-[#8fa3bb]">{label}</p>
      <p className="mt-1 break-words text-[13px] font-medium text-[#132033]">{value}</p>
    </div>
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

async function loadVideoMetadata(actorId: string, youtubeVideoId: string): Promise<AdminVideoMetadataResponse> {
  try {
    return await getAdminVideoMetadata(actorId, youtubeVideoId);
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function AdminMediaVideoDetailPage({
  params,
}: {
  params: Promise<{ siteKey: string; youtubeVideoId: string }>;
}) {
  const session = await getAdminSession();
  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/media");
  }

  const { siteKey, youtubeVideoId } = await params;
  const actorId = session.user.id ?? "";

  const [playlist, video] = await Promise.all([
    loadPlaylist(actorId, siteKey),
    loadVideoMetadata(actorId, youtubeVideoId),
  ]);

  const saveAction = updateAdminMediaVideoAction.bind(null, siteKey, youtubeVideoId);

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <Link href="/admin" className="transition hover:text-[#3f74c7]">홈</Link>
        <span>·</span>
        <Link href="/admin/media" className="transition hover:text-[#3f74c7]">예배 영상</Link>
        <span>·</span>
        <Link href={`/admin/media/${encodeURIComponent(siteKey)}`} className="transition hover:text-[#3f74c7]">{playlist.menuName}</Link>
        <span>·</span>
        <span className="font-medium text-[#132033]">{video.manualTitle || video.originalTitle}</span>
      </nav>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f1c2e]">{video.manualTitle || video.originalTitle}</h1>
          <p className="mt-1 text-[13px] text-[#5d6f86]">재생목록 내 개별 영상의 표시 메타데이터를 수정합니다.</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <AdminMediaVideoDetailForm video={video} saveAction={saveAction} />

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <InfoField label="메뉴" value={playlist.menuName} />
            <InfoField label="YouTube Video ID" value={video.youtubeVideoId} />
            <InfoField label="원본 공개일" value={formatAdminMediaDate(video.publishedAt, "—")} />
            <InfoField label="마지막 sync" value={formatAdminMediaDate(video.lastSyncedAt, "—")} />
          </div>

          <section className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm">
            <h2 className="text-[14px] font-bold text-[#0f1c2e]">YouTube 원본</h2>
            <div className="mt-4 space-y-4">
              <InfoField label="원본 제목" value={video.originalTitle} />
              <InfoField label="설명" value={video.originalDescription || "—"} />
              <InfoField label="시청 URL" value={video.watchUrl} />
              <InfoField label="Embed URL" value={video.embedUrl} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
