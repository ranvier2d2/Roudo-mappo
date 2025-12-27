
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '../components/Card';
import { useAppStore } from '../store';
import { LogType } from '../types';
import { Terminal, Activity, AlertTriangle, Image as ImageIcon, Sparkles, Wrench } from 'lucide-react';
import SkillGroup from '../components/SkillGroup';
import SkillCard from '../components/SkillCard';
import { DATA_SKILL_GUIDE_DEF } from '../services/api';
import { Button } from '../components/Button';

export function Dashboard() {
  const { logs, isPending, setSelectedSkill } = useAppStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isPending]);

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      {logs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-8 w-full">
          <div className="bg-memphis-teal border-4 border-black p-6 shadow-memphis transform rotate-3">
             <Terminal size={48} />
          </div>
          
          <div className="w-full max-w-lg">
            <Card variant="window" className="hover:scale-[1.02] transition-transform">
              <CardHeader title="Featured Skill" subtitle="v4.2.0" color="yellow" />
              <CardContent className="flex flex-col md:flex-row gap-4 items-center">
                <div className="bg-memphis-pink p-4 border-2 border-black rotate-1">
                  <Wrench size={40} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-black text-xl uppercase tracking-tighter">MAKE DATA SKILL</h3>
                  <p className="text-xs font-bold font-mono opacity-70 mt-1 leading-relaxed">
                    Overhaul your workflow. This tool evaluatest requests and recursively builds complex Notion guides with AI.
                  </p>
                </div>
                <Button variant="primary" size="small" onClick={() => setSelectedSkill(DATA_SKILL_GUIDE_DEF)}>
                  CUSTOMIZE
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white border-2 border-black p-4 shadow-memphis-sm max-w-xs transform -rotate-1">
             <h2 className="font-black text-lg uppercase mb-2">NEURAL CORE STANDBY</h2>
             <p className="text-xs font-bold font-mono opacity-70">Ranvier bridge initialized. Awaiting user input via terminal or skill selector.</p>
          </div>
        </div>
      )}

      {logs.map((log) => (
        <div key={log.id} className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
          <div className="absolute -top-2 -left-2 w-full h-full border-2 border-black bg-black/5 -z-10 translate-x-1 translate-y-1" />
          
          <Card className="group">
            <CardHeader 
              title={log.type.replace('_', ' ')} 
              subtitle={log.timestamp}
              color={log.type === LogType.USER_COMMAND ? 'teal' : log.type === LogType.ERROR ? 'pink' : 'yellow'}
            />
            <CardContent className="font-mono text-sm">
              {log.type === LogType.USER_COMMAND && (
                <div className="flex items-center gap-2 font-black text-black">
                  <span className="text-memphis-pink">❯</span> {log.content}
                </div>
              )}
              {log.type === LogType.AI_RESPONSE && (
                <div className="whitespace-pre-wrap leading-relaxed text-black">{log.content}</div>
              )}
              {log.type === LogType.SYSTEM_LOG && (
                <div className="text-gray-500 italic">{log.content}</div>
              )}
              {log.type === LogType.ERROR && (
                <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 p-2 border-2 border-red-600 border-dashed">
                  <AlertTriangle size={18} /> {log.content}
                </div>
              )}
              {log.type === LogType.IMAGE && log.metadata?.base64 && (
                <div className="mt-2 border-4 border-black bg-black p-1 shadow-memphis-sm">
                  <img src={`data:image/png;base64,${log.metadata.base64}`} alt="Asset" className="w-full" />
                </div>
              )}
              {log.type === LogType.SKILL_GROUP && log.metadata && (
                <SkillGroup skills={log.metadata.skills} mode={log.metadata.mode || 'sequential'} />
              )}
              {log.type === LogType.SKILL_EXECUTION && log.metadata && (
                <div onClick={() => log.metadata.skillName.includes('Guide') && setSelectedSkill(DATA_SKILL_GUIDE_DEF)}>
                   <SkillCard data={log.metadata} compact />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}

      {isPending && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-10 h-10 border-4 border-black border-t-memphis-pink rounded-full animate-spin" />
          <span className="text-xs font-black bg-memphis-yellow px-3 py-1 border-2 border-black transform -rotate-2">
            NEURAL COMPUTE IN PROGRESS...
          </span>
        </div>
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
