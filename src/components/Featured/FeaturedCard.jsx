import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedCard({ studio }) {
  const image = studio.imageURL ?? studio.imageUrl;

  return (
    <Link
      href={`/studios/${studio._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#E64833]/40 hover:shadow-xl hover:shadow-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E64833]/70"
    >
      {/* image area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {image && (
          <Image
            src={image}
            alt={studio.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-wider text-white drop-shadow">
          {studio.amenities?.[0] ?? studio.category}
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <span className="self-start rounded-full border border-[#E64833]/20 bg-[#E64833]/5 px-2.5 py-0.5 text-[11px] font-medium text-[#E64833]">
          {studio.category}
        </span>

        <h3 className="mt-3 text-base font-bold leading-snug text-heading transition duration-200 group-hover:text-[#E64833]">
          {studio.title}
        </h3>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {[studio.location, studio.maxCapacity && `${studio.maxCapacity} guests`]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <span className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-[#E64833] opacity-80 transition duration-200 group-hover:opacity-100">
          View details
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>

        <p className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-border text-sm">
          <span>
            <span className="font-extrabold text-heading text-base">${studio.hourlyRate}</span>
            <span className="text-muted-foreground text-xs"> / hour</span>
          </span>
          {studio.rating != null && (
            <span className="flex items-center gap-1 font-semibold text-[#E64833] text-xs">
              ★ {Number(studio.rating).toFixed(1)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
