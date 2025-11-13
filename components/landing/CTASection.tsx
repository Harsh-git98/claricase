import React from 'react';

interface CTASectionProps {
  onLogin: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onLogin }) => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-purple-100/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-12 lg:p-16 shadow-2xl text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 animate-fade-in">
                Ready to Understand Your Case?
              </h2>
              <p className="text-lg lg:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands who've gained clarity on their legal matters. Your first case analysis is completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={onLogin}
                  className="bg-white text-purple-600 font-bold py-4 px-10 rounded-lg text-lg hover:bg-purple-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Start Your Free Case Analysis
                </button>
                <a
                  href="#how-it-works"
                  className="text-white font-semibold py-4 px-8 rounded-lg text-lg border-2 border-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                >
                  Learn More
                </a>
              </div>
              <p className="mt-6 text-sm text-purple-100">
                No credit card required • Takes less than 2 minutes • Cancel anytime
              </p>
              <div className="mt-8 flex justify-center space-x-8 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Bank-level encryption
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  GDPR Compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
