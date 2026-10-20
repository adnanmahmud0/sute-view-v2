"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Database,
  ExternalLink,
  FileCode2,
  History,
  Layers,
  LayoutDashboard,
  Settings,
  Shield,
  ShieldCheck,
  Users
} from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/",
    icon: LayoutDashboard
  },
  {
    title: "User Directory",
    href: "/users",
    icon: Users
  },
  {
    title: "Access & Roles",
    href: "/roles",
    icon: ShieldCheck,
    badge: "RBAC"
  },
  {
    title: "Database Health",
    href: "/database",
    icon: Database
  },
  {
    title: "Audit Logs",
    href: "/audit",
    icon: History
  },
  {
    title: "Swagger API Docs",
    href: `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003/api/v1").replace(/\/api\/v1\/?$/, "")}/api-docs`,
    icon: FileCode2,
    isExternal: true,
    badge: "OpenAPI"
  },
  {
    title: "System Settings",
    href: "/settings",
    icon: Settings
  }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border bg-sidebar text-sidebar-foreground flex min-h-screen w-64 shrink-0 flex-col border-r">
      {/* Brand Header */}
      <div className="border-sidebar-border flex h-16 items-center gap-3 border-b px-6">
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-[#2b2a2e] shadow-sm">
          <Image
            src="/monogram.webp"
            alt="The Sartorialist"
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-foreground flex items-center gap-1.5 text-sm font-bold tracking-tight">
            <span className="truncate">Sartorialist</span>
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              Admin
            </span>
          </div>
          <p className="text-muted-foreground text-xs">Atelier Zürich</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1 px-3 py-4">
        <p className="text-muted-foreground mb-2 px-3 text-[11px] font-semibold tracking-wider uppercase">
          Platform Management
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isExternal) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-muted-foreground group-hover:text-sidebar-primary size-4 transition-colors" />
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[10px]">
                      {item.badge}
                    </span>
                  )}
                  <ExternalLink className="text-muted-foreground size-3 opacity-60 group-hover:opacity-100" />
                </div>
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "size-4 transition-colors",
                    isActive
                      ? "text-sidebar-primary-foreground"
                      : "text-muted-foreground group-hover:text-sidebar-primary"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold",
                    isActive
                      ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground"
                      : "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Switcher: Jump to Consumer Web App */}
      <div className="border-sidebar-border bg-sidebar-accent/30 m-3 space-y-2 rounded-xl border-t p-4">
        <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
          <Layers className="size-4 text-purple-600 dark:text-purple-400" />
          Monorepo Switcher
        </div>
        <p className="text-muted-foreground text-[11px]">
          Launch frontend consumer portal or verify public flows.
        </p>
        <a
          href={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8001"}
          target="_blank"
          rel="noreferrer"
          className="bg-background border-border hover:bg-muted text-foreground inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
        >
          <span>Open Web App (:{process.env.NEXT_PUBLIC_SITE_URL?.match(/:(\d+)/)?.[1] || "8001"})</span>
          <ExternalLink className="text-muted-foreground size-3" />
        </a>
      </div>
    </aside>
  );
}
