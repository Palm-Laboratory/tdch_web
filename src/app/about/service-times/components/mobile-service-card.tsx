interface MobileServiceCardProps {
  title: string;
  schedule: string;
  location: string;
}

export default function MobileServiceCard({
  title,
  schedule,
  location,
}: MobileServiceCardProps) {
  return (
    <article className="rounded-[20px] border border-cedar/10 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(16,33,63,0.06)]">
      <h3 className="type-card-title font-bold text-ink">{title}</h3>
      <dl className="type-body-small mt-4 space-y-3">
        <div className="flex items-start justify-between gap-4 border-b border-cedar/10 pb-3">
          <dt className="shrink-0 font-semibold text-cedar/70">시간</dt>
          <dd className="text-right font-medium text-ink/80">{schedule}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="shrink-0 font-semibold text-cedar/70">장소</dt>
          <dd className="text-right font-medium text-ink/80">{location}</dd>
        </div>
      </dl>
    </article>
  );
}
