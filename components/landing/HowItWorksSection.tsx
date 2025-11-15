import React from "react";
import { motion } from "framer-motion";

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background gradient blob */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(79,70,229,0.5))",
          animation: "rotateBlob 14s linear infinite",
        }}
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[repeating-linear-gradient(0deg,#00000005_0px,#00000005_14px,transparent_14px,transparent_15px)]" />

      <div className="relative container mx-auto px-6 lg:px-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
            Get Started in Minutes
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            A simple, three-step process to clarity.
          </p>
        </motion.div>

        {/* Line behind steps */}
        <div className="absolute top-[52%] left-0 w-full h-[2px] bg-slate-200 hidden md:block" />

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-14 lg:gap-20">
          {[1, 2, 3].map((n, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.15 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center relative"
            >
              {/* Animated step number */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 4 }}
                transition={{ type: "spring", stiffness: 180, damping: 12 }}
                className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-purple-100 text-purple-700 font-bold text-3xl border-4 border-white shadow-md relative z-10"
              >
                {n}
              </motion.div>

              {/* Glowing pulse */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-purple-300/20 blur-2xl animate-pulse" />

              {/* Text */}
              <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                {i === 0 && "Create Your Case"}
                {i === 1 && "Upload & Interact"}
                {i === 2 && "Analyze & Understand"}
              </h3>
              <p className="mt-3 text-gray-600 text-base max-w-xs mx-auto">
                {i === 0 &&
                  "Sign up securely and start a new case thread. Your first case is on us."}
                {i === 1 &&
                  "Upload documents, images, or simply chat with ClariCase about the details of your case."}
                {i === 2 &&
                  "Receive instant summaries and visual mind maps to see your case from every angle."}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rotateBlob {
          0% { transform: translateX(-50%) rotate(0deg); }
          50% { transform: translateX(-50%) rotate(180deg); }
          100% { transform: translateX(-50%) rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
