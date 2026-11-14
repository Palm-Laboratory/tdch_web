import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimatedCards from "@/app/home/components/animated-cards";
import MissionSection from "@/app/home/components/mission-section";
import HomeHeroHeader from "@/components/home-hero-header";

import {
  quickMenuCards,
} from "@/lib/site-data";
import {
  CHURCH_ADDRESS,
  SITE_ALTERNATE_NAME,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site-config";
import { gowunBatang } from "@/lib/fonts";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: `${SITE_ALTERNATE_NAME} | ${SITE_NAME}`,
  absoluteTitle: `${SITE_ALTERNATE_NAME} | ${SITE_NAME}`,
  description: `${SITE_ALTERNATE_NAME}(${SITE_NAME})는 ${SITE_TAGLINE}를 비전으로 삼는 교회입니다. ${CHURCH_ADDRESS}에서 예배합니다.`,
  path: "/",
});

export default function Home() {
  return (
    <div className="flex w-full flex-col pb-0 pt-0 overflow-x-hidden">
      {/* 1. 히어로 섹션 */}
      <section id="home-hero-section" className="relative h-[clamp(560px,56.25vw,1800px)] w-full overflow-hidden bg-[#f7fbff]">
        <div className="relative mx-auto h-full w-full max-w-[1920px] lg:max-w-[3200px]">
          <Image
            src="/images/main_bg/main_test2.png"
            alt={`${SITE_NAME} 메인 히어로 이미지`}
            fill
            priority
            quality={100}
            unoptimized
            sizes="100vw"
            className="home-hero-image-pan object-cover object-center"
          />
          <div className="absolute inset-x-0 top-0 z-10 h-[88px] bg-[#0f1c2e] lg:h-[96px]" />

          <div className="absolute inset-x-0 top-0 z-30">
            <div className="section-shell w-full">
              <div className="flex h-[88px] items-center lg:h-[96px]">
                <HomeHeroHeader />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 top-[clamp(118px,9vw,160px)] z-20">
            <div id="home-vision-card" className="mx-auto w-full max-w-[1000px] space-y-3 px-6 text-center text-ink md:space-y-4 lg:space-y-5">
              <h1 className="font-yeongwol text-[clamp(2.5rem,5.2vw,5rem)] leading-[1.2] tracking-wide text-ink lg:tracking-wider">
                성령으로 제자삼는 교회
              </h1>
              <div className={`${gowunBatang.className} text-center text-[clamp(0.875rem,1.45vw,1.375rem)] font-bold leading-[1.8] text-[#7E818A]`}>
                <p className="lg:space-y-1">
                  <span className="block">
                    예수께서 나아와 말씀하여 이르시되 하늘과{" "}
                    <br className="sm:hidden" />땅의 모든 권세를 내게 주셨으니
                  </span>
                  <span className="block">
                    너희는 가서 모든 민족을 제자로 삼아{" "}
                    <br className="sm:hidden" />아버지와 아들과 성령의 이름으로
                    <span className="sm:hidden"> 침례를 베풀고</span>
                  </span>
                  <span className="block sm:hidden">
                    내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라
                  </span>
                  <span className="hidden sm:block">
                    침례를 베풀고 내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라
                  </span>
                  <span className="block">
                    볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라
                  </span>
                </p>
              </div>
              <p className={`${gowunBatang.className} text-center text-[clamp(0.75rem,1.05vw,1rem)] font-semibold tracking-wide text-[#1A2744]`}>
                마태복음 28:18~20
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 웰컴 문구 + 사명 이미지 영역 */}
      <section className="relative w-full overflow-hidden bg-white pt-10 md:pt-12 pb-[8rem] md:pb-[11rem] lg:pb-[13.5rem]">
        <MissionSection />
      </section>

      {/* 3. 퀵메뉴 + 말씀 영역 */}
      <section className="relative -mt-[6rem] h-[500px] w-full overflow-hidden bg-white md:-mt-[6.5rem] md:h-[800px]">
        <div className="relative z-10 section-shell space-y-7 pt-0">
          {/* 퀵 메뉴 */}
          <AnimatedCards cards={quickMenuCards} />

        </div>
      </section>

      {/* 4. The 제자 소식 섹션
          메뉴 및 상세 페이지가 준비되기 전까지 메인에서 임시 비노출 처리.
      */}
      {/*
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#13243a] via-[#1c2f48] to-[#0f1c2e]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="relative z-10 section-shell pb-16 pt-10 md:pb-24 md:pt-12 lg:pb-28">
          <div className="mb-8">
            <div className="inline-block">
              <h2 className="font-serif text-3xl font-semibold text-ivory md:text-4xl">The 제자 소식</h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-ivory/50">THE DISCIPLES NEWS</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col">
              <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-lg font-bold text-ivory">교회 소식</h3>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/40">Church News</p>
                </div>
                <Link href="/news#notice" className="text-xs font-semibold text-ivory/50 transition hover:text-ivory">
                  더보기 +
                </Link>
              </div>
              <ul className="divide-y divide-white/8">
                {churchNewsList.map((item) => (
                  <li key={item.title}>
                    <Link href={item.href} className="group flex items-start justify-between gap-3 py-3 transition">
                      <span className="text-sm font-medium leading-snug text-ivory/80 transition group-hover:text-ivory">
                        {item.title}
                      </span>
                      <span className="mt-0.5 shrink-0 text-xs text-ivory/35">{item.date}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col">
              <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-lg font-bold text-ivory">교회 주보</h3>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/40">Bulletin</p>
                </div>
                <Link href="/news#bulletin" className="text-xs font-semibold text-ivory/50 transition hover:text-ivory">
                  더보기 +
                </Link>
              </div>
              <ul className="divide-y divide-white/8">
                {bulletinList.map((item) => (
                  <li key={item.title}>
                    <Link href={item.href} className="group flex items-start justify-between gap-3 py-3 transition">
                      <span className="text-sm font-medium leading-snug text-ivory/80 transition group-hover:text-ivory">
                        {item.title}
                      </span>
                      <span className="mt-0.5 shrink-0 text-xs text-ivory/35">{item.date}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col md:col-span-2 lg:col-span-1">
              <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-lg font-bold text-ivory">교회 행사</h3>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/40">Gallery</p>
                </div>
                <Link href="/gallery" className="text-xs font-semibold text-ivory/50 transition hover:text-ivory">
                  더보기 +
                </Link>
              </div>
              <Link
                href="/gallery"
                className="group relative block h-[216px] w-full overflow-hidden rounded-2xl md:h-[260px] lg:h-[216px]"
              >
                <Image
                  src="/images/sample/main_bg_2.jpg"
                  alt="최신 교회 행사 사진"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/50">2026.03.01</p>
                  <h4 className="mt-1 text-base font-bold leading-snug text-white">봄 수련회 현장</h4>
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl transition duration-300 group-hover:ring-white/25" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      */}
    </div>
  );
}
