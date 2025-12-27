
import React, { useEffect, useState, useRef } from 'react';
import { Shield, Smartphone, MessageCircle, MapPin, Wifi, AlertTriangle, Lock, Activity, User, Zap, Bell, Eye, Database } from 'lucide-react';
import { useAppStore } from '../store';
import { LogType } from '../types';

export function Security() {
  const { addLog } = useAppStore();
  const [threatLevel, setThreatLevel] = useState<'LOW' | 'ELEVATED' | 'CRITICAL'>('LOW');
  const [lockdownActive, setLockdownActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [sources] = useState({
    sms: { status: 'CONNECTED', ping: 24 },
    whatsapp: { status: 'STABLE', ping: 45 },
    gps: { status: 'ACTIVE', nodes: 3 },
    iot: { status: 'MONITORING', devices: 12 },
  });

  const playSiren = () => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.5);
      osc.frequency.linearRampToValueAtTime(400, now + 1.0);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(now + 1.0);
    } catch(e) {}
  };

  useEffect(() => {
    if (threatLevel === 'CRITICAL' && lockdownActive) {
      const interval = setInterval(playSiren, 2000);
      return () => clearInterval(interval);
    }
  }, [threatLevel, lockdownActive]);

  const toggleLockdown = () => {
    if (!lockdownActive) {
      setLockdownActive(true);
      setThreatLevel('CRITICAL');
      addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.SYSTEM_LOG, content: "!! SECURITY OVERRIDE: INITIATING FULL LOCKDOWN !!" });
      playSiren();
    } else {
      setLockdownActive(false);
      setThreatLevel('LOW');
      addLog({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: LogType.SYSTEM_LOG, content: "Security protocols restored to baseline." });
    }
  };

  return (
    <div className="p-4 md:p-8 font-mono">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT: TRIGGERS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border-4 border-black bg-[#E0F7FA] p-4 shadow-memphis">
            <h3 className="flex items-center gap-2 font-black text-xs uppercase mb-4 border-b-2 border-black pb-2">
              <Activity size={14}/> DISTRESS MESH
            </h3>
            <div className="space-y-3">
              <SourceRow icon={<Smartphone size={16}/>} label="SMS GATEWAY" status={sources.sms.status} detail={`${sources.sms.ping}ms`} />
              <SourceRow icon={<MessageCircle size={16}/>} label="WHATSAPP API" status={sources.whatsapp.status} detail={`${sources.whatsapp.ping}ms`} />
              <SourceRow icon={<MapPin size={16}/>} label="GPS BEACON" status={sources.gps.status} detail={`${sources.gps.nodes} Nodes`} />
              <SourceRow icon={<Wifi size={16}/>} label="IOT PERIMETER" status={sources.iot.status} detail={`${sources.iot.devices} Devices`} />
            </div>
          </div>
          <div className="border-4 border-black bg-white p-4 shadow-memphis text-[10px] font-bold">
            <h3 className="uppercase opacity-50 mb-2">TELEMETRY</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>LATENCY: <span className="text-memphis-teal">33ms</span></div>
              <div>UPTIME: <span className="text-memphis-teal">99.98%</span></div>
            </div>
          </div>
        </div>

        {/* CENTER: ORCHESTRATOR */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-4 border-black bg-white p-6 shadow-memphis relative">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={32} className="text-black" />
                  <h1 className="text-2xl font-black uppercase tracking-tighter">RANVIER DEFENSE</h1>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span>SYSTEM STATUS:</span>
                  <span className="bg-black text-white px-2 py-0.5">{lockdownActive ? 'ENFORCING PROTOCOLS' : 'ACTIVE PIPELINE'}</span>
                </div>
              </div>
              <div className={`px-5 py-2 border-4 border-black font-black text-2xl shadow-memphis-sm ${threatLevel === 'CRITICAL' ? 'bg-red-500 text-white animate-pulse' : 'bg-memphis-teal text-black'}`}>
                DEFCON {threatLevel === 'CRITICAL' ? '1' : '5'}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <ActionTile icon={<Database size={20}/>} label="Ingest" status="STABLE" />
              <ActionTile icon={<Eye size={20}/>} label="Analyze" status="ACTIVE" />
              <ActionTile icon={<Zap size={20}/>} label="Action" status="READY" />
              <ActionTile icon={<Bell size={20}/>} label="Escalate" status="IDLE" />
            </div>

            <div className="border-t-4 border-black pt-6">
              <button 
                onClick={toggleLockdown}
                className={`w-full py-5 text-lg font-black uppercase flex items-center justify-center gap-3 border-4 border-black shadow-memphis transition-all active:shadow-none active:translate-x-1 active:translate-y-1 ${lockdownActive ? 'bg-memphis-teal' : 'bg-red-500 text-white'}`}
              >
                {lockdownActive ? <><Lock size={24}/> DISENGAGE LOCKDOWN</> : <><AlertTriangle size={24}/> INITIATE LOCKDOWN</>}
              </button>
              {lockdownActive && <div className="mt-3 text-center text-xs font-black text-red-600 animate-pulse uppercase">⚠ Perimeters Locked • Encrypted Tunnels Engaged ⚠</div>}
            </div>
          </div>
        </div>

        {/* RIGHT: FAMILY */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border-4 border-black bg-[#F3E5F5] p-4 shadow-memphis">
            <h3 className="flex items-center gap-2 font-black text-xs uppercase mb-4 border-b-2 border-black pb-2">
              <User size={14}/> FAMILY NODES
            </h3>
            <div className="space-y-4">
              <FamilyRow name="Bastian (CTO)" status="SAFE" location="HOME" />
              <FamilyRow name="Maria (DOC)" status="SAFE" location="SANTIAGO" />
              <FamilyRow name="Security-01" status="ARMED" location="GATE-A" />
            </div>
          </div>
          <div className="p-4 border-4 border-black bg-memphis-pink shadow-memphis">
             <div className="flex items-center gap-2 font-black text-xs mb-2"><Lock size={14}/> ENCRYPTED LINK</div>
             <p className="text-[10px] font-bold leading-relaxed">System mesh operating over hardware-encrypted tunnels on Santiago-A node.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const SourceRow = ({ icon, label, status, detail }: any) => (
  <div className="flex items-center justify-between p-2 bg-white border-2 border-black shadow-memphis-sm">
    <div className="flex items-center gap-3">
      <div className="bg-black text-white p-1">{icon}</div>
      <div>
        <div className="text-[9px] font-black uppercase">{label}</div>
        <div className="text-[8px] font-bold text-memphis-teal">{status}</div>
      </div>
    </div>
    <div className="text-[8px] font-bold opacity-50">{detail}</div>
  </div>
);

const ActionTile = ({ icon, label, status }: any) => (
  <div className="flex flex-col items-center justify-center p-3 border-2 border-black bg-white">
    <div className="mb-2 text-black">{icon}</div>
    <div className="text-[9px] font-black uppercase mb-1">{label}</div>
    <div className="text-[8px] px-1.5 py-0.5 bg-black text-white font-bold">{status}</div>
  </div>
);

const FamilyRow = ({ name, status, location }: any) => (
  <div className="flex items-center gap-3 p-2 border-b-2 border-black/10 last:border-0">
    <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center"><User size={16} /></div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-black truncate">{name}</div>
      <div className="text-[8px] font-bold opacity-60 uppercase">{status} • {location}</div>
    </div>
    <div className={`w-2 h-2 rounded-full border border-black ${status === 'SAFE' ? 'bg-memphis-teal' : 'bg-memphis-yellow'} animate-pulse`} />
  </div>
);
