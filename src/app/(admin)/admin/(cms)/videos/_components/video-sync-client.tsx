"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminYouTubePlaylist } from "@/lib/admin-menu-api";
import { useAdminToast } from "../../components/admin-toast-provider";

function SyncMetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-[#dbe4f0] bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold text-[#7b8ba1]">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

export default function VideoSyncClient({ playlists }: { playlists: AdminYouTubePlaylist[] }) {
  const router = useRouter();
  const toast = useAdminToast();
  const [syncing, setSyncing] = useState(false);

  const activeCount = playlists.filter((playlist) => playlist.syncStatus === "ACTIVE").length;
  const removedCount = playlists.filter((playlist) => playlist.syncStatus === "REMOVED").length;
  const hiddenCount = playlists.filter((playlist) => playlist.status === "HIDDEN").length;
  const uncategorizedCount = playlists.filter((playlist) => playlist.parentId == null).length;

  const handleSync = async () => {
    setSyncing(true);

    try {
      const response = await fetch("/api/admin/youtube/sync", { method: "POST" });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "유튜브 동기화에 실패했습니다.");
      }

      toast.success(payload.message || "유튜브 동기화를 실행했습니다.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "유튜브 동기화에 실패했습니다.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#dbe4f0] bg-white px-5 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[13px] font-semibold text-[#132033]">유튜브 재생목록 동기화</p>
            <p className="text-[12px] leading-5 text-[#6d7f95]">
              자동 동기화는 매일 오전 8시와 오후 11시에 실행됩니다. 운영 중 반영을 서둘러야 할 때만 수동 동기화를 사용하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="rounded-lg bg-[#3f74c7] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
          >
            {syncing ? "동기화 중..." : "지금 동기화"}
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SyncMetricCard label="전체 재생목록" value={playlists.length} tone="text-[#132033]" />
        <SyncMetricCard label="정상 연동" value={activeCount} tone="text-emerald-600" />
        <SyncMetricCard label="제거 감지" value={removedCount} tone="text-rose-600" />
        <SyncMetricCard label="그룹 미지정" value={uncategorizedCount} tone="text-amber-600" />
      </section>

      <section className="rounded-2xl border border-[#dbe4f0] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-[#edf2f7] px-5 py-4">
          <div>
            <h2 className="text-[14px] font-bold text-[#132033]">재생목록 동기화 현황</h2>
            <p className="mt-1 text-[12px] text-[#6d7f95]">현재 연동 상태와 운영 노출 상태를 한 번에 확인할 수 있습니다.</p>
          </div>
          <span className="text-[12px] font-semibold text-[#6d7f95]">숨김 {hiddenCount}개</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {["재생목록", "소속 그룹", "영상 수", "연동 상태", "운영 상태"].map((header) => (
                  <th
                    key={header}
                    className="whitespace-nowrap px-5 py-3 text-[11px] font-semibold tracking-wide text-[#55697f]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playlists.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[13px] text-[#6d7f95]">
                    동기화된 재생목록이 없습니다.
                  </td>
                </tr>
              ) : (
                playlists.map((playlist) => (
                  <tr key={playlist.menuId} className="border-b border-[#f0f4f8] last:border-0">
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-[#132033]">{playlist.menuLabel}</p>
                      <p className="mt-0.5 text-[11px] text-[#8fa3bb]">{playlist.sourceTitle}</p>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-[#5d6f86]">{playlist.parentLabel ?? "미지정"}</td>
                    <td className="px-5 py-4 text-[12px] text-[#5d6f86]">{playlist.itemCount}개</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          playlist.syncStatus === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {playlist.syncStatus === "ACTIVE" ? "정상" : "제거됨"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          playlist.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-700"
                            : playlist.status === "HIDDEN"
                              ? "bg-slate-100 text-slate-700"
                              : playlist.status === "ARCHIVED"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {playlist.status === "PUBLISHED"
                          ? "노출 중"
                          : playlist.status === "HIDDEN"
                            ? "숨김"
                            : playlist.status === "ARCHIVED"
                              ? "보관"
                              : "분류 대기"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
