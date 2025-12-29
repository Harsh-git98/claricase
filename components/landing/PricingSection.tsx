import React from "react";
import { motion } from "framer-motion";

interface PricingSectionProps {
  onLogin: () => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://reprompttserver.onrender.com/lawxora";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "first case",
    description: "Try ClariCase — no credit card required",
    features: [
      "Analyze 1 legal case",
      "AI legal assistant chat",
      "Case summary & key issues",
      "Basic visual mindmap",
      "Email support",
    ],
    cta: "Analyze First Case Free",
    popular: false,
    badge: "For Students & Quick Checks",
  },
  {
    name: "Unlimited",
    price: "$49",
    period: "per month",
    description: "Built for legal teams & ongoing matters",
    features: [
      "Unlimited active cases",
      "Advanced case visualizations",
      "Timeline & argument mapping",
      "Evidence relationship insights",
      "24/7 priority support",
    ],
    cta: "Contact Sales",
    popular: true,
    badge: "Most Popular",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.15 },
  },
};

const card = {
  hidden: { opacity: 0, y: 60, scale: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const PricingSection: React.FC<PricingSectionProps> = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Background Glow */}
      {/* <motion.div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full blur-3xl opacity-35 bg-gradient-to-br from-indigo-500 to-purple-600"
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      /> */}

      <div className="relative container mx-auto px-6 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a plan that fits your legal workflow. Cancel anytime.
          </p>
        </motion.div>

        {/* Plans */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={card}
              whileHover={{ y: -14, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
              className={`relative rounded-2xl p-8 transition-all ${
                plan.popular
                  ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-3xl border-2 border-indigo-300 scale-[1.03]"
                  : "bg-white text-gray-900 shadow-lg border border-gray-200 hover:shadow-2xl"
              }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <motion.span
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-semibold px-4 py-1 rounded-full shadow-xl ${
                    plan.popular
                      ? "bg-white text-indigo-700"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {plan.badge}
                </motion.span>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                  <span
                    className={`text-lg ml-2 ${
                      plan.popular ? "text-indigo-100" : "text-gray-600"
                    }`}
                  >
                    /{plan.period}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    plan.popular ? "text-purple-100" : "text-gray-600"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <svg
                      className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                        plan.popular ? "text-purple-200" : "text-indigo-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                 onClick={() => {
                if (plan.name === "Free Trial") {
                handleGoogleLogin();
                } else {
                window.location.href = 
  "mailto:team@claricase.xyz?subject=Inquiry%20-%20ClariCase%20Professional%20Plan&body=Hello%20ClariCase%20Team,%0D%0A%0D%0AI%20am%20interested%20in%20learning%20more%20about%20the%20Professional%20plan.%20Please%20help%20me%20with%20pricing%20details%20and%20next%20steps.%0D%0A%0D%0AMy%20Details:%0D%0AName:%20%0D%0AOrganization/Law%20Firm:%20%0D%0AUse%20Case:%20(Research,%20Client%20Cases,%20Internal%20Workflows)%0D%0A%0D%0AHow%20soon%20are%20you%20planning%20to%20get%20started?%20(Immediately/This%20Month/Later)%0D%0A%0D%0AThank%20you%2C%0D%0A";
                }
                }}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.05 }}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all ${
                  plan.popular
                    ? "bg-white text-indigo-700 hover:bg-indigo-100 shadow-xl"
                    : "bg-gradient-to-r from-indigo-600 via-purple-700 to-purple-500 text-white hover:bg-indigo-700 shadow-md"
                }`}
              >
                {plan.cta}
              </motion.button>

              {/* Reassurance */}
              <p className="mt-3 text-xs text-center opacity-75">
                Cancel anytime · End-to-end encrypted
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Section */}
        <motion.p
          className="text-center mt-14 text-gray-500 text-sm max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Trusted by legal researchers and attorneys worldwide. GDPR compliant.
          Focus on winning your case, we handle the complexity.
        </motion.p>
      </div>
    </section>
  );
};
