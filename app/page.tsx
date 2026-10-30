import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { UseCases } from "@/components/UseCases";
import { FeatureGallery } from "@/components/FeatureGallery";
import { Compare } from "@/components/Compare";
import { Privacy } from "@/components/Privacy";
import { Download } from "@/components/Download";
import { Community } from "@/components/Community";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { PalGuide } from "@/components/pal/PalGuide";
import { Reveals } from "@/components/motion/Reveals";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="overflow-x-clip">
        <Hero />
        <Marquee />
        <UseCases />
        <FeatureGallery />
        <Compare />
        <Privacy />
        <Download />
        <Community />
        <Faq />
      </main>
      <Footer />
      <PalGuide />
      <Reveals />
    </>
  );
}
