import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { XIcon } from './icons/XIcon';
import { PlusIcon } from './icons/PlusIcon';

interface NotesPopupProps {
  notes: Note[];
  onClose: () => void;
  onCreate: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, patch: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

export const NotesPopup: React.FC<NotesPopupProps> = ({ notes, onClose, onCreate, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    if (!editingId) {
      setTitle('');
      setContent('');
    } else {
      const n = notes.find((x) => x.id === editingId);
      setTitle(n?.title || '');
      setContent(n?.content || '');
    }
  }, [editingId, notes]);

  const startNew = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setShowEditor(true);
  };

  const save = () => {
    const trimmedTitle = title.trim() || 'Untitled';
    const trimmedContent = content.trim();
    if (editingId) {
      onUpdate(editingId, { title: trimmedTitle, content: trimmedContent, updatedAt: new Date().toISOString() });
    } else {
      onCreate({ title: trimmedTitle, content: trimmedContent });
    }
    setEditingId(null);
    setTitle('');
    setContent('');
    setShowEditor(false);
  };

  const handleEditNote = (id: string) => {
    setEditingId(id);
    setShowEditor(true);
  };

  const handleBack = () => {
    setShowEditor(false);
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-purple-900/50 to-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-[95vh] sm:h-[90vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {showEditor ? (editingId ? 'Edit Note' : 'New Note') : 'My Notes'}
          </h3>
          <div className="flex items-center gap-2 sm:gap-3">
            {!showEditor && (
              <button 
                onClick={startNew} 
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline">New Note</span>
              </button>
            )}
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg sm:rounded-xl text-slate-600 hover:bg-white/80 transition-all duration-200"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="h-[calc(100%-73px)] sm:h-[calc(100%-89px)] overflow-hidden">
          {!showEditor ? (
            /* Notes Grid View */
            <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-slate-50/50 to-white">
              {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
                    <PlusIcon className="w-10 h-10 text-purple-600" />
                  </div>
                  <p className="text-lg font-semibold text-slate-700 mb-2">No notes yet</p>
                  <p className="text-sm text-slate-500">Create your first note to get started</p>
                  <button 
                    onClick={startNew}
                    className="mt-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Create Note
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes.map((n) => (
                    <div
                      key={n.id}
                      className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 cursor-pointer relative overflow-hidden"
                      onClick={() => handleEditNote(n.id)}
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      
                      <h4 className="font-bold text-lg text-slate-800 mb-2 truncate">{n.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4 min-h-[60px]">{n.content || 'No content'}</p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400">
                          {new Date(n.updatedAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(n.id);
                          }}
                          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors font-medium opacity-0 group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Editor View */
            <div className="h-full flex flex-col bg-white p-4 sm:p-6">
              <button
                onClick={handleBack}
                className="mb-4 text-sm text-slate-600 hover:text-purple-600 flex items-center gap-2 font-medium transition-colors"
              >
                <span>←</span> Back to notes
              </button>
              
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
                className="text-2xl sm:text-3xl font-bold mb-4 border-b-2 border-slate-200 p-3 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-300"
              />
              
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your thoughts..."
                className="flex-1 p-4 border-2 border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all placeholder:text-slate-300 text-slate-700 text-base"
              />

              <div className="flex items-center justify-end gap-3 mt-4">
                <button 
                  onClick={handleBack} 
                  className="px-4 sm:px-5 py-2.5 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-all font-medium text-slate-700 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button 
                  onClick={save} 
                  className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};