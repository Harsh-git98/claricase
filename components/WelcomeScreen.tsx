import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

type Props = {
    onOpenQuickChat?: () => void;
    onCreateThread?: () => void;
};

export const WelcomeScreen: React.FC<Props> = ({ onOpenQuickChat, onCreateThread }) => {
        return (
                <div className="text-center text-slate-600 p-10 max-w-2xl mx-auto bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-purple-200/40 rounded-3xl">
                        <LogoIcon className="w-24 h-24 text-purple-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-slate-800">Welcome to ClariCase</h2>
                        <p className="mt-2 text-slate-600">Select a case from the sidebar to view its details, or create a new case to get started.</p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                            <button
                                onClick={onOpenQuickChat}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 shadow-md shadow-purple-200/50"
                                aria-label="Open Quick Chat"
                            >
                                Quick Chat
                            </button>

                            <button
                                onClick={onCreateThread}
                                className="px-4 py-2 bg-white/70 border border-white/60 text-slate-700 rounded-md hover:bg-white shadow-md shadow-purple-100/50"
                                aria-label="Create New Case"
                            >
                                Create Case
                            </button>
                        </div>
                </div>
        );
};
