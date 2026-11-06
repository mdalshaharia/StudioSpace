'use client';

import ProductContext from "@/context/productContext";
import Link from "next/link";
import { useContext, useRef } from "react";
import Image from "next/image";

export default function ByCategory() {
  const { products = [] } = useContext(ProductContext);
  const uniqueCategoriesWithImages = Array.from(
    products.reduce((map, p) => {
      if (p.category && !map.has(p.category)) {
        map.set(p.category, {
          category: p.category,
          imageUrl: p.imageUrl || "/default-category.png",
        });
      }
      return map;
    }, new Map()).values()
  );

  const scrollerRef = useRef(null);

  const slide = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#244855] sm:text-3xl">
              Browse by studio type
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Find spaces purpose-built for your specific creative medium.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => slide(-1)}
              aria-label="Previous category"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:border-[#E64833] hover:bg-[#E64833]/5 hover:text-[#E64833] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E64833]/70"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => slide(1)}
              aria-label="Next category"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:border-[#E64833] hover:bg-[#E64833]/5 hover:text-[#E64833] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E64833]/70"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <ul
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
        >
          {uniqueCategoriesWithImages.map((category, i) => (
            <li
              key={i}
              className="w-[calc((100%-0.75rem)/2)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]"
            >
              <Link
                href={`/explore-studio`}
                className="group relative flex h-36 w-full items-end overflow-hidden rounded-2xl border border-slate-200 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#E64833] hover:shadow-xl hover:shadow-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E64833]/70 sm:h-40 lg:h-44"
              >
                {category.imageUrl && (
                  <Image
                    src={category.imageUrl}
                    alt={category.category || category.title || "Category"}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
                {/* gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#244855]/20 via-[#244855]/5 to-transparent" />
                <span className="relative z-10 text-xs font-bold uppercase tracking-wider text-white transition duration-200 group-hover:text-[#E64833] sm:text-sm">
                  {category.category || category.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
