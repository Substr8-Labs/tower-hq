import { Navbar, Hero, HowItWorks, MeetTheTeam, Pricing, Footer } from "@/components/landing";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <HowItWorks />
        <MeetTheTeam />
        <Pricing />
        <Footer />
      </div>
    </main>
  );
}
