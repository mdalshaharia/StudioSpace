"use client";

/**
 * StudioSpace – Booking modal (shadcn/ui only)
 * Place at: components/Modal/BookingModal.jsx
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarDays, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/app/lib/auth-client";
import { getTokenFromClient } from "@/app/lib/getTokenFromClient";

// opening hours: 08:00 – 22:00 (last start 21:00)
const START_HOURS = Array.from({ length: 14 }, (_, i) => 8 + i);
const CLOSING_HOUR = 22;

const pad = (n) => String(n).padStart(2, "0");
const toTime = (h) => `${pad(h)}:00`;

const fieldCls =
  "h-11 w-full rounded-xl border-white/10 bg-neutral-950 text-white focus-visible:ring-amber-400/60";

export default function BookingModal({ studio, open, onOpenChange }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [date, setDate] = useState(new Date());
  const [dateOpen, setDateOpen] = useState(false);
  const [start, setStart] = useState("12");
  const [hours, setHours] = useState("3");
  const [submitting, setSubmitting] = useState(false);

  // reset when the modal opens
  useEffect(() => {
    if (open) {
      setDate(new Date());
      setStart("12");
      setHours("3");
    }
  }, [open]);

  const startNum = Number(start);
  const maxHours = Math.min(8, CLOSING_HOUR - startNum);
  const hoursNum = Math.min(Number(hours), maxHours);

  // keep hours valid if the start time changes
  useEffect(() => {
    if (Number(hours) > maxHours) setHours(String(maxHours));
  }, [maxHours, hours]);

  const { rentTotal, total } = useMemo(() => {
    const hourlyRate = studio?.hourlyRate ? Number(studio.hourlyRate) : 0;
    const securityDeposit = studio?.securityDeposit ? Number(studio.securityDeposit) : 0;
    const rent = hourlyRate * hoursNum;
    return { rentTotal: rent, total: rent + securityDeposit };
  }, [studio?.hourlyRate, studio?.securityDeposit, hoursNum]);

  if (!studio) return null;

  const handleConfirm = async () => {
    if (!session) {
      toast.error("Please sign in to book a studio.");
      const redirectId = studio._id || studio.slug || "";
      router.push(`/signin?redirect=/studio-details/${redirectId}`);
      return;
    }

    setSubmitting(true);
    try {
      console.log("Initiating booking...");

      const token = await getTokenFromClient();
      console.log("Token retrieved:", token);

      const bookingData = {
        // IDs & Titles compatible with all views
        studioId: studio._id,
        productId: studio._id,
        studioTitle: studio.title,
        productName: studio.title,
        studioImage: studio.imageUrl,
        productImage: studio.imageUrl,

        // User info
        userId: session?.user?.id,
        userName: session?.user?.name,
        userEmail: session?.user?.email,

        // Timing
        date: format(date, "yyyy-MM-dd"),
        BookingDate: date.toISOString(),
        startTime: toTime(startNum),
        endTime: toTime(startNum + hoursNum),
        hours: hoursNum,

        // Financials
        hourlyRate: studio.hourlyRate,
        securityDeposit: studio.securityDeposit,
        rentTotal,
        total,

        // Status
        status: "Pending",
      };
      console.log("Booking data prepared:", bookingData);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(bookingData),
        }
      );

      const result = await res.json();
      console.log("Booking response:", result);

      if (res.ok) {
        toast.success("Booking submitted successfully!");
        onOpenChange?.(false);
        router.push("/my-bookings");
      } else {
        toast.error(result.message || "Failed to submit booking.");
      }
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("An error occurred while booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !submitting && onOpenChange?.(o)}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl border-white/10 bg-neutral-900 p-6 text-white sm:max-w-lg sm:p-8">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-extrabold tracking-tight">
            Book {studio.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Choose a date, start time and duration to book this studio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-neutral-200">Date</Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-neutral-950 px-4 text-left text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-amber-400/60"
                >
                  {format(date, "EEE, d MMM yyyy")}
                  <CalendarDays className="h-4 w-4 text-neutral-400" aria-hidden />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-auto border-white/10 bg-neutral-900 p-2 text-white"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    if (d) {
                      setDate(d);
                      setDateOpen(false);
                    }
                  }}
                  disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* start + hours */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-200">Start time</Label>
              <Select value={start} onValueChange={setStart}>
                <SelectTrigger className={fieldCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-neutral-900 text-neutral-200">
                  {START_HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)} className="focus:bg-white/10 focus:text-white">
                      {toTime(h)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-200">Hours</Label>
              <Select value={String(hoursNum)} onValueChange={setHours}>
                <SelectTrigger className={fieldCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-neutral-900 text-neutral-200">
                  {Array.from({ length: maxHours }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={String(n)} className="focus:bg-white/10 focus:text-white">
                      {n} {n === 1 ? "hour" : "hours"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* name + email (read-only, from session) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="bk-name" className="text-xs font-semibold text-neutral-200">
                Your name
              </Label>
              <Input
                id="bk-name"
                readOnly
                value={session?.user?.name ?? ""}
                placeholder="Sign in to book"
                className={`${fieldCls} cursor-not-allowed bg-white/5 text-neutral-300`}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bk-email" className="text-xs font-semibold text-neutral-200">
                Your email
              </Label>
              <Input
                id="bk-email"
                readOnly
                value={session?.user?.email ?? ""}
                placeholder="Sign in to book"
                className={`${fieldCls} cursor-not-allowed bg-white/5 text-neutral-300`}
              />
            </div>
          </div>

          {/* price breakdown */}
          <dl className="space-y-2 border-t border-white/10 pt-4 text-sm">
            <Row
              label={`$${studio.hourlyRate} x ${hoursNum} ${hoursNum === 1 ? "hour" : "hours"}`}
              value={`$${rentTotal}`}
            />
            <Row label="Security deposit (refundable)" value={`$${studio.securityDeposit}`} />
            <div className="flex justify-between pt-1 text-base font-bold">
              <dt>Total</dt>
              <dd>${total}</dd>
            </div>
          </dl>

          <Button
            onClick={handleConfirm}
            disabled={submitting}
            className="h-12 w-full rounded-xl bg-amber-400 text-base font-semibold text-neutral-900 hover:bg-amber-300"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking…
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
          <p className="text-center text-xs text-neutral-400">Saved to bookings with status Pending.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-neutral-300">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
