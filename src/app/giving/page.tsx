import SectionTitle from "@/components/section-title";

const bank = process.env.NEXT_PUBLIC_GIVING_BANK ?? "국민은행 000-00-0000-000";
const owner = process.env.NEXT_PUBLIC_GIVING_OWNER ?? "더 제자교회";

export default function GivingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-10 md:space-y-10 md:px-6 md:pb-20 md:pt-12">
      <SectionTitle
        eyebrow="Giving"
        title="헌금 안내"
        description="온라인 헌금은 아래 계좌를 통해 가능합니다. 입금자명은 성함+헌금종류로 표기해 주세요."
      />

      <section className="rounded-2xl border border-cedar/10 bg-white/80 p-5 text-sm text-ink/80 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Account</p>
        <p className="mt-3 text-lg font-semibold text-ink">{bank}</p>
        <p className="mt-1">예금주: {owner}</p>
      </section>

      <section className="rounded-2xl border border-cedar/10 bg-white/70 p-5 text-sm text-ink/75 md:p-6">
        <h3 className="text-lg font-semibold text-ink">헌금 종류 표기 예시</h3>
        <p className="mt-2">주일헌금: 홍길동주일 / 감사헌금: 홍길동감사 / 선교헌금: 홍길동선교</p>
      </section>
    </div>
  );
}
