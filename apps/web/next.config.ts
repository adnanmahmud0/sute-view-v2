import path from "node:path";
import type { NextConfig } from "next";

import bundleAnalyzer from "@next/bundle-analyzer";
import { loadEnvConfig } from "@next/env";
import type { RuleSetRule } from "webpack";

// Load root monorepo .env file into process.env
loadEnvConfig(path.resolve(__dirname, "../../"));

if (process.env.NODE_ENV !== "production" && !process.env.__FRONTEND_BANNER_PRINTED) {
  process.env.__FRONTEND_BANNER_PRINTED = "true";
  const width = 56;
  const line = "─".repeat(width);
  const cyan = "\x1b[36m\x1b[1m";
  const white = "\x1b[37m";
  const gray = "\x1b[90m";
  const green = "\x1b[32m\x1b[1m";
  const reset = "\x1b[0m";

  const localUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8001";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003/api/v1";

  console.log();
  console.log(`${cyan}  ╭${line}╮${reset}`);
  console.log(
    `${cyan}  │  ${reset}\x1b[1m\x1b[37m▲ NEXT.JS 16 FRONTEND${reset}${gray} (App Router + Turbopack)${reset}` +
      " ".repeat(Math.max(0, width - 42)) +
      `${cyan}│${reset}`
  );
  console.log(`${cyan}  ├${line}┤${reset}`);
  console.log(
    `${cyan}  │  ${gray}➜${reset} ${white}Local:       ${cyan}${localUrl}/${reset}` +
      " ".repeat(Math.max(0, width - 15 - `${localUrl}/`.length)) +
      `${cyan}│${reset}`
  );
  console.log(
    `${cyan}  │  ${gray}➜${reset} ${white}API Target:  ${green}${apiUrl}${reset}` +
      " ".repeat(Math.max(0, width - 15 - apiUrl.length)) +
      `${cyan}│${reset}`
  );
  console.log(
    `${cyan}  │  ${gray}➜${reset} ${white}Environment: ${green}development${reset}` +
      " ".repeat(Math.max(0, width - 26)) +
      `${cyan}│${reset}`
  );
  console.log(
    `${cyan}  │  ${gray}➜${reset} ${white}UI Stack:    ${gray}React 19 • Tailwind CSS 4 • Shadcn${reset}` +
      " ".repeat(Math.max(0, width - 48)) +
      `${cyan}│${reset}`
  );
  console.log(`${cyan}  ╰${line}╯${reset}`);
  console.log();
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
  output: "standalone",
  outputFileTracingRoot: path.resolve(__dirname, "../../"),
  reactCompiler: true,
  htmlLimitedBots: /.*/,
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: { typescript: true, icon: true, titleProp: true, svgo: true, prettier: false }
          }
        ],
        as: "*.js"
      }
    }
  },
  webpack(config) {
    const rules = config.module.rules as RuleSetRule[];
    const fileLoaderRule = rules.find(
      (rule): rule is RuleSetRule =>
        !!rule && typeof rule === "object" && rule.test instanceof RegExp && rule.test.test(".svg")
    );
    if (fileLoaderRule) fileLoaderRule.exclude = /\.svg$/i;
    config.module.rules.push({ test: /\.svg$/i, issuer: /\.[jt]sx?$/, use: ["@svgr/webpack"] });
    return config;
  }
};

export default withBundleAnalyzer(nextConfig);
