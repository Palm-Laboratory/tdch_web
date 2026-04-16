import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminSession, isAdminSession } from "@/auth";
import { replaceAdminMenuTree, toFriendlyAdminMenuMessage } from "@/lib/admin-menu-api";

export async function PUT(request: Request) {
  const session = await getAdminSession();

  if (!isAdminSession(session) || !session.user.id) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "관리자 로그인이 필요합니다." },
      { status: 401 },
    );
  }

  try {
    const payload = (await request.json()) as { items: unknown[] };
    const tree = await replaceAdminMenuTree(session.user.id, payload.items as never);

    revalidateTag("menu");
    revalidatePath("/admin/menu");

    return NextResponse.json(tree);
  } catch (error) {
    return NextResponse.json(
      {
        code: "MENU_SAVE_FAILED",
        message: toFriendlyAdminMenuMessage(error, "메뉴를 저장하지 못했습니다."),
      },
      { status: 400 },
    );
  }
}
