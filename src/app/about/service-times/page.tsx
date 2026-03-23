import type { Metadata } from "next";
import { serviceTimes } from "@/lib/site-data";
import MobileServiceCard from "./components/mobile-service-card";
import SectionHeading from "./components/section-heading";
import ServiceNotice from "./components/service-notice";
import ServiceTimesTable from "./components/service-times-table";

export const metadata: Metadata = {
  title: "예배 시간 안내 | The 제자교회",
  description:
    "The 제자교회 주일예배, 수요예배, 새벽기도회, 금요기도회 등 예배 시간 안내 및 특별 예배 일정을 확인하세요.",
};

function formatSchedule(day: string, time: string, ampm: string) {
  const period = ampm === "AM" ? "오전" : "오후";
  return `${day} ${period} ${time}`;
}

export default function ServiceTimesPage() {
  const serviceRows = serviceTimes.map((service) => ({
    title: service.name,
    schedule: formatSchedule(service.day, service.time, service.ampm),
    location: service.location,
  }));
  const mainLocationRows = serviceRows.filter(
    (service) => service.location === "나인아트홀(지하1층)"
  );
  const otherLocationRows = serviceRows.filter(
    (service) => service.location !== "나인아트홀(지하1층)"
  );
  const noticeItems = [
    "모든 주일 예배는 온라인 송출을 병행합니다.",
    "예배시간 10분 전에 오셔서 예배를 준비해주세요.",
  ];

  return (
    <div className="section-shell section-shell--narrow space-y-14 pt-10 md:pt-16 pb-20">
      <section>
        <SectionHeading title="예배 시간 안내" subtitle="Service Times" as="h1" />

        <div className="space-y-4 md:hidden">
          {serviceRows.map((service) => (
            <MobileServiceCard
              key={service.title}
              title={service.title}
              schedule={service.schedule}
              location={service.location}
            />
          ))}
        </div>

        <ServiceTimesTable
          mainLocationRows={mainLocationRows}
          otherLocationRows={otherLocationRows}
        />

        <div className="mt-10 px-5 md:px-0">
          <SectionHeading title="안내" subtitle="Notice" />
          <ServiceNotice items={noticeItems} />
        </div>
      </section>
    </div>
  );
}
