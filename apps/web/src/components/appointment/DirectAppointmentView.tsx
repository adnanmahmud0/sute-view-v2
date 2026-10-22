"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export function DirectAppointmentView() {
  const router = useRouter();

  // Lifecycle & Animation states
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

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

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
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

  return (
    <div
      className={`relative h-screen w-full bg-white select-none overflow-y-auto sm:overflow-hidden transition-all duration-400 ease-out flex flex-col justify-between p-4 sm:p-6 lg:p-8 ${
        isMounted && !isClosing
          ? "opacity-100 scale-100"
          : "opacity-0 scale-[0.985] pointer-events-none"
      }`}
    >
      {/* FIXED TOP CONTROLS: Close button */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Schließen und zurück zur Startseite"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 flex h-10 w-10 items-center justify-center text-black hover:opacity-50 hover:rotate-90 hover:scale-110 transition-all duration-300 z-50 cursor-pointer"
        title="Schließen"
      >
        <X className="h-6 w-6 stroke-[1.5]" />
      </button>

      {/* Header */}
      <div className="w-full text-center pt-8 sm:pt-10">
        <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-[0.28em] text-black uppercase leading-tight select-none">
          BOOK APPOINTMENT
        </h1>
        <p className="mt-2 font-serif text-xs sm:text-sm italic text-black/70">
          Schedule your private bespoke fitting &amp; consultation
        </p>
      </div>

      {/* Content (Form or Success Card) */}
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

            <h2 className="font-cinzel text-xl sm:text-2xl tracking-[0.24em] text-black uppercase">
              APPOINTMENT CONFIRMED
            </h2>

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
                onClick={() => handleClose()}
                className="mt-3 inline-block font-serif text-[11px] tracking-[0.2em] uppercase text-black underline underline-offset-4 hover:opacity-60 transition-opacity cursor-pointer"
              >
                Return to home now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Spacer */}
      <div className="h-4 select-none pointer-events-none" aria-hidden="true" />
    </div>
  );
}
