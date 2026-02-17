import Link from "next/link";

import SectionTitle from "@/components/section-title";
import { newsPosts, serviceTimes, sermons } from "@/lib/site-data";

const youtube = process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "#";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16 pt-10 md:gap-16 md:px-6 md:pb-20 md:pt-12">
      <section className="fade-up rounded-3xl border border-cedar/10 bg-ivory/80 p-6 shadow-soft md:p-10 lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">The Disciple Church</p>
        <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2rem,6vw,3.4rem)] leading-tight text-ink">
          작은 시작이지만, 복음으로 도시를 섬기는
          <br />
          더 제자교회입니다.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink/70 md:text-base">
          누구나 편하게 오실 수 있는 교회가 되겠습니다. 주일 예배와 새가족 안내를 확인하고 함께
          예배해 주세요.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/newcomer"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-clay px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-cedar sm:w-auto"
          >
            새가족 등록하기
          </Link>
          <a
            href={youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-cedar/25 px-5 py-3 text-sm font-semibold text-cedar transition hover:border-clay hover:text-clay sm:w-auto"
          >
            예배 영상 보기
          </a>
        </div>
      </section>

      <section className="space-y-5 md:space-y-6">
        <SectionTitle
          eyebrow="Worship Times"
          title="예배 시간 안내"
          description="개척 초기에는 상황에 따라 예배 시간이 변동될 수 있어, 매주 공지를 함께 확인해 주세요."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {serviceTimes.map((item) => (
            <article key={item.title} className="rounded-2xl border border-cedar/10 bg-white/70 p-5 md:p-6">
              <h3 className="text-sm font-semibold text-cedar/80">{item.title}</h3>
              <p className="mt-2 text-lg font-semibold text-ink">{item.time}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5 md:space-y-6">
        <SectionTitle eyebrow="Sermons" title="최근 말씀" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon) => (
            <article key={sermon.title} className="rounded-2xl border border-cedar/10 bg-white/80 p-5 md:p-6">
              <p className="text-xs text-ink/50">{sermon.date}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{sermon.title}</h3>
              <p className="mt-1 text-sm text-cedar">{sermon.pastor}</p>
              <p className="mt-3 text-sm text-ink/70">{sermon.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5 md:space-y-6">
        <SectionTitle eyebrow="News" title="이번 주 교회 소식" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newsPosts.map((post) => (
            <article key={post.title} className="rounded-2xl border border-cedar/10 bg-white/75 p-5 md:p-6">
              <span className="inline-flex rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold text-moss">
                {post.category}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{post.title}</h3>
              <p className="mt-1 text-xs text-ink/50">{post.date}</p>
              <p className="mt-3 text-sm text-ink/70">{post.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
