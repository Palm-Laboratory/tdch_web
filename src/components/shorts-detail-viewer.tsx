"use client";

import { useEffect, useRef, useState } from "react";

interface ShortsPlaylistItem {
  youtubeVideoId: string;
  displayTitle: string;
  embedUrl: string;
}

interface ShortsDetailViewerProps {
  initialVideoId: string;
  items: ShortsPlaylistItem[];
}

type Direction = "up" | "down";

function buildEmbedUrl(embedUrl: string, autoplay: boolean): string {
  try {
    const url = new URL(embedUrl);
    url.searchParams.set("autoplay", autoplay ? "1" : "0");
    url.searchParams.set("playsinline", "1");
    url.searchParams.set("rel", "0");
    return url.toString();
  } catch {
    const separator = embedUrl.includes("?") ? "&" : "?";
    return `${embedUrl}${separator}autoplay=${autoplay ? "1" : "0"}&playsinline=1&rel=0`;
  }
}

export default function ShortsDetailViewer({
  initialVideoId,
  items,
}: ShortsDetailViewerProps) {
  const initialIndex = Math.max(
    0,
    items.findIndex((item) => item.youtubeVideoId === initialVideoId),
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>("down");
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<number | null>(null);
  const wheelDeltaRef = useRef(0);

  useEffect(() => {
    setActiveIndex(initialIndex);
    setIncomingIndex(null);
    setIsAnimating(false);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    wheelDeltaRef.current = 0;
  }, [initialIndex]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const activeItem = items[activeIndex] ?? items[0];
  const previousIndex = activeIndex > 0 ? activeIndex - 1 : null;
  const nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : null;
  const previousItem = previousIndex !== null ? items[previousIndex] : null;
  const nextItem = nextIndex !== null ? items[nextIndex] : null;

  function handleMove(targetIndex: number | null, nextDirection: Direction) {
    if (targetIndex === null || isAnimating || !items[targetIndex]) {
      return;
    }

    wheelDeltaRef.current = 0;
    setDirection(nextDirection);
    setIncomingIndex(targetIndex);
    setIsAnimating(true);

    timerRef.current = window.setTimeout(() => {
      const nextItem = items[targetIndex];
      setActiveIndex(targetIndex);
      setIncomingIndex(null);
      setIsAnimating(false);
      window.history.replaceState({}, "", `/sermons/its-okay/${nextItem.youtubeVideoId}`);
    }, 360);
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (isAnimating) {
      event.preventDefault();
      return;
    }

    wheelDeltaRef.current += event.deltaY;

    if (Math.abs(wheelDeltaRef.current) < 48) {
      return;
    }

    event.preventDefault();

    if (wheelDeltaRef.current > 0) {
      handleMove(nextIndex, "down");
    } else {
      handleMove(previousIndex, "up");
    }
  }

  const incomingItem = incomingIndex !== null ? items[incomingIndex] : null;

  return (
    <div className="contents" onWheel={handleWheel}>
      <div className="flex h-full w-full justify-center">
        <div className="relative h-full w-full max-w-[calc((100svh-2rem)*9/16)] md:max-w-[calc((100svh-3rem)*9/16)]">
          <div className="relative overflow-hidden rounded-[16px] bg-black">
            <div className="mx-auto h-[calc(100svh-2rem-88px)] w-full md:h-[calc(100svh-3rem-92px)]">
              <VideoLayer
                key={activeItem.youtubeVideoId}
                title={activeItem.displayTitle}
                embedUrl={activeItem.embedUrl}
                className={isAnimating ? (direction === "down" ? "-translate-y-full" : "translate-y-full") : "translate-y-0"}
              />
              {incomingItem ? (
                <VideoLayer
                  key={`${incomingItem.youtubeVideoId}-incoming`}
                  title={incomingItem.displayTitle}
                  embedUrl={incomingItem.embedUrl}
                  className={isAnimating ? "translate-y-0" : direction === "down" ? "translate-y-full" : "-translate-y-full"}
                  initialClass={direction === "down" ? "translate-y-full" : "-translate-y-full"}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        {previousItem ? (
          <iframe
            src={buildEmbedUrl(previousItem.embedUrl, false)}
            title={`${previousItem.displayTitle} preload`}
            className="h-0 w-0 border-0 opacity-0"
            tabIndex={-1}
            aria-hidden="true"
          />
        ) : null}
        {nextItem ? (
          <iframe
            src={buildEmbedUrl(nextItem.embedUrl, false)}
            title={`${nextItem.displayTitle} preload`}
            className="h-0 w-0 border-0 opacity-0"
            tabIndex={-1}
            aria-hidden="true"
          />
        ) : null}
      </div>

      <aside className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-4 md:right-3 xl:right-6">
        {previousIndex !== null ? (
          <DirectionButton
            onClick={() => handleMove(previousIndex, "up")}
            disabled={isAnimating}
          >
            ↑
          </DirectionButton>
        ) : null}
        {nextIndex !== null ? (
          <DirectionButton
            onClick={() => handleMove(nextIndex, "down")}
            disabled={isAnimating}
          >
            ↓
          </DirectionButton>
        ) : null}
      </aside>
    </div>
  );
}

interface VideoLayerProps {
  title: string;
  embedUrl: string;
  className: string;
  initialClass?: string;
}

function VideoLayer({ title, embedUrl, className, initialClass }: VideoLayerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={[
        "absolute inset-0 transition-transform duration-300 ease-out",
        mounted ? className : (initialClass ?? className),
      ].join(" ")}
    >
      <iframe
        src={buildEmbedUrl(embedUrl, true)}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

interface DirectionButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: string;
}

function DirectionButton({ onClick, disabled, children }: DirectionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/8 text-[1.45rem] font-semibold text-white/84 transition hover:bg-white/12 hover:text-white"
    >
      {children}
    </button>
  );
}
