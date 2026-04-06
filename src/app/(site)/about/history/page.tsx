import Image from "next/image";
import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";

export const metadata: Metadata = {
  title: "교회 연혁",
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
  {
    year: "2026",
    month: "03",
    events: [
      "3일 기독교한국침례회 미추홀 지방회 가입",
      "26일 기독교한국침례회 가입",
      "제1회 전교인 공동체 모임 (제천수양관)",
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
    <div className="relative w-full overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="section-shell section-shell--narrow relative h-full">
          <div className="animate-image-fade-in-right absolute inset-y-0 left-[28%] right-0 hidden [mask-image:linear-gradient(to_right,transparent_0%,black_16%,black_88%,transparent_100%)] md:block md:left-[60%]">
            <div className="absolute inset-0 opacity-25 md:opacity-100">
              <Image
                src="/images/history/history_bg.jpg"
                alt="교회 연혁 배경 이미지"
                fill
                className="object-cover object-[center_24%] blur-[1.5px] md:blur-[1px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 페이지 제목 */}
      <section className="section-shell section-shell--narrow relative z-10 space-y-14 pb-20 pt-10 md:pt-16">
        <div className="mb-10 md:mb-14">
          <SectionHeading as="h1" label="Church History" title="교회 연혁" />
        </div>

        {/* 타임라인 */}
        <div className="pl-2 md:pl-4">
          {historyData.map((item) => (
            <TimelineItem key={`${item.year}-${item.month}`} item={item} />
          ))}
        </div>
      </section>

      {/* 미래를 기대하는 메시지 */}
      <section className="relative z-10 -mt-8 overflow-hidden pt-8 md:-mt-12 md:pt-12">
        <div className="section-shell section-shell--narrow relative py-16 md:py-20 lg:py-24">
          <div className="flex justify-start">
            <div className="max-w-[34rem] space-y-5 text-left text-ink">
              <p className="type-label font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                The Story Continues
              </p>
              <h3 className="type-card-title font-bold leading-[1.24] text-ink">
                <span className="md:hidden">
                  아직 쓰이지 않은 이야기,
                  <br />
                  함께 채워갈 은혜의 페이지가
                  <br />
                  기다리고 있습니다.
                </span>
                <span className="hidden md:inline">
                  아직 쓰이지 않은 이야기,
                  <br />
                  함께 채워갈 은혜의 페이지가 기다리고 있습니다.
                </span>
              </h3>
              <p className="type-body text-ink/78">
                2026년 1월, 수원 인계동에 작은 씨앗 하나가 심겨졌습니다.
                <br />
                이곳에서 더 많은 제자가 세워지고, 더 깊은 예배가 드려지며,
                <br />
                더 넓은 사랑이 흘러가는 역사를 함께 써 내려가길 소망합니다.
              </p>
              <p className="type-body-small pt-2 font-medium italic text-cedar/62">
                &quot;여호와께서 시온을 위하여 큰 일을 행하셨도다&quot; - 시편 126:3
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
