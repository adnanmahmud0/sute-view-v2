import path from "node:path";
import type { NextConfig } from "next";

import bundleAnalyzer from "@next/bundle-analyzer";
import { loadEnvConfig } from "@next/env";

// Load root monorepo .env file into process.env in development only
if (process.env.NODE_ENV !== "production") {
  loadEnvConfig(path.resolve(__dirname, "../../"));
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
});

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID
  },
  ...(process.env.DOCKER_BUILD === "true"
    ? {
        output: "standalone" as const,
        outputFileTracingRoot: path.resolve(__dirname, "../../")
      }
    : {}),
  htmlLimitedBots: /.*/
};

export default withBundleAnalyzer(nextConfig);
