import type { Metadata } from "next";
import Breadcrumb from "@/components/breadcrumb";
import ComingSoonPage from "@/components/coming-soon-page";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "새가족 양육 | The 제자교회",
  description: "The 제자교회 새가족 양육 페이지는 현재 구현 예정입니다.",
};

export default function NewcomerCarePage() {
  return (
    <div className="flex w-full flex-col">
      <PageHeader
        title="새가족 양육"
        subtitle="DISCIPLESHIP"
        backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
      />
      <Breadcrumb />
      <main className="section-shell section-shell--narrow pt-10 md:pt-16">
        <ComingSoonPage
          title="새가족 양육"
          subtitle="DISCIPLESHIP"
          description="새가족이 교회 공동체 안에 잘 정착하고 신앙의 기초를 세울 수 있도록 돕는 양육 콘텐츠를 준비 중입니다."
        />
      </main>
    </div>
  );
}
