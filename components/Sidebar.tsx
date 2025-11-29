import React, { useState, useRef, useEffect } from 'react';
import { User, CaseThread } from '../types';
import { LogoIcon } from './icons/LogoIcon';
import { PlusIcon } from './icons/PlusIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { XIcon } from './icons/XIcon';
import { PencilIcon } from './icons/PencilIcon';
import { AccountPopup } from './AccountPopup';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface SidebarProps {
  user: User;
  threads: CaseThread[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onCreateThread: () => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onUpdateThreadTitle: (threadId: string, newTitle: string) => void;
  openQuickChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  threads,
  activeThreadId,
  onSelectThread,
  onCreateThread,
  onLogout,
  isOpen,
  setIsOpen,
  onUpdateThreadTitle,
  openQuickChat,
}) => {
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [titleInputValue, setTitleInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAccountPopupOpen, setIsAccountPopupOpen] = useState(false);


  useEffect(() => {
    if (editingThreadId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingThreadId]);

  const handleEditClick = (thread: CaseThread) => {
    setEditingThreadId(thread.id);
    setTitleInputValue(thread.title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInputValue(e.target.value);
  };

  const handleTitleSave = (threadId: string) => {
    const originalTitle = threads.find((t) => t.id === threadId)?.title;
    if (titleInputValue.trim() && titleInputValue.trim() !== originalTitle) {
      onUpdateThreadTitle(threadId, titleInputValue);
    }
    setEditingThreadId(null);
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    threadId: string
  ) => {
    if (e.key === 'Enter') {
      handleTitleSave(threadId);
    }
    if (e.key === 'Escape') {
      setEditingThreadId(null);
    }
  };


  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 w-64 flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <LogoIcon className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-800">ClariCase</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-500 hover:text-slate-800"
            aria-label="Close sidebar"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

         <div className="p-4">
          <button
            onClick={openQuickChat}
            className="w-full flex items-center justify-center space-x-2 bg-purple-200 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-300 transition-colors duration-200"
          >
            <ChatBubbleIcon className="w-5 h-5 text-purple-900" />
            <span className="text-purple-900">Quick Chat</span>
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={onCreateThread}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Case</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
            Investigations
          </p>
          <ul className="space-y-1">
            {threads.map((thread) => (
              <li key={thread.id}>
                {editingThreadId === thread.id ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={titleInputValue}
                    onChange={handleTitleChange}
                    onBlur={() => handleTitleSave(thread.id)}
                    onKeyDown={(e) => handleInputKeyDown(e, thread.id)}
                    className="block w-full px-3 py-2 rounded-md text-sm font-medium bg-purple-200 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                ) : (
                  <div className="group relative flex items-center">
                    <button
                      onClick={() => onSelectThread(thread.id)}
                      className={`flex-1 text-left px-3 py-2 rounded-md text-sm font-medium transition-colors truncate ${
                        activeThreadId === thread.id
                          ? 'bg-purple-100 text-purple-800'
                          : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                      }`}
                    >
                      {thread.title}
                    </button>
                    <button
                      onClick={() => handleEditClick(thread)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-700 focus:opacity-100"
                      aria-label={`Edit title for ${thread.title}`}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <img
                src={user.picture}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="min-w-0 cursor-pointer"  onClick={() => setIsAccountPopupOpen(true)}>
                <p className="font-semibold text-sm text-gray-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-md text-gray-500 hover:bg-slate-100 hover:text-red-600 flex-shrink-0"
              title="Logout"
            >
              <LogoutIcon className="w-5 h-5" />
            </button>
          </div>
        </div> */}
      </aside>
   
    {isAccountPopupOpen && (
  <AccountPopup
    user={user}
    onClose={() => setIsAccountPopupOpen(false)}
  />
)}
    </> 
  );
};
