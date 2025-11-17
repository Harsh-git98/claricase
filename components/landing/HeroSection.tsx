import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface HeroSectionProps {
  onLogin: () => void;
}
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://reprompttserver.onrender.com/lawxora";

export const HeroSection: React.FC<HeroSectionProps> = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  // ----- Parallax Motion Values -----
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [10, -10]);
  const rotateY = useTransform(x, [-200, 200], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX);
    y.set(relY);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden pt-36 pb-24 lg:pt-48 lg:pb-32 select-none"
    >
      {/* ---- Background Gradient (Parallax) ---- */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-100"
        style={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      />

      {/* ---- Floating Particles ---- */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-purple-300/40 rounded-full"
            style={{
              width: Math.random() * 6 + 4 + "px",
              height: Math.random() * 6 + 4 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ---- Content Wrapper ---- */}
      <div className="relative container mx-auto px-6 lg:px-12 text-center">

        {/* ---- Heading ---- */}
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 relative inline-block"
        >
          {/* shimmer overlay */}
          <span className="relative z-10 block">
            Clarify Your Civil Case
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              with AI-Powered Insight
            </span>
          </span>

          <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-30 pointer-events-none"></span>
        </motion.h1>

        {/* ---- Subtitle ---- */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-6 max-w-3xl mx-auto text-lg lg:text-xl text-gray-600 leading-relaxed"
        >
          ClariCase helps you analyze, summarize, and visualize legal documents —
          transforming complex information into clear, actionable understanding.
        </motion.p>

        {/* ---- CTA Button ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mt-10 flex justify-center"
        >
          <motion.button
            onClick={handleGoogleLogin}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="relative group bg-purple-600 text-white font-semibold py-3 px-10 rounded-xl text-lg shadow-xl shadow-purple-500/30 hover:bg-purple-700 transition-all"
          >
            <div className="absolute inset-0 rounded-xl bg-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition" />
            Get Started for Free
          </motion.button>
        </motion.div>

        {/* ---- Small Text ---- */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-gray-500"
        >
          No credit card required.
        </motion.p>
      </div>

      {/* ---- Spotlight Hover ---- */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6),transparent_70%)] opacity-0 hover:opacity-100 transition-opacity duration-700"></div>

      {/* ---- Custom Animations ---- */}
      <style>
        {`
          .animate-shimmer {
            animation: shimmerMove 3s infinite linear;
          }

          @keyframes shimmerMove {
            0% { transform: translateX(-200%); }
            100% { transform: translateX(200%); }
          }
        `}
      </style>
    </section>
  );
};
