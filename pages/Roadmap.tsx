import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/Card';
import { MOCK_ROADMAP } from '../services/api';
import { Layers, AlertCircle, TrendingUp, CheckCircle2, Clock, FileCode, Dices, GitMerge, ListTodo } from 'lucide-react';

export function Roadmap() {
  const [items, setItems] = useState(MOCK_ROADMAP);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const stats = [
    { label: 'Completion', value: '43%', icon: TrendingUp, color: 'bg-memphis-teal' },
    { label: 'Blocked', value: items.filter(i => i.status === 'BLOCKED' || i.tasks?.some(t => t.status === 'BLOCKED')).length.toString(), icon: AlertCircle, color: 'bg-memphis-pink' },
    { label: 'High Debt', value: items.filter(i => i.techDebt === 'High').length.toString(), icon: AlertCircle, color: 'bg-memphis-yellow' },
  ];

  const reroll = () => {
    setItems([...items].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto font-mono">
      <div className="mb-10 bg-white border-4 border-black p-6 shadow-memphis relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-memphis-teal -mr-16 -mt-16 transform rotate-45 group-hover:scale-110 transition-transform border-l-4 border-b-4 border-black" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-black text-white p-2 border-2 border-black shadow-memphis-sm">
              <Layers size={24} />
            </div>
            <h1 className="text-3xl font-black text-black tracking-tighter uppercase">ARCHITECTURAL MAP</h1>
          </div>
          <p className="text-sm font-bold opacity-80 max-w-lg leading-relaxed">System pathways, neural bridge status, and resource allocation tracking.</p>
        </div>
        <button onClick={reroll} className="absolute bottom-4 right-4 bg-white border-2 border-black p-2 hover:bg-memphis-pink shadow-memphis-sm active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
          <Dices size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className={`border-4 border-black p-4 shadow-memphis ${stat.color} flex flex-col justify-center items-center`}>
            <div className="flex items-center gap-2 font-black text-[10px] mb-1 uppercase">
              <stat.icon size={14} /> {stat.label}
            </div>
            <div className="text-4xl font-black text-black">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <Card key={item.id} className="transition-all hover:-translate-y-1">
            <CardHeader 
              title={item.feature} 
              subtitle={item.category} 
              color={item.status === 'DONE' ? 'teal' : item.status === 'BLOCKED' ? 'pink' : 'yellow'}
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            />
            <CardContent className="bg-white">
              <div className="flex flex-wrap gap-4 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 border-2 border-black text-[10px] font-black uppercase ${item.status === 'DONE' ? 'bg-memphis-teal' : item.status === 'BLOCKED' ? 'bg-memphis-pink' : 'bg-memphis-yellow'}`}>
                  {item.status === 'DONE' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                  {item.status}
                </span>
                <span className="inline-flex items-center px-3 py-1 border-2 border-black text-[10px] font-black bg-white">
                  {item.priority} PRIORITY
                </span>
                <span className="inline-flex items-center px-3 py-1 border-2 border-black text-[10px] font-black bg-white">
                  DEBT: {item.techDebt}
                </span>
              </div>

              {expandedId === item.id && item.tasks && (
                <div className="mt-4 border-t-2 border-black border-dashed pt-4 animate-in slide-in-from-top-2 space-y-4">
                  <div className="text-[10px] font-black uppercase flex items-center gap-2">
                    <FileCode size={14} /> IMPLEMENTATION STACK
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {item.tasks.map((task) => (
                      <div key={task.id} className={`p-3 border-2 border-black bg-memphis-beige relative overflow-hidden ${task.status === 'BLOCKED' ? 'border-red-500' : ''}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-black ${task.status === 'DONE' ? 'line-through opacity-50 text-memphis-teal' : ''}`}>{task.title}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 border border-black ${task.status === 'DONE' ? 'bg-memphis-teal' : task.status === 'BLOCKED' ? 'bg-red-500 text-white' : 'bg-white'}`}>{task.status}</span>
                        </div>
                        
                        {task.todo && (
                          <div className="mt-2 text-[10px] text-gray-700 bg-white/50 p-1.5 border border-black/10 flex items-start gap-2">
                            <ListTodo size={12} className="shrink-0 mt-0.5" />
                            <span>TODO: {task.todo}</span>
                          </div>
                        )}

                        {task.blockedBy && task.blockedBy.length > 0 && (
                          <div className="mt-2 text-[9px] text-red-600 font-bold flex items-center gap-2 uppercase tracking-tight">
                            <GitMerge size={12} /> BLOCKED BY: {task.blockedBy.join(', ')}
                          </div>
                        )}

                        {task.file && (
                          <div className="absolute top-0 right-0 p-1">
                             <span className="text-[8px] bg-black text-white px-1 uppercase">{task.file}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}