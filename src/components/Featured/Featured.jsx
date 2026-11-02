"use client";

import { useContext } from "react";
import ProductContext from "@/context/productContext";
import Link from "next/link";
import Image from "next/image";

export default function Featured() {
  const { products } = useContext(ProductContext);
  const featured = [...products]
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
    .slice(0, 6);

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

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s, i) => (
            <li key={i}>
              <Link
                href={`/studios/${s._id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              >
                {/* image area */}
                <div
                  className={`relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br`}
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

                  <p className="mt-auto flex items-center justify-between gap-3 pt-3 text-sm">
                    <span>
                      <span className="font-bold text-white">${s.hourlyRate}</span>
                      <span className="text-neutral-400"> / hour</span>
                    </span>
                    {s.rating != null && (
                      <span className="font-semibold text-amber-400">
                        ★ {Number(s.rating).toFixed(1)}
                      </span>
                    )}
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
