"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signUp, signIn } from "../lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
// import { auth, googleProvider } from "@/lib/firebase";

/* ------------------------------ helpers ------------------------------ */




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
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    const busy = loading || googleLoading;





    /* ---------------------- email + password ---------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const ResData = Object.fromEntries(formData.entries());
console.log('clicked')
        try {
            setLoading(true);
            setErrors('');

            const { data, error } = await signIn.email({
                email: ResData.email,
                password: ResData.password,
            });
            console.log(data)
            if (data) {
                toast.success("লগইন সফল হয়েছে। হোম পেজে নেওয়া হচ্ছে...");
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 3000);
            }
            if (error) {
                // console.log("Sign-in error:", error.message);
                if (error.message === 'Invalid email or password') {
                    setErrors("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে। আবার চেষ্টা করুন।");
                } else {
                    setErrors(error.message || "লগইন করতে সমস্যা হচ্ছে।");
                }
                return;
            }

        } catch (err) {
            console.error("Unexpected error:", err);
            setError("কিছু একটা সমস্যা হয়েছে । আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------------------- google ---------------------------- */
    const handleGoogle = async () => {
        setGoogleLoading(true);
        toast.success("Signing in…");
    };

    /* ------------------------ forgot password ------------------------ */
    const handleReset = async () => {
        cconsole.log('clicked')
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
                                name="email"
                                autoComplete="email"
                                placeholder="you@email.com"
                                disabled={busy}
                                className="h-11 rounded-xl border-white/10 bg-neutral-950 text-white placeholder:text-neutral-500 focus-visible:ring-amber-400/60"
                            />
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
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="Your password"
                                    disabled={busy}
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
                        </div>
                        { errors && <p className="mt-1.5 text-xs text-red-400">{errors.form}</p> }

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
                            href='/signup'
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