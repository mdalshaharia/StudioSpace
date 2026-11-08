import Image from "next/image";
import Navbar from "../components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import ByCategory from "@/components/ByCategory/ByCategory";
import Featured from "@/components/Featured/Featured";
import Preview from "@/components/Preview/Preview";
import BookingWorks from "@/components/BookingWorks/BookingWorks";
import TrustSafety from "@/components/TrustSafety/TrustSafety";
import Footer from "@/components/Footer/Footer";
import Banner from "@/components/Banner/Banner";

export default function Home() {
  return (
    <main className="min-h-screen bg-card text-foreground">
      <Navbar />
      <Banner></Banner>
      {/* <Hero /> */}
      <ByCategory />
      <Featured />
      <Preview />
      <BookingWorks />
      <TrustSafety />
      <Footer />
    </main>
  );
}
