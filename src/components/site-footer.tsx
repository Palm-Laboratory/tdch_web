const phone = process.env.NEXT_PUBLIC_CHURCH_PHONE ?? "010-5252-8580";
const email = process.env.NEXT_PUBLIC_CHURCH_EMAIL ?? "hello@thedisciples.church";
const address =
  process.env.NEXT_PUBLIC_CHURCH_ADDRESS ?? "경기도 수원시 팔달구 경수대로425 지하1층, 더 제자교회";
const youtube =
  process.env.NEXT_PUBLIC_YOUTUBE_URL ??
  "https://www.youtube.com/@%EB%8D%94%EC%A0%9C%EC%9E%90%EA%B5%90%ED%9A%8C";
const kakao = process.env.NEXT_PUBLIC_KAKAO_URL ?? "https://open.kakao.com/o/yourlink";

export default function SiteFooter() {
  return (
    <footer className="border-t border-cedar/20 bg-cedar py-10 text-ivory/80 md:py-12">
      <div className="section-shell grid gap-7 text-sm lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-3">
          <p className="font-serif text-2xl text-ivory">더 제자교회</p>
          <p className="max-w-sm leading-relaxed">성령으로 제자삼는 교회</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center rounded-full border border-ivory/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ivory transition hover:bg-ivory/10"
            >
              Youtube
            </a>
            <a
              href={kakao}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center rounded-full border border-ivory/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ivory transition hover:bg-ivory/10"
            >
              Kakao
            </a>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ivory/60">Contact</p>
          <p>{address}</p>
          <p>{phone}</p>
          <p>{email}</p>
        </div>
      </div>
      <div className="section-shell mt-6 border-t border-ivory/15 pt-4 text-xs text-ivory/65">
        <a
          href="https://lordicon.com/"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-ivory/30 underline-offset-2 transition hover:text-ivory"
        >
          Animated icons by Lordicon.com
        </a>
      </div>
    </footer>
  );
}
