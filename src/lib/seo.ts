// src/lib/seo.ts

export const SITE_URL = "https://www.tdch.co.kr";
export const SITE_NAME = "The 제자교회";
export const SITE_DESCRIPTION = "성령으로 제자삼는 교회 — 경기도 수원시 팔달구 경수대로425 지하1층(나인아트홀)";
export const SITE_LOCALE = "ko_KR";

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: "The 제자교회 — 성령으로 제자삼는 교회",
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
