const STEPS = [
  {
    title: "Discover Spaces",
    text: "Browse and filter verified studios by type, area, hourly price, and equipment amenities.",
  },
  {
    title: "Select Shoot Hours",
    text: "Check real-time calendar availability and select the exact window your project requires.",
  },
  {
    title: "Book Instantly",
    text: "Review full transparent pricing, confirm your session, and manage details in your dashboard.",
  },
  {
    title: "Create and Produce",
    text: "Arrive, set up gear, and bring your vision to life in a space fully prepared for creators.",
  },
];

export default function BookingWorks() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-amber-400">
            Simple From Start to Finish
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            How booking works
          </h2>
          <p className="mt-2 text-sm text-neutral-400 sm:text-base">
            Four simple steps from discovery to production day.
          </p>
        </div>

        {/* steps */}
        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="group relative rounded-2xl border border-white/10 bg-neutral-900/90 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-black/50"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-sm font-extrabold text-neutral-950 shadow-md shadow-amber-400/20">
                {i + 1}
              </span>
              <h3 className="mt-5 text-base font-bold text-white transition group-hover:text-amber-300">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
