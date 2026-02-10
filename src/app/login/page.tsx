"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send magic link");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-2xl font-bold text-white mb-4">Check your email</h1>
          <p className="text-gray-400 mb-6">
            We sent a magic link to <span className="text-white">{email}</span>. 
            Click the link to sign in.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Use a different email
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🏰</span>
          <span className="text-2xl font-bold text-white">TowerHQ</span>
        </Link>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Welcome back
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Enter your email to sign in or create an account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            No password required. We will send you a link to sign in.
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
        </p>
      </div>
    </main>
  );
}
