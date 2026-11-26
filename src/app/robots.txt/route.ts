import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const robots = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "#DaumWebMasterTool:e5a513d714fe6a3cd636603479aeece658afd1717b83255c29d1e8d00b8043df:pdYA2AN84tHnNET51D/IqQ==",
    "",
  ].join("\n");

  return new Response(robots, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
