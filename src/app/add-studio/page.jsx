"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import { useSession } from "../lib/auth-client";
import { getTokenFromClient } from "../lib/getTokenFromClient";

/* ------------------------------ config ------------------------------ */

const LISTINGS_ROUTE = "/my-listings";

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
  imageUrl: "",
  gallery: [],
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

function LoaderScreen() {
  return (
    <main className="grid min-h-[60vh] place-items-center bg-white">
      <Loader2 className="h-6 w-6 animate-spin text-amber-500" aria-label="Loading" />
    </main>
  );
}

export default function AddStudioPage() {
  return (
    <Suspense fallback={<LoaderScreen />}>
      <AddStudioForm />
    </Suspense>
  );
}

function AddStudioForm() {
  const router = useRouter();
  const studioId = useSearchParams().get("studioId");
  const isEdit = !!studioId;

  const { data: session, isPending } = useSession();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingStudio, setLoadingStudio] = useState(isEdit);

  // auth guard
  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/signin?redirect=/my-listings");
  }, [isPending, session, router]);

  // prefill form when editing an existing studio
  useEffect(() => {
    if (isPending || !session?.user || !isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studios/${studioId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error();
        const s = await res.json();
        if (!cancelled) {
          setForm({
            title: s.title ?? "",
            category: s.category ?? "",
            hourlyRate: s.hourlyRate != null ? String(s.hourlyRate) : "",
            securityDeposit: s.securityDeposit != null ? String(s.securityDeposit) : "",
            maxCapacity: s.maxCapacity != null ? String(s.maxCapacity) : "",
            location: s.location ?? "",
            imageUrl: s.imageUrl ?? "",
            gallery: s.gallery ?? [],
            amenities: s.amenities ?? [],
            overview: s.overview ?? "",
          });
        }
      } catch {
        if (!cancelled) toast.error("Could not load the studio to edit.");
      } finally {
        if (!cancelled) setLoadingStudio(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isPending, session, isEdit, studioId]);

  const updateField = (name) => (e) => {
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
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
    if (!form.imageUrl.trim()) n.imageUrl = "Image URL is required.";
    else if (!isUrl(form.imageUrl.trim())) n.imageUrl = "Enter a valid image URL (https://…).";
    const badGallery = form.gallery.filter((g) => !isUrl(g.trim()));
    if (badGallery.length) n.gallery = "Gallery entries must be valid URLs (comma-separated).";
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
    let createdStudio = null;
    let token = null;
    let payload = null;
    try {
      token = await getTokenFromClient();
      payload = {
        title: form.title.trim(),
        category: form.category,
        hourlyRate: Number(form.hourlyRate),
        securityDeposit: Number(form.securityDeposit),
        maxCapacity: Number(form.maxCapacity),
        location: form.location.trim(),
        imageUrl: form.imageUrl.trim(),
        gallery: form.gallery,
        amenities: form.amenities,
        overview: form.overview.trim(),
        rating: 4.6,
        reviews: [],
        ownerName: session?.user?.name ?? "",
        ownerEmail: session?.user?.email ?? "",
        ownerId: session?.user?.id ?? "",
        status: "active",
        createdAt: new Date().toISOString(),
      };

      // step 1: save or update the studio
      const studioRes = await fetch(
        isEdit
          ? `${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studios/${studioId}`
          : `${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studios`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!studioRes.ok) {
        const data = await studioRes.json().catch(() => ({}));
        throw new Error(data.message || "Could not save the studio.");
      }
      createdStudio = await studioRes.json();
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    if (!isEdit) {
      // link newly created studio to the owner's listings
      try {
        const myListingRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/my-listings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ownerId: payload.ownerId, productId: createdStudio.insertedId }),
        });
        if (!myListingRes.ok) {
          // roll back the studio so it isn't silently orphaned
          await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studios/${createdStudio.insertedId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {});
          const data = await myListingRes.json().catch(() => ({}));
          throw new Error(data.message || "Could not link the studio to your listings.");
        }
      } catch (err) {
        toast.error(err.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
    }

    console.log("res from my-listings:", createdStudio);
    console.log("res from stdio:", createdStudio);
    toast.success(isEdit ? "Studio updated successfully!" : "Studio added successfully!");
    setSubmitting(false);
    router.push(LISTINGS_ROUTE);
  };

  if (isPending || !session?.user || loadingStudio) {
    return <LoaderScreen />;
  }

  return (
    <main className="bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {isEdit ? "Update your studio" : "Add a new studio"}
        </h1>
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
                onChange={updateField("title")}
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
                onChange={updateField("hourlyRate")}
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
                onChange={updateField("securityDeposit")}
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
                onChange={updateField("maxCapacity")}
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
                onChange={updateField("location")}
                disabled={submitting}
                aria-invalid={!!errors.location}
                className={inputCls}
              />
            </Field>
          </div>

          {/* image */}
          <Field id="imageUrl" label="Image URL" error={errors.imageUrl}>
            <Input
              id="imageUrl"
              type="url"
              inputMode="url"
              placeholder="https://…"
              value={form.imageUrl}
              onChange={updateField("imageUrl")}
              disabled={submitting}
              aria-invalid={!!errors.imageUrl}
              className={inputCls}
            />
          </Field>

          {/* gallery */}
          <Field id="gallery" label="Gallery image URLs (optional, comma-separated)" error={errors.gallery}>
            <Input
              id="gallery"
              type="url"
              inputMode="url"
              placeholder="https://…, https://…"
              value={form.gallery.join(", ")}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  gallery: e.target.value
                    .split(",")
                    .map((g) => g.trim())
                    .filter(Boolean),
                }))
              }
              disabled={submitting}
              aria-invalid={!!errors.gallery}
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
              onChange={updateField("overview")}
              disabled={submitting}
              aria-invalid={!!errors.overview}
              className="rounded-xl border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-amber-500/50"
            />
          </Field>

          {/* owner (read-only) */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="ownerName" label="Owner name (read-only)">
              <Input
                id="ownerName"
                readOnly
                value={session?.user?.name ?? ""}
                className={`${inputCls} cursor-not-allowed bg-neutral-100 text-neutral-600`}
              />
            </Field>
            <Field id="ownerEmail" label="Owner email (read-only)">
              <Input
                id="ownerEmail"
                readOnly
                value={session?.user?.email ?? ""}
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                </>
              ) : isEdit ? (
                "Save Changes"
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
