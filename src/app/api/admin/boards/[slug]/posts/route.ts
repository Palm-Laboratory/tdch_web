import { NextResponse } from "next/server";

import { getAdminSession, isAdminSession } from "@/auth";
import { AdminApiError } from "@/lib/admin-api";
import {
  createAdminBoardPost,
  getAdminBoardPosts,
  toFriendlyAdminBoardMessage,
} from "@/lib/admin-board-api";

interface RouteContext {
  params: Promise<{ slug: string }>;
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

  const { slug } = await context.params;

  try {
    const posts = await getAdminBoardPosts(session.user.id, slug);
    return NextResponse.json({ posts });
  } catch (error) {
    const status = error instanceof AdminApiError ? error.status : 400;

    return NextResponse.json(
      {
        code: "ADMIN_BOARD_POSTS_FETCH_FAILED",
        message: toFriendlyAdminBoardMessage(error, "게시글 목록을 불러오지 못했습니다."),
      },
      { status },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    return unauthorizedResponse();
  }

  const { slug } = await context.params;

  try {
    const payload = await request.json();
    const post = await createAdminBoardPost(session.user.id, slug, payload);
    return NextResponse.json(post);
  } catch (error) {
    const status = error instanceof AdminApiError ? error.status : 400;

    return NextResponse.json(
      {
        code: "ADMIN_BOARD_POST_CREATE_FAILED",
        message: toFriendlyAdminBoardMessage(error, "게시글을 저장하지 못했습니다."),
      },
      { status },
    );
  }
}
