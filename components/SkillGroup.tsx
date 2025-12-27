import React from 'react';
import { SkillExecutionData } from '../types';
import SkillCard from './SkillCard';
import { ArrowDown, GitMerge } from 'lucide-react';

interface SkillGroupProps {
    skills: SkillExecutionData[];
    mode: 'sequential' | 'concurrent';
}

const SkillGroup: React.FC<SkillGroupProps> = ({ skills, mode }) => {
    
    if (mode === 'concurrent') {
        return (
            <div className="my-6">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <GitMerge size={14} className="text-blue-400 rotate-90" />
                    <span className="text-[10px] uppercase font-mono text-blue-400 tracking-widest font-bold">
                        Concurrent Execution Pool
                    </span>
                    <div className="h-px flex-1 bg-blue-400/20 border-t border-dashed border-blue-400/40" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill, index) => (
                        <div key={index} className="flex-1 min-w-0">
                            <SkillCard data={skill} compact />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Sequential Mode
    return (
        <div className="my-6 relative pl-4 border-l border-terminal-border/30 ml-2">
            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-terminal-border" />
            
            <div className="flex items-center gap-2 mb-4">
                 <span className="text-[10px] uppercase font-mono text-terminal-dim tracking-widest font-bold">
                    Sequential Workflow
                </span>
            </div>

            <div className="space-y-1">
                {skills.map((skill, index) => (
                    <div key={index} className="relative">
                        <SkillCard data={skill} compact />
                        
                        {/* Connecting Arrow for all but last */}
                        {index < skills.length - 1 && (
                            <div className="flex justify-center py-1 text-terminal-dim">
                                <ArrowDown size={14} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="absolute -left-[5px] bottom-0 w-2.5 h-2.5 rounded-full bg-terminal-accent" />
        </div>
    );
};

export default SkillGroup;