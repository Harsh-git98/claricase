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

    // If nothing typed AND no file → do nothing
    if (!userInput.trim() && !attachedImage) return;

    // Auto-generate default message if only image/PDF is uploaded
    let finalUserInput = userInput.trim();

    if (!finalUserInput && attachedImage) {
      const fileType = attachedImage.file.type;
      if (fileType === "application/pdf") {
        finalUserInput = "Analyze this PDF";
      } else {
        finalUserInput = "Analyze this image";
      }
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
    if (e.key === 'Enter') {
      handleTitleSave();
    }
    if (e.key === 'Escape') {
      setTitleInput(thread.title);
      setIsEditingTitle(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between gap-2 min-h-[65px]">
        {isEditingTitle ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              className="w-full text-lg font-semibold text-gray-800 bg-slate-100 rounded-md p-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
            <h2 className="text-lg font-semibold text-gray-800 truncate" title={thread.title}>{thread.title}</h2>
            <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 text-slate-500 hover:text-slate-800 flex-shrink-0">
              <PencilIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread.messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <LogoIcon className="w-5 h-5 text-purple-600" />
              </div>
            )}
            <div className={`max-w-lg p-3 rounded-xl ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-gray-800'}`}>
              {/* Show image attachment indicator for user messages with images */}
              {msg.hasImage && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-purple-400/30">
                  <PaperclipIcon className="w-4 h-4" />
                  <span className="text-xs opacity-90">Image attached</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
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
      
      <div className="p-4 border-t border-slate-200 flex-shrink-0">
        {attachedImage && (
          <div className="mb-2 p-2 bg-slate-100 rounded-md text-sm flex justify-between items-center">
            <span className="truncate">{attachedImage.file.name}</span>
            <button onClick={() => setAttachedImage(null)} className="text-red-500 hover:text-red-700 font-bold ml-2">&times;</button>
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
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100"
          >
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
            className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300" 
            disabled={isLoading || (!userInput.trim() && !attachedImage)}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
        <div className="flex items-center justify-end mt-2">
          <label htmlFor="thinking-mode" className="flex items-center cursor-pointer">
            <LogoIcon className={`w-5 h-5 mr-2 transition-colors ${isThinkingMode ? 'text-purple-600' : 'text-slate-400'}`} />
          </label>
        </div>
      </div>
    </div>
  );
};