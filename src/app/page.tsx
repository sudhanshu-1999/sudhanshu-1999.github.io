import { About } from "@/components/About";
import { Architecture } from "@/components/Architecture";
import { Arsenal } from "@/components/Arsenal";
import { BackToTop, Loader, ScrollProgress } from "@/components/Chrome";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Exploring } from "@/components/Exploring";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";

export default function Home() {
  return (
    <>
      <Loader />
      <ScrollProgress />
      <Nav />
      <main id="main" className="noise relative">
        <Hero />
        <About />
        <Arsenal />
        <Projects />
        <Architecture />
        <Experience />
        <Exploring />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
