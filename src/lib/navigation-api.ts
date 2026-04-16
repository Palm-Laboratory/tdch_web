import "server-only";

import type { NavigationResponse, NavMenuGroup } from "@/lib/navigation-types";
import { toNavMenuGroups } from "@/lib/navigation-utils";

const EMPTY_NAVIGATION_RESPONSE: NavigationResponse = {
  groups: [],
};

export async function getNavigationResponse(): Promise<NavigationResponse> {
  return EMPTY_NAVIGATION_RESPONSE;
}

export async function getNavMenuGroups(): Promise<NavMenuGroup[]> {
  const navigation = await getNavigationResponse();
  return toNavMenuGroups(navigation);
}

export async function getNavigationGroupByKey(key: string): Promise<NavMenuGroup | undefined> {
  const groups = await getNavMenuGroups();
  return groups.find((group) => group.key === key);
}
