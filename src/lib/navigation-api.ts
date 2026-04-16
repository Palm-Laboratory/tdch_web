import "server-only";

import type { NavigationResponse, NavMenuGroup } from "@/lib/navigation-types";
import { toNavMenuGroups } from "@/lib/navigation-utils";
import { SERVER_MEDIA_API_BASE_URL } from "@/lib/server-config";

const EMPTY_NAVIGATION_RESPONSE: NavigationResponse = {
  groups: [],
};

export async function getNavigationResponse(): Promise<NavigationResponse> {
  try {
    const response = await fetch(`${SERVER_MEDIA_API_BASE_URL}/api/v1/public/menu`, {
      next: {
        revalidate: 300,
        tags: ["menu"],
      },
    });

    if (!response.ok) {
      return EMPTY_NAVIGATION_RESPONSE;
    }

    return response.json() as Promise<NavigationResponse>;
  } catch {
    return EMPTY_NAVIGATION_RESPONSE;
  }
}

export async function getNavMenuGroups(): Promise<NavMenuGroup[]> {
  const navigation = await getNavigationResponse();
  return toNavMenuGroups(navigation);
}

export async function getNavigationGroupByKey(key: string): Promise<NavMenuGroup | undefined> {
  const groups = await getNavMenuGroups();
  return groups.find((group) => group.key === key);
}
