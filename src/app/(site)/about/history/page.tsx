import Image from "next/image";
import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import { redirectToCanonicalStaticPathIfNeeded } from "@/lib/canonical-menu-path";
import { createPageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "교회 연혁",
  description: `${SITE_NAME}가 1971년 첫 예배부터 이어 온 교회 역사와 선교의 발자취입니다.`,
  path: "/about/history",
});

/* ── 연혁 데이터 ─────────────────────────────────────────── */

interface HistoryItem {
  year: string;
  month: string;
  events: string[];
}

const historyData: HistoryItem[] = [
  {
    year: "1970",
    month: "",
    events: [
      "한미전도대회를 계기로 미국 갈보리침례교회와 올리베트침례교회가 개척 후원을 약속하고 대천리에 예배 공간을 마련",
    ],
  },
  {
    year: "1971",
    month: "03",
    events: [
      "28일 김성조 목사 가족과 성도들이 가마니를 깔고 첫 예배",
      "9월 6일 예배당 개축을 마치고 개척예배",
      "12월 23일 첫 침례식",
    ],
  },
  { year: "1973", month: "10", events: ["외부 재정 지원 없이 완전 자립"] },
  { year: "1974", month: "", events: ["주보 제1호 발행"] },
  { year: "1975", month: "", events: ["성문침례교회를 분립 개척", "여전도회 창립"] },
  { year: "1979", month: "", events: ["남전도회 창립"] },
  { year: "1980", month: "", events: ["청년회 창립"] },
  { year: "1983", month: "", events: ["교육관 신축", "장학회 설립"] },
  { year: "1985", month: "", events: ["보령어린이선교원 개원"] },
  { year: "1987", month: "", events: ["현 예배당 완공 및 입당"] },
  { year: "1990", month: "~ 2000", events: ["산돌, 부여중앙, 생명의삶, 지산, 갈마동, 벧엘, 새로남, 신흑동, 군산남부, 밝은침례교회 등 열두 교회 개척"] },
  { year: "1992", month: "", events: ["사랑의 초청잔치 개최, 연인원 4,000여 명 참석"] },
  { year: "1994", month: "", events: ["카자흐스탄 선교사 파송"] },
  { year: "1996", month: "", events: ["창립 25주년, 후원한 미국 교회 지도자들을 초청해 감사의 한미전도대회 개최"] },
  { year: "2001", month: "10", events: ["창립 30주년 기념예배"] },
  { year: "2004", month: "01", events: ["12일 김성조 목사 원로 추대", "제2대 조성훈 목사 취임"] },
  { year: "2026", month: "10", events: ["4일 제3대 이진욱 목사 부임", "10일 제3대 담임목사 취임식"] },
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
        {item.month ? <span className="mt-0.5 text-sm font-semibold text-cedar/60">{item.month}{/^\d+$/.test(item.month) ? "월" : ""}</span> : null}
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

export default async function HistoryPage() {
  await redirectToCanonicalStaticPathIfNeeded("about.history", "/about/history");

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

      {/* 현재의 사명을 잇는 메시지 */}
      <section className="relative z-10 -mt-8 overflow-hidden pt-8 md:-mt-12 md:pt-12">
        <div className="section-shell section-shell--narrow relative py-16 md:py-20 lg:py-24">
          <div className="flex justify-start">
            <div className="max-w-[34rem] space-y-5 text-left text-ink">
              <p className="type-label font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                Our Mission Continues
              </p>
              <h3 className="type-card-title font-bold leading-[1.24] text-ink">
                <span className="md:hidden">
                  선교로 세워진 교회,
                  <br />
                  받은 사랑을 다시 흘려보내는 교회가
                  <br />
                  되겠습니다.
                </span>
                <span className="hidden md:inline">
                  선교로 세워진 교회,
                  <br />
                  받은 사랑을 다시 흘려보내는 교회가 되겠습니다.
                </span>
              </h3>
              <p className="type-body text-ink/78">
                1971년 작은 예배로 시작한 대천침례교회는
                <br />
                앞선 세대의 기도와 헌신 위에서 복음을 전하고 제자를 세우며,
                <br />
                보령과 모든 민족을 섬기는 길을 계속 걸어갑니다.
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
