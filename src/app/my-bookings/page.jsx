"use client";


import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, CalendarX2, CircleAlert, LogIn } from "lucide-react";

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
import { getTokenFromClient } from "../lib/getTokenFromClient";
import BookingsCard, { formatDate } from "@/components/Card/BookingsCard/BookingsCard";
import EmptyState from "@/components/EmptyState/EmptyState";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { SkeletonList, LoaderScreen } from "@/components/Skeletons";

export default function MyBookingsPage() {
  const { data: session, isPending } = useSession();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // fetch failed — not the same as "no bookings"
  const [target, setTarget] = useState(null); // booking waiting for cancel confirmation
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const fetchData = useCallback(async () => {
    // signed out — nothing to fetch
    if (!session?.user?.id) return;

    setLoading(true);
    setError(false);
    const token = await getTokenFromClient();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/${session.user.id}`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBookings(data);
    } catch {
      setError(true);
      toast.error("Could not load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  /* cancel */
  const confirmCancel = async (bookingId) => {
    // console.log(bookingId)
    // console.log(session?.user.id)
    setCancelling(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/${bookingId}?userId=${session?.user.id}`, {
        method:'DELETE'
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // console.log(data)
      setBookings((prev) => prev.filter((b) => b.productId !== bookingId));
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
    // console.log(bookingId)
    setConfirming(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/${bookingId}`, {
        method:'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Confirmed' }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // console.log(data)
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: 'Confirmed' } : b)));
      toast.success("Booking confirmed.");
    } catch {
      toast.error("Could not confirm the booking. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  /* session still resolving — generic loader */
  if (isPending) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="flex-1"><LoaderScreen /></div>
        <Footer />
      </main>
    );
  }

  /* signed out — tell the user instead of spinning forever */
  if (!session) {
    return (
      <main className="flex min-h-screen flex-col bg-white text-slate-800">
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-4">
          <EmptyState
            title="Please sign in"
            description="Sign in to see the studios you've booked."
            icon={LogIn}
            href="/signin"
            label="Go to sign in"
          />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-800">
      <Navbar />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#244855] sm:text-4xl">My bookings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track your reservations. Only Pending bookings can be cancelled.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <SkeletonList rows={4} />
          ) : error ? (
            <EmptyState
              title="Something went wrong"
              description="We couldn't load your bookings. Check your connection and try again."
              icon={CircleAlert}
              action={
                <Button
                  onClick={fetchData}
                  className="rounded-xl bg-[#E64833] font-semibold text-white shadow-sm shadow-[#E64833]/25 hover:bg-[#cf3e2b]"
                >
                  Try again
                </Button>
              }
            />
          ) : bookings.length === 0 ? (
            <EmptyState
              title="No bookings yet"
              description="When you book a studio, your reservations will show up here."
              icon={CalendarX2}
              href="/explore-studio"
              label="Explore studios"
            />
          ) : (
            <BookingsCard bookings={bookings} onCancel={setTarget} onConfirm={confirmStatus} confirming={confirming} />
          )}
        </div>
      </div>
      <Footer />

      {/* cancel confirmation */}
      <AlertDialog open={!!target} onOpenChange={(o) => !o && !cancelling && setTarget(null)}>
        <AlertDialogContent className="border-slate-200 bg-white text-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#244855]">Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              {target &&
                `${target.studioTitle || target.productName || "Studio"} on ${formatDate(target.date || target.BookingDate)}, ${target.startTime || ""} to ${target.endTime || ""}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={cancelling}
              className="border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Keep booking
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={cancelling}
              onClick={(e) => {
                e.preventDefault(); // stay open until the request finishes
                confirmCancel(target.productId);
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
