import React from 'react';
import { motion } from 'framer-motion';

interface PricingSectionProps {
  onLogin: () => void;
}
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reprompttserver.onrender.com/lawxora';

const plans = [ { name: "Free Trial", price: "$0", period: "first case", description: "Perfect for trying out ClariCase", features: [ "1 case analysis", "AI-powered chat", "Case summary generation", "Basic mind maps", "Email support" ], cta: "Start Free Trial", popular: false }, { name: "Essential", price: "$29", period: "per case", description: "Ideal for single case clarity", features: [ "Unlimited chat questions", "Advanced case summaries", "Interactive mind maps", "Document analysis (up to 50 pages)", "Priority email support", "Export to PDF" ], cta: "Get Started", popular: true }, { name: "Professional", price: "$99", period: "per month", description: "For multiple cases or ongoing matters", features: [ "Up to 5 active cases", "Everything in Essential", "Unlimited document analysis", "Advanced visualizations", "Timeline generation", "24/7 priority support", "API access" ], cta: "Go Professional", popular: false } ];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.16, delayChildren: 0.2 },
  },
};

const card = {
  hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: -10 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const PricingSection: React.FC<PricingSectionProps> = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <section className="relative py-4 overflow-hidden bg-white">
      {/* animated massive blob */}
      <motion.div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full blur-3xl opacity-40 bg-gradient-to-br from-purple-500 to-indigo-500"
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative container mx-auto px-6 lg:px-12">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Choose the plan that fits your needs. No hidden fees.</p>
        </motion.div>

        {/* pricing cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={card}
              whileHover={{ y: -12, scale: 1.05, rotateX: 3 }}
              transition={{ type: 'spring', stiffness: 160, damping: 18 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-2xl scale-105 border-4 border-purple-400'
                  : 'bg-slate-50 text-gray-900 shadow-lg hover:shadow-2xl border border-slate-200'
              }`}
            >
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold px-4 py-1 rounded-full shadow-xl">
                    MOST POPULAR
                  </span>
                </motion.div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className={`text-lg ml-2 ${plan.popular ? 'text-purple-100' : 'text-gray-500'}`}>/{plan.period}</span>
                </div>
                <p className={`text-sm ${plan.popular ? 'text-purple-100' : 'text-gray-600'}`}>{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <svg
                      className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-purple-200' : 'text-purple-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={`text-sm ${plan.popular ? 'text-white' : 'text-gray-700'}`}>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                onClick={handleGoogleLogin}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.04 }}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
                  plan.popular
                    ? 'bg-white text-purple-600 hover:bg-purple-50 shadow-lg'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center mt-12 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          All plans include secure document storage and end-to-end encryption
        </motion.p>
      </div>
    </section>
  );
}
