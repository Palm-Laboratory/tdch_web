import Image from "next/image";
import { Nanum_Myeongjo, Original_Surfer } from "next/font/google";

const originalSurfer = Original_Surfer({
  subsets: ["latin"],
  weight: "400"
});

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["800"]
});

const missionCards = [
  {
    eyebrow: "TEACHING",
    title: "가르치는 사명",
    description:
      "강단에서 진리를 가르치셨고, 말씀으로 세상을 살아가는 힘을 주셨습니다.",
    letter: "T"
  },
  {
    eyebrow: "HEALING",
    title: "치유하는 사명",
    description:
      "부서진 사람 앞에서 무릎을 꿇으셨고, 사랑으로 그 마음을 회복시키셨습니다.",
    letter: "H"
  },
  {
    eyebrow: "EVANGELIZING",
    title: "전파하는 사명",
    description:
      "아무도 찾지 않는 사람에게 먼저 찾아가셨어요. 삶으로 복음을 전하는 것.",
    letter: "E"
  }
];

export default function GreetingPage() {
  return (
    <div className="w-full bg-white">
      <section
        className="relative h-[420px] w-full overflow-hidden md:h-[520px]"
        data-section="hero"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/greeting/greeting_banner.png"
            alt="The 제자교회 인사말 배경 이미지"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/12 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        <div className="relative z-10 flex h-full items-end px-5 py-8 md:px-0 md:py-[30px]">
          <div className="section-shell w-full">
            <div className="max-w-[417px] text-white">
              <p
                className={`${originalSurfer.className} text-[11px] uppercase tracking-[0.28em] text-white/80 md:text-[15px] md:tracking-[0.14em]`}
              >
                Pastor&apos;s Greeting
              </p>
              <h1
                className={`${nanumMyeongjo.className} mt-4 text-[34px] font-extrabold leading-[1.15] tracking-[0.02em] md:mt-[18px] md:text-[48px] md:leading-[1.16]`}
              >
                <span className="block">당신이 여기 있어서,</span>
                <span className="block">정말 다행입니다.</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section
        className="w-full border-b border-black/20 bg-[#fffefc] py-14 md:min-h-[428px] md:py-20"
        data-section="welcome"
      >
        <div className="section-shell">
          <div className="flex max-w-[980px] flex-col items-start gap-8 md:gap-10">
            <p
              className={`${originalSurfer.className} text-[24px] leading-[1] tracking-[0.04em] text-[#1a2744] md:text-[32px]`}
            >
              WELCOME
            </p>

            <div className="w-full rounded-r-[12px] border-l-[3px] border-[#c9a84c] bg-gradient-to-r from-[#fffcf5] to-[#fffefc] px-5 py-5 md:px-[30px] md:py-5">
              <div
                className={`${nanumMyeongjo.className} space-y-1 text-[22px] font-bold leading-[1.65] tracking-[0.04em] text-[#1a2744] md:text-[24px]`}
              >
                <p>솔직히 교회가 힘들었던 적 있으신가요?</p>
                <p>기대했다가 상처받고, 지쳐서 떠났다가,</p>
                <p>
                  그래도 어딘가 <span className="text-[#c9a84c]">하나님은 믿고 싶은 그 마음.</span>
                </p>
              </div>
            </div>

            <p className="text-base leading-[1.8] tracking-[0.04em] text-[#1a2744] md:text-[18px]">
              The 제자교회는 바로 그 자리에서 시작된 교회입니다.
            </p>
          </div>
        </div>
      </section>

      <section
        className="relative w-full border-b border-black/50 bg-[#202f55] py-14 text-white md:min-h-[586px] md:py-[72px]"
        data-section="mission"
      >
        <span
          className={`${originalSurfer.className} pointer-events-none absolute left-[155px] top-[43px] text-[112px] leading-none tracking-normal text-[#111d38]/70 md:text-[116px]`}
        >
          01
        </span>

        <div className="mx-auto w-full max-w-[1120px] px-0">
          <div className="flex flex-col items-start">
            <div className="relative w-full">
              <div className="relative z-10 flex w-full flex-col items-start gap-[34px] pt-[42px]">
                <div className="flex w-full max-w-[566px] flex-col items-start gap-[14px] text-white">
                  <p
                    className={`${originalSurfer.className} text-[18px] leading-none tracking-[0.08em] text-[#d1ab46] md:text-[22px]`}
                  >
                    OUR MISSION
                  </p>
                  <h2
                    className={`${nanumMyeongjo.className} text-[28px] font-bold leading-[1.22] tracking-[0.01em] md:text-[31px]`}
                  >
                    예수님이 하신 세 가지
                  </h2>
                </div>

                <p className="max-w-[620px] text-[15px] leading-[1.8] tracking-[0.01em] text-white/92 md:text-[16px]">
                  예수님은 평생 세 가지 일을 하셨어요. 가르치고, 치유하고, 복음을 전하셨습니다.
                  <br />
                  The 제자교회도 그렇게 하고 싶습니다.
                </p>
              </div>
            </div>

            <div className="mt-[42px] grid w-full gap-[10px] md:grid-cols-3">
              {missionCards.map((card) => (
                <article
                  key={card.title}
                  className="relative min-h-[164px] w-full overflow-hidden rounded-[14px] bg-[#fbfbfa] px-[24px] py-[28px] shadow-[0px_10px_24px_rgba(9,18,37,0.18)] md:w-[310px]"
                >
                  <div className="flex max-w-[228px] flex-col gap-[18px]">
                    <div className="flex flex-col gap-[14px]">
                      <p className="text-[10px] leading-none tracking-[0.24em] text-black/80">
                        {card.eyebrow}
                      </p>
                      <h3
                        className={`${nanumMyeongjo.className} text-[18px] font-bold leading-[1.15] tracking-[0.01em] text-black md:text-[19px]`}
                      >
                        {card.title}
                      </h3>
                    </div>

                    <p className="max-w-[224px] text-[12px] leading-[1.7] tracking-[0.01em] text-black/85">
                      {card.description}
                    </p>
                  </div>

                  <span
                    className={`${nanumMyeongjo.className} absolute right-[24px] top-[12px] text-[54px] leading-none tracking-[-0.02em] text-[#B2B2B2]`}
                  >
                    {card.letter}
                  </span>
                </article>
              ))}
            </div>

            <p className="mt-[34px] text-[15px] leading-[1.8] tracking-[0.01em] text-white/92 md:text-[16px]">
              거창하지 않아도 됩니다. 예수님이 하신 것처럼, 그냥 그렇게요.
            </p>
          </div>
        </div>
      </section>

      <section className="min-h-[482px] w-full" data-section="community" />
      <section className="min-h-[584px] w-full" data-section="open-door" />
    </div>
  );
}
