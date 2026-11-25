import type { Metadata } from "next";
import SectionHeading from "@/components/section-heading";
import { redirectToCanonicalStaticPathIfNeeded } from "@/lib/canonical-menu-path";
import {
  CHURCH_ADDRESS,
  CHURCH_CONTACT_PHONE,
  CHURCH_EMAIL,
  CHURCH_LATITUDE_NUMBER,
  CHURCH_LONGITUDE_NUMBER,
  CHURCH_PHONE,
  KAKAO_MAP_URL,
  NAVER_MAP_PUBLIC_CLIENT_ID,
  NAVER_MAP_URL,
  SITE_NAME,
} from "@/lib/site-config";
import { createPageMetadata } from "@/lib/seo";
import NaverDynamicMap from "./components/naver-dynamic-map";

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
    <a href={href} target="_blank" rel="noreferrer" className="type-body-small inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-cedar/15 bg-white px-6 py-3 font-bold text-ink shadow-[0_10px_28px_rgba(16,33,63,0.07)] transition hover:-translate-y-0.5 hover:border-cedar/30 hover:bg-surface">
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

          <div className="mt-10 overflow-hidden border border-cedar/15 bg-white shadow-[0_20px_60px_rgba(16,33,63,0.1)]">
            <div className="relative h-[340px] md:h-[460px]">
              <NaverDynamicMap
                clientId={NAVER_MAP_PUBLIC_CLIENT_ID}
                latitude={CHURCH_LATITUDE_NUMBER}
                longitude={CHURCH_LONGITUDE_NUMBER}
                title={SITE_NAME}
              />

              <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 md:inset-x-6 md:bottom-6 md:max-w-[360px]">
                <div className="pointer-events-auto rounded-[22px] border border-white/25 bg-white/20 px-5 py-4 shadow-[0_16px_36px_rgba(16,33,63,0.12)] backdrop-blur-md md:px-6 md:py-5">
                  <h2 className="font-serif text-xl font-bold text-ink md:text-2xl">{SITE_NAME}</h2>
                  <p className="type-body-small mt-2 leading-relaxed text-ink/85 md:mt-3">{CHURCH_ADDRESS}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-5 border-t border-cedar/10 bg-[#f8faff] px-5 py-6 md:flex-row md:items-center md:justify-between md:px-10 md:py-7">
              <p className="type-body hidden max-w-2xl text-ink/90 md:block">
                지도를 크게 확인하거나 길찾기를 시작하려면 아래 버튼을 사용해 주세요.
              </p>
              <div className="flex flex-wrap justify-center gap-3 md:justify-end">
                <MapButton label="네이버 지도" href={NAVER_MAP_URL} />
                <MapButton label="카카오맵" href={KAKAO_MAP_URL} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="visit-guide" className="section-shell section-shell--narrow scroll-mt-28 py-14 md:py-20">
        <SectionHeading label="Visit Guide" title="방문 안내" />

        <ul className="type-body-strong mt-8 space-y-4 text-site-ink md:mt-10 md:space-y-5">
          <li className="flex items-start gap-4">
            <span className="list-bullet list-bullet--navy mt-[0.65em] shrink-0" />
            <span>예배 장소는 1층 예배당입니다.</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="list-bullet list-bullet--navy mt-[0.65em] shrink-0" />
            <span>
              주일 방문 시, 교회 주차장과 도로 주차를 이용하시면 됩니다.
            </span>
          </li>
        </ul>
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
