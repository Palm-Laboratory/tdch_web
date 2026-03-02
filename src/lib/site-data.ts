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
      { href: "/contact#kakao-phone", label: "카카오톡/전화" }
    ]
  },
  {
    href: "/giving",
    label: "헌금안내",
    items: [{ href: "/giving", label: "헌금안내" }]
  }
];

export const serviceTimes = [
  { title: "주일예배", time: "주일 오전 11:00" },
  { title: "수요기도회", time: "수요일 오후 7:30" },
  { title: "새벽묵상", time: "월-금 오전 6:00" }
];

export const sermons = [
  {
    date: "2026-02-15",
    title: "제자의 길, 작은 순종에서 시작됩니다",
    pastor: "담임목사 김OO",
    summary: "큰 결단보다 오늘의 순종이 제자를 만듭니다."
  },
  {
    date: "2026-02-08",
    title: "은혜가 머무는 공동체",
    pastor: "담임목사 김OO",
    summary: "교회는 프로그램이 아니라 서로를 세우는 가족입니다."
  },
  {
    date: "2026-02-01",
    title: "성령으로 제자삼는 교회",
    pastor: "담임목사 김OO",
    summary: "개척교회의 시작점은 규모가 아닌 복음의 중심입니다."
  }
];

export const newsPosts = [
  {
    date: "2026-02-16",
    title: "2월 셋째 주 교회소식",
    category: "주보",
    body: "주일 예배 후 새가족 환영 모임이 있습니다."
  },
  {
    date: "2026-02-12",
    title: "마을 섬김 도시락 봉사 모집",
    category: "공지",
    body: "2월 22일(주일) 오후 2시, 봉사자를 모집합니다."
  },
  {
    date: "2026-02-03",
    title: "개척 감사예배 사진 업로드",
    category: "행사",
    body: "개척 감사예배 스케치를 사진 앨범에 업데이트했습니다."
  }
];

export const newcomerSteps = [
  "주일 예배 참석",
  "새가족 카드 작성",
  "웰컴 미팅(목회자/리더)",
  "소그룹 연결"
];
