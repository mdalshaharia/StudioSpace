'use client'
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { authorizedFetch } from "../lib/getTokenFromClient";
import ProductContext from "@/context/productContext";
import ListingCard from "@/components/Card/ListingCard/ListingCard";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { SkeletonList } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState/EmptyState";

/* ------------------------------ config ------------------------------ */

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ADD_ROUTE = "/add-studio";
const EDIT_ROUTE = (id) => `/studios/edit/${id}`;

/* ------------------------------- page -------------------------------- */

export default function MyListingsPage() {

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [studios, setStudios] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = useSession();
   const { products = [], error } = useContext(ProductContext);
 

  /* fetch listings */

useEffect(() => {
    async function fetchData() {
      // Guard clause: Don't fetch if the user session isn't loaded yet
      if (!session?.user?.id) return;

      try {
        const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/my-listings/${session.user.id}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const resData = await res.json();

          const resIds = new Set(resData.map((p) => p.studioId || p._id));

          const filteredData = products.filter((d) => resIds.has(d._id));
          setListings(filteredData);
        }
      } catch (err) {
        toast.error("Could not load your listings. Please try again.");
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session, products]);

  // console.log(products)


  /* delete */
  const confirmDelete = async (studioId) => {
    setDeleting(true);
    try {
      const [studioRes, listingRes] = await Promise.all([
        authorizedFetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studios/${studioId}?userId=${session.user.id}`, {
          method: 'DELETE',
        }),
        authorizedFetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/my-listings/${studioId}?userId=${session.user.id}`, {
          method: 'DELETE',
        }),
      ]);
      if (!studioRes.ok || !listingRes.ok) {
      throw new Error("Failed to delete from one or more endpoints.");
    }
      setListings((prev) => prev.filter((l) => l?._id !== studioId));
      setStudios((prev) => prev.filter((s) => s._id !== studioId));
      toast.success("Listing deleted.");
      setToDelete(null);
    } catch {
      toast.error("Could not delete the listing. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
              My studio listings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Spaces you host. Update details or remove a listing.
            </p>
          </div>
          <Link
            href={ADD_ROUTE}
            className="btn rounded-xl border-none bg-[#E64833] px-5 text-white shadow-sm shadow-[#E64833]/25 transition hover:bg-[#cf3e2b] sm:self-start"
          >
            Add new studio
          </Link>
        </div>

        {/* body */}
        <div className="mt-6">
          {loading ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <SkeletonList rows={4} />
            </div>
          ) : listings.length === 0 ? (
            <EmptyState href={ADD_ROUTE} label="Add new studio" icon={Building2} />
          ) : (
            <>
            <ListingCard products={listings} onRequestDelete={(s) => setToDelete(s)} ></ListingCard>

              {/* ---------- mobile: cards ---------- */}
              <ul className="space-y-3 md:hidden">
                {listings.map((s) => (
                  <li
                    key={s._id}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Thumb src={s.imageUrl} alt={s.title} />
                      <div className="min-w-0">
                        <p className="truncate font-bold text-heading">{s.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {s.location} · <span className="font-bold text-heading">${s.hourlyRate}/hr</span>
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
      <Footer />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && !deleting && setToDelete(null)}>
        <AlertDialogContent className="border-border bg-card text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-heading">Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {toDelete &&
                `“${toDelete.title || "This studio"}” will be permanently removed from your listings. This can’t be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="border-border bg-card text-foreground/85 hover:bg-muted hover:text-foreground"
            >
              Keep listing
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                confirmDelete(toDelete._id);
              }}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…
                </>
              ) : (
                "Delete listing"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

/* ----------------------------- pieces ----------------------------- */

function Thumb({ src, alt }) {
  return src ? (
    <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border">
      <Image src={src} alt={alt} fill sizes="40px" className="object-cover" />
    </span>
  ) : (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
      <Building2 className="h-4 w-4" aria-hidden />
    </span>
  );
}

function CategoryPill({ children }) {
  return (
    <span className="badge badge-outline h-auto whitespace-nowrap rounded-full border-border px-3 py-1 text-xs font-normal text-muted-foreground">
      {children}
    </span>
  );
}

function RowActions({ id, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={EDIT_ROUTE(id)}
        className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-xs font-semibold text-foreground/85 transition hover:bg-muted hover:text-[#E64833]"
      >
        Update
      </Link>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-9 items-center rounded-lg border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-100"
      >
        Delete
      </button>
    </div>
  );
}

