const phone = process.env.NEXT_PUBLIC_CHURCH_PHONE ?? "010-5252-8580";
const email = process.env.NEXT_PUBLIC_CHURCH_EMAIL ?? "timothy35@hanmail.net";
const address =
  process.env.NEXT_PUBLIC_CHURCH_ADDRESS ?? "경기도 수원시 팔달구 경수대로425 지하1층(나인아트홀), The 제자교회";
const youtube =
  process.env.NEXT_PUBLIC_YOUTUBE_URL ??
  "https://www.youtube.com/@%EB%8D%94%EC%A0%9C%EC%9E%90%EA%B5%90%ED%9A%8C";

export default function SiteFooter() {
  return (
    <footer className="bg-[#0f1c2e] py-10 text-ivory/80 md:py-16">
      <div className="section-shell flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

        {/* 좌측: 로고 및 정보 */}
        <div className="space-y-4">
          <div>
            <p className="font-serif text-2xl font-semibold text-ivory">The 제자교회</p>
          </div>
          <div className="space-y-1 text-xs text-ivory/50">
            <p>{address}</p>
            <p>
              <span className="mr-2 inline-block w-8 text-ivory/30">TEL</span> {phone}
            </p>
            <p>
              <span className="mr-2 inline-block w-8 text-ivory/30">EMAIL</span> {email}
            </p>
          </div>
        </div>

        {/* 우측: 소셜 미디어 아이콘 */}
        <div className="flex gap-4">
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-ivory/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Instagram"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </a>
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-ivory/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Facebook"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          {/* Threads (X/Twitter placeholder as Threads logo is usually custom drawn) */}
          <a
            href="https://threads.net"
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-ivory/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Threads"
          >
            {/* Simple At symbol used often to represent Threads generically, or text 'T' */}
            <span className="font-serif text-lg font-bold">@</span>
          </a>
          {/* YouTube */}
          <a
            href={youtube}
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
        <p>Copyright (c) 2026 The 제자교회 All rights reserved provided by Palm Lab</p>
      </div>
    </footer>
  );
}
