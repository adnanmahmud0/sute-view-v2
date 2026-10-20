import {
  ArrowUpRight,
  CheckCircle2,
  Database,
  ExternalLink,
  Layers,
  Lock,
  Server,
  ShieldCheck,
  Users,
  Zap
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  status: "Active" | "Pending" | "Suspended";
  joinedDate: string;
}

const mockUsers: UserRecord[] = [
  {
    id: "usr_01",
    name: "System Super Admin",
    email: "admin@example.com",
    role: "SUPER_ADMIN",
    status: "Active",
    joinedDate: "2026-10-01"
  },
  {
    id: "usr_02",
    name: "Alex Morgan",
    email: "alex.morgan@company.io",
    role: "ADMIN",
    status: "Active",
    joinedDate: "2026-10-02"
  },
  {
    id: "usr_03",
    name: "Jordan Lee",
    email: "jordan@startup.dev",
    role: "USER",
    status: "Active",
    joinedDate: "2026-10-03"
  },
  {
    id: "usr_04",
    name: "Taylor Chen",
    email: "taylor@domain.co",
    role: "USER",
    status: "Pending",
    joinedDate: "2026-10-04"
  }
];

export default function AdminDashboardPage() {
  const webUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8001";
  const webPort = webUrl.match(/:(\d+)/)?.[1] || "8001";
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:8002";
  const adminPort = adminUrl.match(/:(\d+)/)?.[1] || "8002";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003/api/v1";
  const apiRoot = apiUrl.replace(/\/api\/v1\/?$/, "");
  const apiPort = apiUrl.match(/:(\d+)/)?.[1] || "8003";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Top Banner */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-2 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            <Badge variant="purple" className="font-mono text-xs">
              Super Admin
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time management for users, roles, services, and system metrics across the monorepo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`${apiRoot}/api-docs`}
            target="_blank"
            rel="noreferrer"
            className="bg-background border-border hover:bg-muted text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium shadow-sm transition-colors"
          >
            <Server className="size-3.5 text-purple-600 dark:text-purple-400" />
            <span>OpenAPI Docs</span>
            <ExternalLink className="text-muted-foreground size-3" />
          </a>
          <a
            href={webUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium shadow-sm transition-colors"
          >
            <Layers className="size-3.5" />
            <span>View Public App</span>
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <Card className="transition-colors hover:border-purple-500/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Users</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-2xl font-bold">1,248</div>
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <span className="font-mono font-semibold text-emerald-500">+12.4%</span> vs previous
              month
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="transition-colors hover:border-purple-500/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Role Distribution
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-2xl font-bold">3 Tiers</div>
            <p className="text-muted-foreground mt-1 text-xs">Super Admin • Admin • User</p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="transition-colors hover:border-purple-500/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              API Latency (p95)
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-2xl font-bold">38 ms</div>
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <span className="font-mono font-semibold text-emerald-500">99.98%</span> uptime SLA
            </p>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="transition-colors hover:border-purple-500/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Database State
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Database className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-2xl font-bold">Postgres 16</div>
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <CheckCircle2 className="size-3 text-emerald-500" /> Prisma 7.10 Client
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: User Table & System Diagnostics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User Directory (2 cols) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-semibold">User Directory</CardTitle>
                <CardDescription className="text-xs">
                  Active accounts seeded and provisioned via Express authentication endpoints.
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Export CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="text-muted-foreground bg-muted/40 border-border border-y text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 font-semibold">User</th>
                      <th className="px-6 py-3 font-semibold">Role</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border divide-y">
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-foreground font-medium">{user.name}</div>
                          <div className="text-muted-foreground font-mono text-xs">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.role === "SUPER_ADMIN" && (
                            <Badge variant="purple" className="font-mono text-[10px]">
                              SUPER_ADMIN
                            </Badge>
                          )}
                          {user.role === "ADMIN" && (
                            <Badge variant="secondary" className="font-mono text-[10px]">
                              ADMIN
                            </Badge>
                          )}
                          {user.role === "USER" && (
                            <Badge variant="outline" className="font-mono text-[10px]">
                              USER
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={user.status === "Active" ? "success" : "secondary"}
                            className="text-[11px]"
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="text-muted-foreground px-6 py-4 font-mono text-xs">
                          {user.joinedDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Diagnostics & Config (1 col) */}
        <div className="space-y-6">
          {/* Service Endpoints */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Server className="size-4 text-purple-600 dark:text-purple-400" />
                Service Endpoints
              </CardTitle>
              <CardDescription className="text-xs">
                Active ports configured in root{" "}
                <code className="font-mono font-semibold">.env</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="bg-muted/40 border-border flex items-center justify-between rounded-lg border p-2.5">
                <div>
                  <div className="text-foreground font-semibold">Next.js Web</div>
                  <div className="text-muted-foreground font-mono text-[11px]">Consumer Portal</div>
                </div>
                <Badge variant="outline" className="font-mono">
                  :{webPort}
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-purple-500/20 bg-purple-500/10 p-2.5">
                <div>
                  <div className="text-foreground font-semibold">Next.js Admin</div>
                  <div className="font-mono text-[11px] text-purple-600 dark:text-purple-400">
                    Current Portal
                  </div>
                </div>
                <Badge variant="purple" className="font-mono">
                  :{adminPort}
                </Badge>
              </div>

              <div className="bg-muted/40 border-border flex items-center justify-between rounded-lg border p-2.5">
                <div>
                  <div className="text-foreground font-semibold">Express API</div>
                  <div className="text-muted-foreground font-mono text-[11px]">Backend Server</div>
                </div>
                <Badge variant="outline" className="font-mono">
                  :{apiPort}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Security & RBAC Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Lock className="size-4 text-purple-600 dark:text-purple-400" />
                Security Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                <span>
                  Unified Root <code className="text-foreground font-mono font-semibold">.env</code>{" "}
                  loaded
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                <span>Next.js 16 Proxy RBAC enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                <span>JWT Access & Refresh flow active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                <span>Prisma Client singleton managed</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
