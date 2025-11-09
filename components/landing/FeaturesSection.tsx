import React from 'react';
import { ChatBubbleIcon } from '../icons/ChatBubbleIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { LockClosedIcon } from '../icons/LockClosedIcon';

const features = [
    {
        name: 'AI-Powered Chat',
        description: 'Ask questions about your case in plain English and get instant, context-aware answers.',
        icon: ChatBubbleIcon,
    },
    {
        name: 'Instant Case Summary',
        description: 'Automatically generate structured summaries highlighting key facts, legal issues, and evidence.',
        icon: DocumentTextIcon,
    },
    {
        name: 'Visual Mind Maps',
        description: 'Understand complex relationships between parties, evidence, and events with interactive graphs.',
        icon: ShareIcon,
    },
    {
        name: 'Secure Document Analysis',
        description: 'Upload your case documents with confidence. We prioritize your privacy and data security.',
        icon: LockClosedIcon,
    },
];

export const FeaturesSection: React.FC = () => {
    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Why Choose Lexora?</h2>
                    <p className="mt-3 text-lg text-gray-600">Everything you need to gain clarity on your legal case.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.name} className="text-center p-6 bg-slate-50 rounded-xl shadow-sm">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                                <feature.icon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-gray-900">{feature.name}</h3>
                            <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};