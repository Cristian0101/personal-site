import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
  reactCompiler: true,
  devIndicators: false,
  images: {
    qualities: [75, 92],
  },
};

export default nextConfig;
