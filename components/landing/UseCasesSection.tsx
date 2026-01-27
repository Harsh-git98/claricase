import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const useCases = [
  {
    id: 'contract',
    title: 'Contract Disputes',
    description:
      "Navigate breach of contract cases with confidence. Understand your obligations, identify violations, and explore your options.",
    icon: '📄',
    benefits: ['Identify key clauses', 'Understand breaches', 'Assess damages'],
    details:
      'Upload your contract and let ClariCase highlight risky clauses, suggest remediation steps, and produce a concise summary you can use in negotiation or court.'
  },
  {
    id: 'property',
    title: 'Property & Landlord Issues',
    description:
      "Resolve tenant disputes, property damage claims, and lease violations with clear, actionable insights.",
    icon: '🏠',
    benefits: ['Lease analysis', 'Damage assessment', 'Rights clarification'],
    details:
      'Extract timelines, notice requirements, and likely remedies. Generate a printable summary and a landlord/tenant timeline for hearings.'
  },
  {
    id: 'smallclaims',
    title: 'Small Claims Court',
    description:
      "Prepare for small claims with organized evidence, clear timelines, and winning arguments.",
    icon: '⚖️',
    benefits: ['Evidence organization', 'Timeline creation', 'Argument building'],
    details:
      "We help you prioritize evidence, build a tight timeline, and draft short, persuasive statements for the bench." 
  },
  {
    id: 'employment',
    title: 'Employment Disputes',
    description:
      "Understand wrongful termination, discrimination claims, and wage disputes with comprehensive analysis.",
    icon: '💼',
    benefits: ['Rights analysis', 'Documentation review', 'Next steps guidance'],
    details:
      'Automatically detect contract terms, company policies referenced in your documents, and generate a clear action checklist.'
  }
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] } },
};

export const UseCasesSection: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  const [active, setActive] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);

  return (
    <section className={isDark ? 'relative py-20 lg:py-28 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden' : 'relative py-20 lg:py-28 bg-white overflow-hidden'}>
      {/* decorative rotating gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full blur-3xl opacity-30"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#60a5fa)' }}
      />

      <div className="relative container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className={isDark ? 'text-3xl lg:text-4xl font-extrabold text-slate-100' : 'text-3xl lg:text-4xl font-extrabold text-gray-900'}>Clarity for Every Civil Case</h2>
          <p className={isDark ? 'mt-3 text-lg text-slate-300 max-w-2xl mx-auto' : 'mt-3 text-lg text-gray-600 max-w-2xl mx-auto'}>Whether you're facing a contract dispute or a property issue, ClariCase provides the insights you need.</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {useCases.map((u, i) => (
            <motion.button
              key={u.id}
              onClick={() => setActive(u.id)}
              className={isDark ? 'relative text-left bg-slate-800 p-6 rounded-2xl shadow-lg border border-transparent hover:shadow-2xl transition-transform duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-700' : 'relative text-left bg-white p-6 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-transform duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-200'}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.995 }}
              aria-haspopup="dialog"
              aria-expanded={active === u.id}
            >
              {/* floating emoji badge */}
              {/* <div className="absolute -top-6 left-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 text-white flex items-center justify-center text-2xl shadow-md">
                <span aria-hidden>{u.icon}</span>
              </div> */}

              <div className="ml-8">
                <h3 className={isDark ? 'text-2xl font-semibold text-slate-100' : 'text-2xl font-semibold text-gray-900'}>{u.title}</h3>
                <p className={isDark ? 'mt-2 text-slate-300' : 'mt-2 text-gray-600'}>{u.description}</p>

                <ul className="mt-4 flex flex-wrap gap-3">
                  {u.benefits.map((b, idx) => (
                    <li key={idx} className="inline-flex items-center bg-purple-300 text-purple-900 text-sm px-3 py-1 rounded-full shadow-sm">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>

                {/* <div className="mt-6">
                  <span className="inline-flex items-center text-sm font-medium text-purple-600 hover:underline">Explore details →</span>
                </div> */}
              </div>

              {/* corner decorative */}
              <div className="absolute -right-6 bottom-6 w-28 h-28 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#7c3aed,transparent 40%)' }} />
            </motion.button>
          ))}
        </motion.div>

        {/* Modal / heavy popup */}
        <AnimatePresence>
          {active && (
            <Modal onClose={() => setActive(null)} isDark={isDark}>
              <ModalContent useCase={useCases.find((x) => x.id === active)!} prefersReduced={prefersReduced} isDark={isDark} />
            </Modal>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .motion-safe\:animate-fade { animation: none; }
        }
      `}</style>
    </section>
  );
}

function Modal({ children, onClose, isDark }: { children: React.ReactNode; onClose: () => void; isDark?: boolean }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const prev = document.activeElement as HTMLElement | null;
    // focus close button on open
    setTimeout(() => closeButtonRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop */}
      <motion.div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
    className={isDark ? 'relative z-10 max-w-3xl w-full bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden' : 'relative z-10 max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden'}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } }}
        exit={{ opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.25 } }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div />
              <button
              ref={closeButtonRef}
              onClick={onClose}
              className={isDark ? 'inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-300 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-700' : 'inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-200'}
              aria-label="Close"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModalContent({ useCase, prefersReduced, isDark }: { useCase: (typeof useCases)[0]; prefersReduced: boolean; isDark?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 text-white flex items-center justify-center text-3xl shadow-md">{useCase.icon}</div>
        <h3 className={isDark ? 'mt-6 text-2xl font-bold text-slate-100' : 'mt-6 text-2xl font-bold text-gray-900'}>{useCase.title}</h3>
        <p className={isDark ? 'mt-3 text-slate-300' : 'mt-3 text-gray-600'}>{useCase.details}</p>

        <ul className="mt-6 space-y-3">
          {useCase.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className={isDark ? 'mt-1 w-6 h-6 rounded-full bg-purple-800 text-purple-300 flex items-center justify-center text-sm' : 'mt-1 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm'}>✓</div>
              <div className={isDark ? 'text-slate-200' : 'text-slate-700'}>{b}</div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-4">
          <button className="inline-flex items-center px-5 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition">Start this use case</button>
          <button className={isDark ? 'text-sm text-slate-300 underline' : 'text-sm text-gray-600 underline'}>See example report</button>
        </div>
      </div>

      <div className={isDark ? 'bg-slate-800 rounded-xl p-4' : 'bg-slate-50 rounded-xl p-4'}>
        <h4 className={isDark ? 'text-sm font-semibold text-slate-200' : 'text-sm font-semibold text-gray-900'}>Live preview</h4>
        <div className={isDark ? 'mt-3 border border-slate-700 rounded-lg bg-slate-800 p-4 shadow-sm' : 'mt-3 border border-slate-200 rounded-lg bg-white p-4 shadow-sm'}>
          <p className={isDark ? 'text-sm text-slate-300' : 'text-sm text-gray-600'}>This preview simulates how we transform your documents into a concise summary, highlight risky clauses, and suggest important dates to track for hearings.</p>

          <div className="mt-4 space-y-3">
            <div className="p-3 rounded-md bg-gradient-to-r from-purple-900 to-slate-800 border-l-4 border-purple-700">
              <div className="text-xs text-purple-300 font-medium">Key Clause</div>
              <div className="text-sm text-slate-100 mt-1">"Payment due within 30 days" — flagged because it conflicts with the later amendment.</div>
            </div>

            <div className="p-3 rounded-md bg-gradient-to-r from-purple-900 to-slate-800 border-l-4 border-purple-700">
              <div className="text-xs text-purple-300 font-medium">Suggested Next Step</div>
              <div className="text-sm text-slate-100 mt-1">Send a written notice citing clause 4.2 and request remediation within 14 days.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
