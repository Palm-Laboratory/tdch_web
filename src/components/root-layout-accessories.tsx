"use client";

import { usePathname } from "next/navigation";
import BackToTopFab from "@/components/back-to-top-fab";
import SiteFooter from "@/components/site-footer";

export default function RootLayoutAccessories() {
  const pathname = usePathname() ?? "";
  const hideAccessories = /^\/sermons\/its-okay\/[^/]+$/.test(pathname);

  if (hideAccessories) {
    return null;
  }

  return (
    <>
      <BackToTopFab />
      <SiteFooter />
    </>
  );
}
