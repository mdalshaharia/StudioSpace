"use client";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-card">
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
        {/* Left text */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E64833]/30 bg-[#E64833]/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#E64833]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E64833] animate-pulse" />
            Peer-to-peer creative spaces
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-heading sm:text-5xl lg:text-6xl">
            Find the room where your next project happens.
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Book photo cyc walls, sound stages, podcast lounges, and recording suites from
            creators who run them. Live availability, transparent pricing.
          </p>
        </div>

        {/* Right photo stack */}
        <div className="relative mx-auto h-[300px] w-full max-w-md sm:h-[380px] sm:max-w-lg lg:h-[440px] lg:max-w-none">
          <PhotoCard
            src="/hero-photo-1.jpg"
            label="PHOTO: CYC WALL"
            className="left-0 top-0 h-[62%] w-[72%]"
          />
          <PhotoCard
            src="/hero-photo-2.jpg"
            label="PHOTO: LOUNGE"
            className="right-0 top-[11%] h-[58%] w-[52%]"
            labelClassName="bottom-3 right-4 text-right"
          />
          <PhotoCard
            src="/hero-photo-3.webp"
            label="PHOTO: RECORDING SUITE"
            className="bottom-[4%] left-[12%] h-[56%] w-[62%]"
          />

          <div className="absolute bottom-[8%] right-0 rounded-xl border border-border bg-card/90 px-4 py-3 shadow-xl backdrop-blur-sm sm:right-2">
            <p className="text-[11px] font-medium text-muted-foreground">Open today</p>
            <p className="text-sm font-bold text-heading">
              3 slots from <span className="text-[#E64833]">$45/hr</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoCard({ src, label, className = "", labelClassName = "bottom-3 left-4" }) {
  return (
    <div
      className={`absolute overflow-hidden rounded-2xl border border-border shadow-xl transition duration-300 hover:scale-[1.02] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={label || "Studio photo"}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span
        className={`absolute z-10 text-[10px] font-semibold tracking-wider text-white drop-shadow-md ${labelClassName}`}
      >
        {label}
      </span>
    </div>
  );
}
