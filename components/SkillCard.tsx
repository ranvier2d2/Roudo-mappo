
import React, { useState } from 'react';
import { AlertTriangle, Activity, CheckCircle, XCircle, Code, Clock } from 'lucide-react';
import { SkillExecutionData } from '../types';

interface SkillCardProps {
  data: SkillExecutionData;
  compact?: boolean;
}

const SkillCard: React.FC<SkillCardProps> = ({ data, compact }) => {
  const [showCode, setShowCode] = useState(false);

  const getTheme = () => {
    switch (data.status) {
      case 'running': return { color: 'bg-memphis-yellow', icon: <Activity className="animate-pulse" size={14} /> };
      case 'completed': return { color: 'bg-memphis-teal', icon: <CheckCircle size={14} /> };
      case 'failed': return { color: 'bg-memphis-pink', icon: <XCircle size={14} /> };
      default: return { color: 'bg-white', icon: <Clock size={14} /> };
    }
  };

  const theme = getTheme();

  return (
    <div className={`border-2 border-black mb-3 shadow-memphis-sm overflow-hidden ${theme.color}`}>
      <div className="px-3 py-1.5 border-b-2 border-black flex justify-between items-center bg-white/50">
        <div className="flex items-center gap-2 font-black text-[10px] uppercase">
          {theme.icon} {data.skillName}
        </div>
        <div className="text-[8px] font-bold opacity-50 uppercase">{data.status}</div>
      </div>
      <div className="p-3">
        <p className="text-xs font-bold leading-relaxed">{data.message}</p>
        {data.code && (
          <button onClick={() => setShowCode(!showCode)} className="mt-2 text-[9px] font-black uppercase flex items-center gap-1 hover:underline">
            <Code size={10} /> {showCode ? 'Hide Source' : 'View Source'}
          </button>
        )}
      </div>
      {showCode && data.code && (
        <div className="bg-black text-memphis-teal p-3 border-t-2 border-black font-mono text-[9px] whitespace-pre-wrap">
          {data.code}
        </div>
      )}
    </div>
  );
};

export default SkillCard;
