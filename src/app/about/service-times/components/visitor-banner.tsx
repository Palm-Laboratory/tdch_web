import Link from "next/link";

export default function VisitorBanner() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#13243a] via-[#1c2f48] to-[#0f1c2e] px-6 py-8 md:flex md:items-center md:justify-between md:px-10 md:py-10">
      <div>
        <h3 className="text-xl font-bold text-ivory md:text-2xl">처음 방문하시나요?</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ivory/60">
          교회 오시는 방법과 근방 대중교통 운영 등<br className="hidden md:block" />자세한 안내를 확인하실 수 있습니다. 환영합니다!

        </p>
      </div>
      <Link
        href="/about/location"
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-white px-6 py-3 text-sm font-bold text-ink shadow-lg transition hover:bg-gray-100 hover:-translate-y-0.5 md:mt-0"
      >
        오시는 길 안내 →
      </Link>
    </div>
  );
}
