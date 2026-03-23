import NaverDynamicMap from "./components/naver-dynamic-map";

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
      <p className="type-label mb-2 font-semibold uppercase tracking-[0.2em] text-cedar/70">
        {subtitle}
      </p>
      <h3 className="type-section-title font-bold text-ink">
        {title}
      </h3>
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
  const naverMapClientId = process.env.NAVER_MAP_CLIENT_ID ?? process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  const kakaoMapUrl =
    process.env.NEXT_PUBLIC_KAKAO_MAP_URL ??
    `https://map.kakao.com/link/search/${encodeURIComponent(address)}`;

  return (
    <div className="w-full overflow-x-hidden bg-white">
      <section id="map" className="relative overflow-hidden scroll-mt-28">
        <div className="section-shell section-shell--wide relative py-12 md:py-16">
          <p className="type-label mb-2 font-semibold uppercase tracking-[0.2em] text-cedar/70">
            LOCATION
          </p>
          <h2 className="type-section-title mb-6 font-bold text-ink md:mb-8">
            오시는 길
          </h2>
          <div className="mt-10 overflow-hidden rounded-[34px] border border-cedar/12 bg-white">
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
                  <h2 className="type-section-title font-serif font-bold text-ink">
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

      <section className="section-shell section-shell--wide py-12 md:py-16">
        <div className="space-y-16 md:space-y-24">
          <InfoSection title="방문 안내" subtitle="Visit Guide">
            <ul className="type-body space-y-3 text-ink/78">
              <li className="flex gap-4">
                <span className="mt-[0.7em] h-2.5 w-2.5 shrink-0 bg-themeBlue" />
                <span>
                  예배 장소는{" "}
                  <strong className="font-semibold text-red-600">나인아트홀(지하 1층)</strong>
                  {" "}입니다.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="mt-[0.7em] h-2.5 w-2.5 shrink-0 bg-themeBlue" />
                <span>주차 공간이 제한되어 있어 대중교통 이용을 권장합니다.</span>
              </li>
              <li className="flex gap-4">
                <span className="mt-[0.7em] h-2.5 w-2.5 shrink-0 bg-themeBlue" />
                <span>방문하시는 경우 건물 내 엘리베이터를 이용하여 지하 1층으로 오시면 됩니다.</span>
              </li>
            </ul>
          </InfoSection>

          <InfoSection title="지하철 이용" subtitle="Subway">
            <ul className="type-body space-y-3 text-ink/78">
              <li className="flex gap-4">
                <span className="mt-[0.7em] h-2.5 w-2.5 shrink-0 bg-themeBlue" />
                <span>수원시청역 6번 출구에서 도보 약 8분 거리</span>
              </li>
              <li className="flex gap-4">
                <span className="mt-[0.7em] h-2.5 w-2.5 shrink-0 bg-themeBlue" />
                <span>매교역 8번 출구에서 도보 약 14분 거리</span>
              </li>
            </ul>
          </InfoSection>

          <InfoSection title="버스 이용" subtitle="Bus">
            <div className="overflow-hidden rounded-[24px] border border-cedar/10 bg-white">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-cedar/10 bg-[#eef4ff]">
                    <th className="type-label w-[38%] px-4 py-3 font-semibold uppercase tracking-[0.16em] text-cedar/70 md:px-6">
                      노선
                    </th>
                    <th className="type-label w-[22%] px-4 py-3 font-semibold uppercase tracking-[0.16em] text-cedar/70 md:px-6">
                      승차
                    </th>
                    <th className="type-label px-4 py-3 font-semibold uppercase tracking-[0.16em] text-cedar/70 md:px-6">
                      하차
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {busRoutes.map((item) => (
                    <tr key={`${item.from}-${item.routes}`} className="border-b border-cedar/10 last:border-b-0">
                      <td className="type-body-strong w-[38%] bg-[#f8fbff] px-4 py-4 font-semibold text-themeBlue md:px-6 md:py-5">
                        {item.routes}
                      </td>
                      <td className="type-body w-[22%] px-4 py-4 text-ink/72 md:px-6 md:py-5">
                        {item.from}
                      </td>
                      <td className="type-body px-4 py-4 text-ink/72 md:px-6 md:py-5">
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
              <ul className="type-body space-y-3 text-ink/78">
                <li className="flex gap-4">
                  <span className="mt-[0.7em] h-2.5 w-2.5 shrink-0 bg-themeBlue" />
                  <span>
                    주소 : {address}
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="mt-[0.7em] h-2.5 w-2.5 shrink-0 bg-themeBlue" />
                  <span>
                    TEL :
                    {" "}
                    <a href={`tel:${phone}`} className="transition hover:text-themeBlue">
                      {phone}
                    </a>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="mt-[0.7em] h-2.5 w-2.5 shrink-0 bg-themeBlue" />
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
