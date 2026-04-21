import { NextRequest, NextResponse } from "next/server";
import { joinApiUrl } from "@/lib/api-base-url";
import { SERVER_API_BASE_URL } from "@/lib/server-config";

const UPSTREAM_TIMEOUT_MS = 8000;

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path")?.trim();
  const page = request.nextUrl.searchParams.get("page")?.trim() ?? "1";
  const size = request.nextUrl.searchParams.get("size")?.trim() ?? "8";

  if (!path) {
    return NextResponse.json({ message: "path is required" }, { status: 400 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(
      joinApiUrl(
        SERVER_API_BASE_URL,
        `/api/v1/public/videos/items?path=${encodeURIComponent(path)}&page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`,
      ),
      {
        cache: "no-store",
        signal: controller.signal,
      },
    );

    const payload = await response.text();

    return new NextResponse(payload, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          code: "UPSTREAM_TIMEOUT",
          message: "영상 목록 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.",
        },
        { status: 504 },
      );
    }

    console.error("Failed to proxy public video items request", {
      error,
      page,
      path,
      size,
    });

    return NextResponse.json(
      {
        code: "UPSTREAM_FETCH_FAILED",
        message: "영상 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
