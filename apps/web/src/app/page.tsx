import HeroSection from "@/components/landing/HeroSection";
import LiveSimulation from "@/components/landing/LiveSimulation";
import CoreStatement from "@/components/landing/CoreStatement";
import HowItWorks from "@/components/landing/HowItWorks";
import FounderLetter from "@/components/landing/FounderLetter";
import VisionAndCTA from "@/components/landing/VisionAndCTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-[#F2F2F2] selection:bg-[#7C3AED]/30 overflow-x-hidden font-sans">
      <HeroSection />
      <LiveSimulation />
      <CoreStatement />
      <HowItWorks />
      <FounderLetter />
      <VisionAndCTA />
      <Footer />
    </main>
  );
}
