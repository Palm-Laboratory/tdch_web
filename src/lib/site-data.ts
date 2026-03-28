import type { NavigationResponse, NavMenuGroup } from "@/lib/navigation-types";
import { toNavMenuGroups } from "@/lib/navigation-utils";

export const fallbackNavigationResponse: NavigationResponse = {
  groups: [
    {
      key: "about",
      href: "/about",
      label: "교회 소개",
      matchPath: "/about",
      linkType: "INTERNAL",
      contentSiteKey: null,
      visible: true,
      headerVisible: true,
      mobileVisible: true,
      lnbVisible: true,
      breadcrumbVisible: true,
      defaultLandingHref: "/about/greeting",
      items: [
        {
          key: "about-greeting",
          href: "/about/greeting",
          label: "인사말/비전",
          matchPath: "/about/greeting",
          linkType: "INTERNAL",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: true,
        },
        {
          key: "about-pastor",
          href: "/about/pastor",
          label: "담임목사 소개",
          matchPath: "/about/pastor",
          linkType: "INTERNAL",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
        {
          key: "about-service-times",
          href: "/about/service-times",
          label: "예배 시간 안내",
          matchPath: "/about/service-times",
          linkType: "INTERNAL",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
        {
          key: "about-location",
          href: "/about/location",
          label: "오시는 길",
          matchPath: "/about/location",
          linkType: "INTERNAL",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
        {
          key: "about-history",
          href: "/about/history",
          label: "교회연혁",
          matchPath: "/about/history",
          linkType: "INTERNAL",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
        {
          key: "about-giving",
          href: "/about/giving",
          label: "헌금 안내",
          matchPath: "/about/giving",
          linkType: "INTERNAL",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
      ],
    },
    {
      key: "sermons",
      href: "/sermons",
      label: "예배 영상",
      matchPath: "/sermons",
      linkType: "INTERNAL",
      contentSiteKey: null,
      visible: true,
      headerVisible: true,
      mobileVisible: true,
      lnbVisible: true,
      breadcrumbVisible: true,
      defaultLandingHref: "/sermons/messages",
      items: [
        {
          key: "sermons-messages",
          href: "/sermons/messages",
          label: "말씀/설교",
          matchPath: "/sermons/messages",
          linkType: "CONTENT_REF",
          contentSiteKey: "messages",
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: true,
        },
        {
          key: "sermons-better-devotion",
          href: "/sermons/better-devotion",
          label: "더 좋은 묵상",
          matchPath: "/sermons/better-devotion",
          linkType: "CONTENT_REF",
          contentSiteKey: "better-devotion",
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
        {
          key: "sermons-its-okay",
          href: "/sermons/its-okay",
          label: "그래도 괜찮아",
          matchPath: "/sermons/its-okay",
          linkType: "CONTENT_REF",
          contentSiteKey: "its-okay",
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
      ],
    },
    {
      key: "newcomer",
      href: "/newcomer",
      label: "제자 양육",
      matchPath: "/newcomer",
      linkType: "INTERNAL",
      contentSiteKey: null,
      visible: true,
      headerVisible: true,
      mobileVisible: true,
      lnbVisible: true,
      breadcrumbVisible: true,
      defaultLandingHref: "/newcomer",
      items: [
        {
          key: "newcomer-main",
          href: "/newcomer",
          label: "새가족 안내",
          matchPath: "/newcomer",
          linkType: "INTERNAL",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: true,
        },
        {
          key: "newcomer-care",
          href: "/newcomer/care",
          label: "새가족 양육",
          matchPath: "/newcomer/care",
          linkType: "INTERNAL",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
        {
          key: "newcomer-curriculum",
          href: "/newcomer/curriculum",
          label: "교육 과정",
          matchPath: "/newcomer/curriculum",
          linkType: "INTERNAL",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
      ],
    },
    {
      key: "location-contact",
      href: "/about/location",
      label: "오시는 길/문의",
      matchPath: "/about/location",
      linkType: "INTERNAL",
      contentSiteKey: null,
      visible: true,
      headerVisible: true,
      mobileVisible: true,
      lnbVisible: true,
      breadcrumbVisible: true,
      defaultLandingHref: "/about/location#map",
      items: [
        {
          key: "location-contact-map",
          href: "/about/location#map",
          label: "지도",
          matchPath: "/about/location",
          linkType: "ANCHOR",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
        {
          key: "location-contact-info",
          href: "/about/location#contact-info",
          label: "연락처",
          matchPath: "/about/location",
          linkType: "ANCHOR",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
      ],
    },
    {
      key: "giving",
      href: "/about/giving",
      label: "헌금 안내",
      matchPath: "/about/giving",
      linkType: "INTERNAL",
      contentSiteKey: null,
      visible: true,
      headerVisible: true,
      mobileVisible: true,
      lnbVisible: true,
      breadcrumbVisible: true,
      defaultLandingHref: "/about/giving",
      items: [
        {
          key: "giving-online",
          href: "/about/giving",
          label: "온라인 헌금방법",
          matchPath: "/about/giving",
          linkType: "INTERNAL",
          contentSiteKey: null,
          visible: true,
          headerVisible: true,
          mobileVisible: true,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: true,
        },
      ],
    },
    {
      key: "news",
      href: "/news",
      label: "교회 소식",
      matchPath: "/news",
      linkType: "INTERNAL",
      contentSiteKey: null,
      visible: true,
      headerVisible: false,
      mobileVisible: false,
      lnbVisible: true,
      breadcrumbVisible: true,
      defaultLandingHref: null,
      items: [
        {
          key: "news-notice",
          href: "/news#notice",
          label: "공지",
          matchPath: "/news",
          linkType: "ANCHOR",
          contentSiteKey: null,
          visible: true,
          headerVisible: false,
          mobileVisible: false,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
        {
          key: "news-bulletin",
          href: "/news#bulletin",
          label: "주보",
          matchPath: "/news",
          linkType: "ANCHOR",
          contentSiteKey: null,
          visible: true,
          headerVisible: false,
          mobileVisible: false,
          lnbVisible: true,
          breadcrumbVisible: true,
          defaultLanding: false,
        },
      ],
    },
  ],
};

export const navMenuGroups: NavMenuGroup[] = toNavMenuGroups(fallbackNavigationResponse);

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
  { href: "/newcomer", title: "새가족 안내", enTitle: "Newcomer", imageName: "/images/quick_menu/people-group.png" },
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

// ─── 설교 목록 전체 데이터 (임시 더미 — 추후 API 연동 예정) ──────────────

export const sermonList: SermonCardData[] = [
  { href: "", thumbnail: "/images/sermon_thumb/0302_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "목마름을 채우시는 사랑", scripture: "요한복음 4:1~42", pastor: "이진욱 목사", date: "2026.03.02" },
  { href: "", thumbnail: "/images/sermon_thumb/0228_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "새 시작을 주시는 사랑", scripture: "요한복음 2:1~11", pastor: "이진욱 목사", date: "2026.02.28" },
  { href: "", thumbnail: "/images/sermon_thumb/0302_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "참된 안식을 주시는 하나님", scripture: "마태복음 11:28~30", pastor: "이진욱 목사", date: "2026.02.23" },
  { href: "", thumbnail: "/images/sermon_thumb/0228_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "수요예배", title: "빛 가운데 행하라", scripture: "요한1서 1:5~10", pastor: "이진욱 목사", date: "2026.02.19" },
  { href: "", thumbnail: "/images/sermon_thumb/0302_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "사랑의 빚진 자", scripture: "로마서 13:8~14", pastor: "이진욱 목사", date: "2026.02.16" },
  { href: "", thumbnail: "/images/sermon_thumb/0228_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "금요기도회", title: "주의 이름을 부르는 자", scripture: "시편 145:18~21", pastor: "이진욱 목사", date: "2026.02.14" },
  { href: "", thumbnail: "/images/sermon_thumb/0302_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "믿음의 선한 싸움", scripture: "디모데전서 6:11~16", pastor: "이진욱 목사", date: "2026.02.09" },
  { href: "", thumbnail: "/images/sermon_thumb/0228_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "수요예배", title: "성령의 열매", scripture: "갈라디아서 5:22~26", pastor: "이진욱 목사", date: "2026.02.05" },
  { href: "", thumbnail: "/images/sermon_thumb/0302_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "끝까지 견디는 자", scripture: "마태복음 24:9~14", pastor: "이진욱 목사", date: "2026.02.02" },
  { href: "", thumbnail: "/images/sermon_thumb/0228_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "하나님의 뜻 안에서", scripture: "로마서 12:1~2", pastor: "이진욱 목사", date: "2026.01.26" },
  { href: "", thumbnail: "/images/sermon_thumb/0302_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "금요기도회", title: "여호와를 신뢰하는 자", scripture: "잠언 3:5~8", pastor: "이진욱 목사", date: "2026.01.24" },
  { href: "", thumbnail: "/images/sermon_thumb/0228_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "은혜와 평강이 넘치기를", scripture: "베드로후서 1:1~4", pastor: "이진욱 목사", date: "2026.01.19" },
  { href: "", thumbnail: "/images/sermon_thumb/0302_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "수요예배", title: "주님의 음성을 듣다", scripture: "요한복음 10:27~30", pastor: "이진욱 목사", date: "2026.01.15" },
  { href: "", thumbnail: "/images/sermon_thumb/0228_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "거룩한 부르심에 합당하게", scripture: "에베소서 4:1~6", pastor: "이진욱 목사", date: "2026.01.12" },
  { href: "", thumbnail: "/images/sermon_thumb/0302_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "새해 첫 걸음", scripture: "여호수아 1:1~9", pastor: "이진욱 목사", date: "2026.01.05" },
  { href: "", thumbnail: "/images/sermon_thumb/0228_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "금요기도회", title: "감사의 제사를 드리라", scripture: "시편 100:1~5", pastor: "이진욱 목사", date: "2026.01.03" },
  { href: "", thumbnail: "/images/sermon_thumb/0302_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "성탄의 기쁨", scripture: "누가복음 2:8~20", pastor: "이진욱 목사", date: "2025.12.22" },
  { href: "", thumbnail: "/images/sermon_thumb/0228_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "대림절의 소망", scripture: "이사야 9:2~7", pastor: "이진욱 목사", date: "2025.12.15" },
  { href: "", thumbnail: "/images/sermon_thumb/0302_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "수요예배", title: "깨어 기도하라", scripture: "마태복음 26:36~41", pastor: "이진욱 목사", date: "2025.12.11" },
  { href: "", thumbnail: "/images/sermon_thumb/0228_thumb.jpg", thumbnailAlt: "설교 썸네일", category: "설교", type: "주일예배", title: "하나님의 시간표", scripture: "전도서 3:1~8", pastor: "이진욱 목사", date: "2025.12.08" },
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
  { name: "주일 1부 예배 (준비 중)", day: "주일", time: "11:00", ampm: "AM", location: "나인아트홀(지하1층)" },
  { name: "젊은이 예배", day: "주일", time: "2:00", ampm: "PM", location: "나인아트홀(지하1층)" },
  { name: "새가족 양육", day: "주일", time: "예배 후", ampm: "PM", location: "나인아트홀(지하1층)" },
  // { name: "새벽 기도회", day: "월~금", time: "5:30", ampm: "AM", location: "나인아트홀(지하1층)" },
  { name: "리더 모임", day: "수요일", time: "8:30", ampm: "PM", location: "나인아트홀(지하1층)" },
  { name: "금요 기도회", day: "금요일", time: "8:00", ampm: "PM", location: "나인아트홀(지하1층)" },
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
