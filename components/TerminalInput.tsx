
import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Terminal, Mic, Paperclip, StopCircle, ChevronUp, Wrench, Search, X } from 'lucide-react';
import { useAppStore } from '../store';
import { sendCoreDataCommand, MOCK_SKILLS } from '../services/api';
import { LogType, CoreDataRequestPayload, SkillDef } from '../types';

const TerminalInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  
  const { addLog, setPending, user, setSelectedSkill } = useAppStore();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Monitor for '/' trigger
  useEffect(() => {
    if (inputValue === '/') {
      setShowSkills(true);
    } else if (inputValue === '') {
      setShowSkills(false);
    }
  }, [inputValue]);

  const mutation = useMutation({
    mutationFn: (args: { command: string, fileData?: string, fileType?: string }) => {
      const payload: CoreDataRequestPayload = {
        command: args.command,
        timestamp: Date.now(),
        context: { userId: user?.id, fileData: args.fileData, fileType: args.fileType }
      };
      return sendCoreDataCommand(payload);
    },
    onMutate: () => setPending(true),
    onSuccess: (data) => {
        if (data.message) addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.AI_RESPONSE, content: data.message });
        if (data.image) addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.IMAGE, content: "Generated Asset", metadata: { base64: data.image } });
        if (data.skill) addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.SKILL_EXECUTION, content: "Skill Execution", metadata: data.skill });
    },
    onError: (error: any) => {
        addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.ERROR, content: error.message || "Unknown neural error." });
    },
    onSettled: () => { setPending(false); setInputValue(''); setShowSkills(false); },
  });

  const handleSend = () => {
    if (!inputValue.trim()) return;
    addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.USER_COMMAND, content: inputValue });
    mutation.mutate({ command: inputValue });
  };

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1];
                addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.USER_COMMAND, content: "[Voice Capture Input]" });
                mutation.mutate({ command: "/tts Transcribe this.", fileData: base64, fileType: 'audio/wav' });
            };
        };
        mediaRecorder.start();
        setIsRecording(true);
    } catch (err) { alert("Microphone access denied."); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          const isVideo = file.type.startsWith('video/');
          mutation.mutate({ command: isVideo ? `/video Analyze this ${file.name}.` : `/analyze file ${file.name}`, fileData: base64, fileType: file.type });
      };
  };

  const handleSelectSkill = (skill: SkillDef) => {
    setSelectedSkill(skill);
    setInputValue('');
    setShowSkills(false);
  };

  return (
    <div className="relative p-4 md:p-6 bg-white border-t-4 border-black font-mono">
      {/* Skills Drawer */}
      {showSkills && (
        <div 
          ref={drawerRef}
          className="absolute bottom-full left-0 right-0 p-6 bg-white border-t-4 border-black shadow-[0_-12px_0_0_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-4 duration-300 z-[45]"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-3 bg-memphis-yellow -mx-2 px-4 py-2 transform -rotate-1">
              <div className="flex items-center gap-3">
                <Wrench size={20} className="text-black" />
                <h3 className="font-black text-sm uppercase tracking-[0.2em] text-black">Ranvier Skill Matrix</h3>
              </div>
              <button onClick={() => setShowSkills(false)} className="bg-black text-white p-1 hover:bg-memphis-pink hover:text-black transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {MOCK_SKILLS.map((skill) => (
                <button 
                  key={skill.skillDUID}
                  onClick={() => handleSelectSkill(skill)}
                  className="flex items-center gap-4 p-4 bg-memphis-beige border-2 border-black hover:bg-memphis-teal hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-memphis-sm hover:shadow-memphis"
                >
                  <div className="bg-white border-2 border-black p-3 shadow-memphis-sm group-hover:bg-memphis-yellow transition-colors shrink-0">
                    <span className="text-2xl">{skill.emoji}</span>
                  </div>
                  <div className="text-left min-w-0">
                    <div className="text-xs font-black uppercase leading-tight truncate">{skill.displayName}</div>
                    <div className="text-[10px] opacity-60 font-bold truncate mt-1">v{skill.skillVersion}</div>
                  </div>
                </button>
              ))}
              <div className="p-4 border-2 border-black border-dashed flex items-center justify-center opacity-40 bg-gray-50/50">
                <span className="text-[10px] font-black uppercase tracking-widest">More Nodes Awaiting Sync...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Input Bar */}
      <div className="max-w-4xl mx-auto relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none">
          <Terminal size={22} />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isRecording ? "LISTENING FOR NEURAL WAVEFORMS..." : "TYPE '/' FOR SKILLS OR ENTER COMMAND..."}
          disabled={mutation.isPending || isRecording}
          className="w-full bg-memphis-beige border-4 border-black rounded-none py-5 pl-14 pr-32 text-sm text-black placeholder-black/40 focus:outline-none focus:bg-white focus:shadow-memphis-lg font-mono font-black transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <button 
              onClick={() => setShowSkills(!showSkills)} 
              className={`p-1.5 border-2 border-black bg-white hover:bg-memphis-pink transition-all shadow-memphis-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px] ${showSkills ? 'bg-memphis-pink shadow-none translate-x-[1px] translate-y-[1px]' : ''}`}
              title="Browse Skills"
            >
                <ChevronUp size={18} />
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="p-1.5 border-2 border-black bg-white hover:bg-memphis-teal transition-all shadow-memphis-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]" title="Attach Asset">
                <Paperclip size={18} />
            </button>
            <button 
                onClick={isRecording ? () => mediaRecorderRef.current?.stop() : startRecording} 
                className={`p-1.5 border-2 border-black transition-all shadow-memphis-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px] ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-none translate-x-[1px] translate-y-[1px]' : 'bg-white hover:bg-memphis-yellow'}`}
            >
                {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
            </button>
            <button 
                onClick={handleSend} 
                disabled={mutation.isPending || !inputValue.trim()} 
                className="p-2.5 bg-black text-white hover:bg-memphis-teal hover:text-black border-2 border-black transition-all shadow-memphis-sm hover:shadow-memphis-lg active:shadow-none active:translate-x-1 active:translate-y-1"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default TerminalInput;
