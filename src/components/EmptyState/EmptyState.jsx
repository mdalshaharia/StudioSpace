"use client";

import Link from "next/link";
import { Inbox, CalendarX2, ArrowRight } from "lucide-react";

export default function EmptyState({
  title = "Nothing Here Yet",
  description,
  href = "/explore-studio",
  label = "Explore studios",
  icon: Icon = CalendarX2,
  action, // optional custom button — overrides the href/label link
}) {
  return (
    <section
      aria-live="polite"
      className="mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl px-6 py-12 text-center text-[#244855] sm:px-10"
    >
      {/* icon */}
      <div className="grid h-40 w-40 place-items-center rounded-full bg-[#E64833]/10 sm:h-48 sm:w-48">
        <Icon
          className="h-16 w-16 text-[#E64833] motion-safe:animate-pulse"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
      <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-[#244855] sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      )}

      <div className="mt-5">
        {action ?? (
          <Link
            href={href}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#E64833] transition-colors hover:text-[#c93a28] focus-visible:outline-none focus-visible:underline"
          >
            <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1.5px]">
              {label}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </section>
  );
}
