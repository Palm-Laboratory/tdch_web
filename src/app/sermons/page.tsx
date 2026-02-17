import SectionTitle from "@/components/section-title";
import { sermons } from "@/lib/site-data";

export default function SermonsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-10 md:space-y-10 md:px-6 md:pb-20 md:pt-12">
      <SectionTitle
        eyebrow="Sermons"
        title="말씀 / 설교"
        description="주일 설교 요약과 다시보기 링크를 매주 업데이트합니다."
      />

      <div className="space-y-4 md:space-y-5">
        {sermons.map((sermon) => (
          <article key={sermon.title} className="rounded-2xl border border-cedar/10 bg-white/80 p-5 md:p-6">
            <p className="text-xs text-ink/50">{sermon.date}</p>
            <h3 className="mt-2 text-xl font-semibold text-ink">{sermon.title}</h3>
            <p className="mt-2 text-sm text-cedar">{sermon.pastor}</p>
            <p className="mt-3 text-sm text-ink/75">{sermon.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
