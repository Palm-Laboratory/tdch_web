"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import useScrollReveal from "./use-scroll-reveal";
import {
  fadeIn,
  fadeUp,
  scaleUp,
  sectionCopyStackClass,
  sectionEyebrowClass,
  sectionIntroGroupClass,
  sectionNumberClass,
  sectionTitleClass,
  sectionTwoNumberClass,
} from "./shared";

const communityFocus = [
  "청소년 · 청년",
  "다문화 가정",
  "MK · TCK",
  "이주민 · 이웃",
  "교회에서 상처받은 분들"
];

const communityPhotos = [
  {
    src: "/images/greeting/our_mission_1.png",
    alt: "공동체 사진 1",
    width: 540,
    height: 720,
    position: "left-[0px] top-[-6px] z-10 w-[272px] rotate-[11deg] md:left-[-1.25%] md:top-[0.35%] md:w-[49.1%]",
    from: { x: -120, y: -80, rotate: -15, opacity: 0 },
    to: { x: 0, y: 0, rotate: 11, opacity: 1 },
    delay: 0.1
  },
  {
    src: "/images/greeting/our_mission_4.png",
    alt: "공동체 사진 2",
    width: 720,
    height: 540,
    position: "left-[230px] top-[-12px] z-0 w-[250px] rotate-[8deg] md:left-[43.3%] md:top-[-2%] md:w-[58.5%]",
    from: { x: 100, y: -100, rotate: -10, opacity: 0 },
    to: { x: 0, y: 0, rotate: 8, opacity: 1 },
    delay: 0.25
  },
  {
    src: "/images/greeting/our_mission_2.png",
    alt: "공동체 사진 3",
    width: 540,
    height: 720,
    position: "left-[168px] top-[134px] z-20 w-[224px] rotate-[3deg] md:left-[34.9%] md:top-[29.9%] md:w-[55.5%]",
    from: { x: 80, y: 120, rotate: -8, opacity: 0 },
    to: { x: 0, y: 0, rotate: 3, opacity: 1 },
    delay: 0.4
  },
  {
    src: "/images/greeting/our_mission_3.png",
    alt: "공동체 사진 4",
    width: 540,
    height: 720,
    position: "left-[-10px] top-[250px] z-30 w-[276px] rotate-[15deg] md:left-[-4%] md:top-[52.3%] md:w-[52.4%]",
    from: { x: -100, y: 100, rotate: 30, opacity: 0 },
    to: { x: 0, y: 0, rotate: 15, opacity: 1 },
    delay: 0.55
  }
];

export default function GreetingCommunitySection() {
  const community = useScrollReveal<HTMLElement>(0.35);

  return (
    <section
      ref={community.ref}
      className="relative z-0 w-full overflow-visible border-b border-black/20 bg-white py-[5.5rem] md:min-h-[482px] md:py-[70px]"
      data-section="community"
    >
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-0 md:flex-row md:items-start md:justify-between md:gap-0">
        <div className="order-2 relative h-[520px] w-full overflow-visible md:order-1 md:h-[clamp(361px,45.1vw,488px)] md:w-[clamp(400px,50vw,540px)] lg:-ml-[118px] lg:-mt-[42px] lg:h-[596px] lg:w-[660px]">
          {communityPhotos.map((photo) => (
            <motion.div
              key={photo.src}
              className={`absolute ${photo.position}`}
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
                width={photo.width}
                height={photo.height}
                className="h-auto w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
              />
            </motion.div>
          ))}
        </div>

        <div className="order-1 relative z-10 flex w-full max-w-[430px] flex-col px-5 md:order-2 md:mr-[14px] md:min-h-[clamp(361px,45.1vw,488px)] md:max-w-[390px] md:justify-center md:px-0 lg:min-h-[596px]">
          <div className="relative">
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
                <p className={sectionEyebrowClass}>OUR COMMUNITY</p>
                <h2 className={sectionTitleClass}>
                  <span className="block">저희가 특히</span>
                  <span className="block">마음을 두는 사람들</span>
                </h2>
              </div>

              <div className="type-lead tracking-[0.01em] text-black/88">
                <p>청소년, 청년들. 두 문화 사이에서 자란 다문화 가정과 MK, TCK. 이 땅에서 열심히 살아가는 이주민 이웃들. 그리고 교회에 상처받아 떠났지만 아직 하나님을 포기하지 못한 분들.</p>
                <p className="mt-6">이 모두가 저희 교회가 꿈꾸는 가족입니다.</p>
                <p>하나님 나라엔 국적도, 언어도, 배경도 <br className="md:hidden" />따로 없으니까요.</p>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 mt-[30px] flex max-w-[420px] flex-wrap gap-[14px] md:mt-[34px] md:gap-[18px]">
            {communityFocus.map((item, index) => (
              <motion.span
                key={item}
                className="type-body-small inline-flex items-center rounded-full bg-[#1a2639] px-[18px] py-[12px] font-medium tracking-[0.03em] text-white"
                variants={scaleUp}
                initial="hidden"
                animate={community.isInView ? "visible" : "hidden"}
                custom={0.4 + index * 0.1}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
