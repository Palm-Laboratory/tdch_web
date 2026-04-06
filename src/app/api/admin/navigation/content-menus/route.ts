import { NextResponse } from "next/server";
import { getAdminSession, isAdminSession } from "@/auth";
import { AdminApiError } from "@/lib/admin-api";
import { getAdminContentMenus } from "@/lib/admin-navigation-api";

export async function GET() {
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
    const data = await getAdminContentMenus();
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
        message: "콘텐츠 메뉴 목록을 불러오는 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
