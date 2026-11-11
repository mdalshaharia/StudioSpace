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
import { authorizedFetch } from "../lib/getTokenFromClient";
import BookingsCard, { formatDate } from "@/components/Card/BookingsCard/BookingsCard";
import EmptyState from "@/components/EmptyState/EmptyState";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { SkeletonList, LoaderScreen } from "@/components/Skeletons";

export default function MyBookingsPage() {
  const { data: session, isPending } = useSession();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [target, setTarget] = useState(null); 
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const fetchData = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/${session.user.id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBookings(data);
      setError(false);
    } catch {
      setError(true);
      toast.error("Could not load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session?.user?.id) return;
    let ignore = false;

    (async () => {
      try {
        const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/${session.user.id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!ignore) {
          setBookings(data);
          setError(false);
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          setError(true);
          toast.error("Could not load your bookings. Please try again.");
          setLoading(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [session]);

  const confirmCancel = async (booking) => {
    setCancelling(true);
    try {
      const res = await authorizedFetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/${booking.studioId}?userId=${session?.user.id}` +
          `&date=${encodeURIComponent(booking.date ?? "")}` +
          `&startTime=${encodeURIComponent(booking.startTime ?? "")}` +
          `&endTime=${encodeURIComponent(booking.endTime ?? "")}`,
        {
          method:'DELETE'
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.deletedCount) {
        toast.error("Could not cancel the booking. Please try again.");
        return;
      }
      setBookings((prev) =>
        prev.filter(
          (b) => !(b.studioId === booking.studioId && b.startTime === booking.startTime && b.endTime === booking.endTime)
        )
      );
      toast.success("Booking cancelled.");
      setTarget(null);
    } catch {
      toast.error("Could not cancel the booking. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const askConfirm = (booking) => {
    toast(
      `Confirm booking for ${booking.studioTitle || "this studio"}?`,
      {
        description: `${formatDate(booking.date || booking.BookingDate)} · ${booking.startTime || "—"} to ${booking.endTime || "—"} · $${booking.total ?? 0}`,
        action: {
          label: "Yes, confirm",
          onClick: () => confirmStatus(booking._id),
        },
        cancel: { label: "Not yet" },
        duration: 8000,
      }
    );
  };

  const confirmStatus = async (bookingId) => {
    // console.log(bookingId)
    setConfirming(true);
    try {
      const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/${bookingId}`, {
        method:'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Confirmed' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || "Could not confirm the booking. Please try again.");
        return;
      }
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: 'Confirmed' } : b)));
      toast.success("Booking confirmed.");
    } catch {
      toast.error("Could not confirm the booking. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex-1"><LoaderScreen /></div>
        <Footer />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col bg-background text-foreground">
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
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">My bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your reservations. Only Pending bookings can be cancelled.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {loading ? (
            <SkeletonList rows={4} />
          ) : error ? (
            <EmptyState
              title="Something went wrong"
              description="We couldn't load your bookings. Check your connection and try again."
              icon={CircleAlert}
              action={
                <Button
                  onClick={() => {
                    setLoading(true);
                    fetchData();
                  }}
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
              href="/studios"
              label="Explore studios"
            />
          ) : (
            <BookingsCard bookings={bookings} onCancel={setTarget} onConfirm={askConfirm} confirming={confirming} />
          )}
        </div>
      </div>
      <Footer />

      {/* cancel confirmation */}
      <AlertDialog open={!!target} onOpenChange={(o) => !o && !cancelling && setTarget(null)}>
        <AlertDialogContent className="border-border bg-card text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-heading">Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {target &&
                `${target.studioTitle || "Studio"} on ${formatDate(target.date || target.BookingDate)}, ${target.startTime || ""} to ${target.endTime || ""}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={cancelling}
              className="border-border bg-card text-foreground/85 hover:bg-muted hover:text-foreground"
            >
              Keep booking
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={cancelling}
              onClick={(e) => {
                e.preventDefault(); // stay open until the request finishes
                confirmCancel(target);
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
