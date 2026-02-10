import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Free During Beta
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          We are looking for founding users to shape the product. Get early access and help us build the future of AI-assisted decision making.
        </p>

        <div className="p-8 rounded-2xl bg-gradient-to-b from-indigo-950/50 to-gray-900/50 border border-indigo-500/30">
          <div className="text-5xl font-bold text-white mb-2">$0</div>
          <div className="text-gray-400 mb-6">Free for early adopters</div>
          
          <ul className="text-left max-w-sm mx-auto space-y-3 mb-8">
            {[
              "Access to all 4 AI personas",
              "Unlimited conversations",
              "6 dedicated channels",
              "Decision logging",
              "Data export",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-lg transition-colors"
          >
            Join the Beta
          </Link>
        </div>
      </div>
    </section>
  );
}
