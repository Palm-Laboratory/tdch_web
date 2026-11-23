import { Fragment } from "react";
import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import { redirectToCanonicalStaticPathIfNeeded } from "@/lib/canonical-menu-path";
import { createPageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";
import HistoryPhotoRail, { HistoryPhotoMobile } from "./history-photo-rail";

export const metadata: Metadata = createPageMetadata({
  title: "교회 연혁",
  description: `${SITE_NAME}가 1971년 첫 예배부터 이어 온 교회 역사와 선교의 발자취입니다.`,
  path: "/about/history",
});

/* ── 연혁 데이터 ─────────────────────────────────────────── */

interface HistoryItem {
  date: string;
  event: string;
}

const historyData: HistoryItem[] = [
  {
    date: "1970",
    event: "한미전도대회를 계기로 미국 갈보리침례교회·올리베트침례교회가 개척 후원을 약속, 대천리에 예배 공간 마련",
  },
  { date: "1971.3.28", event: "김성조 목사 가족과 성도들이 가마니를 깔고 첫 예배" },
  { date: "1971.9.6", event: "예배당 개축을 마치고 개척예배" },
  { date: "1971.12.23", event: "첫 침례식" },
  { date: "1972", event: "첫 서리집사 선출, 3개 구역 편성, 학생회 조직" },
  { date: "1973.10", event: "외부 재정 지원 없이 완전 자립" },
  { date: "1974", event: "주보 제1호 발행" },
  { date: "1975", event: "성문침례교회를 분립 개척 (1차 개척)" },
  { date: "1975~1980", event: "여전도회(1975)·남전도회(1979)·청년회(1980) 창립" },
  { date: "1983~1985", event: "교육관 신축(1983), 장학회 설립(1983), 보령어린이선교원 개원(1985)" },
  { date: "1987", event: "현 예배당 완공·입당" },
  { date: "1990~2000", event: "열두 교회 개척 (산돌, 부여중앙, 생명의삶, 지산, 갈마동, 벧엘, 새로남, 신흑동, 군산남부, 밝은침례교회 등)" },
  { date: "1992", event: "사랑의 초청잔치 (연인원 4,000여 명 참석)" },
  { date: "1994", event: "카자흐스탄 선교사 파송" },
  { date: "1996", event: "창립 25주년, 후원해 준 미국 교회 지도자들을 초청해 감사의 한미전도대회" },
  { date: "2001.10", event: "창립 30주년 기념예배" },
  { date: "2004.1.12", event: "김성조 목사 원로 추대, 제2대 조성훈 목사 취임" },
  { date: "2004 ~ 2026", event: "제2대 조성훈 목사 재임" },
  { date: "2026.10.4", event: "제3대 이진욱 목사 부임" },
  { date: "2026.10.10", event: "제3대 담임목사 취임식" },
];

/* ── 컴포넌트 ────────────────────────────────────────────── */

function TimelineItem({ item, index }: { item: HistoryItem; index: number }) {
  return (
    <article className="flex w-full flex-col gap-3" data-history-index={index}>
      <header className="flex w-full items-end gap-4 border-b border-cedar/15 pb-3 text-left sm:gap-6">
        <p className="type-section-title whitespace-nowrap font-bold leading-none tracking-[-0.03em] text-site-ink">
          {item.date}
        </p>
      </header>
      <div className="w-full">
        <ul>
          <li className="flex min-h-[48px] items-start gap-3 border-t border-cedar/8 py-3 first:border-t-0">
            <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-site-gold/75" />
            <span className="type-body-small font-medium leading-[1.75] tracking-[0.01em] text-site-ink/85">
              {item.event}
            </span>
          </li>
        </ul>
      </div>
    </article>
  );
}

export default async function HistoryPage() {
  await redirectToCanonicalStaticPathIfNeeded("about.history", "/about/history");

  return (
    <>
      <section className="section-shell section-shell--narrow space-y-12 pb-20 pt-10 md:space-y-16 md:pb-24 md:pt-16">
        <SectionHeading as="h1" label="Church History" title="교회 연혁" />
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:grid-cols-[minmax(0,560px)_minmax(300px,400px)]">
          <section id="church-history-timeline-track" aria-label="대천침례교회 연혁">
            <div className="flex flex-col gap-8 md:gap-10">
              {historyData.map((item, index) => (
                <Fragment key={item.date}>
                  <TimelineItem item={item} index={index} />
                  {index === 6 ? <HistoryPhotoMobile galleryIndex={0} /> : null}
                  {index === 13 ? <HistoryPhotoMobile galleryIndex={1} /> : null}
                  {index === 17 ? <HistoryPhotoMobile galleryIndex={2} /> : null}
                </Fragment>
              ))}
            </div>
          </section>
          <HistoryPhotoRail />
        </div>
      </section>

      <section className="section-shell section-shell--narrow pb-20 md:pb-24">
        <div className="w-full space-y-5 rounded-lg bg-site-ink px-6 py-10 text-left md:px-10 md:py-12">
          <p className="type-label font-semibold uppercase tracking-[0.2em] text-site-gold">
            Our Mission Continues
          </p>
          <h2 className="type-card-title font-bold leading-[1.4] text-white">
            선교로 세워진 교회,
            <br />
            받은 사랑을 다시 흘려보내는 교회가 되겠습니다.
          </h2>
          <p className="type-body-small leading-[1.8] text-white/85">
            1971년 작은 예배로 시작한 대천침례교회는
            <br className="hidden sm:block" />
            앞선 세대의 기도와 헌신 위에서 복음을 전하고 제자를 세우며,
            <br className="hidden sm:block" />
            보령과 모든 민족을 섬기는 길을 계속 걸어갑니다.
          </p>
          <p className="type-body-xsmall pt-1 font-medium italic text-white/65">
            &quot;여호와께서 시온을 위하여 큰 일을 행하셨도다&quot; - 시편 126:3
          </p>
        </div>
      </section>
    </>
  );
}
