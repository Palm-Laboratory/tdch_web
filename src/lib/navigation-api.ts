import "server-only";

import { PUBLIC_MENU_REVALIDATE_OPTIONS } from "@/lib/public-cache-policy";
import type { NavigationResponse, NavMenuGroup } from "@/lib/navigation-types";
import { getOrSetPublicRequestCache } from "@/lib/public-request-cache";
import { serverFetchJson } from "@/lib/server-fetch";
import { toNavMenuGroups } from "@/lib/navigation-utils";

const FALLBACK_NAVIGATION_RESPONSE = {
  groups: [
    {
      key: "about",
      type: "FOLDER",
      label: "교회 소개",
      href: "/about",
      matchPath: "/about",
      linkType: "INTERNAL",
      contentSiteKey: null,
      visible: true,
      headerVisible: true,
      mobileVisible: true,
      lnbVisible: true,
      breadcrumbVisible: true,
      defaultLandingHref: "/about/greeting",
      items: [
        createStaticNavigationItem("greeting", "인사말/비전", "/about/greeting", "about.greeting", true),
        createStaticNavigationItem("pastor", "담임목사 소개", "/about/pastor", "about.pastor"),
        createStaticNavigationItem("service-times", "예배 시간 안내", "/about/service-times", "about.service-times"),
        createStaticNavigationItem("location", "오시는 길", "/about/location", "about.location"),
        createStaticNavigationItem("history", "교회 연혁", "/about/history", "about.history"),
        createStaticNavigationItem("giving", "헌금 안내", "/about/giving", "about.giving"),
      ],
    },
    {
      key: "newcomer",
      type: "FOLDER",
      label: "제자 양육",
      href: "/newcomer",
      matchPath: "/newcomer",
      linkType: "INTERNAL",
      contentSiteKey: null,
      visible: true,
      headerVisible: true,
      mobileVisible: true,
      lnbVisible: true,
      breadcrumbVisible: true,
      defaultLandingHref: "/newcomer/guide",
      items: [
        createStaticNavigationItem("guide", "새가족 안내", "/newcomer/guide", "newcomer.guide", true),
        createStaticNavigationItem("care", "새가족 양육", "/newcomer/care", "newcomer.care"),
        createStaticNavigationItem("disciples", "제자 훈련", "/newcomer/disciples", "newcomer.disciples"),
      ],
    },
    {
      key: "commission",
      type: "FOLDER",
      label: "지상 명령",
      href: "/commission",
      matchPath: "/commission",
      linkType: "INTERNAL",
      contentSiteKey: null,
      visible: true,
      headerVisible: true,
      mobileVisible: true,
      lnbVisible: true,
      breadcrumbVisible: true,
      defaultLandingHref: "/commission/summary",
      items: [
        createStaticNavigationItem("summary", "개요", "/commission/summary", "commission.summary", true),
        createStaticNavigationItem("nextgen", "다음 세대", "/commission/nextgen", "commission.nextgen"),
        createStaticNavigationItem("culture", "다문화·다민족", "/commission/culture", "commission.culture"),
        createStaticNavigationItem("senior", "시니어", "/commission/senior", "commission.senior"),
      ],
    },
  ],
} satisfies NavigationResponse;

function createStaticNavigationItem(
  key: string,
  label: string,
  href: string,
  contentSiteKey: string,
  defaultLanding = false,
): NavigationResponse["groups"][number]["items"][number] {
  return {
    key,
    type: "STATIC",
    label,
    href,
    matchPath: href,
    linkType: "INTERNAL",
    contentSiteKey,
    visible: true,
    headerVisible: true,
    mobileVisible: true,
    lnbVisible: true,
    breadcrumbVisible: true,
    defaultLanding,
  };
}

export async function getNavigationResponse(): Promise<NavigationResponse> {
  return getOrSetPublicRequestCache("navigation-response", async () => {
    try {
      return await serverFetchJson<NavigationResponse>("/api/v1/public/menu", {
        next: PUBLIC_MENU_REVALIDATE_OPTIONS,
      });
    } catch (error) {
      console.warn("Using fallback navigation because the public menu API failed.", error);
      return FALLBACK_NAVIGATION_RESPONSE;
    }
  });
}

export async function getNavMenuGroups(): Promise<NavMenuGroup[]> {
  const navigation = await getNavigationResponse();
  return toNavMenuGroups(navigation);
}

export async function getNavigationGroupByKey(key: string): Promise<NavMenuGroup | undefined> {
  const groups = await getNavMenuGroups();
  return groups.find((group) => group.key === key);
}
