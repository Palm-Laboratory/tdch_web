"use client";

import PageHeader from "@/components/page-header";
import Breadcrumb from "@/components/breadcrumb";
import { usePathname } from "next/navigation";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isGreetingPage = pathname?.startsWith("/about/greeting");

  return (
    <div className="flex w-full flex-col pb-20">
      {!isGreetingPage && (
        <>
          <PageHeader
            title="교회소개"
            subtitle="THE DISCIPLES CHURCH"
            backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
          />
          <Breadcrumb />
        </>
      )}
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
