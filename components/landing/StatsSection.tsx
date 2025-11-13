import React from 'react';

const stats = [
  {
    value: "10,000+",
    label: "Cases Analyzed",
    description: "Helping people understand complex legal situations"
  },
  {
    value: "95%",
    label: "Satisfaction Rate",
    description: "Users who gained clarity on their cases"
  },
  {
    value: "2 mins",
    label: "Average Response Time",
    description: "Get answers to your questions instantly"
  },
  {
    value: "24/7",
    label: "Always Available",
    description: "Access legal insights whenever you need them"
  }
];

export const StatsSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-purple-600 to-purple-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold">Trusted by Thousands</h2>
          <p className="mt-3 text-lg text-purple-100">
            Join the community of people who've gained clarity on their legal matters.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl lg:text-5xl font-bold mb-2 animate-pulse-glow">
                {stat.value}
              </div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <p className="text-sm text-purple-100">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
