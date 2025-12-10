import React, { useState, useRef, useEffect } from 'react';
import { CaseThread } from '../types';
import { SendIcon } from './icons/SendIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { LogoIcon } from './icons/LogoIcon';
import { UserIcon } from './icons/UserIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { PencilIcon } from './icons/PencilIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatViewProps {
  thread: CaseThread;
  onSendMessage: (userInput: string, imageBase64: string | null, isThinkingMode: boolean) => void;
  isLoading: boolean;
  onUpdateTitle: (newTitle: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ thread, onSendMessage, isLoading, onUpdateTitle }) => {
  const [userInput, setUserInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<{ file: File; base64: string } | null>(null);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(thread.title);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages, isLoading]);
  
  useEffect(() => {
    setTitleInput(thread.title);
    setIsEditingTitle(false);
  }, [thread.id, thread.title]);

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setAttachedImage({ file, base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() && !attachedImage) return;

    let finalUserInput = userInput.trim();
    if (!finalUserInput && attachedImage) {
      finalUserInput = attachedImage.file.type === "application/pdf"
        ? "Analyze this PDF"
        : "Analyze this image";
    }

    onSendMessage(finalUserInput, attachedImage?.base64 || null, isThinkingMode);
    setUserInput('');
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTitleSave = () => {
    if (titleInput.trim() && titleInput.trim() !== thread.title) {
      onUpdateTitle(titleInput);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleTitleSave();
    if (e.key === 'Escape') {
      setTitleInput(thread.title);
      setIsEditingTitle(false);
    }
  };
  
  return (
    <div className="relative flex flex-col h-full bg-gradient-to-br from-white/75 via-purple-100/60 to-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_-25px_rgba(109,40,217,0.35)] rounded-[26px] overflow-hidden">
    
      {/* Watermark */}    
      {thread.messages.length <= 1 && (
        <div className="pointer-events-none select-none absolute inset-0 flex flex-col items-center justify-center opacity-30 -z-10">
          <LogoIcon className="w-24 h-24 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Case Chat</h2>
          <p className="text-slate-500">Clarify your legal questions and get assistance.</p>
        </div>
      )}

      {/* Title Bar */}
      <div className="p-4 border-b border-white/60 bg-gradient-to-r from-purple-100/80 via-purple-50 to-pink-100/70 flex-shrink-0 flex items-center justify-between gap-2 min-h-[65px]">
        {isEditingTitle ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              className="w-full text-lg font-semibold text-gray-800 bg-slate-100 rounded-md p-1 focus:ring-2 focus:ring-purple-500"
              autoFocus
              onBlur={handleTitleSave}
            />
            <button onClick={handleTitleSave} className="p-1 text-green-600 hover:bg-green-100 rounded-full">
              <CheckIcon className="w-5 h-5"/>
            </button>
            <button onClick={() => { setIsEditingTitle(false); setTitleInput(thread.title); }} className="p-1 text-red-600 hover:bg-red-100 rounded-full">
              <XIcon className="w-5 h-5"/>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group min-w-0">
            <h2 className="text-lg font-semibold text-gray-800 truncate">{thread.title}</h2>
            <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-slate-800">
              <PencilIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread.messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {/* {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <LogoIcon className="w-5 h-5 text-purple-600" />
              </div>
            )} */}

            <div className={`max-w-lg p-3 rounded-xl z-10 ${
              msg.role === 'user' ? 'bg-slate-300 text-gray-900' : 'bg-purple-300 text-white prose prose-sm prose-invert'
            }`}>
              {msg.hasImage && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-purple-400/30">
                  <PaperclipIcon className="w-4 h-4" />
                  <span className="text-xs opacity-90">Image attached</span>
                </div>
              )}

              {/* MARKDOWN RENDER */}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>

            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-slate-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <LogoIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="max-w-lg p-3 rounded-lg bg-slate-100 text-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-purple-600 flex-shrink-0">
        {attachedImage && (
          <div className="mb-2 p-2 bg-slate-100 rounded-md text-sm flex justify-between items-center">
            <span className="truncate">{attachedImage.file.name}</span>
            <button onClick={() => setAttachedImage(null)} className="text-red-500 hover:text-red-700 ml-2 font-bold">&times;</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageAttach} 
            accept="image/*,application/pdf" 
            className="hidden" 
          />

          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
            <PaperclipIcon className="w-5 h-5" />
          </button>

          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => { 
              if (e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault();
                handleSubmit(e); 
              }
            }}
            placeholder="Type your message or upload a file..."
            className="flex-1 p-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
            rows={2}
            disabled={isLoading}
          />

          <button 
            type="submit"
            disabled={isLoading || (!userInput.trim() && !attachedImage)}
            className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
};
