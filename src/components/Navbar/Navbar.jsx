"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ---------------------------- route config ---------------------------- */
const NAV_LINKS = [
  { label: "Explore", href: "/explore" },
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

function Logo({ onClick, className = "text-neutral-900" }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2.5" aria-label="StudioSpace home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-400 text-base font-black text-neutral-900">
        N
      </span>
      <span className={`text-lg font-bold tracking-widest ${className}`}>StudioSpace</span>
    </Link>
  );
}


export default function Navbar({ user = null, onLogout }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <nav className="navbar mx-auto min-h-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------- left: hamburger (mobile) + logo ---------- */}
        <div className="navbar-start gap-1">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  className="btn btn-ghost btn-square text-neutral-900 lg:hidden"
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
                            className={`uppercase tracking-wide text-xs ${
                              active
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
                      onClick={() => {
                        setOpen(false);
                        onLogout?.();
                      }}
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
                          href="/login"
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
                          href="/register"
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
                    className={`relative px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                      active ? "text-amber-600" : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    {label}
                    {/* active route indicator */}
                    <span
                      className={`absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-amber-500 transition-opacity ${
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    className="flex items-center gap-2 rounded-full p-1 pr-2 outline-none ring-amber-400/60 transition hover:bg-black/5 focus-visible:ring-2"
                    aria-label="Open user menu"
                  />
                }
              >
                <UserAvatar user={user} />
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-neutral-900 md:block">
                  {user.name}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-neutral-500 md:block" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-60 border-white/10 bg-neutral-900 text-neutral-200"
              >
                <DropdownMenuLabel className="truncate text-white">{user.name}</DropdownMenuLabel>
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
                  onSelect={() => onLogout?.()}
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
                className="btn btn-ghost hidden text-neutral-700 hover:bg-black/5 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="btn hidden rounded-full border-none bg-amber-400 px-5 text-neutral-900 hover:bg-amber-300 sm:inline-flex"
              >
                Get started
              </Link>
              {/* very small screens: single compact CTA (full options live in the drawer) */}
              <Link
                href="/login"
                className="btn btn-sm rounded-full border-none bg-amber-400 text-neutral-900 hover:bg-amber-300 sm:hidden"
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
      <AvatarImage src={user.photoURL} alt={user.name} />
      <AvatarFallback className="bg-amber-400 font-semibold text-neutral-900">
        {initials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}
