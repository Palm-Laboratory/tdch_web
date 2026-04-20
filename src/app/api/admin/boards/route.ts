import { NextResponse } from "next/server";

import { getAdminSession, isAdminSession } from "@/auth";
import { AdminApiError } from "@/lib/admin-api";
import { getAdminBoards, toFriendlyAdminBoardMessage } from "@/lib/admin-board-api";

function unauthorizedResponse() {
  return NextResponse.json(
    { code: "UNAUTHORIZED", message: "관리자 로그인이 필요합니다." },
    { status: 401 },
  );
}

export async function GET() {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    return unauthorizedResponse();
  }

  try {
    const boards = await getAdminBoards(session.user.id);
    return NextResponse.json({ boards });
  } catch (error) {
    const status = error instanceof AdminApiError ? error.status : 400;

    return NextResponse.json(
      {
        code: "ADMIN_BOARD_FETCH_FAILED",
        message: toFriendlyAdminBoardMessage(error, "게시판 목록을 불러오지 못했습니다."),
      },
      { status },
    );
  }
}
