"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";

interface OptionItem {
  name: string;
  href: string;
}

const OPTION_ITEMS: OptionItem[] = [
  { name: "FULL SUIT", href: "/full-suit" },
  { name: "JACKET", href: "/#option-jacket" },
  { name: "TROUSERS", href: "/#option-trousers" },
  { name: "WAISTCOAT", href: "/#option-waistcoat" }
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [optionOpen, setOptionOpen] = useState(false);
  const optionRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (optionRef.current && !optionRef.current.contains(event.target as Node)) {
        setOptionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative w-full bg-white border-b border-black/10">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-black px-4 py-1 text-center text-white">
        <div className="container mx-auto flex items-center justify-center">
          <p className="font-serif text-[9.5px] font-medium tracking-[0.2em] text-white uppercase sm:text-[10px]">
            ALLE PRODUKTE AUF RATENZAHLUNG MIT 0% ZINS
          </p>
        </div>
      </div>

      {/* 2. MAIN LOGO / BRANDING SECTION */}
      <div className="border-b border-black/10 bg-white px-4 py-2 sm:py-2.5">
        <div className="container mx-auto flex items-center justify-between">
          {/* Spacer to keep logo perfectly centered on mobile */}
          <div className="w-8 lg:hidden" />

          {/* Centered Brand Title & Subtitle */}
          <div className="mx-auto flex flex-col items-center justify-center text-center">
            <Link
              href="/"
              className="group flex flex-col items-center justify-center transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo.webp"
                alt="The Sartorialist Zürich"
                width={300}
                height={44}
                priority
                className="h-7 w-auto max-w-[190px] object-contain sm:h-8 sm:max-w-[240px] md:h-9 md:max-w-[290px]"
              />
              <span className="sr-only">THE SARTORIALIST ZÜRICH</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-none border border-black text-black transition-colors hover:bg-black hover:text-white"
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. DESKTOP NAVIGATION BAR */}
      <nav className="hidden border-b border-black/10 bg-white lg:block">
        <div className="container mx-auto flex items-center justify-center px-4">
          <ul className="flex items-center justify-center gap-7 font-serif text-[11px] font-medium tracking-[0.16em] text-black uppercase xl:gap-9 xl:text-[11.5px]">
            {/* 1. SARTORIALIST */}
            <li>
              <Link
                href="/#sartorialist"
                className="inline-block py-2 font-semibold text-black transition-opacity hover:opacity-60"
              >
                SARTORIALIST
              </Link>
            </li>

            {/* 2. STYLE */}
            <li>
              <Link
                href="/#style"
                className="inline-block py-2 text-black transition-opacity hover:opacity-60"
              >
                STYLE
              </Link>
            </li>

            {/* 3. OPTION (with Dropdown: FULL SUIT, JACKET, TROUSERS, WAISTCOAT) */}
            <li
              className="relative"
              ref={optionRef}
              onMouseEnter={() => setOptionOpen(true)}
              onMouseLeave={() => setOptionOpen(false)}
            >
              <button
                type="button"
                onClick={() => setOptionOpen(!optionOpen)}
                className={`inline-flex items-center gap-1.5 py-2 text-black transition-opacity hover:opacity-60 uppercase ${
                  optionOpen ? "font-bold" : ""
                }`}
                aria-expanded={optionOpen}
              >
                <span>OPTION</span>
                <span className="text-[12px] font-mono leading-none tracking-normal">
                  {optionOpen ? "–" : "+"}
                </span>
              </button>

              {/* Option Dropdown Menu */}
              {optionOpen && (
                <div className="absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 border border-black bg-white shadow-xl transition-all">
                  <ul className="divide-y divide-black/10">
                    {OPTION_ITEMS.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setOptionOpen(false)}
                          className="block py-3 px-4 text-center font-serif text-[11px] font-medium tracking-[0.16em] text-black transition-colors hover:bg-black hover:text-white"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>

            {/* 4. FABRIC */}
            <li>
              <Link
                href="/#fabric"
                className="inline-block py-2 text-black transition-opacity hover:opacity-60"
              >
                FABRIC
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="border-b border-black bg-white px-6 py-4 shadow-xl lg:hidden">
          <ul className="flex flex-col divide-y divide-black/10 font-serif text-[12px] font-medium tracking-[0.14em] text-black uppercase">
            <li>
              <Link
                href="/#sartorialist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 font-semibold text-black transition-opacity hover:opacity-60"
              >
                <span>SARTORIALIST</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </li>

            <li>
              <Link
                href="/#style"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 text-black transition-opacity hover:opacity-60"
              >
                <span>STYLE</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setOptionOpen(!optionOpen)}
                className="flex w-full items-center justify-between py-2.5 text-left text-black transition-opacity hover:opacity-60 uppercase"
              >
                <span>OPTION</span>
                <span className="font-mono text-sm">{optionOpen ? "–" : "+"}</span>
              </button>
              {optionOpen && (
                <div className="my-1 border border-black bg-white divide-y divide-black/10">
                  {OPTION_ITEMS.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => {
                        setOptionOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block py-2.5 px-4 text-center font-serif text-[11px] font-medium tracking-[0.14em] text-black hover:bg-black hover:text-white"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li>
              <Link
                href="/#fabric"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 text-black transition-opacity hover:opacity-60"
              >
                <span>FABRIC</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
