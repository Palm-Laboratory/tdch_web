import Image from "next/image";
import Link from "next/link";
import { Gowun_Batang } from "next/font/google";

const gowunBatang = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"]
});

const pastorSectionTwoLeadLines = [
  "화려한 선교가 아니었습니다.",
  "그냥,",
  "사람들 곁에 있었고,",
  "같이 울었고,",
  "같이 웃었습니다.",
  "그렇게 17년이 지났습니다."
] as const;

const pastorSectionThreeBodyLines = [
  "공부도 참 다양하게 했습니다. 청소년을 이해하고 싶어서 청소년지도를 공부했고,",
  "상처 입은 사람 곁에 제대로 있어주고 싶어서 치유상담을 배웠고,",
  "말씀을 더 깊이 다루고 싶어서 신학을 팠습니다.",
  "지금은 필리핀 크리스찬 대학교에서 박사과정 중이에요."
] as const;

const pastorSectionFourCards = [
  {
    number: "01",
    title: "상처가 뭔지 압니다",
    body:
      "타지에서 가족과 함께 버텨온 시간이 어떤 건지, 사람에게 실망하는 게 어떤 건지, 그래도 하나님을 붙잡을 수밖에 없는 게 어떤 건지 알고 있습니다."
  },
  {
    number: "02",
    title: "설교가 교과서 같지 않습니다",
    body:
      "이론이 아닌 삶의 현장에서 하나님을 경험한 이야기를 나눕니다. 17년의 선교 현장이 고스란히 담긴, 살아있는 말씀입니다."
  },
  {
    number: "03",
    title: "작은 시작, 부끄럽지 않아요",
    body:
      "예수님도 열두 명으로 시작하셨으니까요. 수원 · 동탄 · 용인에 작은 뿌리를 내리며 더제자교회를 세우고 있습니다."
  }
] as const;

const pastorEducationItems = [
  {
    eyebrow: null,
    title: "명지대학교 사회교육대학원",
    subtitle: "청소년지도전공 · 청소년지도사 1급"
  },
  {
    eyebrow: null,
    title: "크리스찬치유상담대학원대학교",
    subtitle: "치유상담학전공"
  },
  {
    eyebrow: null,
    title: "한국침례신학대학교 목회신학대학원",
    subtitle: "신학전공"
  },
  {
    eyebrow: "현재 재학 중",
    title: "필리핀 크리스찬 대학교",
    subtitle: "박사과정 (Ph.D.)"
  }
] as const;

const pastorMinistryItems = [
  {
    eyebrow: null,
    title: "기독교한국침례회 해외선교회",
    subtitle: "파송 선교사"
  },
  {
    eyebrow: "2009 - 2025",
    title: "필리핀 산타로사꿈의교회",
    subtitle: "설립 및 담임목사"
  },
  {
    eyebrow: "2025 - 현재",
    title: "The 제자교회",
    subtitle: "담임목사"
  }
] as const;

// 섹션1(담임목사 소개)
function PastorHeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#111c36]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(17,28,54,1) 0%, rgba(17,28,54,1) 54%, rgba(48,70,121,0.88) 100%)"
        }}
      />

      <div className="section-shell section-shell--narrow relative py-8 md:py-0 lg:py-0">
        {/* Mobile: anchor the portrait to the section shell so inner padding does not create visual gaps. */}
        <div className="pointer-events-none absolute bottom-0 -right-4 z-0 aspect-[553/738] w-[42%] min-w-[165px] md:hidden">
          <Image
            src="/images/about/pastor_sm.png"
            alt="이진욱 목사 모바일 프로필 이미지"
            fill
            priority
            sizes="(max-width: 767px) 42vw, 240px"
            className="origin-[110%_100%] object-contain object-bottom-right scale-[1.4]"
          />
        </div>

        {/* Tablet only: keep the image pinned to the shell edge, matching the mobile anchoring logic. */}
        <div className="pointer-events-none absolute bottom-0 hidden -right-8 z-0 aspect-[719/771] w-[46%] min-w-[290px] md:block lg:hidden">
          <Image
            src="/images/about/pastor.png"
            alt="이진욱 목사 프로필 이미지"
            fill
            priority
            sizes="(min-width: 768px) 46vw, 100vw"
            className="origin-[110%_100%] object-contain object-bottom-right scale-[1.3]"
          />
        </div>

        <div className="relative min-h-[420px] px-2 pb-8 pt-8 md:grid md:min-h-[460px] md:grid-cols-2 md:items-end md:gap-6 md:px-2 md:pb-0 md:pt-8 lg:min-h-[440px] lg:grid-cols-2 lg:gap-10 lg:px-0 lg:pt-5">
          <div className="z-10 max-w-[460px] self-start pb-4 pt-4 text-white md:max-w-[360px] md:pt-0 lg:max-w-[420px]">
            <div className="md:pl-1 md:pt-[40px] lg:pl-2 lg:pt-[46px] xl:pt-[54px]">
              <div className="flex items-center gap-3 text-[#d5b25c]">
                <span className="h-px w-10 bg-current md:w-12" />
                <p className="type-label font-semibold tracking-[0.18em]">담임목사 소개</p>
              </div>

              <h1 className={`${gowunBatang.className} type-page-title mt-8 font-bold leading-[1.08] tracking-[0.02em] md:mt-10 lg:mt-7`}>
                이진욱 목사
              </h1>

              {/* <p className={`${gowunBatang.className} mt-4 text-[1.9rem] font-semibold tracking-[0.02em] text-white/62 md:text-[2.35rem] lg:mt-2 lg:text-[2rem]`}>
                Timothy Lee
              </p> */}

              {/* <div className="mt-8 inline-flex min-h-[62px] items-center whitespace-nowrap rounded-2xl border border-[#d5b25c] px-5 py-4 text-[#e0bd67] md:mt-10 md:px-8 lg:mt-8 lg:min-h-[56px] lg:px-7 lg:py-3">
                <p className="whitespace-nowrap font-[var(--font-serif)] text-[0.95rem] font-semibold uppercase tracking-[0.09em] md:text-[1rem] lg:text-[1rem]">
                  <span className="mr-3 text-[1.2em] align-[-0.08em]">†</span>
                  THE DISCIPLES CHURCH · SENIOR PASTOR
                </p>
              </div> */}
            </div>

            <div className="type-body-strong mt-10 flex flex-col gap-9 tracking-[-0.01em] text-white/92 md:max-w-[320px] md:pl-1 lg:max-w-[390px] lg:pl-2">
              <p>
                솔직히, 목사 소개 페이지는 좀 어색하죠.
                <br />
                자랑처럼 보일 것 같고, 너무 거룩하게 써 놓으면
                <br />
                오히려 멀게 느껴지고..
              </p>
              <p>그래서 그냥 <br className="md:hidden" />있는 그대로 써보려고 합니다.</p>
            </div>
          </div>

          {/* Desktop+: render the portrait inside the right grid column instead of shell-level absolute positioning. */}
          <div className="relative hidden h-full min-h-[340px] lg:block lg:min-h-[405px]">
            <Image
              src="/images/about/pastor.png"
              alt="이진욱 목사 프로필 이미지"
              fill
              priority
              sizes="(min-width: 1280px) 490px, (min-width: 768px) calc(50vw - 32px), 100vw"
              className="origin-[110%_100%] object-contain object-bottom-right scale-[1.3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// 섹션2(산타로사에서의 17년)
function PastorMissionSection() {
  return (
    <section className="w-full bg-white">
      <div className="section-shell section-shell--narrow py-16 md:py-20 lg:min-h-[474px] lg:py-[72px]">
        <div className="pt-2 md:pt-3 lg:pt-1">
          <p className="type-label font-[var(--font-serif)] font-semibold uppercase tracking-[0.28em] text-[#cda74d]">
            PHILIPPINES · 2009 - 2025
          </p>

          <h2 className={`${gowunBatang.className} type-section-title mt-3 font-bold tracking-[-0.03em] text-[#22345c] md:mt-4`}>
            산타로사에서의 17년
          </h2>
        </div>

        <div className="mt-12 grid gap-10 md:mt-14 md:gap-12 lg:mt-16 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-[84px]">
          <div className="border-l-[4px] border-[#cda74d] pl-3 md:pl-8 lg:flex lg:items-center lg:pl-8">
            <div className="type-lead font-serif flex flex-col gap-2 tracking-[-0.03em] text-[#22345c] lg:gap-2">
              {pastorSectionTwoLeadLines.map((line, index) => (
                <p
                  key={line}
                  className={index === pastorSectionTwoLeadLines.length - 1 ? "mt-3 font-semibold lg:mt-5" : ""}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="type-body-strong flex flex-col gap-8 tracking-[-0.02em] text-[#000000] lg:gap-5">
            <p>
              기독교한국침례회 해외선교회 파송으로 17년간 필리핀에서 선교했습니다.<br className="hidden md:block" />
              산타로사, 그 작은 도시에서 4가정으로 시작한 교회가 등록 교인 약 120여 명의 공동체로 자라는 것을 지켜봤습니다.
            </p>
            <p>
              2025년 12월, 그 땅을 다음 세대 목회자에게 넘기고 한국으로 돌아왔습니다.
              선교는 끝난 게 아니라, 지금 이 땅에서 다시 시작되고 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PastorSectionThree() {
  return (
    <section className="w-full bg-[rgb(255,253,248)]">
      <div className="section-shell section-shell--narrow py-16 md:py-20 lg:relative lg:h-[508px] lg:py-[78px]">
        <div>
          <p className="type-label font-[var(--font-serif)] font-semibold uppercase tracking-[0.28em] text-[#cda74d]">
            JOURNEY OF LEARNING
          </p>

          <h2 className={`${gowunBatang.className} type-section-title mt-3 font-bold tracking-[-0.03em] text-[#22345c] md:mt-4`}>
            더 잘 섬기고 싶어서
          </h2>
        </div>

        <div className="mt-12 border-l-[4px] border-[#cda74d] pl-3 md:pl-8 lg:mt-[56px] lg:max-w-[560px] lg:pl-4">
          <div className="type-lead font-serif tracking-[-0.03em] text-[#22345c]">
            <p>뭔가를 이루려는 게 아니라,</p>
            <p className="text-[#cda74d]">더 잘 섬기고 싶어서입니다.</p>
          </div>
        </div>

        <div className="type-body-strong mt-10 flex max-w-[860px] flex-col tracking-[-0.02em] text-[#000000] md:mt-12 lg:mt-[44px] lg:max-w-[900px]">
          {pastorSectionThreeBodyLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

      </div>
    </section>
  );
}

function PastorSectionFour() {
  return (
    <section className="w-full bg-[rgb(250,248,244)]">
      <div className="section-shell section-shell--narrow py-16 md:py-20 lg:min-h-[508px] lg:py-[52px]">
        <div>
          <p className="type-label font-[var(--font-serif)] font-semibold uppercase tracking-[0.28em] text-[#cda74d]">
            WHO HE IS
          </p>

          <h2 className={`${gowunBatang.className} type-section-title mt-3 font-bold tracking-[-0.03em] text-[#22345c] md:mt-4`}>
            삶에서 나온 말을 합니다
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:mt-12 md:gap-8 lg:mt-[44px] lg:grid-cols-3 lg:gap-6">
          {pastorSectionFourCards.map((card) => (
            <article
              key={card.number}
              className="rounded-[22px] border border-black/6 bg-white px-6 py-7 shadow-[0_8px_18px_rgba(0,0,0,0.12)] md:px-8 md:py-8 lg:min-h-[322px] lg:px-6 lg:py-7"
            >
              <p className="font-[var(--font-serif)] text-[3rem] font-semibold leading-none tracking-[-0.05em] text-[#d9d9d9]/75 md:text-[4rem] lg:text-[4rem]">
                {card.number}
              </p>

              <h3 className="type-card-title mt-5 font-bold tracking-[-0.03em] text-black lg:mt-4">
                {card.title}
              </h3>

              <p className="type-body mt-4 tracking-[-0.02em] text-black/90 lg:mt-5">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PastorSectionFiveColumn({
  label,
  tone,
  items
}: {
  label: string;
  tone: "navy" | "gold";
  items: ReadonlyArray<{
    eyebrow: string | null;
    title: string;
    subtitle: string;
  }>;
}) {
  const bulletClassName = tone === "gold" ? "bg-[rgb(201,168,76)]" : "bg-[rgb(26,39,68)]";
  const bulletRingClassName =
    tone === "gold" ? "ring-[rgb(244,238,200)]" : "ring-[rgb(237,238,240)]";
  const eyebrowClassName = tone === "gold" ? "text-[#cda74d]" : "text-[#7f8aa3]";
  const pillClassName =
    tone === "gold"
      ? "bg-[#f5efe2] text-[#9c7a20]"
      : "bg-[#eef1f7] text-[#22345c]";

  return (
    <div>
      <div className="flex items-center gap-4 md:gap-6">
        <span
          className={`type-body-strong inline-flex min-h-[42px] min-w-[72px] items-center justify-center rounded-full px-5 font-semibold tracking-[-0.03em] ${pillClassName}`}
        >
          {label}
        </span>
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <div className="mt-6 flex flex-col">
        {items.map((item, index) => (
          <article
            key={`${label}-${item.title}`}
            className={`grid grid-cols-[12px_minmax(0,1fr)] gap-2 py-4 md:grid-cols-[16px_minmax(0,1fr)] md:gap-3 md:py-5 ${index > 0 ? "border-t border-black/10" : ""
              }`}
          >
            <div className="flex justify-center pt-1.5">
              <span className={`block h-2.5 w-2.5 rounded-full ring-[3px] ${bulletClassName} ${bulletRingClassName}`} />
            </div>

            <div>
              {item.eyebrow ? (
                <p className={`type-body-small font-semibold tracking-[0.12em] ${eyebrowClassName}`}>
                  {item.eyebrow}
                </p>
              ) : null}
              <h3 className={`type-body-strong font-semibold leading-[1.45] tracking-[-0.03em] text-[#22345c] ${item.eyebrow ? "mt-2" : ""}`}>
                {item.title}
              </h3>
              <p className="type-body mt-1.5 font-medium leading-[1.6] tracking-[-0.02em] text-[#a7adba]">
                {item.subtitle}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PastorSectionFive() {
  return (
    <section className="w-full bg-white">
      <div className="section-shell section-shell--narrow py-16 md:py-20 lg:min-h-[508px] lg:py-[72px]">
        <div>
          <div className="flex items-center gap-3 text-[#cda74d]">
            <span className="h-px w-10 bg-current md:w-12" />
            <p className="type-label font-[var(--font-serif)] font-semibold tracking-[0.18em]">
              학력 및 사역
            </p>
          </div>

          <h2 className={`${gowunBatang.className} type-section-title mt-6 font-bold tracking-[-0.04em] text-[#22345c]`}>
            걸어온 길
          </h2>
        </div>

        <div className="mt-12 grid gap-10 md:mt-14 md:grid-cols-2 lg:mt-[58px] lg:gap-[72px]">
          <PastorSectionFiveColumn label="학력" tone="navy" items={pastorEducationItems} />
          <PastorSectionFiveColumn label="사역" tone="gold" items={pastorMinistryItems} />
        </div>
      </div>
    </section>
  );
}

function PastorFinalSection() {
  return (
    <section className="w-full bg-white">
      <div className="section-shell section-shell--narrow py-12 md:py-16 lg:py-[52px]">
        <div className="flex flex-col gap-4 md:hidden">
          <Link
            href="/about/location"
            className="type-body-strong inline-flex min-h-[58px] w-full items-center justify-center rounded-2xl bg-[#e2c47a] px-6 font-semibold tracking-[-0.02em] text-[#22345c] transition-colors duration-200 hover:bg-[#f4d486]"
          >
            오시는 길 →
          </Link>
          <Link
            href="/about/location#contact-info"
            className="type-body-strong inline-flex min-h-[58px] w-full items-center justify-center rounded-2xl border border-white/30 bg-[#26345d] px-6 font-semibold tracking-[-0.02em] text-white/60 transition-colors duration-200 hover:border-[#e2c47a] hover:text-[#e2c47a]"
          >
            문의하기
          </Link>
        </div>

        <div className="hidden rounded-[40px] bg-[#26345d] px-10 py-12 md:block lg:px-[40px] lg:py-[30px]">
          <div className="flex items-center justify-between gap-8 lg:gap-10">
            <div className="max-w-[580px]">
              <h2 className={`${gowunBatang.className} type-section-title font-bold tracking-[-0.04em] text-white`}>
                처음 방문을 환영합니다
              </h2>

              <p className="type-body mt-5 tracking-[-0.02em] text-white/60">
                궁금한 것이 있으시거나 교회에 대해 더 알고 싶으시다면
                <br className="hidden lg:block" />
                언제든지 연락 주세요. 기다리고 있겠습니다.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-5">
              <Link
                href="/about/location"
                className="type-body inline-flex min-h-[60px] min-w-[150px] items-center justify-center rounded-xl bg-[#e2c47a] px-8 font-semibold tracking-[-0.03em] text-[#22345c] transition-colors duration-200 hover:bg-[#f4d486] lg:min-h-[50px] lg:min-w-[170px]"
              >
                오시는 길 →
              </Link>
              <Link
                href="/about/location#contact-info"
                className="type-body inline-flex min-h-[60px] min-w-[150px] items-center justify-center rounded-xl border border-white/30 px-8 font-semibold tracking-[-0.03em] text-white/60 transition-colors duration-200 hover:border-[#e2c47a] hover:text-[#e2c47a] lg:min-h-[50px] lg:min-w-[170px]"
              >
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PastorPage() {
  return (
    <div className="w-full bg-white">
      <PastorHeroSection />
      <PastorMissionSection />
      <PastorSectionThree />
      <PastorSectionFour />
      <PastorSectionFive />
      <PastorFinalSection />
    </div>
  );
}
