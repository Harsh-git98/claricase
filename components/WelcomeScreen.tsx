import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

export const WelcomeScreen: React.FC = () => {
    return (
        <div className="text-center text-slate-500 p-8">
            <LogoIcon className="w-24 h-24 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700">Welcome to ClariCase</h2>
            <p>Select a case from the sidebar to view its details, or create a new case to get started.</p>
        </div>
    );
};
