"use client";

import { useEffect, type ReactNode } from "react";

import { AuthProvider, QueryProvider, ThemePresetProvider, ThemeProvider } from "@/providers";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as unknown as { __CONSOLE_SHOWN?: boolean }).__CONSOLE_SHOWN) {
      (window as unknown as { __CONSOLE_SHOWN?: boolean }).__CONSOLE_SHOWN = true;
      console.log(
        `%c 🚀 FULLSTACK TURBOREPO %c v1.0.0 %c\n` +
          `%c ➜ Frontend:  Next.js 16 (React 19 + Tailwind CSS 4)\n` +
          ` ➜ API URL:   ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003/api/v1"}\n` +
          ` ➜ Status:    All Systems Operational`,
        "background: #2563eb; color: #ffffff; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold; font-family: sans-serif;",
        "background: #059669; color: #ffffff; padding: 4px 8px; border-radius: 0 4px 4px 0; font-weight: bold; font-family: sans-serif;",
        "",
        "color: #64748b; font-family: monospace; font-size: 11px; line-height: 1.6; margin-top: 4px;"
      );
    }
  }, []);

  return (
    <ThemeProvider>
      <ThemePresetProvider>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </ThemePresetProvider>
    </ThemeProvider>
  );
}
