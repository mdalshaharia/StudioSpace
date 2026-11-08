
import Link from "next/link";
import Image from "next/image";
import { Users, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const VALUES = [
  {
    icon: Users,
    title: "Built for creators",
    text: "Photographers, filmmakers, musicians and podcasters need the right room. We make finding and booking it simple.",
  },
  {
    icon: ShieldCheck,
    title: "Trust on both sides",
    text: "Clear pricing, honest listings and a refundable deposit keep bookings fair for hosts and creators alike.",
  },
  {
    icon: Sparkles,
    title: "Spaces that inspire",
    text: "From cyc walls to recording suites, every space is run by someone who cares about the work made in it.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background text-heading">
      
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-12 text-center sm:px-6 sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#E64833]">About us</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          A better way to find the room for your next project
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-heading/75">
          StudioSpace is a peer-to-peer marketplace where creators book studios by the hour and
          hosts turn spare space into income.
        </p>
      </section>

    
      <section className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-12">
       
        <Image
          src="https://picsum.photos/seed/about-studio/800/600"
          alt="A creative studio space"
          width={800}
          height={600}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-2xl border border-[#244855]/10 object-cover shadow-sm"
        />
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Our story</h2>
          <p className="mt-3 leading-relaxed text-heading/75">
            Great work needs the right space, but finding one used to mean endless calls, vague
            prices and waiting for replies. We built StudioSpace to change that.
          </p>
          <p className="mt-3 leading-relaxed text-heading/75">
            Today creators can see live availability, know the full price upfront and book in
            minutes, while hosts get a simple way to list, manage and earn from their space.
          </p>
        </div>
      </section>

     
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-3xl">
          What we believe in
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Card className="h-full border-[#244855]/15 bg-[#244855]/[0.04] dark:border-white/10 dark:bg-white/[0.04] py-0 text-heading shadow-none">
                <CardContent className="p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#E64833]/10 text-[#E64833]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-heading/75">{text}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      
      <section className="mt-6 bg-[#244855] px-4 py-14 text-center text-white sm:py-16">
        <h2 className="text-3xl font-extrabold tracking-tight">Join the community</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/75">
          Book a studio for your next shoot, or share your own space with creators.
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