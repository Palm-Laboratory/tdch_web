import AdminMediaVideoDetailPage from "@/app/(admin)/admin/(cms)/media/[siteKey]/videos/[youtubeVideoId]/page";
import AdminMediaVideoDetailForm from "@/app/(admin)/admin/(cms)/media/[siteKey]/videos/[youtubeVideoId]/_components/admin-media-video-detail-form";
import { updateAdminMediaVideoAction } from "@/app/(admin)/admin/(cms)/media/[siteKey]/videos/[youtubeVideoId]/actions";
import type { AdminVideoMetadataResponse } from "@/lib/admin-media-shared";

void AdminMediaVideoDetailPage;
void AdminMediaVideoDetailForm;
void updateAdminMediaVideoAction;

type AdminMediaVideoDetailPageProps = Parameters<typeof AdminMediaVideoDetailPage>[0];
type AdminMediaVideoDetailFormProps = Parameters<typeof AdminMediaVideoDetailForm>[0];
type UpdateAdminMediaVideoActionResult = Awaited<ReturnType<typeof updateAdminMediaVideoAction>>;

const _assertPageProps: AdminMediaVideoDetailPageProps = {
  params: Promise.resolve({
    siteKey: "sermons",
    youtubeVideoId: "abc123",
  }),
};

void _assertPageProps;

const _assertFormProps: AdminMediaVideoDetailFormProps = {
  video: {
    youtubeVideoId: "abc123",
    originalTitle: "주일예배 1부",
    originalDescription: "설교 영상 메타데이터",
    publishedAt: "2026-04-15T00:00:00+09:00",
    watchUrl: "https://www.youtube.com/watch?v=abc123",
    embedUrl: "https://www.youtube.com/embed/abc123",
    lastSyncedAt: null,
    visible: true,
    featured: false,
    pinnedRank: null,
    manualTitle: "주일예배 1부 | 이진욱 목사",
    manualThumbnailUrl: "https://img.youtube.com/vi/abc123/hqdefault.jpg",
    manualPublishedDate: "2026-04-15",
    manualKind: "LONG_FORM",
    preacher: "이진욱",
    scripture: "요한복음 3:16",
    scriptureBody: "하나님이 세상을 이처럼 사랑하사",
    serviceType: "주일예배",
    summary: "예배 설교 요약",
    tags: ["주일예배", "설교"],
  } satisfies AdminVideoMetadataResponse,
  saveAction: updateAdminMediaVideoAction.bind(null, "sermons", "abc123"),
};

void _assertFormProps;

const _assertActionResult: UpdateAdminMediaVideoActionResult = {
  success: true,
  message: "비디오 메타데이터를 저장했습니다.",
};

void _assertActionResult;
