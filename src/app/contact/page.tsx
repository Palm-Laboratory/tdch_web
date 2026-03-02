import SectionTitle from "@/components/section-title";

const phone = process.env.NEXT_PUBLIC_CHURCH_PHONE ?? "010-0000-0000";
const email = process.env.NEXT_PUBLIC_CHURCH_EMAIL ?? "hello@thedisciples.church";
const address =
  process.env.NEXT_PUBLIC_CHURCH_ADDRESS ?? "서울시 OO구 OO로 00, 더 제자교회";
const naverMap = process.env.NEXT_PUBLIC_NAVER_MAP_URL ?? "https://map.naver.com";

export default function ContactPage() {
  return (
    <div className="section-shell space-y-8 pb-16 pt-10 md:space-y-10 md:pb-20 md:pt-12">
      <SectionTitle
        eyebrow="Contact"
        title="오시는 길 / 문의"
        description="예배 장소, 연락처, 길 안내를 확인하실 수 있습니다."
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <article className="surface-card rounded-2xl p-5 md:p-6">
          <p className="chip bg-clay/12 text-clay">Address</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">{address}</p>
        </article>

        <article className="surface-card rounded-2xl p-5 md:p-6">
          <p className="chip bg-clay/12 text-clay">Phone</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">{phone}</p>
        </article>

        <article className="surface-card rounded-2xl p-5 md:p-6">
          <p className="chip bg-clay/12 text-clay">Email</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">{email}</p>
        </article>
      </section>

      <section className="surface-card-strong rounded-3xl p-6 md:p-7">
        <p className="text-sm leading-relaxed text-ink/75 md:text-base">
          대중교통과 주차 안내는 교회소식 공지에서 매주 업데이트됩니다.
        </p>
        <a
          href={naverMap}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-cedar px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-ink"
        >
          네이버 지도 열기
        </a>
      </section>
    </div>
  );
}
