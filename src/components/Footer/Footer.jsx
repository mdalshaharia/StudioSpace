import Link from "next/link";

const LINKS = [
  { label: "Explore", href: "/explore-studio" },
  { label: "Hosts", href: "/list-your-space" },
  { label: "Help", href: "/contact" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 text-neutral-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center text-xs sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p className="flex items-center gap-2">
          <Link href="/" className="font-bold tracking-wider text-neutral-200 transition hover:text-amber-400">
            StudioSpace
          </Link>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>Peer-to-peer creative spaces</span>
        </p>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-3">
            {LINKS.map(({ label, href }, i) => (
              <li key={href} className="flex items-center gap-3">
                <Link href={href} className="text-neutral-400 transition hover:text-amber-400">
                  {label}
                </Link>
                {i < LINKS.length - 1 && (
                  <span aria-hidden="true" className="text-neutral-700">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
