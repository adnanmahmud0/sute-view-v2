"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isFullScreenPage =
    pathname === "/full-suit" ||
    pathname?.startsWith("/full-suit/") ||
    pathname === "/appointment" ||
    pathname?.startsWith("/appointment/");

  // On full page screens (e.g. /full-suit, /appointment), hide navbar and footer completely
  if (isFullScreenPage) {
    return <main className="h-screen w-full overflow-hidden">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
