
import Link from "next/link";
import { Search, CalendarClock, CreditCard, Camera, PlusSquare, Tag, CheckCircle2, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ------------------------------ content ------------------------------ */

const FLOWS = {
  creators: [
    {
      icon: Search,
      title: "Discover spaces",
      text: "Browse studios by type, area and price. Every listing shows photos, amenities, reviews and a live week view of what is free.",
      image: "https://picsum.photos/seed/discover/800/500",
    },
    {
      icon: CalendarClock,
      title: "Pick your time",
      text: "Choose a date, a start time and how many hours you need. The price updates as you go, so there are no surprises.",
      image: "https://picsum.photos/seed/pick-time/800/500",
    },
    {
      icon: CreditCard,
      title: "Book instantly",
      text: "Confirm your booking. You pay the hourly total plus a refundable security deposit. Your booking starts as Pending until the host confirms.",
      image: "https://picsum.photos/seed/book-now/800/500",
    },
    {
      icon: Camera,
      title: "Show up and create",
      text: "Arrive, set up and make your work in a space built for it. Track every booking any time in My Bookings.",
      image: "https://picsum.photos/seed/create/800/500",
    },
  ],
  hosts: [
    {
      icon: PlusSquare,
      title: "List your space",
      text: "Add photos, a clear overview, your amenities and the capacity. Good photos and honest details get the most bookings.",
      image: "https://picsum.photos/seed/list-space/800/500",
    },
    {
      icon: Tag,
      title: "Set your price",
      text: "Choose your hourly rate and a refundable security deposit. You can update details or remove a listing whenever you like.",
      image: "https://picsum.photos/seed/set-price/800/500",
    },
    {
      icon: CheckCircle2,
      title: "Confirm bookings",
      text: "New requests arrive as Pending. Review each one and confirm the sessions that suit you.",
      image: "https://picsum.photos/seed/confirm/800/500",
    },
    {
      icon: Wallet,
      title: "Host and earn",
      text: "Welcome your guests, let them create, and earn from the hours your space would otherwise sit empty.",
      image: "https://picsum.photos/seed/host-earn/800/500",
    },
  ],
};

const FAQ = [
  {
    q: "Do I need an account to book?",
    a: "Yes. Create a free account or sign in so we can save your bookings and show them in My Bookings.",
  },
  {
    q: "Can I cancel a booking?",
    a: "You can cancel any booking that is still Pending. Once a host confirms a booking it can no longer be cancelled from your account.",
  },
  {
    q: "What is the security deposit?",
    a: "A refundable amount set by the host, added to your total at booking. It covers accidental damage and is returned when the session ends without issues.",
  },
  {
    q: "How do I know a time slot is free?",
    a: "Each listing shows live availability. Open slots can be selected; booked ones are unavailable.",
  },
];

/* ------------------------------- page -------------------------------- */

export default function HowItWorksPage() {
  return (
    <main className="bg-background text-heading">
      {/* intro */}
      <section className="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:px-6 sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#E64833]">
          How it works
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          From search to shoot day in four steps
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-heading/75">
          StudioSpace connects creators with people who run great spaces. Here is how booking and
          hosting work.
        </p>
      </section>

      {/* steps */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <Tabs defaultValue="creators" className="w-full">
          <TabsList className="mx-auto mb-10 grid h-11 w-full max-w-xs grid-cols-2 rounded-full bg-[#244855]/10 p-1">
            <TabsTrigger
              value="creators"
              className="rounded-full text-sm font-semibold text-heading data-[state=active]:bg-[#244855] data-[state=active]:text-white"
            >
              For creators
            </TabsTrigger>
            <TabsTrigger
              value="hosts"
              className="rounded-full text-sm font-semibold text-heading data-[state=active]:bg-[#244855] data-[state=active]:text-white"
            >
              For hosts
            </TabsTrigger>
          </TabsList>

          {Object.entries(FLOWS).map(([key, steps]) => (
            <TabsContent key={key} value={key} className="space-y-12 sm:space-y-16">
              {steps.map((step, i) => (
                <article
                  key={step.title}
                  className="grid items-center gap-6 md:grid-cols-2 md:gap-12"
                >
                  {/* image (alternates side on desktop) */}
                  <div className={i % 2 === 1 ? "md:order-2" : ""}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.image}
                      alt=""
                      loading="lazy"
                      className="aspect-[16/10] w-full rounded-2xl border border-[#244855]/10 object-cover shadow-sm"
                    />
                  </div>

                  {/* text */}
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E64833] text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <step.icon className="h-5 w-5 text-[#E64833]" aria-hidden />
                    </div>
                    <h2 className="mt-4 text-2xl font-extrabold tracking-tight">{step.title}</h2>
                    <p className="mt-2 leading-relaxed text-heading/75">{step.text}</p>
                  </div>
                </article>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* faq */}
      <section className="bg-[#244855]/[0.04] py-14 sm:py-16 dark:bg-white/[0.03]">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">Common questions</h2>
          <Accordion type="single" collapsible className="mt-8 w-full">
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="border-[#244855]/15">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-heading/75">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* cta */}
      <section className="bg-[#244855] px-4 py-14 text-center text-white sm:py-16">
        <h2 className="text-3xl font-extrabold tracking-tight">Ready to get started?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/75">
          Find a space for your next project, or list your own and start hosting.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="h-11 rounded-xl bg-[#E64833] px-6 font-semibold text-white hover:bg-[#E64833]/90"
          >
            <Link href="/studios">Explore studios</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-white/40 bg-transparent px-6 font-semibold text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/list-your-space">List your space</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}