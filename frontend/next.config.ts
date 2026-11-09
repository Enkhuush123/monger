import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const rawBackend = (process.env.BACKEND_URL || "http://127.0.0.1:8000").trim();
    // Normalize: strip trailing slashes and /api/v1 suffix to avoid double pathing
    const backendUrl = rawBackend.replace(/\/+$/, "").replace(/\/api\/v1$/, "");

    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
