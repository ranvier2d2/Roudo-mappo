
import React, { useState, useEffect, useRef } from 'react';
import { 
    ShieldAlert, ShieldCheck, Smartphone, MapPin, 
    Bell, Activity, Wifi, Lock, Zap, Clock, 
    AlertTriangle, Database, Terminal, Cpu, GitMerge, User
} from 'lucide-react';
import { useAppStore } from '../store';
import { LogType } from '../types';

const SecurityView: React.FC = () => {
    const { addLog } = useAppStore();
    const [isLockdown, setIsLockdown] = useState(false);
    const [threatLevel, setThreatLevel] = useState<'low' | 'elevated' | 'critical'>('low');
    const audioCtxRef = useRef<AudioContext | null>(null);
    const sirenIntervalRef = useRef<number | null>(null);

    // Simulate "Live" Telemetry
    const [metrics, setMetrics] = useState({
        sms: 'CONNECTED',
        whatsapp: 'STABLE',
        gps: 'ACTIVE (3 Nodes)',
        iot: 'MONITORING',
        latency: '42ms'
    });

    const playSiren = () => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            const now = ctx.currentTime;
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.5);
            osc.frequency.exponentialRampToValueAtTime(300, now + 1.0);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(now + 1.0);
        } catch (e) { console.error("Audio failed", e); }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({ ...prev, latency: `${Math.floor(Math.random() * 20) + 30}ms` }));
            if (!isLockdown && Math.random() > 0.95) {
                setThreatLevel('elevated');
                addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.SYSTEM_LOG, content: "[SECURITY] Unrecognized signal detected in IOT mesh. Threat level: ELEVATED." });
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [isLockdown, addLog]);

    useEffect(() => {
        if (threatLevel === 'critical') {
            sirenIntervalRef.current = window.setInterval(playSiren, 1200);
        } else if (sirenIntervalRef.current) {
            clearInterval(sirenIntervalRef.current);
        }
        return () => { if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current); };
    }, [threatLevel]);

    const toggleLockdown = () => {
        const newState = !isLockdown;
        setIsLockdown(newState);
        if (newState) {
            setThreatLevel('critical');
            addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.SYSTEM_LOG, content: "!! CRITICAL: RANVIER LOCKDOWN ENGAGED !!" });
            setTimeout(() => addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.SYSTEM_LOG, content: "[DEFENSE] Perimeter Lock: ACTIVE. All portals sealed." }), 500);
            setTimeout(() => addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.SYSTEM_LOG, content: "[DEFENSE] Family Node Ping: 3/3 members safely localized." }), 1000);
        } else {
            setThreatLevel('low');
            addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.SYSTEM_LOG, content: "[SECURITY] Threat neutralized. System returning to stand-by." });
        }
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden animate-in fade-in duration-500 bg-terminal-black">
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-terminal-border bg-terminal-black/50 p-4 md:p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
                <h3 className="text-[10px] uppercase text-terminal-dim tracking-widest font-bold mb-4 flex items-center gap-2"><Activity size={12}/> DISTRESS TRIGGER MESH</h3>
                <div className="space-y-3">
                    <SourceCard icon={<Smartphone size={16}/>} name="SMS GATEWAY" status={metrics.sms} color="text-terminal-accent" />
                    <SourceCard icon={<Smartphone size={16} className="text-green-500"/>} name="WHATSAPP API" status={metrics.whatsapp} color="text-terminal-accent" />
                    <SourceCard icon={<MapPin size={16}/>} name="GPS BEACON" status={metrics.gps} color="text-terminal-accent" />
                    <SourceCard icon={<Wifi size={16}/>} name="IOT PERIMETER" status={metrics.iot} color={threatLevel !== 'low' ? "text-terminal-warning" : "text-terminal-accent"} active={threatLevel !== 'low'} />
                </div>
                <div className="h-px bg-terminal-border/50" />
                <h3 className="text-[10px] uppercase text-terminal-dim tracking-widest font-bold mb-4">SYSTEM TELEMETRY</h3>
                <div className="grid grid-cols-2 gap-4">
                    <TelemetryItem label="Lat Core" value={metrics.latency} />
                    <TelemetryItem label="Nodes" value="Santiago-A" />
                    <TelemetryItem label="Uptime" value="99.98%" />
                    <TelemetryItem label="Load" value={isLockdown ? "72%" : "12%"} />
                </div>
                <div className="mt-auto hidden md:block">
                    <LockdownButton active={isLockdown} onClick={toggleLockdown} />
                </div>
            </div>
            <div className="flex-1 bg-terminal-black p-4 md:p-6 flex flex-col overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold font-mono text-white flex items-center gap-3">
                            <ShieldCheck className={threatLevel === 'critical' ? 'text-terminal-error animate-pulse' : threatLevel === 'elevated' ? 'text-terminal-warning' : 'text-terminal-accent'} />
                            RANVIER DEFENSE NODE
                        </h2>
                        <p className="text-terminal-dim font-mono text-[10px] md:text-xs uppercase tracking-wide mt-1">Status: <span className="text-white">{isLockdown ? 'DEFENSIVE MESH ACTIVE' : 'PIPELINE NOMINAL'}</span></p>
                    </div>
                    <div className={`px-4 py-1.5 rounded border font-mono text-xs font-bold ${threatLevel === 'critical' ? 'bg-terminal-error/10 border-terminal-error text-terminal-error animate-pulse' : threatLevel === 'elevated' ? 'bg-terminal-warning/10 border-terminal-warning text-terminal-warning' : 'bg-terminal-accent/10 border-terminal-accent text-terminal-accent'}`}>
                        DEFCON {threatLevel === 'critical' ? '1' : threatLevel === 'elevated' ? '3' : '5'}
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center py-4 md:py-10">
                     <div className="grid grid-cols-2 md:grid-cols-4 w-full max-w-4xl gap-3 md:gap-4 relative">
                        <FlowStep title="INGEST" desc="Webhooks" status="STABLE" icon={<Database size={20}/>} />
                        <FlowStep title="ANALYZE" desc="Vision AI" status={threatLevel === 'critical' ? "THREAT" : "NOMINAL"} icon={<Cpu size={20}/>} active={threatLevel !== 'low'} />
                        <FlowStep title="ACTION" desc="Triggers" status={isLockdown ? "ENGAGED" : "READY"} icon={<Zap size={20}/>} active={isLockdown} />
                        <FlowStep title="ESCALATE" desc="Emergency" status={isLockdown ? "NOTIFYING" : "IDLE"} icon={<Bell size={20}/>} active={isLockdown} />
                     </div>
                     <div className="w-full max-w-4xl mt-8 md:mt-12 bg-terminal-dark/30 border border-terminal-border rounded-lg overflow-hidden">
                        <div className="bg-terminal-dark px-4 py-2 border-b border-terminal-border flex justify-between items-center">
                            <span className="text-[9px] font-mono font-bold text-terminal-dim uppercase tracking-wider">Security Event Stream</span>
                            <div className="flex gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${threatLevel === 'critical' ? 'bg-terminal-error animate-pulse' : 'bg-terminal-accent/50'}`} />
                            </div>
                        </div>
                        <div className="p-4 font-mono text-[10px] md:text-xs space-y-2 max-h-48 md:max-h-60 overflow-y-auto custom-scrollbar">
                            <LogLine time={new Date().toLocaleTimeString()} msg="System heartbeat detected." type="sys" />
                            {threatLevel !== 'low' && <LogLine time={new Date().toLocaleTimeString()} msg={`WARNING: Threat level elevated to ${threatLevel}.`} type="wait" />}
                            {isLockdown && <LogLine time={new Date().toLocaleTimeString()} msg="LOCKDOWN PROTOCOL: PRIMITIVES ENGAGED." type="ok" />}
                        </div>
                     </div>
                </div>
            </div>
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-terminal-border bg-terminal-black/50 p-4 md:p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
                <h3 className="text-[10px] uppercase text-terminal-dim tracking-widest font-bold mb-4 flex items-center gap-2"><User size={12}/> FAMILY STATUS</h3>
                <div className="space-y-4">
                    <FamilyMember name="Bastian" status={isLockdown ? "SECURED" : "SAFE"} active={isLockdown} />
                    <FamilyMember name="Maria" status={isLockdown ? "SECURED" : "SAFE"} active={isLockdown} />
                    <FamilyMember name="Security-01" status="ACTIVE" active />
                </div>
                <div className="mt-auto p-4 bg-terminal-accent/5 border border-terminal-accent/20 rounded">
                    <div className="flex items-center gap-2 text-terminal-accent font-bold text-[10px] mb-1"><Lock size={12}/> ENCRYPTED LINK</div>
                    <p className="text-[9px] text-terminal-dim font-mono leading-relaxed">Neural bridge operating over encrypted tunnels on Santiago-A node.</p>
                </div>
            </div>
        </div>
    );
};

const SourceCard: React.FC<{ icon: any, name: string, status: string, color: string, active?: boolean }> = ({ icon, name, status, color, active }) => (
    <div className={`p-2.5 bg-terminal-dark border border-terminal-border rounded flex items-center justify-between transition-all ${active ? 'border-terminal-warning bg-terminal-warning/10 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : ''}`}>
        <div className="flex items-center gap-3">
            <div className="text-terminal-dim">{icon}</div>
            <div className="flex flex-col"><span className="text-[9px] font-bold text-white uppercase">{name}</span><span className={`text-[8px] font-mono ${color}`}>{status}</span></div>
        </div>
        <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} ${active ? 'animate-ping' : 'animate-pulse'}`} />
    </div>
);

const TelemetryItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="flex flex-col"><span className="text-[8px] text-terminal-dim uppercase">{label}</span><span className="text-[10px] font-mono text-white">{value}</span></div>
);

const FlowStep: React.FC<{ title: string, desc: string, status: string, icon: any, active?: boolean }> = ({ title, desc, status, icon, active }) => (
    <div className={`p-3 md:p-4 rounded border font-mono flex flex-col items-center text-center transition-all ${active ? 'bg-terminal-accent/10 border-terminal-accent shadow-[0_0_15px_rgba(34,197,94,0.2)] scale-105' : 'bg-terminal-dark border-terminal-border text-terminal-dim'}`}>
        <div className={`mb-2 ${active ? 'text-terminal-accent animate-bounce' : 'text-terminal-dim'}`}>{icon}</div>
        <span className={`text-[9px] md:text-[10px] font-bold ${active ? 'text-white' : ''}`}>{title}</span>
        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded mt-1 ${active ? 'bg-terminal-accent text-black' : 'bg-terminal-border'}`}>{status}</span>
    </div>
);

const LogLine: React.FC<{ time: string, msg: string, type: string }> = ({ time, msg, type }) => (
    <div className="flex gap-2 text-[10px]"><span className="text-terminal-dim opacity-40">[{time}]</span><span className={type === 'wait' ? 'text-terminal-warning animate-pulse' : type === 'ok' ? 'text-terminal-accent font-bold' : 'text-terminal-dim'}>{msg}</span></div>
);

const FamilyMember: React.FC<{ name: string, status: string, active?: boolean }> = ({ name, status, active }) => (
    <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${active ? 'border-terminal-accent bg-terminal-accent/10' : 'border-terminal-border bg-terminal-dark'}`}><User size={16} className={active ? 'text-terminal-accent' : 'text-terminal-dim'} /></div>
        <div className="flex flex-col"><span className="text-[11px] font-bold text-white">{name}</span><span className={`text-[9px] font-mono ${active ? 'text-terminal-accent' : 'text-terminal-dim'}`}>{status}</span></div>
    </div>
);

const LockdownButton: React.FC<{ active: boolean, onClick: () => void }> = ({ active, onClick }) => (
    <button onClick={onClick} className={`w-full p-4 rounded border font-mono font-bold text-sm flex items-center justify-center gap-3 transition-all ${active ? 'bg-terminal-error/20 border-terminal-error text-terminal-error animate-pulse' : 'bg-terminal-dark border-terminal-border text-white hover:text-terminal-error'}`}>
        <ShieldAlert size={18} />{active ? 'TERMINATE LOCKDOWN' : 'INITIATE LOCKDOWN'}
    </button>
);

export default SecurityView;
