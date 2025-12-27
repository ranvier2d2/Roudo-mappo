import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, X, Activity, Radio, Cpu, Zap, MessageSquare, Clipboard, FileText } from 'lucide-react';
import { LogType } from '../types';
import { 
    downsampleBuffer, 
    float32ToPCM16Base64, 
    base64ToUint8Array, 
    decodePCM16ToAudioBuffer 
} from '../utils/audio';

const LiveSessionModal: React.FC = () => {
  const { isLiveModalOpen, setLiveModalOpen, addLog, startEncounter, currentEncounter, setView } = useAppStore();
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('disconnected');
  const [volume, setVolume] = useState(0);
  const [realtimeTranscript, setRealtimeTranscript] = useState('');

  // Audio Refs
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);
  
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Visualizer Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  // Session Ref
  const sessionRef = useRef<any>(null);
  const currentTurnTextRef = useRef<string>('');

  useEffect(() => {
    if (isLiveModalOpen) {
      startSession();
    } else {
      cleanup();
    }
    return () => {
        cleanup();
    };
  }, [isLiveModalOpen]);

  // Start Visualizer Loop
  useEffect(() => {
      if (status === 'connected') {
          renderVisualizer();
      }
      return () => {
          if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
          }
      };
  }, [status]);

  const startSession = async () => {
    try {
        setStatus('connecting');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // 1. Audio Context Setup
        inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // 2. Microphone Stream
        streamRef.current = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });
        
        // 3. Connect to Live API
        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                },
                inputAudioTranscription: {},
                systemInstruction: "You are DATA, a medical scribe assistant. Keep responses brief. Acknowledge medical terms correctly.",
            },
            callbacks: {
                onopen: () => {
                    setStatus('connected');
                    setupAudioInput(sessionPromise);
                },
                onmessage: (msg: LiveServerMessage) => handleMessage(msg),
                onclose: () => {
                    setStatus('disconnected');
                    cleanup();
                },
                onerror: (err) => {
                    console.error("Live API Error:", err);
                    setStatus('error');
                }
            }
        });
        
        sessionRef.current = sessionPromise;

    } catch (e) {
        console.error("Live Session Start Failed", e);
        setStatus('error');
        cleanup();
    }
  };

  const setupAudioInput = (sessionPromise: Promise<any>) => {
    if (!inputContextRef.current || !streamRef.current) return;

    try {
        const inputSampleRate = inputContextRef.current.sampleRate;
        const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
        const analyser = inputContextRef.current.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.5;
        inputAnalyserRef.current = analyser;

        const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
        
        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const downsampledData = downsampleBuffer(inputData, inputSampleRate, 16000);
            const base64Data = float32ToPCM16Base64(downsampledData);
            
            sessionPromise.then(session => {
                session.sendRealtimeInput({ 
                    media: {
                        mimeType: 'audio/pcm;rate=16000',
                        data: base64Data
                    }
                });
            }).catch(e => console.debug("Session not ready for input", e));
        };

        source.connect(analyser);
        analyser.connect(processor);
        processor.connect(inputContextRef.current.destination);
        processorRef.current = processor;
    } catch (error) {
        console.error("Audio Input Setup Failed:", error);
        setStatus('error');
    }
  };

  const handleMessage = async (message: LiveServerMessage) => {
    try {
        const serverContent = message.serverContent;
        if (serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
            playAudioChunk(serverContent.modelTurn.parts[0].inlineData.data);
        }
        
        // Correct property name is inputTranscription
        if (serverContent?.inputTranscription?.text) {
            const textChunk = serverContent.inputTranscription.text;
            currentTurnTextRef.current += textChunk;
            setRealtimeTranscript(currentTurnTextRef.current);
        }
        
        if (serverContent?.turnComplete) {
             const finalTranscript = currentTurnTextRef.current.trim();
             if (finalTranscript) {
                 addLog({
                     id: crypto.randomUUID(),
                     timestamp: new Date().toISOString(),
                     type: LogType.USER_COMMAND,
                     content: finalTranscript,
                     metadata: { source: 'live_session_transcription' }
                 });
             }
             currentTurnTextRef.current = '';
             setRealtimeTranscript('');
        }
        if (serverContent?.interrupted) {
            sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
            currentTurnTextRef.current = '';
            setRealtimeTranscript('');
        }
    } catch (error) {
        console.error("Error handling message:", error);
    }
  };

  const playAudioChunk = async (base64Audio: string) => {
      if (outputContextRef.current) {
        const audioBuffer = await decodePCM16ToAudioBuffer(
            base64ToUint8Array(base64Audio),
            outputContextRef.current,
            24000,
            1
        );
        const ctx = outputContextRef.current;
        if (ctx.state === 'closed') return;
        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += audioBuffer.duration;
        sourcesRef.current.add(source);
        source.onended = () => sourcesRef.current.delete(source);
      }
  }

  const renderVisualizer = () => {
      if (!canvasRef.current || !inputAnalyserRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const analyser = inputAnalyserRef.current;
      if (!ctx) return;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const draw = () => {
          animationFrameRef.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          const width = canvas.width;
          const height = canvas.height;
          ctx.clearRect(0, 0, width, height);
          let sum = 0;
          const speechBinCount = Math.floor(bufferLength * 0.6);
          for(let i = 0; i < speechBinCount; i++) sum += dataArray[i];
          const avg = sum / speechBinCount;
          setVolume(avg); 
          const centerX = width / 2;
          const barWidth = 6;
          const gap = 4;
          const maxBars = 20;
          for (let i = 0; i < maxBars; i++) {
              const dataIndex = Math.floor((i / maxBars) * speechBinCount);
              const value = dataArray[dataIndex];
              const barHeight = Math.max(4, (value / 255) * height * 0.6);
              const alpha = Math.max(0.2, value / 255);
              ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
              const y = (height - barHeight) / 2;
              ctx.fillRect(centerX + (i * (barWidth + gap)), y, barWidth, barHeight);
              ctx.fillRect(centerX - ((i + 1) * (barWidth + gap)), y, barWidth, barHeight);
          }
      };
      draw();
  };

  const handleStartEncounter = () => {
      startEncounter();
      setLiveModalOpen(false);
  };

  const handleGoToEncounter = () => {
      setView('CLINICAL_ENCOUNTER');
      setLiveModalOpen(false);
  };

  const cleanup = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (processorRef.current) {
        try { processorRef.current.disconnect(); processorRef.current.onaudioprocess = null; } catch (e) {}
        processorRef.current = null;
    }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    const closeContext = async (ctx: AudioContext | null) => { if (ctx && ctx.state !== 'closed') { try { await ctx.close(); } catch (e) {} } };
    closeContext(inputContextRef.current);
    inputContextRef.current = null;
    closeContext(outputContextRef.current);
    outputContextRef.current = null;
    inputAnalyserRef.current = null;
    sessionRef.current = null;
  };

  if (!isLiveModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300">
        <button 
            onClick={() => setLiveModalOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-terminal-dark border border-terminal-border text-terminal-dim hover:text-white hover:border-terminal-dim transition-all group"
        >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Status Header */}
        <div className="absolute top-6 left-6 flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold border backdrop-blur-md
                ${status === 'connected' 
                    ? 'bg-terminal-accent/10 border-terminal-accent/30 text-terminal-accent' 
                    : status === 'error' 
                        ? 'bg-terminal-error/10 border-terminal-error/30 text-terminal-error'
                        : 'bg-terminal-dim/10 border-terminal-dim/30 text-terminal-dim'}
            `}>
                <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-terminal-accent animate-pulse' : 'bg-current'}`} />
                {status === 'connected' ? 'LIVE LINK ACTIVE' : status.toUpperCase()}
            </div>
        </div>

        {/* Action Sidebar (Medical Shortcuts) */}
        {status === 'connected' && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 animate-in slide-in-from-left-4 duration-500">
                {!currentEncounter ? (
                    <button 
                        onClick={handleStartEncounter}
                        className="flex flex-col items-center gap-2 p-4 bg-memphis-yellow border-2 border-black shadow-memphis-sm hover:translate-x-1 hover:-translate-y-1 hover:shadow-memphis transition-all group"
                    >
                        <Clipboard size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase">Start Encounter</span>
                    </button>
                ) : (
                    <button 
                        onClick={handleGoToEncounter}
                        className="flex flex-col items-center gap-2 p-4 bg-memphis-teal border-2 border-black shadow-memphis-sm hover:translate-x-1 hover:-translate-y-1 hover:shadow-memphis transition-all group"
                    >
                        <FileText size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase">View Current Note</span>
                    </button>
                )}
            </div>
        )}

        {/* Main Visualizer Area */}
        <div className="relative w-full max-w-4xl h-[400px] flex flex-col items-center justify-center">
            {status !== 'connected' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center mb-6 transition-all duration-500
                        ${status === 'connecting' ? 'border-terminal-dim animate-pulse opacity-50' : 'border-terminal-error opacity-50'}
                    `}>
                         <Radio size={40} className="text-terminal-dim" />
                    </div>
                    <h2 className="text-xl font-mono text-white tracking-widest animate-pulse uppercase">
                        {status === 'connecting' ? 'Establishing Neural Handshake...' : 'Connection Failed'}
                    </h2>
                </div>
            )}
            <canvas ref={canvasRef} width={800} height={300} className={`w-full h-full opacity-0 transition-opacity duration-1000 ${status === 'connected' ? 'opacity-100' : ''}`} />
            {status === 'connected' && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-full px-4">
                    {realtimeTranscript ? (
                         <div className="bg-terminal-black/60 backdrop-blur border border-terminal-border px-6 py-4 rounded-xl shadow-2xl max-w-2xl mx-auto">
                            <p className="text-white font-mono text-lg md:text-xl font-bold leading-relaxed">
                                {realtimeTranscript}
                                <span className="inline-block w-2 h-5 bg-terminal-accent ml-1 animate-pulse align-middle" />
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-terminal-dim uppercase tracking-widest">
                                <MessageSquare size={10} /> Live Clinical Stream
                            </div>
                         </div>
                    ) : (
                        <p className="text-terminal-accent font-mono text-sm tracking-[0.2em] font-bold animate-pulse">
                            {volume > 15 ? 'LISTENING...' : 'READY'}
                        </p>
                    )}
                </div>
            )}
        </div>

        {/* Telemetry Bar */}
        <div className="absolute bottom-0 w-full bg-terminal-black/50 border-t border-terminal-border backdrop-blur-md px-6 py-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-terminal-dim">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Cpu size={14} className={status === 'connected' ? "text-terminal-accent" : ""} />
                        <span className="uppercase">Model: Gemini 2.5 Flash Native Audio</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity size={14} />
                        <span>Resampled 16kHz Stream</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {currentEncounter && (
                        <div className="text-terminal-accent font-black animate-pulse flex items-center gap-2">
                            <Zap size={14} /> ACTIVE CONSULTATION: {currentEncounter.patientName}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default LiveSessionModal;