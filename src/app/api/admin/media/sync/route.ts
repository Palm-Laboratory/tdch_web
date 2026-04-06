import { NextResponse } from "next/server";
import { getAdminSession, isAdminSession } from "@/auth";
import {
  AdminApiError,
  type AdminMediaSyncResponse,
  adminApiFetch,
} from "@/lib/admin-api";

export async function POST() {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    return NextResponse.json(
      {
        code: "UNAUTHORIZED",
        message: "관리자 로그인 후 다시 시도해 주세요.",
      },
      { status: 401 },
    );
  }

  try {
    const upstreamResponse = await adminApiFetch("/api/v1/admin/media/sync", {
      method: "POST",
    });
    const data = (await upstreamResponse.json()) as AdminMediaSyncResponse;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof AdminApiError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "관리자 API 프록시 처리 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
