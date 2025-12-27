
import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store';
import { LogType } from '../types';
import SkillCard from './SkillCard';
import SkillGroup from './SkillGroup';
import DescriptionCarousel from './DescriptionCarousel';
import { 
    Terminal, AlertTriangle, GitBranch, Dices, ChevronRight, 
    User, Cpu, Sparkles, Play, ShieldCheck, Stethoscope, 
    FileText, Zap, ArrowRight, X 
} from 'lucide-react';

const TOUR_STEPS = [
    {
        title: "THE CLINICAL BURDEN",
        subtitle: "The Problem",
        icon: <Stethoscope size={32} />,
        color: "bg-memphis-pink",
        content: "You spend 40% of your day purely on documentation. 'Smart Dictation' tools just make you a faster typist. They don't understand medicine, and they don't add value to your practice."
    },
    {
        title: "NEURAL INTELLIGENCE",
        subtitle: "The Solution",
        icon: <Cpu size={32} />,
        color: "bg-memphis-teal",
        content: "Ranvier DATA is not a typewriter. It is a Neural Bridge. It listens to your consult (Live Mode), structures the SOAP note instantly, and cross-references medical logic against local databases."
    },
    {
        title: "VALUE ARTIFACTS",
        subtitle: "The Differentiator",
        icon: <Zap size={32} />,
        color: "bg-memphis-yellow",
        content: "We don't just save text. We generate revenue and education. The system auto-extracts ICD-10 billing codes and creates Anki flashcards for your own continuous learning."
    },
    {
        title: "LOCAL VAULT SHIELD",
        subtitle: "The Privacy",
        icon: <ShieldCheck size={32} />,
        color: "bg-memphis-purple",
        content: "Your patient data shouldn't float in the cloud. Ranvier uses a 'Local First' architecture. Drafts live in your browser's IndexedDB vault until you explicitly sign and release them."
    },
    {
        title: "READY FOR INPUT",
        subtitle: "The Action",
        icon: <Terminal size={32} />,
        color: "bg-black text-white",
        content: "You are in the Alpha environment. Try clicking 'Live' to dictate, or use the Marketplace to execute specific skills. The Neural Bridge is online."
    }
];

const LogStream: React.FC = () => {
  const { logs, isPending } = useAppStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [tourStep, setTourStep] = useState<number>(0); // 0 = inactive, 1-5 = active steps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isPending]);

  const nextStep = () => {
      if (tourStep < TOUR_STEPS.length) {
          setTourStep(tourStep + 1);
      } else {
          setTourStep(0);
      }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-32 max-w-5xl mx-auto w-full font-mono relative">
      
      {/* TOUR OVERLAY */}
      {tourStep > 0 && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-lg bg-white border-4 border-black shadow-memphis-lg relative overflow-hidden flex flex-col">
                  {/* Progress Bar */}
                  <div className="flex">
                      {TOUR_STEPS.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`h-2 flex-1 border-r border-black last:border-r-0 transition-colors duration-300 ${idx < tourStep ? 'bg-memphis-teal' : 'bg-gray-200'}`} 
                          />
                      ))}
                  </div>

                  {/* Card Content */}
                  <div className="p-8 flex-1 flex flex-col items-center text-center">
                        <div className={`p-6 border-4 border-black shadow-memphis mb-6 ${TOUR_STEPS[tourStep - 1].color} ${TOUR_STEPS[tourStep - 1].color.includes('text-white') ? '' : 'text-black'}`}>
                            {TOUR_STEPS[tourStep - 1].icon}
                        </div>
                        
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-50 mb-2">
                            {TOUR_STEPS[tourStep - 1].subtitle}
                        </h3>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">
                            {TOUR_STEPS[tourStep - 1].title}
                        </h2>
                        
                        <p className="font-mono text-sm leading-relaxed mb-8 max-w-sm">
                            {TOUR_STEPS[tourStep - 1].content}
                        </p>

                        <div className="mt-auto flex gap-4 w-full">
                            <button 
                                onClick={() => setTourStep(0)}
                                className="flex-1 py-4 font-black uppercase text-xs hover:bg-red-100 transition-colors"
                            >
                                Skip Tour
                            </button>
                            <button 
                                onClick={nextStep}
                                className="flex-[2] bg-black text-white border-4 border-black py-4 font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-memphis-teal hover:text-black transition-all active:translate-y-1 shadow-memphis-sm active:shadow-none"
                            >
                                {tourStep === TOUR_STEPS.length ? "Initialize System" : "Next Data Point"} <ArrowRight size={14} />
                            </button>
                        </div>
                  </div>
              </div>
          </div>
      )}

      {/* Welcome Message / Empty State - Redesigned to match DIAGRAM */}
      {logs.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] relative pt-12">
            
            {/* Architecture Label (Top Leftish) */}
            <div className="absolute top-0 left-0 animate-in slide-in-from-left-8 duration-1000 hidden md:block">
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

            <div className="w-full max-w-2xl mb-8">
                <DescriptionCarousel />
            </div>
            
            <div className="text-black/70 font-mono text-xs md:text-sm text-center space-y-4 bg-black text-white border-4 border-black p-10 shadow-memphis-lg transform -rotate-1 relative overflow-hidden group max-w-2xl w-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-memphis-teal via-memphis-pink to-memphis-yellow" />
                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:rotate-45 transition-transform duration-1000">
                    <Sparkles size={120} />
                </div>

                <p className="font-black text-memphis-teal uppercase tracking-[0.5em] text-xl mb-4">[SYSTEM_BOOT_SEQUENCE]</p>
                
                <button 
                    onClick={() => setTourStep(1)}
                    className="w-full bg-white text-black py-4 font-black uppercase tracking-widest border-4 border-transparent hover:border-memphis-teal hover:bg-memphis-teal transition-all flex items-center justify-center gap-3 animate-pulse hover:animate-none"
                >
                    <Play size={18} fill="currentColor" /> INITIATE ALPHA TOUR
                </button>

                <div className="pt-6 flex flex-col items-center gap-4">
                    <p className="text-[10px] uppercase opacity-50 tracking-widest">
                        Or execute manual override:
                    </p>
                    <div className="px-6 py-2 border border-white/20 bg-white/5 rounded-full flex items-center gap-3">
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
