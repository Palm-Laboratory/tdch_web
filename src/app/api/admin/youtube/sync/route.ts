import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminSession, isAdminSession } from "@/auth";
import { syncAdminYouTube, toFriendlyAdminMenuMessage } from "@/lib/admin-menu-api";

export async function POST() {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "관리자 로그인이 필요합니다." },
      { status: 401 },
    );
  }

  try {
    const result = await syncAdminYouTube(session.user.id);

    revalidateTag("menu");
    revalidatePath("/admin/menu");

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        code: "YOUTUBE_SYNC_FAILED",
        message: toFriendlyAdminMenuMessage(error, "유튜브 동기화를 실행하지 못했습니다."),
      },
      { status: 400 },
    );
  }
}
