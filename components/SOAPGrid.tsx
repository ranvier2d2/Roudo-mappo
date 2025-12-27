
import React from 'react';
import { useAppStore } from '../store';
import { SOAPData, SOAPTextKey } from '../types';
import { Brain, FileText, Activity, ClipboardList, Sparkles, Loader2, ShieldCheck, Hash, Tag, Save, Lock, GraduationCap, PenTool } from 'lucide-react';

const SOAPGrid: React.FC = () => {
  const { currentEncounter, updateEncounterField, processEncounter, isPending, privacyMode, saveCurrentEncounter, signCurrentEncounter } = useAppStore();

  if (!currentEncounter) return (
    <div className="flex flex-col items-center justify-center h-full text-terminal-dim font-mono">
        <Activity size={48} className="mb-4 opacity-20" />
        <p className="uppercase tracking-widest font-black">No Active Encounter</p>
    </div>
  );

  const isSigned = currentEncounter.status === 'signed';

  const sections: { key: SOAPTextKey, title: string, color: string, icon: any, desc: string }[] = [
    { key: 'subjective', title: 'Subjective', color: 'bg-memphis-yellow', icon: <MessageCircleIcon />, desc: 'Symptoms, history, patient concerns.' },
    { key: 'objective', title: 'Objective', color: 'bg-memphis-teal', icon: <Activity size={18}/>, desc: 'Vital signs, physical exam, labs.' },
    { key: 'assessment', title: 'Assessment', color: 'bg-memphis-pink', icon: <Brain size={18}/>, desc: 'Diagnosis, differential diagnosis.' },
    { key: 'plan', title: 'Plan', color: 'bg-memphis-purple', icon: <ClipboardList size={18}/>, desc: 'Medications, follow-up, tests.' }
  ];

  const handleAIScribe = async () => {
      if (currentEncounter.rawTranscript.length === 0) {
          alert("Capture some audio first! The Brain needs clinical input to structure the note.");
          return;
      }
      await processEncounter();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-memphis-beige p-4 md:p-8 animate-in fade-in duration-500 relative">
      
      {/* Loading Overlay */}
      {isPending && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
              <div className="bg-black text-white border-4 border-black p-8 shadow-memphis flex flex-col items-center gap-6 max-w-sm text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-memphis-teal" />
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-widest mb-2">Neural Scribe & Coder</h3>
                    <p className="text-xs font-mono opacity-70">Gemini is structuring SOAP and extracting ICD-10/CPT codes...</p>
                  </div>
              </div>
          </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b-4 border-black pb-4 gap-4">
        <div className="relative group">
            <h2 className={`text-2xl font-black uppercase tracking-tighter flex items-center gap-3 transition-all duration-300 ${privacyMode ? 'blur-md hover:blur-none cursor-help' : ''}`}>
                <FileText className="text-memphis-pink shrink-0" /> 
                Clinical Note: {currentEncounter.patientName}
            </h2>
            <div className="flex items-center gap-3 mt-1">
                <p className="text-[10px] font-bold opacity-60 uppercase">
                    Started: {new Date(currentEncounter.timestamp).toLocaleTimeString()} • ID: {currentEncounter.id.split('-')[0]}
                </p>
                {isSigned ? (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black text-white border border-black rounded-full text-[8px] font-black uppercase">
                        <Lock size={8} /> Signed & Locked
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-memphis-purple/10 text-memphis-purple border border-memphis-purple/20 rounded-full text-[8px] font-black uppercase">
                        <ShieldCheck size={8} /> Vault Active (Draft)
                    </div>
                )}
            </div>
        </div>
        <div className="flex gap-3">
            {!isSigned && (
                <>
                <button 
                    onClick={saveCurrentEncounter}
                    className="flex items-center gap-2 px-4 py-3 bg-white border-4 border-black font-black uppercase text-xs hover:bg-memphis-yellow transition-all shadow-memphis-sm active:translate-y-1 active:shadow-none"
                >
                    <Save size={14} /> Save Draft
                </button>
                <button 
                    onClick={handleAIScribe}
                    disabled={isPending}
                    className={`flex items-center gap-2 px-6 py-3 border-4 border-black font-black uppercase text-xs transition-all shadow-memphis active:translate-x-1 active:translate-y-1 ${isPending ? 'bg-gray-200 opacity-50 cursor-not-allowed' : 'bg-black text-white hover:bg-memphis-teal hover:text-black'}`}
                >
                    <Sparkles size={14} className={isPending ? 'animate-spin' : ''} /> 
                    {isPending ? 'Thinking...' : 'Process Brain'}
                </button>
                <button
                    onClick={signCurrentEncounter}
                    className="flex items-center gap-2 px-6 py-3 bg-memphis-teal border-4 border-black font-black uppercase text-xs hover:bg-memphis-pink transition-all shadow-memphis active:translate-x-1 active:translate-y-1"
                >
                    <PenTool size={14} /> Sign & Finalize
                </button>
                </>
            )}
            {isSigned && (
                <div className="flex items-center gap-4 bg-black text-white px-6 py-3 border-4 border-black shadow-memphis">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-memphis-teal">
                        <CheckIcon /> Encounter Finalized
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-memphis-yellow">
                        <GraduationCap size={16} /> +{currentEncounter.cmePoints} CME Credits
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => (
            <div key={section.key} className={`flex flex-col border-4 border-black shadow-memphis bg-white overflow-hidden group ${isSigned ? 'opacity-90' : ''}`}>
                <div className={`flex items-center justify-between px-4 py-2 border-b-4 border-black ${section.color}`}>
                    <div className="flex items-center gap-2">
                        {section.icon}
                        <span className="font-black uppercase text-sm tracking-tight">{section.title}</span>
                    </div>
                    {currentEncounter.soap[section.key] && !isPending && !isSigned && (
                        <div className="flex items-center gap-1.5 bg-white/30 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                            <Sparkles size={8} /> AI Sync
                        </div>
                    )}
                    {isSigned && <Lock size={12} className="opacity-50" />}
                </div>
                <textarea 
                    value={currentEncounter.soap[section.key]}
                    onChange={(e) => updateEncounterField(section.key, e.target.value)}
                    placeholder={`Awaiting ${section.title}...`}
                    className="flex-1 w-full p-4 font-mono text-sm focus:outline-none focus:bg-memphis-beige/20 resize-none transition-colors"
                    disabled={isPending || isSigned}
                />
            </div>
            ))}
        </div>

        {/* Medical Coding Sidebar */}
        <div className="flex flex-col border-4 border-black shadow-memphis bg-white overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b-4 border-black bg-black text-white">
                <Tag size={18} className="text-memphis-yellow" />
                <span className="font-black uppercase text-sm tracking-tight">Billing & Coding</span>
            </div>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-memphis-beige/10">
                {currentEncounter.soap.coding && currentEncounter.soap.coding.length > 0 ? (
                    currentEncounter.soap.coding.map((item, idx) => (
                        <div key={idx} className="bg-white border-2 border-black p-3 shadow-memphis-sm group hover:-translate-y-1 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${item.type === 'ICD-10' ? 'bg-memphis-pink' : 'bg-memphis-teal'}`}>
                                    {item.type}
                                </span>
                                <span className="text-xs font-black font-mono">#{item.code}</span>
                            </div>
                            <p className="text-xs font-bold leading-tight uppercase opacity-80">{item.description}</p>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center opacity-30">
                        <Hash size={32} className="mb-2" />
                        <p className="text-[10px] font-black uppercase">Run Brain to extract codes</p>
                    </div>
                )}
            </div>
            <div className="p-4 bg-black text-white border-t-4 border-black">
                <div className="flex justify-between items-center text-[10px] font-black uppercase mb-2">
                    <span>Billing Confidence</span>
                    <span className="text-memphis-teal">92%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-memphis-teal w-[92%]" />
                </div>
            </div>
        </div>
      </div>

      {/* Live Stream Ticker */}
      <div className="mt-8 bg-black text-white p-4 border-4 border-black shadow-memphis-sm overflow-hidden flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
              <div className={`w-2 h-2 rounded-full ${isSigned ? 'bg-memphis-teal' : 'bg-red-500 animate-pulse'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{isSigned ? 'Record_Sealed' : 'Vault_Persistence'}:</span>
          </div>
          <div className="flex-1 truncate text-xs font-mono opacity-80 italic">
              {isSigned 
                ? `Signed by ${currentEncounter.patientName.split('_')[0] || 'Provider'} at ${new Date(currentEncounter.signedAt!).toLocaleTimeString()}`
                : currentEncounter.rawTranscript.length > 0 
                    ? currentEncounter.rawTranscript[currentEncounter.rawTranscript.length - 1]
                    : "Active shielding enabled. All data stored in IndexedDB."}
          </div>
          <div className="flex items-center gap-4 shrink-0">
             <div className="text-[10px] font-black opacity-40 uppercase">
                 Logs: {currentEncounter.rawTranscript.length}
             </div>
          </div>
      </div>
    </div>
  );
};

const MessageCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

export default SOAPGrid;
