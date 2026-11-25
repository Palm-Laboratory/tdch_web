import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "./globals.scss";
import { nanumMyeongjo, notoSansKr, notoSerifKr, yeongwol } from "@/lib/fonts";

export const metadata: Metadata = {
  verification: {
    other: {
      "naver-site-verification": "6fc0563c14ae5fcb72b60e3e49604f89837a6302",
    },
  },
};

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
