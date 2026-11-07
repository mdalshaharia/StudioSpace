"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { authClient, signOut, useSession } from "@/app/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  CloudUpload,
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
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
];

const USER_MENU = [
  { label: "Upload Image", href: "/upload-image", icon: CloudUpload },
  { label: "Add New Studio", href: "/add-studio", icon: PlusSquare },
  { label: "My Studio Listings", href: "/my-listings", icon: Building2 },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarCheck },
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
    <Link href="/" onClick={onClick} className="group flex items-center gap-2.5" aria-label="StudioSpace home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#244855]/10 text-[#244855] transition-transform duration-200 group-hover:scale-105">
        <Image src="/brad-logo.png" height={22} width={22} alt="StudioSpace Logo" className="object-contain" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-[#244855]">
        Studio<span className="text-[#E64833]">Space</span>
      </span>
    </Link>
  );
}

function NavbarInner() {
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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-colors duration-200">
      <nav className="navbar mx-auto min-h-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------- left: hamburger (mobile) + logo ---------- */}
        <div className="navbar-start gap-1">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  className="btn btn-ghost btn-square text-slate-700 hover:bg-slate-100 hover:text-[#244855] lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[85%] max-w-xs border-r border-slate-200 bg-white p-0 text-slate-900 shadow-2xl"
            >
              <SheetHeader className="border-b border-slate-100 p-4 text-left">
                <SheetTitle render={<div />}>
                  <Logo onClick={() => setOpen(false)} />
                </SheetTitle>
              </SheetHeader>

              <ul className="menu w-full gap-1 p-3 text-slate-800">
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
                            className={`rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                              active
                                ? "bg-[#E64833]/10 font-bold text-[#E64833]"
                                : "text-slate-600 hover:bg-slate-100 hover:text-[#244855]"
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

              <div className="mt-auto border-t border-slate-100 bg-slate-50/60 p-4">
                {user ? (
                  <div className="space-y-1">
                    <div className="mb-3 flex items-center gap-3 px-1">
                      <UserAvatar user={user} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                        {user.email && (
                          <p className="truncate text-xs text-slate-500">{user.email}</p>
                        )}
                      </div>
                    </div>
                    {USER_MENU.map(({ label, href, icon: Icon }) => (
                      <SheetClose
                        key={href}
                        nativeButton={false}
                        render={
                          <Link
                            href={href}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                              isActive(pathname, href)
                                ? "bg-[#E64833]/10 font-semibold text-[#E64833]"
                                : "text-slate-700 hover:bg-slate-100 hover:text-[#244855]"
                            }`}
                          />
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </SheetClose>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
                          className="btn btn-outline rounded-xl border-slate-300 font-semibold text-slate-800 hover:border-slate-400 hover:bg-slate-100"
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
                          className="btn rounded-xl border-none bg-[#E64833] font-semibold text-white shadow-sm shadow-[#E64833]/25 hover:bg-[#cf3e2b]"
                        />
                      }
                    >
                      Register
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
                    className={`relative rounded-lg px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      active
                        ? "font-bold text-[#E64833]"
                        : "text-slate-600 hover:bg-slate-100/70 hover:text-[#244855]"
                    }`}
                  >
                    {label}
                    {/* active route indicator */}
                    <span
                      className={`absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-[#E64833] transition-opacity duration-200 ${
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
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" aria-hidden />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-2.5 shadow-2xs outline-none ring-[#244855]/30 transition hover:bg-slate-50 focus-visible:ring-2"
                    aria-label="Open user menu"
                  />
                }
              >
                <UserAvatar user={user} />
                <span className="hidden max-w-[120px] truncate text-sm font-semibold text-slate-800 md:block">
                  {user.name}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-60 rounded-2xl border border-slate-200 bg-white p-1.5 text-slate-700 shadow-xl"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="truncate px-3 py-2 text-slate-900">
                    <span className="font-semibold text-slate-900">{user.name}</span>
                    {user.email && (
                      <span className="block truncate text-xs font-normal text-slate-500">
                        {user.email}
                      </span>
                    )}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                {USER_MENU.map(({ label, href, icon: Icon }) => (
                  <DropdownMenuItem
                    key={href}
                    render={
                      <Link
                        href={href}
                        className={`cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          isActive(pathname, href)
                            ? "bg-[#E64833]/10 font-semibold text-[#E64833]"
                            : "text-slate-700 hover:bg-slate-100 hover:text-[#244855] focus:bg-slate-100 focus:text-[#244855]"
                        }`}
                      />
                    }
                  >
                    <Icon className="mr-2.5 h-4 w-4" />
                    {label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
                >
                  <LogOut className="mr-2.5 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/signin"
                className="btn btn-ghost hidden rounded-xl px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#244855] sm:inline-flex transition"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="btn hidden rounded-full border-none bg-[#E64833] px-5 text-sm font-semibold text-white shadow-sm shadow-[#E64833]/25 hover:bg-[#cf3e2b] hover:shadow-md hover:shadow-[#E64833]/35 sm:inline-flex transition-all"
              >
                Register
              </Link>
              {/* mobile compact CTA */}
              <Link
                href="/signin"
                className="btn btn-sm rounded-full border-none bg-[#E64833] text-xs font-semibold text-white shadow-2xs hover:bg-[#cf3e2b] sm:hidden"
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
    <Avatar className="h-9 w-9 border border-slate-200 ring-2 ring-[#E64833]/30 shadow-2xs">
      <AvatarImage src={user.image || "/default-avatar.png"} />
      <AvatarFallback className="bg-[#244855]/10 font-bold text-[#244855]">
        {initials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white shadow-xs">
          <div className="navbar mx-auto min-h-16 max-w-7xl px-4 sm:px-6 lg:px-8" />
        </header>
      }
    >
      <NavbarInner />
    </Suspense>
  );
}
