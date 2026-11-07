"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signUp, signIn } from "../lib/auth-client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { LoaderScreen } from "@/components/Skeletons";
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
        <main className="flex min-h-screen flex-col bg-white text-slate-800">
            <Navbar />
            <div className="flex-1">
                <Suspense fallback={<LoaderScreen />}>
                    <SignIn />
                </Suspense>
            </div>
            <Footer />
        </main>
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
        try {
            setLoading(true);
            setErrors({});

            const { data, error } = await signIn.email({
                email: ResData.email,
                password: ResData.password,
            });
            if (data) {
                toast.success("লগইন সফল হয়েছে। হোম পেজে নেওয়া হচ্ছে...");
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 3000);
            }
            if (error) {
                if (error.message === 'Invalid email or password') {
                    setErrors({ form: "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে। আবার চেষ্টা করুন।" });
                } else {
                    setErrors({ form: error.message || "লগইন করতে সমস্যা হচ্ছে।" });
                }
                toast.error("লগইন করতে সমস্যা হয়েছে।");
                return;
            }

        } catch (err) {
            setErrors({ form: "কিছু একটা সমস্যা হয়েছে । আবার চেষ্টা করুন।" });
            toast.error("কিছু একটা সমস্যা হয়েছে । আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------------------- google ---------------------------- */
    const handleGoogle = async () => {
        try {
            setGoogleLoading(true);
            setErrors({});

            const { data, error } = await signIn.social({
                provider: "google",
                callbackURL: "/",
            });
            if (data) {
                toast.success("গুগল লগইন সফল হয়েছে। হোম পেজে নেওয়া হচ্ছে...");
            }
            if (error) {
                setErrors({ form: error.message || "গুগল লগইন করতে সমস্যা হচ্ছে।" });
                toast.error(error.message || "গুগল লগইন করতে সমস্যা হচ্ছে।");
                setGoogleLoading(false); // Stop loading if it failed to redirect
                return;
            }

        } catch (err) {
            setErrors({ form: "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।" });
            toast.error("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setGoogleLoading(false);
        }
    };

    /* ------------------------ forgot password ------------------------ */
    const handleReset = async () => {
        toast.info("পাসওয়ার্ড রিসেট শীঘ্রই আসছে।");
    };

    return (
        <section className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6 sm:py-12">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex justify-center mb-4">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#244855]/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/brad-logo.png" alt="" className="h-9 w-9 object-contain" />
                    </span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#244855] text-center">Sign in</h1>

                    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                        {/* email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold text-[#E64833]">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="you@email.com"
                                disabled={busy}
                                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus-visible:ring-[#E64833]/60"
                            />
                        </div>

                        {/* password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-semibold text-[#E64833]">
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
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pr-11 text-slate-800 placeholder:text-slate-400 focus-visible:ring-[#E64833]/60"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        {errors?.form && (
                            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-red-600">
                                    {errors.form}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* remember + forgot */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    checked={remember}
                                    onCheckedChange={(v) => setRemember(v === true)}
                                    disabled={busy}
                                    className="border-slate-300 data-[state=checked]:border-[#E64833] data-[state=checked]:bg-[#E64833] data-[state=checked]:text-white"
                                />
                                <Label htmlFor="remember" className="cursor-pointer text-xs font-normal text-slate-600">
                                    Remember me
                                </Label>
                            </div>
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={busy || resetLoading}
                                className="text-xs font-semibold text-[#E64833] transition hover:text-[#cf3e2b] disabled:opacity-50"
                            >
                                {resetLoading ? "Sending…" : "Forgot password?"}
                            </button>
                        </div>

                        {/* submit */}
                        <Button
                            type="submit"
                            disabled={busy}
                            className="h-11 w-full rounded-xl bg-[#E64833] font-semibold text-white shadow-sm shadow-[#E64833]/25 hover:bg-[#cf3e2b]"
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
                        <Separator className="flex-1 bg-slate-100" />
                        <span className="text-xs text-slate-400">or</span>
                        <Separator className="flex-1 bg-slate-100" />
                    </div>

                    {/* google */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogle}
                        disabled={busy}
                        className="h-11 w-full rounded-xl border-slate-200 bg-white font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#244855]"
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

                    <p className="mt-6 text-sm text-slate-500">
                        New to StudioSpace?{" "}
                        <Link
                            href='/signup'
                            className="font-semibold text-[#E64833] transition hover:text-[#cf3e2b]"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
        </section>
    );
}