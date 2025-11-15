import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { MenuIcon } from './icons/MenuIcon';

type MobileView = 'chat' | 'summary' | 'mindmap';

interface MobileHeaderProps {
  onToggleSidebar: () => void;
  activeView: MobileView;
  setActiveView: (view: MobileView) => void;
  hasActiveThread: boolean;
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
}) => {
  return (
    <header className="lg:hidden bg-white border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onToggleSidebar} className="p-1 text-slate-600">
              <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
              <LogoIcon className="w-7 h-7 text-purple-600" />
              <span className="text-lg font-bold text-gray-800">ClariCase</span>
          </div>
          <div className="w-7 h-7"></div>
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
