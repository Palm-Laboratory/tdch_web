import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import {
  getAdminVideoDetail,
  getAdminVideos,
  type AdminVideoDetail,
  type AdminVideoSummary,
  type VideoContentForm,
} from "@/lib/admin-videos-api";
import VideoManagementClient from "./_components/video-management-client";

async function resolveInitialState(): Promise<{
  initialForm: VideoContentForm;
  initialItems: AdminVideoSummary[];
  initialDetail: AdminVideoDetail | null;
}> {
  const longform = await getAdminVideos("LONGFORM");
  let initialForm: VideoContentForm = "LONGFORM";
  let initialItems = longform.items;

  if (initialItems.length === 0) {
    const shortform = await getAdminVideos("SHORTFORM");
    if (shortform.items.length > 0) {
      initialForm = "SHORTFORM";
      initialItems = shortform.items;
    }
  }

  const initialDetail = initialItems[0]
    ? await getAdminVideoDetail(initialItems[0].videoId)
    : null;

  return {
    initialForm,
    initialItems,
    initialDetail,
  };
}

export default async function AdminVideosPage() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin/videos");
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

      <VideoManagementClient
        initialForm={initialForm}
        initialItems={initialItems}
        initialDetail={initialDetail}
      />
    </div>
  );
}
