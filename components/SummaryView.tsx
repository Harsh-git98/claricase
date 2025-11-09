import React from 'react';

interface SummaryViewProps {
  summary: string;
  isLoading: boolean;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary, isLoading }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
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
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {summary}
          </div>
        )}
      </div>
    </div>
  );
};
