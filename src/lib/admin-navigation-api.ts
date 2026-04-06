import "server-only";

import { adminApiFetch } from "@/lib/admin-api";

export type AdminNavigationLinkType = "INTERNAL" | "ANCHOR" | "EXTERNAL" | "CONTENT_REF";

export interface AdminNavigationItem {
  id: number;
  parentId: number | null;
  menuKey: string;
  label: string;
  href: string;
  matchPath: string | null;
  linkType: AdminNavigationLinkType;
  contentSiteKey: string | null;
  visible: boolean;
  headerVisible: boolean;
  mobileVisible: boolean;
  lnbVisible: boolean;
  breadcrumbVisible: boolean;
  defaultLanding: boolean;
  sortOrder: number;
  updatedAt: string;
  children: AdminNavigationItem[];
}

export interface AdminNavigationTreeResponse {
  groups: AdminNavigationItem[];
}

export interface AdminContentMenu {
  siteKey: string;
  menuName: string;
  slug: string;
  contentKind: string;
  active: boolean;
}

export interface AdminContentMenusResponse {
  items: AdminContentMenu[];
}

export async function getAdminNavigationItems(includeHidden = true): Promise<AdminNavigationTreeResponse> {
  const response = await adminApiFetch(`/api/v1/admin/navigation/items?includeHidden=${includeHidden ? "true" : "false"}`);
  return response.json() as Promise<AdminNavigationTreeResponse>;
}

export async function getAdminContentMenus(): Promise<AdminContentMenusResponse> {
  const response = await adminApiFetch("/api/v1/admin/navigation/content-menus");
  return response.json() as Promise<AdminContentMenusResponse>;
}
