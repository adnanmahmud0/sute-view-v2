"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Heart
} from "lucide-react";

// Brand Logos for the "UNSERE BRANDS" section
function GranSassoLogo() {
  return (
    <div className="flex flex-col items-center justify-center text-center opacity-80 transition-opacity hover:opacity-100">
      <span className="font-serif text-[9px] tracking-[0.25em] text-black uppercase">1952</span>
      <span className="font-serif text-sm font-semibold tracking-[0.2em] text-black">GRAN SASSO</span>
      <span className="font-serif text-[8.5px] tracking-[0.3em] text-black uppercase">ITALY</span>
    </div>
  );
}

function WoolrichLogo() {
  return (
    <div className="flex flex-col items-center justify-center text-center opacity-80 transition-opacity hover:opacity-100">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] tracking-wider text-black">EST.</span>
        {/* Minimalist Sheep / Ram Icon */}
        <svg viewBox="0 0 48 32" className="h-4 w-6 fill-none stroke-black stroke-1" aria-hidden="true">
          <path d="M12 24c-2 0-4-2-4-4 0-1.5 1-3 2.5-3.5C10 15 10 13 11 11c1.5-3 5-5 8-4 1.5-2 4-3 7-3 4 0 7 2 8 5 2 0 4 1 5 3 1.5 2.5 1 6-1 8 0 1-1 3-2 3.5-.5 1-1.5 1.5-2.5 1.5H12z" />
          <path d="M14 24v4M22 24v4M28 24v4M36 24v4M10 17c-2 0-3 1-3 2.5 0 2 2 3.5 4 3.5" />
        </svg>
        <span className="font-mono text-[9px] tracking-wider text-black">1830</span>
      </div>
      <span className="mt-0.5 font-serif text-xs font-bold tracking-[0.22em] text-black">WOOLRICH</span>
    </div>
  );
}

function GimosLogo() {
  return (
    <div className="flex items-center justify-center opacity-80 transition-opacity hover:opacity-100">
      <span className="font-serif text-base font-light tracking-[0.28em] text-black">GIMO&apos;S</span>
    </div>
  );
}

function PaulAndSharkLogo() {
  return (
    <div className="flex flex-col items-center justify-center text-center opacity-80 transition-opacity hover:opacity-100">
      {/* Minimalist Shark silhouette */}
      <svg viewBox="0 0 60 20" className="h-3.5 w-10 fill-none stroke-black stroke-[1.2]" aria-hidden="true">
        <path d="M4 11c8-4 22-6 32-1 4-3 7-5 12-4-3 3-5 5-6 8 3 1 6 1 8 0-4 3-9 4-15 2-8 3-18 2-27-3l-4-2z" />
        <path d="M26 6l4-5 1 5" />
      </svg>
      <span className="mt-1 font-serif text-[11px] font-semibold tracking-[0.22em] text-black">
        PAUL &amp; SHARK
      </span>
    </div>
  );
}

function OrazioLucianoLogo() {
  return (
    <div className="flex flex-col items-center justify-center text-center opacity-80 transition-opacity hover:opacity-100">
      <div className="flex items-center gap-1.5">
        <span className="font-serif text-base italic text-black">Orazio</span>
        <span className="font-serif text-sm font-bold tracking-[0.15em] text-black">LUCIANO</span>
        {/* Spool / Thread Icon */}
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-black stroke-[1.5]" aria-hidden="true">
          <rect x="5" y="3" width="14" height="4" rx="1" />
          <rect x="5" y="17" width="14" height="4" rx="1" />
          <path d="M8 7v10M12 7v10M16 7v10" />
        </svg>
      </div>
      <span className="text-[8.5px] italic tracking-wider text-black">la vera sartoria napoletana</span>
    </div>
  );
}


export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-white">
      {/* ======================================================== */}
      {/* 1. UNSERE BRANDS SHOWCASE SECTION                        */}
      {/* ======================================================== */}
      <section className="border-t border-black/10 bg-white py-8 sm:py-10">
        <div className="container mx-auto px-4">
          <h3 className="mb-6 text-center font-serif text-xs font-medium tracking-[0.25em] text-black uppercase sm:text-sm">
            UNSERE BRANDS
          </h3>

          <div className="mx-auto grid max-w-4xl grid-cols-2 items-center justify-center gap-6 opacity-80 transition-opacity hover:opacity-100 sm:grid-cols-3 md:grid-cols-5 md:gap-8">
            <GranSassoLogo />
            <WoolrichLogo />
            <GimosLogo />
            <PaulAndSharkLogo />
            <OrazioLucianoLogo />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. MAIN SOLID BLACK FOOTER SECTION                      */}
      {/* ======================================================== */}
      <section className="relative bg-black pt-10 pb-8 text-white border-t border-black">
        {/* Floating Centered Monogram Badge (TS) */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <Link
            href="/"
            aria-label="The Sartorialist Zürich Startseite"
            className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white bg-black shadow-lg ring-4 ring-black/40 transition-transform hover:scale-105"
          >
            <Image
              src="/monogram.webp"
              alt="The Sartorialist Zürich Monogram"
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority
            />
          </Link>
        </div>

        <div className="container mx-auto max-w-5xl px-4 text-center">
          {/* Appointment CTA Button */}
          <div className="mb-4 flex justify-center">
            <Link
              href="/#kontakt"
              className="inline-flex items-center gap-1.5 border border-white bg-black px-5 py-1.5 font-serif text-[10.5px] font-semibold tracking-[0.2em] text-white uppercase shadow transition-all hover:bg-white hover:text-black"
            >
              <Calendar className="h-3 w-3" />
              <span>TERMIN VEREINBAREN</span>
            </Link>
          </div>

          {/* Brand Wordmark */}
          <div className="mb-4 flex flex-col items-center justify-center">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image
                src="/logo-white.webp"
                alt="The Sartorialist Zürich"
                width={280}
                height={42}
                className="h-6 w-auto max-w-[220px] object-contain sm:h-7 sm:max-w-[280px]"
              />
              <span className="sr-only">THE SARTORIALIST ZÜRICH</span>
            </Link>
          </div>

          {/* Contact Details & Address Row */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-serif text-[11px] text-white/90 sm:gap-x-3.5">
            <span>Kuttelgasse 7 | 8001 Zürich</span>
            <span className="text-white/40">|</span>
            <a href="tel:+41432430277" className="transition-opacity hover:opacity-70">
              +41 43 243 02 77
            </a>
            <span className="text-white/40">|</span>
            <a href="tel:+41764880630" className="transition-opacity hover:opacity-70">
              +41 76 488 06 30
            </a>
            <span className="text-white/40">|</span>
            <a href="mailto:store@thesartorialist.ch" className="transition-opacity hover:opacity-70">
              store@thesartorialist.ch
            </a>
          </div>

          {/* Quick Links Navigation Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-serif text-[11px] text-white/80 sm:gap-x-6">
            <Link href="/#kontakt" className="transition-opacity hover:opacity-100">
              Termin Buchen
            </Link>
            <Link href="/#newsletter" className="transition-opacity hover:opacity-100">
              Newsletter
            </Link>
            <Link href="/#services" className="transition-opacity hover:opacity-100">
              Services
            </Link>
            <Link href="/#kontakt" className="transition-opacity hover:opacity-100">
              Kontakt / Anfahrt
            </Link>
            <Link href="/#raten" className="transition-opacity hover:opacity-100">
              AGB / Zahlung auf Raten
            </Link>
            <Link href="/#massanzug" className="transition-opacity hover:opacity-100">
              Anzüge Zürich
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SOLID BLACK BOTTOM BAR                                */}
      {/* ======================================================== */}
      <section className="bg-black py-3 text-white border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 text-[10px] sm:flex-row">
          {/* Left: Copyright & Agency Credit */}
          <div className="flex flex-col items-center gap-0.5 sm:items-start">
            <p>Copyright © 2026 THE SARTORIALIST Zürich</p>
            <p className="flex items-center gap-1 text-[9px] text-white/70">
              <span>MADE WEBDESIGN &amp; SEO WITH</span>
              <Heart className="h-2.5 w-2.5 fill-white text-white" />
              <span>BY DLM DIGITAL</span>
            </p>
          </div>

          {/* Right: Legal Links */}
          <div className="flex items-center gap-4 font-serif text-[10.5px] text-white/80">
            <Link href="/#impressum" className="transition-opacity hover:opacity-100">
              Impressum
            </Link>
            <Link href="/#datenschutz" className="transition-opacity hover:opacity-100">
              Datenschutzerklärung
            </Link>
            <Link href="/#kontakt" className="transition-opacity hover:opacity-100">
              Kontakt
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FLOATING WHATSAPP BUTTON (Bottom Right)              */}
      {/* ======================================================== */}
      <aside aria-label="WhatsApp Kundenservice">
        <a
          href="https://wa.me/41764880630"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-black text-white border-2 border-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black"
          title="WhatsApp Chat mit The Sartorialist Zürich"
          aria-label="Chat auf WhatsApp"
        >
          {/* WhatsApp SVG Icon */}
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </aside>
    </footer>
  );
}
