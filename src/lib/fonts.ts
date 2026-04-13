import localFont from "next/font/local";

export const notoSansKr = localFont({
  src: "../app/fonts/noto/NotoSansKR-VariableFont_wght.ttf",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
});

export const notoSerifKr = localFont({
  src: "../app/fonts/noto/NotoSerifKR-VariableFont_wght.ttf",
  variable: "--font-serif",
  display: "swap",
  weight: "100 900",
});

export const nanumMyeongjo = localFont({
  src: "../app/fonts/nanum/NanumMyeongjo-Regular.ttf",
  variable: "--font-section-title",
  display: "swap",
});

export const yeongwol = localFont({
  src: "../app/fonts/yeongwol/YeongwolTTF.ttf",
  variable: "--font-yeongwol",
  display: "swap",
});

export const gowunBatang = localFont({
  src: "../app/fonts/gowun/GowunBatang-Regular.ttf",
  display: "swap",
});

export const dmSerifDisplay = localFont({
  src: "../app/fonts/dm_serif/DMSerifDisplay-Regular.ttf",
  display: "swap",
});

export const cormorantGaramond = localFont({
  src: "../app/fonts/cormorant/CormorantGaramond-VariableFont_wght.ttf",
  display: "swap",
});

export const originalSurfer = localFont({
  src: "../app/fonts/original_surfer/OriginalSurfer-Regular.ttf",
  display: "swap",
});
