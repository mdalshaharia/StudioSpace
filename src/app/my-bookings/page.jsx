"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { getTokenFromClient } from "../lib/getTokenFromClient";
import BookingsCard, { formatDate } from "@/components/Card/BookingsCard/BookingsCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  console.log(session)

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null); // booking waiting for cancel confirmation
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // redirect if signed out
  // useEffect(() => {
  //   if (!isPending && !session) router.replace("/login?redirect=/dashboard/bookings");
  // }, [isPending, session, router]);
 useEffect(() => {
    async function fetchData() {
      // const token = await getTokenFromServer()
      const token = await getTokenFromClient()
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/${session?.user.id}`, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
          setLoading(false)
          // setStudios(data)
          // setStatus("ready");
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        // setLoading(false);
        setLoading(false)

      }
    }
    fetchData();
  }, [session]);


  /* cancel */
  const confirmCancel = async (bookingId) => {
    console.log(bookingId)
    setCancelling(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/${bookingId}`, {
        method:'DELETE'
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      console.log(data)
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast.success("Booking cancelled.");
      setTarget(null);
    } catch {
      toast.error("Could not cancel the booking. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  /* confirm (update status) */
  const confirmStatus = async (bookingId) => {
    console.log(bookingId)
    setConfirming(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/${bookingId}`, {
        method:'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Confirmed' }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      console.log(data)
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: 'Confirmed' } : b)));
      toast.success("Booking confirmed.");
    } catch {
      toast.error("Could not confirm the booking. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  if (isPending || !session) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-neutral-950">
        <Loader2 className="h-6 w-6 animate-spin text-amber-400" aria-label="Loading" />
      </main>
    );
  }

  return (
    <main className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">My bookings</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Track your reservations. Only Pending bookings can be cancelled.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
          {loading ? (
            <div className="space-y-3 p-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg bg-white/10" />
                  <Skeleton className="h-4 w-40 bg-white/10" />
                  <Skeleton className="ml-auto hidden h-4 w-24 bg-white/10 sm:block" />
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="font-bold">No bookings yet</p>
              <p className="mt-1 text-sm text-neutral-400">Find a studio and book your first slot.</p>
              <Button
                asChild
                className="mt-5 rounded-xl bg-amber-400 font-semibold text-neutral-900 hover:bg-amber-300"
              >
                <Link href="/explore">Explore studios</Link>
              </Button>
            </div>
          ) : (
            <BookingsCard bookings={bookings} onCancel={setTarget} onConfirm={confirmStatus} confirming={confirming} />
          )}
        </div>
      </div>

      {/* cancel confirmation */}
      <AlertDialog open={!!target} onOpenChange={(o) => !o && !cancelling && setTarget(null)}>
        <AlertDialogContent className="border-white/10 bg-neutral-900 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              {target &&
                `${target.studioTitle} on ${formatDate(target.date)}, ${target.startTime} to ${target.endTime}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={cancelling}
              className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
            >
              Keep booking
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={cancelling}
              onClick={(e) => {
                e.preventDefault(); // stay open until the request finishes
                confirmCancel(target._id);
              }}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
