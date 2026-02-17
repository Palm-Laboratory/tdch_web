import SectionTitle from "@/components/section-title";

const phone = process.env.NEXT_PUBLIC_CHURCH_PHONE ?? "010-0000-0000";
const email = process.env.NEXT_PUBLIC_CHURCH_EMAIL ?? "hello@deojeja.church";
const address =
  process.env.NEXT_PUBLIC_CHURCH_ADDRESS ?? "서울시 OO구 OO로 00, 더 제자교회";
const naverMap = process.env.NEXT_PUBLIC_NAVER_MAP_URL ?? "https://map.naver.com";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-10 md:space-y-10 md:px-6 md:pb-20 md:pt-12">
      <SectionTitle eyebrow="Contact" title="오시는 길 / 문의" />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-cedar/10 bg-white/80 p-5 md:p-6">
          <h3 className="font-semibold text-ink">주소</h3>
          <p className="mt-2 text-sm text-ink/75">{address}</p>
        </article>

        <article className="rounded-2xl border border-cedar/10 bg-white/80 p-5 md:p-6">
          <h3 className="font-semibold text-ink">전화</h3>
          <p className="mt-2 text-sm text-ink/75">{phone}</p>
        </article>

        <article className="rounded-2xl border border-cedar/10 bg-white/80 p-5 md:p-6">
          <h3 className="font-semibold text-ink">이메일</h3>
          <p className="mt-2 text-sm text-ink/75">{email}</p>
        </article>
      </section>

      <a
        href={naverMap}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-cedar/30 px-5 py-3 text-sm font-semibold text-cedar transition hover:border-clay hover:text-clay"
      >
        네이버 지도 열기
      </a>
    </div>
  );
}
