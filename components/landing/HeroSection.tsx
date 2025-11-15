import React from 'react';

interface HeroSectionProps {
    onLogin: () => void;
}
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reprompttserver.onrender.com/lawxora';

export const HeroSection: React.FC<HeroSectionProps> = ({ onLogin }) => {
    const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/google`;
  };
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28">
            <div className="absolute inset-0 bg-grid-purple-100 [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                        Clarify Your Civil Case
                        <span className="block text-purple-600">with AI-Powered Insight</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg lg:text-xl text-gray-600">
                        Lexora helps you analyze, summarize, and visualize legal documents, transforming complex information into clear, actionable understanding.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleGoogleLogin}
                            className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-purple-700 transition-colors duration-300 shadow-lg shadow-purple-500/30"
                        >
                            Get Started for Free
                        </button>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">No credit card required.</p>
                </div>
            </div>
        </section>
    );
};