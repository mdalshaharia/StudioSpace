import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const STATUS_STYLE = {
  Pending: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Confirmed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Completed: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  Cancelled: "border-border bg-muted text-muted-foreground"
};
const STATUS_NOTE = {
  Confirmed: "Awaiting session",
  Completed: "Done",
  Cancelled: "No action"
};
export const formatDate = d => {
  if (!d) return "—";
  const dateObj = new Date(d);
  return isNaN(dateObj.getTime()) ? "—" : dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};
const BookingsCard = ({
  bookings,
  onCancel,
  onConfirm,
  confirming
}) => {
  return <Table className="min-w-[720px] text-sm text-foreground/85">
            <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                    {["Studio", "Date", "Time", "Total", "Status", "Action"].map(h => <TableHead key={h} className="h-12 text-xs font-semibold text-muted-foreground">
                            {h}
                        </TableHead>)}
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookings.map(b => <TableRow key={b._id} className="border-border hover:bg-muted/50">
                        <TableCell>
                            <div className="flex items-center gap-3">
                                {b.studioImage ? <img src={b.studioImage} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover" /> : <span className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-muted to-muted" />}
                                <span className="font-bold text-heading">{b.studioTitle || "Studio"}</span>
                            </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(b.date || b.BookingDate)}</TableCell>
                        <TableCell className="whitespace-nowrap">
                            {b.startTime && b.endTime ? `${b.startTime} to ${b.endTime}` : b.startTime || "Standard slot"}
                        </TableCell>
                        <TableCell className="font-medium text-heading">${b.total ?? 0}</TableCell>
                        <TableCell>
                            <div className="flex flex-col items-start gap-0.5">
                                {b.status === "Pending" ? <Button variant="outline" disabled={confirming} onClick={() => onConfirm(b)} title="Click to confirm" aria-label="Confirm booking" className={`h-auto cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium transition hover:scale-105 ${STATUS_STYLE[b.status] ?? STATUS_STYLE.Cancelled} ${confirming ? "animate-pulse opacity-60" : ""}`}>
                                        {b.status}
                                    </Button> : <Badge variant="outline" className={`rounded-full text-[11px] font-medium ${STATUS_STYLE[b.status] ?? STATUS_STYLE.Cancelled}`}>
                                        {b.status}
                                    </Badge>}
                                {b.status === "Pending" && <span className="text-[10px] text-amber-600/80 dark:text-amber-400/70">click to confirm</span>}
                            </div>
                        </TableCell>
                        <TableCell>
                            {b.status === "Pending" ? <Button size="sm" variant="outline" onClick={() => onCancel(b)} className="border-red-500/20 bg-red-500/10 text-xs font-semibold text-red-600 hover:bg-red-500/20 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                                    Cancel Booking
                                </Button> : <span className="text-muted-foreground">{STATUS_NOTE[b.status] ?? "—"}</span>}
                        </TableCell>
                    </TableRow>)}
            </TableBody>
        </Table>;
};
export default BookingsCard;
