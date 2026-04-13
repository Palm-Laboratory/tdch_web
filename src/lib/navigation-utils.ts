import type { NavigationResponse, NavMenuGroup, NavSubItem } from "@/lib/navigation-types";

function normalizePath(path: string | null | undefined): string {
  if (!path) {
    return "";
  }

  return path.split("#")[0] ?? path;
}

function getNavigationMatchScore(
  pathname: string,
  path: string | null | undefined,
): number {
  const normalizedPath = normalizePath(path);
  if (!normalizedPath) {
    return -1;
  }

  if (pathname === normalizedPath) {
    return normalizedPath.length + 10_000;
  }

  if (pathname.startsWith(`${normalizedPath}/`)) {
    return normalizedPath.length;
  }

  return -1;
}

export function toNavMenuGroups(navigation: NavigationResponse): NavMenuGroup[] {
  return navigation.groups.map((group) => ({
    key: group.key,
    href: group.href,
    label: group.label,
    matchPath: group.matchPath,
    linkType: group.linkType,
    hiddenInHeader: !group.headerVisible,
    hiddenInMobile: !group.mobileVisible,
    hiddenInLnb: !group.lnbVisible,
    hiddenInBreadcrumb: !group.breadcrumbVisible,
    defaultLandingHref: group.defaultLandingHref,
    items: group.items.map((item) => ({
      key: item.key,
      href: item.href,
      label: item.label,
      matchPath: item.matchPath,
      linkType: item.linkType,
      hiddenInHeader: !item.headerVisible,
      hiddenInMobile: !item.mobileVisible,
      hiddenInLnb: !item.lnbVisible,
      hiddenInBreadcrumb: !item.breadcrumbVisible,
      defaultLanding: item.defaultLanding,
    })),
  }));
}

export function matchesNavigationPath(pathname: string, path: string | null | undefined): boolean {
  return getNavigationMatchScore(pathname, path) >= 0;
}

export function findMatchedNavigationGroup(
  pathname: string,
  groups: NavMenuGroup[],
): NavMenuGroup | undefined {
  return groups.reduce<NavMenuGroup | undefined>((bestGroup, group) => {
    const groupScore = getNavigationMatchScore(pathname, group.matchPath ?? group.href);
    const itemScore = group.items.reduce((bestScore, item) => {
      return Math.max(bestScore, getNavigationMatchScore(pathname, item.matchPath ?? item.href));
    }, -1);
    const candidateScore = Math.max(groupScore, itemScore);

    if (candidateScore < 0) {
      return bestGroup;
    }

    const bestGroupScore = bestGroup
      ? Math.max(
          getNavigationMatchScore(pathname, bestGroup.matchPath ?? bestGroup.href),
          bestGroup.items.reduce((bestScore, item) => {
            return Math.max(bestScore, getNavigationMatchScore(pathname, item.matchPath ?? item.href));
          }, -1),
        )
      : -1;

    return candidateScore > bestGroupScore ? group : bestGroup;
  }, undefined);
}

export function findMatchedNavigationItem(
  pathname: string,
  group: NavMenuGroup | undefined,
): NavSubItem | undefined {
  return group?.items.reduce<NavSubItem | undefined>((bestItem, item) => {
    const itemScore = getNavigationMatchScore(pathname, item.matchPath ?? item.href);
    if (itemScore < 0) {
      return bestItem;
    }

    const bestItemScore = bestItem
      ? getNavigationMatchScore(pathname, bestItem.matchPath ?? bestItem.href)
      : -1;

    return itemScore > bestItemScore ? item : bestItem;
  }, undefined);
}
