import React, { useState } from 'react';
import { LogoIcon } from '../icons/LogoIcon';
import { GoogleIcon } from '../icons/GoogleIcon';
import { MenuIcon } from '../icons/MenuIcon';
import { XIcon } from '../icons/XIcon';

interface NavbarProps {
    onLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogin }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-slate-50/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-slate-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                         <a href="#" className="flex items-center space-x-2">
                            <LogoIcon className="w-8 h-8 text-purple-600" />
                            <span className="text-xl font-bold text-gray-800">ClariCase</span>
                        </a>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={onLogin}
                            className="flex items-center justify-center space-x-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        >
                            <GoogleIcon className="w-5 h-5" />
                            <span>Sign In</span>
                        </button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-slate-100">
                            {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-50 border-t border-slate-200">
                    <div className="px-4 pt-2 pb-4">
                        <button
                            onClick={() => { onLogin(); setIsMenuOpen(false); }}
                            className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        >
                            <GoogleIcon className="w-5 h-5" />
                            <span>Sign in with Google</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};