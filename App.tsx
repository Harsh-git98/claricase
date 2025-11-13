import React, { useState, useEffect, useMemo } from 'react';
import { User, CaseThread, Message } from './types';
import { findOrCreateUser, createThread, updateThread, processUserTurn } from './services/apiService';
import { useGoogleLogin, googleLogout } from './services/googleOAuth';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { SummaryView } from './components/SummaryView';
import { MindMapView } from './components/MindMapView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MobileHeader } from './components/MobileHeader';

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

  const handleLoginSuccess = async (tokenResponse: { access_token: string }) => {
    setIsAuthenticating(true);
    try {
      const mockProfile = {
        googleId: `mock-google-id-${Date.now()}`,
        name: 'Demo User',
        email: 'demo.user@example.com',
        picture: `https://i.pravatar.cc/150?u=${Date.now()}`,
      };
      
      const { user: dbUser, threads: userThreads } = await findOrCreateUser(mockProfile);
      setUser(dbUser);
      setThreads(userThreads);
      if (userThreads.length > 0) {
        setActiveThreadId(userThreads[0].id);
      }
    } catch (error) {
      console.error('Failed to authenticate:', error);
      setErrorMessage('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: () => {
      console.error('Login Failed');
      setIsAuthenticating(false);
      setErrorMessage('Login failed. Please try again.');
    }
  });

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setThreads([]);
    setActiveThreadId(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAuthenticating(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Clear error messages after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleCreateThread = async () => {
    if (!user) return;
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

  const handleSendMessage = async (userInput: string, imageBase64: string | null, isThinkingMode: boolean) => {
    if (!activeThread || !activeThreadId) return;

    // Validate input
    if (!userInput.trim()) {
      setErrorMessage("Message cannot be empty");
      return;
    }

    // Clear any previous errors
    setErrorMessage(null);

    // Create user message - don't store base64 image, just a flag
    const userMessage: Message = {
      role: 'user',
      content: userInput.trim(),
      timestamp: new Date().toISOString(),
      hasImage: !!imageBase64, // Just a flag to show image icon
    };
    
    const updatedMessages = [...activeThread.messages, userMessage];
    const updatedThread = { ...activeThread, messages: updatedMessages };

    // Optimistically update UI
    setThreads(threads.map(t => t.id === activeThreadId ? updatedThread : t));
    
    setIsLoading(true);

    try {
      // Send the actual image to the API
      const geminiResponse = await processUserTurn(
        updatedMessages,
        userInput.trim(),
        imageBase64,
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
      
      // More specific error messages
      let errorText = "Sorry, I encountered an error. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('too large') || error.message.includes('payload') || error.message.includes('413')) {
          errorText = "The request is too large. Try starting a new case or using a smaller image.";
        } else if (error.message.includes('timeout')) {
          errorText = "The request timed out. Please try again or use a shorter message.";
        } else if (error.message.includes('compress') || error.message.includes('image')) {
          errorText = error.message;
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
      
      const revertedThread = { ...updatedThread, messages: [...updatedMessages, errorMessage]};
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
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
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
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          activeView={mobileView}
          setActiveView={setMobileView}
          hasActiveThread={!!activeThread}
        />
        
        <main className="flex-1 flex overflow-hidden min-h-0">
          {activeThread ? (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Chat View */}
              <div className={`bg-white border-r border-slate-200 ${mobileView === 'chat' ? 'flex' : 'hidden'} lg:flex flex-col h-full min-h-0`}>
                <ChatView
                  thread={activeThread}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onUpdateTitle={(newTitle) => handleUpdateThreadTitle(activeThread.id, newTitle)}
                />
              </div>
              
              {/* Desktop: Summary and MindMap split */}
              <div className="hidden lg:flex flex-col h-full">
                <div className="flex-1 min-h-0 border-b border-slate-200 overflow-y-auto">
                  <SummaryView 
                    summary={activeThread.summary} 
                    isLoading={isLoading && activeThread.summary.includes('generated yet')} 
                  />
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <MindMapView mindMap={activeThread.mindMap} />
                </div>
              </div>

              {/* Mobile: Summary View */}
              <div className={`bg-white ${mobileView === 'summary' ? 'block' : 'hidden'} lg:hidden h-full overflow-y-auto`}>
                <SummaryView 
                  summary={activeThread.summary} 
                  isLoading={isLoading && activeThread.summary.includes('generated yet')} 
                />
              </div>

              {/* Mobile: MindMap View */}
              <div className={`bg-white ${mobileView === 'mindmap' ? 'block' : 'hidden'} lg:hidden h-full overflow-y-auto`}>
                <MindMapView mindMap={activeThread.mindMap} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <WelcomeScreen />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;