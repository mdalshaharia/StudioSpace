"use client";

import { useContext } from "react";
import ProductContext from "@/context/productContext";
import Link from "next/link";
import FeaturedCard from "./FeaturedCard";
import { SkeletonGrid } from "@/components/Skeletons";

export default function Featured() {
  const { products = [], loading } = useContext(ProductContext);
  const featured = [...products]
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
    .slice(0, 6);

  return (
    <section className="relative bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-heading sm:text-3xl">
              Featured studios
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Handpicked, highly rated creative spaces from our host community.
            </p>
          </div>
          <Link
            href="/studios"
            className="shrink-0 text-sm font-semibold text-[#E64833] transition hover:text-[#E64833]/80 hover:underline inline-flex items-center gap-1"
          >
            See all
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="mt-8">
            <SkeletonGrid count={6} />
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((studio, i) => (
              <li key={studio._id ?? i}>
                <FeaturedCard studio={studio} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
