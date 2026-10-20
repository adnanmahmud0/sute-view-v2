"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";

type BreastStyle = "single" | "double";

/* ====================================================================
   DATA: STEP 1 - FRONT STYLE
   ==================================================================== */
interface SuitOption {
  id: string;
  code: string;
  name: string;
  image: string;
}

const SINGLE_BREASTED_OPTIONS: SuitOption[] = [
  {
    id: "1b",
    code: "1B",
    name: "One button",
    image: "/suits/single-breasted/1b.png"
  },
  {
    id: "2b",
    code: "2B",
    name: "Two button",
    image: "/suits/single-breasted/2b.png"
  },
  {
    id: "32b",
    code: "3/2B",
    name: "Two roll three",
    image: "/suits/single-breasted/32b.png"
  },
  {
    id: "3b",
    code: "3B",
    name: "Three button",
    image: "/suits/single-breasted/3b.png"
  }
];

const DOUBLE_BREASTED_OPTIONS: SuitOption[] = [
  {
    id: "4x2",
    code: "4X2",
    name: "Four by two",
    image: "/suits/double-breasted/4by2.png"
  },
  {
    id: "6x2",
    code: "6X2",
    name: "Six by two",
    image: "/suits/double-breasted/6by2.png"
  }
];

/* ====================================================================
   DATA: STEP 2 & 3 - LAPEL STYLE & LAPEL SIZE
   ==================================================================== */
interface LapelSizeOption {
  id: string;
  code: string;
  name: string;
  image: string;
}

interface LapelStyleOption {
  id: string;
  code: string;
  name: string;
  category: "single" | "double";
  image: string;
  measuring: string;
  sizes: LapelSizeOption[];
}

const ALL_LAPEL_STYLES: LapelStyleOption[] = [
  {
    id: "single-notch",
    code: "NOTCH",
    name: "Single-breasted notch",
    category: "single",
    image: "/suits/lapels/single-notch/style.png",
    measuring: "Lapel width is measured at right angles from the breakline to the lapel tip.",
    sizes: [
      { id: "s", code: "S", name: "Small (6.7cm)", image: "/suits/lapels/single-notch/s.png" },
      { id: "r", code: "R", name: "Regular (8cm)", image: "/suits/lapels/single-notch/r.png" },
      { id: "l", code: "L", name: "Large (9.5cm)", image: "/suits/lapels/single-notch/l.png" }
    ]
  },
  {
    id: "single-peak",
    code: "PEAK",
    name: "Single-breasted peak",
    category: "single",
    image: "/suits/lapels/single-peak/style.png",
    measuring: "Lapel width is measured at right angles from the breakline to the lapel edge.",
    sizes: [
      { id: "s", code: "S", name: "Small (6.7cm)", image: "/suits/lapels/single-peak/s.png" },
      { id: "r", code: "R", name: "Regular (8cm)", image: "/suits/lapels/single-peak/r.png" },
      { id: "l", code: "L", name: "Large (9.5cm)", image: "/suits/lapels/single-peak/l.png" }
    ]
  },
  {
    id: "single-shawl",
    code: "SHAWL",
    name: "Single-breasted shawl",
    category: "single",
    image: "/suits/lapels/single-shawl/style.png",
    measuring: "Lapel width is measured at right angles from the breakline to the lapel edge at the top of the chest pocket.",
    sizes: [
      { id: "s", code: "S", name: "Small (4.5cm)", image: "/suits/lapels/single-shawl/s.png" },
      { id: "r", code: "R", name: "Regular (6cm)", image: "/suits/lapels/single-shawl/r.png" }
    ]
  },
  {
    id: "double-peak",
    code: "PEAK",
    name: "Double-breasted peak",
    category: "double",
    image: "/suits/lapels/double-peak/style.png",
    measuring: "Lapel width is measured at right angles from the breakline to the lapel edge.",
    sizes: [
      { id: "s", code: "S", name: "Small (9cm)", image: "/suits/lapels/double-peak/s.png" },
      { id: "r", code: "R", name: "Regular (10cm)", image: "/suits/lapels/double-peak/r.png" },
      { id: "l", code: "L", name: "Large (11cm)", image: "/suits/lapels/double-peak/l.png" }
    ]
  }
];

/* ====================================================================
   MAIN COMPONENT: FULL SUIT BESPOKE CONFIGURATOR
   ==================================================================== */
export function SuitFrontStyleConfigurator() {
  const router = useRouter();

  // Selections state (unselected by default)
  const [breastStyle, setBreastStyle] = useState<BreastStyle>("single");
  const [selectedFrontStyleId, setSelectedFrontStyleId] = useState<string | null>(null);
  const [selectedLapelStyleId, setSelectedLapelStyleId] = useState<string | null>(null);
  const [selectedLapelSizeId, setSelectedLapelSizeId] = useState<string | null>(null);

  // Form state for Step 4: Book Appointment
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [formError, setFormError] = useState<string | null>(null);

  // Lifecycle & Animation states
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeSection, setActiveSection] = useState<number>(0);

  // Smart scroll lock & animation tracking
  const isAnimatingRef = useRef<boolean>(false);
  const lastScrollTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);



  // Current Lapel option: find selected or fallback to first
  const currentLapelStyle =
    ALL_LAPEL_STYLES.find((l) => l.id === selectedLapelStyleId) || ALL_LAPEL_STYLES[0];

  // Available sizes for the chosen lapel style
  const lapelSizes = currentLapelStyle.sizes;

  // Countdown effect after appointment submission
  useEffect(() => {
    if (!isSubmitted) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsClosing(true);
            setTimeout(() => {
              router.push("/");
            }, 320);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, countdown, router]);

  const handleReturnHomeNow = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.push("/");
    }, 320);
  };

  const handleSubmitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.date || !formData.time) {
      setFormError("Please fill in your name, phone number, date, and time.");
      return;
    }
    setFormError(null);
    setIsSubmitted(true);
    setCountdown(5);
  };

  // Jump to specific section safely with animation lock
  const goToSection = useCallback((index: number) => {
    if (index === activeSection || isAnimatingRef.current) return;
    lastScrollTimeRef.current = Date.now();
    isAnimatingRef.current = true;
    setActiveSection(index);
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 750);
  }, [activeSection]);

  // SMART WHEEL HANDLER: Moves exactly ONE section per scroll gesture
  // and discards momentum/trackpad inertia until the animation completes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      // Prevent browser bounce / rubber-banding
      e.preventDefault();

      const now = Date.now();
      // Block wheel events during active animation or cooldown buffer
      if (isAnimatingRef.current || now - lastScrollTimeRef.current < 850) {
        return;
      }

      // Filter out negligible trackpad tremors
      if (Math.abs(e.deltaY) < 18) {
        return;
      }

      if (e.deltaY > 0) {
        // Scroll down: move to next section (0 -> 1 -> 2 -> 3)
        setActiveSection((prev) => {
          if (prev < 3) {
            lastScrollTimeRef.current = Date.now();
            isAnimatingRef.current = true;
            setTimeout(() => {
              isAnimatingRef.current = false;
            }, 750);
            return prev + 1;
          }
          return prev;
        });
      } else if (e.deltaY < 0) {
        // Scroll up: move to previous section
        setActiveSection((prev) => {
          if (prev > 0) {
            lastScrollTimeRef.current = Date.now();
            isAnimatingRef.current = true;
            setTimeout(() => {
              isAnimatingRef.current = false;
            }, 750);
            return prev - 1;
          }
          return prev;
        });
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, []);

  // TOUCH SWIPE HANDLER (Mobile/tablet swipe gestures)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0]?.clientY ?? 0;
      const deltaY = touchStartY - touchEndY;
      const now = Date.now();

      if (isAnimatingRef.current || now - lastScrollTimeRef.current < 750) {
        return;
      }

      if (Math.abs(deltaY) > 40) {
        if (deltaY > 0) {
          // Swiped up -> move down (0 -> 1 -> 2 -> 3)
          setActiveSection((prev) => {
            if (prev < 3) {
              lastScrollTimeRef.current = Date.now();
              isAnimatingRef.current = true;
              setTimeout(() => {
                isAnimatingRef.current = false;
              }, 750);
              return prev + 1;
            }
            return prev;
          });
        } else {
          // Swiped down -> move up
          setActiveSection((prev) => {
            if (prev > 0) {
              lastScrollTimeRef.current = Date.now();
              isAnimatingRef.current = true;
              setTimeout(() => {
                isAnimatingRef.current = false;
              }, 750);
              return prev - 1;
            }
            return prev;
          });
        }
      }
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // KEYBOARD NAVIGATION (Arrow keys / Page keys)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Do not intercept keyboard events when user is typing in form inputs
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const now = Date.now();
        if (isAnimatingRef.current || now - lastScrollTimeRef.current < 750) return;
        setActiveSection((prev) => {
          if (prev < 3) {
            lastScrollTimeRef.current = Date.now();
            isAnimatingRef.current = true;
            setTimeout(() => {
              isAnimatingRef.current = false;
            }, 750);
            return prev + 1;
          }
          return prev;
        });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const now = Date.now();
        if (isAnimatingRef.current || now - lastScrollTimeRef.current < 750) return;
        setActiveSection((prev) => {
          if (prev > 0) {
            lastScrollTimeRef.current = Date.now();
            isAnimatingRef.current = true;
            setTimeout(() => {
              isAnimatingRef.current = false;
            }, 750);
            return prev - 1;
          }
          return prev;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsClosing(true);
    setTimeout(() => {
      router.push("/");
    }, 320);
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-screen w-full bg-white select-none overflow-hidden transition-all duration-400 ease-out ${
        isMounted && !isClosing
          ? "opacity-100 scale-100"
          : "opacity-0 scale-[0.985] pointer-events-none"
      }`}
    >
      {/* ------------------------------------------------------------- */}
      {/* FIXED TOP CONTROLS: Close button & Direction UP Arrow         */}
      {/* ------------------------------------------------------------- */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Schließen und zurück zur Startseite"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 flex h-10 w-10 items-center justify-center text-black hover:opacity-50 hover:rotate-90 hover:scale-110 transition-all duration-300 z-50 cursor-pointer"
        title="Schließen"
      >
        <X className="h-6 w-6 stroke-[1.5]" />
      </button>

      {/* Fixed top direction UP arrow to go to previous section */}
      <div className="fixed top-3.5 sm:top-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto transition-opacity duration-300">
        {activeSection > 0 && !isSubmitted && (
          <button
            type="button"
            onClick={() => goToSection(activeSection - 1)}
            className="inline-flex items-center gap-1.5 font-serif text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-black hover:opacity-60 transition-opacity cursor-pointer group"
          >
            <ChevronUp className="h-3.5 w-3.5 animate-bounce" />
            <span>
              {activeSection === 1
                ? "FRONT STYLE"
                : activeSection === 2
                ? "LAPEL STYLE"
                : "LAPEL SIZE"}
            </span>
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SMART SLIDING CONTAINER (TRANSITION ONE SECTION AT A TIME)   */}
      {/* ------------------------------------------------------------- */}
      <div
        className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
        style={{
          transform: `translate3d(0, -${activeSection * 100}%, 0)`
        }}
      >
        {/* =========================================================== */}
        {/* SECTION 1: FRONT STYLE                                      */}
        {/* =========================================================== */}
        <section
          data-section-index="0"
          className="h-screen w-full relative flex flex-col justify-between p-4 sm:p-6 pb-24 sm:pb-28 lg:p-8 lg:pb-28 shrink-0 bg-white overflow-hidden"
        >
          {/* Section 1 Header & Tabs */}
          <div className="w-full text-center pt-10 sm:pt-12">
            <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-[0.28em] text-black uppercase leading-tight select-none">
              FRONT STYLE
            </h1>

            <div className="mt-3 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setBreastStyle("single");
                  setSelectedFrontStyleId(null);
                  setSelectedLapelStyleId(null);
                  setSelectedLapelSizeId(null);
                }}
                className={`font-serif text-sm sm:text-base italic transition-all duration-300 px-6 py-1 ${
                  breastStyle === "single"
                    ? "border border-black bg-black text-white shadow-xs"
                    : "border border-transparent bg-transparent text-black/50 hover:text-black"
                }`}
              >
                Single-breasted
              </button>

              <button
                type="button"
                onClick={() => {
                  setBreastStyle("double");
                  setSelectedFrontStyleId(null);
                  setSelectedLapelStyleId(null);
                  setSelectedLapelSizeId(null);
                }}
                className={`font-serif text-sm sm:text-base italic transition-all duration-300 px-6 py-1 ${
                  breastStyle === "double"
                    ? "border border-black bg-black text-white shadow-xs"
                    : "border border-transparent bg-transparent text-black/50 hover:text-black"
                }`}
              >
                Double-breasted
              </button>
            </div>
          </div>

          {/* Section 1 Grid */}
          <div className="flex-1 w-full max-w-[1750px] mx-auto flex items-center justify-center px-2">
            <div
              key={breastStyle}
              style={{ animation: "fadeInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
              className={`w-full grid gap-4 sm:gap-6 lg:gap-8 xl:gap-10 items-center justify-center transition-all duration-400 ${
                breastStyle === "single"
                  ? "grid-cols-2 lg:grid-cols-4 max-w-full"
                  : "grid-cols-2 max-w-4xl mx-auto sm:gap-12 lg:gap-20"
              }`}
            >
              {(breastStyle === "single" ? SINGLE_BREASTED_OPTIONS : DOUBLE_BREASTED_OPTIONS).map(
                (style) => {
                  const isSelected = selectedFrontStyleId === style.id;

                  return (
                    <div
                      key={style.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedFrontStyleId(style.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedFrontStyleId(style.id);
                        }
                      }}
                      className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-none p-3 sm:p-5 transition-all duration-200 bg-white border ${
                        isSelected
                          ? "border-black shadow-xs ring-1 ring-black"
                          : "border-transparent"
                      }`}
                    >
                      {isSelected && (
                        <span
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-black text-white shadow-xs transition-transform duration-300"
                          style={{
                            animation: "checkmarkPop 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                          }}
                        >
                          <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" />
                        </span>
                      )}

                      <div className="relative flex h-[56vh] min-h-[350px] max-h-[700px] w-full items-center justify-center overflow-visible">
                        <Image
                          src={style.image}
                          alt={style.name}
                          width={500}
                          height={780}
                          priority
                          className={`h-full w-auto object-contain transition-transform duration-300 ${
                            isSelected ? "scale-[1.02]" : "group-hover:scale-[1.01]"
                          }`}
                        />
                      </div>

                      <div className="mt-3 sm:mt-4 text-center">
                        <span className="block font-sans text-xs sm:text-sm font-bold tracking-wider text-black">
                          {style.code}
                        </span>
                        <span className="mt-1 block font-serif text-sm sm:text-base italic text-black">
                          {style.name}
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Section 1 Bottom Spacer */}
          <div className="h-4 select-none pointer-events-none" aria-hidden="true" />
        </section>

        {/* =========================================================== */}
        {/* SECTION 2: LAPEL STYLE                                      */}
        {/* =========================================================== */}
        <section
          data-section-index="1"
          className="h-screen w-full relative flex flex-col justify-between p-4 sm:p-6 pb-24 sm:pb-28 lg:p-8 lg:pb-28 shrink-0 bg-white overflow-hidden"
        >
          {/* Section 2 Header */}
          <div className="w-full text-center pt-10 sm:pt-12">
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-[0.28em] text-black uppercase leading-tight select-none">
              LAPEL STYLE
            </h2>

            <p className="mt-2 font-serif text-xs sm:text-sm italic text-black/70">
              Select from 4 bespoke lapel designs
            </p>
          </div>

          {/* Section 2 Grid: ALL 4 LAPEL STYLES */}
          <div className="flex-1 w-full max-w-[1550px] mx-auto flex items-center justify-center px-2">
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-center justify-center max-w-6xl mx-auto">
              {ALL_LAPEL_STYLES.map((lapel) => {
                const isSelected = selectedLapelStyleId === lapel.id;

                return (
                  <div
                    key={lapel.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedLapelStyleId(lapel.id);
                      setSelectedLapelSizeId(null);
                      if (lapel.category !== breastStyle) {
                        setBreastStyle(lapel.category);
                        setSelectedFrontStyleId(null);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedLapelStyleId(lapel.id);
                        setSelectedLapelSizeId(null);
                        if (lapel.category !== breastStyle) {
                          setBreastStyle(lapel.category);
                          setSelectedFrontStyleId(null);
                        }
                      }
                    }}
                    className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-none p-3 sm:p-5 transition-all duration-200 bg-white border ${
                      isSelected
                        ? "border-black shadow-xs ring-1 ring-black"
                        : "border-transparent"
                    }`}
                  >
                    {isSelected && (
                      <span
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-black text-white shadow-xs transition-transform duration-300"
                        style={{
                          animation: "checkmarkPop 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                        }}
                      >
                        <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" />
                      </span>
                    )}

                    {/* Architectural Lapel Diagram */}
                    <div className="relative flex h-[42vh] min-h-[240px] max-h-[480px] w-full items-center justify-center overflow-visible">
                      <Image
                        src={lapel.image}
                        alt={lapel.name}
                        width={400}
                        height={900}
                        priority
                        className={`h-full w-auto object-contain transition-transform duration-300 ${
                          isSelected ? "scale-[1.02]" : "group-hover:scale-[1.01]"
                        }`}
                      />
                    </div>

                    <div className="mt-3 sm:mt-4 text-center">
                      <span className="block font-sans text-xs sm:text-sm font-bold tracking-wider text-black">
                        {lapel.code}
                      </span>
                      <span className="mt-1 block font-serif text-sm sm:text-base italic text-black">
                        {lapel.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2 Bottom Spacer */}
          <div className="h-4 select-none pointer-events-none" aria-hidden="true" />
        </section>

        {/* =========================================================== */}
        {/* SECTION 3: LAPEL SIZE                                       */}
        {/* =========================================================== */}
        <section
          data-section-index="2"
          className="h-screen w-full relative flex flex-col justify-between p-4 sm:p-6 pb-24 sm:pb-28 lg:p-8 lg:pb-28 shrink-0 bg-white overflow-hidden"
        >
          {/* Section 3 Header */}
          <div className="w-full text-center pt-10 sm:pt-12">
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-[0.28em] text-black uppercase leading-tight select-none">
              LAPEL SIZE
            </h2>

            <p className="mt-2 font-serif text-xs sm:text-sm italic text-black/70">
              {selectedLapelStyleId ? `${currentLapelStyle.name} • Width Variation` : "Width Variation"}
            </p>
          </div>

          {/* Section 3 Grid */}
          <div className="flex-1 w-full max-w-[1650px] mx-auto flex flex-col items-center justify-center px-2">
            <div
              key={`${breastStyle}-${selectedLapelStyleId}`}
              style={{ animation: "fadeInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
              className={`w-full grid gap-4 sm:gap-8 lg:gap-12 items-center justify-center ${
                lapelSizes.length === 2
                  ? "grid-cols-2 max-w-3xl mx-auto"
                  : "grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto"
              }`}
            >
              {lapelSizes.map((size) => {
                const isSelected = selectedLapelSizeId === size.id;

                return (
                  <div
                    key={size.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedLapelSizeId(size.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedLapelSizeId(size.id);
                      }
                    }}
                    className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-none p-3 sm:p-5 transition-all duration-200 bg-white border ${
                      isSelected
                        ? "border-black shadow-xs ring-1 ring-black"
                        : "border-transparent"
                    }`}
                  >
                    {isSelected && (
                      <span
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-black text-white shadow-xs transition-transform duration-300"
                        style={{
                          animation: "checkmarkPop 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                        }}
                      >
                        <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" />
                      </span>
                    )}

                    {/* Jacket with specified lapel width */}
                    <div className="relative flex h-[46vh] min-h-[280px] max-h-[520px] w-full items-center justify-center overflow-visible">
                      <Image
                        src={size.image}
                        alt={size.name}
                        width={500}
                        height={780}
                        priority
                        className={`h-full w-auto object-contain transition-transform duration-300 ${
                          isSelected ? "scale-[1.02]" : "group-hover:scale-[1.01]"
                        }`}
                      />
                    </div>

                    <div className="mt-3 sm:mt-4 text-center">
                      <span className="block font-sans text-xs sm:text-sm font-bold tracking-wider text-black">
                        {size.code}
                      </span>
                      <span className="mt-1 block font-serif text-sm sm:text-base italic text-black">
                        {size.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Measuring guidance from lookbook */}
            <div className="mt-3 sm:mt-5 text-center max-w-xl mx-auto px-4">
              <span className="font-serif text-[10px] tracking-[0.22em] uppercase font-bold text-black/60 block">
                MEASURING
              </span>
              <p className="font-serif text-xs italic text-black/70 mt-0.5 leading-relaxed">
                {currentLapelStyle.measuring}
              </p>
            </div>
          </div>

          {/* Section 3 Bottom Spacer */}
          <div className="h-4 select-none pointer-events-none" aria-hidden="true" />
        </section>

        {/* =========================================================== */}
        {/* SECTION 4: BOOK APPOINTMENT                                 */}
        {/* =========================================================== */}
        <section
          data-section-index="3"
          className="h-screen w-full relative flex flex-col justify-between p-4 sm:p-6 pb-24 sm:pb-28 lg:p-8 lg:pb-28 shrink-0 bg-white overflow-y-auto sm:overflow-hidden"
        >
          {/* Section 4 Header */}
          <div className="w-full text-center pt-8 sm:pt-10">
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-[0.28em] text-black uppercase leading-tight select-none">
              BOOK APPOINTMENT
            </h2>
            <p className="mt-2 font-serif text-xs sm:text-sm italic text-black/70">
              Schedule your private bespoke fitting &amp; consultation
            </p>
          </div>

          {/* Section 4 Content (Form or Success Card) */}
          <div className="flex-1 w-full max-w-xl mx-auto flex flex-col items-center justify-center px-4 my-auto">
            {!isSubmitted ? (
              <div
                style={{ animation: "fadeInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
                className="w-full bg-white border border-black p-6 sm:p-8 shadow-xs"
              >
                {/* Appointment Form */}
                <form onSubmit={handleSubmitAppointment} className="space-y-4">
                  {formError && (
                    <div className="p-2.5 bg-black text-white text-xs font-serif text-center">
                      {formError}
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="apt-name"
                      className="block font-serif text-[11px] tracking-[0.2em] uppercase text-black font-semibold mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="apt-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Maximilian Weber"
                      className="w-full border border-black/30 focus:border-black focus:ring-0 px-3.5 py-2.5 text-black placeholder:text-black/30 font-serif text-sm bg-white transition-colors outline-none"
                    />
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label
                      htmlFor="apt-phone"
                      className="block font-serif text-[11px] tracking-[0.2em] uppercase text-black font-semibold mb-1.5"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="apt-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g. +49 170 1234567"
                      className="w-full border border-black/30 focus:border-black focus:ring-0 px-3.5 py-2.5 text-black placeholder:text-black/30 font-serif text-sm bg-white transition-colors outline-none"
                    />
                  </div>

                  {/* Date and Time Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="apt-date"
                        className="block font-serif text-[11px] tracking-[0.2em] uppercase text-black font-semibold mb-1.5"
                      >
                        Date *
                      </label>
                      <input
                        id="apt-date"
                        type="date"
                        required
                        style={{ colorScheme: "light" }}
                        min={typeof window !== "undefined" ? new Date().toISOString().split("T")[0] : ""}
                        value={formData.date}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                        className="w-full border border-black/30 focus:border-black focus:ring-0 px-3.5 py-2.5 text-black font-serif text-sm bg-white transition-colors outline-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="apt-time"
                        className="block font-serif text-[11px] tracking-[0.2em] uppercase text-black font-semibold mb-1.5"
                      >
                        Time *
                      </label>
                      <input
                        id="apt-time"
                        type="time"
                        required
                        style={{ colorScheme: "light" }}
                        value={formData.time}
                        onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                        className="w-full border border-black/30 focus:border-black focus:ring-0 px-3.5 py-2.5 text-black font-serif text-sm bg-white transition-colors outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-black text-white hover:bg-neutral-800 transition-all duration-300 py-3.5 px-6 font-serif text-xs sm:text-sm tracking-[0.22em] uppercase font-bold cursor-pointer shadow-xs active:scale-[0.99]"
                    >
                      SUBMIT APPOINTMENT
                    </button>
                  </div>

                  <p className="font-serif text-[10.5px] italic text-center text-black/50 pt-1">
                    Complimentary fitting &bull; No purchase obligation
                  </p>
                </form>
              </div>
            ) : (
              <div
                style={{ animation: "fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
                className="w-full bg-white border border-black p-8 sm:p-10 shadow-xs text-center"
              >
                {/* Animated Black Checkmark */}
                <div
                  className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4"
                  style={{
                    animation: "checkmarkPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  }}
                >
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl tracking-[0.24em] text-black uppercase">
                  APPOINTMENT CONFIRMED
                </h3>

                <p className="mt-2 font-serif text-sm italic text-black/80">
                  Thank you, <span className="font-semibold text-black">{formData.name}</span>.
                </p>

                <p className="mt-1 font-serif text-xs sm:text-sm text-black/70">
                  Your private bespoke fitting has been scheduled.
                </p>

                {/* Details Summary Card */}
                <div className="my-6 p-4 border border-black/20 bg-black/[0.02] text-left font-serif text-xs sm:text-sm space-y-1.5">
                  <div className="flex justify-between border-b border-black/10 pb-1.5">
                    <span className="text-black/60 uppercase tracking-wider text-[11px]">Appointment:</span>
                    <span className="font-semibold text-black">{formData.date} at {formData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60 uppercase tracking-wider text-[11px]">Contact Phone:</span>
                    <span className="font-semibold text-black">{formData.phone}</span>
                  </div>
                </div>

                {/* Live Countdown Message */}
                <div className="mt-6 flex flex-col items-center justify-center gap-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white font-serif text-xs tracking-wider">
                    <span className="inline-block w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Closing and returning to home in {countdown}s...</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleReturnHomeNow}
                    className="mt-3 inline-block font-serif text-[11px] tracking-[0.2em] uppercase text-black underline underline-offset-4 hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    Return to home now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 4 Bottom Spacer */}
          <div className="h-4 select-none pointer-events-none" aria-hidden="true" />
        </section>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FIXED BOTTOM: Step Indicator & Scroll Down Hint               */}
      {/* ------------------------------------------------------------- */}
      {!isSubmitted && (
        <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 pointer-events-auto">
          {/* Scroll hint indicator */}
          {activeSection < 3 ? (
            <button
              type="button"
              onClick={() => goToSection(activeSection + 1)}
              className="flex items-center gap-1.5 font-serif text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-black hover:opacity-60 transition-opacity cursor-pointer group"
            >
              <span>
                {activeSection === 0
                  ? "LAPEL STYLE"
                  : activeSection === 1
                  ? "LAPEL SIZE"
                  : "BOOK APPOINTMENT"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goToSection(0)}
              className="flex items-center gap-1.5 font-serif text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-black hover:opacity-60 transition-opacity cursor-pointer group"
            >
              <ChevronUp className="h-3.5 w-3.5" />
              <span>BACK TO TOP</span>
            </button>
          )}

          {/* Step Indicator Nav Pill */}
          <nav
            aria-label="Konfigurationsschritte"
            className="flex items-center gap-2.5 sm:gap-5 font-serif text-[9px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.22em] uppercase bg-white/95 backdrop-blur-md px-3 sm:px-8 py-2 sm:py-2.5 border border-black/20 shadow-xs"
          >
            <button
              type="button"
              onClick={() => goToSection(0)}
              className={`cursor-pointer transition-all duration-300 ${
                activeSection === 0
                  ? "text-black font-bold border-b border-black pb-0.5"
                  : "text-black/40 hover:text-black"
              }`}
            >
              01. FRONT STYLE
            </button>
            <span className="text-black/25 select-none">•</span>
            <button
              type="button"
              onClick={() => goToSection(1)}
              className={`cursor-pointer transition-all duration-300 ${
                activeSection === 1
                  ? "text-black font-bold border-b border-black pb-0.5"
                  : "text-black/40 hover:text-black"
              }`}
            >
              02. LAPEL STYLE
            </button>
            <span className="text-black/25 select-none">•</span>
            <button
              type="button"
              onClick={() => goToSection(2)}
              className={`cursor-pointer transition-all duration-300 ${
                activeSection === 2
                  ? "text-black font-bold border-b border-black pb-0.5"
                  : "text-black/40 hover:text-black"
              }`}
            >
              03. LAPEL SIZE
            </button>
            <span className="text-black/25 select-none">•</span>
            <button
              type="button"
              onClick={() => goToSection(3)}
              className={`cursor-pointer transition-all duration-300 ${
                activeSection === 3
                  ? "text-black font-bold border-b border-black pb-0.5"
                  : "text-black/40 hover:text-black"
              }`}
            >
              04. APPOINTMENT
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
