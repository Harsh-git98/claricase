import React, { useState } from 'react'; // 1. Import useState
import { motion } from 'framer-motion';
// import { section } from 'framer-motion/m'; // This import is likely unnecessary and incorrect
import PrivacyPolicyPopup from './PrivacyPopup';
import TermsOfServicePopup from './TermsOfServicePopup'; // New Import
import SecurityPracticesPopup from './SecurityPracticesPopup'; // New Import
const trustFeatures = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Bank-Level Encryption",
    description: "Your documents and data are protected with AES-256 encryption, the same standard used by financial institutions."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "GDPR & CCPA Compliant",
    description: "We adhere to strict data protection regulations. Your information is never sold or shared with third parties."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    ),
    title: "Your Data, Your Control",
    description: "Delete your data anytime. We provide full transparency and control over your information."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Confidential AI Processing",
    description: "Our AI models are designed to maintain confidentiality. Your case details remain private and secure."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Regular Security Audits",
    description: "Our platform undergoes regular third-party security audits to ensure the highest standards."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Legal Professional Standards",
    description: "Built with input from legal professionals, following industry best practices for confidentiality."
  }
];

// Animation variants
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const card = {
  hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: -15 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const TrustSection: React.FC = () => {
  // 2. Implement state to control the popup visibility
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isSecurityOpen, setIsSecurityOpen] = useState(false);

    // Handlers
    const closeAllPopups = () => {
        setIsPrivacyOpen(false);
        setIsTermsOpen(false);
        setIsSecurityOpen(false);
    };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
      {/* Massive animated gradient blob */}
      <motion.div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1400px] h-[900px] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-purple-400 to-purple-700"
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Soft grid overlay */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[repeating-linear-gradient(0deg,#0000000a_0px,#0000000a_14px,transparent_14px,transparent_15px)]" />

      <div className="relative container mx-auto px-6 lg:px-12">
        {/* Heading with heavy animation */}
{/*         <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}   
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-6 shadow-lg"
            initial={{ scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          >
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Your Privacy & Security Matter
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We understand the sensitive nature of legal matters. That's why security and privacy are at the core of everything we do.
          </p>
        </motion.div> */}

        {/* Grid with heavy entry animations */}
{/*         <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {trustFeatures.map((feature, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={{ y: -10, scale: 1.03, rotateX: 2 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="p-8 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 shadow-md hover:shadow-xl backdrop-blur-sm"
            >
              <div className="text-purple-600 mb-6 transform-gpu">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  {feature.icon}
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div> */}

        {/* Disclaimer block with entry zoom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-10 lg:p-14 border border-purple-100 shadow-lg"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Not Legal Advice
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              ClariCase is an AI-powered tool designed to help you <span className="font-semibold text-purple-600">understand and organize</span> information
              about your civil case. While we provide insights and analysis,
              <span className="font-semibold"> ClariCase does not provide legal advice</span>. Please consult a qualified attorney.
            </p>

            <motion.div
              className="mt-8 flex justify-center space-x-8 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* 4. Attach the openPolicy function to the Privacy Policy link */}
              {/* Privacy Policy Link */}
              <a 
                onClick={() => setIsPrivacyOpen(true)} 
                className="hover:text-purple-600 underline cursor-pointer"
              >
                Privacy Policy
              </a>
              
              {/* Terms of Service Link */}
              <a 
                onClick={() => setIsTermsOpen(true)} 
                className="hover:text-purple-600 underline cursor-pointer"
              >
                Terms of Service
              </a>
              
              {/* Security Practices Link */}
              <a 
                onClick={() => setIsSecurityOpen(true)} 
                className="hover:text-purple-600 underline cursor-pointer"
              >
                Security Practices
              </a>
             </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Conditional Rendering of Popups */}
      {isPrivacyOpen && <PrivacyPolicyPopup onClose={closeAllPopups} />} 
      {isTermsOpen && <TermsOfServicePopup onClose={closeAllPopups} />}
      {isSecurityOpen && <SecurityPracticesPopup onClose={closeAllPopups} />}
 </section>
  );
}