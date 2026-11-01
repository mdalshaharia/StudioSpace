"use client";


import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { signUp, signIn } from "../lib/auth-client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";


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
    "h-11 rounded-xl border-white/10 bg-neutral-950 text-white placeholder:text-neutral-500 focus-visible:ring-amber-400/60";

/* ------------------------------- page -------------------------------- */

export default function RegisterPage() {
    return (
        <Suspense fallback={null}>
            <Register />
        </Suspense>
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

        console.log(ResData)
        // console.log(data, error)

        if (ResData.password.length < 8) {
            return setErrors({ form: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।" });
        }
        if (ResData.password !== ResData.confirmPassword) {
            return setErrors({ form: "পাসওয়ার্ড দুটি মিলছে না।" });
        }
        try {
            setLoading(true);
            // setErrors('');
            const { data, error } = await signUp.email({
                name: ResData.name,
                email: ResData.email,
                password: ResData.password,
            });
            console.log(error)
            console.log(data)
            if (data?.token || data?.user) {
                toast.success("রেজিস্ট্রেশন সফল হয়েছে, লগইন করুন");
                router.push('/signin')
            }
            if (error) {
                if (error.message === 'User already exists. Use another email.') {
                    setErrors({ form: 'এই ইমেইল দিয়ে একটি অ্যাকাউন্ট রয়েছে, অন্যটি চেষ্টা করুন।' });
                } else {
                    setErrors({ form: error.message || "কিছু একটা সমস্যা হয়েছে । আবার চেষ্টা করুন।" });
                }
                return

            }
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        };

    };

    /* ------------------------------ google ------------------------------ */
    const handleGoogle = async () => {
        console.log('clicked')
        try {
            setGoogleLoading(true);
            setErrors({});

            const { data, error } = await signIn.social({
                provider: "google",
                callbackURL: "/",
            });
            console.log(data)
            if (data) {
                toast.success("গুগল লগইন সফল হয়েছে। হোম পেজে নেওয়া হচ্ছে...");
            }
            if (error) {
                console.error("Google sign-in error:", error);
                setErrors({ form: error.message || "গুগল লগইন করতে সমস্যা হচ্ছে।" });
                setGoogleLoading(false); // Stop loading if it failed to redirect
                return;
            }

        } catch (err) {
            console.error("Unexpected error during social login:", err);
            setErrors({ form: "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।" });
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <main className="bg-neutral-950 text-white">
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-12">
                {/* ---------------- left: visual panel (desktop only) ---------------- */}
                <aside className="relative hidden min-h-[640px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#2b2620] to-[#54402a] lg:block">
                    <div className="absolute inset-x-0 bottom-0 p-8">
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            Book it. List it. Make something.
                        </h2>
                        <p className="mt-2 text-sm text-neutral-200">
                            Join StudioSpace to book creative studios by the hour or earn by listing your own.
                        </p>
                    </div>
                </aside>

                {/* ---------------------- right: form card ---------------------- */}
                <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
                    <h1 className="text-3xl font-extrabold tracking-tight">Create account</h1>

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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-white"
                                >
                                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            {/* {form.password && (
                                <ul className="mt-2 space-y-1">
                                    {rules.map((r) => (
                                        <li
                                            key={r.label}
                                            className={`flex items-center gap-2 text-xs ${r.ok ? "text-emerald-400" : "text-neutral-500"
                                                }`}
                                        >
                                            {r.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                            {r.label}
                                        </li>
                                    ))}
                                </ul>
                            )} */}
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
                        {errors.form && <p className="mt-1.5 text-xs text-red-400">{errors.form}</p>}

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
                                    className="mt-0.5 border-white/30 data-[state=checked]:border-amber-400 data-[state=checked]:bg-amber-400 data-[state=checked]:text-neutral-900"
                                />
                                <Label htmlFor="agree" className="cursor-pointer text-xs font-normal leading-relaxed text-neutral-300">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-amber-400 hover:text-amber-300">
                                        Terms
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-amber-400 hover:text-amber-300">
                                        Privacy Policy
                                    </Link>
                                    .
                                </Label>
                            </div>
                            {errors.agree && <p className="mt-1.5 text-xs text-red-400">{errors.agree}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={busy}
                            className="h-11 w-full rounded-xl bg-amber-400 font-semibold text-neutral-900 hover:bg-amber-300"
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
                        <Separator className="flex-1 bg-white/10" />
                        <span className="text-xs text-neutral-400">or</span>
                        <Separator className="flex-1 bg-white/10" />
                    </div>

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
                        Already have an account?{" "}
                        <Link
                            href={`/login${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                            className="font-semibold text-amber-400 transition hover:text-amber-300"
                        >
                            Sign in
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}

/* small label + error wrapper so fields stay consistent */
function Field({ id, label, error, children }) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-xs text-amber-400/90">
                {label}
            </Label>
            {children}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}