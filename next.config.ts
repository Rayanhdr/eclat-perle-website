import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow all remote URLs and unoptimized mode for base64 data URIs from localStorage
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
