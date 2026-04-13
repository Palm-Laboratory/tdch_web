import "server-only";

import { adminApiFetch } from "@/lib/admin-api";

export type AdminNavigationLinkType = "INTERNAL" | "ANCHOR" | "EXTERNAL";

export interface AdminNavigationSet {
  id: number;
  setKey: string;
  label: string;
  description: string | null;
  active: boolean;
}

export interface AdminNavigationSetsResponse {
  sets: AdminNavigationSet[];
}

export interface AdminNavigationItem {
  id: number;
  navigationSetId: number;
  parentId: number | null;
  menuKey: string;
  label: string;
  href: string;
  matchPath: string | null;
  linkType: AdminNavigationLinkType;
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

export async function getAdminNavigationSets(): Promise<AdminNavigationSetsResponse> {
  try {
    const response = await adminApiFetch("/api/v1/admin/navigation/sets");
    return response.json() as Promise<AdminNavigationSetsResponse>;
  } catch {
    return { sets: [{ id: 1, setKey: "main", label: "메인 사이트 메뉴", description: null, active: true }] };
  }
}

export async function getAdminNavigationItems(
  includeHidden = true,
  setKey = "main",
): Promise<AdminNavigationTreeResponse> {
  const params = new URLSearchParams({ includeHidden: includeHidden ? "true" : "false", setKey });
  const response = await adminApiFetch(`/api/v1/admin/navigation/items?${params.toString()}`);
  return response.json() as Promise<AdminNavigationTreeResponse>;
}

export async function getAdminNavigationItem(id: number): Promise<AdminNavigationItem> {
  const response = await adminApiFetch(`/api/v1/admin/navigation/items/${id}`);
  return response.json() as Promise<AdminNavigationItem>;
}

export interface NavigationItemPayload {
  navigationSetId: number;
  parentId?: number | null;
  menuKey: string;
  label: string;
  href: string;
  matchPath?: string | null;
  linkType: AdminNavigationLinkType;
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
