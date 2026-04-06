import type { MediaListResponse } from "@/lib/media-api";
import ShortsInfiniteGrid from "@/app/(site)/sermons/components/shorts-infinite-grid";

interface ShortsArchivePageProps {
  response: MediaListResponse | null;
}

export default function ShortsArchivePage({ response }: ShortsArchivePageProps) {
  const items = response?.items ?? [];

  if (items.length === 0) {
    return (
      <section className="rounded-[24px] px-6 py-12">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-cedar/60">IT&apos;S OKAY</p>
        <h2 className="mt-3 text-[1.8rem] font-bold tracking-[-0.03em] text-ink">그래도 괜찮아</h2>
        <p className="mt-4 text-[1rem] leading-8 text-ink/68">
          백엔드 sync가 완료되면 이 페이지에서 쇼츠 목록을 확인할 수 있습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="section-shell section-shell--wide px-5 py-6 md:px-6 md:py-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-cedar/60">Shorts</p>
          <h2 className="mt-2 text-[1.45rem] font-bold tracking-[-0.03em] text-ink">그래도 괜찮아</h2>
        </div>
      </div>

      <ShortsInfiniteGrid
        initialItems={items}
        initialPage={response?.page ?? 0}
        totalPages={response?.totalPages ?? 0}
        pageSize={response?.size ?? 24}
      />
    </section>
  );
}
