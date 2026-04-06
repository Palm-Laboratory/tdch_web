"use client";

import GreetingCommunitySection from "./components/greeting-community-section";
import GreetingHeroSection from "./components/greeting-hero-section";
import GreetingMissionSection from "./components/greeting-mission-section";
import GreetingOpenDoorSection from "./components/greeting-open-door-section";
import GreetingWelcomeSection from "./components/greeting-welcome-section";

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
