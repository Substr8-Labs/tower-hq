export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Tower",
      description: "Sign up with your email and tell us about your company. Takes 30 seconds.",
      icon: "🏗️",
    },
    {
      number: "02", 
      title: "Meet Your Team",
      description: "Get introduced to Ada (CTO), Grace (CPO), Tony (CMO), and Val (CFO).",
      icon: "👥",
    },
    {
      number: "03",
      title: "Get Strategic Guidance",
      description: "Chat in dedicated channels. Each persona brings deep expertise to your decisions.",
      icon: "💡",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          How It Works
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          From signup to strategic conversation in under a minute
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <span className="text-6xl mb-4 block">{step.icon}</span>
              <span className="text-indigo-400 font-mono text-sm">{step.number}</span>
              <h3 className="text-xl font-semibold text-white mt-2 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
