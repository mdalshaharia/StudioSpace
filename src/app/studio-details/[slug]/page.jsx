'use client';

import { useState, useEffect, use } from "react";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SkeletonDetail } from "@/components/Skeletons";
import { useSession } from "@/app/lib/auth-client";
import { toast } from "sonner";
import BookingModal from "@/components/Modal/BookingModal";

const Stars = ({ value = 0 }) => (
  <span className="flex" aria-label={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`h-3 w-3 ${n <= Math.round(value) ? "fill-[#E64833] text-[#E64833]" : "text-slate-300"}`}
      />
    ))}
  </span>
);

export default function StudioDetailsPage({ params }) {
  return <StudioDetails params={params} />;
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
        toast.error("Could not load the studio details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudio();
  }, [slug]);

  /* skeletons while the studio data loads — the route loading.jsx covers the
     initial page render, this covers the client fetch that follows it */
  if (loading) {
    return <SkeletonDetail />;
  }

  if (!product) {
    return <div className="p-6 text-center text-red-500">OOOOOps!! Something Went Wrong</div>;
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
    <main className="bg-white text-slate-800">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:items-start lg:px-8">
        {/* ============================ left ============================ */}
        <div className="min-w-0">
          {/* gallery */}
          {images.length > 0 && (
            <>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <img src={images[0]} alt={title} className="h-full w-full object-cover" />
              </div>

            </>
          )}
          <Badge variant="outline" className="mt-6 rounded-full border-[#E64833]/20 bg-[#E64833]/5 text-xs font-medium text-[#E64833]">
            {category}
          </Badge>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#244855] sm:text-4xl">{title}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            {location}
            {rating && (
              <>
                <span aria-hidden>·</span>
                <Star className="h-3.5 w-3.5 fill-[#E64833] text-[#E64833]" />
                <span className="font-semibold text-[#E64833]">{rating}</span>
              </>
            )}
          </p>

          {/* overview */}
          <Section title="Overview">
            <p className="text-sm leading-relaxed text-slate-600">{overview}</p>
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
                    className="rounded-full border-slate-200 text-xs font-normal text-slate-700"
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </Section>
          )}

          {/* host */}
          <Section title="Hosted by">
            <Card className="border-slate-200 bg-white py-0 text-slate-800 shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#E64833]/10 font-semibold text-[#E64833]">
                    {ownerName?.[0]?.toUpperCase() ?? "H"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#244855]">{ownerName}</p>
                  <p className="truncate text-xs text-slate-500">{ownerEmail}</p>
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* reviews */}
          <Section title="Reviews">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500">No reviews yet.</p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((r, i) => (
                  <li key={i}>
                    <Card className="border-slate-200 bg-white py-0 text-slate-800 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-[#244855]">{r.name}</p>
                          <Stars value={r.rating} />
                        </div>
                        <p className="mt-1.5 text-sm text-slate-600">{r.comment}</p>
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
          <Card className="border-slate-200 bg-white py-0 text-slate-800 shadow-sm">
            <CardContent className="p-5">
              <p>
                <span className="text-3xl font-extrabold text-[#244855]">${hourlyRate}</span>
                <span className="ml-1.5 text-sm text-[#E64833]">per hour</span>
              </p>

              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Security deposit (refundable)" value={`$${securityDeposit}`} />
                <Row label="Max capacity" value={`${maxCapacity} people`} />
                <Row label="Location" value={location} />
              </dl>

              <Separator className="my-4 bg-slate-100" />
              <Button
                onClick={() => setOpen(true)}
                disabled={isPending}
                className="h-11 w-full rounded-xl bg-[#E64833] font-semibold text-white shadow-sm shadow-[#E64833]/25 hover:bg-[#cf3e2b] disabled:opacity-50"
              >
                Book Workspace Now
              </Button>
              <p className="mt-3 text-center text-[11px] text-slate-500">
               Bookings Start Here.
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
      <h2 className="mb-3 text-lg font-bold text-[#244855]">{title}</h2>
      {children}
    </section>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-[#244855]">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{value}</dd>
    </div>
  );
}
