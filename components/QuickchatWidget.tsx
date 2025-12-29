import React, { useState } from 'react';
import { CaseThread, Message } from '../types';
import { QuickChatView } from './Quickchat';
import { processQuickChatMessage } from '../services/apiService';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reprompttserver.onrender.com/lawxora';

export const QuickchatWidget: React.FC = () => {
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [quickThread, setQuickThread] = useState<CaseThread | null>(null);
  const [isQuickLoading, setIsQuickLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleSendQuickMessage = async (
    userInput: string,
    imageBase64: string | null,
    isThinkingMode: boolean
  ) => {
    if (!quickThread) return;
    if (!userInput.trim() && !imageBase64) return;

    const userMessage: Message = {
      role: 'user',
      content: userInput.trim() || (imageBase64 ? 'Analyze this file' : ''),
      timestamp: new Date().toISOString(),
    };

    setQuickThread(prev => prev ? { ...prev, messages: [...prev.messages, userMessage], updatedAt: new Date().toISOString() } : prev);
    setIsQuickLoading(true);

    try {
      const resp = await processQuickChatMessage([
        ...(quickThread.messages || []),
        userMessage,
      ], userInput.trim(), imageBase64, isThinkingMode);

      const assistantMessage: Message = {
        role: 'assistant',
        content: resp.chatResponse,
        timestamp: new Date().toISOString(),
      };

      setQuickThread(prev => prev ? { ...prev, messages: [...prev.messages, assistantMessage], updatedAt: new Date().toISOString() } : prev);
    } catch (err) {
      const errText = err instanceof Error ? err.message : 'An error occurred';
      const assistantMessage: Message = {
        role: 'assistant',
        content: errText,
        timestamp: new Date().toISOString(),
      };
      setQuickThread(prev => prev ? { ...prev, messages: [...prev.messages, assistantMessage], updatedAt: new Date().toISOString() } : prev);
    } finally {
      setIsQuickLoading(false);
    }
  };

  return (
    <>
      {isQuickOpen && quickThread ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-white/60 overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ChatBubbleIcon className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium">Quick Chat</div>
                    <div className="text-xs text-slate-500">Get instant answers. Sign in for full case features.</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                
                  <button onClick={() => { setIsQuickOpen(false); setQuickThread(null); }} className="text-red-400 hover:text-slate-600">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>

              <div style={{height: '80vh'}} className="bg-gradient-to-br from-purple-50 to-pink-50">
                <QuickChatView
                  thread={quickThread}
                  onSendMessage={handleSendQuickMessage}
                  isLoading={isQuickLoading}
                  onClose={() => { setIsQuickOpen(false); setQuickThread(null); }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2">
  <button
    onClick={() => {
      if (!isQuickOpen) {
        const qt: CaseThread = {
          id: `quickchat_${Date.now()}`,
          userId: 'guest',
          title: 'Quick Chat',
          messages: [
            {
              role: 'assistant',
              content:
                'Hi! I can help with quick legal questions. Sign in for deeper case clarifications, enhanced features, and saving this chat to a case.',
              timestamp: new Date().toISOString(),
            } as Message,
          ],
          summary: '',
          mindMap: { nodes: [], edges: [] },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setQuickThread(qt);
      }
      setIsQuickOpen(!isQuickOpen);
    }}
    title="Quick Chat"
    className="
      relative group
      w-14 h-14
      rounded-full
    bg-gradient-to-br from-indigo-400 to-purple-700
      text-white
      flex items-center justify-center
      shadow-xl shadow-purple-500/40
      transition-all duration-300
      hover:scale-110
      hover:shadow-purple-500/70
      active:scale-95
      overflow-hidden
    "
  >
    {/* ✨ glowing pulse ring */}
    <span
      className="
        absolute inset-0
        rounded-full
        bg-purple-800/40
        blur-xl
        animate-pulse
        -z-10
      "
    />

    {/* 🪞 glossy light sweep */}
    <span
      className="
        absolute inset-0
        bg-gradient-to-r from-transparent via-white/40 to-transparent
        translate-x-[-120%]
        group-hover:translate-x-[120%]
        transition-transform duration-700
      "
    />

    <ChatBubbleIcon className="w-6 h-6 relative z-10" />
  </button>

  {/* 👀 tempting caption */}
  <div className="text-xs font-medium text-purple-700 animate-bounce">
    Try Now
  </div>
</div>

    </>
  );
};

export default QuickchatWidget;
