import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import { LogType } from '../types';
import SkillCard from './SkillCard';
import SkillGroup from './SkillGroup';
import DescriptionCarousel from './DescriptionCarousel';
import { Terminal, AlertTriangle, GitBranch, Dices, ChevronRight, User, Cpu, Sparkles } from 'lucide-react';

const LogStream: React.FC = () => {
  const { logs, isPending } = useAppStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isPending]);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-32 max-w-5xl mx-auto w-full font-mono relative">
      
      {/* Welcome Message / Empty State - Redesigned to match DIAGRAM */}
      {logs.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] relative pt-12">
            
            {/* Architecture Label (Top Leftish) */}
            <div className="absolute top-0 left-0 animate-in slide-in-from-left-8 duration-1000">
                <div className="flex items-center gap-2 mb-1">
                    <GitBranch size={16} className="text-memphis-pink" />
                    <span className="text-[10px] font-black uppercase text-memphis-pink tracking-[0.4em]">Ranvier Architecture</span>
                </div>
                <div className="w-48 h-0.5 bg-gradient-to-r from-memphis-pink to-transparent opacity-30" />
            </div>

            {/* Rick-Rollable Dice (Top Centerish) */}
            <button 
                onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                className="absolute top-4 right-1/4 group transition-all hover:rotate-12 hover:scale-110 active:scale-95"
                title="Rick-Rollable (Dice)"
            >
                <div className="p-3 bg-white border-4 border-black shadow-memphis-sm rotate-6 group-hover:bg-memphis-yellow">
                    <Dices size={24} className="text-black" />
                </div>
            </button>

            <div className="w-full max-w-2xl">
                <DescriptionCarousel />
            </div>
            
            <div className="text-black/70 font-mono text-xs md:text-sm text-center space-y-4 bg-black text-white border-4 border-black p-10 shadow-memphis-lg transform -rotate-1 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-memphis-teal via-memphis-pink to-memphis-yellow" />
                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:rotate-45 transition-transform duration-1000">
                    <Sparkles size={120} />
                </div>

                <p className="font-black text-memphis-teal uppercase tracking-[0.5em] text-xl mb-4">[SYSTEM_BOOT_SEQUENCE]</p>
                <div className="space-y-2 opacity-80">
                    <p className="flex items-center justify-center gap-3">
                        <span className="text-terminal-dim">ranvier-fluid-skills</span>
                        <span className="px-2 py-0.5 bg-white text-black font-black">v1.0.4</span>
                        <span className="text-memphis-teal">INITIALIZED</span>
                    </p>
                    <p>Neural Bridge: <span className="text-memphis-teal font-black animate-pulse">ONLINE</span></p>
                    <p className="opacity-50 tracking-widest uppercase text-[10px]">Awaiting telemetry handshake...</p>
                </div>

                <div className="pt-8 flex flex-col items-center gap-4">
                    <div className="px-6 py-3 border-2 border-white/20 bg-white/5 rounded-full flex items-center gap-3">
                        <kbd className="bg-white text-black px-2 py-1 font-black text-sm rounded shadow-memphis-sm">/</kbd>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">To Browse Skill Nodes</span>
                    </div>
                </div>
            </div>

            {/* Footer Prompt Arrow */}
            <div className="mt-12 animate-bounce opacity-30">
                <ChevronRight size={32} className="rotate-90" />
            </div>
        </div>
      )}

      {logs.map((log) => (
        <div key={log.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col gap-2 group">
            
            {log.type === LogType.USER_COMMAND && (
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-memphis-pink border-4 border-black p-4 shadow-memphis flex items-start gap-3">
                   <User size={18} className="shrink-0 mt-0.5 text-black" />
                   <span className="text-black font-black uppercase tracking-tight text-sm">{log.content}</span>
                </div>
              </div>
            )}
            
            {log.type === LogType.SYSTEM_LOG && (
               <div className="flex justify-center">
                 <div className="text-memphis-purple font-black text-[10px] uppercase tracking-widest border-2 border-memphis-purple/30 bg-memphis-purple/10 px-5 py-2 rounded-full backdrop-blur-sm">
                    <span className="opacity-40 mr-2">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                    {log.content}
                 </div>
               </div>
            )}

            {log.type === LogType.AI_RESPONSE && (
               <div className="flex justify-start">
                 <div className="max-w-[95%] bg-white border-4 border-black shadow-memphis relative overflow-hidden flex flex-col group/resp">
                    <div className="flex items-center gap-2 px-4 py-2 bg-memphis-teal border-b-4 border-black">
                        <Cpu size={14} className="group-hover/resp:rotate-180 transition-transform duration-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">NEURAL_BRIDGE_OUTPUT</span>
                        <div className="ml-auto flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white" />
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-black bg-black" />
                        </div>
                    </div>
                    <div className="p-5">
                        <p className="text-black font-bold leading-relaxed whitespace-pre-wrap text-sm">{log.content}</p>
                    </div>
                 </div>
               </div>
            )}
            
            {log.type === LogType.ERROR && (
               <div className="flex justify-center">
                 <div className="flex items-center gap-4 text-white bg-red-500 border-4 border-black p-5 shadow-memphis max-w-md">
                    <AlertTriangle size={28} className="shrink-0 animate-pulse" />
                    <p className="font-black uppercase tracking-tighter text-sm">{log.content}</p>
                 </div>
               </div>
            )}

            {log.type === LogType.IMAGE && log.metadata?.base64 && (
               <div className="flex justify-start">
                 <div className="mt-4 border-4 border-black bg-black p-1.5 shadow-memphis-lg max-w-full">
                    <img 
                        src={`data:image/png;base64,${log.metadata.base64}`} 
                        alt="AI Generated" 
                        className="w-full h-auto block"
                    />
                 </div>
               </div>
            )}

            {(log.type === LogType.SKILL_EXECUTION || log.type === LogType.SKILL_GROUP) && (
              <div className="mt-3 pl-6 border-l-4 border-memphis-yellow">
                  {log.type === LogType.SKILL_EXECUTION && log.metadata && <SkillCard data={log.metadata} />}
                  {log.type === LogType.SKILL_GROUP && log.metadata && (
                      <SkillGroup 
                          skills={log.metadata.skills} 
                          mode={log.metadata.mode || 'sequential'} 
                      />
                  )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Pending State Indicator */}
      {isPending && (
        <div className="flex items-center gap-5 bg-memphis-yellow border-4 border-black p-5 shadow-memphis animate-pulse w-fit mx-auto mt-10">
           <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
           <span className="font-black uppercase text-xs tracking-[0.3em]">Neural Compute Active...</span>
        </div>
      )}

      <div ref={bottomRef} className="h-20" />
    </main>
  );
};

export default LogStream;