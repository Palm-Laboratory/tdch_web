import Image from "next/image";

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
      className="inline-flex items-center gap-2 rounded-full border border-cedar/15 bg-white/88 px-4 py-2 text-sm font-semibold text-ink shadow-[0_10px_24px_rgba(16,33,63,0.08)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-cedar/30 hover:text-themeBlue"
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
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cedar/70">
        {subtitle}
      </p>
      <h3 className="text-3xl font-bold text-ink md:text-4xl">
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
  const hasStaticMapAuth = Boolean(
    process.env.NAVER_MAP_CLIENT_ID && process.env.NAVER_MAP_CLIENT_SECRET
  );
  const kakaoMapUrl =
    process.env.NEXT_PUBLIC_KAKAO_MAP_URL ??
    `https://map.kakao.com/link/search/${encodeURIComponent(address)}`;
  const staticMapUrl = hasStaticMapAuth
    ? `/api/static-map?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}`
    : null;

  return (
    <div className="w-full overflow-x-hidden bg-white">
      <section className="relative overflow-hidden">
        <div className="section-shell relative py-12 md:py-16">
          <div className="mt-10 overflow-hidden rounded-[34px] border border-cedar/12 bg-white shadow-[0_24px_60px_rgba(16,33,63,0.12)]">
            <div className="relative aspect-[16/11] w-full overflow-hidden md:aspect-[16/8] lg:aspect-[16/7]">
              {staticMapUrl ? (
                <Image
                  src={staticMapUrl}
                  alt={`${churchName} 정적 지도`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#edf4ff_0%,#f8fbff_46%,#eef6ff_100%)]">
                  <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(42,79,143,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(42,79,143,0.08)_1px,transparent_1px)] [background-size:38px_38px]" />
                  <div className="absolute left-[14%] top-[22%] h-20 w-20 rounded-full bg-gold/25 blur-2xl" />
                  <div className="absolute bottom-[18%] right-[16%] h-24 w-24 rounded-full bg-clay/15 blur-2xl" />
                  <div className="relative z-10 flex flex-col items-center px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_18px_32px_rgba(16,33,63,0.12)]">
                      <span className="text-2xl">+</span>
                    </div>
                    <p className="mt-5 text-[11px] font-black uppercase tracking-[0.26em] text-cedar/55">
                      Static Map Ready
                    </p>
                    <p className="mt-3 max-w-[22rem] text-sm leading-7 text-ink/65 md:text-base">
                      서버 전용 네이버 지도 인증값을 연결하면 이 영역에 실제 정적 지도가 표시됩니다.
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <div className="max-w-[34rem] rounded-[24px] border border-white/70 bg-white/88 px-5 py-4 text-ink shadow-[0_18px_42px_rgba(16,33,63,0.18)] backdrop-blur-md md:px-6 md:py-5">
                  <h2 className="text-3xl font-bold text-ink">
                    {churchName}
                  </h2>
                  <p className="mt-2 max-w-[32rem] text-sm leading-6 text-ink/72 md:text-base">
                    {address}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cedar/10 bg-[#f8fbff] px-4 py-4 md:px-6">
              <p className="text-sm text-ink/58">
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

      <section className="section-shell py-12 md:py-16">
        <div className="space-y-16 md:space-y-24">
          <InfoSection title="방문 안내" subtitle="Visit Guide">
            <ul className="space-y-3 text-base leading-[1.75] text-ink/78 md:text-lg md:leading-[1.7]">
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
            <ul className="space-y-3 text-base leading-[1.75] text-ink/78 md:text-lg md:leading-[1.7]">
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
                    <th className="w-[38%] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-cedar/70 md:px-6">
                      노선
                    </th>
                    <th className="w-[22%] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-cedar/70 md:px-6">
                      승차
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-cedar/70 md:px-6">
                      하차
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {busRoutes.map((item) => (
                    <tr key={`${item.from}-${item.routes}`} className="border-b border-cedar/10 last:border-b-0">
                      <td className="w-[38%] bg-[#f8fbff] px-4 py-4 text-base font-semibold leading-[1.6] text-themeBlue md:px-6 md:py-5 md:text-lg">
                        {item.routes}
                      </td>
                      <td className="w-[22%] px-4 py-4 text-base leading-[1.6] text-ink/72 md:px-6 md:py-5 md:text-lg">
                        {item.from}
                      </td>
                      <td className="px-4 py-4 text-base leading-[1.6] text-ink/72 md:px-6 md:py-5 md:text-lg">
                        {item.stop}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfoSection>

          <InfoSection title="교회정보" subtitle="Church Info">
            <ul className="space-y-3 text-base leading-[1.75] text-ink/78 md:text-lg md:leading-[1.7]">
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
      </section>
    </div>
  );
}
