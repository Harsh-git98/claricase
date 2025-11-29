import React, { useState, useRef, useEffect } from 'react';
import { CaseThread } from '../types';
import { SendIcon } from './icons/SendIcon';
import { LogoIcon } from './icons/LogoIcon';
import { UserIcon } from './icons/UserIcon';

interface ChatViewProps {
  thread: CaseThread;
  onSendMessage: (message: string, imageBase64: string | null, thinking: boolean) => void;
  isLoading: boolean;
  onUpdateTitle: (newTitle: string) => void;
  onClose?: () => void;
  onSave?: (payload?: any) => void;
}

export const QuickChatView: React.FC<ChatViewProps> = ({ 
  thread, onSendMessage, isLoading, onUpdateTitle, onClose 
}) => {

  const [userInput, setUserInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<{ file: File; base64: string } | null>(null);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(thread.title);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim() && !attachedImage) return;

    let finalMsg = userInput.trim();
    if (!finalMsg && attachedImage) {
      finalMsg = attachedImage.file.type === "application/pdf" 
        ? "Analyze this PDF" 
        : "Analyze this image";
    }

    onSendMessage(finalMsg, attachedImage?.base64 || null, isThinkingMode);

    setUserInput('');
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

 

  return (
    <div className="flex flex-col h-full">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread.messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <LogoIcon className="w-5 h-5 text-purple-600" />
              </div>
            )}
            <div className={`max-w-lg p-3 rounded-xl ${msg.role === 'user'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-100 text-gray-800'}`}>
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <LogoIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="max-w-lg p-3 rounded-lg bg-slate-100 text-gray-800">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}/>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 flex">
        <textarea
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder="Ask your legal question…"
          className="flex-1 p-2 border rounded-lg"
          rows={1}
        />
        <button type="submit" disabled={!userInput.trim()} className="ml-2 p-2 rounded-full bg-purple-600 text-white">
          <SendIcon className="w-5 h-5"/>
        </button>
      </form>
    </div>
  );
};
