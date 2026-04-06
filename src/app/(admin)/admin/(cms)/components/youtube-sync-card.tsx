"use client";

import { useState } from "react";

type SyncStatus = "idle" | "syncing" | "success" | "error";

interface SyncResult {
  status: string;
  totalPlaylists: number;
  succeededPlaylists: number;
  failedPlaylists: number;
  completedAt: string;
}

export default function YoutubeSyncCard() {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [result, setResult] = useState<SyncResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSync = async () => {
    setStatus("syncing");
    setResult(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/media/sync", {
        method: "POST",
      });
      const data = (await response.json()) as
        | SyncResult
        | {
            code?: string;
            message?: string;
          };

      if (!response.ok) {
        const message =
          "message" in data && typeof data.message === "string"
            ? data.message
            : "동기화 중 오류가 발생했습니다.";
        throw new Error(message);
      }

      setResult(data as SyncResult);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "동기화 중 오류가 발생했습니다.");
      setStatus("error");
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/15">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1.5 3.5a1 1 0 0 1 1-1h1.17l.83 2H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5.5a1 1 0 0 0-1-1H8.5L7.67 2.5H4.33" stroke="#f87171" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9.5" cy="7.5" r="1" fill="#f87171"/>
              </svg>
            </div>
            <h3 className="text-[13px] font-semibold text-white">YouTube 동기화</h3>
          </div>
          <p className="mt-2 text-xs leading-5 text-white/40">
            YouTube 플레이리스트를 수동으로 동기화합니다.
            <br />
            브라우저는 관리자 세션만 보내고, 서버가 안전하게 관리자 API를 호출합니다.
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={status === "syncing"}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#3f74c7]/20 px-4 py-2 text-[13px] font-semibold text-[#6ca6f0] transition hover:bg-[#3f74c7]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "syncing" ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              동기화 중…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M12 7A5 5 0 1 1 7 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7 2l2.5 2.5L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              지금 동기화
            </>
          )}
        </button>
      </div>

      {/* 결과 */}
      {status === "success" && result && (
        <div className="mt-5 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.08] px-4 py-3.5">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="#34d399" strokeWidth="1.3"/>
              <path d="M4.5 7l2 2 3-3" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-xs font-semibold text-emerald-400">동기화 완료</p>
          </div>
          <div className="mt-2.5 flex gap-4 text-[11px] text-white/50">
            <span>전체 {result.totalPlaylists}개</span>
            <span className="text-emerald-400/80">성공 {result.succeededPlaylists}개</span>
            {result.failedPlaylists > 0 && (
              <span className="text-red-400/80">실패 {result.failedPlaylists}개</span>
            )}
            <span>
              {new Date(result.completedAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        </div>
      )}

      {status === "error" && errorMessage && (
        <div className="mt-5 rounded-xl border border-red-500/15 bg-red-500/[0.08] px-4 py-3">
          <p className="text-xs text-red-300">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
