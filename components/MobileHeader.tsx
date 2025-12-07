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
  activeThreadTitle,
  onCloseThread,
  isQuickChatOpen,
}) => {
  return (
    <header className="bg-gradient-to-r from-white/75 via-purple-100/60 to-white/75 backdrop-blur-2xl border-b border-white/60 shadow-[0_12px_40px_-20px_rgba(109,40,217,0.35)] flex-shrink-0">
      <div className="flex items-center justify-between p-4 h-16">
          <button onClick={onToggleSidebar} className="p-1 text-slate-600 hover:text-purple-700">
              <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
              <LogoIcon className="w-7 h-7 text-purple-600" />
              <span className="text-lg font-bold text-gray-800">ClariCase</span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenNotes && (
              <button onClick={onOpenNotes} title="Notes" className="p-2 rounded-md text-slate-600 hover:bg-white/70 hover:text-purple-600 flex items-center justify-center border border-white/60">
                <DocumentTextIcon className="w-5 h-5" />
                <p className="font-semibold ">Notes</p>
              </button>
            )}
          </div>
      </div>

      {hasActiveThread && (
        // Show either the chat header (when quick chat is open or chat view active)
        // or the three-tab nav (when summary/mindmap active)
        (isQuickChatOpen) ? (
          <div className="p-4 border-t border-white/60 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-center font-semibold truncate">{activeThreadTitle}</h2>
            </div>
            {onCloseThread && <button onClick={onCloseThread} className="flex items-center gap-2 text-red-500 border border-red-300 bg-white/70 rounded-md px-2 py-1 hover:shadow-sm"><XIcon className="w-5 h-5"/>End Chat</button>}
          </div>
        ) : (
          <nav className="border-t border-white/60 bg-white/70 backdrop-blur-xl">
            <div className="flex">
              <div className="flex-1 px-2 flex">
                <div
                  className={`flex-1 rounded-lg transition-transform duration-150 transform ${
                    activeView === 'chat' ? '-translate-y-1 shadow-2xl' : 'hover:-translate-y-0.5 shadow-sm'
                  } bg-white/60 backdrop-blur-sm border border-white/30`}
                >
                  <TabButton label="Chat" view="chat" activeView={activeView} onClick={setActiveView} />
                </div>
              </div>

              <div className="flex-1 px-2 flex">
                <div
                  className={`flex-1 rounded-lg transition-transform duration-150 transform ${
                    activeView === 'summary' ? '-translate-y-1 shadow-2xl' : 'hover:-translate-y-0.5 shadow-sm'
                  } bg-white/60 backdrop-blur-sm border border-white/30`}
                >
                  <TabButton label="Summary" view="summary" activeView={activeView} onClick={setActiveView} />
                </div>
              </div>

              <div className="flex-1 px-2 flex">
                <div
                  className={`flex-1 rounded-lg transition-transform duration-150 transform ${
                    activeView === 'mindmap' ? '-translate-y-1 shadow-2xl' : 'hover:-translate-y-0.5 shadow-sm'
                  } bg-white/60 backdrop-blur-sm border border-white/30`}
                >
                  <TabButton label="Mind Map" view="mindmap" activeView={activeView} onClick={setActiveView} />
                </div>
              </div>
            </div>
          </nav>
        )
      )}
    </header>
  );
};
