import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import { serviceTimes } from "@/lib/site-data";
import { createPageMetadata } from "@/lib/seo";
import MobileServiceCard from "./components/mobile-service-card";
import ServiceNotice from "./components/service-notice";
import ServiceTimesTable from "./components/service-times-table";

export const metadata: Metadata = createPageMetadata({
  title: "예배 시간 안내",
  description:
    "The 제자교회 주일예배, 수요예배, 새벽기도회, 금요기도회 등 예배 시간 안내 및 특별 예배 일정을 확인하세요.",
  path: "/about/service-times",
});

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
    (service) => service.location === "나인아트홀"
  );
  const otherLocationRows = serviceRows.filter(
    (service) => service.location !== "나인아트홀"
  );
  const noticeItems = [
    "모든 주일 예배는 온라인 송출을 병행합니다.",
    "예배시간 10분 전에 오셔서 예배를 준비해주세요.",
    "매달 마지막 주 금요일은 선교 기도회로 진행됩니다.",
  ];

  return (
    <div className="section-shell section-shell--narrow space-y-14 pt-10 md:pt-16 pb-20">
      <section>
        <SectionHeading title="예배 시간 안내" label="Service Times" as="h1" />

        <div className="mt-10 md:mt-12">
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
        </div>

        <div className="mt-10 px-5 md:px-0">
          <SectionHeading title="안내" label="Notice" />
          <div className="mt-6">
            <ServiceNotice items={noticeItems} />
          </div>
        </div>
      </section>
    </div>
  );
}
