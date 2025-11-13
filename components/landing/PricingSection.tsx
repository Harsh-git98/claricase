import React from 'react';

interface PricingSectionProps {
  onLogin: () => void;
}

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "first case",
    description: "Perfect for trying out Lexora",
    features: [
      "1 case analysis",
      "AI-powered chat",
      "Case summary generation",
      "Basic mind maps",
      "Email support"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Essential",
    price: "$29",
    period: "per case",
    description: "Ideal for single case clarity",
    features: [
      "Unlimited chat questions",
      "Advanced case summaries",
      "Interactive mind maps",
      "Document analysis (up to 50 pages)",
      "Priority email support",
      "Export to PDF"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "For multiple cases or ongoing matters",
    features: [
      "Up to 5 active cases",
      "Everything in Essential",
      "Unlimited document analysis",
      "Advanced visualizations",
      "Timeline generation",
      "24/7 priority support",
      "API access"
    ],
    cta: "Go Professional",
    popular: false
  }
];

export const PricingSection: React.FC<PricingSectionProps> = ({ onLogin }) => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
          <p className="mt-3 text-lg text-gray-600">Choose the plan that fits your needs. No hidden fees.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-2xl scale-105 border-4 border-purple-400' 
                  : 'bg-slate-50 text-gray-900 shadow-lg hover:shadow-xl border border-slate-200'
              } transition-all duration-300 hover:-translate-y-2`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className={`text-lg ml-2 ${plan.popular ? 'text-purple-100' : 'text-gray-500'}`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`text-sm ${plan.popular ? 'text-purple-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg 
                      className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-purple-200' : 'text-purple-600'
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onLogin}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-white text-purple-600 hover:bg-purple-50 shadow-lg'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        <p className="text-center mt-12 text-gray-500 text-sm">
          All plans include secure document storage and end-to-end encryption
        </p>
      </div>
    </section>
  );
};
