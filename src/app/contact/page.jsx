import { Mail, MapPin, MessagesSquare } from "lucide-react";
export const metadata = {
  title: "Contact | StudioSpace"
};
const CARDS = [{
  icon: Mail,
  title: "Email us",
  text: "hello@studiospace.app"
}, {
  icon: MessagesSquare,
  title: "Chat",
  text: "Reply time within one business day."
}, {
  icon: MapPin,
  title: "Studio city",
  text: "We're remote-first, supporting hosts worldwide."
}];
export default function ContactPage() {
  return <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#E64833]">
          Contact
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          We&apos;d love to hear from you
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Questions about booking, hosting, billing or anything else. Reach out
          through any channel below. Hosts, bring your space; creators,{" "}
          bring your craft.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {CARDS.map(({
          icon: Icon,
          title,
          text
        }) => <li key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E64833]/10 text-[#E64833]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-sm font-bold text-heading">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </li>)}
        </ul>

        <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          Hosts: if you need to handle your listing, sign in and open{" "}
          <span className="font-semibold text-heading">My Listings</span> from
          the account menu.
        </p>
      </section>
    </main>;
}
