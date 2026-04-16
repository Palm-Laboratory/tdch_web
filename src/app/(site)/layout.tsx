import type { Metadata, Viewport } from "next";

import RootLayoutAccessories from "@/components/root-layout-accessories";
import SiteHeader from "@/components/site-header";
import { NavigationProvider } from "@/lib/navigation-context";
import { getNavigationResponse } from "@/lib/navigation-api";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_LOCALE, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { ChurchJsonLd, WebSiteJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — 성령으로 제자삼는 교회`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "더제자교회",
    "The 제자교회",
    "The제자교회",
    "수원교회",
    "팔달구교회",
    "침례교회",
    "제자훈련",
    "교회홈페이지",
  ],
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — 성령으로 제자삼는 교회`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — 성령으로 제자삼는 교회`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  icons: {
    icon: "/images/logo/church_logo.png",
    apple: "/images/logo/church_logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = await getNavigationResponse();

  return (
    <>
      <ChurchJsonLd />
      <WebSiteJsonLd />
      <NavigationProvider navigation={navigation}>
        <div className="relative flex min-h-screen flex-col [overflow-x:clip]">
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-clay/15 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-moss/10 blur-3xl" />
          </div>
          <SiteHeader />
          <main className="flex-1 pt-[var(--site-header-height,0px)] lg:pt-0">{children}</main>
          <RootLayoutAccessories />
        </div>
      </NavigationProvider>
    </>
  );
}
