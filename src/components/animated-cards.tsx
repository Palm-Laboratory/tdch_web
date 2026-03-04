"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface QuickInfoCard {
    href: string;
    title: string;
    enTitle: string;
    description: string;
}

interface AnimatedCardsProps {
    cards: QuickInfoCard[];
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
            className="relative z-20 -mt-[6rem] grid gap-4 md:-mt-[6.5rem] md:grid-cols-2 xl:grid-cols-4"
        >
            {cards.map((card, index) => {
                const isColored = index % 2 === 1;
                return (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="group rounded-3xl border border-cedar/12 p-5 shadow-[0_12px_28px_rgba(16,33,63,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(16,33,63,0.16)]"
                        style={{
                            backgroundColor: isColored ? "#6b83b0" : "#ffffff",
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0)" : "translateY(4rem)",
                            transition: `opacity 0.5s ease, transform 0.5s ease`,
                            transitionDelay: `${index * 120}ms`,
                        }}
                    >
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
                        <p
                            className={`mt-3 text-sm leading-relaxed ${isColored ? "text-white/80" : "text-ink/72"
                                }`}
                        >
                            {card.description}
                        </p>
                    </Link>
                );
            })}
        </section>
    );
}
