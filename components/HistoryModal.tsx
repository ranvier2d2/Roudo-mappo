import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { getHistory } from '../services/api';
import { Conversation } from '../types';
import { X, Clock, MessageSquare, RotateCcw } from 'lucide-react';

const HistoryModal: React.FC = () => {
  const { isHistoryModalOpen, setHistoryModalOpen, user, loadConversation } = useAppStore();
  const [history, setHistory] = useState<Conversation[]>([]);

  useEffect(() => {
    if (isHistoryModalOpen && user) {
        setHistory(getHistory(user));
    }
  }, [isHistoryModalOpen, user]);

  if (!isHistoryModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-terminal-dark border border-terminal-border w-full max-w-2xl h-[80vh] flex flex-col rounded-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-terminal-border flex justify-between items-center">
            <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <Clock className="text-terminal-warning" />
                SESSION HISTORY
            </h2>
            <button 
                onClick={() => setHistoryModalOpen(false)}
                className="text-terminal-dim hover:text-white"
            >
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!user ? (
                 <div className="text-center py-10 text-terminal-dim font-mono">
                    Please login to view history.
                 </div>
            ) : history.length === 0 ? (
                <div className="text-center py-10 text-terminal-dim font-mono">
                    No history found.
                </div>
            ) : (
                history.map((conv) => (
                    <button
                        key={conv.id}
                        onClick={() => {
                            loadConversation(conv.logs);
                            setHistoryModalOpen(false);
                        }}
                        className="w-full text-left bg-black/30 hover:bg-white/5 border border-terminal-border p-3 rounded group transition-all"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-terminal-accent font-mono">{conv.date}</span>
                            <RotateCcw size={14} className="text-terminal-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300 font-mono truncate">
                            <MessageSquare size={14} className="shrink-0 text-terminal-dim" />
                            <span className="truncate">{conv.preview}</span>
                        </div>
                    </button>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
