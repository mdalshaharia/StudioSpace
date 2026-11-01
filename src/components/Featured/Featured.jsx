/**
 * StudioSpace – Featured studios
 * Stack: Next.js (App Router) + Tailwind + daisyUI
 * Server component (no "use client" needed).
 *
 * Usage (app/page.jsx):
 *   import FeaturedStudios from "@/components/FeaturedStudios";
 *   <FeaturedStudios />
 *
 * Replace STUDIOS with data from your API / MongoDB (same shape), e.g.
 *   const studios = await fetch(`${process.env.API_URL}/studios?featured=true`).then(r => r.json());
 *   <FeaturedStudios studios={studios} />
 *
 * To use real photos, add `image` to each studio and uncomment the <Image /> line.
 */

import Link from "next/link";
// import Image from "next/image";

const STUDIOS = [
  {
    id: "white-box-cyc",
    name: "White Box Cyc",
    category: "Photography",
    tag: "Cyc wall",
    meta: "Downtown · 120 sq m",
    price: 60,
    gradient: "from-[#4a3a26] to-[#2c2318]",
  },
  {
    id: "stage-nine",
    name: "Stage Nine",
    category: "Film",
    tag: "Sound stage",
    meta: "Industrial district · 300 sq m",
    price: 140,
    gradient: "from-[#26333c] to-[#1a232a]",
  },
  {
    id: "low-tide-sessions",
    name: "Low Tide Sessions",
    category: "Music",
    tag: "Recording suite",
    meta: "Riverside · Live room + booth",
    price: 55,
    gradient: "from-[#3a2c45] to-[#241b2c]",
  },
  {
    id: "the-couch-room",
    name: "The Couch Room",
    category: "Podcast",
    tag: "Podcast lounge",
    meta: "Old town · 4 mics",
    price: 45,
    gradient: "from-[#2b4033] to-[#1a2820]",
  },
];

export default function Featured({ studios = STUDIOS }) {
  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Featured studios</h2>
        <p className="mt-2 text-sm text-neutral-400">Sample listings for the concept.</p>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {studios.map((s) => (
            <li key={s.id}>
              <Link
                href={`/studios/${s.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition duration-300 hover:-translate-y-1 hover:border-amber-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              >
                {/* image area */}
                <div
                  className={`relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br ${s.gradient}`}
                >
                  {/* <Image src={s.image} alt={s.name} fill className="object-cover transition duration-500 group-hover:scale-105" /> */}
                  <span className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-wider text-amber-300/90">
                    {s.tag}
                  </span>
                </div>

                {/* body */}
                <div className="flex flex-1 flex-col p-4">
                  <span className="badge badge-outline h-auto self-start rounded-full border-white/20 px-3 py-1 text-xs font-normal text-neutral-200">
                    {s.category}
                  </span>

                  <h3 className="mt-3 text-base font-bold leading-tight text-white">{s.name}</h3>
                  <p className="mt-1 text-xs text-neutral-400">{s.meta}</p>

                  <p className="mt-auto pt-3 text-sm">
                    <span className="font-bold text-white">${s.price}</span>
                    <span className="text-neutral-400"> / hour</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}