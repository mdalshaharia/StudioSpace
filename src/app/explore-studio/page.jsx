"use client";

import { Suspense, useContext, useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";

import ProductContext from "@/context/productContext";
import FeaturedCard from "@/components/Featured/FeaturedCard";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CHIPS = [
  { key: "all", label: "All" },
  { key: "photo", label: "Photo Studio" },
  { key: "film", label: "Film Stage" },
  { key: "podcast", label: "Podcast Lounge" },
  { key: "music", label: "Music Suite" },
  { key: "workshop", label: "Workshop" },
];

const SORTS = [
  { value: "default", label: "Recommended" },
  { value: "price lower to higher", label: "Price: Low to High" },
  { value: "price higher to lower", label: "Price: High to Low" },
  { value: "top rated", label: "Top Rated" },
];

/* ------------------------------- page -------------------------------- */

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <Explore />
    </Suspense>
  );
}

function Explore() {
  // State with clear, meaningful names
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const { products = [], loading, error } = useContext(ProductContext);
  const status = loading ? "loading" : error ? "error" : "ready";

  const filteredProducts = useMemo(() => {
    return products.filter((studio) => {
      // Search matching (checks studio title or location)
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !term ||
        studio.title?.toLowerCase().includes(term) ||
        studio.location?.toLowerCase().includes(term);

      // Category matching
      const studioCategory = (studio.category || "").toLowerCase();
      const matchesCategory =
        selectedCategory === "all" ||
        studioCategory.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);


  const sortedList = useMemo(() => {
    const sorted = [...filteredProducts];
    const sortOption = sortBy.toLowerCase();

    if (sortOption === "price lower to higher") {
      sorted.sort((a, b) => Number(a.hourlyRate) - Number(b.hourlyRate));
    } else if (sortOption === "price higher to lower") {
      sorted.sort((a, b) => Number(b.hourlyRate) - Number(a.hourlyRate));
    } else if (sortOption === "top rated") {
      sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  // Reset all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("default");
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* header */}
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Explore studios
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Find the right workspace for your next project.
          </p>

          {/* search + sort */}
          <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-neutral-900 p-4 sm:grid-cols-[1fr_220px]">
            {/* Search Input */}
            <div className="space-y-1.5">
              <label htmlFor="search" className="text-[11px] font-medium text-amber-400/90">
                Search
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Studio name or location"
                  className="h-11 rounded-xl border-white/10 bg-neutral-950 pl-9 text-white placeholder:text-neutral-500 focus-visible:ring-amber-400/60"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="sort" className="text-[11px] font-medium text-amber-400/90">
                Sort by
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  id="sort"
                  className="h-11 w-full rounded-xl border-white/10 bg-neutral-950 text-white focus:ring-amber-400/60"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-neutral-900 text-neutral-200">
                  {SORTS.map((s) => (
                    <SelectItem
                      key={s.value}
                      value={s.value}
                      className="focus:bg-white/10 focus:text-white"
                    >
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* category chips */}
          <div
            role="tablist"
            aria-label="Filter by category"
            className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {CHIPS.map((c) => {
              const active = selectedCategory === c.key;
              return (
                <button
                  key={c.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(c.key)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-amber-400 bg-amber-400 text-neutral-900 font-bold"
                      : "border-white/15 text-neutral-200 hover:border-amber-400/60 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* results */}
          <div className="mt-6" aria-live="polite">
            {status === "loading" && <SkeletonGrid />}

            {status === "error" && (
              <Message
                title="Couldn't load studios"
                text="Check your connection and try again."
                action={
                  <button
                    onClick={() => location.reload()}
                    className="btn rounded-xl border-none bg-amber-400 text-neutral-900 hover:bg-amber-300"
                  >
                    Reload
                  </button>
                }
              />
            )}

            {status === "ready" && sortedList.length === 0 && (
              <Message
                icon
                title="No studios match your search"
                text="Try a different keyword or clear your filters."
                action={
                  <button
                    onClick={clearFilters}
                    className="btn rounded-xl border-none bg-amber-400 text-neutral-900 hover:bg-amber-300 font-bold"
                  >
                    Clear filters
                  </button>
                }
              />
            )}

            {status === "ready" && sortedList.length > 0 && (
              <>
                <p className="mb-3 text-xs text-neutral-400">
                  {sortedList.length} {sortedList.length === 1 ? "studio" : "studios"} found
                </p>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedList.map((s, i) => (
                    <li key={s._id ?? i}>
                      <FeaturedCard studio={s} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ----------------------------- pieces ----------------------------- */

function SkeletonGrid() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900"
        >
          <div className="aspect-[16/9] animate-pulse bg-white/5" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-white/10" />
            <div className="h-8 w-full animate-pulse rounded bg-white/10" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Message({ icon, title, text, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-neutral-900 px-6 py-14 text-center">
      {icon && (
        <SearchX className="mx-auto mb-3 h-8 w-8 text-neutral-500" aria-hidden />
      )}
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-neutral-400">{text}</p>
      <div className="mt-5 flex justify-center">{action}</div>
    </div>
  );
}
