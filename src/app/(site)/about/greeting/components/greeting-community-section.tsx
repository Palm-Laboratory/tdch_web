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
  "청소년",
  "청년",
  "다문화 가정 · 이주민 이웃",
  "선교",
  "시니어 어르신"
];

const communityPhotos = [
  {
    src: "/images/greeting/our_mission_1.jpg",
    alt: "공동체 사진 1",
    width: 720,
    height: 540,
    polaroid: true,
    position: "left-[168px] top-[134px] z-20 w-[224px] rotate-[3deg] md:left-[34.9%] md:top-[29.9%] md:w-[55.5%]",
    from: { x: 80, y: 120, rotate: -8, opacity: 0 },
    to: { x: 0, y: 0, rotate: 3, opacity: 1 },
    delay: 0.1
  },
  {
    src: "/images/greeting/our_mission_4.jpg",
    alt: "공동체 사진 2",
    width: 720,
    height: 540,
    polaroid: true,
    position: "left-[-10px] top-[250px] z-30 w-[276px] rotate-[15deg] md:left-[-4%] md:top-[52.3%] md:w-[52.4%]",
    from: { x: -100, y: 100, rotate: 30, opacity: 0 },
    to: { x: 0, y: 0, rotate: 15, opacity: 1 },
    delay: 0.25
  },
  {
    src: "/images/greeting/our_mission_2.png",
    alt: "공동체 사진 3",
    width: 540,
    height: 720,
    position: "left-[0px] top-[-6px] z-0 w-[272px] rotate-[11deg] md:left-[-1.25%] md:top-[0.35%] md:w-[49.1%]",
    from: { x: -120, y: -80, rotate: -15, opacity: 0 },
    to: { x: 0, y: 0, rotate: 11, opacity: 1 },
    delay: 0.4
  },
  {
    src: "/images/greeting/our_mission_3.jpg",
    alt: "공동체 사진 4",
    width: 720,
    height: 540,
    polaroid: true,
    position: "left-[230px] top-[-12px] z-10 w-[250px] rotate-[8deg] md:left-[43.3%] md:top-[-2%] md:w-[58.5%]",
    from: { x: 100, y: -100, rotate: -10, opacity: 0 },
    to: { x: 0, y: 0, rotate: 8, opacity: 1 },
    delay: 0.55
  },
  {
    src: "/images/greeting/our_mission_5.jpg",
    alt: "공동체 사진 5",
    width: 4000,
    height: 2794,
    polaroid: true,
    position: "right-[12px] top-[360px] z-40 w-[280px] -rotate-[6deg] md:right-[-2%] md:top-[60%] md:w-[56%]",
    from: { x: 120, y: 120, rotate: 8, opacity: 0 },
    to: { x: 0, y: 0, rotate: -6, opacity: 1 },
    delay: 0.7
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
        <div className="order-2 relative h-[620px] w-full overflow-visible md:order-1 md:h-[clamp(480px,58vw,640px)] md:w-[clamp(400px,50vw,540px)] lg:-ml-[118px] lg:-mt-[42px] lg:h-[720px] lg:w-[660px]">
          {communityPhotos.map((photo) => (
            <motion.div
              key={photo.src}
              className={`absolute ${photo.position} ${"polaroid" in photo && photo.polaroid ? "bg-white p-[10px] pb-[36px] shadow-[0_10px_24px_rgba(0,0,0,0.2)]" : ""}`}
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
                className={`block h-auto w-full object-contain ${"polaroid" in photo && photo.polaroid ? "" : "drop-shadow-[0_10px_24px_rgba(0,0,0,0.18)]"}`}
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
                  저희가 특히 마음을 두는 분들이 있어요.
                </h2>
              </div>

              <div className="type-body-small space-y-4 leading-[1.8] tracking-[0.01em] text-black/88">
                <p><strong className="font-semibold text-ink">청소년</strong> — 질문이 많고 마음이 자주 흔들리는 나이입니다. 정답을 강요하기보다 끝까지 곁에 있어 주는 어른이 되고 싶습니다.</p>
                <p><strong className="font-semibold text-ink">청년</strong> — 일과 관계와 미래 사이에서 숨 가쁘게 달리는 분들입니다. 지쳤을 때 잠시 앉아 쉴 자리, 다시 일어설 힘을 나누는 공동체가 되겠습니다.</p>
                <p><strong className="font-semibold text-ink">다문화 가정과 이주민 이웃</strong> — 낯선 땅, 낯선 언어 속에서 살아가는 분들입니다. 저도 17년을 낯선 땅에서 이방인으로 살았기에 그 마음을 압니다. 이 도시에서 가장 환영받는 이웃이 되시도록 문을 활짝 열어 두겠습니다.</p>
                <p><strong className="font-semibold text-ink">선교</strong> — 사랑을 받아 세워진 교회는 사랑을 흘려보낼 때 가장 교회다워집니다. 보령의 이웃에서 땅 끝까지, 받은 사랑을 나누는 교회가 되겠습니다.</p>
                <p><strong className="font-semibold text-ink">시니어 어르신</strong> — 평생 믿음으로 살아오신 분들입니다. 세월만큼 깊어진 그 신앙과 기도가 이 교회의 뿌리입니다. 외롭지 않게, 존귀하게 모시고, 그 믿음이 다음 세대의 유산이 되도록 돕겠습니다.</p>
                <p className="pt-2 font-medium text-ink">이 모두가 저희 교회가 꿈꾸는 가족입니다. 하나님 나라엔 나이도, 국적도, 배경도 따로 없으니까요.</p>
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
