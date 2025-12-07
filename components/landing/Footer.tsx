import React from 'react';
import { useState } from 'react';
import { LogoIcon } from '../icons/LogoIcon';
import PrivacyPolicyPopup from './PrivacyPopup';
import TermsOfServicePopup from './TermsOfServicePopup';    
import SecurityPracticesPopup from './SecurityPracticesPopup';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
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
        <footer className="bg-white border-t border-slate-200 pt-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <LogoIcon className="w-7 h-7 text-purple-600" />
                        <span className="font-bold text-lg">ClariCase</span>
                        <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} ClariCase. All rights reserved.
                    </p>
                    </div>
                         
                    <motion.div
 className="flex justify-center space-x-8 text-sm text-gray-600"
 initial={{ opacity: 0 }}
whileInView={{ opacity: 1 }}
 transition={{ delay: 0.4 }}
 >
 <a 
                onClick={() => setIsPrivacyOpen(true)} 
                className="hover:text-purple-600 underline cursor-pointer text-center"
              >
                Privacy Policy
 </a>

 <a 
                onClick={() => setIsTermsOpen(true)} 
                className="hover:text-purple-600 underline cursor-pointer text-center"
              >
                Terms of Service
</a>

 <a 
                onClick={() => setIsSecurityOpen(true)} 
                className="hover:text-purple-600 underline cursor-pointer text-center"
              >
                Security Practices
 </a>
</motion.div>
                
                    {isPrivacyOpen && <PrivacyPolicyPopup onClose={closeAllPopups} />} 
                     {isTermsOpen && <TermsOfServicePopup onClose={closeAllPopups} />}
                     {isSecurityOpen && <SecurityPracticesPopup onClose={closeAllPopups} />}
                     
                </div>
            </div>
                <p className="text-xs text-gray-400 mb-2 text-center mt-4">
                    Disclaimer: ClariCase is an AI tool for informational purposes only and does not provide legal advice. Consult with a qualified attorney for legal matters.
                </p>
        </footer>
    );
};