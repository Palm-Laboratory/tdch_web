// src/lib/seo.ts
import type { Metadata } from "next";
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

// OG이미지 기본 값
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/images/logo/church_logo.png`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
  type: "image/png",
};

type SeoImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
};

//-- 내부 헬퍼 함수 --
// 1. 경로를 받아 완전한 URL로 조립
function buildCanonicalUrl(path = ""): string {
  if (!path) {
    return SITE_URL;
  }

  return new URL(path, `${SITE_URL}/`).toString();
}

// 2. SNS 공유 시 표시되는 title
function buildSocialTitle(title: string) {
  return `${title} | ${SITE_NAME}`;
}
//-- 내부 헬퍼 함수 --

// 정적 페이지 전용 메타데이터 생성 함수
export function createPageMetadata({
  title,
  description,
  path = "",
  ogImage,
  absoluteTitle,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: SeoImage;
  absoluteTitle?: string;
}): Metadata {
  const canonical = buildCanonicalUrl(path);
  const image = ogImage ?? DEFAULT_OG_IMAGE;
  const socialTitle = absoluteTitle ?? buildSocialTitle(title);

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "website" as const,
      images: [image],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: socialTitle,
      description,
      images: [image.url],
    },
  };
}

// 동영상 페이지 전용 메타데이터 생성 함수
export function createVideoMetadata({
  title,
  description,
  path,
  ogImage,
  publishedTime,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: SeoImage;
  publishedTime?: string;
}): Metadata {
  const canonical = buildCanonicalUrl(path);
  const image = ogImage ?? DEFAULT_OG_IMAGE;
  const socialTitle = buildSocialTitle(title);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "video.other",
      images: [image],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image.url],
    },
  };
}
