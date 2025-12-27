import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Map,
  Mic,
  Search,
  Menu,
  X,
  ShieldAlert,
  UserCircle,
  ShoppingBag,
  ChevronDown,
  FileText,
  EyeOff,
  Eye,
  ShieldCheck,
  Cpu,
  Zap,
  Activity
} from 'lucide-react';
import { useAppStore } from '../store';
import TerminalInput from './TerminalInput';
import CommandMenu from './CommandMenu';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { 
    currentView, 
    setView, 
    isCommandPaletteOpen, 
    setCommandPaletteOpen,
    user, 
    setUser, 
    setAuthModalOpen, 
    setLiveModalOpen,
    currentEncounter,
    privacyMode,
    setPrivacyMode,
    loadEncounters,
    isPending
  } = useAppStore();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
      loadEncounters();
  }, [loadEncounters]);

  const handleAuthClick = () => {
    if (user) {
      setUser(null);
    } else {
      setAuthModalOpen(true);
    }
    setIsMobileMenuOpen(false);
  };

  const handleNav = (view: any) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-memphis-beige text-black font-mono flex flex-col selection:bg-memphis-pink selection:text-black">
      {/* Refined Header */}
      <header className="h-20 border-b-4 border-black flex items-center justify-between px-6 sticky top-0 bg-white z-40 shadow-sm">
        
        {/* Left: Brand & System Status */}
        <div className="flex items-center gap-6">
          <div 
            className="group flex items-center gap-3 cursor-pointer" 
            onClick={() => handleNav('TERMINAL')}
          >
            <div className="bg-black text-white font-black px-4 py-1.5 text-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0 group-active:shadow-none">
              DATA
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-memphis-purple/5 text-memphis-purple border-2 border-memphis-purple/20 text-[9px] font-black uppercase">
             <ShieldCheck size={12} /> HIPAA Protected Mode
          </div>
        </div>

        {/* Center: View Switcher */}
        <nav className="hidden xl:flex items-center p-1 bg-gray-100 border-2 border-black shadow-memphis-sm">
          <NavTab 
            active={currentView === 'TERMINAL'} 
            onClick={() => handleNav('TERMINAL')}
            icon={<Terminal size={14} />}
            label="TERMINAL"
          />
          {currentEncounter && (
            <NavTab 
              active={currentView === 'CLINICAL_ENCOUNTER'} 
              onClick={() => handleNav('CLINICAL_ENCOUNTER')}
              icon={<FileText size={14} className="text-memphis-pink" />}
              label="ENCOUNTER"
            />
          )}
          <NavTab 
            active={currentView === 'SKILLS_MARKETPLACE'} 
            onClick={() => handleNav('SKILLS_MARKETPLACE')}
            icon={<ShoppingBag size={14} />}
            label="MARKETPLACE"
          />
          <NavTab 
            active={currentView === 'ROADMAP'} 
            onClick={() => handleNav('ROADMAP')}
            icon={<Map size={14} />}
            label="ROADMAP"
          />
          <NavTab 
            active={currentView === 'SECURITY'} 
            onClick={() => handleNav('SECURITY')}
            icon={<ShieldAlert size={14} />}
            label="SECURITY"
          />
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 mr-3 border-r-2 border-black/10 pr-3">
            
            {/* Privacy Toggle */}
            <button
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase transition-all border-2 border-black shadow-memphis-sm active:shadow-none active:translate-y-0.5 ${privacyMode ? 'bg-black text-white' : 'bg-white text-black hover:bg-memphis-beige'}`}
                title={privacyMode ? "Disable Privacy Mask" : "Enable Privacy Mask"}
            >
                {privacyMode ? <EyeOff size={14} /> : <Eye size={14} />}
                {privacyMode ? "Private" : "Public"}
            </button>

            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-black"
            >
              <Search size={14} />
              <kbd className="bg-black/5 px-1.5 py-0.5 rounded ml-1 text-[8px]">⌘K</kbd>
            </button>

            <button
              onClick={() => setLiveModalOpen(true)}
              className="group flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase bg-memphis-pink border-2 border-black shadow-memphis-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Mic size={14} className="group-hover:animate-pulse" />
              Live
            </button>
          </div>

          <button
            onClick={handleAuthClick}
            className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-black hover:bg-memphis-yellow transition-colors shadow-memphis-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
          >
            {user ? (
              <>
                <div className="w-5 h-5 bg-memphis-purple border border-black rounded-sm flex items-center justify-center">
                  <UserCircle size={14} className="text-white" />
                </div>
                <span className={`text-[11px] font-black uppercase hidden sm:inline ${privacyMode ? 'blur-[2px]' : ''}`}>{user.username}</span>
                <ChevronDown size={12} className="opacity-40" />
              </>
            ) : (
              <>
                <UserCircle size={18} />
                <span className="text-[11px] font-black uppercase">Login</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 border-2 border-black bg-white shadow-memphis-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-20 bg-white/98 backdrop-blur-sm z-30 p-6 animate-in slide-in-from-top-4 duration-300 border-b-4 border-black">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
               <MobileNavButton 
                  active={currentView === 'TERMINAL'} 
                  onClick={() => handleNav('TERMINAL')} 
                  icon={<Terminal size={18}/>} 
                  label="Terminal" 
               />
               {currentEncounter && (
                   <MobileNavButton 
                      active={currentView === 'CLINICAL_ENCOUNTER'} 
                      onClick={() => handleNav('CLINICAL_ENCOUNTER')} 
                      icon={<FileText size={18}/>} 
                      label="Encounter" 
                   />
               )}
               <MobileNavButton 
                  active={currentView === 'SKILLS_MARKETPLACE'} 
                  onClick={() => handleNav('SKILLS_MARKETPLACE')} 
                  icon={<ShoppingBag size={18}/>} 
                  label="Marketplace" 
               />
               <MobileNavButton 
                  active={currentView === 'ROADMAP'} 
                  onClick={() => handleNav('ROADMAP')} 
                  icon={<Map size={18}/>} 
                  label="Roadmap" 
               />
               <MobileNavButton 
                  active={currentView === 'SECURITY'} 
                  onClick={() => handleNav('SECURITY')} 
                  icon={<ShieldAlert size={18}/>} 
                  label="Security" 
               />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-32 relative">
        {children}

        {/* Skill/Application State (Real-time tRPC) - AS SEEN IN DIAGRAM */}
        <div className="fixed bottom-28 right-8 z-[48] hidden lg:block animate-in slide-in-from-right-8 duration-700">
            <div className="bg-terminal-dark/80 backdrop-blur-md border-2 border-terminal-border p-4 shadow-memphis-lg w-64 rotate-1 group">
                <div className="flex items-center justify-between mb-3 border-b border-white/20 pb-2">
                    <span className="text-[10px] font-black uppercase text-memphis-teal flex items-center gap-2">
                        <Zap size={12} className="animate-pulse" /> Real-time tRPC
                    </span>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-memphis-pink animate-ping" />
                        <div className="w-1.5 h-1.5 rounded-full bg-memphis-teal" />
                    </div>
                </div>
                <div className="space-y-2 font-mono text-[9px] uppercase">
                    <div className="flex justify-between">
                        <span className="opacity-40">State:</span>
                        <span className="text-white">{isPending ? 'Neural_Sync' : 'Nominal'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="opacity-40">Latency:</span>
                        <span className="text-memphis-teal">42ms</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="opacity-40">Node:</span>
                        <span className="text-white">Santiago-A</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                        <span className="opacity-40">Bridge:</span>
                        <span className="text-memphis-yellow">ACTIVE_LINK</span>
                    </div>
                </div>
            </div>
            {/* Visual Arrow indicating State flow */}
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-memphis-pink rotate-180 opacity-50">
                <Activity size={24} />
            </div>
        </div>
      </main>

      {/* Footer Terminal */}
      <footer className="fixed bottom-0 left-0 right-0 z-50">
        <TerminalInput />
      </footer>

      <CommandMenu
        isOpen={isCommandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={setView}
      />
    </div>
  );
}

const NavTab: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 flex items-center gap-2 text-[10px] font-black transition-all border-2 ${
      active 
        ? 'bg-memphis-teal text-black border-black shadow-memphis-sm translate-x-[-1px] translate-y-[-1px]' 
        : 'text-gray-500 border-transparent hover:text-black hover:bg-white/50'
    }`}
  >
    {icon}
    <span className="tracking-widest">{label}</span>
  </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`p-4 border-2 border-black flex flex-col items-center gap-2 font-black uppercase text-[10px] transition-all ${
      active ? 'bg-memphis-teal shadow-memphis-sm' : 'bg-white'
    }`}
  >
    {icon}
    {label}
  </button>
);