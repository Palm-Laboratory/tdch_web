import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import { redirectToCanonicalStaticPathIfNeeded } from "@/lib/canonical-menu-path";
import {
  CHURCH_ADDRESS,
  CHURCH_CONTACT_PHONE,
  CHURCH_EMAIL,
  CHURCH_PHONE,
  KAKAO_MAP_URL,
  NAVER_MAP_URL,
  SITE_NAME,
} from "@/lib/site-config";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "오시는 길",
  description: `${SITE_NAME} 오시는 길 안내입니다. ${CHURCH_ADDRESS}.`,
  path: "/about/location",
});

function ExternalArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h8v8" />
    </svg>
  );
}

function MapButton({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="type-body-small inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white px-5 py-3 font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-surface">
      <span>{label}</span>
      <ExternalArrowIcon />
    </a>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="grid gap-1 border-b border-cedar/10 py-4 last:border-b-0 md:grid-cols-[8rem_1fr] md:gap-6">
      <span className="type-label font-semibold uppercase tracking-[0.12em] text-ink/45">{label}</span>
      <span className="type-body font-medium text-ink">{children}</span>
    </li>
  );
}

export default async function LocationPage() {
  await redirectToCanonicalStaticPathIfNeeded("about.location", "/about/location");

  return (
    <div className="w-full overflow-x-hidden bg-white">
      <section id="map" className="scroll-mt-28">
        <div className="section-shell section-shell--narrow py-12 md:py-16">
          <SectionHeading id="location-title" label="Location" title="오시는 길" />

          <div className="mt-10 overflow-hidden rounded-[28px] bg-ink text-white shadow-[0_24px_70px_rgba(16,33,63,0.18)]">
            <div className="grid gap-8 px-7 py-10 md:grid-cols-[1fr_auto] md:items-end md:px-12 md:py-14">
              <div>
                <p className="type-label font-semibold uppercase tracking-[0.2em] text-gold">Daecheon Baptist Church</p>
                <h2 className="mt-4 font-serif text-3xl font-bold md:text-5xl">{SITE_NAME}</h2>
                <p className="type-lead mt-5 text-white/78">{CHURCH_ADDRESS}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <MapButton label="네이버 지도로 보기" href={NAVER_MAP_URL} />
                <MapButton label="카카오맵으로 보기" href={KAKAO_MAP_URL} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-info" className="section-shell section-shell--narrow scroll-mt-28 pb-20 pt-4 md:pb-24 md:pt-8">
        <SectionHeading label="Church Info" title="교회 정보" />

        <ul className="mt-8 border-y border-cedar/15">
          <ContactRow label="주소">{CHURCH_ADDRESS}</ContactRow>
          <ContactRow label="대표전화"><a href={`tel:${CHURCH_PHONE}`} className="transition hover:text-themeBlue">{CHURCH_PHONE}</a></ContactRow>
          <ContactRow label="문의"><a href={`tel:${CHURCH_CONTACT_PHONE}`} className="transition hover:text-themeBlue">{CHURCH_CONTACT_PHONE}</a></ContactRow>
          <ContactRow label="이메일"><a href={`mailto:${CHURCH_EMAIL}`} className="transition hover:text-themeBlue">{CHURCH_EMAIL}</a></ContactRow>
        </ul>
      </section>
    </div>
  );
}
