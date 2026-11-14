import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import { redirectToCanonicalStaticPathIfNeeded } from "@/lib/canonical-menu-path";
import { serviceTimes } from "@/lib/site-data";
import { SITE_NAME } from "@/lib/site-config";
import { createPageMetadata } from "@/lib/seo";
import MobileServiceCard from "./components/mobile-service-card";
import ServiceTimesTable from "./components/service-times-table";

export const metadata: Metadata = createPageMetadata({
  title: "예배 시간 안내",
  description:
    `${SITE_NAME} 주일예배, 수요예배, 새벽기도회, 금요기도회 등 예배 시간 안내입니다.`,
  path: "/about/service-times",
});

function formatSchedule(time: string, ampm: string) {
  const period = ampm === "AM" ? "오전" : "오후";
  return `${period} ${time}`;
}

export default async function ServiceTimesPage() {
  await redirectToCanonicalStaticPathIfNeeded("about.service-times", "/about/service-times");

  const serviceRows = serviceTimes.map((service) => ({
    title: service.name,
    schedule: formatSchedule(service.time, service.ampm),
  }));

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
              />
            ))}
          </div>

          <ServiceTimesTable
            rows={serviceRows}
          />
        </div>

      </section>
    </div>
  );
}
