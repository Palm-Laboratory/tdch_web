import type { Metadata } from "next";
import ServiceTimeCard from "./components/service-time-card";
import ServiceNotice from "./components/service-notice";
import SpecialServiceTable from "./components/special-service-table";
import VisitorBanner from "./components/visitor-banner";
import {
  serviceTimes,
  serviceNotices,
  specialServices,
} from "@/lib/site-data";

export const metadata: Metadata = {
  title: "예배 시간 안내 | The 제자교회",
  description:
    "The 제자교회 주일예배, 수요예배, 새벽기도회, 금요기도회 등 예배 시간 안내 및 특별 예배 일정을 확인하세요.",
};

export default function ServiceTimesPage() {
  /* 주일 예배(1~3부) 와 주중 예배(새벽·수요·금요)로 분리 */
  const sundayServices = serviceTimes.filter((s) => s.day === "주일");
  const weekdayServices = serviceTimes.filter((s) => s.day !== "주일");

  return (
    <div className="section-shell space-y-14 pt-10 md:pt-16 pb-20">
      {/* ── 주일 예배 카드 (3열) ── */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sundayServices.map((svc) => (
          <ServiceTimeCard key={svc.name} data={svc} />
        ))}
      </section>

      {/* ── 주중 예배 카드 (3열) ── */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {weekdayServices.map((svc) => (
          <ServiceTimeCard key={svc.name} data={svc} />
        ))}
      </section>

      {/* ── 처음 방문 배너 ── */}
      <section>
        <VisitorBanner />
      </section>

      {/* ── 안내사항 ── */}
      <section>
        <ServiceNotice items={serviceNotices} />
      </section>

      {/* ── 특별 예배 일정 ── */}
      {/* <section>
        <h3 className="mb-5 text-2xl font-bold text-ink">특별 예배 일정</h3>
        <SpecialServiceTable services={specialServices} />
      </section> */}
    </div>
  );
}
