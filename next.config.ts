import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/jobs/in-:county",
        destination: "/jobs/county-route/:county",
      },
    ];
  },
};

export default nextConfig;
