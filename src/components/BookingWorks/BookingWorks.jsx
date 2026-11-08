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
    <section className="relative bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E64833]/20 bg-[#E64833]/5 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#E64833]">
            Simple From Start to Finish
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-heading sm:text-3xl lg:text-4xl">
            How booking works
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Four simple steps from discovery to production day.
          </p>
        </div>

        {/* steps */}
        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#E64833]/40 hover:shadow-xl hover:shadow-slate-200/80"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E64833] text-sm font-extrabold text-white shadow-md shadow-[#E64833]/20">
                {i + 1}
              </span>
              <h3 className="mt-5 text-base font-bold text-heading transition group-hover:text-[#E64833]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
