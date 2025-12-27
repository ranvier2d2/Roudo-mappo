import React, { useState } from 'react';
import { useAppStore } from '../store';
import { loginUser } from '../services/api';
import { X, User, Lock, ArrowRight } from 'lucide-react';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, setUser } = useAppStore();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    try {
        const user = await loginUser(username);
        setUser(user);
        setAuthModalOpen(false);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-terminal-dark border border-terminal-border w-full max-w-md p-6 rounded-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 text-terminal-dim hover:text-white"
        >
            <X size={20} />
        </button>

        <h2 className="text-xl font-bold font-mono text-white mb-6 flex items-center gap-2">
            <User className="text-terminal-accent" />
            AUTHENTICATION
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs text-terminal-dim font-mono uppercase">Username</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-dim" size={16} />
                    <input 
                        type="text" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full bg-black/50 border border-terminal-border rounded p-2 pl-10 text-white font-mono focus:border-terminal-accent focus:outline-none"
                        placeholder="Enter identifier..."
                    />
                </div>
            </div>
            <div className="space-y-1 opacity-50 pointer-events-none">
                <label className="text-xs text-terminal-dim font-mono uppercase">Password (Optional for Demo)</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-dim" size={16} />
                    <input 
                        type="password" 
                        className="w-full bg-black/50 border border-terminal-border rounded p-2 pl-10 text-white font-mono"
                        value="password"
                        readOnly
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-terminal-accent/10 hover:bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/50 p-2 rounded font-mono text-sm flex items-center justify-center gap-2 transition-colors"
            >
                {loading ? 'AUTHENTICATING...' : (
                    <>
                        ACCESS TERMINAL <ArrowRight size={16} />
                    </>
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
