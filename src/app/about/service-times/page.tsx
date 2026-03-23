import type { Metadata } from "next";
import { serviceTimes } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "예배 시간 안내 | The 제자교회",
  description:
    "The 제자교회 주일예배, 수요예배, 새벽기도회, 금요기도회 등 예배 시간 안내 및 특별 예배 일정을 확인하세요.",
};

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5">
      <p className="type-label mb-2 font-semibold uppercase tracking-[0.2em] text-cedar/70">
        {subtitle}
      </p>
      <h2 className="type-section-title font-bold text-ink">{title}</h2>
    </div>
  );
}

function formatSchedule(day: string, time: string, ampm: string) {
  const period = ampm === "AM" ? "오전" : "오후";
  return `${day} ${period} ${time}`;
}

function MobileServiceCard({
  title,
  schedule,
  location,
}: {
  title: string;
  schedule: string;
  location: string;
}) {
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

export default function ServiceTimesPage() {
  const mainLocationServices = serviceTimes.filter(
    (svc) => svc.location === "나인아트홀(지하1층)"
  );
  const otherLocationServices = serviceTimes.filter(
    (svc) => svc.location !== "나인아트홀(지하1층)"
  );

  return (
    <div className="section-shell section-shell--narrow space-y-14 pt-10 md:pt-16 pb-20">
      <section>
        <div className="mb-8">
          <p className="type-label mb-2 font-semibold uppercase tracking-[0.2em] text-cedar/70">
            Service Times
          </p>
          <h2 className="type-section-title font-bold tracking-[-0.03em] text-ink">
            예배 시간 안내
          </h2>
        </div>

        <div className="space-y-4 md:hidden">
          {serviceTimes.map((svc) => (
            <MobileServiceCard
              key={svc.name}
              title={svc.name}
              schedule={formatSchedule(svc.day, svc.time, svc.ampm)}
              location={svc.location}
            />
          ))}
        </div>

        <div className="hidden overflow-x-auto border-x border-b border-t-[3px] border-cedar/15 border-t-ink/90 bg-white md:block">
          <table className="w-full min-w-[680px] table-fixed border-collapse text-left lg:min-w-[760px]">
            <thead>
              <tr className="border-b border-cedar/15 bg-[#fafcff]">
                <th className="type-label w-[38%] border-r border-cedar/15 px-4 py-4 text-center font-semibold tracking-[0.08em] text-ink/72 lg:px-6 lg:py-5">
                  구분
                </th>
                <th className="type-label w-[37%] border-r border-cedar/15 px-4 py-4 text-center font-semibold tracking-[0.08em] text-ink/72 lg:px-6 lg:py-5">
                  시간
                </th>
                <th className="type-label w-[25%] px-4 py-4 text-center font-semibold tracking-[0.08em] text-ink/72 lg:px-6 lg:py-5">
                  장소
                </th>
              </tr>
            </thead>
            <tbody>
              {mainLocationServices.map((svc, index) => (
                <tr key={svc.name} className="border-b border-cedar/15 last:border-b-0">
                  <td className="type-body-strong border-r border-cedar/15 px-4 py-5 text-center font-bold text-ink lg:px-6 lg:py-6">
                    {svc.name}
                  </td>
                  <td className="type-body border-r border-cedar/15 px-4 py-5 text-center font-medium text-ink/80 lg:px-6 lg:py-6">
                    {formatSchedule(svc.day, svc.time, svc.ampm)}
                  </td>
                  {index === 0 ? (
                    <td
                      rowSpan={mainLocationServices.length}
                      className="type-body px-4 py-5 text-center align-middle font-medium text-ink/80 lg:px-6 lg:py-6"
                    >
                      나인아트홀(지하1층)
                    </td>
                  ) : null}
                </tr>
              ))}
              {otherLocationServices.map((svc) => (
                <tr key={svc.name} className="border-b border-cedar/15 last:border-b-0">
                  <td className="type-body-strong border-r border-cedar/15 px-4 py-5 text-center font-bold text-ink lg:px-6 lg:py-6">
                    {svc.name}
                  </td>
                  <td className="type-body border-r border-cedar/15 px-4 py-5 text-center font-medium text-ink/80 lg:px-6 lg:py-6">
                    {formatSchedule(svc.day, svc.time, svc.ampm)}
                  </td>
                  <td className="type-body px-4 py-5 text-center align-middle font-medium text-ink/80 lg:px-6 lg:py-6">
                    {svc.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 px-5 md:px-0">
          <SectionHeading title="안내" subtitle="Notice" />
          <ul className="type-body space-y-3 text-ink/75">
            <li className="flex gap-3">
              <span className="mt-[11px] h-2 w-2 shrink-0 rounded-full bg-themeBlue" />
              <span>모든 주일 예배는 온라인 송출을 병행합니다.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-[11px] h-2 w-2 shrink-0 rounded-full bg-themeBlue" />
              <span>예배시간 10분 전에 오셔서 예배를 준비해주세요.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
