
import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, Terminal, Map, Mic, History, Trash2, 
    LogOut, UserCircle, X, ChevronRight, Zap, ShieldAlert, ShoppingBag 
} from 'lucide-react';
import { ViewMode } from '../types';
import { useAppStore } from '../store';

interface CommandMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: ViewMode) => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose, onNavigate }) => {
    const { 
        clearLogs,
        user,
        setUser,
        setLiveModalOpen,
        setHistoryModalOpen,
        setAuthModalOpen
    } = useAppStore();

    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const commands = [
        { id: 'terminal', label: 'Go to Terminal', icon: <Terminal size={16} />, action: () => onNavigate('TERMINAL') },
        { id: 'marketplace', label: 'Browse Skills Marketplace', icon: <ShoppingBag size={16} />, action: () => onNavigate('SKILLS_MARKETPLACE') },
        { id: 'roadmap', label: 'Go to Roadmap', icon: <Map size={16} />, action: () => onNavigate('ROADMAP') },
        { id: 'security', label: 'Go to Security', icon: <ShieldAlert size={16} />, action: () => onNavigate('SECURITY') },
        { id: 'live', label: 'Start Live Session', icon: <Mic size={16} />, action: () => setLiveModalOpen(true) },
        { id: 'history', label: 'View History', icon: <History size={16} />, action: () => setHistoryModalOpen(true) },
        { id: 'clear', label: 'Clear Logs', icon: <Trash2 size={16} />, action: () => clearLogs() },
        { id: 'auth', label: user ? `Logout (${user.username})` : 'Login / Authenticate', icon: user ? <LogOut size={16} /> : <UserCircle size={16} />, action: () => user ? setUser(null) : setAuthModalOpen(true) },
    ];

    const filtered = commands.filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase()));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filtered.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filtered[selectedIndex]) {
                    filtered[selectedIndex].action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filtered, selectedIndex, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
            <div className="w-full max-w-xl bg-white border-4 border-black shadow-memphis-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 px-4 py-3 border-b-4 border-black bg-memphis-yellow">
                    <Search size={20} className="text-black" />
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                        placeholder="Type a command..."
                        className="flex-1 bg-transparent border-none text-black placeholder-black/50 focus:ring-0 focus:outline-none font-mono font-bold text-sm"
                    />
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white border-2 border-black">ESC</kbd>
                </div>

                <div className="max-h-[350px] overflow-y-auto py-2 bg-memphis-beige">
                    {filtered.map((cmd, index) => (
                        <button
                            key={cmd.id}
                            onClick={() => { cmd.action(); onClose(); }}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors
                                ${index === selectedIndex ? 'bg-memphis-pink text-black' : 'hover:bg-memphis-teal'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                {cmd.icon}
                                <span className="font-mono font-bold text-sm">{cmd.label}</span>
                            </div>
                            {index === selectedIndex && <ChevronRight size={16} />}
                        </button>
                    ))}
                    {filtered.length === 0 && (
                        <div className="px-4 py-10 text-center font-mono text-gray-500 italic">No matches found.</div>
                    )}
                </div>

                <div className="bg-black text-white px-4 py-2 border-t-2 border-black flex justify-between items-center text-[10px] font-mono font-bold">
                    <div className="flex items-center gap-2"><Zap size={10} /> Use arrows to navigate</div>
                    <span>{filtered.length} RESULTS</span>
                </div>
            </div>
        </div>
    );
};

export default CommandMenu;
