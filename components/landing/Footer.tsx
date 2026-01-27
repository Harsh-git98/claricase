import React from 'react';
import { useState } from 'react';
import { LogoIcon } from '../icons/LogoIcon';
import PrivacyPolicyPopup from './PrivacyPopup';
import TermsOfServicePopup from './TermsOfServicePopup';    
import SecurityPracticesPopup from './SecurityPracticesPopup';
import { motion } from 'framer-motion';

export const Footer: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
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
        <footer className={isDark ? 'bg-slate-900 border-t border-slate-700 pt-8' : 'bg-white border-t border-slate-200 pt-8'}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
                          

                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <LogoIcon className="w-7 h-7 text-purple-400" />
                        <span className={isDark ? 'font-bold text-lg text-slate-100' : 'font-bold text-lg text-gray-900'}>ClariCase</span>
                       
                    </div>
                    
                         
                     <motion.div
                     className={isDark ? 'flex justify-center space-x-8 text-sm text-slate-300' : 'flex justify-center space-x-8 text-sm text-gray-600'}>
 <a 
 onClick={() => setIsPrivacyOpen(true)} 
 className={isDark ? 'hover:text-purple-400 underline cursor-pointer text-center' : 'hover:text-purple-600 underline cursor-pointer text-center'}
 >
 Privacy Policy
 </a>

 <a 
 onClick={() => setIsTermsOpen(true)} 
 className={isDark ? 'hover:text-purple-600 underline cursor-pointer text-center' : 'hover:text-purple-600 underline cursor-pointer text-center'}
 >
 Terms of Service
</a>

 <a 
 onClick={() => setIsSecurityOpen(true)} 
 className={isDark ? 'hover:text-purple-600 underline cursor-pointer text-center' : 'hover:text-purple-600 underline cursor-pointer text-center'}
 >
 About Us
 </a>
 <a href="mailto:support@claricase.xyz" className={isDark ? 'hover:text-purple-600 underline cursor-pointer text-center' : 'hover:text-purple-600 underline cursor-pointer text-center'}
>Support/ Help</a>
</motion.div>
                
                    {isPrivacyOpen && <PrivacyPolicyPopup onClose={closeAllPopups} isDark={isDark} />} 
                    {isTermsOpen && <TermsOfServicePopup onClose={closeAllPopups} isDark={isDark} />}
                    {isSecurityOpen && <SecurityPracticesPopup onClose={closeAllPopups} isDark={isDark} />}
                     
                </div>

                 <p className={isDark ? 'text-sm text-slate-300 mt-6' : 'text-sm text-gray-600 mt-6'}>
                        &copy; {new Date().getFullYear()} ClariCase. All rights reserved.
                    </p>
            </div>
                <p className={isDark ? 'text-xs text-slate-400 mb-2 text-center mt-4' : 'text-xs text-gray-500 mb-2 text-center mt-4'}>
                    Disclaimer: ClariCase is an AI tool for informational purposes only and does not provide legal advice. Consult with a qualified attorney for legal matters.
                </p>
        </footer>
    );
};