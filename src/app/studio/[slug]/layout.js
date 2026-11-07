import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

export default function DetailsPage({
  children,
}) {
  return <section>
    <Navbar></Navbar>
    {children}
    <Footer></Footer>
    </section>
}