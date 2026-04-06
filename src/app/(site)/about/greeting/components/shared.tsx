import { Nanum_Myeongjo, Original_Surfer } from "next/font/google";

export const originalSurfer = Original_Surfer({
  subsets: ["latin"],
  weight: "400"
});

export const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700", "800"]
});

export const sectionNumberClass =
  `${originalSurfer.className} type-display-number pointer-events-none absolute left-[-10px] top-[-28px] tracking-normal`;
export const sectionOneNumberClass = "left-[10px] top-[-35px] md:left-[-9px] md:top-[-35px]";
export const sectionTwoNumberClass = "top-[-75px] md:left-[-40px] md:top-[-80px]";
export const sectionThreeNumberClass = "top-[-75px] md:left-[-40px] md:top-[-80px]";
export const sectionEyebrowClass =
  `${originalSurfer.className} type-eyebrow tracking-[0.08em] text-[#caa643]`;
export const sectionTitleClass =
  `${nanumMyeongjo.className} type-section-title font-bold tracking-[0.01em]`;
export const sectionIntroGroupClass = "flex flex-col gap-[14px]";
export const sectionCopyStackClass = "relative z-10 flex flex-col gap-[24px]";

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const, delay }
  })
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" as const, delay }
  })
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const, delay }
  })
};

export const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const, delay }
  })
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const, delay }
  })
};
