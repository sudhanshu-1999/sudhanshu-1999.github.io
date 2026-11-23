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
import { Divider } from "@/components/ui/Divider";

export default function Home() {
  return (
    <>
      <Loader />
      <ScrollProgress />
      <Nav />
      <main id="main" className="relative">
        <Hero />
        <Divider from="var(--bg)" to="var(--ivory)" />
        <About />
        <Divider from="var(--ivory)" to="var(--bg)" dir="fall" />
        <Arsenal />
        <Divider from="var(--bg)" to="var(--red)" layers={["var(--gold)", "var(--orange)"]} />
        <Projects />
        <Divider from="var(--red)" to="var(--ink)" dir="fall" layers={["var(--orange)", "var(--gold)"]} />
        <Architecture />
        <Divider from="var(--ink)" to="var(--ivory)" />
        <Experience />
        <Divider from="var(--ivory)" to="var(--bg)" dir="fall" />
        <Exploring />
        <Divider from="var(--bg)" to="var(--gold)" layers={["var(--red)", "var(--orange)"]} />
        <Contact />
        <Divider from="var(--gold)" to="var(--ink)" dir="fall" layers={["var(--orange)", "var(--red)"]} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
