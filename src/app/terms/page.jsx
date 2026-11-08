import Link from "next/link";

export const metadata = {
  title: "Terms of Service | StudioSpace",
};

const SECTIONS = [
  {
    title: "1. Using StudioSpace",
    body: "StudioSpace is a marketplace-I style platform where independent hosts list creative studios and creators book them by the hour. You must be at least 18 years old to create an account or make a booking.",
  },
  {
    title: "2. Bookings and payments",
    body: "Prices shown on a listing include the hourly rate and any security deposit. When you confirm a booking, that slot is reserved for you and the agreed amount is charged. Cancellation windows and refund rules are shown at checkout before you pay.",
  },
  {
    title: "3. Host responsibilities",
    body: "Hosts are responsible for representing their space accurately, keeping availability current, and providing safe, well-maintained equipment listed on the space.",
  },
  {
    title: "4. Creator responsibilities",
    body: "Creators are responsible for respecting the space, the neighbourhood rules of the studio and the agreed time window. Damage beyond normal use may be deducted from the security deposit.",
  },
  {
    title: "5. Prohibited use",
    body: "You may not use StudioSpace for illegal activities, content requiring licenses you don't hold, or reselling bookings. Accounts breaking these rules may be suspended.",
  },
  {
    title: "6. Changes to these terms",
    body: "We may update these terms as the platform evolves. Major changes will be announced on this page before they take effect.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#E64833]">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: November 2026</p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-bold text-heading">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{s.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          Questions? See how we handle data in our{" "}
          <Link
            href="/privacy"
            className="font-semibold text-[#E64833] hover:underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
