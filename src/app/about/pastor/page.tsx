import Image from "next/image";
import { Gowun_Batang } from "next/font/google";

const gowunBatang = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"]
});

const pastorHeroEllipses = [
  {
    className: "right-[-120px] top-[-100px] h-[260px] w-[260px] md:right-[-140px] md:top-[-120px] md:h-[420px] md:w-[420px] lg:right-[-110px] lg:top-[-160px] lg:h-[540px] lg:w-[540px]"
  },
  {
    className: "right-[14%] top-[12%] h-[240px] w-[240px] md:right-[13%] md:top-[8%] md:h-[380px] md:w-[380px] lg:right-[15%] lg:top-[2%] lg:h-[720px] lg:w-[720px]"
  },
  {
    className: "right-[-20px] bottom-[6%] h-[210px] w-[210px] md:right-[-40px] md:bottom-[4%] md:h-[340px] md:w-[340px] lg:right-[-20px] lg:bottom-[2%] lg:h-[640px] lg:w-[640px]"
  }
] as const;

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

      <div className="absolute inset-y-0 right-0 hidden w-[60%] lg:block">
        {pastorHeroEllipses.map((ellipse) => (
          <div
            key={ellipse.className}
            className={`absolute rounded-full ${ellipse.className}`}
            style={{
              background:
                "radial-gradient(circle, rgba(109,127,168,0.24) 0%, rgba(109,127,168,0) 100%)",
              filter: "blur(120px)"
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 lg:hidden">
        {pastorHeroEllipses.map((ellipse) => (
          <div
            key={`mobile-${ellipse.className}`}
            className={`absolute rounded-full ${ellipse.className}`}
            style={{
              background:
                "radial-gradient(circle, rgba(109,127,168,0.2) 0%, rgba(109,127,168,0) 100%)",
              filter: "blur(96px)"
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-[1120px] px-4 py-10 md:px-8 md:py-14 lg:px-0 lg:py-0">
        <div className="relative grid min-h-[620px] items-end gap-8 px-2 pb-0 pt-10 md:min-h-[540px] md:px-2 md:pt-14 lg:h-[424px] lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.98fr)] lg:items-start lg:gap-2 lg:px-0 lg:py-[36px]">
          <div className="z-10 max-w-[460px] self-start pb-4 text-white md:pb-6 lg:flex lg:h-full lg:max-w-[420px] lg:self-stretch lg:flex-col lg:justify-between lg:pb-0 lg:pt-0">
            <div>
              <div className="flex items-center gap-3 text-[#d5b25c]">
                <span className="h-px w-10 bg-current md:w-12" />
                <p className="text-sm font-semibold tracking-[0.18em]">담임목사 소개</p>
              </div>

              <h1 className={`${gowunBatang.className} mt-8 text-[3.3rem] leading-[1.08] tracking-[0.02em] md:mt-10 md:text-[5rem] lg:mt-7 lg:text-[4.55rem]`}>
                이진욱 목사
              </h1>

              <p className={`${gowunBatang.className} mt-4 text-[1.9rem] font-semibold tracking-[0.02em] text-white/62 md:text-[2.35rem] lg:mt-2 lg:text-[2rem]`}>
                Timothy Lee
              </p>

              <div className="mt-8 inline-flex min-h-[62px] items-center whitespace-nowrap rounded-2xl border border-[#d5b25c] px-5 py-4 text-[#e0bd67] md:mt-10 md:px-8 lg:mt-8 lg:min-h-[56px] lg:px-7 lg:py-3">
                <p className="whitespace-nowrap font-[var(--font-serif)] text-[0.95rem] font-semibold uppercase tracking-[0.09em] md:text-[1rem] lg:text-[1.05rem]">
                  <span className="mr-3 text-[1.2em] align-[-0.08em]">†</span>
                  THE DISCIPLES CHURCH · SENIOR PASTOR
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-9 text-[1.08rem] leading-[1.95] tracking-[-0.01em] text-white/92 md:mt-12 md:text-[1.36rem] lg:mt-0 lg:max-w-[390px] lg:text-[1rem] lg:leading-[1]">
              <p className="leading-[1.5]">
                솔직히, 목사 소개 페이지는 좀 어색하죠.
                <br />
                자랑처럼 보일 것 같고, 너무 거룩하게 써 놓으면
                <br />
                오히려 멀게 느껴지고..
              </p>
              <p>그래서 그냥 있는 그대로 써보려고 합니다.</p>
            </div>
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-[560px] justify-center self-end lg:hidden">
            <div className="relative w-full max-w-[560px]">
              <Image
                src="/images/about/senior_pastor.png"
                alt="담임목사 이진욱 목사"
                width={1189}
                height={1205}
                priority
                className="h-auto w-full object-contain object-bottom"
              />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden lg:block w-[58%]">
            <div className="absolute bottom-[-350px] right-[-130px] w-[990px] max-w-none">
              <Image
                src="/images/about/senior_pastor.png"
                alt="담임목사 이진욱 목사"
                width={1189}
                height={1205}
                priority
                className="h-auto w-full object-contain"
              />
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
    </div>
  );
}
