import React from 'react';
import { MindMapNode } from '../types';
import { XIcon } from './icons/XIcon';

interface NodeDetailModalProps {
  node: MindMapNode;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({ node, onClose }) => {
  // Simple effect to handle Escape key press
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-1 rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Node Details</h2>
        <div>
            <p className="text-sm text-gray-500">ID</p>
            <p className="font-mono bg-slate-100 p-2 rounded-md text-sm text-gray-800 break-all">{node.id}</p>
        </div>
        <div className="mt-4">
            <p className="text-sm text-gray-500">Label</p>
            <p className="text-lg text-gray-900">{node.label}</p>
        </div>
      </div>
    </div>
  );
};
