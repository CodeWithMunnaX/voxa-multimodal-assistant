import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { StatsTestimonials } from "@/components/landing/StatsTestimonials";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden selection:bg-violet-500/30">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <StatsTestimonials />
      </main>
      <Footer />
    </div>
  );
}
