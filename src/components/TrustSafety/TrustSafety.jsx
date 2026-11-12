import { ShieldCheck, UserCheck, Package, Headset } from "lucide-react";
const FEATURES = [{
  icon: ShieldCheck,
  title: "Liability protection",
  text: "Host and creator are protected for damage and accidents during every confirmed studio booking."
}, {
  icon: UserCheck,
  title: "Verified profiles",
  text: "All hosts and creators verify their identity before they can list spaces or make reservations."
}, {
  icon: Package,
  title: "Equipment safety",
  text: "High-value production gear listed with a studio is logged during check-in and check-out."
}, {
  icon: Headset,
  title: "24/7 creator support",
  text: "Dedicated human support available around the clock if questions or urgent issues arise on shoot day."
}];
export default function TrustSafety() {
  return <section className="relative bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-[#244855]/5 via-background to-background p-6 shadow-lg sm:p-8 lg:p-12">
          {}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E64833]/20 bg-[#E64833]/5 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#E64833]">
            Trust and Safety
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-heading sm:text-3xl lg:text-4xl">
            Host guarantee and creator support
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every booking is backed by comprehensive protections for the people who host and the artists who create.
          </p>

          {}
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({
            icon: Icon,
            title,
            text
          }) => <li key={title} className="group rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-[#E64833]/40 hover:shadow-lg hover:shadow-slate-900/10 dark:hover:shadow-black/30">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#E64833]/20 bg-[#E64833]/5 text-[#E64833] transition duration-300 group-hover:bg-[#E64833] group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-heading transition group-hover:text-[#E64833]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </li>)}
          </ul>
        </div>
      </div>
    </section>;
}
