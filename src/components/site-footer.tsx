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
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
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
