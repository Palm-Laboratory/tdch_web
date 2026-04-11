import type { Viewport } from "next";
import { Nanum_Myeongjo, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";

import "./globals.css";

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
});

const serif = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
});

const sectionTitle = Nanum_Myeongjo({
  subsets: ["latin"],
  variable: "--font-section-title",
  weight: ["400", "700", "800"],
});

const yeongwol = localFont({
  src: "./fonts/YeongwolTTF.ttf",
  variable: "--font-yeongwol",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${sans.variable} ${serif.variable} ${sectionTitle.variable} ${yeongwol.variable} font-sans antialiased`}
      >
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
