import Link from "next/link";
import Image from "next/image";

export default function FeaturedCard({ studio }) {
  const image = studio.imageURL ?? studio.imageUrl;

  return (
    <Link
      href={`/studios/${studio._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/90 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
    >
      {/* image area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-800">
        {image && (
          <Image
            src={image}
            alt={studio.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-wider text-amber-300 drop-shadow">
          {studio.amenities?.[0] ?? studio.category}
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <span className="self-start rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
          {studio.category}
        </span>

        <h3 className="mt-3 text-base font-bold leading-snug text-white transition duration-200 group-hover:text-amber-300">
          {studio.title}
        </h3>
        <p className="mt-1.5 text-xs text-neutral-400">
          {[studio.location, studio.maxCapacity && `${studio.maxCapacity} guests`]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <p className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-white/5 text-sm">
          <span>
            <span className="font-extrabold text-white text-base">${studio.hourlyRate}</span>
            <span className="text-neutral-400 text-xs"> / hour</span>
          </span>
          {studio.rating != null && (
            <span className="flex items-center gap-1 font-semibold text-amber-400 text-xs">
              ★ {Number(studio.rating).toFixed(1)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
