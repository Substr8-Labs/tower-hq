"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Your AI
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Executive Team</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Stop making decisions alone. Get instant strategic guidance from AI personas who think like a CTO, CPO, CMO, and CFO.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-lg transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="#how-it-works"
            className="px-8 py-4 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg text-lg transition-colors"
          >
            See How It Works
          </Link>
        </div>
        
        <p className="mt-6 text-sm text-gray-500">
          Free during beta • No credit card required
        </p>
      </div>
    </section>
  );
}
