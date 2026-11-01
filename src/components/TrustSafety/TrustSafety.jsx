/**
 * StudioSpace – Host guarantee and creator support (Trust and safety)
 * Stack: Next.js (App Router) + Tailwind + daisyUI + lucide-react
 * Server component (no "use client" needed).
 *
 * Usage (app/page.jsx):
 *   import TrustAndSafety from "@/components/TrustAndSafety";
 *   <TrustAndSafety />
 *
 * Uses the same container, badge, card and amber accent styles as the other
 * sections (Hero, BrowseByType, FeaturedStudios, HowBookingWorks).
 */

import { ShieldCheck, UserCheck, Package, Headset } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Liability protection",
    text: "Host and creator are covered for damage and accidents during every confirmed booking.",
  },
  {
    icon: UserCheck,
    title: "Verified profiles",
    text: "Hosts and creators confirm their identity before they can list or book a space.",
  },
  {
    icon: Package,
    title: "Equipment safety",
    text: "Gear listed with a studio is checked in and out so nothing goes missing.",
  },
  {
    icon: Headset,
    title: "24/7 host support",
    text: "Real people are on hand any time of day if something goes wrong on shoot day.",
  },
];

export default function TrustSafety() {
  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-amber-950/30 via-neutral-900 to-neutral-900 p-6 sm:p-8 lg:p-10">
          {/* header */}
          <span className="badge badge-outline h-auto rounded-full border-white/20 px-3 py-1.5 text-[11px] font-normal text-neutral-200">
            Trust and safety
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Host guarantee and creator support
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
            Every booking is backed by protections for the people who host and the people who
            create.
          </p>

          {/* features */}
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="rounded-2xl border border-white/10 bg-neutral-900 p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-400/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/15 text-amber-400">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}