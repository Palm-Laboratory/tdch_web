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
      "무너진 사람 앞에서 무릎을 꿇으셨고, 사랑으로 그 마음을 회복시키셨습니다.",
    letter: "H"
  },
  {
    eyebrow: "EVANGELIZING",
    title: "전파하는 사명",
    description:
      "아무도 찾지 않는 사람에게 먼저 찾아가셔서 삶으로 복음을 전하셨습니다.",
    letter: "E"
  }
];

const communityFocus = [
  "청소년 · 청년",
  "다문화 가정",
  "MK · TCK",
  "이주민 · 이웃",
  "교회에서 상처받은 분들"
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

        <div className="section-shell">
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

            <div className="mt-[42px] flex w-full flex-col gap-[10px] md:flex-row md:items-start md:gap-[20px]">
              {missionCards.map((card) => (
                <article
                  key={card.title}
                  className="relative min-h-[164px] w-full overflow-hidden rounded-[14px] bg-[#fbfbfa] px-[24px] py-[28px] shadow-[0px_10px_24px_rgba(9,18,37,0.18)] md:min-h-[196px] md:flex-1 md:px-[28px] md:py-[32px]"
                >
                  <div className="flex max-w-[252px] flex-col gap-[18px] md:max-w-[272px] md:gap-[20px]">
                    <div className="flex flex-col gap-[14px] md:gap-[16px]">
                      <p className="text-[10px] leading-none tracking-[0.24em] text-black/80 md:text-[11px]">
                        {card.eyebrow}
                      </p>
                      <h3
                        className={`${nanumMyeongjo.className} text-[18px] font-bold leading-[1.15] tracking-[0.01em] text-black md:text-[22px]`}
                      >
                        {card.title}
                      </h3>
                    </div>

                    <p className="max-w-[236px] text-[12px] leading-[1.7] tracking-[0.01em] text-black/85 md:max-w-[264px] md:text-[13px] md:leading-[1.78]">
                      {card.description}
                    </p>
                  </div>

                  <span
                    className={`${nanumMyeongjo.className} absolute right-[24px] top-[12px] text-[54px] leading-none tracking-[-0.02em] text-[#B2B2B2] md:right-[28px] md:top-[14px] md:text-[60px]`}
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

      <section
        className="relative z-0 w-full overflow-visible border-b border-black/20 bg-[#fcfbf8] py-14 md:min-h-[482px] md:py-[70px]"
        data-section="community"
      >
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-0 md:flex-row md:items-start md:justify-between md:gap-0">
          <div className="relative h-[520px] w-full overflow-visible md:-ml-[118px] md:-mt-[42px] md:h-[596px] md:w-[660px]">
            <div className="absolute left-[0px] top-[-6px] z-10 w-[272px] rotate-[11deg] md:left-[-8px] md:top-[2px] md:w-[324px]">
              <Image
                src="/images/greeting/our_mission_1.png"
                alt="공동체 사진 1"
                width={540}
                height={720}
                className="h-auto w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
              />
            </div>

            <div className="absolute left-[230px] top-[-12px] z-0 w-[250px] rotate-[8deg] md:left-[286px] md:top-[-12px] md:w-[386px]">
              <Image
                src="/images/greeting/our_mission_4.png"
                alt="공동체 사진 2"
                width={720}
                height={540}
                className="h-auto w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
              />
            </div>

            <div className="absolute left-[168px] top-[134px] z-20 w-[224px] rotate-[3deg] md:left-[230px] md:top-[178px] md:w-[366px]">
              <Image
                src="/images/greeting/our_mission_2.png"
                alt="공동체 사진 3"
                width={540}
                height={720}
                className="h-auto w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.2)]"
              />
            </div>

            <div className="absolute left-[-10px] top-[250px] z-30 w-[276px] rotate-[15deg] md:left-[-26px] md:top-[312px] md:w-[346px]">
              <Image
                src="/images/greeting/our_mission_3.png"
                alt="공동체 사진 4"
                width={540}
                height={720}
                className="h-auto w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>

          <div className="relative z-10 flex w-full max-w-[430px] flex-col px-5 md:mr-[14px] md:max-w-[448px] md:px-0 md:pt-[52px]">
            <span
              className={`${originalSurfer.className} pointer-events-none absolute left-0 top-[-30px] text-[112px] leading-none tracking-normal text-[#ece8e2] md:left-[-85px] md:top-[-16px] md:text-[116px]`}
            >
              02
            </span>

            <div className="relative z-10 flex flex-col gap-[12px]">
              <div className="flex flex-col gap-[24px]">
                <p
                  className={`${originalSurfer.className} text-[18px] leading-none tracking-[0.08em] text-[#caa643] md:text-[20px]`}
                >
                  OUR COMMUNITY
                </p>
                <div className={`${nanumMyeongjo.className} text-[28px] leading-[1.3] tracking-[0.01em] text-black md:text-[30px] md:leading-[1.32]`}>
                  <p>저희가 특히</p>
                  <p>마음을 두는 사람들</p>
                </div>
              </div>

              <div className="pt-[2px] text-[15px] leading-[1.8] tracking-[0.01em] text-black/88 md:text-[16px] md:leading-[28px]">
                <p>하나님 나라엔 국적도, 언어도, 배경도 따로 없으니까요.</p>
                <p>이 모두가 저희 교회가 꿈꾸는 가족입니다.</p>
              </div>
            </div>

            <div className="relative z-10 mt-[30px] flex max-w-[420px] flex-wrap gap-[14px] md:mt-[34px] md:gap-[18px]">
              {communityFocus.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full bg-[#1a2639] px-[18px] py-[12px] text-[14px] font-medium tracking-[0.03em] text-white md:text-[15px]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section
        className="relative z-20 min-h-[584px] w-full bg-[#fcfbf8]"
        data-section="open-door"
      />
    </div>
  );
}
