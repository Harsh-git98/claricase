import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

type Props = {
    onOpenQuickChat?: () => void;
    onCreateThread?: () => void;
};

export const WelcomeScreen: React.FC<Props> = ({ onOpenQuickChat, onCreateThread }) => {
        return (
                <div className="text-center text-slate-500 p-8">
                        <LogoIcon className="w-24 h-24 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-700">Welcome to ClariCase</h2>
                        <p>Select a case from the sidebar to view its details, or create a new case to get started.</p>

                        <div className="mt-6 flex items-center justify-center gap-4">
                            <button
                                onClick={onOpenQuickChat}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                aria-label="Open Quick Chat"
                            >
                                Quick Chat
                            </button>

                            <button
                                onClick={onCreateThread}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
                                aria-label="Create New Case"
                            >
                                Create Case
                            </button>
                        </div>
                </div>
        );
};
