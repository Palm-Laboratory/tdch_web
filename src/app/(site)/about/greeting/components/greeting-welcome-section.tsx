"use client";

import { motion } from "framer-motion";
import useScrollReveal from "./use-scroll-reveal";
import {
  fadeUp,
  nanumMyeongjo,
  sectionEyebrowClass,
  sectionIntroGroupClass,
  sectionTitleClass,
  slideInLeft,
} from "./shared";

const welcomeQuestions = [
  "이렇게 살아도 괜찮은 걸까?",
  "나 같은 사람도 하나님 앞에 설 수 있을까?",
  "믿고 싶은데, 어디서부터 시작해야 하지?"
];

export default function GreetingWelcomeSection() {
  const welcome = useScrollReveal<HTMLElement>(0.35);

  return (
    <section
      ref={welcome.ref}
      className="w-full border-b border-black/20 bg-[#fffefc] py-[5.5rem] md:min-h-[428px] md:py-20"
      data-section="welcome"
    >
      <div className="section-shell">
        <div className="flex max-w-[980px] flex-col items-start gap-8 md:gap-10">
          <div className="flex w-full flex-col gap-3 md:gap-10">
            <div className={sectionIntroGroupClass}>
              <motion.p
                className={sectionEyebrowClass}
                variants={slideInLeft}
                initial="hidden"
                animate={welcome.isInView ? "visible" : "hidden"}
                custom={0}
              >
                WELCOME
              </motion.p>
              <motion.h2
                className={`${sectionTitleClass} text-[#111d38]`}
                variants={fadeUp}
                initial="hidden"
                animate={welcome.isInView ? "visible" : "hidden"}
                custom={0.35}
              >
                살다 보면 이런 질문이 <br className="md:hidden" />생길 때가 있어요.
              </motion.h2>
            </div>

            <div className="flex w-full flex-col gap-1 md:gap-2">
              {welcomeQuestions.map((question, index) => (
                <motion.div
                  key={question}
                  className="w-full"
                  variants={fadeUp}
                  initial="hidden"
                  animate={welcome.isInView ? "visible" : "hidden"}
                  custom={0.45 + index * 0.12}
                >
                  <div className="flex items-start gap-2 px-5 md:gap-3 md:px-8">
                    <span
                      className={`${nanumMyeongjo.className} type-lead shrink-0 text-[#1a2744]`}
                    >
                      &ldquo;
                    </span>
                    <div className="flex items-start gap-1 md:gap-2">
                      <p
                        className={`${nanumMyeongjo.className} type-lead pt-1 text-[#1a2744]`}
                      >
                        {question}
                      </p>
                      <span
                        className={`${nanumMyeongjo.className} type-lead shrink-0 pt-1 text-[#1a2744]`}
                      >
                        &rdquo;
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.blockquote
            className="mt-[10px] max-w-[412px] rounded-r-[12px] border-l-[3px] border-[#caa643] bg-gradient-to-r from-[#fffaf0] to-[rgba(252,251,248,0.2)] px-[28px] py-[30px]"
            variants={fadeUp}
            initial="hidden"
            animate={welcome.isInView ? "visible" : "hidden"}
            custom={0.9}
          >
            <div className={`${nanumMyeongjo.className} type-lead font-bold tracking-[0.01em] text-black`}>
              <p>그 질문이 여기까지 데려왔다면,</p>
              <p className="mt-1">잘 오셨습니다.</p>
            </div>
          </motion.blockquote>

          <motion.div
            className="max-w-[920px] type-lead tracking-[0.01em] text-black/88"
            variants={fadeUp}
            initial="hidden"
            animate={welcome.isInView ? "visible" : "hidden"}
            custom={1.05}
          >
            <p>
              대천침례교회는 1971년 3월, 가마니를 깔고 드린 작은 예배에서 시작되었습니다.
              바다 건너 미국 교회들의 사랑과 기도로 세워졌고, 그 받은 사랑을 나누며 선교하는
              교회로 55년을 걸어왔습니다. 기독교한국침례회의 정신 위에서, 앞서 섬기신
              목사님들과 성도님들의 눈물과 헌신 위에 지금 이 자리에 서 있습니다.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
