"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { QuickMenuCard } from "@/lib/site-data";

interface AnimatedCardsProps {
    cards: QuickMenuCard[];
}

export default function AnimatedCards({ cards }: AnimatedCardsProps) {
    const ref = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={ref}
            className="relative z-20 -mt-[6rem] grid grid-cols-2 gap-4 md:-mt-[6.5rem] xl:grid-cols-4"
        >
            {cards.map((card, index) => {
                const isColored = index % 2 === 1;
                return (
                    <Link
                        key={card.title}
                        href={card.href}
                        className={`group rounded-3xl border border-cedar/12 p-5 shadow-[0_12px_28px_rgba(16,33,63,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(16,33,63,0.16)] ${isColored
                            ? "bg-gradient-to-br from-[#13243a] via-[#1c2f48] to-[#0f1c2e]"
                            : "bg-white"
                            }`}
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0)" : "translateY(4rem)",
                            transition: `opacity 0.6s ease, transform 0.6s ease`,
                            transitionDelay: `${index * 200}ms`,
                        }}
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <p
                                    className={`text-xs font-semibold uppercase tracking-[0.14em] ${isColored ? "text-white/70" : "text-cedar/70"
                                        }`}
                                >
                                    {card.enTitle}
                                </p>
                                <h2
                                    className={`mt-2 text-xl font-bold leading-tight ${isColored ? "text-white" : "text-ink"
                                        }`}
                                >
                                    {card.title}
                                </h2>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <div className="relative h-12 w-12 opacity-80 transition group-hover:opacity-100 group-hover:scale-110 duration-300">
                                    <Image
                                        src={card.imageName}
                                        alt={card.title}
                                        fill
                                        className={`object-contain ${isColored ? "brightness-0 invert" : "opacity-70"}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </section>
    );
}
