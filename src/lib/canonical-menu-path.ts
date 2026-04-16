import "server-only";

import { redirect } from "next/navigation";
import { getNavigationResponse } from "@/lib/navigation-api";

export async function getCanonicalStaticPath(contentSiteKey: string): Promise<string | null> {
  const navigation = await getNavigationResponse();

  for (const group of navigation.groups) {
    for (const item of group.items) {
      if (item.contentSiteKey === contentSiteKey) {
        return item.href;
      }
    }
  }

  return null;
}

export async function redirectToCanonicalStaticPathIfNeeded(
  contentSiteKey: string,
  currentPath: string,
): Promise<void> {
  const canonicalPath = await getCanonicalStaticPath(contentSiteKey);
  if (canonicalPath && canonicalPath !== currentPath) {
    redirect(canonicalPath);
  }
}
