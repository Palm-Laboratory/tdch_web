"use client";

import Image from "next/image";
import { Nanum_Myeongjo, Original_Surfer } from "next/font/google";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
      "강단에서 진리를 가르치셨고, 말씀으로\n세상을 살아가는 힘을 주셨습니다.",
    letter: "T"
  },
  {
    eyebrow: "HEALING",
    title: "치유하는 사명",
    description:
      "무너진 사람 앞에서 무릎을 꿇으셨고,\n사랑으로 그 마음을 회복시키셨습니다.",
    letter: "H"
  },
  {
    eyebrow: "EVANGELIZING",
    title: "전파하는 사명",
    description:
      "아무도 찾지 않는 사람에게 먼저 찾아가셔서\n삶으로 복음을 전하셨습니다.",
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

const sectionNumberClass =
  `${originalSurfer.className} pointer-events-none absolute left-[-10px] top-[-28px] text-[112px] leading-none tracking-normal md:text-[116px]`;
const sectionOneNumberClass = "md:left-[-9px] md:top-[-32px]";
const sectionTwoNumberClass = "md:left-[-40px] md:top-[-25px]";
const sectionThreeNumberClass = "md:left-[-40px] md:top-[-60px]";
const sectionEyebrowClass =
  `${originalSurfer.className} text-[18px] leading-none tracking-[0.08em] text-[#caa643] md:text-[20px]`;
const sectionTitleClass =
  `${nanumMyeongjo.className} text-[28px] font-bold leading-[1.28] tracking-[0.01em] md:text-[30px] md:leading-[1.32]`;
const sectionIntroGroupClass = "flex flex-col gap-[14px]";
const sectionCopyStackClass = "relative z-10 flex flex-col gap-[24px]";

/* ─── Reusable animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const, delay }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" as const, delay }
  })
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const, delay }
  })
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const, delay }
  })
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const, delay }
  })
};

/* ─── useInView wrapper for cleaner section code ─── */
function useScrollReveal(amount = 0.25) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount });
  return { ref, isInView };
}

export default function GreetingPage() {
  const hero = useScrollReveal(0.4);
  const welcome = useScrollReveal(0.35);
  const mission = useScrollReveal(0.35);
  const community = useScrollReveal(0.35);
  const openDoor = useScrollReveal(0.35);

  return (
    <div className="w-full bg-white">
      {/* ━━━ HERO ━━━ */}
      <section
        ref={hero.ref}
        className="relative h-[420px] w-full overflow-hidden md:h-[520px]"
        data-section="hero"
      >
        {/* Ken Burns zoom on bg image */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={hero.isInView ? { scale: 1 } : { scale: 1.12 }}
          transition={{ duration: 6, ease: "easeOut" }}
        >
          <Image
            src="/images/greeting/greeting_banner.png"
            alt="The 제자교회 인사말 배경 이미지"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/12 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </motion.div>

        <div className="relative z-10 flex h-full items-end px-5 py-8 md:px-0 md:py-[30px]">
          <div className="section-shell w-full">
            <div className="max-w-[417px] text-white">
              <motion.p
                className={`${originalSurfer.className} text-[11px] uppercase tracking-[0.28em] text-white/80 md:text-[15px] md:tracking-[0.14em]`}
                initial={{ opacity: 0, y: 20 }}
                animate={hero.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              >
                Pastor&apos;s Greeting
              </motion.p>
              <motion.h1
                className={`${nanumMyeongjo.className} mt-4 text-[34px] font-extrabold leading-[1.15] tracking-[0.02em] md:mt-[18px] md:text-[48px] md:leading-[1.16]`}
                initial={{ opacity: 0, y: 30 }}
                animate={hero.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              >
                <span className="block">당신이 여기 있어서,</span>
                <span className="block">정말 다행입니다.</span>
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ WELCOME ━━━ */}
      <section
        ref={welcome.ref}
        className="w-full border-b border-black/20 bg-[#fffefc] py-14 md:min-h-[428px] md:py-20"
        data-section="welcome"
      >
        <div className="section-shell">
          <div className="flex max-w-[980px] flex-col items-start gap-8 md:gap-10">
            <motion.p
              className={`${originalSurfer.className} text-[24px] leading-[1] tracking-[0.04em] text-[#1a2744] md:text-[32px]`}
              variants={slideInLeft}
              initial="hidden"
              animate={welcome.isInView ? "visible" : "hidden"}
              custom={0}
            >
              WELCOME
            </motion.p>

            <motion.div
              className="w-full rounded-r-[12px] border-l-[3px] border-[#c9a84c] bg-gradient-to-r from-[#fffcf5] to-[#fffefc] px-5 py-5 md:px-[30px] md:py-5"
              variants={fadeUp}
              initial="hidden"
              animate={welcome.isInView ? "visible" : "hidden"}
              custom={0.15}
            >
              <div
                className={`${nanumMyeongjo.className} space-y-1 text-[18px] font-bold leading-[1.78] tracking-[0.01em] text-[#1a2744]`}
              >
                <p>솔직히 교회가 힘들었던 적 있으신가요?</p>
                <p>기대했다가 상처받고, 지쳐서 떠났다가,</p>
                <p>
                  그래도 어딘가 <span className="text-[#c9a84c]">하나님은 믿고 싶은 그 마음.</span>
                </p>
              </div>
            </motion.div>

            <motion.p
              className="text-base leading-[1.8] tracking-[0.04em] text-[#1a2744] md:text-[18px]"
              variants={fadeUp}
              initial="hidden"
              animate={welcome.isInView ? "visible" : "hidden"}
              custom={0.35}
            >
              The 제자교회는 바로 그 자리에서 시작된 교회입니다.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ━━━ MISSION (01) ━━━ */}
      <section
        ref={mission.ref}
        className="relative w-full border-b border-black/50 bg-[#202f55] py-14 text-white md:min-h-[586px] md:py-[72px]"
        data-section="mission"
      >
        <div className="section-shell relative">
          <motion.span
            className={`${sectionNumberClass} ${sectionOneNumberClass} text-[#111d38]/70`}
            variants={fadeIn}
            initial="hidden"
            animate={mission.isInView ? "visible" : "hidden"}
            custom={0}
          >
            01
          </motion.span>
          <div className="flex flex-col items-start">
            <div className="relative w-full">
              <div className={`${sectionCopyStackClass} w-full items-start pt-[42px]`}>
                <motion.div
                  className={`${sectionIntroGroupClass} w-full max-w-[566px] items-start text-white`}
                  variants={fadeUp}
                  initial="hidden"
                  animate={mission.isInView ? "visible" : "hidden"}
                  custom={0.1}
                >
                  <p className={sectionEyebrowClass}>
                    OUR MISSION
                  </p>
                  <h2 className={sectionTitleClass}>
                    예수님이 하신 세 가지
                  </h2>
                </motion.div>

                <motion.div
                  className="max-w-[620px]"
                  variants={fadeUp}
                  initial="hidden"
                  animate={mission.isInView ? "visible" : "hidden"}
                  custom={0.25}
                >
                  <p className="text-[18px] leading-[1.8] tracking-[0.01em] text-white/92">
                    예수님은 평생 세 가지 일을 하셨어요. 가르치고, 치유하고, 복음을 전하셨습니다.
                    <br />
                    The 제자교회도 그렇게 하고 싶습니다.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Staggered mission cards */}
            <div className="mt-[42px] flex w-full flex-col gap-[10px] md:flex-row md:items-stretch md:gap-[40px]">
              {missionCards.map((card, i) => (
                <motion.article
                  key={card.title}
                  className="relative min-h-[164px] w-full overflow-hidden rounded-[14px] bg-[#fbfbfa] px-[24px] py-[28px] shadow-[0px_10px_24px_rgba(9,18,37,0.18)] transition-[transform,box-shadow] duration-[40ms] ease-linear hover:-translate-y-2 hover:shadow-[0px_18px_40px_rgba(9,18,37,0.28)] hover:duration-[300ms] hover:ease-out md:min-h-[196px] md:flex-1 md:px-[28px] md:py-[32px]"
                  variants={fadeUp}
                  initial="hidden"
                  animate={mission.isInView ? "visible" : "hidden"}
                  custom={0.35 + i * 0.15}
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

                    <p className="max-w-[236px] whitespace-pre-line text-[15px] leading-[1.76] tracking-[0.01em] text-black/85 md:max-w-[264px] md:text-[15px] md:leading-[1.82]">
                      {card.description}
                    </p>
                  </div>

                  <span
                    className={`${nanumMyeongjo.className} absolute right-[24px] top-[12px] text-[54px] leading-none tracking-[-0.02em] text-[#B2B2B2] md:right-[28px] md:top-[14px] md:text-[60px]`}
                  >
                    {card.letter}
                  </span>
                </motion.article>
              ))}
            </div>

            <motion.p
              className="mt-[34px] text-[18px] leading-[1.8] tracking-[0.01em] text-white/92"
              variants={fadeUp}
              initial="hidden"
              animate={mission.isInView ? "visible" : "hidden"}
              custom={0.8}
            >
              거창하지 않아도 됩니다. 예수님이 하신 것처럼, 그냥 그렇게요.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ━━━ COMMUNITY (02) ━━━ */}
      <section
        ref={community.ref}
        className="relative z-0 w-full overflow-visible border-b border-black/20 bg-white py-14 md:min-h-[482px] md:py-[70px]"
        data-section="community"
      >
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-0 md:flex-row md:items-start md:justify-between md:gap-0">
          {/* Photo collage with fly-in animations */}
          <div className="order-2 relative h-[520px] w-full overflow-visible md:order-1 md:-ml-[118px] md:-mt-[42px] md:h-[596px] md:w-[660px]">
            {[
              {
                src: "/images/greeting/our_mission_1.png",
                alt: "공동체 사진 1",
                w: 540, h: 720,
                pos: "left-[0px] top-[-6px] z-10 w-[272px] rotate-[11deg] md:left-[-8px] md:top-[2px] md:w-[324px]",
                from: { x: -120, y: -80, rotate: -15, opacity: 0 },
                to: { x: 0, y: 0, rotate: 11, opacity: 1 },
                delay: 0.1
              },
              {
                src: "/images/greeting/our_mission_4.png",
                alt: "공동체 사진 2",
                w: 720, h: 540,
                pos: "left-[230px] top-[-12px] z-0 w-[250px] rotate-[8deg] md:left-[286px] md:top-[-12px] md:w-[386px]",
                from: { x: 100, y: -100, rotate: -10, opacity: 0 },
                to: { x: 0, y: 0, rotate: 8, opacity: 1 },
                delay: 0.25
              },
              {
                src: "/images/greeting/our_mission_2.png",
                alt: "공동체 사진 3",
                w: 540, h: 720,
                pos: "left-[168px] top-[134px] z-20 w-[224px] rotate-[3deg] md:left-[230px] md:top-[178px] md:w-[366px]",
                from: { x: 80, y: 120, rotate: -8, opacity: 0 },
                to: { x: 0, y: 0, rotate: 3, opacity: 1 },
                delay: 0.4
              },
              {
                src: "/images/greeting/our_mission_3.png",
                alt: "공동체 사진 4",
                w: 540, h: 720,
                pos: "left-[-10px] top-[250px] z-30 w-[276px] rotate-[15deg] md:left-[-26px] md:top-[312px] md:w-[346px]",
                from: { x: -100, y: 100, rotate: 30, opacity: 0 },
                to: { x: 0, y: 0, rotate: 15, opacity: 1 },
                delay: 0.55
              }
            ].map((photo) => (
              <motion.div
                key={photo.src}
                className={`absolute ${photo.pos}`}
                style={{ rotate: 0 }}
                initial={photo.from}
                animate={community.isInView ? photo.to : photo.from}
                transition={{
                  duration: 0.9,
                  ease: [0.25, 0.46, 0.45, 0.94] as const,
                  delay: photo.delay
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.w}
                  height={photo.h}
                  className="h-auto w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                />
              </motion.div>
            ))}
          </div>

          {/* Community text */}
          <div className="order-1 relative z-10 flex w-full max-w-[430px] flex-col px-5 md:order-2 md:mr-[14px] md:max-w-[390px] md:px-0 md:pt-[52px]">
            <motion.span
              className={`${sectionNumberClass} ${sectionTwoNumberClass} text-[#ece8e2]`}
              variants={fadeIn}
              initial="hidden"
              animate={community.isInView ? "visible" : "hidden"}
              custom={0}
            >
              02
            </motion.span>
            <motion.div
              className={sectionCopyStackClass}
              variants={fadeUp}
              initial="hidden"
              animate={community.isInView ? "visible" : "hidden"}
              custom={0.15}
            >
              <div className={sectionIntroGroupClass}>
                <p className={sectionEyebrowClass}>
                  OUR COMMUNITY
                </p>
                <h2 className={sectionTitleClass}>
                  <span className="block">저희가 특히</span>
                  <span className="block">마음을 두는 사람들</span>
                </h2>
              </div>

              <div className="text-[18px] leading-[1.8] tracking-[0.01em] text-black/88">
                <p>하나님 나라엔 국적도, 언어도, 배경도 따로 없으니까요.</p>
                <p className="mt-1">이 모두가 저희 교회가 꿈꾸는 가족입니다.</p>
              </div>
            </motion.div>

            {/* Stagger pop-in badges */}
            <div className="relative z-10 mt-[30px] flex max-w-[420px] flex-wrap gap-[14px] md:mt-[34px] md:gap-[18px]">
              {communityFocus.map((item, i) => (
                <motion.span
                  key={item}
                  className="inline-flex items-center rounded-full bg-[#1a2639] px-[18px] py-[12px] text-[14px] font-medium tracking-[0.03em] text-white md:text-[15px]"
                  variants={scaleUp}
                  initial="hidden"
                  animate={community.isInView ? "visible" : "hidden"}
                  custom={0.4 + i * 0.1}
                  whileHover={{
                    scale: 1.06,
                    transition: { duration: 0.2 }
                  }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ OPEN DOOR (03) ━━━ */}
      <section
        ref={openDoor.ref}
        className="relative z-20 w-full border-b border-black/20 bg-[#fcfbf8] py-14 md:min-h-[584px] md:py-[80px]"
        data-section="open-door"
      >
        <div className="section-shell">
          <div className="relative flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            <div className="relative z-10 flex w-full max-w-[430px] flex-col md:max-w-[448px] md:pt-[18px]">
              <motion.span
                className={`${sectionNumberClass} ${sectionThreeNumberClass} text-[#ece8e2]`}
                variants={fadeIn}
                initial="hidden"
                animate={openDoor.isInView ? "visible" : "hidden"}
                custom={0}
              >
                03
              </motion.span>
              <motion.div
                className={sectionCopyStackClass}
                variants={fadeUp}
                initial="hidden"
                animate={openDoor.isInView ? "visible" : "hidden"}
                custom={0.1}
              >
                <div className={sectionIntroGroupClass}>
                  <p className={sectionEyebrowClass}>
                    OPEN DOOR
                  </p>

                  <h2 className={sectionTitleClass}>
                    <span className="block">완벽하지 않아도</span>
                    <span className="block">됩니다</span>
                  </h2>
                </div>

                <div className="space-y-[18px] text-[18px] leading-[1.8] tracking-[0.01em] text-black/88">
                  <p>
                    The 제자교회는 완벽한 사람들이 모인 곳이 아닙니다.
                    <br />
                    의심해도 되고, 넘어져도 되고, 질문해도 됩니다.
                  </p>
                  <p>
                    성령님이 이 공동체를 이끄실 거라 믿기 때문에,
                    <br />
                    우리는 오늘도 함께 배우면서 걸어가고 있어요.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="mt-[38px] max-w-[412px] rounded-r-[12px] border-l-[3px] border-[#caa643] bg-gradient-to-r from-[#fffaf0] to-[rgba(252,251,248,0.2)] px-[28px] py-[30px]"
                variants={fadeUp}
                initial="hidden"
                animate={openDoor.isInView ? "visible" : "hidden"}
                custom={0.35}
              >
                <div className={`${nanumMyeongjo.className} text-[18px] leading-[1.78] tracking-[0.01em] text-black`}>
                  <p>지쳤다면, 여기서 쉬어가세요.</p>
                  <p className="mt-1">다시 시작하고 싶다면, 함께 걸어가요.</p>
                </div>
              </motion.div>
            </div>

            {/* Photo frame slide in from right */}
            <motion.div
              className="w-full md:w-[460px]"
              variants={slideInRight}
              initial="hidden"
              animate={openDoor.isInView ? "visible" : "hidden"}
              custom={0.2}
            >
              <div className="relative h-[360px] border border-[rgba(0,0,0,0.22)] bg-white md:h-[432px]">
                <div className="absolute left-[18px] right-[18px] top-[24px] bottom-[24px] overflow-hidden rounded-[8px] border border-[#0b0b0b] shadow-[0px_1px_1px_rgba(0,0,0,0.1)] md:left-[21px] md:right-[21px] md:top-[30px] md:bottom-[92px]">
                  <Image
                    src="/images/greeting/open_door.png"
                    alt="더제자교회 공동체 사진"
                    fill
                    sizes="(max-width: 768px) 100vw, 416px"
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
