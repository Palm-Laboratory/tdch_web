export interface NavSubItem {
  href: string;
  label: string;
}

export interface NavMenuGroup {
  href: string;
  label: string;
  items: NavSubItem[];
}

export const navMenuGroups: NavMenuGroup[] = [
  {
    href: "/about",
    label: "교회소개",
    items: [
      { href: "/about#greeting", label: "인사말" },
      { href: "/about#vision", label: "비전" },
      { href: "/about#service-times", label: "예배 시간 안내" },
      { href: "/about#location", label: "오시는 길" },
      { href: "/about#history", label: "교회연혁" }
    ]
  },
  {
    href: "/sermons",
    label: "예배",
    items: [
      { href: "/sermons#messages", label: "말씀/설교 영상 내용" },
      { href: "/sermons#setlist", label: "찬양 셋리스트" }
    ]
  },
  {
    href: "/news",
    label: "교회소식",
    items: [
      { href: "/news#notice", label: "공지" },
      { href: "/news#bulletin", label: "주보" },
      { href: "/newcomer", label: "새가족 안내" }
    ]
  },
  {
    href: "/contact",
    label: "오시는 길/문의",
    items: [
      { href: "/contact#map", label: "지도" },
      { href: "/contact#contact-info", label: "연락처" },
    ]
  },
  {
    href: "/giving",
    label: "헌금안내",
    items: [{ href: "/giving", label: "헌금안내" }]
  }
];

// ─── 퀵 메뉴 카드 (히어로 바로 아래 4개 카드) ─────────────────────────────

export interface QuickMenuCard {
  href: string;
  title: string;
  enTitle: string;
  imageName: string;
}

export const quickMenuCards: QuickMenuCard[] = [
  { href: "/about", title: "교회소개", enTitle: "Church Intro", imageName: "/images/quick_menu/church.png" },
  { href: "/about#service-times", title: "예배 시간 안내", enTitle: "Service Times", imageName: "/images/quick_menu/clock.png" },
  { href: "/newcomer", title: "새가족 안내", enTitle: "Newcomer", imageName: "/images/quick_menu/people-group.png" },
  { href: "/contact#map", title: "오시는길/문의", enTitle: "Visit & Contact", imageName: "/images/quick_menu/map-marker.png" },
];

// ─── 섹션4: 교회 소식 데이터 (임시 더미 — 추후 API 연동 예정) ─────────────

export interface ChurchNewsItem {
  title: string;
  date: string;
  href: string;
}

export const churchNewsList: ChurchNewsItem[] = [
  { title: "봄 학기 성경공부 신청 안내", date: "2026.03.01", href: "/news#notice" },
  { title: "새가족 환영 모임 안내", date: "2026.02.28", href: "/news#notice" },
  { title: "금요 기도회 시간 변경 안내", date: "2026.02.21", href: "/news#notice" },
  { title: "3월 교회 행사 일정 안내", date: "2026.02.18", href: "/news#notice" },
  { title: "제자훈련 3기 수료식 안내", date: "2026.02.15", href: "/news#notice" },
];

export const bulletinList: ChurchNewsItem[] = [
  { title: "3월 1주차 주보", date: "2026.03.02", href: "/news#bulletin" },
  { title: "2월 4주차 주보", date: "2026.02.23", href: "/news#bulletin" },
  { title: "2월 3주차 주보", date: "2026.02.16", href: "/news#bulletin" },
  { title: "2월 2주차 주보", date: "2026.02.09", href: "/news#bulletin" },
  { title: "2월 1주차 주보", date: "2026.02.02", href: "/news#bulletin" },
];

// ─── 섹션3: 설교 카드 데이터 (임시 더미 — 추후 API 연동 예정) ──────────────

export interface SermonCardData {
  href: string;
  thumbnail: string;
  thumbnailAlt: string;
  category: string;
  type: string;
  title: string;
  scripture: string;
  pastor: string;
  date: string;
}

export const homeSermonList: SermonCardData[] = [
  {
    href: "", // YouTube URL (youtubeUrl 환경변수 사용)
    thumbnail: "/images/sermon_thumb/0302_thumb.jpg",
    thumbnailAlt: "최신 예배 설교 하이라이트",
    category: "설교",
    type: "주일예배",
    title: "목마름을 채우시는 사랑",
    scripture: "요한복음 4:1~42",
    pastor: "이진욱 목사",
    date: "2026.03.02",
  },
  {
    href: "", // YouTube URL
    thumbnail: "/images/sermon_thumb/0228_thumb.jpg",
    thumbnailAlt: "새 시작을 주시는 사랑 설교 썸네일",
    category: "설교",
    type: "주일예배",
    title: "새 시작을 주시는 사랑",
    scripture: "요한복음 2:1~11",
    pastor: "이진욱 목사",
    date: "2026.02.28",
  },
];
