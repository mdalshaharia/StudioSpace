"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const STUDIO_TYPES = [
  { value: "any", label: "Any studio type" },
  { value: "photo-cyc-wall", label: "Photo cyc wall" },
  { value: "sound-stage", label: "Sound stage" },
  { value: "podcast-lounge", label: "Podcast lounge" },
  { value: "recording-suite", label: "Recording suite" },
];

const TIME_SLOTS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

export default function Hero() {
  const router = useRouter();
  const [where, setWhere] = useState("");
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [type, setType] = useState("any");
  const [calOpen, setCalOpen] = useState(false);
  const [today, setToday] = useState();

  useEffect(() => {
    setToday(new Date());
  }, []);

  const whenLabel = date
    ? `${format(date, "MMM d")}${time ? `, ${time}` : ""}`
    : "Add date and time";

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (where.trim()) params.set("where", where.trim());
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    if (time) params.set("time", time);
    if (type !== "any") params.set("type", type);
    router.push(`/explore-studio?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* soft ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-amber-500/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/2 h-[360px] w-[360px] rounded-full bg-amber-600/5 blur-[110px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
        {/* ------------------------- left: copy & search ------------------------- */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Peer-to-peer creative spaces
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find the room where your next project happens.
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-neutral-300 sm:text-base">
            Book photo cyc walls, sound stages, podcast lounges, and recording suites from
            creators who run them. Live availability, transparent pricing.
          </p>

          {/* ---------------- search card ---------------- */}
          <form
            onSubmit={handleSearch}
            className="mt-8 w-full max-w-xl rounded-2xl border border-white/10 bg-neutral-900/90 p-5 shadow-2xl backdrop-blur-md"
          >
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-3">
              {/* Where */}
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
                  Where
                </span>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
                  <input
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    placeholder="City or area"
                    className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-neutral-500"
                  />
                </div>
              </label>

              {/* When */}
              <div>
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
                  When
                </span>
                <Popover open={calOpen} onOpenChange={setCalOpen}>
                  <PopoverTrigger
                    render={
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 text-left text-sm font-medium text-white outline-none"
                      />
                    }
                  >
                    <CalendarDays className="h-4 w-4 shrink-0 text-neutral-400" />
                    <span className={date ? "text-white" : "text-neutral-400"}>{whenLabel}</span>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-auto border-white/10 bg-neutral-900 p-3 text-white shadow-2xl"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={today ? { before: today } : undefined}
                    />
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setTime(t);
                            if (date) setCalOpen(false);
                          }}
                          className={`rounded-full px-3 py-1 text-xs transition ${
                            time === t
                              ? "bg-amber-400 font-bold text-neutral-950"
                              : "bg-white/5 text-neutral-300 hover:bg-white/10"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Studio type */}
              <div>
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
                  Studio type
                </span>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-auto border-0 bg-transparent p-0 text-sm font-medium text-white shadow-none focus:ring-0 [&>svg]:text-neutral-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-neutral-900 text-neutral-200">
                    {STUDIO_TYPES.map((t) => (
                      <SelectItem
                        key={t.value}
                        value={t.value}
                        className="focus:bg-white/10 focus:text-white"
                      >
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <button
              type="submit"
              className="btn mt-5 w-full gap-2 rounded-xl border-none bg-amber-400 px-8 font-bold text-neutral-950 transition hover:bg-amber-300 shadow-md sm:w-auto"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>
        </div>

        {/* ------------------------- right: stacked photo cards ------------------------- */}
        <div className="relative mx-auto h-[300px] w-full max-w-md sm:h-[380px] sm:max-w-lg lg:h-[440px] lg:max-w-none">
          {/* card 1 – cyc wall (back, top-left) */}
          <PhotoCard
            label="PHOTO: CYC WALL"
            className="left-0 top-0 h-[62%] w-[72%] bg-gradient-to-br from-[#4a3a26] to-[#2c2318]"
          />
          {/* card 2 – lounge (right) */}
          <PhotoCard
            label="PHOTO: LOUNGE"
            className="right-0 top-[11%] h-[58%] w-[52%] bg-gradient-to-br from-[#26333c] to-[#1a232a]"
            labelClassName="bottom-3 right-4 text-right"
          />
          {/* card 3 – recording suite (front, bottom-left) */}
          <PhotoCard
            label="PHOTO: RECORDING SUITE"
            className="bottom-[4%] left-[12%] h-[56%] w-[62%] bg-gradient-to-br from-[#3a2c45] to-[#241b2c]"
          />

          {/* floating availability chip */}
          <div className="absolute bottom-[8%] right-0 rounded-xl border border-white/10 bg-neutral-900/95 px-4 py-3 shadow-2xl backdrop-blur-sm sm:right-2">
            <p className="text-[11px] font-medium text-neutral-400">Open today</p>
            <p className="text-sm font-bold text-white">3 slots from $45/hr</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoCard({ label, className = "", labelClassName = "bottom-3 left-4" }) {
  return (
    <div
      className={`absolute overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition duration-300 hover:scale-[1.02] ${className}`}
    >
      <span
        className={`absolute text-[10px] font-semibold tracking-wider text-neutral-300/90 ${labelClassName}`}
      >
        {label}
      </span>
    </div>
  );
}
