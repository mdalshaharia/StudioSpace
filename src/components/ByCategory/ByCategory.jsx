
import Link from "next/link";
// import Image from "next/image";

const STUDIO_TYPES = [
  {
    slug: "photography-cyc-walls",
    label: "Photography cyc walls",
    gradient: "from-[#2a2118] to-[#16130f]",
  },
  {
    slug: "film-and-sound-stages",
    label: "Film and sound stages",
    gradient: "from-[#1b2a33] to-[#12181d]",
  },
  {
    slug: "music-recording-suites",
    label: "Music recording suites",
    gradient: "from-[#2d2236] to-[#1a141f]",
  },
  {
    slug: "podcast-lounges",
    label: "Podcast lounges",
    gradient: "from-[#1c2b21] to-[#121a15]",
  },
  {
    slug: "art-workshops",
    label: "Art workshops",
    gradient: "from-[#33231c] to-[#1d1511]",
  },
];

export default function ByCategory() {
  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Browse by studio type
          </h2>
          <Link
            href="/explore"
            className="shrink-0 text-sm font-medium text-amber-400 transition hover:text-amber-300"
          >
            See all
          </Link>
        </div>

        {/* cards */}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {STUDIO_TYPES.map(({ slug, label, gradient }, i) => (
            <li
              key={slug}
              // 5 items: let the last one span 2 cols on mobile so the grid has no gap
              className={i === STUDIO_TYPES.length - 1 ? "col-span-2 sm:col-span-1" : ""}
            >
              <Link
                href={`/explore?type=${slug}`}
                className={`group relative flex h-32 items-end overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br p-4 transition duration-300 hover:-translate-y-1 hover:border-amber-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 sm:h-36 lg:h-40 ${gradient}`}
              >
                {/* <Image src={image} alt="" fill className="object-cover opacity-60 transition group-hover:scale-105" /> */}
                <span className="relative text-[11px] font-bold uppercase leading-snug tracking-wider text-neutral-200 transition group-hover:text-white sm:text-xs">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}