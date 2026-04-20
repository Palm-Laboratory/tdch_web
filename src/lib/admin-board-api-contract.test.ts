import {
  createAdminBoardPost,
  deleteAdminBoardPost,
  getAdminBoardPost,
  getAdminBoardPosts,
  getAdminBoards,
  toFriendlyAdminBoardMessage,
  updateAdminBoardPost,
  type AdminBoardPostAsset,
  type AdminBoardPostDetail,
  type AdminBoardPostSummary,
  type AdminBoardSummary,
  type BoardPostSavePayload,
} from "@/lib/admin-board-api";

const _assertBoardSummary: AdminBoardSummary = {
  id: "board-123",
  slug: "announcements",
  title: "공지사항",
  type: "ANNOUNCEMENT",
  description: "교회 공지사항 게시판",
};

const _assertPostSummary: AdminBoardPostSummary = {
  id: "post-123",
  boardId: _assertBoardSummary.id,
  title: "주일 예배 안내",
  isPublic: true,
  authorId: "admin-42",
  createdAt: "2026-04-20T00:00:00.000Z",
  updatedAt: "2026-04-20T01:00:00.000Z",
};

const _assertPostAsset: AdminBoardPostAsset = {
  id: "asset-123",
  kind: "INLINE_IMAGE",
  originalFilename: "bulletin.png",
  storedPath: "uploads/boards/asset-123.png",
  mimeType: "image/png",
  byteSize: 123_456,
  width: 1200,
  height: 630,
  sortOrder: 0,
};

const _assertPostDetail: AdminBoardPostDetail = {
  id: _assertPostSummary.id,
  boardId: _assertPostSummary.boardId,
  title: _assertPostSummary.title,
  contentJson: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "예배 안내 본문" }],
      },
    ],
  },
  contentHtml: "<p>예배 안내 본문</p>",
  isPublic: _assertPostSummary.isPublic,
  authorId: _assertPostSummary.authorId,
  createdAt: _assertPostSummary.createdAt,
  updatedAt: _assertPostSummary.updatedAt,
  assets: [_assertPostAsset],
};

const _assertSavePayload: BoardPostSavePayload = {
  title: "주일 예배 안내",
  contentJson: _assertPostDetail.contentJson,
  contentHtml: _assertPostDetail.contentHtml,
  isPublic: true,
  assetIds: [_assertPostAsset.id],
};

async function assertAdminBoardApiContract() {
  const actorId = "admin-42";
  const slug = _assertBoardSummary.slug;
  const postId = _assertPostSummary.id;

  const boards = await getAdminBoards(actorId);
  const posts = await getAdminBoardPosts(actorId, slug);
  const post = await getAdminBoardPost(actorId, slug, postId);
  const created = await createAdminBoardPost(actorId, slug, _assertSavePayload);
  const updated = await updateAdminBoardPost(actorId, slug, postId, _assertSavePayload);
  await deleteAdminBoardPost(actorId, slug, postId);

  const _assertBoards: AdminBoardSummary[] = boards;
  const _assertPosts: AdminBoardPostSummary[] = posts;
  const _assertPost: AdminBoardPostDetail = post;
  const _assertCreated: AdminBoardPostDetail = created;
  const _assertUpdated: AdminBoardPostDetail = updated;

  return {
    _assertBoards,
    _assertPosts,
    _assertPost,
    _assertCreated,
    _assertUpdated,
  };
}

const _assertFriendlyMessage: string = toFriendlyAdminBoardMessage(
  new Error("upstream failed"),
  "게시글을 저장하지 못했습니다.",
);

void _assertBoardSummary;
void _assertPostSummary;
void _assertPostAsset;
void _assertPostDetail;
void _assertSavePayload;
void _assertFriendlyMessage;
void assertAdminBoardApiContract;
