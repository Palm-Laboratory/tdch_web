import type { NextConfig } from "next";

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
        source: "/media/videos",
        destination: "/videos",
        permanent: false,
      },
      {
        source: "/media/videos/shorts",
        destination: "/videos",
        permanent: false,
      },
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
        source: "/admin/media/videos",
        destination: "/admin/videos",
        permanent: false,
      },
      {
        source: "/admin/sermons",
        destination: "/admin/videos",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
