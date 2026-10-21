import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

function getFallbackSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "https://sute-view-v2.vercel.app";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
}

const fallbackSiteUrl = getFallbackSiteUrl();
const fallbackApiUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://api.example.com/api/v1";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default(fallbackSiteUrl),
    NEXT_PUBLIC_API_URL: z.string().url().default(fallbackApiUrl),
    NEXT_PUBLIC_GA_ID: z.string().optional()
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || fallbackApiUrl,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID
  },
  emptyStringAsUndefined: true
});
