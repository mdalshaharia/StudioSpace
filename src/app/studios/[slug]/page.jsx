'use client';

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SkeletonDetail } from "@/components/Skeletons";
import { useSession } from "@/app/lib/auth-client";
import { toast } from "sonner";
import BookingModal from "@/components/Modal/BookingModal";
const Stars = ({
  value = 0
}) => <span className="flex" aria-label={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map(n => <Star key={n} className={`h-3 w-3 ${n <= Math.round(value) ? "fill-[#E64833] text-[#E64833]" : "text-slate-300"}`} />)}
  </span>;
export default function StudioDetailsPage({
  params
}) {
  return <StudioDetails params={params} />;
}
function StudioDetails({
  params
}) {
  const {
    slug
  } = use(params);
  const {
    data: session,
    isPending
  } = useSession();
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    async function fetchStudio() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studios/${slug}`, {
          cache: "no-store"
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
  const [prevApi, setPrevApi] = useState(null);
  if (api && api !== prevApi) {
    setPrevApi(api);
    setCurrent(api.selectedScrollSnap());
  }
  useEffect(() => {
    if (!api) return;
    const handler = () => setCurrent(api.selectedScrollSnap());
    api.on("select", handler);
    return () => api.off("select", handler);
  }, [api]);
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
    ownerEmail
  } = product;
  const images = [imageUrl, ...gallery].filter(Boolean);
  return <main className="bg-background text-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:items-start lg:px-8">
        <div className="min-w-0">
          {images.length > 0 && <Carousel setApi={setApi} opts={{
          loop: true
        }} className="relative">
              <CarouselContent className="ml-0">
                {images.map((src, i) => <CarouselItem key={src + i} className="pl-0">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted">
                      <Image src={src} alt={`${title} – image ${i + 1}`} fill priority={i === 0} sizes="(min-width: 1024px) 736px, 100vw" className="object-cover" />
                    </div>
                  </CarouselItem>)}
              </CarouselContent>

              {images.length > 1 && <>
                  <CarouselPrevious className="left-3 border-0 bg-white/90 text-slate-900 shadow hover:bg-white" />
                  <CarouselNext className="right-3 border-0 bg-white/90 text-slate-900 shadow hover:bg-white" />

                  <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    {current + 1} / {images.length}
                  </span>
                </>}
            </Carousel>}

          <Badge variant="outline" className="mt-6 rounded-full border-[#E64833]/20 bg-[#E64833]/5 text-xs font-medium text-[#E64833]">
            {category}
          </Badge>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">{title}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            {location}
            {rating && <>
                <span aria-hidden>·</span>
                <Star className="h-3.5 w-3.5 fill-[#E64833] text-[#E64833]" />
                <span className="font-semibold text-[#E64833]">{rating}</span>
              </>}
          </p>

          <Section title="Overview">
            <p className="text-sm leading-relaxed text-muted-foreground">{overview}</p>
          </Section>

          <Section title="Specifications">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Spec label="Category" value={category} />
              <Spec label="Max capacity" value={`${maxCapacity} people`} />
              <Spec label="Security deposit" value={`$${securityDeposit}`} />
            </div>
          </Section>

          {amenities.length > 0 && <Section title="Amenities">
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => <Badge key={a} variant="outline" className="rounded-full border-border text-xs font-normal text-foreground/85">
                    {a}
                  </Badge>)}
              </div>
            </Section>}

          <Section title="Hosted by">
            <Card className="border-border bg-card py-0 text-foreground shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#E64833]/10 font-semibold text-[#E64833]">
                    {ownerName?.[0]?.toUpperCase() ?? "H"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-heading">{ownerName}</p>
                  <p className="truncate text-xs text-muted-foreground">{ownerEmail}</p>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section title="Reviews">
            {reviews.length === 0 ? <p className="text-sm text-muted-foreground">No reviews yet.</p> : <ul className="space-y-3">
                {reviews.map((r, i) => <li key={i}>
                    <Card className="border-border bg-card py-0 text-foreground shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-heading">{r.name}</p>
                          <Stars value={r.rating} />
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground">{r.comment}</p>
                      </CardContent>
                    </Card>
                  </li>)}
              </ul>}
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <Card className="border-border bg-card py-0 text-foreground shadow-sm">
            <CardContent className="p-5">
              <p>
                <span className="text-3xl font-extrabold text-heading">${hourlyRate}</span>
                <span className="ml-1.5 text-sm text-[#E64833]">per hour</span>
              </p>

              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Security deposit (refundable)" value={`$${securityDeposit}`} />
                <Row label="Max capacity" value={`${maxCapacity} people`} />
                <Row label="Location" value={location} />
              </dl>

              <Separator className="my-4 bg-border" />
              <Button onClick={() => setOpen(true)} disabled={isPending} className="h-11 w-full rounded-xl bg-[#E64833] font-semibold text-white shadow-sm shadow-[#E64833]/25 hover:bg-[#cf3e2b] disabled:opacity-50">
                Book Workspace Now
              </Button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Bookings Start Here.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
      {open && <BookingModal open={open} studio={product} onOpenChange={setOpen} />}
    </main>;
}
function Section({
  title,
  children
}) {
  return <section className="mt-8">
      <h2 className="mb-3 text-lg font-bold text-heading">{title}</h2>
      {children}
    </section>;
}
function Spec({
  label,
  value
}) {
  return <div className="rounded-xl border border-border bg-muted/50 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-heading">{value}</p>
    </div>;
}
function Row({
  label,
  value
}) {
  return <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>;
}
