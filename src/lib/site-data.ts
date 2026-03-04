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
