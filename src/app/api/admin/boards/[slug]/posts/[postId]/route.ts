import { NextResponse } from "next/server";

import { getAdminSession, isAdminSession } from "@/auth";
import { AdminApiError } from "@/lib/admin-api";
import {
  deleteAdminBoardPost,
  getAdminBoardPost,
  toFriendlyAdminBoardMessage,
  updateAdminBoardPost,
} from "@/lib/admin-board-api";

interface RouteContext {
  params: Promise<{ slug: string; postId: string }>;
}

function unauthorizedResponse() {
  return NextResponse.json(
    { code: "UNAUTHORIZED", message: "관리자 로그인이 필요합니다." },
    { status: 401 },
  );
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    return unauthorizedResponse();
  }

  const { slug, postId } = await context.params;

  try {
    const post = await getAdminBoardPost(session.user.id, slug, postId);
    return NextResponse.json(post);
  } catch (error) {
    const status = error instanceof AdminApiError ? error.status : 400;

    return NextResponse.json(
      {
        code: "ADMIN_BOARD_POST_FETCH_FAILED",
        message: toFriendlyAdminBoardMessage(error, "게시글 상세를 불러오지 못했습니다."),
      },
      { status },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    return unauthorizedResponse();
  }

  const { slug, postId } = await context.params;

  try {
    const payload = await request.json();
    const post = await updateAdminBoardPost(session.user.id, slug, postId, payload);
    return NextResponse.json(post);
  } catch (error) {
    const status = error instanceof AdminApiError ? error.status : 400;

    return NextResponse.json(
      {
        code: "ADMIN_BOARD_POST_UPDATE_FAILED",
        message: toFriendlyAdminBoardMessage(error, "게시글을 저장하지 못했습니다."),
      },
      { status },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    return unauthorizedResponse();
  }

  const { slug, postId } = await context.params;

  try {
    await deleteAdminBoardPost(session.user.id, slug, postId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const status = error instanceof AdminApiError ? error.status : 400;

    return NextResponse.json(
      {
        code: "ADMIN_BOARD_POST_DELETE_FAILED",
        message: toFriendlyAdminBoardMessage(error, "게시글을 삭제하지 못했습니다."),
      },
      { status },
    );
  }
}
