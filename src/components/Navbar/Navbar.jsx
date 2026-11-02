"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient, signOut, useSession } from "@/app/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  PlusSquare,
  Building2,
  CalendarCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

/* ---------------------------- route config ---------------------------- */
const NAV_LINKS = [
  { label: "Explore", href: "/explore-studio" },
  { label: "How it works", href: "/how-it-works" },
  { label: "List your space", href: "/list-your-space" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const USER_MENU = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Add New Studio", href: "/dashboard/studios/new", icon: PlusSquare },
  { label: "My Studio Listings", href: "/dashboard/studios", icon: Building2 },
  { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
];

/* ------------------------------ helpers ------------------------------- */

const isActive = (pathname, href) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "U";

function Logo({ onClick }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2.5" aria-label="StudioSpace home">
      <span className="grid h-8 w-8 place-items-center rounded-lg text-base font-black">
        <Image src='/brad-logo.png' height={24} width={24} alt="StudioSpace Logo" />
      </span>
      <span className="text-lg font-bold tracking-widest text-white">StudioSpace</span>
    </Link>
  );
}


export default function Navbar() {
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-neutral-950/60">
      <nav className="navbar mx-auto min-h-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------- left: hamburger (mobile) + logo ---------- */}
        <div className="navbar-start gap-1">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  className="btn btn-ghost btn-square text-neutral-200 hover:text-white hover:bg-white/10 lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[85%] max-w-xs border-white/10 bg-neutral-950 p-0 text-white"
            >
              <SheetHeader className="border-b border-white/10 p-4 text-left">
                <SheetTitle render={<div />}>
                  <Logo onClick={() => setOpen(false)} className="text-white" />
                </SheetTitle>
              </SheetHeader>

              <ul className="menu w-full gap-1 p-3 text-white">
                {NAV_LINKS.map(({ label, href }) => {
                  const active = isActive(pathname, href);
                  return (
                    <li key={href}>
                      <SheetClose
                        nativeButton={false}
                        render={
                          <Link
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={`uppercase tracking-wide text-xs ${active
                                ? "bg-amber-400/10 font-semibold text-amber-400"
                                : "text-neutral-300 hover:text-white"
                              }`}
                          />
                        }
                      >
                        {label}
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto border-t border-white/10 p-4">
                {user ? (
                  <div className="space-y-1">
                    <div className="mb-3 flex items-center gap-3">
                      <UserAvatar user={user} />
                      <p className="truncate font-medium">{user.name}</p>
                    </div>
                    {USER_MENU.map(({ label, href, icon: Icon }) => (
                      <SheetClose
                        key={href}
                        nativeButton={false}
                        render={
                          <Link
                            href={href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white"
                          />
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </SheetClose>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/signin"
                          className="btn btn-outline border-white/20 text-white"
                        />
                      }
                    >
                      Sign in
                    </SheetClose>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/signup"
                          className="btn rounded-full border-none bg-amber-400 text-neutral-900 hover:bg-amber-300"
                        />
                      }
                    >
                      Get started
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden sm:block lg:ml-0">
            <Logo />
          </div>
        </div>

        {/* ---------- center: logo on xs, links on desktop ---------- */}
        <div className="navbar-center">
          <div className="sm:hidden">
            <Logo />
          </div>
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`relative px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      active ? "text-amber-400 font-bold" : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    {label}
                    {/* active route indicator */}
                    <span
                      className={`absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-amber-400 transition-opacity ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------- right: auth area ---------- */}
        <div className="navbar-end gap-2">
          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-800" aria-hidden />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    className="flex items-center gap-2 rounded-full p-1 pr-2 outline-none ring-amber-400/60 transition hover:bg-white/5 focus-visible:ring-2"
                    aria-label="Open user menu"
                  />
                }
              >
                <UserAvatar user={user} />
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-neutral-200 md:block">
                  {user.name}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-neutral-400 md:block" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-60 border-white/10 bg-neutral-900 text-neutral-200"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="truncate text-white">
                    {user.name}
                    {user.email && (
                      <span className="block truncate text-xs font-normal text-neutral-400">
                        {user.email}
                      </span>
                    )}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/10" />
                {USER_MENU.map(({ label, href, icon: Icon }) => (
                  <DropdownMenuItem
                    key={href}
                    render={
                      <Link
                        href={href}
                        className={isActive(pathname, href) ? "text-amber-400" : undefined}
                      />
                    }
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/signin"
                className="btn btn-ghost hidden text-neutral-300 hover:text-white hover:bg-white/10 sm:inline-flex font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="btn hidden rounded-full border-none bg-amber-400 px-5 text-neutral-900 hover:bg-amber-300 sm:inline-flex font-semibold shadow-sm"
              >
                Get started
              </Link>
              {/* very small screens: single compact CTA (full options live in the drawer) */}
              <Link
                href="/signin"
                className="btn btn-sm rounded-full border-none bg-amber-400 text-neutral-900 hover:bg-amber-300 sm:hidden font-semibold"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function UserAvatar({ user }) {
  return (
    <Avatar className="h-9 w-9 ring-2 ring-amber-400/70">
      <AvatarImage src={user.image} alt={user.name} />
      <AvatarFallback className="font-semibold text-neutral-900">
        {initials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}
