import {
  getPublicBoardPost,
  listPublicBoardPosts,
  type PublicBoardPostAsset,
  type PublicBoardPostDetail,
  type PublicBoardPostListResponse,
  type PublicBoardPostSummary,
} from "@/lib/public-board-api";

const _assertBoardSlug: string = "announcements";
const _assertMenuId = 456;
const _assertPostId: string = "post-123";

const _assertPostAsset: PublicBoardPostAsset = {
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

const _assertPostSummary: PublicBoardPostSummary = {
  id: _assertPostId,
  boardId: "board-123",
  menuId: String(_assertMenuId),
  title: "주일 예배 안내",
  isPublic: true,
  isPinned: true,
  authorId: "writer-42",
  authorName: "관리자",
  viewCount: 12,
  contentHtml: "<p>예배 안내 본문</p>",
  hasInlineImage: true,
  hasVideoEmbed: true,
  hasAttachments: true,
  createdAt: "2026-04-20T00:00:00.000Z",
  updatedAt: "2026-04-20T01:00:00.000Z",
};

const _assertPostDetail: PublicBoardPostDetail = {
  id: _assertPostSummary.id,
  boardId: _assertPostSummary.boardId,
  menuId: _assertPostSummary.menuId,
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
  isPinned: _assertPostSummary.isPinned,
  authorId: _assertPostSummary.authorId,
  authorName: _assertPostSummary.authorName,
  viewCount: _assertPostSummary.viewCount,
  hasInlineImage: _assertPostSummary.hasInlineImage,
  hasVideoEmbed: _assertPostSummary.hasVideoEmbed,
  hasAttachments: _assertPostSummary.hasAttachments,
  createdAt: _assertPostSummary.createdAt,
  updatedAt: _assertPostSummary.updatedAt,
  assets: [_assertPostAsset],
};

const _assertListResponse: PublicBoardPostListResponse = {
  items: [_assertPostSummary],
  currentPage: 1,
  pageSize: 12,
  totalItems: 1,
  totalPages: 1,
};

async function assertPublicBoardApiContract() {
  const list = await listPublicBoardPosts(_assertBoardSlug, _assertMenuId, { page: 1, size: 12 });
  const detail = await getPublicBoardPost(_assertBoardSlug, _assertMenuId, _assertPostId);

  const _assertList: PublicBoardPostListResponse | null = list;
  const _assertDetail: PublicBoardPostDetail | null = detail;

  return {
    _assertList,
    _assertDetail,
  };
}

void _assertBoardSlug;
void _assertMenuId;
void _assertPostId;
void _assertPostAsset;
void _assertPostSummary;
void _assertPostDetail;
void _assertListResponse;
void assertPublicBoardApiContract;
