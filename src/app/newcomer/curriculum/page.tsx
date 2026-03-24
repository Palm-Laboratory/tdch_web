import type { Metadata } from "next";
import Breadcrumb from "@/components/breadcrumb";
import ComingSoonPage from "@/components/coming-soon-page";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "교육 과정 | The 제자교회",
  description: "The 제자교회 교육 과정 페이지는 현재 구현 예정입니다.",
};

export default function NewcomerCurriculumPage() {
  return (
    <div className="flex w-full flex-col">
      <PageHeader
        title="교육 과정"
        subtitle="CURRICULUM"
        backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
      />
      <Breadcrumb />
      <main className="section-shell section-shell--narrow pt-10 md:pt-16">
        <ComingSoonPage
          title="교육 과정"
          subtitle="CURRICULUM"
          description="제자 양육을 위한 단계별 교육 과정과 참여 안내를 이 페이지에서 제공할 예정입니다."
        />
      </main>
    </div>
  );
}
