"use client";

import { motion } from "framer-motion";
import useScrollReveal from "./use-scroll-reveal";
import {
  fadeIn,
  fadeUp,
  nanumMyeongjo,
  sectionCopyStackClass,
  sectionEyebrowClass,
  sectionIntroGroupClass,
  sectionNumberClass,
  sectionOneNumberClass,
  sectionTitleClass,
} from "./shared";

const missionCards = [
  {
    eyebrow: "TEACHING",
    title: "가르치는 사명",
    description: (
      <>
        강단에서 진리를 가르치셨고, 말씀으로
        <br />
        세상을 살아가는 힘을 주셨습니다.
      </>
    ),
    letter: "T"
  },
  {
    eyebrow: "HEALING",
    title: "치유하는 사명",
    description: (
      <>
        부서진 사람 앞에서 무릎을 꿇으셨고,
        <br />
        사랑으로 그 마음을 회복시키셨습니다.
      </>
    ),
    letter: "H"
  },
  {
    eyebrow: "EVANGELIZING",
    title: "전파하는 사명",
    description: (
      <>
        아무도 찾지 않는 사람에게<br className="md:hidden" /> 먼저
        찾아가셔서 삶으로 복음을<br className="md:hidden" /> 전하셨습니다.
      </>
    ),
    letter: "E"
  }
];

export default function GreetingMissionSection() {
  const mission = useScrollReveal<HTMLElement>(0.35);

  return (
    <section
      ref={mission.ref}
      className="relative w-full border-b border-black/50 bg-[#202f55] py-[5.5rem] text-white md:min-h-[586px] md:py-[72px]"
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
                <p className={sectionEyebrowClass}>OUR MISSION</p>
                <h2 className={sectionTitleClass}>예수님이 하신 세 가지</h2>
              </motion.div>

              <motion.div
                className="max-w-[620px]"
                variants={fadeUp}
                initial="hidden"
                animate={mission.isInView ? "visible" : "hidden"}
                custom={0.25}
              >
                <p className="type-lead tracking-[0.01em] text-white/92">
                  예수님은 평생 세 가지 일을 하셨어요.<br />
                  가르치고, 치유하고,
                  복음을 전하셨습니다.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="mt-[42px] flex w-full flex-col gap-[10px] md:flex-row md:items-stretch md:gap-[40px]">
            {missionCards.map((card, index) => (
              <motion.article
                key={card.title}
                className="relative min-h-[164px] w-full overflow-hidden rounded-[14px] bg-[#fbfbfa] px-[24px] py-[28px] shadow-[0px_10px_24px_rgba(9,18,37,0.18)] transition-[transform,box-shadow] duration-[40ms] ease-linear hover:-translate-y-2 hover:shadow-[0px_18px_40px_rgba(9,18,37,0.28)] hover:duration-[300ms] hover:ease-out md:min-h-[196px] md:flex-1 md:px-[28px] md:py-[32px]"
                variants={fadeUp}
                initial="hidden"
                animate={mission.isInView ? "visible" : "hidden"}
                custom={0.35 + index * 0.15}
              >
                <div className="flex max-w-[252px] flex-col gap-[18px] md:max-w-[272px] md:gap-[20px]">
                  <div className="flex flex-col gap-[14px] md:gap-[16px]">
                    <p className="type-label tracking-[0.24em] text-black/80">
                      {card.eyebrow}
                    </p>
                    <h3
                      className={`${nanumMyeongjo.className} type-card-title font-bold leading-[1.15] tracking-[0.01em] text-black`}
                    >
                      {card.title}
                    </h3>
                  </div>

                  <p className="type-body-small max-w-[236px] tracking-[0.01em] text-black/85 md:max-w-[264px]">
                    {card.description}
                  </p>
                </div>

                <span
                  className={`${nanumMyeongjo.className} absolute right-[24px] top-[12px] text-[3.375rem] leading-none tracking-[-0.02em] text-[#B2B2B2] md:right-[28px] md:top-[14px] md:text-[3.75rem]`}
                >
                  {card.letter}
                </span>
              </motion.article>
            ))}
          </div>

          <motion.p
            className="type-lead mt-[34px] tracking-[0.01em] text-white/92"
            variants={fadeUp}
            initial="hidden"
            animate={mission.isInView ? "visible" : "hidden"}
            custom={0.8}
          >
            The 제자교회도 그렇게 하고 싶습니다.
            <br />
            말씀으로 가르치고, 사랑으로 치유하고, 삶으로 복음을 전하는 것..

            <br />

            거창하지 않아도 됩니다.<br className="md:hidden" /> 예수님이 하신 것처럼,<br className="md:hidden" /> 그냥 그렇게요.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
