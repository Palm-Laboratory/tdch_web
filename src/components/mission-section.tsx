"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
    const { ref: imageRef, inView: imageInView } = useInView(0.15);

    return (
        <div className="relative z-10 section-shell pb-28 pt-10 md:pb-32 md:pt-12">
            {/* 환영 문구 */}
            <section className="px-2 py-2 text-center" ref={headingRef}>
                <h2
                    className="font-serif text-3xl font-bold leading-tight text-ink md:text-5xl"
                    style={{
                        opacity: headingInView ? 1 : 0,
                        transform: headingInView ? "translateY(0)" : "translateY(28px)",
                        transition: "opacity 0.8s ease, transform 0.8s ease",
                    }}
                >
                    The 제자교회에 오신 것을 환영합니다
                </h2>
            </section>

            {/* 교회 사명 섹션 */}
            <section ref={imageRef}>
                {/* 사명 이미지 전체 감싸는 컨테이너 */}
                <div
                    className="mx-auto w-full max-w-[800px]"
                    style={{
                        opacity: imageInView ? 1 : 0,
                        transform: imageInView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
                        transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
                    }}
                >
                    <Image
                        src="/images/mission.png"
                        alt="The 제자교회 사명 - 다음 세대 자녀 양육, 다문화 가족 지원, 다민족 선교"
                        width={800}
                        height={600}
                        className="h-auto w-full object-contain"
                    />
                </div>
            </section>
        </div>
    );
}
