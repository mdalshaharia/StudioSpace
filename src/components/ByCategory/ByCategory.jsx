'use client';

import ProductContext from "@/context/productContext";
import Link from "next/link";
import { useContext, useRef } from "react";
import Image from "next/image";

export default function ByCategory() {
  const { products = [] } = useContext(ProductContext);
  const scrollerRef = useRef(null);

  const slide = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Browse by studio type
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Find spaces purpose-built for your specific creative medium.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => slide(-1)}
              aria-label="Previous category"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-neutral-900/80 text-neutral-300 transition hover:border-amber-400/60 hover:bg-neutral-800 hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => slide(1)}
              aria-label="Next category"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-neutral-900/80 text-neutral-300 transition hover:border-amber-400/60 hover:bg-neutral-800 hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* cards */}
        <ul
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, i) => (
            <li
              key={product._id || i}
              className="w-[calc((100%-0.75rem)/2)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]"
            >
              <Link
                href={`/explore-studio?type=${encodeURIComponent(product.category || product.title)}`}
                className="group relative flex h-36 w-full items-end overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-4 transition duration-300 hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-xl hover:shadow-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 sm:h-40 lg:h-44"
              >
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.category || product.title}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover opacity-50 transition duration-500 group-hover:scale-105 group-hover:opacity-65"
                  />
                )}
                {/* gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <span className="relative z-10 text-xs font-bold uppercase tracking-wider text-neutral-200 transition duration-200 group-hover:text-amber-300 sm:text-sm">
                  {product.category || product.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
