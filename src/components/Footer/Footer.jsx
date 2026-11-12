"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/theme/theme-toggle";
import Image from "next/image";
const copyrightsSubscribe = () => () => {};
function CopyrightYear() {
  const year = useSyncExternalStore(copyrightsSubscribe, () => new Date().getFullYear(), () => "");
  return <p>
      © {year} StudioSpace. All rights reserved.
    </p>;
}
const QUICK_LINKS = [{
  label: "Home",
  href: "/"
}, {
  label: "Explore studios",
  href: "/studios"
}, {
  label: "How it works",
  href: "/how-it-works"
}, {
  label: "List your space",
  href: "/add-studio"
}, {
  label: "About",
  href: "/about"
}, {
  label: "Contact",
  href: "/contact"
}];
const CATEGORIES = [{
  label: "Photo studios",
  href: "/studios?cat=photo"
}, {
  label: "Film stages",
  href: "/studios?cat=film"
}, {
  label: "Music suites",
  href: "/studios?cat=music"
}, {
  label: "Podcast lounges",
  href: "/studios?cat=podcast"
}, {
  label: "Art workshops",
  href: "/studios?cat=workshop"
}];
const SOCIALS = [{
  label: "X",
  href: "https://x.com",
  icon: FaXTwitter
}, {
  label: "Instagram",
  href: "https://instagram.com",
  icon: FaInstagram
}, {
  label: "Facebook",
  href: "https://facebook.com",
  icon: FaFacebookF
}, {
  label: "LinkedIn",
  href: "https://linkedin.com",
  icon: FaLinkedinIn
}];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default function Footer() {
  const [email, setEmail] = useState("");
  const subscribe = e => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thanks for subscribing!");
    setEmail("");
  };
  return <footer className="bg-[#244855] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {}
          <div className="lg:col-span-4">
            <Link href="/" className="group flex items-center gap-2.5" aria-label="StudioSpace home">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition-transform duration-200 group-hover:scale-105">
                <Image src="/brad-logo.png" height={22} width={22} alt="StudioSpace Logo" className="object-contain invert" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Studio<span className="text-[#E64833]">Space</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
              Our mission is to put every creator in the right room. We connect people who make
              things with the spaces built for it, with live availability and clear pricing.
            </p>

            <ul className="mt-5 flex items-center gap-3">
              {SOCIALS.map(({
              label,
              href,
              icon: Icon
            }) => <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-[#E64833] hover:bg-[#E64833] hover:text-white">
                    <Icon className="h-4 w-4" />
                  </a>
                </li>)}
            </ul>
          </div>

          {}
          <nav aria-label="Quick links" className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Quick links</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {QUICK_LINKS.map(({
              label,
              href
            }) => <li key={label}>
                  <Link href={href} className="text-white/75 transition hover:text-[#E64833]">
                    {label}
                  </Link>
                </li>)}
            </ul>
          </nav>

          {}
          <nav aria-label="Popular categories" className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Popular studios</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.map(({
              label,
              href
            }) => <li key={label}>
                  <Link href={href} className="text-white/75 transition hover:text-[#E64833]">
                    {label}
                  </Link>
                </li>)}
            </ul>
          </nav>

          {}
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Newsletter</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              New studios and creator tips, once a month. No spam.
            </p>
            <form onSubmit={subscribe} noValidate className="mt-4 flex gap-2">
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Email address" className="h-11 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-[#E64833]/60" />
              <Button type="submit" className="h-11 shrink-0 rounded-xl bg-[#E64833] px-4 font-semibold text-white hover:bg-[#E64833]/90">
                <Send className="mr-1.5 h-4 w-4" aria-hidden />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CopyrightYear />
          </div>
          <div className="flex items-center gap-3">
            <p>
              By using this site you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-white">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-white">
                Privacy Policy
              </Link>
              .
            </p>
            <ThemeToggle className="border-white/20 bg-white/10 text-white/90 hover:border-[#E64833] hover:text-white dark:border-white/20 dark:bg-white/10 dark:text-white/90" />
          </div>
        </div>
      </div>
    </footer>;
}
