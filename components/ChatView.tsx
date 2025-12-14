import React, { useState, useRef, useEffect } from 'react';
import { CaseThread } from '../types';
import { processFile } from '../services/apiService';
import { SendIcon } from './icons/SendIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { LogoIcon } from './icons/LogoIcon';
import { UserIcon } from './icons/UserIcon';
import { PencilIcon } from './icons/PencilIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ProcessedFile {
  type: 'image' | 'pdf' | 'document';
  base64: string;
  mimeType: string;
  size: number;
}

interface ChatViewProps {
  thread: CaseThread;
  onSendMessage: (userInput: string, fileData: ProcessedFile | null, isThinkingMode: boolean) => void;
  isLoading: boolean;
  onUpdateTitle: (newTitle: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ thread, onSendMessage, isLoading, onUpdateTitle }) => {
  const [userInput, setUserInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ 
    file: File; 
    processed: ProcessedFile;
    preview?: string;
  } | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
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

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📎';
  };

  const getFileTypeLabel = (processed: ProcessedFile) => {
    switch (processed.type) {
      case 'image': return 'Image';
      case 'pdf': return 'PDF Document';
      case 'document': return 'Document';
      default: return 'File';
    }
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setIsProcessingFile(true);

    try {
      const processed = await processFile(file);
      
      // Create preview for images
      let preview: string | undefined;
      if (processed.type === 'image') {
        preview = `data:${processed.mimeType};base64,${processed.base64}`;
      }

      setAttachedFile({ file, processed, preview });
      console.log(`✅ File processed: ${getFileTypeLabel(processed)} (${processed.size}KB)`);
    } catch (error) {
      console.error('File processing error:', error);
      setFileError(error instanceof Error ? error.message : 'Failed to process file');
      setAttachedFile(null);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessingFile) return;
    if (!userInput.trim() && !attachedFile) return;

    let finalUserInput = userInput.trim();
    if (!finalUserInput && attachedFile) {
      const typeLabel = getFileTypeLabel(attachedFile.processed);
      finalUserInput = `Analyze this ${typeLabel}`;
    }

    onSendMessage(finalUserInput, attachedFile?.processed || null, isThinkingMode);
    setUserInput('');
    setAttachedFile(null);
    setFileError(null);
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
            <div className={`max-w-lg p-3 rounded-xl z-10 ${
              msg.role === 'user' ? 'bg-slate-300 text-gray-900' : 'bg-purple-600 text-white prose prose-sm prose-invert'
            }`}>
              {msg.hasImage && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-purple-400/30">
                  <PaperclipIcon className="w-4 h-4" />
                  <span className="text-xs opacity-90">File attached</span>
                </div>
              )}

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
      
      {/* Input Area */}
      <div className="p-4 border-t border-purple-600 flex-shrink-0">
        {/* File Error Message */}
        {fileError && (
          <div className="mb-2 p-2 bg-red-100 border border-red-300 rounded-md text-sm text-red-700 flex items-center justify-between">
            <span>{fileError}</span>
            <button onClick={() => setFileError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}

        {/* Attached File Preview */}
        {attachedFile && (
          <div className="mb-2 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
              {/* Preview or Icon */}
              {attachedFile.preview ? (
                <img 
                  src={attachedFile.preview} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded border border-purple-200"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded border border-purple-200 text-3xl">
                  {getFileIcon(attachedFile.file.type)}
                </div>
              )}
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {attachedFile.file.name}
                  </span>
                  <button 
                    onClick={() => {
                      setAttachedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }} 
                    className="text-red-500 hover:text-red-700 ml-2 p-1"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {getFileTypeLabel(attachedFile.processed)} • {attachedFile.processed.size}KB
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessingFile && (
          <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span>Processing file...</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileAttach} 
            accept="image/*,.pdf,.doc,.docx,.txt" 
            className="hidden" 
            disabled={isProcessingFile || isLoading}
          />

          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isProcessingFile || isLoading}
            title="Attach file (images, PDFs, documents)"
          >
            <PaperclipIcon className="w-5 h-5" />
          </button>

          <div className="flex-1">
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
              className="w-full p-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              rows={2}
              disabled={isLoading || isProcessingFile}
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading || isProcessingFile || (!userInput.trim() && !attachedFile)}
            className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
            title="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>

        {/* Supported Formats Info */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          Supported: Images (JPG, PNG), PDFs, Word Documents (.doc, .docx), Text files
        </div>
      </div>
    </div>
  );
};