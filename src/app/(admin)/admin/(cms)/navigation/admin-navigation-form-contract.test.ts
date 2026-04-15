import NavigationDetailPage from "@/app/(admin)/admin/(cms)/navigation/[id]/page";
import NavigationForm from "@/app/(admin)/admin/(cms)/navigation/_components/navigation-form";
import type { AdminNavigationItem } from "@/lib/admin-navigation-api";

void NavigationDetailPage;
void NavigationForm;

type NavigationDetailPageProps = Parameters<typeof NavigationDetailPage>[0];
type NavigationFormProps = Parameters<typeof NavigationForm>[0];

const videoPageItem = {
  id: 102,
  parentId: null,
  label: "영상 메뉴",
  href: "/sermons",
  matchPath: "/sermons",
  linkType: "INTERNAL",
  menuType: "VIDEO_PAGE",
  videoRootKey: "sermons",
  landingMode: "ROOT",
  contentKindFilter: "LONG_FORM",
  visible: true,
  headerVisible: true,
  mobileVisible: true,
  lnbVisible: true,
  breadcrumbVisible: true,
  defaultLanding: false,
  sortOrder: 2,
  updatedAt: "2026-04-15T00:00:00+09:00",
  children: [],
} satisfies AdminNavigationItem;

const _assertPageProps: NavigationDetailPageProps = {
  params: Promise.resolve({ id: "102" }),
};

void _assertPageProps;

const _assertEditFormProps: NavigationFormProps = {
  mode: "edit",
  item: videoPageItem,
  parentOptions: [{ id: 1, label: "메인" }],
  createAction: async () => ({}),
  updateAction: async () => ({}),
  deleteAction: async () => undefined,
};

void _assertEditFormProps;

const _assertNewFormProps: NavigationFormProps = {
  mode: "new",
  parentOptions: [],
  createAction: async () => ({}),
};

void _assertNewFormProps;
