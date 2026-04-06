import { NextRequest } from "next/server";
import {
  DEFAULT_CHURCH_LATITUDE,
  DEFAULT_CHURCH_LONGITUDE,
  NAVER_STATIC_MAP_CLIENT_ID,
  NAVER_STATIC_MAP_CLIENT_SECRET,
} from "@/lib/server-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!NAVER_STATIC_MAP_CLIENT_ID || !NAVER_STATIC_MAP_CLIENT_SECRET) {
    return new Response("Static map credentials are missing.", { status: 503 });
  }

  const lat = request.nextUrl.searchParams.get("lat") ?? DEFAULT_CHURCH_LATITUDE;
  const lng = request.nextUrl.searchParams.get("lng") ?? DEFAULT_CHURCH_LONGITUDE;

  const params = new URLSearchParams({
    w: "1280",
    h: "720",
    center: `${lng},${lat}`,
    level: "16",
    scale: "2",
    format: "png",
    maptype: "basic",
    lang: "ko",
    markers: `type:d|size:mid|color:0x2A4F8F|pos:${lng} ${lat}`,
  });

  const upstream = await fetch(
    `https://maps.apigw.ntruss.com/map-static/v2/raster?${params.toString()}`,
    {
      headers: {
        "x-ncp-apigw-api-key-id": NAVER_STATIC_MAP_CLIENT_ID,
        "x-ncp-apigw-api-key": NAVER_STATIC_MAP_CLIENT_SECRET,
      },
      cache: "no-store",
    }
  );

  if (!upstream.ok) {
    const message = await upstream.text();

    return new Response(message || "Failed to load static map.", {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "text/plain; charset=utf-8",
      },
    });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/png";
  const image = await upstream.arrayBuffer();

  return new Response(image, {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
