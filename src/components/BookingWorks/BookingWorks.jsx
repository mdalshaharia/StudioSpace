

const STEPS = [
  {
    title: "Discover Spaces",
    text: "Browse and filter studios by type, area, price and amenities.",
  },
  {
    title: "Select Shoot Hours",
    text: "Check live availability and choose the hours you need.",
  },
  {
    title: "Book Instantly",
    text: "See the full price, confirm, and track the status in My Bookings.",
  },
  {
    title: "Create and Produce",
    text: "Arrive, set up and make your work in a space built for it.",
  },
];

export default function BookingWorks() {
  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* header */}
        <div className="text-center">
          <span className="badge badge-outline h-auto rounded-full border-white/20 px-3 py-1.5 text-[11px] font-normal text-neutral-200">
            Simple from start to finish
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
            How booking works
          </h2>
          <p className="mt-3 text-sm text-neutral-400">Four steps from search to shoot day.</p>
        </div>

        {/* steps */}
        <ol className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="group rounded-2xl border border-white/10 bg-neutral-900 p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-400/40"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-400 text-sm font-bold text-neutral-900">
                {i + 1}
              </span>
              <h3 className="mt-5 text-base font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}