import type { NextConfig } from "next";

const upstreamApiBaseUrl = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080"
).replace(/\/+$/, "");

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
  async redirects() {
    return [
      {
        source: "/sermons",
        destination: "/videos",
        permanent: false,
      },
      {
        source: "/sermons/shorts",
        destination: "/videos",
        permanent: false,
      },
      {
        source: "/admin/sermons",
        destination: "/admin/videos",
        permanent: false,
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
