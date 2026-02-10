"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [companyContext, setCompanyContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"company" | "welcome">("company");

  const handleCreateTower = async () => {
    if (!companyName.trim()) return;
    
    setLoading(true);
    try {
      // TODO: Call API to create tower
      // For now, just proceed to welcome
      setStep("welcome");
    } catch (err) {
      console.error("Failed to create tower:", err);
    } finally {
      setLoading(false);
    }
  };

  if (step === "welcome") {
    return <WelcomeModal companyName={companyName} onContinue={() => router.push("/app/general")} />;
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🏰</span>
          <span className="text-2xl font-bold text-white">TowerHQ</span>
        </Link>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Create Your Tower
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Tell us about your company so your AI team can give better advice
          </p>

          <div className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm text-gray-400 mb-2">
                Company name <span className="text-red-400">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Inc"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="companyContext" className="block text-sm text-gray-400 mb-2">
                What are you building? <span className="text-gray-600">(optional)</span>
              </label>
              <textarea
                id="companyContext"
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
                placeholder="We're building a platform that helps..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                This context helps your AI team give more relevant advice
              </p>
            </div>

            <button
              onClick={handleCreateTower}
              disabled={loading || !companyName.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Creating..." : "Create My Tower"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function WelcomeModal({ companyName, onContinue }: { companyName: string; onContinue: () => void }) {
  const personas = [
    { name: "Ada", role: "CTO", icon: "🧠", color: "bg-green-500", description: "Technical architecture & engineering" },
    { name: "Grace", role: "CPO", icon: "🎯", color: "bg-yellow-500", description: "Product strategy & roadmap" },
    { name: "Tony", role: "CMO", icon: "📣", color: "bg-pink-500", description: "Marketing & growth" },
    { name: "Val", role: "CFO", icon: "📊", color: "bg-red-500", description: "Finance & business model" },
  ];

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">🎉</span>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to {companyName} HQ!
            </h1>
            <p className="text-gray-400">
              Meet your AI executive team
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {personas.map((persona) => (
              <div key={persona.name} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 ${persona.color} rounded-full flex items-center justify-center text-xl`}>
                    {persona.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{persona.name}</h3>
                    <p className="text-xs text-gray-400">{persona.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{persona.description}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onContinue}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
          >
            Start Chatting
          </button>
        </div>
      </div>
    </main>
  );
}
