import React, { useState, useRef, useEffect } from "react";
import { CaseThread } from "../types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  MessageSquare,
  User
} from "lucide-react";

interface ChatViewProps {
  thread: CaseThread;
  onSendMessage: (
    message: string,
    imageBase64: string | null,
    thinking: boolean
  ) => void;
  isLoading: boolean;
  onUpdateTitle?: (newTitle: string) => void;
  onClose?: () => void;
  onSave?: (...args: any[]) => void;
}

export const QuickChatView: React.FC<ChatViewProps> = ({
  thread,
  onSendMessage,
  isLoading,
}) => {
  const [userInput, setUserInput] = useState("");
  const [attachedImage, setAttachedImage] = useState<{
    file: File;
    base64: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Removed global body overflow hack; instead handle focus-based scrolling.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.messages, isLoading]);

  const handleInputFocus = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 120);
  };

  const autosize = (el?: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() && !attachedImage) return;

    const finalMsg =
      userInput.trim() ||
      (attachedImage?.file.type === "application/pdf"
        ? "Analyze this PDF"
        : "Analyze this image");

    onSendMessage(finalMsg, attachedImage?.base64 || null, false);

    setUserInput("");
    setAttachedImage(null);
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-50 to-pink-50 p-2 sm:p-4">
      <div
        className="
          relative flex flex-col h-full w-full max-w-4xl mx-auto
          bg-gradient-to-br from-white/75 via-purple-100/60 to-white/75
          backdrop-blur-2xl border border-white/60
          shadow-[0_20px_60px_-25px_rgba(109,40,217,0.35)]
          rounded-2xl overflow-hidden
        "
      >

        {/* Watermark */}
        {thread.messages.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-30">
            <MessageSquare className="w-20 h-20 text-slate-300 mb-3" />
            <h2 className="text-lg font-semibold text-slate-700">
              Quick Chat
            </h2>
            <p className="text-slate-500 text-sm text-center px-4">
              Ask questions about any legal topic.
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4" onClick={() => { /* tap to dismiss keyboard */ }}>
          {thread.messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-lg px-4 py-2 rounded-xl text-sm prose prose-sm max-w-none ${
                  msg.role === "user"
                    ? "bg-slate-200 text-gray-900"
                    : "bg-purple-600 text-white prose-invert"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 items-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              <div className="bg-slate-100 px-3 py-2 rounded-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-400" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="
            border-t border-white/60
            bg-white/90 backdrop-blur
            p-2 sm:p-3
            flex gap-2 items-end
          "
        >
          <textarea
            ref={textareaRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onInput={(e) => autosize(e.currentTarget as HTMLTextAreaElement)}
            onFocus={handleInputFocus}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask your legal question…"
            rows={1}
            className="
              flex-1 min-h-[44px] max-h-[200px]
              resize-none rounded-full
              px-4 py-2
              border-2 border-gray-300
              focus:ring-2 focus:ring-purple-500
              text-base
            "
          />

          <button
            type="submit"
            disabled={!userInput.trim()}
            className="
              h-[44px] px-5
              rounded-full bg-purple-600 text-white
              flex items-center gap-1
              disabled:opacity-50
            "
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
