import Image from "next/image";
import Link from "next/link";
import MissionSection from "@/components/mission-section";
import AnimatedCards from "@/components/animated-cards";

interface QuickMenuCard {
  href: string;
  title: string;
  enTitle: string;
  description: string;
}

interface NewsPostPreview {
  href: string;
  category: string;
  title: string;
  date: string;
  thumbnail: string;
}

// 퀵 메뉴: 히어로 섹션 바로 아래 주요 안내 바로가기 카드 4개
const quickMenuCards: QuickMenuCard[] = [
  {
    href: "/about",
    title: "교회소개",
    enTitle: "Church Intro",
    description: "교회의 비전과 인사말, 연혁을 한 번에 살펴보세요."
  },
  {
    href: "/about#service-times",
    title: "예배 시간 안내",
    enTitle: "Service Times",
    description: "주일예배와 평일 모임 시간을 한눈에 확인하세요."
  },
  {
    href: "/newcomer",
    title: "새가족 안내",
    enTitle: "Newcomer",
    description: "처음 오신 분들을 위한 등록 및 정착 안내입니다."
  },
  {
    href: "/contact#map",
    title: "오시는길/문의",
    enTitle: "Visit & Contact",
    description: "지도, 연락처, 카카오톡 채널 정보를 바로 확인하세요."
  }
];

const newsPosts: NewsPostPreview[] = [
  {
    href: "/news#bulletin",
    category: "주보",
    title: "3월 1주차 주보 안내 (더미)",
    date: "2026.03.02",
    thumbnail: "/images/main_bg_2.jpg"
  },
  {
    href: "/news#notice",
    category: "공지",
    title: "봄 학기 성경공부 신청 안내 (더미)",
    date: "2026.03.01",
    thumbnail: "/images/main_bg_3.jpg"
  },
  {
    href: "/sermons#setlist",
    category: "셋 리스트",
    title: "주일 1부 찬양 셋 리스트 (더미)",
    date: "2026.03.01",
    thumbnail: "/images/main_bg_3.jpg"
  },
  {
    href: "/newcomer",
    category: "새가족",
    title: "새가족 환영 모임 안내 (더미)",
    date: "2026.02.28",
    thumbnail: "/images/sample2.png"
  },
  {
    href: "/news#bulletin",
    category: "주보",
    title: "2월 4주차 주보 안내 (더미)",
    date: "2026.02.23",
    thumbnail: "/images/main_bg_3.jpg"
  },
  {
    href: "/news#notice",
    category: "공지",
    title: "금요 기도회 시간 변경 안내 (더미)",
    date: "2026.02.21",
    thumbnail: "/images/main_bg_2.jpg"
  },
  {
    href: "/sermons#setlist",
    category: "셋 리스트",
    title: "수요 예배 찬양 셋 리스트 (더미)",
    date: "2026.02.20",
    thumbnail: "/images/sample2.png"
  },
  {
    href: "/newcomer",
    category: "새가족",
    title: "새가족 등록 절차 요약 (더미)",
    date: "2026.02.18",
    thumbnail: "/images/main_bg_3.jpg"
  }
];

export default function Home() {
  const youtubeUrl =
    process.env.NEXT_PUBLIC_YOUTUBE_URL ??
    "https://www.youtube.com/@%EB%8D%94%EC%A0%9C%EC%9E%90%EA%B5%90%ED%9A%8C";

  return (
    <div className="section-shell flex w-full flex-col pb-0 pt-0">
      <section className="relative left-1/2 h-[740px] w-[1800px] -translate-x-1/2 overflow-hidden">
        <div className="relative h-full">
          <Image
            src="/images/sample2.png"
            alt="The 제자교회 메인 히어로 이미지"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/52 to-ink/18" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-transparent" />

          <div className="relative z-10 flex h-full items-center py-8 md:py-10">
            <div className="section-shell w-full">
              <div className="grid items-end gap-3 lg:grid-cols-[minmax(0,770px),270px] lg:items-stretch lg:justify-center lg:gap-4">
                <div className="w-full max-w-xl space-y-6 rounded-2xl bg-black/30 px-6 py-7 text-ivory backdrop-blur-[2px] md:space-y-7 md:max-w-[770px] md:px-7 md:py-8">
                  <p className="chip w-fit bg-gold/30 text-ivory">VISION</p>
                  <h1 className="font-serif text-4xl leading-[1.18] md:text-6xl">
                    성령으로
                    <br />
                    제자삼는 교회
                  </h1>
                  <div className="mt-5 text-lg font-medium leading-[1.72] text-ivory/92 md:mt-6 md:text-[1.42rem]">
                    <p>
                      <span className="block lg:whitespace-nowrap">
                        예수께서 나아와 말씀하여 이르시되 하늘과 땅의 모든 권세를 내게 주셨으니
                      </span>
                      <span className="block lg:whitespace-nowrap">
                        너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로
                      </span>
                      <span className="block lg:whitespace-nowrap">
                        세례를 베풀고 내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라
                      </span>
                    </p>
                    <p className="flex items-end justify-between gap-3">
                      <span className="lg:whitespace-nowrap">
                        볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라
                      </span>
                    </p>
                  </div>
                  <p className="text-right text-base font-semibold tracking-wide text-white md:text-lg">
                    마태복음 28:18~20
                  </p>
                </div>

                <div className="grid gap-4 lg:h-full lg:grid-rows-2 lg:gap-5">
                  <Link
                    href="/about#location"
                    id="hero-location-card"
                    className="group flex h-[210px] flex-col items-center justify-center rounded-[2rem] border border-white/70 bg-[#f1f3f5] px-6 py-6 text-center text-ink shadow-[0_18px_26px_rgba(16,33,63,0.18)] transition duration-300 hover:-translate-y-1 lg:h-full lg:px-8 lg:py-7"
                  >
                    <lord-icon
                      src="/images/wired-outline-18-location-pin-hover-jump.json"
                      trigger="hover"
                      target="#hero-location-card"
                      style={{ width: "72px", height: "72px" }}
                    ></lord-icon>
                    <p className="mt-1 text-[1.72rem] font-bold leading-none tracking-[-0.01em]">오시는 길</p>
                    <p className="mt-1 text-[1.02rem] font-medium leading-none text-ink/65">Location</p>
                    <p className="mt-2 text-sm font-medium leading-snug text-ink/65 md:text-base">
                      경기도 수원시 팔달구
                      <br />
                      경수대로425 지하1층
                    </p>
                  </Link>

                  <a
                    href={youtubeUrl}
                    id="hero-youtube-card"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-[210px] flex-col items-center justify-center rounded-[2rem] border border-white/70 bg-[#f1f3f5] px-6 py-6 text-center text-ink shadow-[0_18px_26px_rgba(16,33,63,0.18)] transition duration-300 hover:-translate-y-1 lg:h-full lg:px-8 lg:py-7"
                  >
                    <lord-icon
                      src="/images/wired-outline-2547-logo-youtube-hover-pinch.json"
                      trigger="hover"
                      target="#hero-youtube-card"
                      style={{ width: "72px", height: "72px" }}
                    ></lord-icon>
                    <p className="mt-1 text-[1.48rem] font-bold leading-none tracking-[-0.01em]">
                      유튜브 채널
                    </p>
                    <p className="mt-1 text-[0.94rem] font-medium leading-none text-ink/65">
                      Youtube Channel
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 웰컴 문구 + 사명 이미지 영역 */}
      <section className="relative left-1/2 mt-0 w-[1800px] -translate-x-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-[#ffffff]" />
        <MissionSection />
      </section>

      {/* 3. 하단 카드 영역 */}
      <section className="relative left-1/2 mt-0 w-[1800px] -translate-x-1/2">
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[3000px] -translate-x-1/2 opacity-70">
          <Image
            src="/images/main_bg_sec3.png"
            alt="섹션 3 배경 이미지"
            fill
            className="object-contain object-top"
          />
        </div>

        <div className="relative z-10 section-shell space-y-7 pb-[4.5rem] pt-[2em] md:pb-[5.5rem]">
          {/* 퀵 메뉴 — 주요 안내 바로가기 카드 4개 */}
          <AnimatedCards cards={quickMenuCards} />

          {/* 상단 4개 카드와 말씀 메뉴 사이 명시적 공간 확보 */}
          <div className="h-3 md:h-4"></div>

          {/* 말씀 섹션 */}
          <div>
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div className="text-center">
                  <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">말씀</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-cedar/70">Sermon</p>
                </div>
                <Link href="/sermons" className="text-sm font-semibold text-cedar transition hover:text-clay">
                  더보기 &rarr;
                </Link>
              </div>

              <section className="grid gap-4 lg:grid-cols-2">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-3xl border border-cedar/14 bg-white shadow-[0_16px_34px_rgba(16,33,63,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(16,33,63,0.18)]"
                >
                  {/* 썸네일 */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src="/images/0302_thumb.jpg"
                      alt="최신 예배 설교 하이라이트"
                      fill
                      className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/10" />
                    {/* 플레이 버튼 */}
                    <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-md transition group-hover:scale-110">
                      <svg className="ml-0.5 h-5 w-5 text-ink" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cedar">
                      <span>설교</span>
                      <span className="text-cedar/40">|</span>
                      <span>주일예배</span>
                    </div>
                    <h3 className="mt-2 text-base font-bold leading-snug text-ink md:text-lg">
                      목마름을 채우시는 사랑
                    </h3>
                    <p className="mt-1 text-xs text-ink/55 line-clamp-1">
                      요한복음 4:1~42 <span className="mx-1 text-ink/30">|</span> 이진욱 목사
                    </p>
                    <p className="mt-4 text-xs font-medium text-ink/40">
                      2026.03.02
                    </p>
                  </div>
                </a>

                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-3xl border border-cedar/14 bg-white shadow-[0_16px_34px_rgba(16,33,63,0.13)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(16,33,63,0.16)]"
                >
                  {/* 썸네일 */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src="/images/0228_thumb.jpg"
                      alt="새 시작을 주시는 사랑 설교 썸네일"
                      fill
                      className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/10" />
                    {/* 플레이 버튼 */}
                    <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-md transition group-hover:scale-110">
                      <svg className="ml-0.5 h-5 w-5 text-ink" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cedar">
                      <span>설교</span>
                      <span className="text-cedar/40">|</span>
                      <span>주일예배</span>
                    </div>
                    <h3 className="mt-2 text-base font-bold leading-snug text-ink md:text-lg">
                      새 시작을 주시는 사랑
                    </h3>
                    <p className="mt-1 text-xs text-ink/55 line-clamp-1">
                      요한복음 2:1~11 <span className="mx-1 text-ink/30">|</span> 이진욱 목사
                    </p>
                    <p className="mt-4 text-xs font-medium text-ink/40">
                      2026.02.28
                    </p>
                  </div>
                </a>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 제자 소식 섹션 */}
      <section className="relative left-1/2 mt-0 w-[1800px] -translate-x-1/2 overflow-hidden">
        {/* 어두운 그라디언트 배경 — 추후 이미지로 교체 예정 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#13243a] via-[#1c2f48] to-[#0f1c2e]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="relative z-10 section-shell pb-28 pt-10 md:pt-12">
          {/* 섹션 헤더 */}
          <div className="mb-10">
            <h2 className="font-serif text-3xl font-semibold text-ivory md:text-4xl">The 제자 소식</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-ivory/50">Church News</p>
          </div>

          {/* 3컬럼 레이아웃 */}
          <div className="grid gap-6 lg:grid-cols-3">

            {/* 컬럼 1 — 교회소식 */}
            <div className="flex flex-col">
              <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-lg font-bold text-ivory">교회소식</h3>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/40">Church News</p>
                </div>
                <Link href="/news#notice" className="text-xs font-semibold text-ivory/50 transition hover:text-ivory">
                  더보기 +
                </Link>
              </div>
              <ul className="space-y-0 divide-y divide-white/8">
                {[
                  { title: "봄 학기 성경공부 신청 안내", date: "2026.03.01" },
                  { title: "새가족 환영 모임 안내", date: "2026.02.28" },
                  { title: "금요 기도회 시간 변경 안내", date: "2026.02.21" },
                  { title: "3월 교회 행사 일정 안내", date: "2026.02.18" },
                  { title: "제자훈련 3기 수료식 안내", date: "2026.02.15" },
                ].map((item) => (
                  <li key={item.title}>
                    <Link
                      href="/news#notice"
                      className="group flex items-start justify-between gap-3 py-3 transition"
                    >
                      <span className="text-sm font-medium leading-snug text-ivory/80 transition group-hover:text-ivory">
                        {item.title}
                      </span>
                      <span className="mt-0.5 shrink-0 text-xs text-ivory/35">{item.date}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 컬럼 2 — 교회주보 */}
            <div className="flex flex-col">
              <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-lg font-bold text-ivory">교회주보</h3>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/40">Bulletin</p>
                </div>
                <Link href="/news#bulletin" className="text-xs font-semibold text-ivory/50 transition hover:text-ivory">
                  더보기 +
                </Link>
              </div>
              <ul className="space-y-0 divide-y divide-white/8">
                {[
                  { title: "3월 1주차 주보", date: "2026.03.02" },
                  { title: "2월 4주차 주보", date: "2026.02.23" },
                  { title: "2월 3주차 주보", date: "2026.02.16" },
                  { title: "2월 2주차 주보", date: "2026.02.09" },
                  { title: "2월 1주차 주보", date: "2026.02.02" },
                ].map((item) => (
                  <li key={item.title}>
                    <Link
                      href="/news#bulletin"
                      className="group flex items-start justify-between gap-3 py-3 transition"
                    >
                      <span className="text-sm font-medium leading-snug text-ivory/80 transition group-hover:text-ivory">
                        {item.title}
                      </span>
                      <span className="mt-0.5 shrink-0 text-xs text-ivory/35">{item.date}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 컬럼 3 — 교회 행사 사진 */}
            <div className="flex flex-col">
              <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-lg font-bold text-ivory">교회 행사</h3>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/40">Gallery</p>
                </div>
                <Link href="/gallery" className="text-xs font-semibold text-ivory/50 transition hover:text-ivory">
                  더보기 +
                </Link>
              </div>
              {/* 최신 행사 게시글 사진 1장 — 세련된 액자 스타일 */}
              <Link
                href="/gallery"
                className="group relative block h-[216px] w-full overflow-hidden rounded-2xl"
              >
                <Image
                  src="/images/main_bg_2.jpg"
                  alt="최신 교회 행사 사진"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                {/* 그라디언트 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {/* 하단 텍스트 영역 */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/50">2026.03.01</p>
                  <h4 className="mt-1 text-base font-bold leading-snug text-white">봄 수련회 현장</h4>
                </div>
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl transition duration-300 group-hover:ring-white/25" />
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
