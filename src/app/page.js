import Image from "next/image";
import Navbar from "../components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import ByCategory from "@/components/ByCategory/ByCategory";
import Featured from "@/components/Featured/Featured";

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <Hero></Hero>
      <ByCategory></ByCategory>
      <Featured></Featured>
    </div>
  );
}
