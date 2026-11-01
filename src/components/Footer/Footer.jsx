
import Link from "next/link";

const LINKS = [
  { label: "Explore", href: "/explore" },
  { label: "Hosts", href: "/list-your-space" },
  { label: "Help", href: "/contact" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 text-neutral-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6 text-center text-xs sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
        <p>
          <Link href="/" className="transition hover:text-white">
            StudioSpace
          </Link>
          <span aria-hidden> · </span>
          Peer-to-peer creative workspace
        </p>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-2">
            {LINKS.map(({ label, href }, i) => (
              <li key={href} className="flex items-center gap-2">
                <Link href={href} className="transition hover:text-amber-400">
                  {label}
                </Link>
                {i < LINKS.length - 1 && (
                  <span aria-hidden className="text-amber-400/70">
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