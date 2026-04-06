import type { Metadata } from "next";
import GreetingCommunitySection from "./components/greeting-community-section";
import GreetingHeroSection from "./components/greeting-hero-section";
import GreetingMissionSection from "./components/greeting-mission-section";
import GreetingOpenDoorSection from "./components/greeting-open-door-section";
import GreetingWelcomeSection from "./components/greeting-welcome-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "교회 소개",
  description: "The 제자교회가 추구하는 비전과 공동체의 방향을 소개합니다.",
  path: "/about/greeting",
});

export default function GreetingPage() {
  return (
    <div className="w-full bg-white">
      <GreetingHeroSection />
      <GreetingWelcomeSection />
      <GreetingMissionSection />
      <GreetingCommunitySection />
      <GreetingOpenDoorSection />
    </div>
  );
}
