
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRoadmapData, fetchTensorStream } from '../services/api';
import { useAppStore } from '../store';
import { 
  AlertCircle, BarChart3, ShieldAlert, Code2, Map as MapIcon, 
  ChevronDown, ChevronUp, FileCode, CheckSquare, Square,
  Settings, Eye, Zap, RefreshCcw, Calendar, Loader2, Clock,
  Activity, Target, ShieldCheck
} from 'lucide-react';
import SourceMapView from './SourceMapView';

const RoadmapView: React.FC = () => {
  const { 
    activeRoadmapTab, 
    setRoadmapTab, 
    roadmapOverlay, 
    toggleRoadmapOverlay 
  } = useAppStore();

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['roadmapData'],
    queryFn: fetchRoadmapData,
    staleTime: 0,
  });

  const { data: tensorData } = useQuery({
    queryKey: ['tensorStream'],
    queryFn: fetchTensorStream,
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] font-mono">
        <Loader2 className="w-12 h-12 animate-spin text-memphis-teal mb-4" />
        <span className="font-black uppercase tracking-widest bg-black text-white px-4 py-2 border-2 border-black shadow-memphis">
          SYNCING ARCHITECTURAL SHARDS...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 font-mono">
        <div className="bg-memphis-pink border-4 border-black p-8 shadow-memphis-lg max-w-md text-center text-black">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-black uppercase mb-2">NEURAL_LINK_FAULT</h2>
          <p className="font-bold text-sm mb-6 opacity-80">Failed to establish handshake with the Ranvier Core API.</p>
          <button 
            onClick={() => refetch()}
            className="w-full bg-black text-white py-3 font-black uppercase hover:bg-memphis-teal hover:text-black border-2 border-black transition-all active:translate-y-1"
          >
            RETRY_SYNC
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full font-mono text-black relative">
      {/* Tensor Hud Overlay (Tactical ASCII Hud) */}
      <div className="pointer-events-none absolute top-4 left-4 z-10 hidden xl:block opacity-40 select-none">
        <pre className="text-[10px] leading-tight text-black font-black whitespace-pre">
{`┌── TENSOR_HUD_v0.2 ──┐
│ OBJECTIVE: SHIP_90 │
│ ENTITY: A_JOAQUIN  │
│ ENTITY: B_BASTIAN  │
│ MODE: ADHD_SAFE    │
└────────────────────┘`}
        </pre>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20">
        <div>
            <div className="flex items-center gap-3 mb-2 text-black">
                <div className="p-2 bg-black text-white border-2 border-black shadow-memphis-sm">
                    {activeRoadmapTab === 'roadmap' ? <LayersIcon size={24} /> : <Code2 size={24} />}
                </div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">
                    {data?.meta?.title || 'ARCHITECTURAL MAP'}
                </h2>
            </div>
            <p className="text-black/70 font-bold text-sm max-w-2xl leading-relaxed uppercase">
                {activeRoadmapTab === 'roadmap' 
                    ? data?.meta?.subtitle
                    : 'Real-time source code introspection of active neural bridge components.'}
            </p>
        </div>

        <div className="flex bg-black p-1 border-2 border-black shadow-memphis-sm self-start">
            <button 
                onClick={() => setRoadmapTab('roadmap')}
                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black transition-all ${activeRoadmapTab === 'roadmap' ? 'bg-memphis-teal text-black shadow-[inset_0px_0px_0px_1px_black]' : 'text-gray-400 hover:text-white'}`}
            >
                <MapIcon size={14} />
                STATUS_MAP
            </button>
            <button 
                onClick={() => setRoadmapTab('sourcemap')}
                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black transition-all ${activeRoadmapTab === 'sourcemap' ? 'bg-memphis-teal text-black shadow-[inset_0px_0px_0px_1px_black]' : 'text-gray-400 hover:text-white'}`}
            >
                <Code2 size={14} />
                SOURCE_MAP
            </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative z-20">
          {activeRoadmapTab === 'roadmap' ? (
              <>
                {/* Main Content Area */}
                <div className="flex-1 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                    {/* KPI Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {data?.kpi_dashboard?.map((kpi: any) => (
                          <StatCard 
                            key={kpi.id}
                            label={kpi.label} 
                            value={kpi.value} 
                            icon={getIconByName(kpi.icon)} 
                            hexColor={kpi.color} 
                          />
                        ))}
                    </div>

                    {/* Tensor Event Feed (Mini) */}
                    <div className="bg-black text-white p-3 border-2 border-black shadow-memphis-sm text-[9px] uppercase font-black overflow-hidden mb-4">
                        <div className="flex justify-between border-b border-white/20 pb-1 mb-2">
                           <span className="flex items-center gap-2"><Activity size={10} className="text-memphis-teal" /> RANVIER_BUILD_TENSOR</span>
                           <span className="opacity-50">v0.2_LIVE</span>
                        </div>
                        <div className="space-y-1 max-h-20 overflow-y-auto custom-scrollbar pr-2">
                            {tensorData?.slice().reverse().map((event: any, i: number) => (
                                <div key={i} className="flex justify-between opacity-80 border-l border-memphis-teal/30 pl-2">
                                    <span>T+{event.t}M {event.entity_id}::{event.feature_group}</span>
                                    <span className="text-memphis-teal">OK</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Roadmap Cards */}
                    <div className="space-y-4" key={data?.kpi_dashboard[0].value}>
                        {data?.roadmap?.map((item: any, idx: number) => (
                          <div 
                            key={item.id} 
                            className="animate-in fade-in slide-in-from-right-4 duration-300"
                            style={{ animationDelay: `${idx * 100}ms` }}
                          >
                            <RoadmapItemCard 
                                item={item} 
                                showDebtOverlay={roadmapOverlay.technicalDebt} 
                            />
                          </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Manager */}
                <div className="w-full lg:w-72 shrink-0 space-y-6">
                    <div className="bg-white border-4 border-black p-5 shadow-memphis space-y-4">
                        <h4 className="text-xs font-black uppercase flex items-center gap-2 border-b-2 border-black pb-2 text-black">
                            <Settings size={14} /> CONTEXT_MANAGER
                        </h4>
                        
                        <div className="space-y-3">
                            {data?.sidebar?.context_manager?.map((toggle: any) => (
                              <OverlayToggle 
                                  key={toggle.id}
                                  label={toggle.label} 
                                  active={roadmapOverlay[toggle.id as keyof typeof roadmapOverlay]} 
                                  onClick={() => toggleRoadmapOverlay(toggle.id as any)} 
                                  icon={getIconByName(toggle.id === 'performance' ? 'bar-chart' : toggle.id === 'security' ? 'shield-alert' : 'zap')}
                                  hexColor={toggle.color}
                              />
                            ))}
                        </div>

                        <div className="pt-2 border-t-2 border-black/10 mt-2">
                            <button 
                                onClick={() => refetch()}
                                disabled={isRefetching}
                                className={`w-full border-4 border-black p-4 text-xs font-black uppercase flex items-center justify-center gap-2 transition-all shadow-memphis-sm active:shadow-none active:translate-x-1 active:translate-y-1 ${isRefetching ? 'bg-memphis-yellow animate-pulse' : 'bg-black text-white hover:bg-memphis-teal hover:text-black'}`}
                            >
                                <RefreshCcw size={16} className={isRefetching ? 'animate-spin' : ''} />
                                {isRefetching ? 'RE-SYNCING...' : 'REROLL_LAYOUT'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-black text-white border-4 border-black p-5 shadow-memphis">
                        <h4 className="text-[10px] font-black uppercase mb-3 flex items-center gap-2 text-memphis-teal">
                            <Target size={14} /> {data?.sidebar?.telemetry?.title || 'VIEWPORT_TELEMETRY'}
                        </h4>
                        <div className="space-y-2 text-[9px] font-mono opacity-80 uppercase">
                            {data?.sidebar?.telemetry?.data?.map((entry: any, i: number) => (
                              <div key={i} className={`flex justify-between ${i > 2 ? 'border-t border-white/20 pt-2 mt-2' : ''}`}>
                                  <span>{entry.key}</span>
                                  <span className={entry.status === 'success' ? 'text-memphis-teal' : entry.status === 'warning' ? 'text-memphis-yellow' : ''}>
                                    {entry.value}
                                  </span>
                              </div>
                            ))}
                        </div>
                    </div>

                    {/* Legal Shield Notice */}
                    <div className="p-3 border-2 border-black bg-memphis-yellow/20 flex gap-3">
                        <ShieldCheck size={20} className="text-black shrink-0" />
                        <div>
                            <div className="text-[9px] font-black uppercase">LEGAL_SHIELD_ACTIVE</div>
                            <div className="text-[8px] font-bold opacity-70 uppercase leading-relaxed mt-1">
                                Dataset encoded for behavioral supports. Human profiling restricted.
                            </div>
                        </div>
                    </div>
                </div>
              </>
          ) : (
              <div className="w-full">
                  <SourceMapView />
              </div>
          )}
      </div>
    </div>
  );
};

const LayersIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
);

const getIconByName = (iconName: string) => {
  switch (iconName) {
    case 'bar-chart': return <BarChart3 size={16} />;
    case 'alert-circle': return <AlertCircle size={16} />;
    case 'shield-alert': return <ShieldAlert size={16} />;
    case 'zap': return <Zap size={16} />;
    default: return <Zap size={16} />;
  }
};

const OverlayToggle: React.FC<{ label: string, active: boolean, onClick: () => void, icon: React.ReactNode, hexColor: string }> = ({ label, active, onClick, icon, hexColor }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between p-3 border-2 border-black font-black text-[10px] uppercase transition-all shadow-memphis-sm active:shadow-none
            ${active ? `text-black translate-x-[1px] translate-y-[1px] shadow-none` : 'bg-memphis-beige text-black/50'}
        `}
        style={active ? { backgroundColor: hexColor } : {}}
    >
        <span className="flex items-center gap-2">{icon} {label}</span>
        <div className={`w-4 h-4 border-2 border-black ${active ? 'bg-black' : 'bg-white'}`} />
    </button>
);

const StatCard: React.FC<{ label: string, value: string, icon: React.ReactNode, hexColor: string }> = ({ label, value, icon, hexColor }) => (
    <div className={`border-4 border-black p-6 shadow-memphis flex flex-col items-center justify-center text-black transition-all hover:-translate-y-1`} style={{ backgroundColor: hexColor }}>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase mb-1">
            {icon}
            {label}
        </div>
        <div className="text-4xl font-black">{value}</div>
    </div>
);

const RoadmapItemCard: React.FC<{ 
    item: any, 
    showDebtOverlay: boolean
}> = ({ item, showDebtOverlay }) => {
    const [expanded, setExpanded] = React.useState(item.status === 'expanded');

    return (
        <div className={`bg-white border-4 border-black shadow-memphis overflow-hidden group transition-all text-black ${expanded ? 'translate-x-1 translate-y-1 shadow-none' : ''}`}>
            <div 
                onClick={() => setExpanded(!expanded)}
                className={`px-4 py-3 flex items-center justify-between cursor-pointer border-b-2 border-black ${item.theme_color} hover:brightness-95`}
            >
                <div className="flex items-center gap-4">
                    <div className="font-black text-sm uppercase tracking-tight">{item.title}</div>
                    <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase">
                        <Calendar size={10} />
                        {item.date}
                    </div>
                    {showDebtOverlay && item.impact_analysis?.technical_debt_level === 'MEDIUM' && (
                        <div className="bg-memphis-pink text-white text-[8px] px-2 py-0.5 font-black uppercase border border-black shadow-memphis-sm">Debt Alert</div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-2 py-0.5 bg-white border-2 border-black text-[10px] font-black uppercase">
                        {item.priority}
                    </div>
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </div>

            {expanded && (
                <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-[10px] font-black uppercase mb-4 flex items-center gap-2 border-b-2 border-black pb-1">
                                <FileCode size={14} /> IMPLEMENTATION_LOG
                            </h4>
                            <div className="space-y-3">
                                {item.implementation_log?.map((task: any) => (
                                    <div key={task.id} className="flex flex-col p-3 bg-memphis-beige border-2 border-black shadow-memphis-sm relative group/task hover:bg-white transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                {task.completed ? <CheckSquare size={14} className="text-memphis-teal" /> : <Square size={14} />}
                                                <span className={`text-xs font-bold ${task.completed ? 'line-through opacity-40' : ''}`}>{task.label}</span>
                                            </div>
                                            <span className="text-[8px] bg-black text-white px-1.5 py-0.5 uppercase flex items-center gap-1 shrink-0">
                                                <Clock size={8} /> {task.date}
                                            </span>
                                        </div>
                                        {task.path && (
                                            <div className="flex items-center gap-1 text-[8px] font-black uppercase opacity-60">
                                                <Code2 size={10} /> {task.path}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 border-2 border-black bg-memphis-yellow/20">
                                <div className="text-[10px] font-black uppercase mb-1">Impact Analysis</div>
                                <div className="text-xs font-black uppercase mb-2 leading-tight">{item.impact_analysis?.title}</div>
                                <div className="text-[10px] font-bold opacity-60 leading-relaxed uppercase">{item.impact_analysis?.description}</div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                <span>Milestone Target</span>
                                <span className="font-black text-memphis-pink underline decoration-2">{item.impact_analysis?.milestone_target}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                <span>Technical Debt</span>
                                <span className={item.impact_analysis?.technical_debt_level === 'MEDIUM' ? 'text-memphis-pink' : 'text-memphis-teal'}>{item.impact_analysis?.technical_debt_level}</span>
                            </div>
                            <div className="w-full h-2 bg-black/10 border border-black overflow-hidden">
                                <div 
                                    className={`h-full ${item.impact_analysis?.technical_debt_level === 'MEDIUM' ? 'bg-memphis-pink' : 'bg-memphis-teal'}`} 
                                    style={{ width: `${item.impact_analysis?.technical_debt_progress || 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoadmapView;
