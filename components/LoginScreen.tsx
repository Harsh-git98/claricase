import React from 'react';
import { Navbar } from './landing/Navbar';
import { HeroSection } from './landing/HeroSection';
import { FeaturesSection } from './landing/FeaturesSection';
import { HowItWorksSection } from './landing/HowItWorksSection';
import { TestimonialsSection } from './landing/TestimonialsSection';
import { UseCasesSection } from './landing/UseCasesSection';
import { StatsSection } from './landing/StatsSection';
import { PricingSection } from './landing/PricingSection';

import { Footer } from './landing/Footer';
import { useState, useEffect } from 'react';
// icons not required here; Navbar contains header actions
import { QuickchatWidget } from './QuickchatWidget';
interface LoginScreenProps {
  onLogin: () => void;
}
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reprompttserver.onrender.com/lawxora';

 

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
   const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('landingTheme') !== 'light';
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('landingTheme', isDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } catch (e) {}
  }, [isDark]);

  return (
    <div className={isDark ? 'bg-slate-900 min-h-screen' : 'bg-slate-50 min-h-screen'}>
      <Navbar onLogin={handleGoogleLogin} isDark={isDark} onToggleTheme={() => setIsDark(prev => !prev)} />
      <main>
        <HeroSection onLogin={onLogin} isDark={isDark} />
        <FeaturesSection isDark={isDark} />
        <UseCasesSection isDark={isDark} />
         <StatsSection isDark={isDark} />
        {/* <HowItWorksSection /> */}
        <TestimonialsSection isDark={isDark} />
        <PricingSection onLogin={onLogin} isDark={isDark} />
      </main>
      <Footer isDark={isDark} />
      <QuickchatWidget />
    </div>
  );
};
