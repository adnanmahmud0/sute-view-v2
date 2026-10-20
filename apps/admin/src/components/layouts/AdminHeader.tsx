"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { Activity, ExternalLink, Moon, Server, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

export function AdminHeader() {
  const { theme, setTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003/api/v1";
  const rootUrl = apiUrl.replace(/\/api\/v1\/?$/, "");
  const apiPort = apiUrl.match(/:(\d+)/)?.[1] || "8003";

  useEffect(() => {
    // Check backend health
    const checkApi = async () => {
      try {
        const res = await fetch(`${rootUrl}/health`, { method: "GET" });
        setApiOnline(res.ok);
      } catch {
        setApiOnline(false);
      }
    };

    void checkApi();
    const interval = setInterval(() => {
      void checkApi();
    }, 15000);
    return () => clearInterval(interval);
  }, [rootUrl]);

  return (
    <header className="border-border bg-background flex h-16 shrink-0 items-center justify-between border-b px-6">
      {/* Title & Status */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-foreground flex items-center gap-2 text-base font-semibold tracking-tight">
            Control Center
          </h1>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {apiOnline === null ? (
            <Badge variant="secondary" className="gap-1.5 font-mono text-[11px]">
              <Activity className="text-muted-foreground size-3 animate-spin" />
              Checking API...
            </Badge>
          ) : apiOnline ? (
            <Badge variant="success" className="gap-1.5 font-mono text-[11px]">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              API Connected (:{apiPort})
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1.5 font-mono text-[11px]">
              <span className="size-2 rounded-full bg-red-500" />
              API Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex items-center gap-3">
        {/* API Docs Quick Button */}
        <a
          href={`${rootUrl}/api-docs`}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-foreground border-border hover:bg-muted hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors md:inline-flex"
        >
          <Server className="size-3.5" />
          <span>Swagger Docs</span>
          <ExternalLink className="size-3 opacity-60" />
        </a>

        {/* Theme Toggle */}
        {isMounted && (
          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-lg"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="size-4 text-amber-400" />
            ) : (
              <Moon className="size-4 text-slate-700" />
            )}
          </Button>
        )}

        {/* Admin Profile Chip */}
        <div className="border-border flex items-center gap-2 border-l pl-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
            <User className="size-4" />
          </div>
          <div className="hidden text-left text-xs lg:block">
            <div className="text-foreground leading-tight font-semibold">Super Admin</div>
            <div className="text-muted-foreground font-mono text-[10px]">admin@example.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
