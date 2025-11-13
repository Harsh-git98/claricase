import React from 'react';

const useCases = [
  {
    title: "Contract Disputes",
    description: "Navigate breach of contract cases with confidence. Understand your obligations, identify violations, and explore your options.",
    icon: "📄",
    benefits: ["Identify key clauses", "Understand breaches", "Assess damages"]
  },
  {
    title: "Property & Landlord Issues",
    description: "Resolve tenant disputes, property damage claims, and lease violations with clear, actionable insights.",
    icon: "🏠",
    benefits: ["Lease analysis", "Damage assessment", "Rights clarification"]
  },
  {
    title: "Small Claims Court",
    description: "Prepare for small claims with organized evidence, clear timelines, and winning arguments.",
    icon: "⚖️",
    benefits: ["Evidence organization", "Timeline creation", "Argument building"]
  },
  {
    title: "Employment Disputes",
    description: "Understand wrongful termination, discrimination claims, and wage disputes with comprehensive analysis.",
    icon: "💼",
    benefits: ["Rights analysis", "Documentation review", "Next steps guidance"]
  }
];

export const UseCasesSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Clarity for Every Civil Case</h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're facing a contract dispute or a property issue, Lexora provides the insights you need.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {useCase.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
