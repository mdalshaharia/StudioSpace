'use client'

import ProductContext from "@/context/productContext";
import Link from "next/link";
import { useContext, useRef } from "react";
import Image from "next/image";

const STUDIO_TYPES = [
  {
    slug: "photography-cyc-walls",
    label: "Photography cyc walls",
    gradient: "from-[#2a2118] to-[#16130f]",
  },
  {
    slug: "film-and-sound-stages",
    label: "Film and sound stages",
    gradient: "from-[#1b2a33] to-[#12181d]",
  },
  {
    slug: "music-recording-suites",
    label: "Music recording suites",
    gradient: "from-[#2d2236] to-[#1a141f]",
  },
  {
    slug: "podcast-lounges",
    label: "Podcast lounges",
    gradient: "from-[#1c2b21] to-[#121a15]",
  },
  {
    slug: "art-workshops",
    label: "Art workshops",
    gradient: "from-[#33231c] to-[#1d1511]",
  },
];

export default function ByCategory() {
  const { products, loading } = useContext(ProductContext)
  const scrollerRef = useRef(null)
  console.log(products)

  const slide = (direction) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Browse by studio type
          </h2>
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => slide(-1)}
                aria-label="Previous"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-amber-400 hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => slide(1)}
                aria-label="Next"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-amber-400 hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* cards */}
        <ul
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, i) => (
            <li
              key={i}
              className="w-[calc((100%-0.75rem)/2)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]"
            >
              <Link
                href={`/explore/${product.title}`}
                className={`group relative flex h-32 w-full items-end overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br p-4 transition duration-300 hover:-translate-y-1 hover:border-amber-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 sm:h-36 lg:h-40 from-[#33231c] to-[#1d1511]`}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.category}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover opacity-60 transition group-hover:scale-105"
                />
                <span className="relative text-[11px] font-bold uppercase leading-snug tracking-wider text-neutral-200 transition group-hover:text-white sm:text-xs">
                  {product.category}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* bottom slider controls (mobile) */}
      </div>
    </section>
  );
}