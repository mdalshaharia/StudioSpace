"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
// import { onAuthStateChanged } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { auth } from "@/lib/firebase";

/* ------------------------------ config ------------------------------ */

const LISTINGS_ROUTE = "/my-listings";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CATEGORIES = [
  "Photography cyc wall",
  "Film and sound stage",
  "Music recording suite",
  "Podcast lounge",
  "Art workshop",
];

const AMENITIES = [
  "Wi-Fi",
  "Parking",
  "Lighting kit",
  "Air conditioning",
  "Makeup station",
  "Loading access",
  "Soundproofing",
  "Kitchenette",
];

const EMPTY = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  imageURL: "",
  amenities: [],
  overview: "",
};

const isUrl = (v) => {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const inputCls =
  "h-11 rounded-xl border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-amber-500/50";

/* ------------------------------- page -------------------------------- */

export default function AddStudioPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // auth guard + host info
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       if (!u) {
//         router.replace("/login?redirect=/dashboard/studios/new");
//         return;
//       }
//       setUser(u);
//       setAuthReady(true);
//     });
//     return unsub;
//   }, [router]);

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const toggleAmenity = (name, checked) =>
    setForm((p) => ({
      ...p,
      amenities: checked ? [...p.amenities, name] : p.amenities.filter((a) => a !== name),
    }));

  const validate = () => {
    const n = {};
    if (form.title.trim().length < 3) n.title = "Title must be at least 3 characters.";
    if (!form.category) n.category = "Select a category.";
    if (!(Number(form.hourlyRate) > 0)) n.hourlyRate = "Enter an hourly rate above 0.";
    if (form.securityDeposit === "" || Number(form.securityDeposit) < 0)
      n.securityDeposit = "Enter a deposit (0 or more).";
    if (!(Number(form.maxCapacity) >= 1)) n.maxCapacity = "Capacity must be at least 1.";
    if (form.location.trim().length < 3) n.location = "Enter the location / address.";
    if (!form.imageURL.trim()) n.imageURL = "Image URL is required.";
    else if (!isUrl(form.imageURL.trim())) n.imageURL = "Enter a valid image URL (https://…).";
    if (form.overview.trim().length < 20) n.overview = "Write at least 20 characters.";
    setErrors(n);
    return Object.keys(n).length === 0;
  };

  const handleReset = () => {
    setForm(EMPTY);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const payload = {
        title: form.title.trim(),
        category: form.category,
        hourlyRate: Number(form.hourlyRate),
        securityDeposit: Number(form.securityDeposit),
        maxCapacity: Number(form.maxCapacity),
        location: form.location.trim(),
        imageURL: form.imageURL.trim(),
        amenities: form.amenities,
        overview: form.overview.trim(),
        hostName: user.displayName ?? "",
        hostEmail: user.email ?? "",
        hostUid: user.uid,
        createdAt: new Date().toISOString(),
      };

    //   const res = await fetch(`${API_URL}/studios`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(payload),
    //   });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Could not save the studio.");
      }

      toast.success("Studio added successfully!");
      router.push(LISTINGS_ROUTE);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

//   if (!authReady) {
//     return (
//       <main className="grid min-h-[60vh] place-items-center bg-white">
//         <Loader2 className="h-6 w-6 animate-spin text-amber-500" aria-label="Loading" />
//       </main>
//     );
//   }

  return (
    <main className="bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">Add a new studio</h1>
        <p className="mt-1 text-sm text-neutral-500">Tell creators about your space.</p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 space-y-5 rounded-3xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm sm:p-8"
        >
          {/* title + category */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="title" label="Title" error={errors.title}>
              <Input
                id="title"
                placeholder="e.g. Skyline Photo Studio"
                value={form.title}
                onChange={set("title")}
                disabled={submitting}
                aria-invalid={!!errors.title}
                className={inputCls}
              />
            </Field>

            <Field id="category" label="Category" error={errors.category}>
              <Select
                value={form.category}
                onValueChange={(v) => {
                  setForm((p) => ({ ...p, category: v }));
                  if (errors.category) setErrors((p) => ({ ...p, category: undefined }));
                }}
                disabled={submitting}
              >
                <SelectTrigger
                  id="category"
                  aria-invalid={!!errors.category}
                  className={`${inputCls} w-full`}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* rate + deposit */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="hourlyRate" label="Hourly rate ($)" error={errors.hourlyRate}>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="1"
                inputMode="decimal"
                placeholder="60"
                value={form.hourlyRate}
                onChange={set("hourlyRate")}
                disabled={submitting}
                aria-invalid={!!errors.hourlyRate}
                className={inputCls}
              />
            </Field>

            <Field id="securityDeposit" label="Security deposit ($)" error={errors.securityDeposit}>
              <Input
                id="securityDeposit"
                type="number"
                min="0"
                step="1"
                inputMode="decimal"
                placeholder="100"
                value={form.securityDeposit}
                onChange={set("securityDeposit")}
                disabled={submitting}
                aria-invalid={!!errors.securityDeposit}
                className={inputCls}
              />
            </Field>
          </div>

          {/* capacity + location */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="maxCapacity" label="Max capacity" error={errors.maxCapacity}>
              <Input
                id="maxCapacity"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                placeholder="12"
                value={form.maxCapacity}
                onChange={set("maxCapacity")}
                disabled={submitting}
                aria-invalid={!!errors.maxCapacity}
                className={inputCls}
              />
            </Field>

            <Field id="location" label="Location / address" error={errors.location}>
              <Input
                id="location"
                placeholder="Street, area, city"
                value={form.location}
                onChange={set("location")}
                disabled={submitting}
                aria-invalid={!!errors.location}
                className={inputCls}
              />
            </Field>
          </div>

          {/* image */}
          <Field id="imageURL" label="Image URL" error={errors.imageURL}>
            <Input
              id="imageURL"
              type="url"
              inputMode="url"
              placeholder="https://…"
              value={form.imageURL}
              onChange={set("imageURL")}
              disabled={submitting}
              aria-invalid={!!errors.imageURL}
              className={inputCls}
            />
          </Field>

          {/* amenities */}
          <fieldset className="space-y-2">
            <legend className="text-xs font-medium text-amber-700">Amenities</legend>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => {
                const checked = form.amenities.includes(a);
                const id = `amenity-${a.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                return (
                  <label
                    key={a}
                    htmlFor={id}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                      checked
                        ? "border-amber-500 bg-amber-50 text-amber-800"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-amber-400"
                    }`}
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(v) => toggleAmenity(a, v === true)}
                      disabled={submitting}
                      className="h-3.5 w-3.5 border-neutral-400 data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-white"
                    />
                    {a}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* overview */}
          <Field id="overview" label="Detailed overview" error={errors.overview}>
            <Textarea
              id="overview"
              rows={5}
              placeholder="Describe the space, equipment, house rules…"
              value={form.overview}
              onChange={set("overview")}
              disabled={submitting}
              aria-invalid={!!errors.overview}
              className="rounded-xl border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-amber-500/50"
            />
          </Field>

          {/* host (read-only) */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="hostName" label="Host name (read-only)">
              <Input
                id="hostName"
                readOnly
                value={user?.displayName ?? ""}
                className={`${inputCls} cursor-not-allowed bg-neutral-100 text-neutral-600`}
              />
            </Field>
            <Field id="hostEmail" label="Host email (read-only)">
              <Input
                id="hostEmail"
                readOnly
                value={user?.email ?? ""}
                className={`${inputCls} cursor-not-allowed bg-neutral-100 text-neutral-600`}
              />
            </Field>
          </div>

          {/* actions */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-xl bg-amber-400 px-6 font-semibold text-neutral-900 hover:bg-amber-300"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding…
                </>
              ) : (
                "Add Studio"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={submitting}
              className="h-11 rounded-xl border-neutral-300 bg-white px-6 font-semibold text-neutral-900 hover:bg-neutral-100"
            >
              Reset
            </Button>
          </div>

          <p className="text-[11px] text-neutral-500">
            On submit: saved to the studios collection, a success toast appears, and you are
            redirected to your listings.
          </p>
        </form>
      </div>
    </main>
  );
}

/* label + error wrapper */
function Field({ id, label, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-amber-700">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}