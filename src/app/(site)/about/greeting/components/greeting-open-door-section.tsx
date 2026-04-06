"use client";

import Image from "next/image";
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
  sectionThreeNumberClass,
  sectionTitleClass,
  slideInRight,
} from "./shared";

export default function GreetingOpenDoorSection() {
  const openDoor = useScrollReveal<HTMLElement>(0.35);

  return (
    <section
      ref={openDoor.ref}
      className="relative z-20 w-full border-b border-black/20 bg-[#fcfbf8] py-[5.5rem] md:min-h-[584px] md:py-[70px]"
      data-section="open-door"
    >
      <div className="section-shell">
        <div className="relative flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="relative z-10 flex min-w-0 w-full max-w-[430px] flex-col md:max-w-[clamp(248px,31vw,360px)] md:self-center lg:max-w-[448px]">
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
                <p className={sectionEyebrowClass}>OPEN DOOR</p>

                <h2 className={sectionTitleClass}>
                  <span className="block">완벽하지 않아도</span>
                  <span className="block">됩니다</span>
                </h2>
              </div>

              <div className="type-lead space-y-[18px] tracking-[0.01em] text-black/88">
                <p>
                  The 제자교회는 완벽한 사람들이 모인 곳이 아닙니다.
                  <br />
                  의심해도 되고, 넘어져도 되고, 질문해도 됩니다.
                  <br />
                  그냥 와도 됩니다.
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
              <div className={`${nanumMyeongjo.className} type-lead font-bold tracking-[0.01em] text-black`}>
                <p>지쳤다면, 여기서 쉬어가세요.</p>
                <p className="mt-1">다시 시작하고 싶다면, 함께 걸어가요.</p>

                <p className="type-body-small mt-5 text-right font-normal text-black/72">
                  &quot;성령으로 제자 삼는 교회&quot;
                </p>
                <p className="type-body-small mt-2 text-right font-normal text-black/72">
                  The 제자교회 담임목사 이진욱 드림
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="w-full max-w-[398px] self-center md:w-[460px] md:max-w-none md:self-start"
            variants={slideInRight}
            initial="hidden"
            animate={openDoor.isInView ? "visible" : "hidden"}
            custom={0.2}
          >
            <div className="relative h-[560px] border border-[rgba(0,0,0,0.22)] bg-white md:h-[640px]">
              <div className="absolute bottom-[44px] left-[18px] right-[18px] top-[24px] overflow-hidden shadow-[inset_0_0_4px_rgba(0,0,0,0.24),0px_1px_1px_rgba(0,0,0,0.1)] md:bottom-[56px] md:left-[21px] md:right-[21px] md:top-[30px]">
                <Image
                  src="/images/greeting/open_door.jpeg"
                  alt="더제자교회 공동체 사진"
                  fill
                  sizes="(max-width: 768px) 100vw, 416px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
