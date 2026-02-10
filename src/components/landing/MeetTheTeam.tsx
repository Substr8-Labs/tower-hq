export function MeetTheTeam() {
  const personas = [
    {
      name: "Ada",
      role: "CTO",
      icon: "🧠",
      color: "bg-green-500",
      borderColor: "border-green-500/30",
      description: "Technical architecture, engineering decisions, code reviews, infrastructure strategy.",
    },
    {
      name: "Grace",
      role: "CPO",
      icon: "🎯",
      color: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      description: "Product strategy, feature prioritization, user research, roadmap planning.",
    },
    {
      name: "Tony",
      role: "CMO",
      icon: "📣",
      color: "bg-pink-500",
      borderColor: "border-pink-500/30",
      description: "Marketing strategy, growth tactics, messaging, go-to-market execution.",
    },
    {
      name: "Val",
      role: "CFO",
      icon: "📊",
      color: "bg-red-500",
      borderColor: "border-red-500/30",
      description: "Financial modeling, pricing strategy, runway planning, business metrics.",
    },
  ];

  return (
    <section id="team" className="py-24 px-6 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Meet Your Executive Team
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Four AI personas, each with deep expertise in their domain
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona) => (
            <div
              key={persona.name}
              className={`p-6 rounded-xl bg-gray-900/50 border ${persona.borderColor} hover:bg-gray-900/70 transition-colors`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${persona.color} rounded-full flex items-center justify-center text-2xl`}>
                  {persona.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{persona.name}</h3>
                  <p className="text-sm text-gray-400">{persona.role}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {persona.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
