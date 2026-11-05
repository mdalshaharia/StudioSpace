'use client'
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Building2 } from "lucide-react";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSession } from "../lib/auth-client";
// import { getTokenFromServer } from "../lib/getTokenFromServer";
import { getTokenFromClient } from "../lib/getTokenFromClient";
import ProductContext from "@/context/productContext";
import ListingCard from "@/components/Card/ListingCard/ListingCard";

/* ------------------------------ config ------------------------------ */

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ADD_ROUTE = "/add-studio";
const EDIT_ROUTE = (id) => `/add-studio?studioId=${id}`;

/* ------------------------------- page -------------------------------- */

export default function MyListingsPage() {
  //  const session = await auth.api.getSession({ headers: await headers() });
  // console.log(session)

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [studios, setStudios] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = useSession();
   const { products = [], error } = useContext(ProductContext);
 
  /* auth guard */

  /* fetch listings */

useEffect(() => {
    async function fetchData() {
      // Guard clause: Don't fetch if the user session isn't loaded yet
      if (!session?.user?.id) return;

      try {
        const token = await getTokenFromClient();
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/my-listings/${session.user.id}`, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const resData = await res.json();
          console.log('response data :', resData);

          // 1. Create a Set of IDs from the response data for instant O(1) lookups
          // (Using p.productId or p._id depending on how your backend structures the response)
          const resIds = new Set(resData.map((p) => p.productId || p._id));

          // 2. Safely filter products using .has() instead of an array-to-string comparison
          const filteredData = products.filter((d) => resIds.has(d._id));
          
          console.log("Filtered data:", filteredData);
          setListings(filteredData);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session, products]);

  // console.log(products)


  /* delete */
  const confirmDelete = async (productId) => {
    // console.log(productId)
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/${productId}`, {
        method:'DELETE'
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      console.log(data)
      setListings((prev) => prev.filter((l) => l?._id !== productId));
      setStudios((prev) => prev.filter((s) => s._id !== productId));
      toast.success("Listing deleted.");
    } catch {
      toast.error("Could not delete the listing. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              My studio listings
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              Spaces you host. Update details or remove a listing.
            </p>
          </div>
          <Link
            href={ADD_ROUTE}
            className="btn rounded-xl border-none bg-amber-400 px-5 text-neutral-900 hover:bg-amber-300 sm:self-start"
          >
            Add new studio
          </Link>
        </div>

        {/* body */}
        <div className="mt-6">
          {/* {status === "loading" && <LoadingState />} */}

          {status === "error" && (
            <EmptyState
              title="Something went wrong"
              text="We couldn't load your listings."
              action={
                <Button
                  onClick={() => user && load(user)}
                  className="rounded-xl bg-amber-400 font-semibold text-neutral-900 hover:bg-amber-300"
                >
                  Try again
                </Button>
              }
            />
          )}

          {status === "ready" && studios.length === 0 && (
            <EmptyState
              title="No listings yet"
              text="Add your first studio and start getting bookings."
              action={
                <Link
                  href={ADD_ROUTE}
                  className="btn rounded-xl border-none bg-amber-400 text-neutral-900 hover:bg-amber-300"
                >
                  Add new studio
                </Link>
              }
            />
          )}

          {listings.length > 0 && (
            <>
            <ListingCard products={listings} confirmDelete={confirmDelete} ></ListingCard>

              {/* ---------- mobile: cards ---------- */}
              <ul className="space-y-3 md:hidden">
                {listings.map((s) => (
                  <li
                    key={s._id}
                    className="rounded-2xl border border-white/10 bg-neutral-900 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Thumb src={s.imageUrl} alt={s.title} />
                      <div className="min-w-0">
                        <p className="truncate font-bold">{s.title}</p>
                        <p className="text-sm text-neutral-400">
                          {s.location} · <span className="font-bold text-white">${s.hourlyRate}/hr</span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <CategoryPill>{s.category}</CategoryPill>
                      <RowActions id={s._id} onDelete={() => setToDelete(s)} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* delete confirmation */}
      {/* <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && !deleting && setToDelete(null)}>
        <AlertDialogContent className="border-white/10 bg-neutral-900 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this studio?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              “{toDelete?.title}” will be permanently removed from your listings. This can’t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault(); // keep dialog open until request finishes
                confirmDelete();
              }}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </main>
  );
}

/* ----------------------------- pieces ----------------------------- */

function Thumb({ src, alt }) {
  return src ? (
    // plain <img> so any image host works without next.config changes
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-10 w-10 shrink-0 rounded-lg border border-white/10 object-cover"
    />
  ) : (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#4a3a26] to-[#2c2318] text-neutral-400">
      <Building2 className="h-4 w-4" aria-hidden />
    </span>
  );
}

function CategoryPill({ children }) {
  return (
    <span className="badge badge-outline h-auto whitespace-nowrap rounded-full border-white/20 px-3 py-1 text-xs font-normal text-neutral-200">
      {children}
    </span>
  );
}

function RowActions({ id, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={EDIT_ROUTE(id)}
        className="inline-flex h-9 items-center rounded-lg border border-white/15 px-4 text-xs font-semibold text-white transition hover:bg-white/5"
      >
        Update
      </Link>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-9 items-center rounded-lg border border-red-500/20 bg-red-500/15 px-4 text-xs font-semibold text-red-300 transition hover:bg-red-500/25"
      >
        Delete
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-white/5 p-4 last:border-0"
        >
          <div className="h-10 w-10 animate-pulse rounded-lg bg-white/10" />
          <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
          <div className="ml-auto hidden h-4 w-24 animate-pulse rounded bg-white/10 sm:block" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-neutral-900 px-6 py-14 text-center">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-neutral-400">{text}</p>
      <div className="mt-5 flex justify-center">{action}</div>
    </div>
  );
}