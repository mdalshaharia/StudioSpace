
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export const metadata = { title: "Page not found | StudioSpace" };

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-card px-4 py-16 text-heading">
      <section className="flex max-w-md flex-col items-center text-center">
        <span className="grid h-24 w-24 place-items-center rounded-full bg-[#E64833]/10">
          <SearchX className="h-12 w-12 text-[#E64833]" strokeWidth={1.5} aria-hidden />
        </span>

        <p className="mt-6 text-7xl font-extrabold tracking-tight text-[#E64833] sm:text-8xl">404</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-heading/75">
          The page you are looking for does not exist or may have been moved.
        </p>

        {/* text link with icon (not a button) */}
        <Link
          href="/"
          className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#E64833] transition-colors hover:text-[#c93a28] focus-visible:underline focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
          <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1.5px]">
            Return home
          </span>
        </Link>
      </section>
    </main>
  );
}