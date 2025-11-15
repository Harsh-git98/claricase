import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote:
      'ClariCase transformed how I understand my case. What used to take me days to comprehend, I now grasp in minutes.',
    author: 'Sarah Mitchell',
    role: 'Small Business Owner',
    avatar: 'SM',
  },
  {
    quote:
      'The visual mind maps helped me see connections I never would have noticed. It\'s like having a legal assistant 24/7.',
    author: 'David Chen',
    role: 'Property Dispute Case',
    avatar: 'DC',
  },
  {
    quote:
      'Finally, a tool that speaks plain English. No confusing legal jargon — just clear answers when I need them.',
    author: 'Maria Garcia',
    role: 'Contract Dispute',
    avatar: 'MG',
  },
];

// Motion variants
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18, delayChildren: 0.15 },
  },
};

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      {/* Gradient lighting */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[650px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
          animation: 'lightPulse 10s ease-in-out infinite',
        }}
      />

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(#0001_1px,transparent_1px),linear-gradient(90deg,#0001_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative container mx-auto px-6 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
            Trusted by People Like You
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            See how ClariCase has helped others gain clarity and confidence.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              className="relative bg-white p-10 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl backdrop-blur-sm"
            >
              {/* subtle glow */}
              <div className="absolute -top-6 right-6 w-20 h-20 bg-purple-400/20 rounded-full blur-2xl" />

              {/* avatar */}
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-base shadow-md">
                  {t.avatar}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 text-lg">{t.author}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>

              {/* quote */}
              <p className="text-gray-700 leading-relaxed italic relative z-10">
                “{t.quote}”
              </p>

              {/* stars */}
              <motion.div
                className="mt-6 flex text-purple-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {[...Array(5)].map((_, i2) => (
                  <svg key={i2} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes lightPulse {
          0%, 100% { opacity: 0.2; transform: rotate(0deg); }
          50% { opacity: 0.4; transform: rotate(180deg); }
        }
      `}</style>
    </section>
  );
}