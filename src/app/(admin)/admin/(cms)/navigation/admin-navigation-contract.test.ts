import type {
  AdminNavigationItem,
  NavigationItemPayload,
} from "@/lib/admin-navigation-api";

const _assertVideoPageItem = {
  id: 101,
  parentId: null,
  label: "주일예배",
  href: "/sermons",
  matchPath: "/sermons",
  linkType: "INTERNAL",
  menuType: "VIDEO_PAGE",
  videoRootKey: "sermons",
  landingMode: "ROOT",
  contentKindFilter: "LONG_FORM",
  visible: true,
  headerVisible: true,
  mobileVisible: true,
  lnbVisible: true,
  breadcrumbVisible: true,
  defaultLanding: true,
  sortOrder: 1,
  updatedAt: "2026-04-15T00:00:00+09:00",
  children: [],
} satisfies AdminNavigationItem;

void _assertVideoPageItem;

const _assertVideoPagePayload = {
  parentId: null,
  label: "주일예배",
  href: "/sermons",
  matchPath: "/sermons",
  linkType: "INTERNAL",
  menuType: "VIDEO_PAGE",
  videoRootKey: "sermons",
  landingMode: "ROOT",
  contentKindFilter: "LONG_FORM",
  visible: true,
  headerVisible: true,
  mobileVisible: true,
  lnbVisible: true,
  breadcrumbVisible: true,
  defaultLanding: true,
  sortOrder: 1,
} satisfies NavigationItemPayload;

void _assertVideoPagePayload;

