import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { MenuIcon } from './icons/MenuIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { XIcon } from './icons/XIcon';
type MobileView = 'chat' | 'summary' | 'mindmap';

interface MobileHeaderProps {
  onToggleSidebar: () => void;
  activeView: MobileView;
  setActiveView: (view: MobileView) => void;
  hasActiveThread: boolean;
  onOpenNotes?: () => void;
  // New: optional active thread title (used for quick chat or active chat header)
  activeThreadTitle?: string | null;
  // New: handler to close the active/quick chat
  onCloseThread?: () => void;
  // New: whether a quick chat is open (so header shows the title instead of tabs)
  isQuickChatOpen?: boolean;
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
              <button onClick={onOpenNotes} title="Notes" className="p-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-purple-600 flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5" />
                <p className="font-semibold ">Notes</p>
              </button>
            )}
          </div>
      </div>

      {hasActiveThread && (
        // Show either the chat header (when quick chat is open or chat view active)
        // or the three-tab nav (when summary/mindmap active)
        (isQuickChatOpen || activeView === 'chat') ? (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold truncate">{activeThreadTitle}</h2>
            </div>
            {onCloseThread && <button onClick={onCloseThread}><XIcon className="w-6 h-6"/></button>}
          </div>
        ) : (
          <nav className="border-t border-slate-200">
            <div className="flex justify-around">
              <TabButton label="Chat" view="chat" activeView={activeView} onClick={setActiveView} />
              <TabButton label="Summary" view="summary" activeView={activeView} onClick={setActiveView} />
              <TabButton label="Mind Map" view="mindmap" activeView={activeView} onClick={setActiveView} />
            </div>
          </nav>
        )
      )}
    </header>
  );
};
