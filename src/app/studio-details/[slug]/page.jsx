'use client';

import { useState, useEffect, use, Suspense } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/app/lib/auth-client";
import BookingModal from "@/components/Modal/BookingModal";

const Stars = ({ value = 0 }) => (
  <span className="flex" aria-label={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`h-3 w-3 ${n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-neutral-600"}`}
      />
    ))}
  </span>
);

export default function StudioDetailsPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-neutral-950 text-white">
          <p className="text-sm text-neutral-400">Loading studio details...</p>
        </div>
      }
    >
      <StudioDetails params={params} />
    </Suspense>
  );
}

function StudioDetails({ params }) {

  const { slug } = use(params);
  const { data: session, isPending } = useSession();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchStudio() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studios/${slug}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudio();
  }, [slug]);

  if (loading) {
    return <div className="p-6 text-center">Loading studio details...</div>;
  }

  if (!product) {
    return <div className="p-6 text-center text-red-500">দুঃখিত, পণ্যটি পাওয়া যায়নি।</div>;
  }

  const {
    title,
    category,
    hourlyRate,
    securityDeposit,
    maxCapacity,
    location,
    imageUrl,
    gallery = [],
    amenities = [],
    overview,
    rating,
    reviews = [],
    ownerName,
    ownerEmail,
  } = product;

  const images = [imageUrl, ...gallery].filter(Boolean);

  return (
    <main className="bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:items-start lg:px-8">
        {/* ============================ left ============================ */}
        <div className="min-w-0">
          {/* gallery */}
          {images.length > 0 && (
            <>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
                <img src={images[0]} alt={title} className="h-full w-full object-cover" />
              </div>

            </>
          )}
          <Badge variant="outline" className="mt-6 rounded-full border-white/20 text-xs font-normal text-neutral-200">
            {category}
          </Badge>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-neutral-400">
            {location}
            {rating && (
              <>
                <span aria-hidden>·</span>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-white">{rating}</span>
              </>
            )}
          </p>

          {/* overview */}
          <Section title="Overview">
            <p className="text-sm leading-relaxed text-neutral-300">{overview}</p>
          </Section>

          {/* specs */}
          <Section title="Specifications">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Spec label="Category" value={category} />
              <Spec label="Max capacity" value={`${maxCapacity} people`} />
              <Spec label="Security deposit" value={`$${securityDeposit}`} />
            </div>
          </Section>

          {/* amenities */}
          {amenities.length > 0 && (
            <Section title="Amenities">
              <div className="flex flex-wrap gap-2">
                {amenities.map((a) => (
                  <Badge
                    key={a}
                    variant="outline"
                    className="rounded-full border-white/15 text-xs font-normal text-neutral-200"
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </Section>
          )}

          {/* host */}
          <Section title="Hosted by">
            <Card className="border-white/10 bg-neutral-900 py-0 text-white">
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-amber-400/20 font-semibold text-amber-300">
                    {ownerName?.[0]?.toUpperCase() ?? "H"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{ownerName}</p>
                  <p className="truncate text-xs text-neutral-400">{ownerEmail}</p>
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* reviews */}
          <Section title="Reviews">
            {reviews.length === 0 ? (
              <p className="text-sm text-neutral-400">No reviews yet.</p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((r, i) => (
                  <li key={i}>
                    <Card className="border-white/10 bg-neutral-900 py-0 text-white">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">{r.name}</p>
                          <Stars value={r.rating} />
                        </div>
                        <p className="mt-1.5 text-sm text-neutral-300">{r.comment}</p>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        {open && (
          <BookingModal open={open} studio={product} onOpenChange={setOpen} />
        )}

        {/* ============================ right: booking card ============================ */}
        <aside className="lg:sticky lg:top-24">
          <Card className="border-white/10 bg-neutral-900 py-0 text-white">
            <CardContent className="p-5">
              <p>
                <span className="text-3xl font-extrabold">${hourlyRate}</span>
                <span className="ml-1.5 text-sm text-amber-400">per hour</span>
              </p>

              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Security deposit (refundable)" value={`$${securityDeposit}`} />
                <Row label="Max capacity" value={`${maxCapacity} people`} />
                <Row label="Location" value={location} />
              </dl>

              <Separator className="my-4 bg-white/10" />
              <Button
                onClick={() => setOpen(true)}
                disabled={loading || isPending}
                className="h-11 w-full rounded-xl bg-amber-400 font-semibold text-neutral-900 hover:bg-amber-300 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Book Workspace Now"}
              </Button>
              <p className="mt-3 text-center text-[11px] text-neutral-400">
                Opens the booking window. Status starts as Pending.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

/* ----------------------------- pieces ----------------------------- */

function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
      <p className="text-[11px] text-neutral-400">{label}</p>
      <p className="mt-0.5 text-sm font-bold">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="text-right font-medium text-neutral-100">{value}</dd>
    </div>
  );
}
