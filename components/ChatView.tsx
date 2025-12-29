import React, { useState, useRef, useEffect } from "react";
import { CaseThread } from "../types";
import { processFile } from "../services/apiService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Paperclip,
  MessageSquare,
  User,
  Edit2,
  Check,
  X,
} from "lucide-react";

interface ProcessedFile {
  type: "image" | "pdf" | "document";
  base64: string;
  mimeType: string;
  size: number;
}

interface ChatViewProps {
  thread: CaseThread;
  onSendMessage: (
    userInput: string,
    fileData: ProcessedFile | null,
    isThinkingMode: boolean
  ) => void;
  isLoading: boolean;
  onUpdateTitle: (newTitle: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  thread,
  onSendMessage,
  isLoading,
  onUpdateTitle,
}) => {
  const [userInput, setUserInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<{
    file: File;
    processed: ProcessedFile;
    preview?: string;
  } | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(thread.title);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /* Removed global body overflow hack — it prevented scrolling on some devices */

  useEffect(() => {
    // Scroll to bottom when messages change or loading state updates.
    // Use block: 'end' to ensure the bottom is visible on mobile keyboards.
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.messages, isLoading]);

  // When the input is focused (mobile keyboard opens), ensure messages are scrolled
  const handleInputFocus = () => {
    // small delay lets the keyboard resize finish on some mobile browsers
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 120);
  };

  const autosize = (el?: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  useEffect(() => {
    autosize(textareaRef.current);
  }, [userInput]);

  useEffect(() => {
    setTitleInput(thread.title);
    setIsEditingTitle(false);
  }, [thread.id, thread.title]);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.includes("pdf")) return "📄";
    return "📎";
  };

  const handleFileAttach = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setIsProcessingFile(true);

    try {
      const processed = await processFile(file);
      const preview =
        processed.type === "image"
          ? `data:${processed.mimeType};base64,${processed.base64}`
          : undefined;

      setAttachedFile({ file, processed, preview });
    } catch (err: any) {
      setFileError(err?.message || "File processing failed");
      setAttachedFile(null);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleSubmit = () => {
    if (isProcessingFile) return;
    if (!userInput.trim() && !attachedFile) return;

    const finalInput =
      userInput.trim() ||
      `Analyze this ${attachedFile?.processed.type}`;

    onSendMessage(finalInput, attachedFile?.processed || null, false);

    setUserInput("");
    setAttachedFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTitleSave = () => {
    if (titleInput.trim() && titleInput !== thread.title) {
      onUpdateTitle(titleInput);
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-50 to-pink-50 p-2 sm:p-4">
      <div className="relative flex flex-col h-full w-full max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Title Bar */}
        <div className="flex items-center gap-2 p-3 border-b bg-white/70">
          {isEditingTitle ? (
            <>
              <input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                className="flex-1 text-lg font-semibold px-2 py-1 rounded border"
                autoFocus
              />
              <button onClick={handleTitleSave}>
                <Check className="w-5 h-5 text-green-600" />
              </button>
              <button onClick={() => setIsEditingTitle(false)}>
                <X className="w-5 h-5 text-red-600" />
              </button>
            </>
          ) : (
            <>
              <h2 className="flex-1 text-lg font-semibold truncate">
                {thread.title}
              </h2>
              <button onClick={() => setIsEditingTitle(true)}>
                <Edit2 className="w-4 h-4 text-slate-500" />
              </button>
            </>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-4" onClick={() => { /* allow tap-to-dismiss keyboard */ }}>
          {thread.messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-lg px-4 py-2 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "bg-slate-300 text-black"
                    : "bg-purple-600 text-white"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white/90 backdrop-blur p-2 sm:p-3">
          {fileError && (
            <div className="mb-2 text-sm text-red-600">{fileError}</div>
          )}

          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              onInput={(e) => autosize(e.currentTarget as HTMLTextAreaElement)}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              onFocus={handleInputFocus}
              placeholder="Ask about your case…"
              rows={1}
              className="
                flex-1 min-h-[44px] max-h-[120px]
                resize-none rounded-full px-4 py-2
                border-2 border-gray-300
                focus:ring-2 focus:ring-purple-500
                text-base
              "
              disabled={isLoading}
            />

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="h-[44px] px-5 rounded-full bg-purple-600 text-white flex items-center gap-1"
            >
              Send <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
