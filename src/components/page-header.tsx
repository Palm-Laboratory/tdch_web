"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/lib/navigation-context";
import { findMatchedNavigationGroup } from "@/lib/navigation-utils";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  backgroundImageUrl?: string;
}

export default function PageHeader({
  title: defaultTitle,
  subtitle,
  backgroundImageUrl = "/images/main_bg/main_bg_sec1.png"
}: PageHeaderProps) {
  const pathname = usePathname() ?? "";
  const { navMenuGroups } = useNavigation();
  const menuGroup = findMatchedNavigationGroup(pathname, navMenuGroups);

  // PageHeader banner always shows the top-level menu label.
  const displayTitle = menuGroup?.label || defaultTitle;

  return (
    <section className="relative w-full h-[280px] md:h-[300px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backgroundImageUrl}
          alt={`${displayTitle} 배경 이미지`}
          fill
          priority
          /* 원래 object-center 였으나, 더 상단 영역(y축 25%)이 보이도록 커스텀 포지셔닝 적용 */
          className="object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#13243a]/90 via-[#13243a]/60 to-[#13243a]/30" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center pt-10">
        <div className="text-center">
          <p className="type-label mb-3 font-semibold uppercase tracking-[0.2em] text-ivory/60">
            {subtitle}
          </p>
          <h1 className="type-page-title text-[1.875rem] leading-[1.15] md:text-[2.5rem] font-serif font-bold text-ivory">
            {displayTitle}
          </h1>
        </div>
      </div>
    </section>
  );
}
