"use client";

import { useContext } from "react";
import ProductContext from "@/context/productContext";
import Link from "next/link";
import Image from "next/image";

const GRADIENTS = [
  "from-[#4a3a26] to-[#2c2318]",
  "from-[#26333c] to-[#1a232a]",
  "from-[#3a2c45] to-[#241b2c]",
  "from-[#2b4033] to-[#1a2820]",
];

export default function Featured() {
  const { products } = useContext(ProductContext);
  const featured = products.slice(0, 4);

  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Featured studios</h2>
          <Link
            href="/explore"
            className="shrink-0 text-sm font-medium text-amber-400 transition hover:text-amber-300"
          >
            See all
          </Link>
        </div>
        <p className="mt-2 text-sm text-neutral-400">Handpicked spaces from our community.</p>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s, i) => (
            <li key={s._id ?? i}>
              <Link
                href={`/studios/${s._id ?? s.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition duration-300 hover:-translate-y-1 hover:border-amber-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              >
                {/* image area */}
                <div
                  className={`relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}
                >
                  {(s.imageURL ?? s.imageUrl) && (
                    <Image
                      src={s.imageURL ?? s.imageUrl}
                      alt={s.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-wider text-amber-300/90">
                    {s.amenities?.[0] ?? s.category}
                  </span>
                </div>

                {/* body */}
                <div className="flex flex-1 flex-col p-4">
                  <span className="badge badge-outline h-auto self-start rounded-full border-white/20 px-3 py-1 text-xs font-normal text-neutral-200">
                    {s.category}
                  </span>

                  <h3 className="mt-3 text-base font-bold leading-tight text-white">{s.title}</h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    {[s.location, s.maxCapacity && `${s.maxCapacity} guests`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <p className="mt-auto pt-3 text-sm">
                    <span className="font-bold text-white">${s.hourlyRate}</span>
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
