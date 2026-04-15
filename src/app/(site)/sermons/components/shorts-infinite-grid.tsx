"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PUBLIC_MEDIA_API_BASE_URL } from "@/lib/site-config";

interface ShortsGridItem {
  youtubeVideoId: string;
  displayTitle: string;
  thumbnailUrl: string;
  displayDate: string;
  preacher: string | null;
}

interface ShortsInfiniteGridProps {
  siteKey: string;
  initialItems: ShortsGridItem[];
  initialPage: number;
  totalPages: number;
  pageSize: number;
}

interface MediaListResponseLite {
  page: number;
  size: number;
  totalPages: number;
  items: ShortsGridItem[];
}

export default function ShortsInfiniteGrid({
  siteKey: slug,
  initialItems,
  initialPage,
  totalPages,
  pageSize,
}: ShortsInfiniteGridProps) {
  const [items, setItems] = useState(initialItems);
  const [nextPage, setNextPage] = useState(initialPage + 1);
  const [hasMore, setHasMore] = useState(initialPage + 1 < totalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const nextPageRef = useRef(nextPage);
  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);
  const loadMoreRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    setItems(initialItems);
    setNextPage(initialPage + 1);
    setHasMore(initialPage + 1 < totalPages);
    setIsLoading(false);
    setLoadError(false);
  }, [initialItems, initialPage, totalPages]);

  useEffect(() => {
    nextPageRef.current = nextPage;
    hasMoreRef.current = hasMore;
    isLoadingRef.current = isLoading;
  }, [nextPage, hasMore, isLoading]);

  useEffect(() => {
    loadMoreRef.current = async () => {
      if (isLoadingRef.current || !hasMoreRef.current) {
        return;
      }

      setIsLoading(true);
      setLoadError(false);

      try {
        const response = await fetch(
          `${PUBLIC_MEDIA_API_BASE_URL}/api/v1/media/menus/${slug}/videos?page=${nextPageRef.current}&size=${pageSize}`,
          {
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch shorts page: ${response.status}`);
        }

        const data = await response.json() as MediaListResponseLite;

        setItems((current) => {
          const existingIds = new Set(current.map((item) => item.youtubeVideoId));
          const appendedItems = data.items.filter((item) => !existingIds.has(item.youtubeVideoId));
          return [...current, ...appendedItems];
        });

        const upcomingPage = nextPageRef.current + 1;
        setNextPage(upcomingPage);
        setHasMore(upcomingPage < data.totalPages);
      } catch {
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
  }, [pageSize, slug]);

  useEffect(() => {
    if (!hasMore || isLoading || loadError) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMoreRef.current();
        }
      },
      {
        rootMargin: "320px 0px",
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, loadError]);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-[10px] gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,210px)] lg:justify-start">
        {items.map((item) => (
          <Link
            key={item.youtubeVideoId}
            href={`/sermons/${slug}/${item.youtubeVideoId}`}
            className="group block lg:w-[210px]"
          >
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[8px] bg-black lg:h-[315px] lg:aspect-auto">
              <Image
                src={item.thumbnailUrl}
                alt={item.displayTitle}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(min-width: 1024px) 210px, (min-width: 640px) 45vw, 90vw"
              />
            </div>
            <div className="px-0 py-2.5">
              <p className="line-clamp-2 text-[0.95rem] font-medium leading-5 tracking-[-0.02em] text-ink">
                {item.displayTitle}
              </p>
              <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-5 text-ink/52">
                {[item.preacher, item.displayDate.replaceAll("-", ".")].filter(Boolean).join(" · ")}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {hasMore ? <div ref={sentinelRef} className="h-8 w-full" aria-hidden="true" /> : null}

      {isLoading ? (
        <p className="pt-3 text-center text-sm text-ink/44">다음 쇼츠를 불러오는 중입니다.</p>
      ) : null}

      {loadError ? (
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={() => void loadMoreRef.current()}
            className="inline-flex items-center rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-ink transition hover:border-cedar/25 hover:text-cedar"
          >
            다시 불러오기
          </button>
        </div>
      ) : null}
    </>
  );
}
