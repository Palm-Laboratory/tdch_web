"use client";

import { useEffect, useRef, useState } from "react";

const SHOW_AFTER_SCROLL_Y = 320;
const DARK_SURFACE_LUMINANCE_THRESHOLD = 0.45;

function parseRgbColor(color: string) {
  const match = color.match(/rgba?\(([^)]+)\)/);

  if (!match) {
    return null;
  }

  const [r = "0", g = "0", b = "0", a = "1"] = match[1].split(",").map((value) => value.trim());
  const alpha = Number(a);

  if (alpha === 0) {
    return null;
  }

  return {
    r: Number(r),
    g: Number(g),
    b: Number(b),
  };
}

function getRelativeLuminance(r: number, g: number, b: number) {
  const toLinear = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  };

  const [red, green, blue] = [toLinear(r), toLinear(g), toLinear(b)];
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export default function BackToTopFab() {
  const [isVisible, setIsVisible] = useState(false);
  const [useInverseTheme, setUseInverseTheme] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frameId = 0;

    const updateState = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL_Y);

      const button = buttonRef.current;
      if (!button) {
        return;
      }

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const elements = document.elementsFromPoint(centerX, centerY);

      const surface = elements.find((element) => {
        if (element === button || button.contains(element)) {
          return false;
        }

        const { backgroundColor } = window.getComputedStyle(element);
        return parseRgbColor(backgroundColor) !== null;
      });

      if (!surface) {
        setUseInverseTheme(false);
        return;
      }

      const rgb = parseRgbColor(window.getComputedStyle(surface).backgroundColor);

      if (!rgb) {
        setUseInverseTheme(false);
        return;
      }

      const luminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
      setUseInverseTheme(luminance < DARK_SURFACE_LUMINANCE_THRESHOLD);
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateState);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      aria-label="맨 위로 이동"
      className={`fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_16px_34px_rgba(16,33,63,0.18)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 md:bottom-7 md:right-7 md:h-14 md:w-14 ${
        useInverseTheme
          ? "border-white/18 bg-themeBlue/84 text-white hover:border-white/30 hover:bg-themeBlue"
          : "border-cedar/15 bg-white/92 text-themeBlue hover:border-cedar/30 hover:bg-white hover:text-cedar"
      } ${
        isVisible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5 md:h-6 md:w-6"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m6 15 6-6 6 6" />
      </svg>
    </button>
  );
}
