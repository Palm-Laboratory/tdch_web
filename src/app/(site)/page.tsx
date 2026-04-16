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
  YOUTUBE_CHANNEL_LABEL,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/site-config";
import { gowunBatang } from "@/lib/fonts";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: `${SITE_ALTERNATE_NAME} | ${SITE_NAME}`,
  absoluteTitle: `${SITE_ALTERNATE_NAME} | ${SITE_NAME}`,
  description: `${SITE_ALTERNATE_NAME}(${SITE_NAME})는 ${SITE_TAGLINE}를 비전으로 세워가는 교회입니다. ${CHURCH_ADDRESS}에서 예배합니다.`,
  path: "/",
});

export default function Home() {
  return (
    <div className="flex w-full flex-col pb-0 pt-0 overflow-x-hidden">
      {/* 1. 히어로 섹션 */}
      <section id="home-hero-section" className="relative w-full h-[640px] md:h-[670px] lg:h-[740px] overflow-hidden">
        <div className="relative h-full">
          <Image
            src="/images/main_bg/main_bg_sec1.png"
            alt="The 제자교회 메인 히어로 이미지"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/52 to-ink/18" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-transparent" />

          <div className="relative z-10 flex h-full items-start pb-8 pt-8">
            <div className="section-shell w-full">
              <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
                <HomeHeroHeader />
                <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,770px),270px] lg:items-stretch lg:gap-4">
                  {/* 비전 텍스트 카드 */}
                  <div
                    id="home-vision-card"
                    className="w-full space-y-4 rounded-2xl bg-black/30 px-6 py-6 text-ivory backdrop-blur-md md:space-y-5 md:px-7 md:py-7 lg:space-y-6 lg:py-8"
                  >
                    <p className="chip w-fit bg-gold/30 text-ivory text-xs">VISION</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ivory/78 md:text-sm">
                      {SITE_ALTERNATE_NAME} | {SITE_NAME}
                    </p>
                    <h1 className="font-yeongwol text-[3rem] leading-[1.2] tracking-wide md:text-6xl lg:text-7xl lg:tracking-wider xl:text-8xl">
                      성령으로
                      <br />
                      제자삼는 교회
                    </h1>
                    {/* 성경 구절 */}
                    <div className={`${gowunBatang.className} mt-3 text-sm font-medium leading-[1.8] text-ivory/90 md:mt-4 md:text-base lg:mt-5 lg:text-[1.42rem]`}>
                      <p className="lg:space-y-3">
                        <span className="block">
                          예수께서 나아와 말씀하여 이르시되 하늘과 땅의 모든 권세를 내게 주셨으니
                        </span>
                        <span className="block">
                          너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로
                        </span>
                        <span className="block">
                          세례를 베풀고 내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라
                        </span>
                        <span className="block">
                          볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라
                        </span>
                      </p>
                    </div>
                    <p className="text-right text-sm font-semibold tracking-wide text-white md:text-base">
                      마태복음 28:18~20
                    </p>
                  </div>

                  {/* 오시는 길 & YouTube 바로가기 카드: lg 이상에서만 표시 */}
                  <div className="hidden h-full grid-rows-2 gap-5 lg:grid">
                    <Link
                      href="/about/location"
                      id="hero-location-card"
                      className="group flex h-full flex-col items-center justify-center rounded-[2rem] border border-white/70 bg-[#f1f3f5]/80 px-8 py-7 text-center text-ink shadow-[0_18px_26px_rgba(16,33,63,0.18)] backdrop-blur-md transition duration-300 hover:-translate-y-1"
                    >
                      <lord-icon
                        src="/images/wired-outline-18-location-pin-hover-jump.json"
                        trigger="hover"
                        target="#hero-location-card"
                        style={{ width: "72px", height: "72px" }}
                      ></lord-icon>
                      <p className="mt-1 text-[1.72rem] font-bold leading-none tracking-[-0.01em]">오시는 길</p>
                      <p className="mt-1 text-[1.02rem] font-medium leading-none text-ink/65">Location</p>
                      <p className="mt-2 text-sm font-medium leading-snug text-ink/65">
                        {CHURCH_ADDRESS}
                      </p>
                    </Link>

                    <a
                      href={YOUTUBE_CHANNEL_URL}
                      id="hero-youtube-card"
                      target="_blank"
                      rel="noreferrer"
                      className="group flex h-full flex-col items-center justify-center rounded-[2rem] border border-white/70 bg-[#f1f3f5]/80 px-8 py-7 text-center text-ink shadow-[0_18px_26px_rgba(16,33,63,0.18)] backdrop-blur-md transition duration-300 hover:-translate-y-1"
                    >
                      <lord-icon
                        src="/images/wired-outline-2547-logo-youtube-hover-pinch.json"
                        trigger="hover"
                        target="#hero-youtube-card"
                        style={{ width: "72px", height: "72px" }}
                      ></lord-icon>
                      <p className="mt-1 text-[1.48rem] font-bold leading-none tracking-[-0.01em]">{YOUTUBE_CHANNEL_LABEL}</p>
                      <p className="mt-1 text-[0.94rem] font-medium leading-none text-ink/65">Youtube Channel</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 웰컴 문구 + 사명 이미지 영역 */}
      <section className="relative w-full overflow-hidden bg-white pt-10 md:pt-12 pb-[8rem] md:pb-[11rem] lg:pb-[13.5rem]">
        <MissionSection />
      </section>

      {/* 3. 퀵메뉴 + 말씀 영역 */}
      <section className="relative w-full">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <Image
            src="/images/main_bg/main_bg_sec3.png"
            alt="섹션 3 배경 이미지"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="relative z-10 section-shell space-y-7 pb-[4.5rem] pt-[2em] md:pb-[5.5rem]">
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
