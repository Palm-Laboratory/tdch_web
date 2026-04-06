import { NextResponse } from "next/server";
import { getAdminSession, isAdminSession } from "@/auth";
import { AdminApiError } from "@/lib/admin-api";
import { getAdminVideoMetadata } from "@/lib/admin-media-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ videoId: string }> },
) {
  const session = await getAdminSession();
  if (!isAdminSession(session)) {
    return NextResponse.json({ code: "UNAUTHORIZED", message: "로그인이 필요합니다." }, { status: 401 });
  }

  const { videoId } = await params;
  const actorId = session.user.id ?? "";

  try {
    const metadata = await getAdminVideoMetadata(actorId, videoId);
    return NextResponse.json(metadata);
  } catch (error) {
    if (error instanceof AdminApiError) {
      return NextResponse.json({ code: error.code, message: error.message }, { status: error.status });
    }
    return NextResponse.json({ code: "INTERNAL_SERVER_ERROR", message: "메타데이터를 불러오지 못했습니다." }, { status: 500 });
  }
}
