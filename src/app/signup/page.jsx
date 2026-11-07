"use client";


import { Suspense, useMemo, useState } from "react";
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


/* ------------------------------ helpers ------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AUTH_ERRORS = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "That email address looks invalid.",
    "auth/weak-password": "Password is too weak.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/popup-closed-by-user": "Google sign-up was cancelled.",
    "auth/cancelled-popup-request": "Google sign-up was cancelled.",
    "auth/popup-blocked": "Popup blocked. Allow popups and try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
};

const friendlyError = (err) =>
    AUTH_ERRORS[err?.code] ?? "Something went wrong. Please try again.";

const safeRedirect = (path) =>
    path && path.startsWith("/") && !path.startsWith("//") ? path : "/dashboard";

const isUrl = (v) => {
    try {
        const u = new URL(v);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

const passwordRules = (pw) => [
    { label: "At least 6 characters", ok: pw.length >= 6 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(pw) },
    { label: "One lowercase letter", ok: /[a-z]/.test(pw) },
];

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

const inputCls =
    "h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus-visible:ring-[#E64833]/60";

/* ------------------------------- page -------------------------------- */

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen flex-col bg-white text-slate-800">
            <Navbar />
            <div className="flex-1">
                <Suspense fallback={<LoaderScreen />}>
                    <Register />
                </Suspense>
            </div>
            <Footer />
        </main>
    );
}

function Register() {
    const router = useRouter();
    const params = useSearchParams();
    const redirectTo = safeRedirect(params.get("redirect"));
    const [agree, setAgree] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const busy = loading || googleLoading;
    // const rules = useMemo(() => passwordRules(form.password), [form.password]);

    /* ------------------------- email + password ------------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const ResData = Object.fromEntries(formData.entries());

        if (ResData.password.length < 8) {
            setErrors({ form: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।" });
            toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
            return;
        }
        if (ResData.password !== ResData.confirmPassword) {
            setErrors({ form: "পাসওয়ার্ড দুটি মিলছে না।" });
            toast.error("পাসওয়ার্ড দুটি মিলছে না।");
            return;
        }
        try {
            setLoading(true);
            setErrors({});
            const { data, error } = await signUp.email({
                name: ResData.name,
                email: ResData.email,
                password: ResData.password,
            });
            if (data?.token || data?.user) {
                toast.success("রেজিস্ট্রেশন সফল হয়েছে, লগইন করুন");
                router.push('/signin')
            }
            if (error) {
                if (error.message === 'User already exists. Use another email.') {
                    setErrors({ form: 'এই ইমেইল দিয়ে একটি অ্যাকাউন্ট রয়েছে, অন্যটি চেষ্টা করুন।' });
                    toast.error('এই ইমেইল দিয়ে একটি অ্যাকাউন্ট রয়েছে, অন্যটি চেষ্টা করুন।');
                } else {
                    setErrors({ form: error.message || "কিছু একটা সমস্যা হয়েছে । আবার চেষ্টা করুন।" });
                    toast.error(error.message || "কিছু একটা সমস্যা হয়েছে । আবার চেষ্টা করুন।");
                }
                return

            }
        }
        catch (err) {
            setErrors({ form: "কিছু একটা সমস্যা হয়েছে । আবার চেষ্টা করুন।" });
            toast.error("কিছু একটা সমস্যা হয়েছে । আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        };

    };

    /* ------------------------------ google ------------------------------ */
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

    return (
        <section className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6 sm:py-12">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex justify-center mb-4">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#244855]/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/brad-logo.png" alt="" className="h-9 w-9 object-contain" />
                    </span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#244855] text-center">Create account</h1>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        {/* name */}
                        <Field id="name" label="Full name" error={errors.name}>
                            <Input
                                id="name"
                                autoComplete="name"
                                placeholder="Your full name"
                                disabled={busy}
                                aria-invalid={!!errors.name}
                                className={inputCls}
                                name="name"
                            />
                        </Field>

                        {/* email */}
                        <Field id="email" label="Email" error={errors.email}>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@email.com"
                                disabled={busy}
                                aria-invalid={!!errors.email}
                                className={inputCls}
                                name="email"
                            />
                        </Field>

                        {/* password */}
                        <Field id="password" label="Password" error={errors.password}>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPw ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Create a password"
                                    disabled={busy}
                                    aria-invalid={!!errors.password}
                                    className={`${inputCls} pr-11`}
                                    name="password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw((s) => !s)}
                                    aria-label={showPw ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                >
                                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </Field>

                        {/* confirm */}
                        <Field id="confirm" label="Confirm password" error={errors.confirm}>
                            <Input
                                id="confirm"
                                type={showPw ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Repeat your password"
                                disabled={busy}
                                aria-invalid={!!errors.confirm}
                                className={inputCls}
                                name="confirmPassword"
                            />
                        </Field>
                        {errors.form && (
                            <Alert variant="destructive" className="mt-1.5 border-red-200 bg-red-50 text-red-700">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-red-600">
                                    {errors.form}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* terms */}
                        <div>
                            <div className="flex items-start gap-2">
                                <Checkbox
                                    id="agree"
                                    checked={agree}
                                    onCheckedChange={(v) => {
                                        setAgree(v === true);
                                        if (errors.agree) setErrors((p) => ({ ...p, agree: undefined }));
                                    }}
                                    disabled={busy}
                                    className="mt-0.5 border-slate-300 data-[state=checked]:border-[#E64833] data-[state=checked]:bg-[#E64833] data-[state=checked]:text-white"
                                />
                                <Label htmlFor="agree" className="cursor-pointer text-xs font-normal leading-relaxed text-slate-600">
                                    I agree to the{" "}
                                    <Link href="/terms" className="font-semibold text-[#E64833] hover:text-[#cf3e2b]">
                                        Terms
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="font-semibold text-[#E64833] hover:text-[#cf3e2b]">
                                        Privacy Policy
                                    </Link>
                                    .
                                </Label>
                            </div>
                            {errors.agree && <p className="mt-1.5 text-xs text-red-600">{errors.agree}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={busy}
                            className="h-11 w-full rounded-xl bg-[#E64833] font-semibold text-white shadow-sm shadow-[#E64833]/25 hover:bg-[#cf3e2b]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…
                                </>
                            ) : (
                                "Create account"
                            )}
                        </Button>
                    </form>

                    <div className="my-5 flex items-center gap-3">
                        <Separator className="flex-1 bg-slate-100" />
                        <span className="text-xs text-slate-400">or</span>
                        <Separator className="flex-1 bg-slate-100" />
                    </div>

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
                        Already have an account?{" "}
                        <Link
                            href={`/signin${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                            className="font-semibold text-[#E64833] transition hover:text-[#cf3e2b]"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
        </section>
    );
}

/* small label + error wrapper so fields stay consistent */
function Field({ id, label, error, children }) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-xs font-semibold text-[#E64833]">
                {label}
            </Label>
            {children}
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}