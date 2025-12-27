import React, { useState } from 'react';
import { 
  Wrench, Mic, Zap, AlertTriangle, Info, Clock, 
  DollarSign, BarChart, ChevronDown, ChevronUp, Code2,
  ExternalLink, Share2, Heart, MessageSquare, Twitter, Globe,
  PlayCircle, Sparkles, XCircle, Brain
} from 'lucide-react';
import { SkillDef, LogType } from '../types';
import { Button } from './Button';
import { Card, CardContent, CardHeader } from './Card';
import { useAppStore } from '../store';
import { sendCoreDataCommand } from '../services/api';

interface SkillDetailViewProps {
  skill: SkillDef;
  onClose: () => void;
}

const SkillDetailView: React.FC<SkillDetailViewProps> = ({ skill, onClose }) => {
  const { setPending, addLog } = useAppStore();
  const [instructions, setInstructions] = useState('');
  const [showSource, setShowSource] = useState(false);
  const [executionInput, setExecutionInput] = useState('');

  const handleRunSkill = async () => {
    if (!executionInput.trim()) {
        alert("Please provide some input context for the skill to process.");
        return;
    }
    
    setPending(true);
    // Mimic the terminal command for this skill
    const command = `/${skill.fileName.toLowerCase()} ${executionInput}`;
    
    addLog({ 
        id: crypto.randomUUID(), 
        timestamp: new Date().toISOString(), 
        type: LogType.USER_COMMAND, 
        content: `RUN_NODE: ${skill.displayName}` 
    });

    try {
        const response = await sendCoreDataCommand({ 
            command: executionInput, // The skill routes logic might need the command string
            timestamp: Date.now() 
        });

        // Special routing for skill-specific execution logic
        // Since executeAnkiSkill etc take the command, we build it
        const result = await sendCoreDataCommand({
            command: `/${skill.fileName.toLowerCase()} ${executionInput}`,
            timestamp: Date.now()
        });

        if (result.message) {
            addLog({ 
                id: crypto.randomUUID(), 
                timestamp: new Date().toISOString(), 
                type: LogType.AI_RESPONSE, 
                content: result.message 
            });
        }
        if (result.skill) {
            addLog({ 
                id: crypto.randomUUID(), 
                timestamp: new Date().toISOString(), 
                type: LogType.SKILL_EXECUTION, 
                content: "Result", 
                metadata: result.skill 
            });
        }
        
        alert("Execution successful! Check the Terminal for results.");
        onClose();
    } catch (e: any) {
        addLog({ 
            id: crypto.randomUUID(), 
            timestamp: new Date().toISOString(), 
            type: LogType.ERROR, 
            content: "Execution Failed: " + e.message 
        });
    } finally {
        setPending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-memphis-beige min-h-full font-mono animate-in fade-in duration-300">
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header Section */}
        <div className="bg-black text-white p-6 border-4 border-black shadow-memphis flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-memphis-yellow p-3 border-2 border-black rotate-3 text-black">
              <span className="text-3xl">{skill.emoji}</span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase">{skill.displayName}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge icon={<DollarSign size={10}/>} label={`Cost: ${skill.sotaEstimatedCost}`} />
                <Badge icon={<Clock size={10}/>} label={`Time: ${skill.estimatedRunTime}`} />
                <Badge icon={<BarChart size={10}/>} label={`Reliability: ${skill.reliabilityRatio * 100}%`} />
                <Badge icon={<Brain size={10}/>} label={skill.model} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 border-2 border-white hover:bg-memphis-pink hover:border-black hover:text-black transition-all">
             <XCircleIcon />
          </button>
        </div>

        {/* EXECUTION PORTAL (NEW) */}
        <Card className="border-memphis-teal border-4">
           <CardHeader 
            title="EXECUTION PORTAL" 
            subtitle={`Run ${skill.displayName} Node via Gemini Neural Bridge`}
            color="teal"
          />
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black uppercase opacity-60">Node Input / Context</label>
                <textarea 
                    value={executionInput}
                    onChange={(e) => setExecutionInput(e.target.value)}
                    placeholder={`Enter details to process with ${skill.displayName}...`}
                    className="w-full h-32 bg-terminal-dark text-white border-2 border-black p-4 font-mono text-sm focus:outline-none focus:border-memphis-teal transition-all"
                />
            </div>
            <Button 
                variant="primary" 
                className="w-full py-6 text-lg" 
                leftIcon={<PlayCircle size={24} />}
                onClick={handleRunSkill}
            >
                EXECUTE NEURAL NODE
            </Button>
          </CardContent>
        </Card>

        {/* Customization Tool */}
        <Card className="!bg-white">
          <CardHeader 
            title={`Skill Evolution`} 
            subtitle="Request model fine-tuning or logic shifts"
            color="yellow"
          />
          <CardContent className="space-y-4">
            <textarea 
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Describe how you want to evolve this skill's logic..."
              className="w-full h-32 bg-memphis-beige border-4 border-black p-4 font-mono text-sm focus:outline-none focus:shadow-memphis transition-shadow"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="primary" 
                className="flex-1" 
                onClick={() => alert("Evolving logic...")}
                disabled={!instructions.trim()}
              >
                COMMIT LOGIC EVOLUTION
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DetailItem title="System Dependencies" content={skill.dependencies.join(', ')} />
            <DetailItem title="Fact Checking" content={skill.factChecking} />
            <DetailItem title="Known Issues" content={skill.knownIssues} />
            <DetailItem title="Roadmap" content={skill.roadmap} />
          </div>
          <div className="space-y-6">
            <DetailItem title="Walkthrough" content={skill.walkthrough} />
            <div className="p-4 border-4 border-black bg-memphis-pink shadow-memphis flex items-center justify-between">
              <div>
                <h5 className="font-black text-xs uppercase mb-1">Author: {skill.author}</h5>
                <div className="flex gap-2">
                  <a href={skill.socialHandle} target="_blank" className="hover:scale-110 transition-transform"><Twitter size={14}/></a>
                  <a href={skill.promoUrl} target="_blank" className="hover:scale-110 transition-transform"><Globe size={14}/></a>
                </div>
              </div>
              <Button variant="secondary" size="small" onClick={() => window.open(skill.donateLink)}>DONATE</Button>
            </div>
          </div>
        </div>

        {/* Source Code Section */}
        {skill.sourceCode && (
          <div className="border-4 border-black shadow-memphis">
            <button 
              onClick={() => setShowSource(!showSource)}
              className="w-full bg-black text-white p-3 flex items-center justify-between hover:bg-black/90 transition-colors"
            >
              <div className="flex items-center gap-2 font-black text-sm uppercase">
                <Code2 size={18} className="text-memphis-teal" /> SOURCE CODE
              </div>
              {showSource ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
            </button>
            {showSource && (
              <div className="bg-terminal-black p-4 overflow-x-auto">
                <pre className="text-memphis-teal font-mono text-xs leading-relaxed">
                  {skill.sourceCode}
                </pre>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center py-10 opacity-50">
          <p className="text-[10px] font-bold uppercase tracking-widest">Published: {skill.createdAt}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Updated: {skill.updatedAt}</p>
        </div>
      </div>
    </div>
  );
};

const Badge: React.FC<{ icon?: React.ReactNode, label: string }> = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black/10 border border-black/20 rounded text-[9px] font-black uppercase text-black">
    {icon} {label}
  </span>
);

const DetailItem: React.FC<{ title: string, content: string }> = ({ title, content }) => (
  <div className="space-y-2">
    <h5 className="font-black text-xs uppercase flex items-center gap-2">
      <div className="w-1.5 h-1.5 bg-black" /> {title}
    </h5>
    <div className="bg-white border-2 border-black p-3 text-xs font-bold leading-relaxed opacity-80">
      {content}
    </div>
  </div>
);

const XCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);

export default SkillDetailView;