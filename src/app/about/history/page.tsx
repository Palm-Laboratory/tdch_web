import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "교회 연혁 | The 제자교회",
  description:
    "The 제자교회의 교회 연혁을 확인하세요. 2026년 1월 개척을 시작으로 함께 써 내려갈 이야기.",
};

/* ── 연혁 데이터 ─────────────────────────────────────────── */

interface HistoryItem {
  year: string;
  month: string;
  events: string[];
}

const historyData: HistoryItem[] = [
  {
    year: "2026",
    month: "01",
    events: [
      "The 제자교회 개척 예배 (수원시 인계동)",
      "이진욱 목사 부임 · 첫 주일예배 시작",
    ],
  },
];

/* ── 컴포넌트 ────────────────────────────────────────────── */

function TimelineItem({ item }: { item: HistoryItem }) {
  return (
    <div className="group relative flex gap-6 md:gap-10">
      {/* 왼쪽: 연도·월 */}
      <div className="relative flex w-24 shrink-0 flex-col items-end pt-1 md:w-32">
        <span className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
          {item.year}
        </span>
        <span className="mt-0.5 text-sm font-semibold text-cedar/60">
          {item.month}월
        </span>
      </div>

      {/* 타임라인 선 & 도트 */}
      <div className="relative flex flex-col items-center">
        <span className="z-10 mt-2 h-3.5 w-3.5 rounded-full border-[3px] border-themeBlue bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.15)]" />
        <span className="absolute top-5 bottom-0 w-px bg-gradient-to-b from-themeBlue/40 to-cedar/10" />
      </div>

      {/* 오른쪽: 상세 이벤트 */}
      <div className="pb-14 pt-0.5">
        <ul className="space-y-2">
          {item.events.map((evt) => (
            <li key={evt} className="flex items-start gap-2.5">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-themeBlue/60" />
              <span className="type-body font-medium leading-relaxed text-ink/85">
                {evt}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <div className="section-shell space-y-14 pt-10 md:pt-16 pb-20">
      {/* 페이지 제목 */}
      <section>
        <div className="mb-10 md:mb-14">
          <p className="type-label mb-2 font-semibold uppercase tracking-[0.2em] text-cedar/70">
            Church History
          </p>
          <h2 className="type-page-title font-bold tracking-[-0.03em] text-ink">
            교회 연혁
          </h2>
        </div>

        {/* 타임라인 */}
        <div className="pl-2 md:pl-4">
          {historyData.map((item) => (
            <TimelineItem key={`${item.year}-${item.month}`} item={item} />
          ))}
        </div>
      </section>

      {/* 미래를 기대하는 메시지 */}
      <section className="relative overflow-hidden rounded-2xl border border-cedar/10 bg-gradient-to-br from-[#f8faff] to-[#eef3fb] px-8 py-12 shadow-[0_8px_32px_rgba(16,33,63,0.06)] md:px-14 md:py-16">
        {/* 배경 장식 */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-themeBlue/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-themeBlue/5 blur-3xl" />

        <div className="relative space-y-5 text-center">
          <p className="type-label font-semibold uppercase tracking-[0.2em] text-themeBlue/70">
            The Story Continues
          </p>
          <h3 className="text-xl font-bold leading-snug text-ink md:text-2xl">
            아직 쓰이지 않은 이야기,
            <br className="hidden sm:block" />
            함께 채워갈 은혜의 페이지가 기다리고 있습니다.
          </h3>
          <p className="mx-auto max-w-lg type-body leading-relaxed text-ink/65">
            2026년 1월, 수원 인계동에 작은 씨앗 하나가 심겨졌습니다.
            <br />
            이곳에서 더 많은 제자가 세워지고, 더 깊은 예배가 드려지며,
            <br className="hidden md:block" />
            더 넓은 사랑이 흘러가는 역사를 함께 써 내려가길 소망합니다.
          </p>
          <p className="pt-2 text-sm font-medium italic text-cedar/50">
            "여호와께서 시온을 위하여 큰 일을 행하셨도다" — 시편 126:3
          </p>
        </div>
      </section>
    </div>
  );
}
