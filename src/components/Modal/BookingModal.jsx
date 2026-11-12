"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/app/lib/auth-client";
import { authorizedFetch } from "@/app/lib/getTokenFromClient";
const START_HOURS = Array.from({
  length: 14
}, (_, i) => 8 + i);
const CLOSING_HOUR = 22;
const pad = n => String(n).padStart(2, "0");
const toTime = h => `${pad(h)}:00`;
const fieldCls = "h-11 w-full rounded-xl border-border bg-muted/50 text-foreground focus-visible:ring-[#E64833]/60";
export default function BookingModal({
  studio,
  open,
  onOpenChange
}) {
  const router = useRouter();
  const {
    data: session
  } = useSession();
  const [date, setDate] = useState(() => new Date());
  const [dateOpen, setDateOpen] = useState(false);
  const [start, setStart] = useState("12");
  const [hours, setHours] = useState("3");
  const [submitting, setSubmitting] = useState(false);
  const startNum = Number(start);
  const maxHours = Math.min(8, CLOSING_HOUR - startNum);
  const hoursNum = Math.min(Number(hours), maxHours);
  const handleStartChange = val => {
    setStart(val);
    const nextMax = Math.min(8, CLOSING_HOUR - Number(val));
    if (Number(hours) > nextMax) {
      setHours(String(nextMax));
    }
  };
  const {
    rentTotal,
    total
  } = useMemo(() => {
    const hourlyRate = studio?.hourlyRate ? Number(studio.hourlyRate) : 0;
    const securityDeposit = studio?.securityDeposit ? Number(studio.securityDeposit) : 0;
    const rent = hourlyRate * hoursNum;
    return {
      rentTotal: rent,
      total: rent + securityDeposit
    };
  }, [studio?.hourlyRate, studio?.securityDeposit, hoursNum]);
  if (!studio) return null;
  const handleConfirm = async () => {
    if (!session) {
      toast.error("Please sign in to book a studio.");
      const redirectId = studio._id || studio.slug || "";
      router.push(`/signin?redirect=/studios/${redirectId}`);
      return;
    }
    setSubmitting(true);
    try {
      const newStart = toTime(startNum);
      const newEnd = toTime(startNum + hoursNum);
      const bookingDate = format(date, "yyyy-MM-dd");
      const conflictsRes = await authorizedFetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings/studio/${studio._id}?date=${bookingDate}`, {
        cache: "no-store"
      });
      if (!conflictsRes.ok) throw new Error("Could not check availability.");
      const confirmed = await conflictsRes.json();
      const clash = Array.isArray(confirmed) && confirmed.find(b => b.startTime < newEnd && b.endTime > newStart);
      if (clash) {
        toast.error(`That time clashes with an existing booking (${clash.startTime}–${clash.endTime} on ${bookingDate}). Please pick a different slot.`);
        return;
      }
      const bookingData = {
        studioId: studio._id,
        studioTitle: studio.title,
        studioImage: studio.imageUrl,
        userId: session?.user?.id,
        userName: session?.user?.name,
        userEmail: session?.user?.email,
        date: bookingDate,
        BookingDate: date.toISOString(),
        startTime: newStart,
        endTime: newEnd,
        hours: hoursNum,
        hourlyRate: studio.hourlyRate,
        securityDeposit: studio.securityDeposit,
        rentTotal,
        total,
        status: "Pending"
      };
      const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studio-bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Booking submitted successfully!");
        onOpenChange?.(false);
      } else {
        toast.error(result.message || "Failed to submit booking.");
      }
    } catch (err) {
      console.error("Booking failed:", err);
      if (err?.message !== "session-expired; sign-in in progress") {
        toast.error(err?.message || "An error occurred while booking.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  return <Dialog open={open} onOpenChange={o => !submitting && onOpenChange?.(o)}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl border-border bg-card p-6 text-foreground sm:max-w-lg sm:p-8">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-heading">
            Book {studio.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Choose a date, start time and duration to book this studio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Date</Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <button type="button" className="flex h-12 w-full items-center justify-between rounded-xl border border-border bg-muted/50 px-4 text-left text-sm font-medium text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-[#E64833]/60">
                  {format(date, "EEE, d MMM yyyy")}
                  <CalendarDays className="h-4 w-4 text-muted-foreground ml-2" aria-hidden />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto border-border bg-card p-2 text-foreground">
                <Calendar mode="single" selected={date} onSelect={d => {
                if (d) {
                  setDate(d);
                  setDateOpen(false);
                }
              }} disabled={{
                before: new Date(new Date().setHours(0, 0, 0, 0))
              }} autoFocus />
              </PopoverContent>
            </Popover>
          </div>

          {}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Start time</Label>
              <Select value={start} onValueChange={handleStartChange}>
                <SelectTrigger className={fieldCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-card text-foreground/85">
                  {START_HOURS.map(h => <SelectItem key={h} value={String(h)} className="focus:bg-muted focus:text-foreground">
                      {toTime(h)}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Hours</Label>
              <Select value={String(hoursNum)} onValueChange={setHours}>
                <SelectTrigger className={fieldCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-card text-foreground/85">
                  {Array.from({
                  length: maxHours
                }, (_, i) => i + 1).map(n => <SelectItem key={n} value={String(n)} className="focus:bg-muted focus:text-foreground">
                      {n} {n === 1 ? "hour" : "hours"}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="bk-name" className="text-xs font-semibold text-muted-foreground">
                Your name
              </Label>
              <Input id="bk-name" readOnly value={session?.user?.name ?? ""} placeholder="Sign in to book" className={`${fieldCls} cursor-not-allowed bg-muted text-muted-foreground`} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bk-email" className="text-xs font-semibold text-muted-foreground">
                Your email
              </Label>
              <Input id="bk-email" readOnly value={session?.user?.email ?? ""} placeholder="Sign in to book" className={`${fieldCls} cursor-not-allowed bg-muted text-muted-foreground`} />
            </div>
          </div>

          {}
          <dl className="space-y-2 border-t border-border pt-4 text-sm">
            <Row label={`$${studio.hourlyRate} x ${hoursNum} ${hoursNum === 1 ? "hour" : "hours"}`} value={`$${rentTotal}`} />
            <Row label="Security deposit (refundable)" value={`$${studio.securityDeposit}`} />
            <div className="flex justify-between pt-1 text-base font-bold text-heading">
              <dt>Total</dt>
              <dd>${total}</dd>
            </div>
          </dl>

          <Button onClick={handleConfirm} disabled={submitting} className="h-12 w-full rounded-xl bg-[#E64833] text-base font-semibold text-white hover:bg-[#E64833]/90">
            {submitting ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking…
              </> : "Confirm Booking"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">Saved to bookings with status Pending.</p>
        </div>
      </DialogContent>
    </Dialog>;
}
function Row({
  label,
  value
}) {
  return <div className="flex justify-between text-muted-foreground">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>;
}
