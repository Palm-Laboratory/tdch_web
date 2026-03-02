import Link from "next/link";

import SectionTitle from "@/components/section-title";
import { newsPosts, sermons } from "@/lib/site-data";

export default function Home() {
  return (
    <div className="section-shell flex w-full flex-col gap-12 pb-16 pt-10 md:gap-16 md:pb-20 md:pt-12">
      <section className="space-y-5 md:space-y-6">
        <SectionTitle eyebrow="Sermons" title="최근 말씀" />
        <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon) => (
            <article key={sermon.title} className="surface-card rounded-2xl p-5 md:p-6">
              <p className="text-xs text-ink/50">{sermon.date}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{sermon.title}</h3>
              <p className="mt-1 text-sm text-cedar">{sermon.pastor}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{sermon.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5 md:space-y-6">
        <SectionTitle eyebrow="News" title="이번 주 교회 소식" />
        <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newsPosts.map((post) => (
            <article key={post.title} className="surface-card rounded-2xl p-5 md:p-6">
              <span className="chip bg-moss/10 text-moss">{post.category}</span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{post.title}</h3>
              <p className="mt-1 text-xs text-ink/50">{post.date}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{post.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card-strong rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="chip bg-clay/12 text-clay">First Visit</p>
            <h2 className="font-serif text-2xl text-ink md:text-3xl">처음 오셨나요?</h2>
            <p className="text-sm leading-relaxed text-ink/70 md:text-base">
              예배 전에 연락 주시면 좌석 안내와 새가족 안내를 도와드립니다.
            </p>
          </div>
          <Link
            href="/newcomer"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-cedar px-6 py-3 text-sm font-semibold text-ivory transition hover:bg-ink"
          >
            새가족 안내 페이지로
          </Link>
        </div>
      </section>
    </div>
  );
}
