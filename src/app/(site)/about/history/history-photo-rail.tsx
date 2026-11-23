"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HistoryImage = {
  src: string;
  width: number;
  height: number;
};

type HistoryGallery = {
  label: string;
  images: [HistoryImage, HistoryImage, HistoryImage];
};

const HISTORY_GALLERIES: HistoryGallery[] = [
  {
    label: "교회와 함께한 다음세대",
    images: [
      { src: "/images/history/h1.png", width: 333, height: 231 },
      { src: "/images/history/h2.png", width: 484, height: 248 },
      { src: "/images/history/h3.png", width: 1011, height: 778 },
    ],
  },
  {
    label: "섬김과 나눔",
    images: [
      { src: "/images/history/h4.png", width: 1362, height: 644 },
      { src: "/images/history/h5.png", width: 532, height: 354 },
      { src: "/images/history/h6.png", width: 481, height: 263 },
    ],
  },
  {
    label: "예배 공동체",
    images: [
      { src: "/images/greeting/our_mission_5.jpg", width: 4000, height: 2794 },
      { src: "/images/greeting/our_mission_3.jpg", width: 1400, height: 1050 },
      { src: "/images/greeting/our_mission_4.jpg", width: 1400, height: 1050 },
    ],
  },
];

function useActiveGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const historyItems = Array.from(document.querySelectorAll<HTMLElement>("[data-history-index]"));

    if (historyItems.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleItems = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        const activeItem = visibleItems[0]?.target as HTMLElement | undefined;

        if (!activeItem) {
          return;
        }

        const itemIndex = Number(activeItem.dataset.historyIndex);
        const nextGalleryIndex = Math.min(
          HISTORY_GALLERIES.length - 1,
          Math.floor((itemIndex / historyItems.length) * HISTORY_GALLERIES.length),
        );

        setActiveIndex((currentIndex) => (currentIndex === nextGalleryIndex ? currentIndex : nextGalleryIndex));
      },
      { rootMargin: "-160px 0px -58% 0px", threshold: 0 },
    );

    historyItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return activeIndex;
}

function GalleryFigure({ activeIndex, fixedGalleryIndex }: { activeIndex: number; fixedGalleryIndex?: number }) {
  const galleries = fixedGalleryIndex === undefined
    ? HISTORY_GALLERIES.map((gallery, index) => ({ gallery, index }))
    : [{ gallery: HISTORY_GALLERIES[fixedGalleryIndex], index: fixedGalleryIndex }];

  return (
    <div className="relative w-full">
      {galleries.map(({ gallery, index: galleryIndex }) => {
        const isActive = activeIndex === galleryIndex;

        return (
          <figure
            aria-hidden={!isActive}
            className={`flex flex-col overflow-hidden bg-white shadow-soft transition-opacity duration-500 ease-out ${
              isActive
                ? "relative z-10 opacity-100"
                : "pointer-events-none absolute inset-x-0 top-0 z-0 opacity-0"
            }`}
            key={gallery.label}
          >
            <div className="flex h-11 shrink-0 items-center justify-between bg-site-ink px-4">
              <div className="ml-auto flex shrink-0 items-center gap-1.5" aria-hidden="true">
                {HISTORY_GALLERIES.map((_, index) => (
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                      activeIndex === index ? "bg-site-gold" : "bg-white/35"
                    }`}
                    key={index}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 bg-white p-2">
              <Image
                alt={`${gallery.label} 사진`}
                className="block h-auto w-full object-contain"
                height={gallery.images[0].height}
                sizes="(min-width: 1280px) 400px, 34vw"
                src={gallery.images[0].src}
                width={gallery.images[0].width}
              />
              <div className="grid grid-cols-2 items-start gap-2">
                {gallery.images.slice(1).map((image) => (
                  <Image
                    alt=""
                    className="block h-auto w-full object-contain"
                    height={image.height}
                    key={image.src}
                    sizes="(min-width: 1280px) 200px, 17vw"
                    src={image.src}
                    width={image.width}
                  />
                ))}
              </div>
            </div>
          </figure>
        );
      })}
    </div>
  );
}

export function HistoryPhotoMobile({ galleryIndex }: { galleryIndex: number }) {
  return (
    <section className="md:hidden" aria-label="교회 사역 사진">
      <GalleryFigure activeIndex={galleryIndex} fixedGalleryIndex={galleryIndex} />
    </section>
  );
}

export default function HistoryPhotoRail() {
  const activeIndex = useActiveGallery();

  return (
    <aside className="relative hidden self-stretch md:block" aria-label="교회 사역 사진">
      <div className="sticky top-28">
        <GalleryFigure activeIndex={activeIndex} />
      </div>
    </aside>
  );
}
