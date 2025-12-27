import React, { useState, useRef } from 'react';
import { Cpu, Zap, Network, GitBranch, ArrowRight, Layers } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    icon: <Network className="text-memphis-teal" size={20} />,
    category: "NEURAL",
    topic: "BACKBONE",
    completeness: "v1.0.4",
    text: "The neural backbone of DATA: A universal bridge allowing diverse skill runtimes (Python/UV) to flow seamlessly into a unified Edge API."
  },
  {
    id: 2,
    icon: <Zap className="text-memphis-yellow" size={20} />,
    category: "FLUID",
    topic: "SKILLS",
    completeness: "STABLE",
    text: "Isolated Python environments running on the edge, orchestrated for the DATA universal interface using Gemini 3 Pro reasoning."
  },
  {
    id: 3,
    icon: <Cpu className="text-memphis-pink" size={20} />,
    category: "MULTI",
    topic: "RUNTIME",
    completeness: "ACTIVE",
    text: "A multi-runtime skill orchestrator (Python/Rust/Go) designed for fluid edge compute and the DATA unified native platform."
  }
];

const DescriptionCarousel: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollLeft = container.scrollLeft;
            const containerCenter = scrollLeft + (container.offsetWidth / 2);
            const children = Array.from(container.children);
            let closestIndex = activeIndex;
            let minDiff = Infinity;
            
            children.forEach((child, index) => {
                const htmlChild = child as HTMLElement;
                const childCenter = htmlChild.offsetLeft + (htmlChild.offsetWidth / 2);
                const diff = Math.abs(containerCenter - childCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = index;
                }
            });
            if (closestIndex !== activeIndex) setActiveIndex(closestIndex);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
            {/* Carousel Container */}
            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex items-stretch overflow-x-auto snap-x snap-mandatory gap-6 pb-6 hide-scroll px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {SLIDES.map((slide) => (
                    <div 
                        key={slide.id} 
                        className="snap-center shrink-0 w-full bg-terminal-dark/90 backdrop-blur-md border-4 border-terminal-border rounded-2xl p-8 relative overflow-hidden group shadow-memphis-lg border-dashed"
                    >
                        {/* Tags / Badges from Diagram */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-memphis-teal/20 border-2 border-memphis-teal text-memphis-teal px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {slide.category}
                            </div>
                            <div className="bg-white border-2 border-black text-black px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                                {slide.topic}
                            </div>
                            <div className="ml-auto text-terminal-dim text-[10px] font-mono">
                                {slide.completeness}
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-5">
                            <div className="p-3 bg-terminal-black border-2 border-terminal-border rounded-xl shadow-inner shrink-0">
                                {slide.icon}
                            </div>
                            <div className="space-y-4">
                                <p className="font-mono text-sm text-gray-300 leading-relaxed italic opacity-90">
                                    "{slide.text}"
                                </p>
                                <div className="flex items-center gap-2 text-terminal-accent text-[9px] font-black uppercase tracking-[0.3em]">
                                    <ArrowRight size={12} /> INITIALIZED_LINK
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Indicators */}
            <div className="flex justify-center gap-3 mt-4">
                {SLIDES.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => {
                            if (scrollRef.current) {
                                const target = scrollRef.current.children[idx] as HTMLElement;
                                scrollRef.current.scrollTo({ left: target.offsetLeft - 20, behavior: 'smooth' });
                            }
                        }}
                        className={`h-2 rounded-full transition-all duration-500 ${idx === activeIndex ? 'w-12 bg-memphis-teal shadow-[0_0_10px_rgba(35,240,199,0.5)]' : 'w-2 bg-terminal-border hover:bg-terminal-dim'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default DescriptionCarousel;