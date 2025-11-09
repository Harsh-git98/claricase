import React from 'react';

export const HowItWorksSection: React.FC = () => {
    return (
        <section className="py-20 lg:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Get Started in Minutes</h2>
                    <p className="mt-3 text-lg text-gray-600">A simple, three-step process to clarity.</p>
                </div>
                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 hidden md:block" aria-hidden="true"></div>
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-purple-100 text-purple-700 font-bold text-2xl rounded-full border-4 border-slate-50 mb-4">1</div>
                            <h3 className="text-xl font-semibold mb-2">Create Your Case</h3>
                            <p className="text-gray-600">Sign up securely and start a new case thread. Your first case is on us.</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-purple-100 text-purple-700 font-bold text-2xl rounded-full border-4 border-slate-50 mb-4">2</div>
                            <h3 className="text-xl font-semibold mb-2">Upload & Interact</h3>
                            <p className="text-gray-600">Upload documents, images, or simply chat with Lexora about the details of your case.</p>
                        </div>
                        <div className="text-center">
                             <div className="flex items-center justify-center w-16 h-16 mx-auto bg-purple-100 text-purple-700 font-bold text-2xl rounded-full border-4 border-slate-50 mb-4">3</div>
                            <h3 className="text-xl font-semibold mb-2">Analyze & Understand</h3>
                            <p className="text-gray-600">Receive instant summaries and visual mind maps to see your case from every angle.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};