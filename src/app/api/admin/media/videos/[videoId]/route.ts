import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminSession, isAdminSession } from "@/auth";
import {
  getAdminMediaVideoDetail,
  toFriendlyAdminMediaVideoMessage,
  updateAdminMediaVideoMeta,
  type UpdateAdminMediaVideoMetaRequest,
} from "@/lib/admin-media-videos-api";
import { AdminApiError } from "@/lib/admin-api";

interface RouteContext {
  params: Promise<{ videoId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "관리자 로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const { videoId } = await context.params;

  try {
    const video = await getAdminMediaVideoDetail(videoId);
    return NextResponse.json(video);
  } catch (error) {
    const status = error instanceof AdminApiError ? error.status : 400;
    return NextResponse.json(
      {
        code: "ADMIN_MEDIA_VIDEO_FETCH_FAILED",
        message: toFriendlyAdminMediaVideoMessage(error, "영상 상세를 불러오지 못했습니다."),
      },
      { status },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "관리자 로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const { videoId } = await context.params;

  try {
    const payload = (await request.json()) as UpdateAdminMediaVideoMetaRequest;
    const updated = await updateAdminMediaVideoMeta(videoId, payload);

    revalidateTag("media-videos");
    revalidatePath("/admin/media/videos");

    return NextResponse.json(updated);
  } catch (error) {
    const status = error instanceof AdminApiError ? error.status : 400;
    return NextResponse.json(
      {
        code: "ADMIN_MEDIA_VIDEO_UPDATE_FAILED",
        message: toFriendlyAdminMediaVideoMessage(error, "영상 메타를 저장하지 못했습니다."),
      },
      { status },
    );
  }
}
