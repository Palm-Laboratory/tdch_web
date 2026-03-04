import Image from "next/image";
import Link from "next/link";
import MissionSection from "@/components/mission-section";

interface QuickInfoCard {
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

const quickInfoCards: QuickInfoCard[] = [
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

        <div className="relative z-10 section-shell space-y-11 pb-8 pt-[2em] md:pb-10">
          <section className="relative z-20 -mt-[6rem] grid gap-4 md:-mt-[6.5rem] md:grid-cols-2 xl:grid-cols-4">
            {quickInfoCards.map((card, index) => {
              const isColored = index % 2 === 1;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group rounded-3xl border border-cedar/12 p-5 shadow-[0_12px_28px_rgba(16,33,63,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(16,33,63,0.16)]"
                  style={{ backgroundColor: isColored ? "#6b83b0" : "#ffffff" }}
                >
                  <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${isColored ? "text-white/70" : "text-cedar/70"}`}>
                    {card.enTitle}
                  </p>
                  <h2 className={`mt-2 text-xl font-bold leading-tight ${isColored ? "text-white" : "text-ink"}`}>{card.title}</h2>
                  <p className={`mt-3 text-sm leading-relaxed ${isColored ? "text-white/80" : "text-ink/72"}`}>{card.description}</p>
                </Link>
              );
            })}
          </section>

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
      <section className="relative left-1/2 mt-0 w-[1800px] -translate-x-1/2">
        <div className="relative z-10 section-shell pb-12 pt-16 md:pb-16 md:pt-20">
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="text-center">
                <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">The 제자 소식</h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-cedar/70">Church News</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-cedar/10 px-3 py-1 text-xs font-semibold text-cedar">주보</span>
                <span className="rounded-full bg-cedar/10 px-3 py-1 text-xs font-semibold text-cedar">공지</span>
                <span className="rounded-full bg-cedar/10 px-3 py-1 text-xs font-semibold text-cedar">
                  셋 리스트
                </span>
                <span className="rounded-full bg-cedar/10 px-3 py-1 text-xs font-semibold text-cedar">새가족</span>
              </div>
            </div>

            <section className="rounded-3xl border border-cedar/14 bg-white/95 p-5 shadow-[0_16px_34px_rgba(16,33,63,0.12)] md:p-6">
              <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
                {newsPosts.map((post) => (
                  <Link
                    key={`${post.category}-${post.title}`}
                    href={post.href}
                    className="group w-[260px] min-w-[260px] overflow-hidden rounded-2xl border border-cedar/12 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(16,33,63,0.14)]"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={post.thumbnail}
                        alt={`${post.category} 썸네일`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="space-y-2 p-4">
                      <span className="inline-flex rounded-full bg-cedar/12 px-2.5 py-1 text-xs font-semibold text-cedar">
                        {post.category}
                      </span>
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{post.title}</h3>
                      <p className="text-xs font-medium text-ink/55">{post.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
