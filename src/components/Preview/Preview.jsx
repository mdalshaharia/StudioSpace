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
    <section className="">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        {/* ------------------------- left ------------------------- */}
        <div className="max-w-md">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            See what is free before you ask.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400 sm:text-base">
            Every listing shows a live week view. Pick an open slot, see the full price, and
            book without waiting for a reply.
          </p>
        </div>

        {/* ------------------------- right: week grid ------------------------- */}
        <div className="w-full max-w-xl lg:ml-auto">
          {/* day headers */}
          <div className="mb-2 grid grid-cols-5 gap-2 sm:gap-3">
            {DAYS.map((d) => (
              <span
                key={d}
                className="text-center text-[11px] font-medium text-neutral-400 sm:text-xs"
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
                      className={`h-9 rounded-lg border transition duration-200 sm:h-11 ${
                        booked
                          ? "cursor-not-allowed border-transparent bg-white/[0.07]"
                          : isSelected
                          ? "border-amber-400 bg-amber-400/20 shadow-[0_0_0_1px_rgba(251,191,36,0.3)]"
                          : "border-white/15 bg-neutral-950/60 hover:border-amber-400/60 hover:bg-amber-400/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* legend */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-neutral-400">
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded border border-white/20 bg-neutral-950/60" /> Open
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded bg-white/10" /> Booked
            </span>
            <span className="flex items-center gap-2">
              <i className="h-3 w-3 rounded border border-amber-400 bg-amber-400/20" /> Selected
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}