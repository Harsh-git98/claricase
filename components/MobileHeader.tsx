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
    <header className="bg-white/80 backdrop-blur-xl border-b border-purple-200/40 flex-shrink-0">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 h-16">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <MenuIcon className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <LogoIcon className="w-7 h-7 text-purple-600" />
          <span className="font-bold text-lg text-gray-900">
            ClariCase
          </span>
        </div>

        {onOpenNotes && (
          <button
            onClick={onOpenNotes}
            title="Notes"
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <DocumentTextIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Tabs OR Quick Chat Mode */}
      {hasActiveThread && (
        isQuickChatOpen ? (
          <div className="px-4 py-3 border-t border-purple-200/40 flex items-center justify-between">
            <h2 className="font-medium text-gray-900 truncate">
              {activeThreadTitle}
            </h2>
            {onCloseThread && (
              <button
                onClick={onCloseThread}
                className="text-red-500 hover:text-red-600 flex flex-row items-center gap-1"
              >
                <p className='text-red-600 font-semibold'>Close</p>
                <XIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <nav className="border-t border-purple-200/40">
            <div className="flex">
              {(['chat', 'summary', 'mindmap'] as MobileView[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`flex-1 py-3 text-sm font-medium tracking-wide
                    ${
                      activeView === view
                        ? 'text-purple-700 border-b-2 border-purple-600'
                        : 'text-gray-500 hover:text-purple-600'
                    }
                  `}
                >
                  {view === 'chat'
                    ? 'Chat'
                    : view === 'summary'
                    ? 'Summary'
                    : 'Mind Map'}
                </button>
              ))}
            </div>
          </nav>
        )
      )}
    </header>
  );
};

