"use client";

import { useRouter } from "next/navigation";
import { OriOnboarding } from "@/components/OriOnboarding";

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = async (companyName: string, companyContext: string) => {
    try {
      // Create tower via API
      const res = await fetch('/api/towers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, companyContext }),
      });
      
      if (!res.ok) {
        console.error('Failed to create tower');
      }
    } catch (err) {
      console.error("Failed to create tower:", err);
    }
    
    // Navigate to app regardless (graceful degradation)
    router.push("/app/general");
  };

  const handleSkip = () => {
    router.push("/app/general");
  };

  return (
    <main className="h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto h-full">
        <OriOnboarding 
          onComplete={handleComplete} 
          onSkip={handleSkip}
        />
      </div>
    </main>
  );
}
