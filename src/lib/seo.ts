// src/lib/seo.ts
import {
  SITE_DESCRIPTION as SITE_DESCRIPTION_VALUE,
  SITE_NAME as SITE_NAME_VALUE,
  SITE_TAGLINE as SITE_TAGLINE_VALUE,
  SITE_URL as SITE_URL_VALUE,
} from "@/lib/site-config";

export const SITE_URL = SITE_URL_VALUE;
export const SITE_NAME = SITE_NAME_VALUE;
export const SITE_DESCRIPTION = SITE_DESCRIPTION_VALUE;
export const SITE_TAGLINE = SITE_TAGLINE_VALUE;

export const SITE_LOCALE = "ko_KR";

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/images/logo/church_logo.png`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
  type: "image/png",
};

/**
 * 페이지별 메타데이터를 생성할 때 사용하는 헬퍼.
 * title과 description만 넘기면 OG/Twitter 메타데이터가 자동으로 포함된다.
 */
export function createPageMetadata({
  title,
  description,
  path = "",
  ogImage,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: { url: string; width: number; height: number; alt: string };
}) {
  const pageTitle = `${title} | ${SITE_NAME}`;
  const canonical = `${SITE_URL}${path}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title: pageTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "website" as const,
      images: [image],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: pageTitle,
      description,
      images: [image.url],
    },
  };
}
