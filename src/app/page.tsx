import Image from "next/image";
import Link from "next/link";

import SectionTitle from "@/components/section-title";
import { newsPosts, sermons } from "@/lib/site-data";

export default function Home() {
  return (
    <div className="section-shell flex w-full flex-col gap-12 pb-16 pt-0 md:gap-16 md:pb-20 md:pt-0">
      <section className="relative left-1/2 w-[min(100vw,1480px)] -translate-x-1/2 overflow-hidden rounded-b-[2rem] shadow-[0_20px_46px_rgba(16,33,63,0.2)]">
        <div className="relative min-h-[430px] md:min-h-[560px]">
          <Image
            src="/images/sample2.jpg"
            alt="더 제자교회 메인 히어로 이미지"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/52 to-ink/18" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-transparent" />

          <div className="relative z-10 flex min-h-[430px] items-end pb-8 pt-24 md:min-h-[560px] md:pb-10 md:pt-28">
            <div className="section-shell w-full">
              <div className="max-w-xl space-y-4 rounded-2xl bg-black/30 px-4 py-5 text-ivory backdrop-blur-[2px] md:space-y-5 md:px-5 md:py-6">
                <p className="chip w-fit bg-gold/30 text-ivory">VISION</p>
                <h1 className="font-serif text-4xl leading-[1.18] md:text-6xl">
                  성령으로
                  <br />
                  제자삼는 교회
                </h1>
                <p className="text-sm font-medium leading-relaxed text-ivory/90 md:text-base">
                  예수께서 나아와 말씀하여 이르시되 하늘과 땅의 모든 권세를 내게 주셨으니
                  <br />
                  너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 세례를 베풀고
                  <br />
                  내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라
                  <br />
                  볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라
                </p>
                <p className="text-sm font-semibold tracking-wide text-white">마태복음 28:18-20</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
