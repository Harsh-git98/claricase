import React from 'react';
import { Navbar } from './landing/Navbar';
import { HeroSection } from './landing/HeroSection';
import { FeaturesSection } from './landing/FeaturesSection';
import { HowItWorksSection } from './landing/HowItWorksSection';
import { TestimonialsSection } from './landing/TestimonialsSection';
import { UseCasesSection } from './landing/UseCasesSection';
import { StatsSection } from './landing/StatsSection';
import { PricingSection } from './landing/PricingSection';
import { TrustSection } from './landing/TrustSection';
import { CTASection } from './landing/CTASection';
import { Footer } from './landing/Footer';
import { GoogleIcon } from './icons/GoogleIcon';
import { LogoIcon } from './icons/LogoIcon';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';
import { useState } from 'react';
interface LoginScreenProps {
  onLogin: () => void;
}
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reprompttserver.onrender.com/lawxora';

 

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
   const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/google`;
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="bg-slate-50 min-h-screen">
       <header className="bg-slate-50/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-slate-200">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex items-center justify-between h-16">
                          <div className="flex-shrink-0">
                               <a href="#" className="flex items-center space-x-2">
                                  <LogoIcon className="w-8 h-8 text-purple-600" />
                                  <span className="text-xl font-bold text-gray-800">ClariCase</span>
                              </a>
                          </div>
                          <div className="md:flex items-center space-x-8">
                              <button
                                 onClick={() => { handleGoogleLogin(); setIsMenuOpen(false); }}
                                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                              >
                                  <GoogleIcon className="w-5 h-5" />
                                  <span>Sign In</span>
                              </button>
                          </div>
                      </div>
                  </div>
                
              </header>
      <main>
        <HeroSection onLogin={onLogin} />
        <FeaturesSection />
        <UseCasesSection />
         <StatsSection />
        {/* <HowItWorksSection /> */}
        <TestimonialsSection />
        <PricingSection onLogin={onLogin} />
        
      </main>
      <Footer />
    </div>
  );
};
