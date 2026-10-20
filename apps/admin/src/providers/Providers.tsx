"use client";

import { useEffect, type ReactNode } from "react";

import { Toaster } from "sonner";

import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";

interface CustomWindow extends Window {
  __ADMIN_CONSOLE_BANNER_PRINTED?: boolean;
}

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as unknown as CustomWindow;
      if (!win.__ADMIN_CONSOLE_BANNER_PRINTED) {
        win.__ADMIN_CONSOLE_BANNER_PRINTED = true;
        console.log(
          "%c 🛡️ NEXT.JS 16 ADMIN PORTAL %c SUPER ADMIN %c",
          "background: #7c3aed; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px; font-family: monospace; font-size: 11px;",
          "background: #4338ca; color: #ffffff; padding: 4px 8px; border-radius: 0 4px 4px 0; font-family: monospace; font-size: 11px;",
          "background: transparent;"
        );
        const apiPort = (process.env.NEXT_PUBLIC_API_URL || "").match(/:(\d+)/)?.[1] || "8003";
        console.log(
          `%c⚡ RBAC Ready • Connected to Express 5 API (Port ${apiPort})`,
          "color: #8b5cf6; font-size: 10px; font-family: monospace;"
        );
      }
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        {children}
        <Toaster richColors position="top-right" />
      </QueryProvider>
    </ThemeProvider>
  );
}

export { ThemeProvider, QueryProvider };
