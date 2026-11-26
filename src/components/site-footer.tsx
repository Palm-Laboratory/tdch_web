import {
  CHURCH_ADDRESS,
  CHURCH_EMAIL,
  CHURCH_PHONE,
  SITE_NAME,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/site-config";

export default function SiteFooter() {
  return (
    <footer data-site-footer className="bg-[#0f1c2e] py-10 text-ivory/80 md:py-16">
      <div className="section-shell flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

        {/* 좌측: 로고 및 정보 */}
        <div className="space-y-4">
          <div>
            <p className="font-serif text-2xl font-semibold text-ivory">{SITE_NAME}</p>
          </div>
          <div className="space-y-1 text-xs text-ivory/50">
            <p>{CHURCH_ADDRESS}</p>
            <p>
              <span className="mr-2 inline-block w-12 shrink-0 whitespace-nowrap text-ivory/30">TEL</span> {CHURCH_PHONE}
            </p>
            <p>
              <span className="mr-2 inline-block w-12 shrink-0 whitespace-nowrap text-ivory/30">EMAIL</span> {CHURCH_EMAIL}
            </p>
          </div>
        </div>

        {/* 우측: 공식 채널 */}
        <div className="flex gap-4">
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-ivory/60 transition hover:bg-white/10 hover:text-white"
            aria-label="YouTube"
          >
            <svg className="size-8" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12s0 3.8.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12s0-3.8-.5-5.8Z" />
              <path fill="#fff" d="m9.6 15.7 6.3-3.7-6.3-3.7v7.4Z" />
            </svg>
          </a>
        </div>
      </div>

      {/* 하단: 카피라이트 */}
      <div className="section-shell mt-12 border-t border-white/10 pt-6 text-xs text-ivory/40">
        <p>Copyright (c) 2026 {SITE_NAME} All rights reserved provided by Palm Lab</p>
        <p className="mt-2">
          Animated icons by{" "}
          <a
            href="https://lordicon.com/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 transition hover:text-ivory/70"
          >
            Lordicon.com
          </a>
        </p>
      </div>
    </footer>
  );
}
