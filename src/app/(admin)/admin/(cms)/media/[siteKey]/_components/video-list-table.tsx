"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import type { AdminVideo, AdminVideoListResponse } from "@/lib/admin-media-api";
import VideoMetadataDrawer from "./video-metadata-drawer";
import type { VideoMetadataFormState } from "../../actions";

// ── SVG 아이콘 ───────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fa3bb]">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M8.5 1.5l2 2L4 10H2v-2L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StarFilled() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <path d="M7 1l1.76 3.57 3.94.57-2.85 2.78.67 3.93L7 10.07l-3.52 1.78.67-3.93L1.3 5.14l3.94-.57L7 1z"/>
    </svg>
  );
}

function StarOutline() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1l1.76 3.57 3.94.57-2.85 2.78.67 3.93L7 10.07l-3.52 1.78.67-3.93L1.3 5.14l3.94-.57L7 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
    </svg>
  );
}

// ── 배지 ──────────────────────────────────────────────────────────────────────

function VisibleBadge({ visible }: { visible: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
      visible ? "bg-emerald-50 text-emerald-600" : "bg-[#f1f5f9] text-[#5d6f86]"
    }`}>
      {visible ? "ON" : "OFF"}
    </span>
  );
}

// ── 페이지네이션 ─────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5d6f86] transition hover:bg-[#f1f5f9] disabled:opacity-40"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] transition ${
            p === page
              ? "bg-[#3f74c7] font-semibold text-white"
              : "font-medium text-[#5d6f86] hover:bg-[#f1f5f9]"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5d6f86] transition hover:bg-[#f1f5f9] disabled:opacity-40"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

interface VideoListTableProps {
  siteKey: string;
  initialData: AdminVideoListResponse;
  updateVideoAction: (prev: VideoMetadataFormState, formData: FormData) => Promise<VideoMetadataFormState>;
}

export default function VideoListTable({ siteKey, initialData, updateVideoAction }: VideoListTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [drawerVideoId, setDrawerVideoId] = useState<string | null>(null);

  // Filter state from searchParams
  const visible = searchParams?.get("visible") ?? "";
  const featured = searchParams?.get("featured") ?? "";
  const search = searchParams?.get("videoSearch") ?? "";
  const page = Number(searchParams?.get("videoPage")) || 1;

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // reset page on filter change
    if (key !== "videoPage") params.delete("videoPage");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParam("videoSearch", val);
    }, 300);
  }, [updateParam]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const videos = initialData.data;
  const pagination = initialData.pagination;

  const HEADERS = ["순서", "노출", "썸네일", "표시 제목", "공개일", "설교자", "본문", "대표", "수정"];

  return (
    <>
      {/* 섹션 제목 */}
      <h2 className="text-[16px] font-bold text-[#0f1c2e]">영상 목록</h2>

      {/* 필터 바 */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={visible}
          onChange={(e) => updateParam("visible", e.target.value)}
          className="rounded-xl border border-[#dde4ef] bg-white px-3 py-2 text-[13px] text-[#132033] outline-none transition focus:border-[#3f74c7] focus:ring-2 focus:ring-[#3f74c7]/30"
        >
          <option value="">노출: 전체</option>
          <option value="true">노출</option>
          <option value="false">숨김</option>
        </select>

        <select
          value={featured}
          onChange={(e) => updateParam("featured", e.target.value)}
          className="rounded-xl border border-[#dde4ef] bg-white px-3 py-2 text-[13px] text-[#132033] outline-none transition focus:border-[#3f74c7] focus:ring-2 focus:ring-[#3f74c7]/30"
        >
          <option value="">대표: 전체</option>
          <option value="true">대표 영상</option>
        </select>

        <div className="relative ml-auto max-w-xs flex-1">
          <input
            type="text"
            placeholder="제목 또는 설교자 검색"
            defaultValue={search}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-[#dde4ef] bg-white py-2 pl-9 pr-4 text-[13px] text-[#132033] outline-none transition focus:border-[#3f74c7] focus:ring-2 focus:ring-[#3f74c7]/30"
          />
          <SearchIcon />
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f7] bg-[#f8fafc]">
                {HEADERS.map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold tracking-wide text-[#55697f]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center">
                    <p className="text-[13px] font-semibold text-[#132033]">영상이 없습니다.</p>
                    <p className="mt-1 text-[12px] text-[#8fa3bb]">검색 조건을 변경해 보세요.</p>
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <VideoRow
                    key={video.youtubeVideoId}
                    video={video}
                    onEdit={() => setDrawerVideoId(video.youtubeVideoId)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => updateParam("videoPage", String(p))}
      />

      {/* 드로어 */}
      <VideoMetadataDrawer
        open={drawerVideoId !== null}
        videoId={drawerVideoId}
        siteKey={siteKey}
        onClose={() => setDrawerVideoId(null)}
        updateAction={updateVideoAction}
      />
    </>
  );
}

// ── 영상 행 ──────────────────────────────────────────────────────────────────

function VideoRow({ video, onEdit }: { video: AdminVideo; onEdit: () => void }) {
  const pubDate = video.displayPublishedDate
    ? new Date(video.displayPublishedDate).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })
    : "---";

  return (
    <tr className="border-b border-[#f0f4f8] transition hover:bg-[#fafcff]">
      <td className="w-[50px] px-5 py-4 align-middle text-center text-[13px] text-[#8fa3bb]">
        {video.position}
      </td>
      <td className="w-[60px] px-5 py-4 align-middle text-center">
        <VisibleBadge visible={video.visible} />
      </td>
      <td className="w-[80px] px-5 py-4 align-middle">
        {video.displayThumbnailUrl ? (
          <img
            src={video.displayThumbnailUrl}
            alt=""
            className="h-[36px] w-[64px] rounded-md bg-[#f1f5f9] object-cover"
          />
        ) : (
          <div className="flex h-[36px] w-[64px] items-center justify-center rounded-md bg-[#f1f5f9]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#8fa3bb]">
              <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M6.5 6l3.5 2-3.5 2V6z" fill="currentColor"/>
            </svg>
          </div>
        )}
      </td>
      <td className="px-5 py-4 align-middle">
        <p className="line-clamp-2 max-w-[200px] text-[13px] font-semibold text-[#0f1c2e]">
          {video.displayTitle}
        </p>
      </td>
      <td className="whitespace-nowrap px-5 py-4 align-middle text-[12px] text-[#5d6f86]">
        {pubDate}
      </td>
      <td className="px-5 py-4 align-middle text-[13px] text-[#132033]">
        {video.preacher ?? <span className="text-[#8fa3bb]">---</span>}
      </td>
      <td className="px-5 py-4 align-middle">
        {video.scripture ? (
          <span className="block max-w-[120px] truncate text-[12px] text-[#5d6f86]">{video.scripture}</span>
        ) : (
          <span className="text-[12px] text-[#8fa3bb]">---</span>
        )}
      </td>
      <td className="w-[60px] px-5 py-4 align-middle text-center">
        {video.featured ? (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-amber-600">
            <StarFilled />
          </span>
        ) : (
          <span className="text-[#d1d5db]">
            <StarOutline />
          </span>
        )}
      </td>
      <td className="w-[70px] px-5 py-4 align-middle text-center">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#bfd0ea] bg-[#edf4ff] px-3 text-[12px] font-medium text-[#2d5da8] transition hover:bg-[#e4efff]"
        >
          <EditIcon />
          수정
        </button>
      </td>
    </tr>
  );
}
