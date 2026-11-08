import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | StudioSpace",
};

const SECTIONS = [
  {
    title: "1. What we collect",
    body: "We collect basic account details (name, email), authentication records issued by our sign-in system, and any studio details or images you publish. We do not store card numbers — payments are handled by our payment provider.",
  },
  {
    title: "2. How we use it",
    body: "Account data is used to authenticate you and secure your bookings. Listing content is published so other creators can discover and book your space. We don't sell personal data.",
  },
  {
    title: "3. Images",
    body: "Images you upload are stored on a public CDN through our image hosting partner. Anyone with the file URL can view an uploaded image, so avoid uploading photos with personal information you don't want public.",
  },
  {
    title: "4. Cookies",
    body: "We use required cookies to keep you signed in and remember your theme preference. We don't run advertising cookies.",
  },
  {
    title: "5. Data retention",
    body: "You can delete your account content (listings, bookings) at any time from your dashboard. Sign-out removes session cookies from your device.",
  },
  {
    title: "6. Contact",
    body: "For any privacy question or data request, email hello@studiospace.app and we'll get back within one business day.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#E64833]">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Privacy Policy
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
          For the rules around using the platform, read our{" "}
          <Link
            href="/terms"
            className="font-semibold text-[#E64833] hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
