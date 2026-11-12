"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Circle, CircleCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { signUp, signIn } from "../lib/auth-client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar/Navbar";
import { LoaderScreen } from "@/components/Skeletons";
const isUrl = v => {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};
const passwordRules = pw => [{
  label: "At least 8 characters",
  ok: pw.length >= 8
}, {
  label: "One uppercase letter",
  ok: /[A-Z]/.test(pw)
}, {
  label: "One lowercase letter",
  ok: /[a-z]/.test(pw)
}];
function GoogleIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
        </svg>;
}
const inputCls = "h-11 rounded-xl border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-[#E64833]/60";
export default function RegisterPage() {
  return <main className="flex min-h-screen flex-col bg-background text-foreground">
            <Navbar />
            <div className="flex-1">
                <Suspense fallback={<LoaderScreen />}>
                    <Register />
                </Suspense>
            </div>
        </main>;
}
function Register() {
  const router = useRouter();
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const busy = loading || googleLoading;
  const rules = useMemo(() => passwordRules(password), [password]);
  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ResData = Object.fromEntries(formData.entries());
    if (!rules.every(r => r.ok)) {
      const msg = "Password must be at least 8 characters and contain an uppercase and a lowercase letter.";
      setErrors({
        password: msg
      });
      return;
    }
    const photoURL = ResData.photoURL?.trim() ?? "";
    if (photoURL && !isUrl(photoURL)) {
      setErrors({
        photoURL: "Enter a valid URL starting with http:// or https:// — or leave it empty."
      });
      return;
    }
    try {
      setLoading(true);
      setErrors({});
      const {
        data,
        error
      } = await signUp.email({
        name: ResData.name,
        email: ResData.email,
        password: ResData.password,
        image: photoURL || undefined
      });
      if (data?.token || data?.user) {
        toast.success("Registration successful, please sign in");
        router.push('/signin');
      }
      if (error) {
        const friendly = {
          USER_ALREADY_EXISTS: "An account with this email already exists. Try signing in instead.",
          PASSWORD_TOO_SHORT: "Password must be at least 8 characters.",
          INVALID_EMAIL: "Please enter a valid email address."
        };
        const alreadyUsed = (error.message || "").toLowerCase().includes("already exists");
        setErrors({
          form: friendly[error.code] ?? (alreadyUsed ? "An account with this email already exists. Try signing in instead." : error.message || "Something went wrong. Please try again.")
        });
        return;
      }
    } catch (err) {
      setErrors({
        form: "Something went wrong. Please try again."
      });
    } finally {
      setLoading(false);
    }
    ;
  };
  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      setErrors({});
      const {
        data,
        error
      } = await signIn.social({
        provider: "google",
        callbackURL: "/"
      });
      if (data) {
        toast.success("Google sign in successful. Redirecting to home page...");
      }
      if (error) {
        setErrors({
          form: error.message || "There was a problem signing in with Google."
        });
        setGoogleLoading(false);
        return;
      }
    } catch (err) {
      setErrors({
        form: "Something went wrong. Please try again."
      });
    } finally {
      setGoogleLoading(false);
    }
  };
  return <section className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6 sm:py-12">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex justify-center mb-4">
                        <Image src="/brad-logo.png" alt="" width={28} height={28} className="h-7 w-7 object-contain dark:invert" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-heading text-center">Create account</h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {}
                    <Field id="name" label="Full name" error={errors.name}>
                        <Input id="name" autoComplete="name" placeholder="Your full name" disabled={busy} aria-invalid={!!errors.name} className={inputCls} name="name" />
                    </Field>

                    {}
                    <Field id="email" label="Email" error={errors.email}>
                        <Input id="email" type="email" autoComplete="email" placeholder="you@email.com" disabled={busy} aria-invalid={!!errors.email} className={inputCls} name="email" />
                    </Field>

                    {}
                    <Field id="photoURL" label="Photo URL (optional)" error={errors.photoURL}>
                        <Input id="photoURL" type="url" autoComplete="photo" placeholder="https://example.com/avatar.jpg" disabled={busy} aria-invalid={!!errors.photoURL} className={inputCls} name="photoURL" />
                    </Field>

                    {}
                    <Field id="password" label="Password" error={errors.password}>
                        <div className="relative">
                            <Input id="password" type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="Create a password" disabled={busy} value={password} onChange={e => setPassword(e.target.value)} aria-invalid={!!errors.password} className={`${inputCls} pr-11`} name="password" />
                            <button type="button" onClick={() => setShowPw(s => !s)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground/85">
                                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        {}
                        <ul className="space-y-1 pt-1" aria-live="polite">
                            {rules.map(r => <li key={r.label} className={`flex items-center gap-1.5 text-[11px] transition-colors ${r.ok ? "text-emerald-600" : "text-muted-foreground"}`}>
                                    {r.ok ? <CircleCheck className="h-3 w-3 shrink-0" /> : <Circle className="h-3 w-3 shrink-0" />}
                                    {r.label}
                                </li>)}
                        </ul>
                    </Field>

                    {errors.form && <Alert variant="destructive" className="mt-1.5 border-red-200 bg-red-50 text-red-700">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-red-600">
                                {errors.form}
                            </AlertDescription>
                        </Alert>}

                    {}
                    <div>
                        <div className="flex items-start gap-2">
                            <Checkbox id="agree" checked={agree} onCheckedChange={v => {
              setAgree(v === true);
              if (errors.agree) setErrors(p => ({
                ...p,
                agree: undefined
              }));
            }} disabled={busy} className="mt-0.5 border-border data-[state=checked]:border-[#E64833] data-[state=checked]:bg-[#E64833] data-[state=checked]:text-white" />
                            <Label htmlFor="agree" className="cursor-pointer text-xs font-normal leading-relaxed text-muted-foreground">
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

                    <Button type="submit" disabled={busy} className="h-11 w-full rounded-xl bg-[#E64833] font-semibold text-white shadow-sm shadow-[#E64833]/25 hover:bg-[#cf3e2b]">
                        {loading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…
                            </> : "Create account"}
                    </Button>
                </form>

                <div className="my-5 flex items-center gap-3">
                    <Separator className="flex-1 bg-muted" />
                    <span className="text-xs text-muted-foreground">or</span>
                    <Separator className="flex-1 bg-muted" />
                </div>

                <Button type="button" variant="outline" onClick={handleGoogle} disabled={busy} className="h-11 w-full rounded-xl border-border bg-card font-semibold text-foreground hover:bg-muted hover:text-heading">
                    {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="mr-2">
                            <GoogleIcon />
                        </span>}
                    Continue with Google
                </Button>

                <p className="mt-6 text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href={`/signin`} className="font-semibold text-[#E64833] transition hover:text-[#cf3e2b]">
                        Sign in
                    </Link>
                </p>
            </div>
        </section>;
}
function Field({
  id,
  label,
  error,
  children
}) {
  return <div className="space-y-1.5">
            <Label htmlFor={id} className="text-xs font-semibold text-[#E64833]">
                {label}
            </Label>
            {children}
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>;
}
