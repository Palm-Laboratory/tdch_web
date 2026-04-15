import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { AdminApiError } from "@/lib/admin-api";
import {
  ADMIN_CONTENT_KIND_META,
  ADMIN_PLAYLIST_STATUS_META,
  formatAdminMediaDate,
  getAdminPlaylist,
  type AdminPlaylistDetailResponse,
} from "@/lib/admin-media-api";

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
  const playlist = await loadPlaylist(actorId, siteKey);

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
            예배 영상 메뉴의 현재 설정을 읽기 전용으로 보여줍니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge {...ADMIN_PLAYLIST_STATUS_META[playlist.status]} />
          <Badge {...ADMIN_CONTENT_KIND_META[playlist.contentKind]} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "YouTube Playlist", value: playlist.youtubePlaylistId },
          { label: "slug", value: playlist.slug },
          { label: "siteKey", value: playlist.siteKey },
          { label: "영상 수", value: `${playlist.itemCount}개` },
        ].map((field) => (
          <DetailField key={field.label} label={field.label} value={field.value} />
        ))}
      </div>

      <section className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm">
        <SectionTitle title="노출 상태" description="현재 public 네비게이션과 동기화 대상 여부입니다." />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <DetailField label="활성" value={playlist.active ? "활성" : "비활성"} />
          <DetailField label="메뉴 노출" value={playlist.navigationVisible ? "노출" : "숨김"} />
          <DetailField label="Sync" value={playlist.syncEnabled ? "사용" : "중지"} />
        </div>
      </section>

      <section className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm">
        <SectionTitle title="메타 정보" description="관리자가 입력한 부가 정보입니다." />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetailField label="설명" value={playlist.description || "—"} />
          <DetailField label="발견일" value={formatAdminMediaDate(playlist.discoveredAt, "—")} />
          <DetailField label="게시일" value={formatAdminMediaDate(playlist.publishedAt, "—")} />
          <DetailField label="마지막 수정자" value={playlist.lastModifiedBy ? String(playlist.lastModifiedBy) : "—"} />
          <DetailField label="마지막 sync" value={formatAdminMediaDate(playlist.lastSyncedAt, "—")} />
          <DetailField label="정렬 순서" value={String(playlist.sortOrder)} />
        </div>
      </section>

      <section className="rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 shadow-sm">
        <SectionTitle title="YouTube 정보" description="현재 연결된 재생목록의 원본 메타 정보입니다." />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <DetailField label="채널명" value={playlist.channelTitle} />
          <DetailField label="썸네일" value={playlist.thumbnailUrl} />
          <DetailField label="원본 제목" value={playlist.youtubeTitle} />
          <DetailField label="원본 설명" value={playlist.youtubeDescription || "—"} />
        </div>
      </section>
    </div>
  );
}
