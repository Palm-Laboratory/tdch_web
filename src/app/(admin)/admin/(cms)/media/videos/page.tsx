import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import {
  getAdminMediaVideoDetail,
  getAdminMediaVideos,
  type AdminMediaVideoDetail,
  type AdminMediaVideoSummary,
  type VideoContentForm,
} from "@/lib/admin-media-videos-api";
import MediaVideoManagementClient from "./_components/media-video-management-client";

async function resolveInitialState(): Promise<{
  initialForm: VideoContentForm;
  initialItems: AdminMediaVideoSummary[];
  initialDetail: AdminMediaVideoDetail | null;
}> {
  const longform = await getAdminMediaVideos("LONGFORM");
  let initialForm: VideoContentForm = "LONGFORM";
  let initialItems = longform.items;

  if (initialItems.length === 0) {
    const shortform = await getAdminMediaVideos("SHORTFORM");
    if (shortform.items.length > 0) {
      initialForm = "SHORTFORM";
      initialItems = shortform.items;
    }
  }

  const initialDetail = initialItems[0]
    ? await getAdminMediaVideoDetail(initialItems[0].videoId)
    : null;

  return {
    initialForm,
    initialItems,
    initialDetail,
  };
}

export default async function AdminMediaVideosPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/media/videos");
  }

  const { initialForm, initialItems, initialDetail } = await resolveInitialState();

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-[12px] text-[#8fa3bb]">
        <Link href="/admin" className="flex items-center transition hover:text-[#3f74c7]">
          홈
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[#4a6484]">운영</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[#4a6484]">미디어</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-medium text-[#132033]">영상 관리</span>
      </nav>

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#0f1c2e]">영상 관리</h1>
        <p className="text-[13px] text-[#5d6f86]">
          공개 영상 메타를 운영용으로 덮어쓰고, 숨김 여부와 대표 정보를 관리합니다.
        </p>
      </div>

      <MediaVideoManagementClient
        initialForm={initialForm}
        initialItems={initialItems}
        initialDetail={initialDetail}
      />
    </div>
  );
}
