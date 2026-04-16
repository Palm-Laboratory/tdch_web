import { NextResponse } from "next/server";
import { getAdminSession, isAdminSession } from "@/auth";
import {
  getAdminMediaVideos,
  type VideoContentForm,
  toFriendlyAdminMediaVideoMessage,
} from "@/lib/admin-media-videos-api";
import { AdminApiError } from "@/lib/admin-api";

const VALID_FORMS = new Set<VideoContentForm>(["LONGFORM", "SHORTFORM"]);

export async function GET(request: Request) {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "관리자 로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const formParam = searchParams.get("form");

  if (formParam && !VALID_FORMS.has(formParam as VideoContentForm)) {
    return NextResponse.json(
      { code: "INVALID_FORM", message: "지원하지 않는 영상 분류입니다." },
      { status: 400 },
    );
  }

  try {
    const videos = await getAdminMediaVideos((formParam as VideoContentForm | null) ?? undefined);
    return NextResponse.json(videos);
  } catch (error) {
    const status = error instanceof AdminApiError ? error.status : 400;
    return NextResponse.json(
      {
        code: "ADMIN_MEDIA_VIDEOS_FETCH_FAILED",
        message: toFriendlyAdminMediaVideoMessage(error, "영상 목록을 불러오지 못했습니다."),
      },
      { status },
    );
  }
}
