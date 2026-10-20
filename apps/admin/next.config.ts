import path from "node:path";
import type { NextConfig } from "next";

import { loadEnvConfig } from "@next/env";

// Load root monorepo .env file into process.env
loadEnvConfig(path.resolve(__dirname, "../../"));

if (process.env.NODE_ENV !== "production" && !process.env.__ADMIN_BANNER_PRINTED) {
  process.env.__ADMIN_BANNER_PRINTED = "true";
  const width = 56;
  const line = "─".repeat(width);
  const purple = "\x1b[35m\x1b[1m";
  const white = "\x1b[37m";
  const gray = "\x1b[90m";
  const green = "\x1b[32m\x1b[1m";
  const reset = "\x1b[0m";

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:8002";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003/api/v1";

  console.log();
  console.log(`${purple}  ╭${line}╮${reset}`);
  console.log(
    `${purple}  │  ${reset}\x1b[1m\x1b[37m🛡️  NEXT.JS 16 ADMIN PORTAL${reset}${gray} (Super Admin)${reset}` +
      " ".repeat(Math.max(0, width - 42)) +
      `${purple}│${reset}`
  );
  console.log(`${purple}  ├${line}┤${reset}`);
  console.log(
    `${purple}  │  ${gray}➜${reset} ${white}Local:       ${purple}${adminUrl}/${reset}` +
      " ".repeat(Math.max(0, width - 15 - `${adminUrl}/`.length)) +
      `${purple}│${reset}`
  );
  console.log(
    `${purple}  │  ${gray}➜${reset} ${white}API Target:  ${green}${apiUrl}${reset}` +
      " ".repeat(Math.max(0, width - 15 - apiUrl.length)) +
      `${purple}│${reset}`
  );
  console.log(
    `${purple}  │  ${gray}➜${reset} ${white}Access:      ${white}RBAC (Role: SUPER_ADMIN)${reset}` +
      " ".repeat(Math.max(0, width - 37)) +
      `${purple}│${reset}`
  );
  console.log(
    `${purple}  │  ${gray}➜${reset} ${white}UI Stack:    ${gray}React 19 • Tailwind CSS 4 • Shadcn${reset}` +
      " ".repeat(Math.max(0, width - 48)) +
      `${purple}│${reset}`
  );
  console.log(`${purple}  ╰${line}╯${reset}`);
  console.log();
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL
  },
  output: "standalone",
  outputFileTracingRoot: path.resolve(__dirname, "../../"),
  reactCompiler: true,
  htmlLimitedBots: /.*/
};

export default nextConfig;
