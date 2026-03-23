import type { Metadata } from "next";
import Breadcrumb from "@/components/breadcrumb";
import ComingSoonPage from "@/components/coming-soon-page";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "헌금안내 | The 제자교회",
  description: "The 제자교회 헌금안내 페이지는 현재 구현 예정입니다.",
};

export default function GivingPage() {
  return (
    <div className="flex w-full flex-col pb-20">
      <PageHeader
        title="헌금안내"
        subtitle="OFFERING"
        backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
      />
      <Breadcrumb />
      <main className="section-shell section-shell--narrow pt-10 md:pt-16 pb-20">
        <ComingSoonPage
          title="헌금안내"
          subtitle="OFFERING"
          description="헌금 관련 안내와 계좌 정보, 사용 목적 안내를 준비 중입니다. 정리되는 대로 이 페이지에 반영할 예정입니다."
        />
      </main>
    </div>
  );
}
