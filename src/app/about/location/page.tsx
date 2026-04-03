import type { Metadata } from "next";
import NaverDynamicMap from "./components/naver-dynamic-map";
import SectionHeading from "@/components/section-heading";

export const metadata: Metadata = {
  title: "오시는 길",
  description: "The 제자교회 오시는 길 안내입니다. 경기도 수원시 팔달구 경수대로425 지하1층(나인아트홀). 지하철, 버스 노선 및 주차 안내.",
};

const churchName = "The 제자교회";
const addressFallback = "경기도 수원시 팔달구 경수대로425 지하1층(나인아트홀)";
const latitudeFallback = "37.2642526267482";
const longitudeFallback = "127.025125618372";
const naverMapFallback =
  "https://map.naver.com/p/search/%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%88%98%EC%9B%90%EC%8B%9C%20%ED%8C%94%EB%8B%AC%EA%B5%AC%20%EA%B2%BD%EC%88%98%EB%8C%80%EB%A1%9C425%20%EB%82%98%EC%9D%B8%EC%95%84%ED%8A%B8%ED%99%80/place/1394960485?c=15.00,0,0,0,dh&isCorrectAnswer=true&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202603132012&locale=ko&svcName=map_pcv5&searchText=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%88%98%EC%9B%90%EC%8B%9C%20%ED%8C%94%EB%8B%AC%EA%B5%AC%20%EA%B2%BD%EC%88%98%EB%8C%80%EB%A1%9C425%20%EB%82%98%EC%9D%B8%EC%95%84%ED%8A%B8%ED%99%80";
const busRoutes = [
  { from: "수원역", routes: "51, 92, 92-1", stop: "권선초교 하차" },
  { from: "화서역", routes: "92", stop: "권선초교 하차" },
  { from: "광교-오산", routes: "201", stop: "권선초교 하차" },
  { from: "수원버스터미널", routes: "81, 85", stop: "KT남수원지사 정류장에서 하차" },
  { from: "수원버스터미널", routes: "61, 300, 300-1, 82-1", stop: "수원시청사거리, 월스기념병원 정류장에서 하차" },
  { from: "오산-평촌", routes: "300", stop: "수원시청사거리, 월스기념병원 정류장에서 하차" },
];

function ExternalArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h8v8" />
    </svg>
  );
}

function MiniActionButton({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="type-body-small inline-flex items-center gap-2 rounded-full border border-cedar/15 bg-white/88 px-4 py-2 font-semibold text-ink shadow-[0_10px_24px_rgba(16,33,63,0.08)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-cedar/30 hover:text-themeBlue"
    >
      <span>{label}</span>
      <ExternalArrowIcon />
    </a>
  );
}

function InfoSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <SectionHeading as="h3" label={subtitle} title={title} />
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function LocationPage() {
  const address = process.env.NEXT_PUBLIC_CHURCH_ADDRESS ?? addressFallback;
  const phone = process.env.NEXT_PUBLIC_CHURCH_PHONE ?? "010-5252-8580";
  const email = process.env.NEXT_PUBLIC_CHURCH_EMAIL ?? "timothy35@hanmail.net";
  const naverMapUrl = process.env.NEXT_PUBLIC_NAVER_MAP_URL ?? naverMapFallback;
  const latitude = process.env.NEXT_PUBLIC_CHURCH_LAT ?? latitudeFallback;
  const longitude = process.env.NEXT_PUBLIC_CHURCH_LNG ?? longitudeFallback;
  const naverMapClientId =
    process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ??
    process.env.NAVER_MAP_CLIENT_ID;
  const kakaoMapUrl =
    process.env.NEXT_PUBLIC_KAKAO_MAP_URL ??
    `https://map.kakao.com/link/search/${encodeURIComponent(address)}`;

  return (
    <div className="w-full overflow-x-hidden bg-white">
      <section id="map" className="relative overflow-hidden scroll-mt-28">
        <div className="section-shell section-shell--narrow relative py-12 md:py-16">
          <SectionHeading id="location-title" label="location" title="오시는 길" />
          <div className="mt-10 overflow-hidden border border-cedar/12 bg-white">
            <div className="relative aspect-[16/11] w-full overflow-hidden md:aspect-[16/8] lg:aspect-[16/7]">
              <NaverDynamicMap
                clientId={naverMapClientId}
                latitude={Number(latitude)}
                longitude={Number(longitude)}
                title={churchName}
              />

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <div className="rounded-[20px] border border-white/70 bg-white/88 px-4 py-3 text-ink shadow-[0_18px_42px_rgba(16,33,63,0.18)] backdrop-blur-md md:hidden">
                  <p className="type-body-small text-ink/72 text-center">
                    {address}
                  </p>
                </div>
                <div className="hidden max-w-[25rem] rounded-[24px] border border-white/70 bg-white/88 px-5 py-4 text-ink shadow-[0_18px_42px_rgba(16,33,63,0.18)] backdrop-blur-md md:block md:px-6 md:py-5">
                  <h2 className="type-card-title font-serif font-bold text-ink">
                    {churchName}
                  </h2>
                  <p className="type-body mt-2 max-w-[32rem] text-ink/72">
                    {address}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cedar/10 bg-[#f8fbff] px-4 py-4 md:px-6">
              <p className="type-body-small text-[0.9175rem] md:text-[0.9375rem] text-ink/58">
                지도를 크게 확인하거나 길찾기를 시작하려면 아래 버튼을 사용해 주세요.
              </p>
              <div className="flex flex-wrap gap-2">
                <MiniActionButton label="네이버 지도" href={naverMapUrl} />
                <MiniActionButton label="카카오맵" href={kakaoMapUrl} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell section-shell--narrow py-12 md:py-16">
        <div className="space-y-16 md:space-y-24">
          <InfoSection title="방문 안내" subtitle="Visit Guide">
            <ul className="type-body space-y-3 text-black/88">
              <li className="flex items-center gap-4">
                <span className="list-bullet list-bullet--navy shrink-0" />
                <span>
                  예배 장소는{" "}
                  <strong className="font-semibold text-red-600">나인아트홀(지하 1층)</strong>
                  {" "}입니다.
                </span>
              </li>
              <li className="flex items-center gap-4">
                <span className="list-bullet list-bullet--navy shrink-0" />
                <span>
                  주일 방문 시, 아트홀 건물 주차장을 이용하실 수 있고,
                  주변 유료주차장이나 수원시청 주차장에 주차하신 뒤 걸어서 오셔도 됩니다.
                </span>
              </li>
              <li className="flex items-center gap-4">
                <span className="list-bullet list-bullet--navy shrink-0" />
                <span>평일에는 주차가 다소 어려울 수 있어 대중 교통 이용을 권장합니다.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="list-bullet list-bullet--navy shrink-0" />
                <span>방문하시는 경우 건물 내 엘리베이터를 이용하여 지하 1층으로 오시면 됩니다.</span>
              </li>
            </ul>
          </InfoSection>

          <InfoSection title="지하철 이용" subtitle="Subway">
            <ul className="type-body space-y-3 text-black/88">
              <li className="flex items-center gap-4">
                <span className="list-bullet list-bullet--navy shrink-0" />
                <span>수원시청역 6번 출구에서 도보 약 8분 거리</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="list-bullet list-bullet--navy shrink-0" />
                <span>매교역 8번 출구에서 도보 약 14분 거리</span>
              </li>
            </ul>
          </InfoSection>

          <InfoSection title="버스 이용" subtitle="Bus">
            <div className="overflow-x-auto border-x border-b border-t-[3px] border-cedar/15 border-t-ink/90 bg-white">
              <table className="w-full min-w-[680px] table-fixed border-collapse text-left lg:min-w-[760px]">
                <thead>
                  <tr className="border-b border-cedar/15 bg-[#fafcff]">
                    <th className="type-label w-[28%] border-r border-cedar/15 px-4 py-4 text-center font-semibold tracking-[0.08em] text-ink/72 lg:px-6 lg:py-5">
                      노선
                    </th>
                    <th className="type-label w-[24%] border-r border-cedar/15 px-4 py-4 text-center font-semibold tracking-[0.08em] text-ink/72 lg:px-6 lg:py-5">
                      승차
                    </th>
                    <th className="type-label px-4 py-4 text-center font-semibold tracking-[0.08em] text-ink/72 lg:px-6 lg:py-5">
                      하차
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {busRoutes.map((item) => (
                    <tr key={`${item.from}-${item.routes}`} className="border-b border-cedar/15 last:border-b-0">
                      <td className="type-body-strong border-r border-cedar/15 px-4 py-5 text-center font-bold text-ink lg:px-6 lg:py-6">
                        {item.routes}
                      </td>
                      <td className="type-body border-r border-cedar/15 px-4 py-5 text-center font-medium text-ink/80 lg:px-6 lg:py-6">
                        {item.from}
                      </td>
                      <td className="type-body px-4 py-5 text-center font-medium text-ink/80 lg:px-6 lg:py-6">
                        {item.stop}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfoSection>

          <div id="contact-info" className="scroll-mt-28">
            <InfoSection title="교회정보" subtitle="Church Info">
              <ul className="type-body space-y-3 text-black/88">
                <li className="flex items-center gap-4">
                  <span className="list-bullet list-bullet--navy shrink-0" />
                  <span>
                    주소 : {address}
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="list-bullet list-bullet--navy shrink-0" />
                  <span>
                    TEL :
                    {" "}
                    <a href={`tel:${phone}`} className="transition hover:text-themeBlue">
                      {phone}
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="list-bullet list-bullet--navy shrink-0" />
                  <span>
                    EMAIL :
                    {" "}
                    <a href={`mailto:${email}`} className="transition hover:text-themeBlue">
                      {email}
                    </a>
                  </span>
                </li>
              </ul>
            </InfoSection>
          </div>
        </div>
      </section>
    </div>
  );
}
