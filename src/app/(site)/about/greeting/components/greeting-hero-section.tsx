"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import useScrollReveal from "./use-scroll-reveal";
import { nanumMyeongjo, originalSurfer } from "./shared";

export default function GreetingHeroSection() {
  const hero = useScrollReveal<HTMLElement>(0.4);

  return (
    <section
      ref={hero.ref}
      className="relative h-[420px] w-full overflow-hidden md:h-[520px]"
      data-section="hero"
    >
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
              className={`${originalSurfer.className} type-label uppercase tracking-[0.24em] text-white/80 md:tracking-[0.14em]`}
              initial={{ opacity: 0, y: 20 }}
              animate={hero.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              Pastor&apos;s Greeting
            </motion.p>
            <motion.h1
              className={`${nanumMyeongjo.className} type-page-title mt-4 font-extrabold tracking-[0.02em] md:mt-[18px]`}
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
  );
}
