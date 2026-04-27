import { NextResponse } from "next/server";
import { joinApiUrl } from "@/lib/api-base-url";
import { getPublicBoardPost } from "@/lib/public-board-api";
import { resolvePublicMenuPath } from "@/lib/public-menu-api";
import { SERVER_API_BASE_URL } from "@/lib/server-config";

function normalizeBoardPath(value: string | null) {
  const normalized = value?.trim() ?? "";

  if (!normalized.startsWith("/")) {
    return null;
  }

  if (normalized.includes("..")) {
    return null;
  }

  return normalized.replace(/\/+$/, "") || "/";
}

function normalizeStoredPath(value: string) {
  const normalized = value.trim().replace(/^\/+/, "");

  if (!normalized || normalized.includes("..")) {
    return null;
  }

  return normalized;
}

function buildContentDisposition(filename: string) {
  const fallback = filename.replace(/[^\x20-\x7E]+/g, "_").replace(/["\\]/g, "_") || "attachment";
  const encoded = encodeURIComponent(filename);
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const boardPath = normalizeBoardPath(searchParams.get("boardPath"));
  const postId = searchParams.get("postId")?.trim() ?? "";
  const assetId = searchParams.get("assetId")?.trim() ?? "";
  const filename = searchParams.get("filename")?.trim() || "attachment";

  if (!boardPath || !postId || !assetId) {
    return NextResponse.json({ message: "Invalid attachment request." }, { status: 400 });
  }

  const resolved = await resolvePublicMenuPath(boardPath);

  if (!resolved || resolved.type !== "BOARD" || !resolved.boardKey) {
    return NextResponse.json({ message: "Board not found." }, { status: 404 });
  }

  const post = await getPublicBoardPost(resolved.boardKey, resolved.menuId, postId);

  if (!post) {
    return NextResponse.json({ message: "Post not found." }, { status: 404 });
  }

  const asset = post.assets.find((candidate) => candidate.id === assetId && candidate.kind === "FILE_ATTACHMENT");

  if (!asset) {
    return NextResponse.json({ message: "Attachment not found." }, { status: 404 });
  }

  const storedPath = normalizeStoredPath(asset.storedPath);

  if (!storedPath) {
    return NextResponse.json({ message: "Attachment path is invalid." }, { status: 404 });
  }

  const upstream = await fetch(joinApiUrl(SERVER_API_BASE_URL, `/upload/${storedPath}`), {
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ message: "Failed to download attachment." }, { status: upstream.status || 502 });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  const contentLength = upstream.headers.get("content-length");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  headers.set("Content-Disposition", buildContentDisposition(filename));
  headers.set("Cache-Control", "no-store");

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}
