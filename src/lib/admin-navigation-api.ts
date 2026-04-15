import "server-only";

import { adminApiFetch } from "@/lib/admin-api";

export type AdminNavigationLinkType = "INTERNAL" | "ANCHOR" | "EXTERNAL" | "CONTENT_REF";
export type AdminNavigationEditableLinkType = Exclude<AdminNavigationLinkType, "CONTENT_REF">;
export type AdminNavigationMenuType = "STATIC_PAGE" | "BOARD_PAGE" | "VIDEO_PAGE";
export type AdminNavigationVideoLandingMode = "ROOT";
export type AdminNavigationContentKindFilter = "LONG_FORM" | "SHORT";

export interface AdminNavigationItem {
  id: number;
  parentId: number | null;
  label: string;
  href: string;
  matchPath: string | null;
  linkType: AdminNavigationLinkType;
  menuType: AdminNavigationMenuType;
  contentSiteKey?: string | null;
  pageKey?: string | null;
  pagePath?: string | null;
  boardKey?: string | null;
  listPath?: string | null;
  categoryKey?: string | null;
  videoRootKey?: string | null;
  landingMode?: AdminNavigationVideoLandingMode | null;
  contentKindFilter?: AdminNavigationContentKindFilter | null;
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

export async function getAdminNavigationItems(includeHidden = true): Promise<AdminNavigationTreeResponse> {
  const params = new URLSearchParams({ includeHidden: includeHidden ? "true" : "false" });
  const response = await adminApiFetch(`/api/v1/admin/navigation/items?${params.toString()}`);
  return response.json() as Promise<AdminNavigationTreeResponse>;
}

export async function getAdminNavigationItem(id: number): Promise<AdminNavigationItem> {
  const response = await adminApiFetch(`/api/v1/admin/navigation/items/${id}`);
  return response.json() as Promise<AdminNavigationItem>;
}

export interface NavigationItemPayload {
  parentId?: number | null;
  label: string;
  href: string;
  matchPath?: string | null;
  linkType: AdminNavigationEditableLinkType;
  menuType: AdminNavigationMenuType;
  pageKey?: string | null;
  pagePath?: string | null;
  boardKey?: string | null;
  listPath?: string | null;
  categoryKey?: string | null;
  videoRootKey?: string | null;
  landingMode?: AdminNavigationVideoLandingMode | null;
  contentKindFilter?: AdminNavigationContentKindFilter | null;
  visible: boolean;
  headerVisible: boolean;
  mobileVisible: boolean;
  lnbVisible: boolean;
  breadcrumbVisible: boolean;
  defaultLanding: boolean;
  sortOrder: number;
}

export async function createAdminNavigationItem(payload: NavigationItemPayload): Promise<AdminNavigationItem> {
  const response = await adminApiFetch("/api/v1/admin/navigation/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json() as Promise<AdminNavigationItem>;
}

export async function updateAdminNavigationItem(id: number, payload: NavigationItemPayload): Promise<AdminNavigationItem> {
  const response = await adminApiFetch(`/api/v1/admin/navigation/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json() as Promise<AdminNavigationItem>;
}

export async function deleteAdminNavigationItem(id: number): Promise<void> {
  await adminApiFetch(`/api/v1/admin/navigation/items/${id}`, { method: "DELETE" });
}
