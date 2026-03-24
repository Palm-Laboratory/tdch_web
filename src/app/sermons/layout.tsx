"use client";

import PageHeader from "@/components/page-header";
import Breadcrumb from "@/components/breadcrumb";
import { usePathname } from "next/navigation";

export default function SermonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const hideShell =
    /^\/sermons\/messages\/[^/]+$/.test(pathname) ||
    /^\/sermons\/better-devotion\/[^/]+$/.test(pathname) ||
    /^\/sermons\/its-okay\/[^/]+$/.test(pathname);

  return (
    <div className="flex w-full flex-col">
      {!hideShell && (
        <PageHeader
          title="말씀"
          subtitle="MESSAGE"
          backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
        />
      )}
      {!hideShell && <Breadcrumb />}
      <main className={hideShell ? "section-shell section-shell--full" : "section-shell section-shell--wide pt-10 md:pt-16"}>
        {children}
      </main>
    </div>
  );
}
