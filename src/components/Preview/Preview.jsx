"use client";

import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// rows = time slots, columns = days. "o" = open, "b" = booked
const SLOTS = [
  ["o", "b", "o", "o", "b", "o", "b"],
  ["b", "o", "o", "b", "o", "o", "o"],
  ["o", "o", "b", "o", "o", "b", "o"],
  ["b", "b", "o", "o", "b", "o", "o"],
];

const ROW_LABELS = ["9:00", "12:00", "15:00", "18:00"];

export default function Preview() {
  // default selection matches the design (row 2, Wed)
  const [selected, setSelected] = useState("1-2");

  return (
    <section className="relative bg-card">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        {/* ------------------------- left ------------------------- */}
        <div className="max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E64833]/20 bg-[#E64833]/5 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#E64833]">
            Real-Time Scheduling
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-heading sm:text-4xl">
            See what is free before you ask.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every studio listing includes an active live calendar. Pick your desired slot, see
            transparent hourly pricing, and lock in your session without waiting for email chains.
          </p>
        </div>

        {/* ------------------------- right: week grid ------------------------- */}
        <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-lg lg:ml-auto">
          {/* day headers */}
          <div className="mb-3 grid grid-cols-7 gap-2 sm:gap-3">
            {DAYS.map((d) => (
              <span
                key={d}
                className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {d}
              </span>
            ))}
          </div>

          {/* slots */}
          <div className="grid gap-2 sm:gap-3">
            {SLOTS.map((row, r) => (
              <div key={r} className="grid grid-cols-7 gap-2 sm:gap-3">
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
                          ? "cursor-not-allowed border-transparent bg-foreground/15 dark:bg-white/15"
                          : isSelected
                          ? "border-[#E64833] bg-[#E64833]/10 shadow-[0_0_15px_rgba(230,72,51,0.15)] ring-1 ring-[#E64833] dark:bg-[#E64833]/20"
                          : "border-border bg-muted/50 hover:border-[#E64833]/60 hover:bg-[#E64833]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E64833]/60 dark:bg-white/[0.06] dark:hover:bg-[#E64833]/10"
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-md border border-border bg-muted/50 dark:bg-white/[0.06]" /> Open
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-md bg-foreground/15 dark:bg-white/15" /> Booked
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3.5 w-3.5 rounded-md border border-[#E64833] bg-[#E64833]/10 dark:bg-[#E64833]/20" /> Selected
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
