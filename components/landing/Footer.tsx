import React from 'react';
import { LogoIcon } from '../icons/LogoIcon';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-slate-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <LogoIcon className="w-7 h-7 text-purple-600" />
                        <span className="font-bold text-lg">ClariCase</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} ClariCase. All rights reserved.
                    </p>
                </div>
            </div>
                <p className="text-xs text-gray-400 mb-2 text-center">
                    Disclaimer: ClariCase is an AI tool for informational purposes only and does not provide legal advice. Consult with a qualified attorney for legal matters.
                </p>
        </footer>
    );
};