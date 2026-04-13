export type NavigationLinkType = "INTERNAL" | "ANCHOR" | "EXTERNAL";

export interface NavigationItemDto {
  key: string;
  label: string;
  href: string;
  matchPath: string | null;
  linkType: NavigationLinkType;
  visible: boolean;
  headerVisible: boolean;
  mobileVisible: boolean;
  lnbVisible: boolean;
  breadcrumbVisible: boolean;
  defaultLanding: boolean;
}

export interface NavigationGroupDto {
  key: string;
  label: string;
  href: string;
  matchPath: string | null;
  linkType: NavigationLinkType;
  visible: boolean;
  headerVisible: boolean;
  mobileVisible: boolean;
  lnbVisible: boolean;
  breadcrumbVisible: boolean;
  defaultLandingHref: string | null;
  items: NavigationItemDto[];
}

export interface NavigationResponse {
  groups: NavigationGroupDto[];
}

export interface NavSubItem {
  key: string;
  href: string;
  label: string;
  matchPath?: string | null;
  linkType: NavigationLinkType;
  hiddenInHeader?: boolean;
  hiddenInMobile?: boolean;
  hiddenInLnb?: boolean;
  hiddenInBreadcrumb?: boolean;
  defaultLanding?: boolean;
}

export interface NavMenuGroup {
  key: string;
  href: string;
  label: string;
  matchPath?: string | null;
  items: NavSubItem[];
  linkType: NavigationLinkType;
  hiddenInHeader?: boolean;
  hiddenInMobile?: boolean;
  hiddenInLnb?: boolean;
  hiddenInBreadcrumb?: boolean;
  defaultLandingHref?: string | null;
}
