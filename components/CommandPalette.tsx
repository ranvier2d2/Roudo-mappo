
import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import { 
    Search, Terminal, Map, Mic, History, Trash2, 
    LogOut, UserCircle, X, ChevronRight, Zap, Code2, ShoppingBag 
} from 'lucide-react';
import { saveConversationToHistory } from '../services/api';

interface CommandItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    shortcut?: string;
    action: () => void;
    group: 'Navigation' | 'Actions' | 'System';
}

const CommandPalette: React.FC = () => {
    const { 
        isCommandPaletteOpen, 
        setCommandPaletteOpen,
        setView,
        setLiveModalOpen,
        setHistoryModalOpen,
        setAuthModalOpen,
        clearLogs,
        user,
        setUser,
        logs
    } = useAppStore();

    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset when opening
    useEffect(() => {
        if (isCommandPaletteOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isCommandPaletteOpen]);

    const handleLogout = () => {
        if (user) {
            saveConversationToHistory(user, logs);
            clearLogs();
            setUser(null);
            setView('TERMINAL');
        }
    };

    // Define Commands
    const commands: CommandItem[] = [
        // Navigation
        {
            id: 'nav-terminal',
            label: 'Go to Terminal',
            icon: <Terminal size={16} />,
            group: 'Navigation',
            action: () => setView('TERMINAL')
        },
        {
            id: 'nav-marketplace',
            label: 'Browse Skills Marketplace',
            icon: <ShoppingBag size={16} />,
            group: 'Navigation',
            action: () => setView('SKILLS_MARKETPLACE')
        },
        {
            id: 'nav-roadmap',
            label: 'Go to Roadmap',
            icon: <Map size={16} />,
            group: 'Navigation',
            action: () => setView('ROADMAP')
        },
        // Actions
        {
            id: 'act-live',
            label: 'Start Live Voice Session',
            icon: <Mic size={16} />,
            group: 'Actions',
            action: () => setLiveModalOpen(true)
        },
        {
            id: 'act-history',
            label: 'View Session History',
            icon: <History size={16} />,
            group: 'Actions',
            action: () => setHistoryModalOpen(true)
        },
        {
            id: 'act-clear',
            label: 'Clear Console Logs',
            icon: <Trash2 size={16} />,
            group: 'Actions',
            action: () => clearLogs()
        },
        // System
        {
            id: 'sys-login',
            label: user ? `Logout (${user.username})` : 'Login / Authenticate',
            icon: user ? <LogOut size={16} /> : <UserCircle size={16} />,
            group: 'System',
            action: () => user ? handleLogout() : setAuthModalOpen(true)
        }
    ];

    // Filter Logic
    const filteredCommands = commands.filter(cmd => 
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isCommandPaletteOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    setCommandPaletteOpen(false);
                }
            } else if (e.key === 'Escape') {
                setCommandPaletteOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCommandPaletteOpen, filteredCommands, selectedIndex, setCommandPaletteOpen]);

    if (!isCommandPaletteOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4">
            <div 
                className="w-full max-w-lg bg-terminal-dark border border-terminal-border rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Input Area */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-terminal-border">
                    <Search size={18} className="text-terminal-dim" />
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent border-none text-white placeholder-terminal-dim focus:ring-0 focus:outline-none font-mono text-sm h-6"
                    />
                    <div className="flex items-center gap-1">
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-terminal-dim bg-terminal-black border border-terminal-border rounded">ESC</kbd>
                    </div>
                </div>

                {/* Results List */}
                <div className="max-h-[300px] overflow-y-auto py-2">
                    {filteredCommands.length === 0 ? (
                        <div className="px-4 py-8 text-center text-terminal-dim text-sm font-mono">
                            No commands found.
                        </div>
                    ) : (
                        filteredCommands.map((cmd, index) => (
                            <button
                                key={cmd.id}
                                onClick={() => {
                                    cmd.action();
                                    setCommandPaletteOpen(false);
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`w-full text-left px-4 py-3 flex items-center justify-between group transition-colors
                                    ${index === selectedIndex ? 'bg-terminal-accent/10 border-l-2 border-terminal-accent' : 'border-l-2 border-transparent'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`${index === selectedIndex ? 'text-terminal-accent' : 'text-terminal-dim'}`}>
                                        {cmd.icon}
                                    </span>
                                    <span className={`font-mono text-sm ${index === selectedIndex ? 'text-white' : 'text-gray-400'}`}>
                                        {cmd.label}
                                    </span>
                                </div>
                                {index === selectedIndex && (
                                    <ChevronRight size={14} className="text-terminal-accent animate-pulse" />
                                )}
                            </button>
                        ))
                    )}
                </div>

                {/* Footer Tip */}
                <div className="bg-terminal-black/50 px-4 py-2 border-t border-terminal-border flex justify-between items-center text-[10px] text-terminal-dim font-mono">
                    <div className="flex items-center gap-2">
                        <Zap size={10} />
                        <span>PRO TIP: Use arrow keys to navigate</span>
                    </div>
                    <span>{filteredCommands.length} results</span>
                </div>
            </div>

            {/* Backdrop Close Click */}
            <div className="absolute inset-0 -z-10" onClick={() => setCommandPaletteOpen(false)} />
        </div>
    );
};

export default CommandPalette;
