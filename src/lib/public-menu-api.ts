import "server-only";

import { SERVER_MEDIA_API_BASE_URL } from "@/lib/server-config";
import type { MenuType } from "@/lib/admin-menu-api";

export interface PublicResolvedMenuPage {
  type: MenuType;
  label: string;
  slug: string;
  fullPath: string;
  parentLabel: string | null;
  staticPageKey: string | null;
  boardKey: string | null;
  redirectTo: string | null;
}

export async function resolvePublicMenuPath(path: string): Promise<PublicResolvedMenuPage | null> {
  try {
    const response = await fetch(
      `${SERVER_MEDIA_API_BASE_URL}/api/v1/public/menu/resolve?path=${encodeURIComponent(path)}`,
      {
        next: {
          revalidate: 300,
          tags: ["menu"],
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<PublicResolvedMenuPage>;
  } catch {
    return null;
  }
}
