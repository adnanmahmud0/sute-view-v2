import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/providers/Providers";

import { AdminHeader } from "@/components/layouts/AdminHeader";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";

import "@/styles/tailwind.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Super Admin Portal | The Sartorialist Zürich",
  description:
    "Next.js 16 Enterprise Super Admin Portal for The Sartorialist Zürich with RBAC, Live Analytics, and Prisma Express integration.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
      { url: "/monogram.png", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-screen font-sans antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen w-full">
            <AdminSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <AdminHeader />
              <main className="bg-muted/20 flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
