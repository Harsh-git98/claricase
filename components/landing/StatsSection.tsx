import React, { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

const stats = [
  { value: 10000, label: "Cases Analyzed", description: "Helping people understand complex legal situations" },
  { value: 95, label: "Satisfaction Rate", description: "Users who gained clarity on their cases" },
  { value: 2, label: "Average Response Time (mins)", description: "Get answers to your questions instantly" },
  { value: 24, label: "Always Available (hrs)", description: "Access legal insights whenever you need them" },
];

// Helper to animate counting
const AnimatedNumber = ({ target }: { target: number }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const animation = animate(0, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate(v) {
        setValue(Math.floor(v));
      },
    });

    return () => animation.stop();
  }, [target]);

  return <>{value.toLocaleString()}</>;
};

export const StatsSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-purple-600 to-purple-800 text-white relative overflow-hidden">
      {/* background grid */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold">Trusted by Thousands</h2>
          <p className="mt-3 text-lg text-purple-100">
            Join the community of people who've gained clarity on their legal matters.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-[1.06]"
            >
              {/* animated count */}
              <div className="text-4xl lg:text-5xl font-extrabold mb-3 animate-pulse">
                <AnimatedNumber target={stat.value} />
                {(stat.label.includes("Rate") || stat.label.includes("hrs")) ? "%" : "+"}
              </div>

              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <p className="text-sm text-purple-100">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
