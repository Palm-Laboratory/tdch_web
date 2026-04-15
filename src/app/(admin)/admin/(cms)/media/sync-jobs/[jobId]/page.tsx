import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { AdminApiError } from "@/lib/admin-api";
import { formatAdminMediaDateTime, getAdminSyncJob, getAdminSyncJobStatusMeta } from "@/lib/admin-media-api";
import type { AdminSyncJobDetailResponse } from "@/lib/admin-media-shared";

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white px-4 py-3">
      <p className="text-[11px] font-medium text-[#8fa3bb]">{label}</p>
      <p className="mt-1 break-words text-[13px] font-medium text-[#132033]">{value}</p>
    </div>
  );
}

function ItemRow({ item }: { item: AdminSyncJobDetailResponse["items"][number] }) {
  const statusMeta = getAdminSyncJobStatusMeta(item.status);

  return (
    <tr className="border-b border-[#f0f4f8] transition hover:bg-[#fafcff]">
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{item.id}</td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#132033]">{item.menuName || "—"}</td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{item.siteKey || "—"}</td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{item.youtubePlaylistId || "—"}</td>
      <td className="px-5 py-4 align-middle">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusMeta.cls}`}>
          {statusMeta.label}
        </span>
      </td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{item.processedItems}</td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">
        {item.insertedVideos} / {item.updatedVideos} / {item.deactivatedPlaylistVideos}
      </td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{formatAdminMediaDateTime(item.startedAt, "—")}</td>
      <td className="px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{formatAdminMediaDateTime(item.finishedAt, "—")}</td>
      <td className="max-w-[280px] px-5 py-4 align-middle text-[12px] text-[#5d6f86]">{item.errorMessage || "—"}</td>
    </tr>
  );
}

async function loadSyncJob(actorId: string, jobId: string): Promise<AdminSyncJobDetailResponse> {
  try {
    return await getAdminSyncJob(actorId, jobId);
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function AdminMediaSyncJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/media");
  }

  const { jobId } = await params;
  const actorId = session.user.id ?? "";
  const job = await loadSyncJob(actorId, jobId);
  const jobStatusMeta = getAdminSyncJobStatusMeta(job.status);

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
        <span className="font-medium text-[#132033]">sync #{job.id}</span>
      </nav>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f1c2e]">sync run #{job.id}</h1>
          <p className="mt-1 text-[13px] text-[#5d6f86]">재생목록 sync 실행 단위의 상세 결과입니다.</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${jobStatusMeta.cls}`}>
          {jobStatusMeta.label}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoField label="Trigger" value={job.triggerType} />
        <InfoField label="Status" value={jobStatusMeta.label} />
        <InfoField label="Started" value={formatAdminMediaDateTime(job.startedAt, "—")} />
        <InfoField label="Finished" value={formatAdminMediaDateTime(job.finishedAt, "—")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoField label="대상 재생목록" value={`${job.totalPlaylists}개`} />
        <InfoField label="성공 / 실패" value={`${job.succeededPlaylists} / ${job.failedPlaylists}`} />
        <InfoField label="오류 요약" value={job.errorSummary || "없음"} />
        <InfoField label="아이템 수" value={`${job.items.length}개`} />
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="border-b border-[#edf2f7] px-5 py-4">
          <h2 className="text-[14px] font-bold text-[#0f1c2e]">Sync 항목</h2>
          <p className="mt-1 text-[12px] text-[#8fa3bb]">각 재생목록별 처리 결과를 확인합니다.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {["ID", "메뉴", "siteKey", "Playlist", "상태", "처리", "입/수/중지", "시작", "종료", "오류"].map((header) => (
                  <th key={header} className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {job.items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-[13px] text-[#5d6f86]">
                    아직 기록된 sync item이 없습니다.
                  </td>
                </tr>
              ) : (
                job.items.map((item) => <ItemRow key={item.id} item={item} />)
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
