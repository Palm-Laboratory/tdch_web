import type { Viewport } from "next";
import Script from "next/script";

import "./globals.css";
import { nanumMyeongjo, notoSansKr, notoSerifKr, yeongwol } from "@/lib/fonts";

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
        className={`${notoSansKr.variable} ${notoSerifKr.variable} ${nanumMyeongjo.variable} ${yeongwol.variable} font-sans antialiased`}
      >
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
