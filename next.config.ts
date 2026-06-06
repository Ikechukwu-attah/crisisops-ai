import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a self-contained server bundle in .next/standalone
  // Required for the Docker multi-stage build
  output: "standalone",
};

export default nextConfig;
