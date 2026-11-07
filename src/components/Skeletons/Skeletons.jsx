"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

/* --------------------------- shared skeletons --------------------------- */

/* image + two text lines — matches FeaturedCard layout */
export function SkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="mt-auto flex items-center justify-between pt-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  );
}

/* responsive grid of cards — explore / listings results */
export function SkeletonGrid({ count = 6 }) {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading content"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <SkeletonCard />
        </li>
      ))}
    </ul>
  );
}

/* list rows with thumbnail + text — my-bookings / my-listings */
export function SkeletonList({ rows = 4 }) {
  return (
    <div aria-busy="true" aria-label="Loading list" className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-8 w-24 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/* studio details page skeleton — gallery + heading + sections */
export function SkeletonDetail() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:items-start lg:px-8">
      <div className="min-w-0">
        <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        <div className="mt-6 space-y-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="mt-8 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <Skeleton className="h-9 w-32" />
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="mt-4 h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}

/* full-page loading spinner */
export function LoaderScreen({ label = "Loading…" }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="grid min-h-[60vh] w-full place-items-center bg-white"
    >
      <Loader2 className="h-6 w-6 animate-spin text-[#E64833]" aria-hidden />
    </div>
  );
}

/* category rail — ByCategory home strip */
export function SkeletonRail({ count = 5 }) {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading categories"
      className="flex snap-x snap-mandatory gap-3 overflow-hidden pb-2 sm:gap-4"
    >
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="w-[calc((100%-0.75rem)/2)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]"
        >
          <div className="relative flex h-36 w-full items-end rounded-2xl border border-slate-200 bg-slate-100 p-4 sm:h-40 lg:h-44">
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </li>
      ))}
    </ul>
  );
}
