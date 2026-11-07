"use client";

import { Suspense, useContext, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, SearchX } from "lucide-react";

import ProductContext from "@/context/productContext";
import FeaturedCard from "@/components/Featured/FeaturedCard";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { SkeletonGrid, LoaderScreen } from "@/components/Skeletons";
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
    <main className="flex min-h-screen flex-col bg-white text-slate-800">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<LoaderScreen />}>
          <Explore />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}

function Explore() {

  /* how many studios to show per page */
  const PAGE_SIZE = 6;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const resultsRef = useRef(null);

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

  /* ----------------------------- pagination ----------------------------- */

  const totalPages = Math.max(1, Math.ceil(sortedList.length / PAGE_SIZE));

  /* reset to page 1 whenever the filters change so the range stays valid */
  const [prevFilters, setPrevFilters] = useState({
    searchQuery,
    selectedCategory,
    sortBy,
  });
  if (
    prevFilters.searchQuery !== searchQuery ||
    prevFilters.selectedCategory !== selectedCategory ||
    prevFilters.sortBy !== sortBy
  ) {
    setPrevFilters({ searchQuery, selectedCategory, sortBy });
    setPage(1);
  }

  /* keep the active page in range if the list shrinks */
  if (page > totalPages) {
    setPage(totalPages);
  }

  /* jump to a page and bring the grid back into view */
  const goToPage = (next) => {
    setPage(next);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* the 6 studios of the active page */
  const visibleList = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedList.slice(start, start + PAGE_SIZE);
  }, [sortedList, page]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800">
      <main className="flex-1">
        <div ref={resultsRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* header */}
          <h1 className="text-3xl font-extrabold tracking-tight text-[#244855] sm:text-4xl">
            Explore studios
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Find the right workspace for your next project.
          </p>

          {/* search + sort */}
          <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px]">
            {/* Search Input */}
            <div className="space-y-1.5">
              <label htmlFor="search" className="text-[11px] font-semibold text-[#E64833]">
                Search
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Studio name or location"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-9 text-slate-800 placeholder:text-slate-400 focus-visible:ring-[#E64833]/60"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="sort" className="text-[11px] font-semibold text-[#E64833]">
                Sort by
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  id="sort"
                  className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-slate-800 focus:ring-[#E64833]/60"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white text-slate-700">
                  {SORTS.map((s) => (
                    <SelectItem
                      key={s.value}
                      value={s.value}
                      className="focus:bg-slate-100 focus:text-[#244855]"
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
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${active
                      ? "border-[#E64833] bg-[#E64833] text-white shadow-sm shadow-[#E64833]/25"
                      : "border-slate-200 text-slate-600 hover:border-[#E64833]/60 hover:text-[#E64833]"
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
                    className="rounded-xl border-none bg-[#E64833] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#E64833]/25 transition hover:bg-[#cf3e2b]"
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
                    className="rounded-xl border-none bg-[#E64833] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#E64833]/25 transition hover:bg-[#cf3e2b]"
                  >
                    Clear filters
                  </button>
                }
              />
            )}

            {status === "ready" && sortedList.length > 0 && (
              <>
                <p className="mb-3 text-xs text-slate-500">
                  <span>
                    {visibleList.length === 0
                      ? `${sortedList.length} ${sortedList.length === 1 ? "studio" : "studios"} found`
                      : `Showing ${(page - 1) * PAGE_SIZE + 1}–${(page - 1) * PAGE_SIZE + visibleList.length} of ${sortedList.length}`}
                  </span>
                </p>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleList.map((s, i) => (
                    <li key={s._id ?? i}>
                      <FeaturedCard studio={s} />
                    </li>
                  ))}
                </ul>

                {totalPages > 1 && (
                  <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ----------------------------- pieces ----------------------------- */

function Message({ icon, title, text, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
      {icon && (
        <SearchX className="mx-auto mb-3 h-8 w-8 text-slate-400" aria-hidden />
      )}
      <h2 className="text-lg font-bold text-[#244855]">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
      <div className="mt-5 flex justify-center">{action}</div>
    </div>
  );
}

/* ---------------------------- pagination ---------------------------- */

/* Prev / numbered pages / Next — trim long page lists with an ellipsis */
function Pagination({ page, totalPages, goToPage }) {
  const pages = pageNumbers(page, totalPages);

  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full border text-sm transition";
  const idle =
    "border-slate-200 bg-white text-slate-700 hover:border-[#E64833] hover:bg-[#E64833]/5 hover:text-[#E64833]";
  const active =
    "border-[#E64833] bg-[#E64833] text-white shadow-sm shadow-[#E64833]/25 hover:bg-[#cf3e2b]";

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-2"
    >
      {/* previous */}
      <button
        type="button"
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${btn} ${idle} disabled:pointer-events-none disabled:opacity-40`}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>

      {/* page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="px-1 text-sm text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => goToPage(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${btn} ${p === page ? active : idle}`}
          >
            {p}
          </button>
        )
      )}

      {/* next */}
      <button
        type="button"
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={`${btn} ${idle} disabled:pointer-events-none disabled:opacity-40`}
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}

/* which page buttons to show: 1 … around-current … last (max 7 buttons) */
function pageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const show = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...show]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) {
      result.push("…");
    }
    result.push(p);
  });
  return result;
}
