"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ShortformVideoItem {
  videoId: string;
  title: string;
  publishedAt: string | null;
  thumbnailUrl: string | null;
  href: string;
}

interface ShortformVideoListResponse {
  items: ShortformVideoItem[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

function formatLongDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function ShortformCard({ video }: { video: ShortformVideoItem }) {
  const publishedAt = formatLongDate(video.publishedAt);

  return (
    <Link href={video.href} className="group flex flex-col gap-[10px]">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-[#242c39]">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(min-width: 1280px) 210px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-[#242c39]/18" />
      </div>

      <div className="flex flex-col gap-2 text-[#10213f]">
        <p className="line-clamp-2 text-[14px] font-medium leading-7">{video.title}</p>
        {publishedAt ? (
          <p className="text-[12px] leading-3 text-[#10213f]">{publishedAt}</p>
        ) : null}
      </div>
    </Link>
  );
}

export default function PublicShortformPlaylistGrid({
  path,
  initialItems,
  initialPage,
  initialPageSize,
  initialTotalPages,
}: {
  path: string;
  initialItems: ShortformVideoItem[];
  initialPage: number;
  initialPageSize: number;
  initialTotalPages: number;
}) {
  const [items, setItems] = useState(initialItems);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const currentPageRef = useRef(initialPage);
  const pageSizeRef = useRef(initialPageSize);
  const totalPagesRef = useRef(initialTotalPages);
  const inFlightPageRef = useRef<number | null>(null);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  const hasMore = currentPage < totalPages;

  const handleLoadMore = async () => {
    const nextPage = currentPageRef.current + 1;

    if (
      currentPageRef.current >= totalPagesRef.current ||
      isLoadingMore ||
      inFlightPageRef.current === nextPage
    ) {
      return;
    }

    inFlightPageRef.current = nextPage;
    setIsLoadingMore(true);
    setLoadFailed(false);

    try {
      const response = await fetch(
        `/api/public/videos/items?path=${encodeURIComponent(path)}&page=${nextPage}&size=${pageSizeRef.current}`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        setLoadFailed(true);
        return;
      }

      const payload = (await response.json()) as ShortformVideoListResponse;

      setItems((prev) => {
        const existingIds = new Set(prev.map((video) => video.videoId));
        const nextItems = payload.items.filter((video) => !existingIds.has(video.videoId));
        return [...prev, ...nextItems];
      });
      setCurrentPage(payload.currentPage);
      setPageSize(payload.pageSize);
      setTotalPages(payload.totalPages);
    } catch {
      setLoadFailed(true);
    } finally {
      if (inFlightPageRef.current === nextPage) {
        inFlightPageRef.current = null;
      }
      setIsLoadingMore(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-[8px] border border-dashed border-[#d8dde6] px-6 py-14 text-center text-[15px] text-[#64748b]">
        공개된 영상이 아직 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-x-[14px] gap-y-8 sm:gap-x-[22px] sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((video) => (
          <ShortformCard key={video.videoId} video={video} />
        ))}
      </div>

      {hasMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex min-w-[132px] items-center justify-center rounded-full bg-[#1a2744] px-6 py-3 text-[14px] font-medium text-white transition hover:bg-[#13203a] disabled:cursor-not-allowed disabled:bg-[#94a3b8]"
          >
            {isLoadingMore ? `불러오는 중... (${currentPage}/${totalPages})` : `더보기 (${currentPage}/${totalPages})`}
          </button>
        </div>
      ) : null}

      {loadFailed ? (
        <p className="text-center text-[13px] text-[#b45309]">
          영상을 더 불러오지 못했습니다. 다시 시도해 주세요.
        </p>
      ) : null}
    </div>
  );
}
