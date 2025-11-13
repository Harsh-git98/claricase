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

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar onLogin={onLogin} />
      <main>
        <HeroSection onLogin={onLogin} />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <UseCasesSection />
        <StatsSection />
        <PricingSection onLogin={onLogin} />
        <TrustSection />
        <CTASection onLogin={onLogin} />
      </main>
      <Footer />
    </div>
  );
};
