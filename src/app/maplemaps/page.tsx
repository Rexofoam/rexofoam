"use client";

import Link from "next/link";

export default function MaplemapsPage() {
  return (
    <main className="relative min-h-screen bg-slate-900/80">
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div
          className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/30 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          style={{
            backgroundImage: "url('/images/maintenance.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-slate-950/55 px-6 py-10 text-center backdrop-blur-[1px] sm:px-8 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
              Maple Maps
            </p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Page In Development
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-100">
              We are currently building the Maplemaps experience. Please check
              back soon.
            </p>

            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
