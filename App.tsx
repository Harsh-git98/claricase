import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { User, CaseThread, Message } from './types';
import { createThread, updateThread, processUserTurn, checkAuthStatus, logout } from './services/apiService';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { SummaryView } from './components/SummaryView';
import { MindMapView } from './components/MindMapView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MobileHeader } from './components/MobileHeader';
import { QuickChatView } from './components/Quickchat';
import { NotesPopup } from './components/NotesPopup';
import { Note } from './types';
import HarshPortfolio from './components/HarshPortfolio';

import { 
  getNotes, 
  createNote, 
  updateNote, 
  deleteNote,
  processQuickChatMessage,
  saveQuickChatAsThread
} from './services/apiService';

type MobileView = 'chat' | 'summary' | 'mindmap';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<CaseThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('chat');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isQuickChatOpen, setIsQuickChatOpen] = useState(false);
  const [quickThread, setQuickThread] = useState<CaseThread | null>(null);
  const [isQuickLoading, setIsQuickLoading] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
const [isLoadingNotes, setIsLoadingNotes] = useState(false);

// Load notes from backend when user logs in or notes popup opens
const loadNotesFromBackend = async () => {
  if (!user) return;
  
  setIsLoadingNotes(true);
  try {
    const fetchedNotes = await getNotes();
    setNotes(fetchedNotes);
  } catch (error) {
    console.error('Failed to load notes:', error);
    setErrorMessage('Failed to load notes. Please try again.');
  } finally {
    setIsLoadingNotes(false);
  }
};

const openNotes = async () => {
  setIsNotesOpen(true);
  await loadNotesFromBackend();
};

const closeNotes = () => setIsNotesOpen(false);

const createNoteHandler = async (payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const newNote = await createNote(payload);
    setNotes(prev => [newNote, ...prev]);
  } catch (error) {
    console.error('Failed to create note:', error);
    setErrorMessage('Failed to create note. Please try again.');
  }
};

const updateNoteHandler = async (id: string, patch: Partial<Note>) => {
  const originalNotes = notes;
  
  // Optimistic update
  setNotes(prev => prev.map(n => 
    n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n
  ));

  try {
    const updatedNote = await updateNote(id, patch);
    setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
  } catch (error) {
    console.error('Failed to update note:', error);
    setNotes(originalNotes);
    setErrorMessage('Failed to update note. Please try again.');
  }
};

const deleteNoteHandler = async (id: string) => {
  const originalNotes = notes;
  
  // Optimistic update
  setNotes(prev => prev.filter(n => n.id !== id));

  try {
    await deleteNote(id);
  } catch (error) {
    console.error('Failed to delete note:', error);
    setNotes(originalNotes);
    setErrorMessage('Failed to delete note. Please try again.');
  }
};

// ==================== QUICKCHAT MANAGEMENT ====================
// Replace handleSendQuickMessage with this:

const handleSendQuickMessage = async (
  userInput: string, 
  imageBase64: string | null, 
  isThinkingMode: boolean
) => {
  if (!quickThread) return;
  if (!userInput.trim() && !imageBase64) return;

  const userMessage = {
    role: 'user' as const,
    content: userInput.trim() || (imageBase64 ? 'Analyze this file' : ''),
    timestamp: new Date().toISOString(),
    hasImage: !!imageBase64,
  };

  // Optimistic local update
  setQuickThread(prev => prev ? { 
    ...prev, 
    messages: [...prev.messages, userMessage], 
    updatedAt: new Date().toISOString() 
  } : prev);
  setIsQuickLoading(true);

  try {
    // Use the QuickChat-specific API endpoint
    const geminiResponse = await processQuickChatMessage(
      [...quickThread.messages, userMessage],
      userInput.trim(),
      imageBase64,
      isThinkingMode
    );

    const assistantMessage = {
      role: 'assistant' as const,
      content: geminiResponse.chatResponse,
      timestamp: new Date().toISOString(),
    };

    setQuickThread(prev => prev ? { 
      ...prev, 
      messages: [...prev.messages, assistantMessage], 
      updatedAt: new Date().toISOString() 
    } : prev);
  } catch (error) {
    console.error('QuickChat send failed:', error);
    const errText = error instanceof Error ? error.message : 'An error occurred';
    const assistantMessage = {
      role: 'assistant' as const,
      content: errText,
      timestamp: new Date().toISOString(),
    };
    setQuickThread(prev => prev ? { 
      ...prev, 
      messages: [...prev.messages, userMessage, assistantMessage], 
      updatedAt: new Date().toISOString() 
    } : prev);
    setErrorMessage(errText);
  } finally {
    setIsQuickLoading(false);
  }
};



  // Check authentication status on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
const token = params.get("token");
if (token) {
  localStorage.setItem("lexora_token", token);
  window.history.replaceState({}, document.title, "/"); // clear token from URL
}
    const checkAuth = async () => {
      setIsAuthenticating(true);
      try {
        const { authenticated, user: authUser, threads: userThreads } = await checkAuthStatus();
        
        if (authenticated && authUser) {
          setUser(authUser);
          setThreads(userThreads || []);
          if (userThreads && userThreads.length > 0) {
            setActiveThreadId(userThreads[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("lexora_token");
setUser(null);
setThreads([]);
setActiveThreadId(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setErrorMessage('Failed to logout. Please try again.');
    }
  };

  // Clear error messages after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleCreateThread = async () => {
    if (!user) return;
    if (user?.pro==false)
    {
      setErrorMessage("Create a Pro account to start a new case.");
      return;
    }
    try {
      const newThread = await createThread(user.id);
      setThreads(prev => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
      setIsSidebarOpen(false);
      setMobileView('chat');
    } catch (error) {
      console.error('Failed to create thread:', error);
      setErrorMessage('Failed to create new case. Please try again.');
    }
  };

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    setIsSidebarOpen(false);
    setMobileView('chat');
  };

  const activeThread = useMemo(() => {
    return threads.find(t => t.id === activeThreadId);
  }, [threads, activeThreadId]);

  const handleUpdateThreadTitle = async (threadId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    const originalThreads = threads;
    setThreads(prevThreads => 
      prevThreads.map(t => t.id === threadId ? { ...t, title: newTitle.trim() } : t)
    );

    try {
      await updateThread(threadId, { title: newTitle.trim() });
    } catch (error) {
      console.error("Failed to update thread title:", error);
      setThreads(originalThreads);
      setErrorMessage('Failed to update title. Please try again.');
    }
  };

  // QuickChat: ephemeral temporary chat that is not saved to server
  useEffect(() => {
    const onOpen = () => {
      const qt: CaseThread = {
        id: `quickchat_${Date.now()}`,
        userId: user?.id || 'guest',
        title: 'Quick Chat',
        messages: [],
        summary: '',
        mindMap: { nodes: [], edges: [] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setQuickThread(qt);
      setIsQuickChatOpen(true);
      setIsQuickLoading(false);
    };

    window.addEventListener('openQuickChat', onOpen as EventListener);
    return () => window.removeEventListener('openQuickChat', onOpen as EventListener);
  }, [user]);

  const closeQuickChat = () => {
    setIsQuickChatOpen(false);
    setQuickThread(null);
    setIsQuickLoading(false);
  };

  const triggerQuickChat = () => {
    const event = new CustomEvent('openQuickChat');
    window.dispatchEvent(event);
  };

  

  // Update the handleSendMessage function in your App.tsx

interface ProcessedFile {
  type: 'image' | 'pdf' | 'document';
  base64: string;
  mimeType: string;
  size: number;
}

const handleSendMessage = async (
  userInput: string, 
  fileData: ProcessedFile | null, 
  isThinkingMode: boolean
) => {
  if (!activeThread || !activeThreadId) return;

  // Validate input
  if (!userInput.trim() && !fileData) {
    setErrorMessage("Please provide a message or attach a file");
    return;
  }

  // Clear any previous errors
  setErrorMessage(null);

  // Create user message
  const userMessage: Message = {
    role: 'user',
    content: userInput.trim() || `Analyzing ${fileData?.type}...`,
    timestamp: new Date().toISOString(),
    hasImage: !!fileData,
  };
  
  const updatedMessages = [...activeThread.messages, userMessage];
  const updatedThread = { ...activeThread, messages: updatedMessages };

  // Optimistically update UI
  setThreads(threads.map(t => t.id === activeThreadId ? updatedThread : t));
  
  setIsLoading(true);

  try {
    // Send to API with file data
    const geminiResponse = await processUserTurn(
      updatedMessages,
      userInput.trim() || `Please analyze this ${fileData?.type}`,
      fileData,
      isThinkingMode
    );
    
    const assistantMessage: Message = {
      role: 'assistant',
      content: geminiResponse.chatResponse,
      timestamp: new Date().toISOString(),
    };

    const finalThread: CaseThread = {
      ...updatedThread,
      messages: [...updatedMessages, assistantMessage],
      summary: geminiResponse.summary,
      mindMap: geminiResponse.mindMap,
    };

    await updateThread(activeThreadId, finalThread);
    setThreads(threads.map(t => t.id === activeThreadId ? finalThread : t));

  } catch (error) {
    console.error("Failed to send message:", error);
    
    // Specific error messages
    let errorText = "Sorry, I encountered an error. Please try again.";
    if (error instanceof Error) {
      if (error.message.includes('too large') || error.message.includes('payload')) {
        errorText = "The file or conversation is too large. Try starting a new case or using a smaller file.";
      } else if (error.message.includes('timeout')) {
        errorText = "The request timed out. Please try again.";
      } else if (error.message.includes('process') || error.message.includes('file')) {
        errorText = error.message;
      } else if (error.message.includes('Not authenticated') || error.message.includes('401')) {
        errorText = "Session expired. Please log in again.";
        setUser(null);
      } else {
        errorText = error.message;
      }
    }
    
    setErrorMessage(errorText);
    
    const errorMessage: Message = {
      role: 'assistant',
      content: errorText,
      timestamp: new Date().toISOString(),
    };
    
    const revertedThread = { 
      ...updatedThread, 
      messages: [...updatedMessages, errorMessage]
    };
    setThreads(threads.map(t => t.id === activeThreadId ? revertedThread : t));
  } finally {
    setIsLoading(false);
  }
};



  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-slate-50 via-purple-50/60 to-white">
      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">{errorMessage}</p>
            <button 
              onClick={() => setErrorMessage(null)}
              className="ml-auto flex-shrink-0 text-white hover:text-red-100"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Sidebar
        user={user}
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        onCreateThread={handleCreateThread}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onUpdateThreadTitle={handleUpdateThreadTitle}
        openQuickChat={triggerQuickChat}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          activeView={mobileView}
          setActiveView={setMobileView}
          hasActiveThread={!!(activeThread || quickThread)}
          onOpenNotes={openNotes}
          activeThreadTitle={isQuickChatOpen && quickThread ? quickThread.title : activeThread ? activeThread.title : undefined}
          onCloseThread={isQuickChatOpen ? closeQuickChat : undefined}
          isQuickChatOpen={isQuickChatOpen}
        />
        
        <main className="flex-1 flex overflow-hidden min-h-0">
          {isQuickChatOpen && quickThread ? (
            <div className="flex-1 flex flex-col h-full min-h-0 bg-white">
    <QuickChatView
      thread={quickThread}
      onSendMessage={handleSendQuickMessage}
      isLoading={isQuickLoading}
      onUpdateTitle={(newTitle) => setQuickThread(prev => prev ? { ...prev, title: newTitle } : prev)}
      onClose={closeQuickChat}
      onSave={user ? saveQuickChatAsThread : undefined} // Only show save if logged in
    />
  </div>
          ) : activeThread ? (
            // Mobile-first single-column layout (applies to desktop as well)
            <div className="flex-1 flex flex-col h-full">
              {/* Chat View (full-screen when selected) */}
              <div className={`bg-white border-r border-slate-200 ${mobileView === 'chat' ? 'flex' : 'hidden'} flex flex-col h-full min-h-0`}>
                <ChatView
                  thread={activeThread}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onUpdateTitle={(newTitle) => handleUpdateThreadTitle(activeThread.id, newTitle)}
                />
              </div>

              {/* Summary View (mobile-style full screen) */}
              <div className={`bg-white ${mobileView === 'summary' ? 'block' : 'hidden'} h-full overflow-y-auto`}>
                <SummaryView 
                  summary={activeThread.summary} 
                  isLoading={isLoading && activeThread.summary.includes('generated yet')} 
                />
              </div>

              {/* MindMap View (mobile-style full screen) */}
              <div className={`bg-white ${mobileView === 'mindmap' ? 'block' : 'hidden'} h-full overflow-y-auto`}>
                <MindMapView mindMap={activeThread.mindMap} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <WelcomeScreen onOpenQuickChat={triggerQuickChat} onCreateThread={handleCreateThread} />
            </div>
          )}
        </main>
        {isNotesOpen && (
  <NotesPopup
    notes={notes}
    isLoading={isLoadingNotes}
    onClose={closeNotes}
    onCreate={createNoteHandler}
    onUpdate={updateNoteHandler}
    onDelete={deleteNoteHandler}
  />
)}
      </div>
    </div>
  
   
  );
};

const RouterApp: React.FC = () => (
  <HashRouter>
    <Routes>
      <Route path="/harshranjan" element={<HarshPortfolio />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </HashRouter>
);

export default RouterApp;