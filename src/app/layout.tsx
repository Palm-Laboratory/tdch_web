import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";

import "./globals.css";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"]
});

const serif = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"]
});

const yeongwol = localFont({
  src: "./fonts/YeongwolTTF.ttf",
  variable: "--font-yeongwol",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The 제자교회",
  description: "성령으로 제자삼는 교회",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "The 제자교회"
  }
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${sans.variable} ${serif.variable} ${yeongwol.variable} font-[var(--font-sans)] antialiased`}>
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="afterInteractive" />
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-clay/15 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-moss/10 blur-3xl" />
          </div>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
