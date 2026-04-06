"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ShortsPlaylistItem {
  youtubeVideoId: string;
  displayTitle: string;
  embedUrl: string;
}

interface ShortsDetailViewerProps {
  initialVideoId: string;
  items: ShortsPlaylistItem[];
  listHref: string;
}

type Direction = "up" | "down";
type TransitionSnapshot = {
  from: ShortsPlaylistItem;
  to: ShortsPlaylistItem;
  direction: Direction;
};

function buildThumbnailUrl(youtubeVideoId: string): string {
  return `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
}

function buildEmbedUrl(
  embedUrl: string,
  autoplay: boolean,
  muted: boolean,
  origin?: string,
): string {
  try {
    const url = new URL(embedUrl);
    url.searchParams.set("autoplay", autoplay ? "1" : "0");
    url.searchParams.set("mute", muted ? "1" : "0");
    url.searchParams.set("playsinline", "1");
    url.searchParams.set("rel", "0");
    url.searchParams.set("enablejsapi", "1");
    if (origin) {
      url.searchParams.set("origin", origin);
    }
    return url.toString();
  } catch {
    const separator = embedUrl.includes("?") ? "&" : "?";
    const originQuery = origin ? `&origin=${encodeURIComponent(origin)}` : "";
    return `${embedUrl}${separator}autoplay=${autoplay ? "1" : "0"}&mute=${muted ? "1" : "0"}&playsinline=1&rel=0&enablejsapi=1${originQuery}`;
  }
}

export default function ShortsDetailViewer({
  initialVideoId,
  items,
  listHref,
}: ShortsDetailViewerProps) {
  const router = useRouter();
  const initialIndex = Math.max(
    0,
    items.findIndex((item) => item.youtubeVideoId === initialVideoId),
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasUnlockedAudio, setHasUnlockedAudio] = useState(false);
  const [transitionSnapshot, setTransitionSnapshot] = useState<TransitionSnapshot | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDraggingPreview, setIsDraggingPreview] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100svh");
  const timerRef = useRef<number | null>(null);
  const wheelDeltaRef = useRef(0);
  const pointerStartYRef = useRef<number | null>(null);
  const pointerDeltaYRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const activeIframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerReadyRef = useRef(false);
  const loadedVideoIdRef = useRef<string | null>(null);

  useEffect(() => {
    setActiveIndex(initialIndex);
    setIsTransitioning(false);
    setIsPlaying(true);
    setIsMuted(true);
    setHasUnlockedAudio(false);
    setTransitionSnapshot(null);
    setDragOffset(0);
    setIsDraggingPreview(false);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    wheelDeltaRef.current = 0;
    pointerStartYRef.current = null;
    pointerDeltaYRef.current = 0;
    pointerIdRef.current = null;
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

  useEffect(() => {
    function updateViewportHeight() {
      const nextHeight = window.visualViewport?.height ?? window.innerHeight;
      setViewportHeight(`${Math.round(nextHeight)}px`);
    }

    updateViewportHeight();

    window.addEventListener("resize", updateViewportHeight);
    window.visualViewport?.addEventListener("resize", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.visualViewport?.removeEventListener("resize", updateViewportHeight);
    };
  }, []);

  useEffect(() => {
    if (!window.history.state?.shortsDetailBackTrap) {
      window.history.pushState(
        {
          ...(window.history.state ?? {}),
          shortsDetailBackTrap: true,
        },
        "",
        window.location.href,
      );
    }

    function handlePopState() {
      window.location.replace(listHref);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [listHref, router]);

  const activeItem = items[activeIndex] ?? items[0];
  const previousIndex = activeIndex > 0 ? activeIndex - 1 : null;
  const nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : null;
  const viewportHeightPx = Number.parseInt(viewportHeight, 10) || 0;
  const initialPlayerItem = items[initialIndex] ?? items[0];

  function finishVideoChange(targetIndex: number) {
    const targetItem = items[targetIndex];
    if (!targetItem) {
      return;
    }

    setIsPlaying(true);
    setIsMuted(true);
    setActiveIndex(targetIndex);

    if (playerReadyRef.current && loadedVideoIdRef.current !== targetItem.youtubeVideoId) {
      setPlayerMuted(true);
      sendPlayerCommand("loadVideoById", [targetItem.youtubeVideoId]);
      loadedVideoIdRef.current = targetItem.youtubeVideoId;
      window.setTimeout(() => {
        sendPlayerCommand("playVideo");
      }, 120);
      if (hasUnlockedAudio) {
        window.setTimeout(() => {
          setPlayerMuted(false);
          setIsMuted(false);
        }, 320);
      }
    }
  }

  function settleTransition(targetIndex: number | null, direction: Direction, nextOffset: number) {
    if (targetIndex === null || !items[targetIndex]) {
      return;
    }

    setIsTransitioning(true);
    setIsDraggingPreview(false);
    window.setTimeout(() => {
      setDragOffset(nextOffset);
    }, 0);

    timerRef.current = window.setTimeout(() => {
      finishVideoChange(targetIndex);
      setIsTransitioning(false);
      setTransitionSnapshot(null);
      setDragOffset(0);
    }, 280);
  }

  function cancelDragTransition() {
    setIsTransitioning(true);
    setIsDraggingPreview(false);
    window.setTimeout(() => {
      setDragOffset(0);
    }, 0);

    timerRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      setTransitionSnapshot(null);
      setDragOffset(0);
    }, 220);
  }

  function handleMove(targetIndex: number | null, nextDirection: Direction) {
    if (targetIndex === null || isTransitioning || !items[targetIndex]) {
      return;
    }

    wheelDeltaRef.current = 0;
    pointerStartYRef.current = null;
    pointerDeltaYRef.current = 0;
    pointerIdRef.current = null;
    setTransitionSnapshot({
      from: activeItem,
      to: items[targetIndex],
      direction: nextDirection,
    });
    setDragOffset(0);
    settleTransition(
      targetIndex,
      nextDirection,
      nextDirection === "down" ? -viewportHeightPx : viewportHeightPx,
    );
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (isTransitioning) {
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

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (isTransitioning) {
      return;
    }

    setIsDraggingPreview(false);
    pointerIdRef.current = event.pointerId;
    pointerStartYRef.current = event.clientY;
    pointerDeltaYRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (
      pointerStartYRef.current === null ||
      pointerIdRef.current !== event.pointerId ||
      isTransitioning
    ) {
      return;
    }

    pointerDeltaYRef.current = event.clientY - pointerStartYRef.current;
    const nextDirection = pointerDeltaYRef.current < 0 ? "down" : "up";
    const previewIndex = nextDirection === "down" ? nextIndex : previousIndex;

    if (Math.abs(pointerDeltaYRef.current) > 8) {
      event.preventDefault();
    }

    if (previewIndex === null) {
      setTransitionSnapshot(null);
      setDragOffset(0);
      setIsDraggingPreview(false);
      return;
    }

    const previewItem = items[previewIndex];
    if (!previewItem) {
      return;
    }

    setTransitionSnapshot((prev) => {
      if (
        prev?.to.youtubeVideoId === previewItem.youtubeVideoId &&
        prev.direction === nextDirection
      ) {
        return prev;
      }

      return {
        from: activeItem,
        to: previewItem,
        direction: nextDirection,
      };
    });
    setIsDraggingPreview(true);
    setDragOffset(pointerDeltaYRef.current);
  }

  function resetPointerState() {
    pointerStartYRef.current = null;
    pointerDeltaYRef.current = 0;
    pointerIdRef.current = null;
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (
      pointerStartYRef.current === null ||
      pointerIdRef.current !== event.pointerId ||
      isTransitioning
    ) {
      return;
    }

    const deltaY = pointerDeltaYRef.current;
    resetPointerState();

    if (transitionSnapshot && Math.abs(deltaY) < 42) {
      cancelDragTransition();
      return;
    }

    if (Math.abs(deltaY) < 12) {
      togglePlayback();
      return;
    }

    if (deltaY < 0) {
      if (nextIndex !== null) {
        settleTransition(nextIndex, "down", -viewportHeightPx);
      }
    } else {
      if (previousIndex !== null) {
        settleTransition(previousIndex, "up", viewportHeightPx);
      }
    }
  }

  function handlePointerCancel() {
    resetPointerState();
    if (transitionSnapshot) {
      cancelDragTransition();
    }
  }
  const viewportStyle = {
    ["--shorts-viewport-height" as string]: viewportHeight,
  } as CSSProperties;

  function sendPlayerCommand(command: string, args: unknown[] = []) {
    activeIframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: command,
        args,
      }),
      "*",
    );
  }

  function setPlayerMuted(muted: boolean) {
    activeIframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: muted ? "mute" : "unMute",
        args: [],
      }),
      "*",
    );
  }

  function togglePlayback() {
    if (isMuted) {
      setPlayerMuted(false);
      sendPlayerCommand("playVideo");
      setIsMuted(false);
      setIsPlaying(true);
      setHasUnlockedAudio(true);
      return;
    }

    if (isPlaying) {
      sendPlayerCommand("pauseVideo");
      setIsPlaying(false);
      return;
    }

    sendPlayerCommand("playVideo");
    setIsPlaying(true);
  }

  function handlePlayerLoad() {
    playerReadyRef.current = true;
    loadedVideoIdRef.current = activeItem.youtubeVideoId;
    window.setTimeout(() => {
      sendPlayerCommand("playVideo");
      setPlayerMuted(!hasUnlockedAudio);
    }, 300);
  }

  return (
    <div
      className="fixed inset-x-0 top-0 z-20 h-[var(--shorts-viewport-height)] w-full bg-black md:relative md:inset-auto md:z-auto md:h-full md:bg-transparent"
      style={viewportStyle}
      onWheel={handleWheel}
    >
      <div className="h-full w-full md:flex md:justify-center">
        <div className="relative h-[var(--shorts-viewport-height)] w-full md:h-full md:max-w-[calc((100svh-3rem)*9/16)]">
          <div className="relative h-full overflow-hidden bg-black md:rounded-[16px]">
            <div className="mx-auto h-full w-full">
              <VideoLayer
                title={initialPlayerItem.displayTitle}
                embedUrl={initialPlayerItem.embedUrl}
                iframeRef={activeIframeRef}
                onLoad={handlePlayerLoad}
                className="translate-y-0"
                style={{
                  transform: transitionSnapshot ? `translateY(${dragOffset}px)` : undefined,
                  transitionDuration: isDraggingPreview ? "0ms" : undefined,
                }}
              />
            </div>
            {transitionSnapshot ? (
              <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden bg-black">
                <TransitionFrame
                  item={transitionSnapshot.from}
                  style={{
                    transform: `translateY(${dragOffset}px)`,
                    transitionDuration: isDraggingPreview ? "0ms" : undefined,
                  }}
                />
                <TransitionFrame
                  item={transitionSnapshot.to}
                  style={{
                    transform:
                      transitionSnapshot.direction === "down"
                        ? `translateY(calc(100% + ${dragOffset}px))`
                        : `translateY(calc(-100% + ${dragOffset}px))`,
                    transitionDuration: isDraggingPreview ? "0ms" : undefined,
                  }}
                />
              </div>
            ) : null}
            {items.length > 0 ? (
              <GestureZone
                className="absolute inset-0 z-10 md:hidden"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
              />
            ) : null}
          </div>
        </div>
      </div>

      <aside className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex md:right-3 xl:right-6">
        {previousIndex !== null ? (
          <DirectionButton
            onClick={() => handleMove(previousIndex, "up")}
            disabled={isTransitioning}
          >
            ↑
          </DirectionButton>
        ) : null}
        {nextIndex !== null ? (
          <DirectionButton
            onClick={() => handleMove(nextIndex, "down")}
            disabled={isTransitioning}
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
  iframeRef?: RefObject<HTMLIFrameElement | null>;
  onLoad?: () => void;
  style?: CSSProperties;
}

function VideoLayer({ title, embedUrl, className, iframeRef, onLoad, style }: VideoLayerProps) {
  const [mounted, setMounted] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setIframeSrc(buildEmbedUrl(embedUrl, true, true, window.location.origin));
  }, [embedUrl]);

  return (
    <div
      className={[
        "absolute inset-0 transition-transform duration-300 ease-out",
        mounted ? className : className,
      ].join(" ")}
      style={style}
    >
      {iframeSrc ? (
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          title={title}
          onLoad={onLoad}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div className="h-full w-full bg-black" />
      )}
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

interface GestureZoneProps {
  className: string;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: () => void;
}

function GestureZone({
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: GestureZoneProps) {
  return (
    <div
      className={`pointer-events-auto touch-none ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    />
  );
}

interface TransitionFrameProps {
  item: ShortsPlaylistItem;
  style?: CSSProperties;
}

function TransitionFrame({ item, style }: TransitionFrameProps) {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-black transition-transform duration-300 ease-out"
      style={style}
    >
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-80 blur-md"
        style={{ backgroundImage: `url(${buildThumbnailUrl(item.youtubeVideoId)})` }}
      />
      <div className="absolute inset-0 bg-black/28" />
      <Image
        src={buildThumbnailUrl(item.youtubeVideoId)}
        alt={item.displayTitle}
        fill
        sizes="100vw"
        className="object-contain"
        draggable={false}
      />
    </div>
  );
}
