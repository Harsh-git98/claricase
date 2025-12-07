import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureItem {
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const features: FeatureItem[] = [
  {
    name: 'AI-Powered Chat',
    description:
      'Ask questions about your case in plain English and get instant, context-aware answers.',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Instant Case Summary',
    description:
      'Automatically generate structured summaries highlighting key facts, legal issues, and evidence.',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M8 6h9M8 10h9M8 14h5M4 6h.01M4 18h16V8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Visual Mind Maps',
    description:
      'Understand complex relationships between parties, evidence, and events with interactive graphs.',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 3v6M12 15v6M5 8l6 4 6-4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Secure Document Analysis',
    description:
      'Upload your case documents with confidence. We prioritize your privacy and data security.',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth={1.6} />
        <path d="M7 7V5a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// animation variants for framer-motion
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] } },
  tap: { scale: 0.995 },
};

export const FeaturesSection: React.FC = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Decorative animated gradient */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg,#7c3aed, #6d28d9 40%, #4f46e5)',
          mixBlendMode: 'overlay',
          animation: 'bgRotate 12s linear infinite',
        }}
      />

      {/* subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[repeating-linear-gradient(0deg,#ffffff00_0px,#ffffff00_14px,#00000002_14px,#00000002_15px)]" />

      <div className="relative container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">Why Choose ClariCase?</h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">Everything you need to gain clarity on your legal case, now with immersive visual cues and micro-interactions for faster comprehension.</p>
        </div>

        {/* Features grid - motion container */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {features.map((f, idx) => (
            <FeatureCard key={f.name} feature={f} index={idx} />
          ))}
        </motion.div>

        {/* connecting SVG lines (decorative) */}
        <svg className="absolute left-0 bottom-8 w-full h-40 pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d="M0,30 Q25,0 50,30 T100,30" stroke="url(#g1)" strokeWidth="1.5" fill="none" opacity="0.35" />
        </svg>
      </div>

      {/* styles */}
      <style>{`
        @keyframes bgRotate { 0% { transform: rotate(0deg);} 50% { transform: rotate(180deg);} 100% { transform: rotate(360deg);} }
        .card-tilt { will-change: transform; transform-style: preserve-3d; }
        .card-glow { transition: box-shadow .25s ease; }
        @media (prefers-reduced-motion: reduce) { .card-tilt, .card-glow { transition: none !important; } }
      `}</style>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: FeatureItem; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)' });
  const [isHover, setIsHover] = useState(false);

  // pointer tilt effect
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId: number | null = null;
    function handleMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 12; // degrees
      const rotateX = -(py - 0.5) * 10; // degrees
      const scale = isHover ? 1.015 : 1;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setStyle({ transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})` });
      });
    }
    function handleLeave() {
      if (rafId) cancelAnimationFrame(rafId);
      setStyle({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)' });
      setIsHover(false);
    }
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseenter', () => setIsHover(true));
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseenter', () => setIsHover(true));
      el.removeEventListener('mouseleave', handleLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isHover]);

  // motion entrance delay based on index
  const delay = 0.12 * index;

  return (
    <motion.div
      ref={ref}
      className={`card-tilt card-glow relative p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-md hover:shadow-2xl border border-transparent`}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      whileTap="tap"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
      style={{ ...style, transition: 'transform 350ms cubic-bezier(.2,.9,.2,1), box-shadow 250ms ease' }}
    >
      {/* floating icon with ring */}
      <div className="absolute -top-6 left-6 w-14 h-14 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center shadow-sm" style={{ transform: 'translateZ(40px)' }}>
        <motion.div
          className="w-9 h-9 text-purple-600"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <feature.icon className="w-9 h-9" />
        </motion.div>
      </div>

      {/* subtle decorative corner */}
      <div className="absolute -bottom-6 right-6 w-24 h-24 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle,#7c3aed,transparent 40%)' }} />

      <h3 className="mt-4 text-lg font-semibold text-gray-900 ml-2">{feature.name}</h3>
      <p className="mt-3 text-sm text-gray-600 ml-2">{feature.description}</p>

      {/* CTA micro-interaction */}
      {/* <div className="mt-5 ml-2">
        <motion.button
          whileHover={{ x: 6 }}
          className="inline-flex items-center text-sm font-medium text-purple-600"
        >
          Learn more
          <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div> */}

    </motion.div>
  );
}
