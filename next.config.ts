import type { NextConfig } from "next";
import { readApiBaseUrlFromEnv } from "./src/lib/api-base-url";

const upstreamApiBaseUrl = readApiBaseUrlFromEnv(process.env, [
  "API_BASE_URL",
  "NEXT_PUBLIC_API_BASE_URL",
]);

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/maintenance.html",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/upload/:path*",
        destination: `${upstreamApiBaseUrl}/upload/:path*`,
      },
    ];
  },
};

export default nextConfig;
