import { notFound, redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { getAdminVideoDetail } from "@/lib/admin-videos-api";
import { AdminApiError } from "@/lib/admin-api";
import VideoEditClient from "./_components/video-edit-client";
import AdminBreadcrumb from "../../components/admin-breadcrumb";

interface AdminVideoDetailPageProps {
  params: Promise<{ videoId: string }>;
}

export default async function AdminVideoDetailPage({ params }: AdminVideoDetailPageProps) {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/videos/manage");
  }

  const { videoId } = await params;

  let detail;
  try {
    detail = await getAdminVideoDetail(videoId);
  } catch (err) {
    if (err instanceof AdminApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[
        { label: "운영" },
        { label: "영상" },
        { label: "영상 관리", href: "/admin/videos/manage" },
        { label: detail.sourceTitle },
      ]} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f1c2e]">{detail.title}</h1>
          <p className="mt-1 font-mono text-[12px] text-[#8fa3bb]">{detail.videoId}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <a
            href={`https://www.youtube.com/watch?v=${encodeURIComponent(detail.videoId)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center rounded-lg border border-[#d7e3f4] bg-white px-3 text-[12px] font-semibold text-[#334155] transition hover:bg-[#f0f6ff]"
          >
            유튜브 열기
          </a>
          {detail.publicHref && (
            <a
              href={detail.publicHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center rounded-lg border border-[#d7e3f4] bg-white px-3 text-[12px] font-semibold text-[#334155] transition hover:bg-[#f0f6ff]"
            >
              공개 화면 보기
            </a>
          )}
        </div>
      </div>

      <VideoEditClient initialDetail={detail} />
    </div>
  );
}
