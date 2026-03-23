import type { Metadata } from "next";
import Breadcrumb from "@/components/breadcrumb";
import ComingSoonPage from "@/components/coming-soon-page";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "새가족안내 | The 제자교회",
  description: "The 제자교회 새가족안내 페이지는 현재 구현 예정입니다.",
};

export default function NewcomerPage() {
  return (
    <div className="flex w-full flex-col pb-20">
      <PageHeader
        title="새가족안내"
        subtitle="NEWCOMER"
        backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
      />
      <Breadcrumb />
      <main className="section-shell section-shell--narrow pt-10 md:pt-16 pb-20">
        <ComingSoonPage
          title="새가족안내"
          subtitle="NEWCOMER"
          description="처음 오신 분들을 위한 안내 콘텐츠를 준비 중입니다. 교회 소개와 정착 안내를 곧 이 페이지에서 확인하실 수 있습니다."
        />
      </main>
    </div>
  );
}
