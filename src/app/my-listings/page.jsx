"use client";

/**
 * StudioSpace – My studio listings
 * Place at: app/my-listings/page.jsx  (this is the redirect target after "Add Studio")
 *
 * Stack: Next.js (App Router) + Tailwind + shadcn/ui (Table, Button, AlertDialog)
 *        + sonner toasts + Firebase Auth
 *
 * API (Express + MongoDB) – env: NEXT_PUBLIC_API_URL
 *   GET    {API}/studios/mine       -> [{ _id, title, category, hourlyRate, location, imageURL }]
 *   DELETE {API}/studios/:id
 *   (both send  Authorization: Bearer <firebase id token>;
 *    /studios/mine should filter by the verified token's uid/email)
 *
 * Update button links to /dashboard/studios/:id/edit – change EDIT_ROUTE if needed.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

/* ------------------------------ config ------------------------------ */

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ADD_ROUTE = "/dashboard/studios/new";
const EDIT_ROUTE = (id) => `/dashboard/studios/${id}/edit`;

/* ------------------------------- page -------------------------------- */

export default function MyListingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [studios, setStudios] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* auth guard */

  /* fetch listings */
  const load = useCallback(async (u) => {
    setStatus("loading");
    try {
      const token = await u.getIdToken();
      const res = await fetch(`${API_URL}/studios/mine`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error();
      setStudios(await res.json());
      setStatus("ready");
    } catch {
      setStatus("error");
      toast.error("Could not load your listings.");
    }
  }, []);


  /* delete */
  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/studios/${toDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setStudios((prev) => prev.filter((s) => s._id !== toDelete._id));
      toast.success(`“${toDelete.title}” was deleted.`);
      setToDelete(null);
    } catch {
      toast.error("Could not delete the studio. Please try again.");
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
          {status === "loading" && <LoadingState />}

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

          {status === "ready" && studios.length > 0 && (
            <>
              {/* ---------- desktop / tablet: table ---------- */}
              <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      {["Studio", "Category", "Rate", "Location", "Actions"].map((h) => (
                        <TableHead
                          key={h}
                          className="h-12 text-xs font-semibold text-neutral-400"
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studios.map((s) => (
                      <TableRow key={s._id} className="border-white/5 hover:bg-white/[0.02]">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Thumb src={s.imageURL} alt={s.title} />
                            <span className="font-bold">{s.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <CategoryPill>{s.category}</CategoryPill>
                        </TableCell>
                        <TableCell className="font-bold">${s.hourlyRate}/hr</TableCell>
                        <TableCell className="text-neutral-400">{s.location}</TableCell>
                        <TableCell>
                          <RowActions
                            id={s._id}
                            onDelete={() => setToDelete(s)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* ---------- mobile: cards ---------- */}
              <ul className="space-y-3 md:hidden">
                {studios.map((s) => (
                  <li
                    key={s._id}
                    className="rounded-2xl border border-white/10 bg-neutral-900 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Thumb src={s.imageURL} alt={s.title} />
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
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && !deleting && setToDelete(null)}>
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
      </AlertDialog>
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