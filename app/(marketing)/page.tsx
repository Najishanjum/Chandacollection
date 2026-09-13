import { Hero } from "@/components/marketing/Hero";
import { Marquee } from "@/components/marketing/Marquee";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Features } from "@/components/marketing/Features";
import { DashboardShowcase } from "@/components/marketing/DashboardShowcase";
import { MasjidGallery } from "@/components/marketing/MasjidGallery";
import { FinalCTA } from "@/components/marketing/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <HowItWorks />
      <Features />
      <DashboardShowcase />
      <MasjidGallery />
      <FinalCTA />
    </>
  );
}
