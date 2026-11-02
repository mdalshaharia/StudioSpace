"use client";

import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// rows = time slots, columns = days. "o" = open, "b" = booked
const SLOTS = [
  ["o", "b", "o", "o", "b"],
  ["b", "o", "o", "b", "o"],
  ["o", "o", "b", "o", "o"],
  ["b", "b", "o", "o", "b"],
];

const ROW_LABELS = ["9:00", "12:00", "15:00", "18:00"];

export default function Preview() {
  // default selection matches the design (row 2, Wed)
  const [selected, setSelected] = useState("1-2");

  return (
    <section className="relative">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        {/* ------------------------- left ------------------------- */}
        <div className="max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-amber-400">
            Real-Time Scheduling
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            See what is free before you ask.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-300 sm:text-base">
            Every studio listing includes an active live calendar. Pick your desired slot, see
            transparent hourly pricing, and lock in your session without waiting for email chains.
          </p>
        </div>

        {/* ------------------------- right: week grid ------------------------- */}
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-neutral-900/90 p-6 shadow-2xl backdrop-blur-md lg:ml-auto">
          {/* day headers */}
          <div className="mb-3 grid grid-cols-5 gap-2 sm:gap-3">
            {DAYS.map((d) => (
              <span
                key={d}
                className="text-center text-xs font-semibold uppercase tracking-wider text-neutral-400"
              >
                {d}
              </span>
            ))}
          </div>

          {/* slots */}
          <div className="grid gap-2 sm:gap-3">
            {SLOTS.map((row, r) => (
              <div key={r} className="grid grid-cols-5 gap-2 sm:gap-3">
                {row.map((state, c) => {
                  const id = `${r}-${c}`;
                  const isSelected = selected === id;
                  const booked = state === "b";

                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={booked}
                      aria-pressed={isSelected}
                      aria-label={`${DAYS[c]} ${ROW_LABELS[r]} – ${
                        booked ? "booked" : isSelected ? "selected" : "open"
                      }`}
                      onClick={() => setSelected(isSelected ? null : id)}
                      className={`h-10 rounded-xl border transition duration-200 sm:h-12 ${
                        booked
                          ? "cursor-not-allowed border-transparent bg-neutral-800/40 opacity-40"
                          : isSelected
                          ? "border-amber-400 bg-amber-400/25 shadow-[0_0_15px_rgba(251,191,36,0.25)] ring-1 ring-amber-400"
                          : "border-white/10 bg-neutral-950/70 hover:border-amber-400/60 hover:bg-amber-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* legend */}
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-xs font-medium text-neutral-300">
            <span className="flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-md border border-white/10 bg-neutral-950/70" /> Open
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-md bg-neutral-800/40 opacity-40" /> Booked
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-md border border-amber-400 bg-amber-400/25" /> Selected
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
