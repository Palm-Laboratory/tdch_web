import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getAdminSession, isAdminSession } from "@/auth";
import { AdminApiError } from "@/lib/admin-api";
import {
  getAdminPlaylistDetail,
  getAdminVideos,
  type ContentKind,
} from "@/lib/admin-media-api";
import PlaylistInfoCard from "./_components/playlist-info-card";
import VideoListTable from "./_components/video-list-table";
import { updatePlaylistAction, updateVideoMetadataAction } from "../actions";

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

// ── 배지 ──────────────────────────────────────────────────────────────────────

const KIND_BADGE: Record<ContentKind, { label: string; cls: string }> = {
  LONG_FORM: { label: "LONG_FORM", cls: "bg-[#dbeafe] text-[#1d4ed8]" },
  SHORT:     { label: "SHORT", cls: "bg-[#f3e8ff] text-[#7c3aed]" },
};

// ── YouTube 정보 카드 (서버 컴포넌트) ─────────────────────────────────────────

function PlaylistYoutubeCard({
  playlist,
}: {
  playlist: {
    youtubePlaylistId: string;
    youtubeTitle: string;
    channelTitle: string;
    itemCount: number;
    lastSyncedAt: string | null;
  };
}) {
  const lastSynced = playlist.lastSyncedAt
    ? new Date(playlist.lastSyncedAt).toLocaleDateString("ko-KR", {
        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
      })
    : "---";

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
      <div className="border-b border-[#f0f4f8] px-6 py-4">
        <h2 className="text-[14px] font-bold text-[#0f1c2e]">YouTube 정보</h2>
      </div>
      <div className="space-y-3 px-6 py-5">
        <div>
          <p className="text-[11px] font-medium text-[#8fa3bb]">YT Playlist ID</p>
          <p className="mt-0.5 font-mono text-[13px] text-[#132033]">{playlist.youtubePlaylistId}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#8fa3bb]">YT 제목</p>
          <p className="mt-0.5 text-[13px] text-[#132033]">{playlist.youtubeTitle}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#8fa3bb]">채널</p>
          <p className="mt-0.5 text-[13px] text-[#132033]">{playlist.channelTitle}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#8fa3bb]">영상 수</p>
          <p className="mt-0.5 text-[13px] font-semibold text-[#132033]">{playlist.itemCount}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#8fa3bb]">마지막 동기화</p>
          <p className="mt-0.5 text-[13px] text-[#132033]">{lastSynced}</p>
        </div>
      </div>
    </section>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────

interface PlaylistDetailPageProps {
  params: Promise<{ siteKey: string }>;
  searchParams: Promise<{
    visible?: string;
    featured?: string;
    videoSearch?: string;
    videoPage?: string;
  }>;
}

export default async function PlaylistDetailPage({ params, searchParams }: PlaylistDetailPageProps) {
  const session = await getAdminSession();
  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/media");
  }

  const { siteKey } = await params;
  const sp = await searchParams;
  const actorId = session.user.id ?? "";

  // Fetch playlist detail
  let playlist;
  try {
    playlist = await getAdminPlaylistDetail(actorId, siteKey);
  } catch (err) {
    if (err instanceof AdminApiError && err.status === 404) notFound();
    throw err;
  }

  // Fetch videos
  const videoPage = Number(sp.videoPage) || 1;
  const videosResponse = await getAdminVideos(actorId, siteKey, {
    visible: sp.visible || undefined,
    featured: sp.featured || undefined,
    search: sp.videoSearch || undefined,
    page: videoPage,
    size: 20,
  });

  // Bind server actions
  const boundUpdatePlaylist = updatePlaylistAction.bind(null, siteKey);
  const boundUpdateVideo = updateVideoMetadataAction.bind(null, siteKey);

  const kindMeta = KIND_BADGE[playlist.contentKind];

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
        <Link href="/admin/media" className="text-[#4a6484] transition hover:text-[#3f74c7]">
          재생목록 관리
        </Link>
        <Chevron />
        <span className="font-medium text-[#132033]">{playlist.menuName}</span>
      </nav>

      {/* 페이지 헤더 */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-[#0f1c2e]">{playlist.menuName}</h1>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${kindMeta.cls}`}>
          {kindMeta.label}
        </span>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
          playlist.active ? "bg-emerald-50 text-emerald-600" : "bg-[#f1f5f9] text-[#5d6f86]"
        }`}>
          {playlist.active ? "활성" : "비활성"}
        </span>
      </div>

      {/* 정보 카드 2열 그리드 */}
      <div className="grid gap-5 lg:grid-cols-2">
        <PlaylistInfoCard playlist={playlist} updateAction={boundUpdatePlaylist} />
        <PlaylistYoutubeCard playlist={playlist} />
      </div>

      {/* 영상 목록 */}
      <Suspense fallback={<VideoTableSkeleton />}>
        <VideoListTable
          siteKey={siteKey}
          initialData={videosResponse}
          updateVideoAction={boundUpdateVideo}
        />
      </Suspense>
    </div>
  );
}

// ── 스켈레톤 ─────────────────────────────────────────────────────────────────

function VideoTableSkeleton() {
  return (
    <>
      <h2 className="text-[16px] font-bold text-[#0f1c2e]">영상 목록</h2>
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {["순서", "노출", "썸네일", "표시 제목", "공개일", "설교자", "본문", "대표", "수정"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#f0f4f8]">
                  <td className="px-5 py-4"><div className="h-3 w-8 animate-pulse rounded bg-[#e2e8f0]" /></td>
                  <td className="px-5 py-4"><div className="h-5 w-12 animate-pulse rounded-full bg-[#e2e8f0]" /></td>
                  <td className="px-5 py-4"><div className="h-[36px] w-[64px] animate-pulse rounded-md bg-[#e2e8f0]" /></td>
                  <td className="px-5 py-4"><div className="h-3 w-32 animate-pulse rounded bg-[#e2e8f0]" /></td>
                  <td className="px-5 py-4"><div className="h-3 w-16 animate-pulse rounded bg-[#e2e8f0]" /></td>
                  <td className="px-5 py-4"><div className="h-3 w-12 animate-pulse rounded bg-[#e2e8f0]" /></td>
                  <td className="px-5 py-4"><div className="h-3 w-16 animate-pulse rounded bg-[#e2e8f0]" /></td>
                  <td className="px-5 py-4"><div className="h-5 w-10 animate-pulse rounded-full bg-[#e2e8f0]" /></td>
                  <td className="px-5 py-4"><div className="h-8 w-14 animate-pulse rounded-lg bg-[#e2e8f0]" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
