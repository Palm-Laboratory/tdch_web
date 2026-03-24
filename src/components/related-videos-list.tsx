"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface RelatedVideoItem {
  youtubeVideoId: string;
  displayTitle: string;
  thumbnailUrl: string;
  displayDate: string;
  contentKind: "LONG_FORM" | "SHORT";
  preacher: string | null;
  serviceType: string | null;
}

interface RelatedVideosListProps {
  siteKey: string;
  items: RelatedVideoItem[];
}

const INITIAL_VISIBLE_COUNT = 4;
const LOAD_MORE_COUNT = 3;

export default function RelatedVideosList({ siteKey, items }: RelatedVideosListProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );
  const hasMore = visibleCount < items.length;

  if (items.length === 0) {
    return (
      <div className="rounded-[18px] bg-black/4 px-5 py-5 text-sm text-ink/64">
        아직 추천할 영상이 더 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleItems.map((item) => (
        <Link
          key={item.youtubeVideoId}
          href={buildMediaDetailPath(siteKey, item.youtubeVideoId)}
          className="group flex gap-3 rounded-[18px] bg-white/88 p-2 transition hover:bg-white"
        >
          <div
            className={`relative shrink-0 overflow-hidden rounded-[14px] bg-black ${
              item.contentKind === "SHORT" ? "h-[180px] w-[104px]" : "aspect-video w-[180px]"
            }`}
          >
            <Image
              src={item.thumbnailUrl}
              alt={item.displayTitle}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes={item.contentKind === "SHORT" ? "104px" : "180px"}
            />
          </div>
          <div className="min-w-0 pt-1">
            <p className="line-clamp-2 text-[1rem] font-semibold leading-6 tracking-[-0.02em] text-ink">
              {item.displayTitle}
            </p>
            <p className="mt-2 text-sm text-ink/62">
              {buildRelatedMeta(item)}
            </p>
          </div>
        </Link>
      ))}

      {hasMore ? (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + LOAD_MORE_COUNT)}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-cedar/25 hover:text-cedar"
        >
          더보기
        </button>
      ) : null}
    </div>
  );
}

function buildMediaDetailPath(siteKey: string, youtubeVideoId: string): string {
  return `/sermons/${siteKey}/${youtubeVideoId}`;
}

function buildRelatedMeta(item: RelatedVideoItem): string {
  const segments = [
    item.preacher ?? "The 제자교회",
    item.serviceType ?? (item.contentKind === "SHORT" ? "짧은 영상" : "예배 영상"),
    `${item.displayDate.replaceAll("-", ".")} 업로드`,
  ];

  return segments.join(" · ");
}
