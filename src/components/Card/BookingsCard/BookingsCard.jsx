import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_STYLE = {
  Pending: "border-amber-500/30 bg-amber-500/10 text-amber-600",
  Confirmed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
  Completed: "border-sky-500/30 bg-sky-500/10 text-sky-600",
  Cancelled: "border-slate-200 bg-slate-100 text-slate-500",
};

const STATUS_NOTE = {
  Confirmed: "Awaiting session",
  Completed: "Done",
  Cancelled: "No action",
};

export const formatDate = (d) => {
  if (!d) return "—";
  const dateObj = new Date(d);
  return isNaN(dateObj.getTime())
    ? "—"
    : dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const BookingsCard = ({ bookings, onCancel, onConfirm, confirming }) => {
    return (
        <Table className="min-w-[720px] text-sm text-slate-700">
            <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                    {["Studio", "Date", "Time", "Total", "Status", "Action"].map((h) => (
                        <TableHead key={h} className="h-12 text-xs font-semibold text-slate-500">
                            {h}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookings.map((b) => (
                    <TableRow key={b._id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell>
                            <div className="flex items-center gap-3">
                                {b.studioImage || b.productImage ? (
                                    // plain <img> so any image host works without next.config changes
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={b.studioImage || b.productImage}
                                        alt=""
                                        loading="lazy"
                                        className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover"
                                    />
                                ) : (
                                    <span className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200" />
                                )}
                                <span className="font-bold text-[#244855]">{b.studioTitle || b.productName || "Studio"}</span>
                            </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(b.date || b.BookingDate)}</TableCell>
                        <TableCell className="whitespace-nowrap">
                            {b.startTime && b.endTime ? `${b.startTime} to ${b.endTime}` : (b.startTime || "Standard slot")}
                        </TableCell>
                        <TableCell className="font-medium text-[#244855]">${b.total ?? 0}</TableCell>
                        <TableCell>
                            <div className="flex flex-col items-start gap-0.5">
                                {b.status === "Pending" ? (
                                    <Button
                                        variant="outline"
                                        disabled={confirming}
                                        onClick={() => onConfirm(b._id)}
                                        title="Click to confirm"
                                        aria-label="Confirm booking"
                                        className={`h-auto cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium transition hover:scale-105 ${
                                            STATUS_STYLE[b.status] ?? STATUS_STYLE.Cancelled
                                        } ${confirming ? "animate-pulse opacity-60" : ""}`}
                                    >
                                        {b.status}
                                    </Button>
                                ) : (
                                    <Badge
                                        variant="outline"
                                        className={`rounded-full text-[11px] font-medium ${
                                            STATUS_STYLE[b.status] ?? STATUS_STYLE.Cancelled
                                        }`}
                                    >
                                        {b.status}
                                    </Badge>
                                )}
                                {b.status === "Pending" && (
                                    <span className="text-[10px] text-amber-600/80">click to confirm</span>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            {b.status === "Pending" ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onCancel(b)}
                                    className="border-red-500/20 bg-red-500/10 text-xs font-semibold text-red-600 hover:bg-red-500/20 hover:text-red-700"
                                >
                                    Cancel Booking
                                </Button>
                            ) : (
                                <span className="text-slate-400">{STATUS_NOTE[b.status] ?? "—"}</span>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default BookingsCard;
