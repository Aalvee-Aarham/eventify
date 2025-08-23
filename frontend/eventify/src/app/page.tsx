import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./home/Hero";
import Feature from "./home/Feature";
import Footer from "./home/Footer";

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
