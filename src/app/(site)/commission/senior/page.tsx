import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import ScriptureQuoteCard from "@/components/scripture-quote-card";
import { redirectToCanonicalStaticPathIfNeeded } from "@/lib/canonical-menu-path";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "지상명령 시니어",
  description: "대천침례교회 시니어 사역과 믿음의 유산을 이어 가는 참여 방법을 소개합니다.",
  path: "/commission/senior",
});

const goals = [
  { number: "01", english: "Honor", title: "존귀", description: "어르신의 삶과 신앙을 귀하게 여기고 예배와 교제의 중심에 모십니다." },
  { number: "02", english: "Care", title: "돌봄", description: "외로움과 건강, 일상의 어려움을 함께 살피며 혼자가 아님을 느끼도록 곁에 있습니다." },
  { number: "03", english: "Legacy", title: "유산", description: "어르신의 간증과 기도가 자녀와 손주 세대에게 이어지도록 믿음의 이야기를 나눕니다." },
] as const;

const gatheringItems = [
  "예배와 새벽기도회 — 교회의 기도 기둥으로 함께합니다",
  "어르신 교제 모임 — 식사와 나눔, 찬양과 말씀",
  "믿음의 이야기 — 평생의 신앙 간증을 나누고 기록합니다",
  "중보기도 동역 — 교회와 다음세대, 선교사님을 위한 기도",
] as const;

const generationItems = [
  "다음세대 멘토링 — 청소년과 청년에게 삶의 지혜와 기도를 전합니다",
  "다문화 가정의 이웃 — 낯선 땅에서 살아가는 가정에 \"교회의 할머니·할아버지\"가 되어 주세요",
] as const;

export default async function CommissionSeniorPage() {
  await redirectToCanonicalStaticPathIfNeeded("commission.senior", "/commission/senior");

  return (
    <main className="section-shell section-shell--narrow pb-20 pt-10 md:pb-24 md:pt-16">
      <section aria-labelledby="commission-senior-title">
        <SectionHeading id="commission-senior-title" label="Senior" title="시니어" />
        <p className="mt-6 type-lead font-semibold text-ink">믿음의 유산을 이어가는 교회</p>
        <ScriptureQuoteCard quote="백발은 영화의 면류관이라 공의로운 길에서 얻으리라" reference="잠언 16:31" className="mt-6" />
      </section>

      <section className="mt-20 md:mt-[68px]" aria-labelledby="senior-goals-title">
        <SectionHeading id="senior-goals-title" label="Vision" title="시니어 사역의 3대 목표" />
        <p className="mt-5 max-w-[780px] type-body leading-[1.8] text-ink/76">
          평생 믿음으로 살아오신 어르신들은 교회의 뿌리입니다. 대천침례교회는 어르신들을 돌봄의 대상으로만 보지 않고, 교회를 세워 온 믿음의 선배로 존귀하게 모십니다.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {goals.map((goal) => (
            <article key={goal.number} className="rounded-[16px] border border-cedar/12 bg-[#f8fbff] p-6 md:p-7">
              <p className="type-label font-semibold uppercase tracking-[0.18em] text-gold">{goal.number} {goal.english}</p>
              <h3 className="mt-4 type-card-title font-bold text-ink">{goal.title}</h3>
              <p className="mt-3 type-body-small leading-[1.75] text-ink/68">{goal.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 md:mt-[68px]" aria-labelledby="senior-gatherings-title">
        <SectionHeading id="senior-gatherings-title" label="Together" title="함께하는 시간" />
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {gatheringItems.map((item) => <li key={item} className="rounded-[12px] border border-black/10 px-6 py-5 type-body font-medium text-ink">{item}</li>)}
        </ul>
      </section>

      <section className="mt-20 md:mt-[68px]" aria-labelledby="senior-generations-title">
        <SectionHeading id="senior-generations-title" label="Generations" title="세대를 잇는 일" />
        <ul className="mt-8 space-y-3 border-y border-cedar/15 py-5">
          {generationItems.map((item) => <li key={item} className="type-body flex items-start gap-3 text-ink/78"><span className="text-gold">·</span><span>{item}</span></li>)}
        </ul>
      </section>

      <section className="mt-20 rounded-[16px] bg-ink px-7 py-9 text-white md:mt-[68px] md:flex md:items-center md:justify-between md:px-10">
        <div>
          <p className="type-label font-semibold uppercase tracking-[0.18em] text-gold">Participate</p>
          <h2 className="mt-3 type-subsection-title font-bold">함께 섬겨 주세요</h2>
          <p className="mt-4 type-body text-white/68">기도 동역 · 간증과 이야기 나눔 · 심방 동행 · 다음 세대 멘토</p>
        </div>
      </section>
    </main>
  );
}
