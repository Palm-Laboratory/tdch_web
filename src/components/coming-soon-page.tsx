interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  description: string;
}

export default function ComingSoonPage({
  title,
  subtitle,
  description,
}: ComingSoonPageProps) {
  return (
    <section className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-[32px] border border-cedar/10 bg-white shadow-[0_20px_60px_rgba(16,33,63,0.08)]">
        <div className="bg-[linear-gradient(135deg,rgba(19,36,58,0.96),rgba(38,84,124,0.88))] px-8 py-12 text-ivory md:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ivory/65">
            {subtitle}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ivory/78 md:text-base">
            {description}
          </p>
        </div>

        <div className="grid gap-5 px-8 py-10 md:grid-cols-[1.4fr_0.8fr] md:px-12 md:py-12">
          <div className="rounded-3xl border border-dashed border-themeBlue/20 bg-[#f8fafd] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-themeBlue/70">
              Coming Soon
            </p>
            <p className="mt-3 text-lg font-semibold text-ink">
              이 페이지는 현재 구현 예정입니다.
            </p>
            <p className="mt-2 text-sm leading-7 text-ink/65">
              준비가 완료되면 이 메뉴에서 관련 콘텐츠를 바로 확인하실 수 있도록 연결할 예정입니다.
            </p>
          </div>

          <div className="rounded-3xl border border-cedar/10 bg-white p-6">
            <p className="text-sm font-semibold text-ink">안내</p>
            <p className="mt-3 text-sm leading-7 text-ink/65">
              현재는 페이지 구성을 준비하고 있습니다. 추후 콘텐츠와 기능이 완성되면 이 위치에 반영됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
