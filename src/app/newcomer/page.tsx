import SectionTitle from "@/components/section-title";
import { newcomerSteps } from "@/lib/site-data";

const kakao = process.env.NEXT_PUBLIC_KAKAO_URL ?? "#";

export default function NewcomerPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-10 md:space-y-10 md:px-6 md:pb-20 md:pt-12">
      <SectionTitle
        eyebrow="New Here"
        title="새가족 안내"
        description="더 제자교회는 처음 오신 분을 환영합니다. 아래 순서대로 함께 안내해드릴게요."
      />

      <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {newcomerSteps.map((step, idx) => (
          <li key={step} className="rounded-2xl border border-cedar/10 bg-white/80 p-5 md:p-6">
            <p className="text-xs font-semibold text-clay">STEP {idx + 1}</p>
            <p className="mt-2 text-lg font-semibold text-ink">{step}</p>
          </li>
        ))}
      </ol>

      <section className="rounded-2xl border border-clay/25 bg-clay/5 p-5 text-sm text-ink/80 md:p-6">
        <h3 className="text-xl font-semibold text-ink">등록 및 상담</h3>
        <p className="mt-2">카카오톡 오픈채팅으로 연락 주시면 예배 전후 안내를 도와드립니다.</p>
        <a
          href={kakao}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-clay px-4 py-2 text-sm font-semibold text-ivory transition hover:bg-cedar"
        >
          카카오톡으로 문의
        </a>
      </section>
    </div>
  );
}
