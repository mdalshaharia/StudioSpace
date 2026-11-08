"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Button } from "@/components/ui/button";

// const pexels = (id) =>
//     `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`;

const SLIDES = [
    {
        image: '/banner-photo-1.webp',
        tag: "Photo studios",
        title: "Find the room where your next shoot happens",
        text: "Seamless cyc walls, pro lighting and loading access, booked by the hour.",
    },
    {
        image: '/banner-photo-2.webp',
        tag: "Music suites",
        title: "Record your best take in a room built for sound",
        text: "Treated live rooms, vocal booths and mixing desks with clear pricing.",
    },
    {
        image: '/banner-photo-3.webp',
        tag: "Podcast lounges",
        title: "Start the conversation in a space that sounds great",
        text: "Cosy lounges with mics, panels and cameras ready when you arrive.",
    },
    {
        image: '/banner-photo-4.webp',
        tag: "Film stages",
        title: "Bring your story to life on a real stage",
        text: "Sound stages and green screen halls with live availability.",
    },
    {
        image: '/banner-photo-5.webp',
        tag: "Music suites",
        title: "Record your best take in a room built for sound",
        text: "Treated live rooms, vocal booths and mixing desks with clear pricing.",
    },
];

export default function Banner() {
    return (
        <section className="hero-slider relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-[#244855] sm:h-[82vh]">
            <Suspense
                fallback={
                    <div className="absolute inset-0 bg-gradient-to-r from-[#244855] via-[#244855] to-[#3a6a82]" />
                }
            >
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                loop
                speed={900}
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                pagination={{ clickable: true }}
                navigation
                className="h-full"
            >
                {SLIDES.map((s, i) => (
                    <SwiperSlide key={s.tag}>
                        <div className="relative h-full w-full">
                            {/* image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={s.image}
                                alt={s.tag}
                                loading={i === 0 ? "eager" : "lazy"}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            {/* teal overlay for readable text */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#244855]/95 via-[#244855]/70 to-[#244855]/20" />

                            {/* content */}
                            <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 pb-10 sm:px-10 lg:px-14">
                                <div className="max-w-2xl text-white">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-[#E64833]/30 bg-[#E64833]/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#E64833]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#E64833] animate-pulse" />
                                        Peer-to-peer creative spaces
                                    </span>
                                    <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                                        {s.title}
                                    </h1>
                                    <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
                                        {s.text}
                                    </p>

                                    <div className="mt-8 flex flex-wrap gap-3">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="h-12 rounded-xl border-none bg-[#E64833] px-8 text-base font-semibold text-white shadow-lg shadow-[#E64833]/30 transition-all hover:-translate-y-0.5 hover:bg-[#cf3e2b]"
                                        >
                                            <Link href="/studios">Explore Studios</Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="lg"
                                            variant="outline"
                                            className="h-12 rounded-xl border border-white/40 bg-white/10 px-8 text-base font-semibold text-white shadow-lg shadow-black/10 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-heading"
                                        >
                                            <Link href="/add-studio">Host Your Space</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            </Suspense>

            {/* swiper control colours + hide arrows on small screens */}
            <style jsx global>{`
        .hero-slider .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }
        .hero-slider .swiper-pagination-bullet-active {
          background: #e64833;
          opacity: 1;
          width: 28px;
          border-radius: 9999px;
        }
        .hero-slider .swiper-button-next,
        .hero-slider .swiper-button-prev {
          color: #fff;
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          background: rgba(36, 72, 85, 0.55);
          backdrop-filter: blur(6px);
          transition: background 0.2s;
        }
        .hero-slider .swiper-button-next:hover,
        .hero-slider .swiper-button-prev:hover {
          background: #e64833;
        }
        .hero-slider .swiper-button-next svg,
        .hero-slider .swiper-button-prev svg {
          width: 18px;
          height: 18px;
        }
        @media (max-width: 640px) {
          .hero-slider .swiper-button-next,
          .hero-slider .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
        </section>
    );
}
