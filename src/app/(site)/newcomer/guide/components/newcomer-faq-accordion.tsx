"use client";

import { useState } from "react";

export interface NewcomerFaqItem {
  question: string;
  answer: string | readonly string[];
}

interface NewcomerFaqAccordionProps {
  items: readonly NewcomerFaqItem[];
  initiallyOpenIndices?: readonly number[];
}

export default function NewcomerFaqAccordion({
  items,
  initiallyOpenIndices = [],
}: NewcomerFaqAccordionProps) {
  const [openItems, setOpenItems] = useState(() => new Set(initiallyOpenIndices));

  return (
    <div className="border-t border-[#e8e1d5]">
      {items.map((item, index) => {
        const isOpen = openItems.has(index);

        return (
          <article key={item.question} className="border-b border-[#e8e1d5] bg-white">
            <button
              type="button"
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left md:min-h-[5.1rem] md:py-5"
              onClick={() => {
                setOpenItems((current) => {
                  const next = new Set(current);
                  if (next.has(index)) {
                    next.delete(index);
                  } else {
                    next.add(index);
                  }
                  return next;
                });
              }}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <span className="shrink-0 text-[14px] font-normal leading-[1.34] text-[#c9a84c]">
                  Q.
                </span>
                <h3 className="type-card-title font-medium leading-[1.34] tracking-[-0.03em] text-ink md:type-block-title">
                  {item.question}
                </h3>
              </div>
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 shrink-0 items-center justify-center type-subsection-title leading-none ${isOpen ? "text-[#7a7060]" : "text-[#c9a84c]"}`}
              >
                {isOpen ? "×" : "+"}
              </span>
            </button>

            {isOpen ? (
              <div className="pb-5 pr-10 md:pb-6">
                <ul className="flex flex-col gap-2">
                  {(Array.isArray(item.answer) ? item.answer : [item.answer]).map((answerLine) => (
                    <li key={answerLine} className="flex items-start gap-2 md:gap-3">
                      <span className="shrink-0 text-[14px] font-normal leading-[1.7] text-[#c9a84c]">
                        A.
                      </span>
                      <span className="type-body whitespace-pre-wrap leading-[1.7] tracking-[0.02em] text-[#7a7060]">
                        {answerLine}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
