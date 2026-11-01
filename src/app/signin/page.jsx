"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
// import {
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   sendPasswordResetEmail,
//   setPersistence,
//   browserLocalPersistence,
//   browserSessionPersistence,
// } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
// import { auth, googleProvider } from "@/lib/firebase";

/* ------------------------------ helpers ------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AUTH_ERRORS = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "No account found with that email.",
  "auth/invalid-email": "That email address looks invalid.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  "auth/cancelled-popup-request": "Google sign-in was cancelled.",
  "auth/popup-blocked": "Popup blocked. Allow popups and try again.",
};

const friendlyError = (err) =>
  AUTH_ERRORS[err?.code] ?? "Something went wrong. Please try again.";

// only allow same-site relative redirects (prevents open-redirect)
const safeRedirect = (path) =>
  path && path.startsWith("/") && !path.startsWith("//") ? path : "/dashboard";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}

/* ------------------------------- page -------------------------------- */

export default function LoginPage() {
  // useSearchParams needs a Suspense boundary in the App Router
  return (
    <Suspense fallback={null}>
      <SignIn />
    </Suspense>
  );
}

function SignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = safeRedirect(params.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const busy = loading || googleLoading;

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const finish = (name) => {
    toast.success(name ? `Welcome back, ${name.split(" ")[0]}!` : "Signed in successfully.");
    router.replace(redirectTo);
    router.refresh();
  };

  /* ---------------------- email + password ---------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Signing in…");
  };

  /* ---------------------------- google ---------------------------- */
  const handleGoogle = async () => {
    setGoogleLoading(true);
    toast.success("Signing in…");
  };

  /* ------------------------ forgot password ------------------------ */
  const handleReset = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setErrors((p) => ({ ...p, email: "Enter your email first." }));
      toast.error("Enter your email above, then click “Forgot password?”.");
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      toast.success("Password reset email sent. Check your inbox.");
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-12">
        {/* ---------------- left: visual panel (desktop only) ---------------- */}
        <aside className="relative hidden min-h-[520px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#2b2620] to-[#54402a] lg:block">
          {/* swap for <Image src=... fill className="object-cover" /> when you have a photo */}
          <div className="absolute inset-x-0 bottom-0 p-8">
            <h2 className="text-3xl font-extrabold tracking-tight">Your next shoot starts here.</h2>
            <p className="mt-2 text-sm text-neutral-200">
              Book creative studios by the hour or list your own.
            </p>
          </div>
        </aside>

        {/* ---------------------- right: form card ---------------------- */}
        <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Sign in</h1>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {/* email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-amber-400/90">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                disabled={busy}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="h-11 rounded-xl border-white/10 bg-neutral-950 text-white placeholder:text-neutral-500 focus-visible:ring-amber-400/60"
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-amber-400/90">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  disabled={busy}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="h-11 rounded-xl border-white/10 bg-neutral-950 pr-11 text-white placeholder:text-neutral-500 focus-visible:ring-amber-400/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* remember + forgot */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(v === true)}
                  disabled={busy}
                  className="border-white/30 data-[state=checked]:border-amber-400 data-[state=checked]:bg-amber-400 data-[state=checked]:text-neutral-900"
                />
                <Label htmlFor="remember" className="cursor-pointer text-xs font-normal text-neutral-200">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                onClick={handleReset}
                disabled={busy || resetLoading}
                className="text-xs text-amber-400 transition hover:text-amber-300 disabled:opacity-50"
              >
                {resetLoading ? "Sending…" : "Forgot password?"}
              </button>
            </div>

            {/* submit */}
            <Button
              type="submit"
              disabled={busy}
              className="h-11 w-full rounded-xl bg-amber-400 font-semibold text-neutral-900 hover:bg-amber-300"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* divider */}
          <div className="my-5 flex items-center gap-3">
            <Separator className="flex-1 bg-white/10" />
            <span className="text-xs text-neutral-400">or</span>
            <Separator className="flex-1 bg-white/10" />
          </div>

          {/* google */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={busy}
            className="h-11 w-full rounded-xl border-white/15 bg-neutral-900 font-semibold text-white hover:bg-white/5 hover:text-white"
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span className="mr-2">
                <GoogleIcon />
              </span>
            )}
            Continue with Google
          </Button>

          <p className="mt-6 text-sm text-neutral-400">
            New to StudioSpace?{" "}
            <Link
              href={`/register${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
              className="font-semibold text-amber-400 transition hover:text-amber-300"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}