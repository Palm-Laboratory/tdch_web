// ─── 퀵 메뉴 카드 (히어로 바로 아래 4개 카드) ─────────────────────────────

export interface QuickMenuCard {
  href: string;
  title: string;
  enTitle: string;
  imageName: string;
}

export const quickMenuCards: QuickMenuCard[] = [
  { href: "/about/greeting", title: "교회소개", enTitle: "Church Intro", imageName: "/images/quick_menu/church.png" },
  { href: "/about/service-times", title: "예배 시간 안내", enTitle: "Service Times", imageName: "/images/quick_menu/clock.png" },
  { href: "/newcomer/guide", title: "새가족 안내", enTitle: "Newcomer", imageName: "/images/quick_menu/people-group.png" },
  { href: "/about/location#map", title: "오시는길/문의", enTitle: "Visit & Contact", imageName: "/images/quick_menu/map-marker.png" },
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

// ─── 예배 시간 안내 페이지 데이터 ─────────────────────────────────────────

export interface ServiceTimeData {
  name: string;
  day: string;
  time: string;
  ampm: string;
  location: string;
}

export const serviceTimes: ServiceTimeData[] = [
  // { name: "주일 1부 예배 (준비 중)", day: "주일", time: "11:00", ampm: "AM", location: "나인아트홀" },
  { name: "주일 예배", day: "주일", time: "2:00", ampm: "PM", location: "나인아트홀" },
  { name: "새가족 양육", day: "주일", time: "예배 후 / 주중", ampm: "PM", location: "나인아트홀 / 구글 Meet" },
  // { name: "새벽 기도회", day: "월~금", time: "5:30", ampm: "AM", location: "나인아트홀" },
  { name: "금요 기도회", day: "금요일", time: "9:00", ampm: "PM", location: "나인아트홀" },
  { name: "리더 모임", day: "수요일", time: "8:30", ampm: "PM", location: "구글 Meet" },
  { name: "더 좋은 묵상", day: "화~금", time: "8:00", ampm: "AM", location: "YouTube" },
];

export const serviceNotices: string[] = [
  "주일 오전 예배시간은 11시에 시작된 2부 예배가 본 교회의 주 예배입니다.",
  "주차 공간이 한정되어 있으므로 대중교통 이용을 권장합니다.",
];

export interface SpecialServiceData {
  name: string;
  date: string;
  location: string;
  note: string;
}

export const specialServices: SpecialServiceData[] = [
  { name: "신년 감사 예배", date: "1월 첫째 주일", location: "본당", note: "-" },
  { name: "사순절 뉴 새벽 서비스 예배", date: "-", location: "기도실", note: "-" },
  { name: "부활절 연합 예배", date: "부활절 주일 오전 8:00", location: "야외 / 본당", note: "-" },
  { name: "추수 감사 예배", date: "11월 셋째 주일", location: "본당", note: "-" },
  { name: "성탄 전야 예배", date: "12월 24일 오후 7:30", location: "본당", note: "-" },
];
