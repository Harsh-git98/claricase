import React from 'react';
import LogoIcon from './icons/LogoIcon';

interface SummaryViewProps {
  summary: string;
  isLoading: boolean;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary, isLoading }) => {
  return (
    <div className="relative flex flex-col h-full bg-gradient-to-br from-white/75 via-purple-100/60 to-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_-25px_rgba(109,40,217,0.35)] rounded-[26px] overflow-hidden">
    
        {/* Watermark Background */}
        <div
          className="pointer-events-none select-none absolute inset-0 flex flex-col items-center justify-center opacity-70 rounded-full z-0"
          
        >
          <LogoIcon className="w-24 h-24 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Summary</h2>
          <p className="text-slate-500">Get a concise overview of your case details.</p>
        </div>
      <div className="p-4 border-b border-white/60 bg-gradient-to-r from-purple-100/80 via-purple-50 to-pink-100/70 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">Case Summary</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (!summary || summary.includes("generated yet")) ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap z-10">
            {summary}
          </div>
        )}
      </div>
    </div>
  );
};
