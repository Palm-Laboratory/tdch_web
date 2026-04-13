"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gowunBatang } from "@/lib/fonts";

const missionCards = [
    {
        englishLead: "T",
        englishRest: "EACHING",
        koreanTitle: "가르치는 사명",
        description: "강단에서 진리를 가르치셨고, 말씀으로 세상을 살아가는 힘을 주셨습니다.",
        tone: "light" as const,
    },
    {
        englishLead: "H",
        englishRest: "EALING",
        koreanTitle: "치유하는 사명",
        description: "부서진 사람 앞에서 무릎을 꿇으셨고, 사랑으로 그 마음을 회복시키셨습니다.",
        tone: "dark" as const,
    },
    {
        englishLead: "E",
        englishRest: "VANGELIZING",
        koreanTitle: "전파하는 사명",
        description: "아무도 찾지 않는 사람에게 먼저 찾아가셔서 삶으로 복음을 전하셨습니다.",
        tone: "light" as const,
    },
];

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, inView };
}

export default function MissionSection() {
    const { ref: headingRef, inView: headingInView } = useInView(0.3);
    const { ref: contentRef, inView: contentInView } = useInView(0.15);

    return (
        <div className="relative z-10 section-shell">
            <section className="hidden min-[1025px]:block px-2 py-2 text-center" ref={headingRef}>
                <h2
                    className={`${gowunBatang.className} text-[2rem] font-bold leading-[1.25] tracking-[0.02em] text-black md:text-[3rem] md:leading-[1.18]`}
                    style={{
                        opacity: headingInView ? 1 : 0,
                        transform: headingInView ? "translateY(0)" : "translateY(28px)",
                        transition: "opacity 0.8s ease, transform 0.8s ease",
                    }}
                >
                    The 제자교회에 오신 것을 환영합니다
                </h2>
            </section>

            <section className="pt-8 md:pt-10" ref={contentRef}>
                <div
                    className="mx-auto flex w-full max-w-[1020px] flex-col items-center"
                    style={{
                        opacity: contentInView ? 1 : 0,
                        transform: contentInView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
                        transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
                    }}
                >
                    <div className="w-full min-[1025px]:hidden">
                        <div className="mx-auto w-full max-w-[820px]">
                            <Image
                                src="/images/our_mission.png"
                                alt="The 제자교회 사명 - 가르치는 사명, 치유하는 사명, 전파하는 사명"
                                width={1000}
                                height={800}
                                className="h-auto w-full object-contain"
                                priority={false}
                            />
                        </div>
                    </div>

                    <div className="hidden w-full min-[1025px]:flex min-[1025px]:flex-col min-[1025px]:items-center">
                        <div className={`${gowunBatang.className} flex max-w-[820px] flex-col items-center text-center text-black`}>
                            <h3 className="type-section-title font-bold leading-none md:text-[2.9rem]">우리의 사명</h3>
                            <p className="mt-2 type-subsection-title leading-none">our mission</p>
                            <p className="mt-8 max-w-[820px] text-balance type-card-title leading-[1.75]">
                                The 제자교회는 예수님의 지상명령(마태복음 28:18-20)을 따라 세워진 선교적 교회입니다.
                                <br className="hidden md:block" />
                                우리는 복음을 전하고 제자를 세우기 위해 다음 세 가지 사명을 감당합니다.
                            </p>
                        </div>

                        <div className="mt-14 grid w-full max-w-[980px] gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
                            {missionCards.map((card) => {
                                const isDark = card.tone === "dark";

                                return (
                                    <article key={card.koreanTitle} className="flex flex-col items-center">
                                        <div
                                            className={`mission-chevron ${isDark ? "mission-chevron--dark" : ""} ${gowunBatang.className} flex min-h-[136px] w-full max-w-[290px] flex-col items-center justify-center px-8 text-center`}
                                        >
                                            <div className="flex items-end justify-center leading-none uppercase">
                                                <span className="type-page-title font-bold tracking-[0.03em]">{card.englishLead}</span>
                                                <span className="mb-[0.36rem] type-card-title tracking-[0.03em]">{card.englishRest}</span>
                                            </div>
                                            <p className="mt-2 text-[20px] md:text-[28px] mb-[16px] leading-none">{card.koreanTitle}</p>
                                        </div>

                                        <div
                                            className={`mission-copy-card ${isDark ? "mission-copy-card--dark" : ""} ${gowunBatang.className} mt-10 flex min-h-[144px] w-full max-w-[290px] items-center px-5 py-6 text-left type-lead leading-[1.55] md:px-6`}
                                        >
                                            <p>{card.description}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
