import AdminMediaDetailPage from "@/app/(admin)/admin/(cms)/media/[siteKey]/page";
import AdminMediaDetailForm from "@/app/(admin)/admin/(cms)/media/[siteKey]/_components/admin-media-detail-form";
import { updateAdminMediaDetailAction } from "@/app/(admin)/admin/(cms)/media/[siteKey]/actions";
import type { AdminPlaylistDetailResponse } from "@/lib/admin-media-api";

void AdminMediaDetailPage;
void AdminMediaDetailForm;
void updateAdminMediaDetailAction;

type AdminMediaDetailPageProps = Parameters<typeof AdminMediaDetailPage>[0];
type AdminMediaDetailFormProps = Parameters<typeof AdminMediaDetailForm>[0];
type UpdateAdminMediaDetailActionResult = Awaited<ReturnType<typeof updateAdminMediaDetailAction>>;

const _assertPageProps: AdminMediaDetailPageProps = {
  params: Promise.resolve({ siteKey: "sermons" }),
};

void _assertPageProps;

const _assertFormProps: AdminMediaDetailFormProps = {
  playlist: {
    id: 42,
    menuName: "주일예배",
    siteKey: "sermons",
    slug: "sunday-worship",
    contentKind: "LONG_FORM",
    status: "PUBLISHED",
    active: true,
    navigationVisible: true,
    sortOrder: 1,
    description: "예배 영상 메뉴",
    discoveredAt: null,
    publishedAt: null,
    lastModifiedBy: null,
    youtubePlaylistId: "PL_TEST_PLAYLIST",
    youtubeTitle: "Sunday Worship",
    youtubeDescription: "Original playlist description",
    channelTitle: "TDCH",
    thumbnailUrl: "https://img.youtube.com/vi/test/hqdefault.jpg",
    itemCount: 12,
    syncEnabled: true,
    lastSyncedAt: null,
    lastDiscoveredAt: null,
    lastSyncSucceededAt: null,
    lastSyncFailedAt: null,
    lastSyncErrorMessage: null,
    discoverySource: null,
    operationStatus: "READY",
  } satisfies AdminPlaylistDetailResponse,
  saveAction: updateAdminMediaDetailAction.bind(null, "sermons"),
};

void _assertFormProps;

const _assertActionResult: UpdateAdminMediaDetailActionResult = {
  success: true,
  message: "예배 영상 메뉴를 저장했습니다.",
};

void _assertActionResult;
