"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode, RefObject } from "react";
import type {
  PublicPlaylistDetail,
  PublicShortformPlaylistWindow,
  PublicVideoDetail,
  PublicVideoList,
  PublicVideoSummary,
} from "@/lib/videos-api";

interface PublicShortformVideoDetailExperienceProps {
  playlist: PublicPlaylistDetail;
  initialVideo: PublicVideoDetail;
}

interface ShortformPlaybackVideo extends PublicVideoSummary {
  description: string | null;
}

const SWITCH_ANIMATION_MS = 280;
const SWIPE_THRESHOLD_RATIO = 0.16;
const SWIPE_THRESHOLD_PX = 88;
const CLICK_THRESHOLD_PX = 12;

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: {
          playerVars?: Record<string, number | string>;
          videoId?: string;
          events?: {
            onReady?: (event: { target: YouTubePlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YouTubePlayerInstance }) => void;
          };
        },
      ) => YouTubePlayerInstance;
      PlayerState: {
        ENDED: number;
        PAUSED: number;
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YouTubePlayerInstance {
  destroy(): void;
  getCurrentTime(): number;
  getDuration(): number;
  getIframe(): HTMLIFrameElement;
  getPlayerState?(): number;
  getVolume(): number;
  loadVideoById(videoId: string): void;
  mute(): void;
  pauseVideo(): void;
  playVideo(): void;
  setVolume(volume: number): void;
  unMute(): void;
  isMuted(): boolean;
}

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeIframeApi() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise<void>((resolve) => {
    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };
  });

  return youtubeApiPromise;
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const roundedSeconds = Math.floor(seconds);
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const remainingSeconds = roundedSeconds % 60;

  if (hours > 0) {
    return `${hours}:${`${minutes}`.padStart(2, "0")}:${`${remainingSeconds}`.padStart(2, "0")}`;
  }

  return `${minutes}:${`${remainingSeconds}`.padStart(2, "0")}`;
}

function resolvePath(href: string) {
  try {
    return new URL(href, window.location.origin).pathname;
  } catch {
    return href;
  }
}

function buildPlayerVars(videoId: string, autoplay: boolean, muted = false) {
  return {
    autoplay: autoplay ? 1 : 0,
    controls: 0,
    enablejsapi: 1,
    loop: 1,
    modestbranding: 1,
    mute: muted ? 1 : 0,
    playsinline: 1,
    playlist: videoId,
    rel: 0,
  };
}

function toPlaybackVideos(
  playlist: PublicPlaylistDetail,
  playlistVideos: PublicVideoSummary[],
  initialVideo: PublicVideoDetail,
) {
  const detailFallback: ShortformPlaybackVideo = {
    contentForm: "SHORTFORM",
    description: initialVideo.summary || initialVideo.description,
    href: `${playlist.fullPath}/${initialVideo.videoId}`,
    preacherName: initialVideo.preacherName,
    publishedAt: initialVideo.publishedAt,
    scriptureReference: initialVideo.scriptureReference,
    summary: initialVideo.summary,
    thumbnailUrl: initialVideo.thumbnailUrl,
    title: initialVideo.title,
    videoId: initialVideo.videoId,
  };

  const uniqueVideos = new Map<string, ShortformPlaybackVideo>();

  playlistVideos.forEach((video) => {
    uniqueVideos.set(video.videoId, {
      ...video,
      description:
        video.videoId === initialVideo.videoId
          ? initialVideo.summary || initialVideo.description
          : video.summary,
    });
  });

  if (!uniqueVideos.has(initialVideo.videoId)) {
    uniqueVideos.set(initialVideo.videoId, detailFallback);
  }

  return Array.from(uniqueVideos.values());
}

function buildInitialPlaybackState(playlist: PublicPlaylistDetail, initialVideo: PublicVideoDetail) {
  const initialWindow = initialVideo.shortformPlaylist;
  const initialVideos = toPlaybackVideos(playlist, initialWindow?.items ?? [], initialVideo);
  const initialIndex = (() => {
    if (!initialWindow) {
      const matchedIndex = initialVideos.findIndex((video) => video.videoId === initialVideo.videoId);
      return matchedIndex >= 0 ? matchedIndex : 0;
    }

    const targetVideoId = initialVideos[initialWindow.currentIndexInWindow]?.videoId;
    if (targetVideoId === initialVideo.videoId) {
      return initialWindow.currentIndexInWindow;
    }

    const matchedIndex = initialVideos.findIndex((video) => video.videoId === initialVideo.videoId);
    return matchedIndex >= 0 ? matchedIndex : 0;
  })();

  return {
    currentPage: initialWindow?.currentPage ?? 1,
    initialIndex,
    pageSize: initialWindow?.pageSize ?? 8,
    totalItems: initialWindow?.totalItems ?? initialVideos.length,
    totalPages: initialWindow?.totalPages ?? 1,
    videos: initialVideos,
  };
}

function PauseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8.5 6.5V17.5M15.5 6.5V17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 6.5V17.5L17 12L8 6.5Z" fill="currentColor" />
    </svg>
  );
}

function ExternalIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 5H19V10M19 5L11 13M10 7H8.6C7.48 7 6.92 7 6.492 7.218C6.115 7.41 5.81 7.715 5.618 8.092C5.4 8.52 5.4 9.08 5.4 10.2V15.4C5.4 16.52 5.4 17.08 5.618 17.508C5.81 17.885 6.115 18.19 6.492 18.382C6.92 18.6 7.48 18.6 8.6 18.6H13.8C14.92 18.6 15.48 18.6 15.908 18.382C16.285 18.19 16.59 17.885 16.782 17.508C17 17.08 17 16.52 17 15.4V14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({
  className = "",
  direction,
}: {
  className?: string;
  direction: "up" | "down";
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d={direction === "up" ? "M7 14L12 9L17 14" : "M7 10L12 15L17 10"}
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 7L17 17M17 7L7 17" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function SwipeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4V20M12 4L8.5 7.5M12 4L15.5 7.5M12 20L8.5 16.5M12 20L15.5 16.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconButton({
  ariaLabel,
  children,
  className = "",
  isActive = false,
  onClick,
}: {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      aria-pressed={isActive}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-white backdrop-blur-md transition ${isActive
        ? "border-[#f4d57d]/75 bg-[#f4d57d]/22 shadow-[0_0_0_1px_rgba(244,213,125,0.18)]"
        : "border-white/16 bg-white/10 hover:bg-white/16"
        } ${className}`}
    >
      {children}
    </button>
  );
}

function ShortformSlide({
  video,
  playerHostRef,
  showPlayer = false,
  variant = "mobile",
  currentTime = 0,
  duration = 0,
}: {
  video: ShortformPlaybackVideo;
  playerHostRef?: RefObject<HTMLDivElement | null>;
  showPlayer?: boolean;
  variant?: "mobile" | "desktop";
  currentTime?: number;
  duration?: number;
}) {
  const progressPercentage =
    duration > 0 ? `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%` : "0%";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[#0f172a]">
      {video.thumbnailUrl ? (
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover opacity-60"
          sizes="(min-width: 768px) 380px, 100vw"
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,15,26,0.32)_0%,rgba(8,15,26,0.08)_28%,rgba(8,15,26,0.68)_100%)]" />
      {showPlayer ? (
        <div
          ref={playerHostRef}
          className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0"
        />
      ) : null}

      {variant === "mobile" ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 space-y-3 px-5 pb-6 text-white">
          <div className="h-[2px] rounded-full bg-white/22">
            <div className="h-full rounded-full bg-[#d4af37]" style={{ width: progressPercentage }} />
          </div>
          <p className="truncate text-[18px] font-semibold leading-[1.35] tracking-[-0.04em]">
            {video.title}
          </p>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4 text-white">
          <div className="mb-2 text-[10px] font-medium text-white/92">
            <span>{`${formatDuration(currentTime)} / ${duration > 0 ? formatDuration(duration) : "--:--"}`}</span>
          </div>
          <div className="h-px rounded-full bg-white/32">
            <div className="h-px rounded-full bg-white" style={{ width: progressPercentage }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicShortformVideoDetailExperience({
  playlist,
  initialVideo,
}: PublicShortformVideoDetailExperienceProps) {
  const router = useRouter();
  const playerRef = useRef<YouTubePlayerInstance | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const playbackGuardTimerRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const activeVideoIdRef = useRef<string | null>(null);
  const lastLoadedVideoIdRef = useRef<string | null>(null);
  const hasActivatedAudioRef = useRef(false);
  const loadingPagesRef = useRef<Set<number>>(new Set());
  const activePointerIdRef = useRef<number | null>(null);
  const dragStartYRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const skipPushRef = useRef(true);
  const resetTimerRef = useRef<number | null>(null);
  const initialPlaybackState = useMemo(
    () => buildInitialPlaybackState(playlist, initialVideo),
    [initialVideo, playlist],
  );
  const [dragOffset, setDragOffset] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(680);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isViewportReady, setIsViewportReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videos, setVideos] = useState<ShortformPlaybackVideo[]>(initialPlaybackState.videos);
  const [currentIndex, setCurrentIndex] = useState(initialPlaybackState.initialIndex);
  const [loadedPageRange, setLoadedPageRange] = useState({
    end: initialPlaybackState.currentPage,
    start: initialPlaybackState.currentPage,
  });
  const [playlistWindowInfo, setPlaylistWindowInfo] = useState<Pick<
    PublicShortformPlaylistWindow,
    "pageSize" | "totalItems" | "totalPages"
  >>({
    pageSize: initialPlaybackState.pageSize,
    totalItems: initialPlaybackState.totalItems,
    totalPages: initialPlaybackState.totalPages,
  });
  const videosRef = useRef(videos);
  const currentIndexRef = useRef(currentIndex);
  const loadedPageRangeRef = useRef(loadedPageRange);
  const playlistWindowInfoRef = useRef(playlistWindowInfo);

  useEffect(() => {
    const nextState = buildInitialPlaybackState(playlist, initialVideo);
    hasActivatedAudioRef.current = false;
    videosRef.current = nextState.videos;
    currentIndexRef.current = nextState.initialIndex;
    loadedPageRangeRef.current = {
      end: nextState.currentPage,
      start: nextState.currentPage,
    };
    playlistWindowInfoRef.current = {
      pageSize: nextState.pageSize,
      totalItems: nextState.totalItems,
      totalPages: nextState.totalPages,
    };
    loadingPagesRef.current.clear();
    setVideos(nextState.videos);
    setCurrentIndex(nextState.initialIndex);
    setLoadedPageRange({
      end: nextState.currentPage,
      start: nextState.currentPage,
    });
    setPlaylistWindowInfo({
      pageSize: nextState.pageSize,
      totalItems: nextState.totalItems,
      totalPages: nextState.totalPages,
    });
  }, [initialVideo, playlist]);

  useEffect(() => {
    videosRef.current = videos;
  }, [videos]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    loadedPageRangeRef.current = loadedPageRange;
  }, [loadedPageRange]);

  useEffect(() => {
    playlistWindowInfoRef.current = playlistWindowInfo;
  }, [playlistWindowInfo]);

  const mergePlaybackVideos = useCallback((
    currentVideos: ShortformPlaybackVideo[],
    incomingVideos: ShortformPlaybackVideo[],
    direction: "append" | "prepend",
  ) => {
    if (direction === "prepend") {
      const currentIds = new Set(currentVideos.map((video) => video.videoId));
      const nextItems = incomingVideos.filter((video) => !currentIds.has(video.videoId));
      return {
        insertedCount: nextItems.length,
        mergedVideos: [...nextItems, ...currentVideos],
      };
    }

    const currentIds = new Set(currentVideos.map((video) => video.videoId));
    const nextItems = incomingVideos.filter((video) => !currentIds.has(video.videoId));
    return {
      insertedCount: nextItems.length,
      mergedVideos: [...currentVideos, ...nextItems],
    };
  }, []);

  const loadPlaylistPage = useCallback(async (page: number) => {
    const { pageSize, totalPages } = playlistWindowInfoRef.current;
    const { start, end } = loadedPageRangeRef.current;

    if (page < 1 || page > totalPages || (page >= start && page <= end) || loadingPagesRef.current.has(page)) {
      return false;
    }

    loadingPagesRef.current.add(page);

    try {
      const response = await fetch(
        `/api/public/videos/items?path=${encodeURIComponent(playlist.fullPath)}&page=${page}&size=${pageSize}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        return false;
      }

      const payload = await response.json() as PublicVideoList;
      if (payload.form !== "SHORTFORM") {
        return false;
      }

      const incomingVideos = payload.items.map((video) => ({
        ...video,
        description:
          video.videoId === initialVideo.videoId
            ? initialVideo.summary || initialVideo.description
            : video.summary,
      }));
      const direction = page < start ? "prepend" : "append";
      const { insertedCount, mergedVideos } = mergePlaybackVideos(videosRef.current, incomingVideos, direction);
      const nextRange = {
        start: Math.min(start, page),
        end: Math.max(end, page),
      };
      const nextWindowInfo = {
        pageSize: payload.pageSize,
        totalItems: payload.totalItems,
        totalPages: payload.totalPages,
      };

      videosRef.current = mergedVideos;
      loadedPageRangeRef.current = nextRange;
      playlistWindowInfoRef.current = nextWindowInfo;
      setVideos(mergedVideos);
      setLoadedPageRange(nextRange);
      setPlaylistWindowInfo(nextWindowInfo);

      if (direction === "prepend" && insertedCount > 0) {
        currentIndexRef.current += insertedCount;
        setCurrentIndex(currentIndexRef.current);
      }

      return true;
    } catch {
      return false;
    } finally {
      loadingPagesRef.current.delete(page);
    }
  }, [initialVideo, mergePlaybackVideos, playlist.fullPath]);

  const hasPreviousPage = loadedPageRange.start > 1;
  const hasNextPage = loadedPageRange.end < playlistWindowInfo.totalPages;
  const activeVideo = videos[currentIndex] ?? videos[0];
  const previousVideo = currentIndex > 0 ? videos[currentIndex - 1] : null;
  const nextVideo = currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;

  useEffect(() => {
    activeVideoIdRef.current = activeVideo?.videoId ?? null;
  }, [activeVideo]);

  const getActiveViewportElement = useCallback(() => {
    return viewportRef.current;
  }, []);

  useEffect(() => {
    const updateViewportHeight = () => {
      const nextHeight = getActiveViewportElement()?.clientHeight ?? 680;
      setViewportHeight(nextHeight);
    };

    updateViewportHeight();
    const resizeObserver = new ResizeObserver(() => {
      updateViewportHeight();
    });

    if (viewportRef.current) {
      resizeObserver.observe(viewportRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [getActiveViewportElement, isMobileViewport, isViewportReady]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobileViewport(mediaQuery.matches);

    const applyScrollLock = () => {
      const shouldLock = mediaQuery.matches;
      setIsMobileViewport(shouldLock);
      setIsViewportReady(true);
      document.documentElement.style.overflow = shouldLock ? "hidden" : "";
      document.body.style.overflow = shouldLock ? "hidden" : "";
    };

    applyScrollLock();
    mediaQuery.addEventListener("change", applyScrollLock);

    return () => {
      mediaQuery.removeEventListener("change", applyScrollLock);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const footer = document.querySelector<HTMLElement>("[data-site-footer]");
    if (!footer) {
      return;
    }

    const previousDisplay = footer.style.display;
    footer.style.display = "none";

    return () => {
      footer.style.display = previousDisplay;
    };
  }, []);

  const updateProgress = useCallback(() => {
    if (!playerRef.current) {
      return;
    }

    setCurrentTime(playerRef.current.getCurrentTime() || 0);
    setDuration(playerRef.current.getDuration() || 0);
  }, []);

  const clearProgressTimer = useCallback(() => {
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const clearPlaybackGuard = useCallback(() => {
    if (playbackGuardTimerRef.current) {
      window.clearTimeout(playbackGuardTimerRef.current);
      playbackGuardTimerRef.current = null;
    }
  }, []);

  const ensurePlaybackStarted = useCallback((target: YouTubePlayerInstance, startMuted = false) => {
    clearPlaybackGuard();
    playbackGuardTimerRef.current = window.setTimeout(() => {
      if (playerRef.current !== target) {
        return;
      }

      const playerState = window.YT?.PlayerState;
      const currentPlayerState =
        typeof target.getPlayerState === "function" ? target.getPlayerState() : null;

      if (playerState && currentPlayerState === playerState.PLAYING) {
        return;
      }

      if (startMuted) {
        target.mute();
      }

      target.playVideo();
      setIsPlaying(true);
    }, 360);
  }, [clearPlaybackGuard]);

  useEffect(() => {
    if (typeof window === "undefined" || !activeVideoIdRef.current || !isViewportReady) {
      return undefined;
    }

    const initializePlayer = async () => {
      await loadYouTubeIframeApi();

      const playerHost = playerHostRef.current;
      const initialVideoId = activeVideoIdRef.current;
      if (!playerHost || !window.YT?.Player || !initialVideoId) {
        return;
      }

      clearProgressTimer();
      clearPlaybackGuard();
      playerRef.current?.destroy();
      playerRef.current = null;
      playerHost.replaceChildren();
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      lastLoadedVideoIdRef.current = initialVideoId;
      const shouldBootstrapMutedAutoplay = isMobileViewport && !hasActivatedAudioRef.current;

      playerRef.current = new window.YT.Player(playerHost, {
        videoId: initialVideoId,
        playerVars: buildPlayerVars(initialVideoId, true, shouldBootstrapMutedAutoplay),
        events: {
          onReady: ({ target }) => {
            try {
              if (target.getVolume() <= 0) {
                target.setVolume(100);
              }

              if (shouldBootstrapMutedAutoplay) {
                target.mute();
              } else {
                target.unMute();
              }

              setDuration(target.getDuration() || 0);
              target.playVideo();
              ensurePlaybackStarted(target, shouldBootstrapMutedAutoplay);
            } catch {
              setIsPlaying(false);
            }
          },
          onStateChange: ({ data, target }) => {
            const playerState = window.YT?.PlayerState;
            if (!playerState) {
              return;
            }

            if (data === playerState.PLAYING) {
              clearPlaybackGuard();
              setIsPlaying(true);
              setDuration(target.getDuration() || 0);
              updateProgress();
              clearProgressTimer();
              progressTimerRef.current = window.setInterval(updateProgress, 250);
            }

            if (data === playerState.PAUSED) {
              setIsPlaying(false);
              updateProgress();
              clearProgressTimer();
            }

            if (data === playerState.ENDED) {
              setIsPlaying(false);
              updateProgress();
              clearProgressTimer();
            }
          },
        },
      });
    };

    const timer = window.setTimeout(() => {
      void initializePlayer();
    }, 260);

    return () => {
      window.clearTimeout(timer);
      clearProgressTimer();
      clearPlaybackGuard();
      playerRef.current?.destroy();
      playerRef.current = null;
      lastLoadedVideoIdRef.current = null;
    };
  }, [
    clearPlaybackGuard,
    clearProgressTimer,
    ensurePlaybackStarted,
    isMobileViewport,
    isViewportReady,
    updateProgress,
  ]);

  useEffect(() => {
    if (!activeVideo || !playerRef.current) {
      return;
    }

    if (lastLoadedVideoIdRef.current === activeVideo.videoId) {
      return;
    }

    clearProgressTimer();
    clearPlaybackGuard();
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    try {
      const shouldBootstrapMutedAutoplay = isMobileViewport && !hasActivatedAudioRef.current;
      if (shouldBootstrapMutedAutoplay) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }

      playerRef.current.loadVideoById(activeVideo.videoId);
      playerRef.current.playVideo();
      ensurePlaybackStarted(playerRef.current, shouldBootstrapMutedAutoplay);
      lastLoadedVideoIdRef.current = activeVideo.videoId;
    } catch {
      setIsPlaying(false);
    }
  }, [activeVideo, clearPlaybackGuard, clearProgressTimer, ensurePlaybackStarted, isMobileViewport]);

  useEffect(() => {
    if (!activeVideo) {
      return;
    }

    if (skipPushRef.current) {
      skipPushRef.current = false;
      return;
    }

    const targetPath = resolvePath(activeVideo.href);
    if (targetPath !== window.location.pathname) {
      window.history.pushState({ videoId: activeVideo.videoId }, "", targetPath);
    }
  }, [activeVideo]);

  useEffect(() => {
    if (!activeVideo) {
      return;
    }

    const adjacentVideos = [previousVideo, nextVideo].filter(Boolean) as ShortformPlaybackVideo[];
    adjacentVideos.forEach((video) => {
      router.prefetch(video.href);
    });
  }, [activeVideo, nextVideo, previousVideo, router]);

  useEffect(() => {
    if (!activeVideo) {
      return;
    }

    if (currentIndex >= videos.length - 2 && hasNextPage) {
      void loadPlaylistPage(loadedPageRange.end + 1);
    }

    if (currentIndex <= 1 && hasPreviousPage) {
      void loadPlaylistPage(loadedPageRange.start - 1);
    }
  }, [
    activeVideo,
    currentIndex,
    hasNextPage,
    hasPreviousPage,
    loadPlaylistPage,
    loadedPageRange.end,
    loadedPageRange.start,
    videos.length,
  ]);

  useEffect(() => {
    const syncIndexFromLocation = () => {
      const nextIndex = videos.findIndex((video) => resolvePath(video.href) === window.location.pathname);
      if (nextIndex < 0) {
        return;
      }

      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }

      skipPushRef.current = true;
      setTransitionEnabled(false);
      setIsAnimating(false);
      setDragOffset(0);
      dragOffsetRef.current = 0;
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    };

    window.addEventListener("popstate", syncIndexFromLocation);

    return () => {
      window.removeEventListener("popstate", syncIndexFromLocation);
    };
  }, [videos]);

  const commitIndexChange = useCallback((direction: "prev" | "next") => {
    const offset = direction === "next" ? -viewportHeight : viewportHeight;

    setTransitionEnabled(true);
    setIsAnimating(true);
    setDragOffset(offset);
    dragOffsetRef.current = offset;

    resetTimerRef.current = window.setTimeout(() => {
      setTransitionEnabled(false);
      setDragOffset(0);
      dragOffsetRef.current = 0;
      currentIndexRef.current += direction === "next" ? 1 : -1;
      setCurrentIndex(currentIndexRef.current);
      setIsAnimating(false);
      resetTimerRef.current = null;
    }, SWITCH_ANIMATION_MS);
  }, [viewportHeight]);

  const ensureAdjacentVideo = useCallback(async (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentIndexRef.current > 0) {
        return true;
      }

      if (loadedPageRangeRef.current.start <= 1) {
        return false;
      }

      return loadPlaylistPage(loadedPageRangeRef.current.start - 1);
    }

    if (currentIndexRef.current < videosRef.current.length - 1) {
      return true;
    }

    if (loadedPageRangeRef.current.end >= playlistWindowInfoRef.current.totalPages) {
      return false;
    }

    return loadPlaylistPage(loadedPageRangeRef.current.end + 1);
  }, [loadPlaylistPage]);

  const moveToPrevious = useCallback(async () => {
    if (isAnimating) {
      return;
    }

    if (!(await ensureAdjacentVideo("prev")) || currentIndexRef.current <= 0) {
      return;
    }

    commitIndexChange("prev");
  }, [commitIndexChange, ensureAdjacentVideo, isAnimating]);

  const moveToNext = useCallback(async () => {
    if (isAnimating) {
      return;
    }

    if (!(await ensureAdjacentVideo("next")) || currentIndexRef.current >= videosRef.current.length - 1) {
      return;
    }

    commitIndexChange("next");
  }, [commitIndexChange, ensureAdjacentVideo, isAnimating]);

  const snapBack = () => {
    setTransitionEnabled(true);
    setDragOffset(0);
    dragOffsetRef.current = 0;
    window.setTimeout(() => {
      setTransitionEnabled(false);
    }, SWITCH_ANIMATION_MS);
  };

  const finishDrag = async (deltaY: number) => {
    const threshold = Math.max(viewportHeight * SWIPE_THRESHOLD_RATIO, SWIPE_THRESHOLD_PX);

    if (deltaY <= -threshold) {
      if (!(await ensureAdjacentVideo("next")) || currentIndexRef.current >= videosRef.current.length - 1) {
        snapBack();
        return;
      }

      commitIndexChange("next");
      return;
    }

    if (deltaY >= threshold) {
      if (!(await ensureAdjacentVideo("prev")) || currentIndexRef.current <= 0) {
        snapBack();
        return;
      }

      commitIndexChange("prev");
      return;
    }

    snapBack();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isAnimating) {
      return;
    }

    activePointerIdRef.current = event.pointerId;
    dragStartYRef.current = event.clientY;
    dragStartXRef.current = event.clientX;
    setTransitionEnabled(false);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId || isAnimating) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;
    const deltaY = event.clientY - dragStartYRef.current;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return;
    }

    let nextOffset = deltaY;
    if ((nextOffset > 0 && !previousVideo && !hasPreviousPage) || (nextOffset < 0 && !nextVideo && !hasNextPage)) {
      nextOffset *= 0.28;
    }

    const boundedOffset = Math.max(-viewportHeight, Math.min(viewportHeight, nextOffset));
    dragOffsetRef.current = boundedOffset;
    setDragOffset(boundedOffset);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;
    const deltaY = event.clientY - dragStartYRef.current;
    activePointerIdRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (Math.abs(deltaX) <= CLICK_THRESHOLD_PX && Math.abs(deltaY) <= CLICK_THRESHOLD_PX) {
      if (activateAudioOnTap()) {
        return;
      }

      togglePlayback();
      return;
    }

    void finishDrag(dragOffsetRef.current);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    activePointerIdRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    snapBack();
  };

  useEffect(() => {
    const handleKeyNavigation = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        void moveToPrevious();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        void moveToNext();
      }
    };

    window.addEventListener("keydown", handleKeyNavigation);

    return () => {
      window.removeEventListener("keydown", handleKeyNavigation);
    };
  }, [moveToNext, moveToPrevious]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const activateAudioOnTap = () => {
    if (!isMobileViewport || !playerRef.current || !playerRef.current.isMuted()) {
      return false;
    }

    if (playerRef.current.getVolume() <= 0) {
      playerRef.current.setVolume(100);
    }

    hasActivatedAudioRef.current = true;
    playerRef.current.unMute();
    playerRef.current.playVideo();
    setIsPlaying(true);
    return true;
  };

  const togglePlayback = () => {
    if (!playerRef.current) {
      return;
    }

    const playerState = window.YT?.PlayerState;
    const currentPlayerState =
      typeof playerRef.current.getPlayerState === "function"
        ? playerRef.current.getPlayerState()
        : null;
    const isCurrentlyPlaying =
      playerState && currentPlayerState !== null
        ? currentPlayerState === playerState.PLAYING
        : isPlaying;

    if (isCurrentlyPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      return;
    }

    playerRef.current.playVideo();
    setIsPlaying(true);
  };

  const handleFullscreen = async () => {
    const element = getActiveViewportElement();

    if (!element) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await element.requestFullscreen();
  };

  if (!activeVideo) {
    return null;
  }

  const activeMeta = [activeVideo.scriptureReference, activeVideo.preacherName]
    .filter(Boolean)
    .join(" · ");

  return (
    <div data-shortform-detail-page>
      {isMobileViewport ? (
      <div className="fixed inset-0 z-[60] bg-[#111827] text-white">
        <div className="relative flex h-full flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-black/68 via-black/18 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-52 bg-gradient-to-t from-black/86 via-black/32 to-transparent" />

          <div className="absolute inset-x-0 top-0 z-30 flex items-center px-4 pt-[max(env(safe-area-inset-top),16px)]">
            <Link
              href={playlist.fullPath}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white backdrop-blur-md"
              aria-label="재생목록으로 돌아가기"
            >
              <CloseIcon className="h-5 w-5" />
            </Link>
          </div>

          <div ref={viewportRef} className="relative h-full w-full overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                transform: `translate3d(0, ${dragOffset}px, 0)`,
                transition: transitionEnabled ? `transform ${SWITCH_ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : undefined,
              }}
            >
              {previousVideo ? (
                <div className="absolute inset-0 translate-y-[-100%] px-0 py-0">
                  <ShortformSlide video={previousVideo} />
                </div>
              ) : null}

              <div className="absolute inset-0 px-0 py-0">
                <ShortformSlide
                  video={activeVideo}
                  showPlayer
                  playerHostRef={playerHostRef}
                  currentTime={currentTime}
                  duration={duration}
                />
              </div>

              {nextVideo ? (
                <div className="absolute inset-0 translate-y-[100%] px-0 py-0">
                  <ShortformSlide video={nextVideo} />
                </div>
              ) : null}
            </div>

            <div
              className="absolute inset-0 z-10 cursor-grab touch-none active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 z-30 px-5 pb-[max(env(safe-area-inset-bottom),24px)]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] text-white/72">
                <SwipeIcon className="h-4 w-4" />
              </div>

            </div>
          </div>
        </div>
      </div>
      ) : (
      <section className="bg-white text-[#10213f]">
        <div className="section-shell">
          <div className="relative min-h-[760px]">
            <div className="flex min-h-[760px] items-center justify-center">
              <div className="w-full max-w-[380px] rounded-[32px] bg-[#101826] p-2 shadow-[0_28px_70px_rgba(8,15,26,0.22)]">
                <div ref={viewportRef} className="relative h-[680px] overflow-hidden rounded-[26px] bg-[#101826]">
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: `translate3d(0, ${dragOffset}px, 0)`,
                      transition: transitionEnabled ? `transform ${SWITCH_ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : undefined,
                    }}
                  >
                    {previousVideo ? (
                      <div className="absolute inset-0 translate-y-[-100%]">
                        <ShortformSlide video={previousVideo} variant="desktop" />
                      </div>
                    ) : null}

                    <div className="absolute inset-0">
                      <ShortformSlide
                        video={activeVideo}
                        showPlayer
                        playerHostRef={playerHostRef}
                        variant="desktop"
                        currentTime={currentTime}
                        duration={duration}
                      />
                    </div>

                    {nextVideo ? (
                      <div className="absolute inset-0 translate-y-[100%]">
                        <ShortformSlide video={nextVideo} variant="desktop" />
                      </div>
                    ) : null}
                  </div>

                  <div
                    className="absolute inset-0 z-10 cursor-grab touch-none active:cursor-grabbing"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                  />

                  <div className="absolute left-5 top-5 z-20 flex items-center gap-2">
                    <IconButton ariaLabel={isPlaying ? "일시정지" : "재생"} onClick={togglePlayback} className="h-10 w-10">
                      {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                    </IconButton>
                  </div>

                  <div className="absolute bottom-5 right-5 z-20">
                    <button
                      type="button"
                      onClick={handleFullscreen}
                      className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[12px] font-medium text-white backdrop-blur-md transition hover:bg-white/16"
                    >
                      <ExternalIcon className="h-4 w-4" />
                      크게 보기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 left-0 hidden max-w-[320px] min-[1200px]:block">
              <h1 className="line-clamp-2 text-[28px] font-semibold leading-[1.22] tracking-[-0.05em] text-[#10213f]">
                {activeVideo.title}
              </h1>
              {activeMeta ? (
                <p className="mt-2 line-clamp-1 text-[14px] leading-[1.6] text-[#3d4a63]">{activeMeta}</p>
              ) : null}
            </div>

            <div className="absolute right-[32px] top-1/2 flex -translate-y-1/2 flex-col items-center gap-3 xl:right-[72px]">
              <button
                type="button"
                onClick={() => {
                  void moveToPrevious();
                }}
                disabled={!previousVideo && !hasPreviousPage}
                aria-label="이전 영상"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f1f1] text-[#10213f] transition hover:bg-[#e6e6e6] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronIcon direction="up" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  void moveToNext();
                }}
                disabled={!nextVideo && !hasNextPage}
                aria-label="다음 영상"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f1f1] text-[#10213f] transition hover:bg-[#e6e6e6] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronIcon direction="down" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
