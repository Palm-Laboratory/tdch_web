import type { Metadata } from "next";
import ComingSoonPage from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "말씀 / 설교 | The 제자교회",
  description: "The 제자교회 말씀/설교 페이지는 현재 구현 예정입니다.",
};

export default function MessagesPage() {
  return (
    <ComingSoonPage
      title="말씀 / 설교"
      subtitle="SERMON MESSAGES"
      description="은혜로운 말씀과 설교 영상을 준비 중입니다. 곧 이 페이지에서 설교 영상을 시청하실 수 있습니다."
    />
  );
}
