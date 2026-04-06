import { getAdminSession } from "@/auth";
import YoutubeSyncCard from "./components/youtube-sync-card";

const CONTENT_CHANNELS = [
  {
    siteKey: "messages",
    label: "설교 영상",
    badge: "SERMON",
    description: "주일 설교 및 말씀 영상",
    href: "/admin/media/messages",
    accentColor: "#3f74c7",
    glowColor: "rgba(63,116,199,0.12)",
  },
  {
    siteKey: "its-okay",
    label: "그래도 괜찮아",
    badge: "SHORTS",
    description: "짧은 위로 영상 시리즈",
    href: "/admin/media/its-okay",
    accentColor: "#6ca6f0",
    glowColor: "rgba(108,166,240,0.1)",
  },
  {
    siteKey: "better-devotion",
    label: "더 좋은 묵상",
    badge: "DEVOTION",
    description: "묵상 가이드 영상 시리즈",
    href: "/admin/media/better-devotion",
    accentColor: "#2f6f9e",
    glowColor: "rgba(47,111,158,0.12)",
  },
];

const STAT_CARDS = [
  {
    label: "콘텐츠 채널",
    value: "3",
    sub: "messages · its-okay · better-devotion",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6 6.5l4 2-4 2V6.5z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "자동 동기화",
    value: "30분",
    sub: "스케줄러 주기",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "관리자 세션",
    value: "8h",
    sub: "JWT 만료 주기",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "인증 방식",
    value: "카카오",
    sub: "OAuth 2.0 + 화이트리스트",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M8 1C4.94 1 2.5 3.2 2.5 5.95c0 1.67.97 3.14 2.44 4.04l-.72 2.69a.2.2 0 0 0 .31.22l3.01-1.9c.15.01.31.01.46.01C10.06 11 13.5 8.8 13.5 5.95 13.5 3.2 11.06 1 8 1Z" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
];

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  const displayName = session?.user?.name?.trim() || session?.user?.email || "관리자";
  const now = new Date();
  const timeString = now.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6ca6f0]/60">
          Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
          안녕하세요, {displayName}님
        </h1>
        <p className="mt-1 text-sm text-white/35">{timeString}</p>
      </div>

      {/* 스탯 카드 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.04] px-5 py-4"
          >
            <div className="flex items-center gap-2 text-white/35">
              {card.icon}
              <p className="text-[11px] font-semibold uppercase tracking-wide">{card.label}</p>
            </div>
            <p className="mt-3 text-xl font-bold text-white">{card.value}</p>
            <p className="mt-0.5 text-[11px] text-white/30">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* 콘텐츠 채널 현황 */}
        <div className="space-y-3">
          <h2 className="text-[13px] font-semibold text-white/60">콘텐츠 채널</h2>
          <div className="space-y-2">
            {CONTENT_CHANNELS.map((ch) => (
              <div
                key={ch.siteKey}
                className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-4 transition hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-9 w-9 rounded-xl"
                    style={{ background: `${ch.accentColor}22`, boxShadow: `0 0 0 1px ${ch.accentColor}33` }}
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <rect x="1" y="3" width="14" height="10" rx="2" stroke={ch.accentColor} strokeWidth="1.4"/>
                        <path d="M6 6.5l4 2-4 2V6.5z" fill={ch.accentColor}/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-white">{ch.label}</p>
                      <span
                        className="rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider"
                        style={{ color: ch.accentColor, background: `${ch.accentColor}18` }}
                      >
                        {ch.badge}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-white/35">{ch.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-white/30">연결됨</span>
                  </div>
                  <span className="text-white/15">›</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 우측 패널 */}
        <div className="space-y-4">
          {/* YouTube 동기화 */}
          <YoutubeSyncCard />

        </div>
      </div>
    </div>
  );
}
