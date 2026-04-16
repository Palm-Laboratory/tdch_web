import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminSession, isAdminSession } from "@/auth";
import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import { toFriendlyAdminMenuMessage } from "@/lib/admin-menu-api";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "관리자 로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  try {
    await adminApiFetch(`/api/v1/admin/menu/${id}`, {
      method: "DELETE",
      headers: { "X-Admin-Actor-Id": session.user.id },
    });

    revalidateTag("menu");
    revalidatePath("/admin/menu");

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const status = error instanceof AdminApiError ? error.status : 400;
    return NextResponse.json(
      {
        code: "MENU_DELETE_FAILED",
        message: toFriendlyAdminMenuMessage(error, "메뉴를 삭제하지 못했습니다."),
      },
      { status },
    );
  }
}
