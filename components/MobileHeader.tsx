import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { MenuIcon } from './icons/MenuIcon';

type MobileView = 'chat' | 'summary' | 'mindmap';

interface MobileHeaderProps {
  onToggleSidebar: () => void;
  activeView: MobileView;
  setActiveView: (view: MobileView) => void;
  hasActiveThread: boolean;
  onOpenNotes?: () => void;
}

const TabButton: React.FC<{
  label: string;
  view: MobileView;
  activeView: MobileView;
  onClick: (view: MobileView) => void;
}> = ({ label, view, activeView, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
      activeView === view
        ? 'text-purple-600 border-purple-600'
        : 'text-slate-500 border-transparent hover:bg-slate-50'
    }`}
  >
    {label}
  </button>
);

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  onToggleSidebar,
  activeView,
  setActiveView,
  hasActiveThread,
  onOpenNotes,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onToggleSidebar} className="p-1 text-slate-600">
              <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
              <LogoIcon className="w-7 h-7 text-purple-600" />
              <span className="text-lg font-bold text-gray-800">ClariCase</span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenNotes && (
              <button onClick={onOpenNotes} title="Notes" className="p-2 rounded-md text-slate-600 hover:bg-slate-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /><path d="M17 3v8" /><path d="M7 7h8" /></svg>
              </button>
            )}
            <div className="w-7 h-7" />
          </div>
      </div>
      {hasActiveThread && (
        <nav className="border-t border-slate-200">
          <div className="flex justify-around">
            <TabButton label="Chat" view="chat" activeView={activeView} onClick={setActiveView} />
            <TabButton label="Summary" view="summary" activeView={activeView} onClick={setActiveView} />
            <TabButton label="Mind Map" view="mindmap" activeView={activeView} onClick={setActiveView} />
          </div>
        </nav>
      )}
    </header>
  );
};
