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
  timeNote?: string;
  period: string;
  location: string;
}

export const serviceTimes: ServiceTimeData[] = [
  { name: "주일예배", day: "주일", time: "11:00", period: "오전", location: "본당" },
  { name: "주일 오후예배", day: "주일", time: "2:00", period: "오후", location: "본당" },
  { name: "수요예배", day: "수요일", time: "7:30", timeNote: "동절기 7시", period: "오후", location: "1층 대예배당" },
  { name: "금요기도회", day: "금요일", time: "7:30", period: "저녁", location: "본당" },
  { name: "새벽기도회", day: "월~금", time: "5:00", period: "새벽", location: "지하 로뎀쉼터" },
  { name: "아동부", day: "주일", time: "11:00", period: "오전", location: "교육관" },
  { name: "학생회", day: "토요일", time: "4:00", period: "오후", location: "교육관" },
];

export const serviceNotices: string[] = [
  "예배 및 부서별 모임 장소는 각 항목에 안내되어 있습니다.",
];

export interface SpecialServiceData {
  name: string;
  date: string;
  location: string;
  note: string;
}

export const specialServices: SpecialServiceData[] = [];
