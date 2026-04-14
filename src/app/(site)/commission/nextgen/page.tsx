import type { Metadata } from "next";
import ComingSoonPage from "@/components/coming-soon-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "지상명령 다음세대",
  description: "The 제자교회 지상명령 다음세대 사역 페이지입니다.",
  path: "/commission/nextgen",
});

export default function CommissionNextgenPage() {
  return (
    <main className="section-shell section-shell--narrow pt-10 pb-20 md:pt-16 md:pb-24">
      <ComingSoonPage
        title="다음세대"
        subtitle="Next Generation"
        description="다음세대 사역 소개와 참여 안내를 이 페이지에 구성할 예정입니다."
      />
    </main>
  );
}
