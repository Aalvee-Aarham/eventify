import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./pages/home/Hero";
import Feature from "./pages/home/Feature";
import Footer from "./pages/home/Footer";

export default function Home() {
  return (
    <div>
          <Navbar />
      <Hero />
      <Feature />
      <Footer />

    </div>
  );
}
