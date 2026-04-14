import type { ReactNode } from "react";
import PageHeader from "@/components/page-header";
import CommissionPathBar from "./_components/commission-path-bar";
import CommissionSubnav from "./_components/commission-subnav";

export default function CommissionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col bg-white">
      <PageHeader
        title="지상명령"
        subtitle="THE GREAT COMMISSION"
        backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
      />
      <CommissionPathBar />
      <CommissionSubnav />
      {children}
    </div>
  );
}
