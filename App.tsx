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

  const handleLoginSuccess = async (tokenResponse: { access_token: string }) => {
    setIsAuthenticating(true);
    try {
      // Mock profile - in production, fetch from Google API
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
      alert('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: () => {
      console.error('Login Failed');
      setIsAuthenticating(false);
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
      alert('Failed to create new case. Please try again.');
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
        alert('Failed to update title. Please try again.');
    }
  };

  const handleSendMessage = async (userInput: string, imageBase64: string | null, isThinkingMode: boolean) => {
    if (!activeThread) return;

    const userMessage: Message = {
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString(),
      ...(imageBase64 && { image: `data:image/jpeg;base64,${imageBase64}` })
    };
    
    const updatedMessages = [...activeThread.messages, userMessage];
    const updatedThread = { ...activeThread, messages: updatedMessages };

    // Optimistically update UI
    setThreads(threads.map(t => t.id === activeThreadId ? updatedThread : t));
    
    setIsLoading(true);

    try {
      const geminiResponse = await processUserTurn(
        updatedMessages,
        userInput,
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
      const errorMessage: Message = {
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
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
        <main className="flex-1 flex overflow-hidden">
          {activeThread ? (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-full">
              <div className={`bg-white border-r border-slate-200 ${mobileView === 'chat' ? 'flex' : 'hidden'} lg:flex flex-col h-full`}>
                <ChatView
                  thread={activeThread}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onUpdateTitle={(newTitle) => handleUpdateThreadTitle(activeThread.id, newTitle)}
                />
              </div>
              
              <div className="hidden lg:flex flex-col h-full">
                <div className="flex-1 min-h-0 border-b border-slate-200">
                  <SummaryView summary={activeThread.summary} isLoading={isLoading && activeThread.summary.includes('generated yet')} />
                </div>
                <div className="flex-1 min-h-0">
                  <MindMapView mindMap={activeThread.mindMap} />
                </div>
              </div>

              <div className={`bg-white ${mobileView === 'summary' ? 'block' : 'hidden'} lg:hidden h-full`}>
                <SummaryView summary={activeThread.summary} isLoading={isLoading && activeThread.summary.includes('generated yet')} />
              </div>

              <div className={`bg-white ${mobileView === 'mindmap' ? 'block' : 'hidden'} lg:hidden h-full`}>
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