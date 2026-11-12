"use client";

import Link from "next/link";
import { ArrowRight, HardHat, Loader2 } from "lucide-react";
import { useSession } from "../lib/auth-client";
export default function DashboardPage() {
  const {
    data: session,
    isPending
  } = useSession();
  if (isPending || !session) {
    return <main className="grid min-h-[70vh] place-items-center bg-card">
                <Loader2 className="h-6 w-6 animate-spin text-[#E64833]" aria-label="Loading" />
            </main>;
  }
  return <main className="grid min-h-[70vh] place-items-center bg-card px-4 py-16 text-heading">
            <section className="flex w-full max-w-lg flex-col items-center rounded-3xl border border-[#244855]/15 bg-[#244855]/[0.04] dark:border-white/10 dark:bg-white/[0.04] px-6 py-14 text-center sm:px-10">
                <span className="grid h-24 w-24 place-items-center rounded-full bg-[#E64833]/10">
                    <HardHat className="h-12 w-12 text-[#E64833] motion-safe:animate-pulse" strokeWidth={1.5} aria-hidden />
                </span>

                <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Under construction
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-heading/75">
                    Hi {session.user?.name?.split(" ")[0] ?? "there"}, your dashboard is on its way. In the
                    meantime you can manage your bookings and listings below.
                </p>
                <Link href='/' className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#E64833] transition-colors hover:text-[#c93a28] focus-visible:outline-none focus-visible:underline">
                    <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1.5px]">
                        Return Home
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </section>
        </main>;
}
