import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { MOCK_SKILLS } from '../services/api';
import { Card, CardHeader, CardContent } from '../components/Card';
import { ShoppingBag, Star, Search, Filter, Rocket, Sparkles, X, ChevronDown } from 'lucide-react';

export function SkillsMarketplace() {
  const { setSelectedSkill } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'reliability' | 'cost'>('name');

  const categories = ['All', 'Medical', 'Administrative', 'Logic', 'Vision', 'Voice'];

  const filteredAndSortedSkills = useMemo(() => {
    let result = MOCK_SKILLS.filter((skill) => {
      const searchLower = searchQuery.toLowerCase();
      const terms = searchLower.split(/\s+/).filter(t => t.length > 0);
      
      const matchesSearch = terms.length === 0 || terms.every(term => 
        skill.displayName.toLowerCase().includes(term) ||
        skill.description.toLowerCase().includes(term) ||
        skill.keywords.some(k => k.toLowerCase().includes(term))
      );
      
      const matchesCategory = 
        activeCategory === 'All' || 
        skill.skillClass?.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    return result.sort((a, b) => {
      if (sortBy === 'name') return a.displayName.localeCompare(b.displayName);
      if (sortBy === 'reliability') return b.reliabilityRatio - a.reliabilityRatio;
      if (sortBy === 'cost') {
        const costA = parseFloat(a.sotaEstimatedCost.replace(/[^0-9.]/g, '')) || 0;
        const costB = parseFloat(b.sotaEstimatedCost.replace(/[^0-9.]/g, '')) || 0;
        return costA - costB;
      }
      return 0;
    });
  }, [searchQuery, activeCategory, sortBy]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-mono text-black">
      {/* Hero Section */}
      <div className="mb-12 bg-memphis-yellow border-4 border-black p-8 shadow-memphis relative overflow-hidden transform -rotate-1">
        <div className="absolute top-0 right-0 w-48 h-48 bg-memphis-teal -mr-16 -mt-16 transform rotate-45 border-l-4 border-b-4 border-black" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-black text-white p-3 border-2 border-black shadow-memphis-sm">
              <ShoppingBag size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">SKILLS MARKETPLACE</h1>
          </div>
          <p className="text-lg font-bold max-w-2xl leading-relaxed">
            Expand the capabilities of your Ranvier Core. Discover, customize, and deploy neural nodes from the global DATA community.
          </p>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-4">
          <div className="bg-white border-2 border-black px-4 py-2 font-black text-xs uppercase flex items-center gap-2">
            <Rocket size={16} /> {filteredAndSortedSkills.length} of {MOCK_SKILLS.length} Nodes Active
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/50 group-focus-within:text-memphis-pink transition-colors" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter nodes by name, description, or keyword..." 
            className="w-full bg-white border-4 border-black py-4 pl-12 pr-12 font-black uppercase text-sm focus:outline-none focus:shadow-memphis transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-memphis-pink rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-black p-1 border-2 border-black overflow-x-auto">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[10px] font-black uppercase transition-colors whitespace-nowrap ${activeCategory === cat ? 'bg-memphis-teal text-black' : 'text-gray-400 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white border-4 border-black pl-4 pr-10 py-2.5 font-black uppercase text-[10px] focus:outline-none focus:shadow-memphis transition-all cursor-pointer"
            >
              <option value="name">Sort: A-Z</option>
              <option value="reliability">Sort: Reliability</option>
              <option value="cost">Sort: Cost (Low-High)</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAndSortedSkills.length > 0 ? (
          filteredAndSortedSkills.map((skill) => (
            <div key={skill.skillDUID} className="group">
              <Card variant="window" className="h-full hover:-translate-y-2 hover:translate-x-2 transition-transform cursor-default">
                <CardHeader 
                  title={skill.displayName} 
                  subtitle={`v${skill.skillVersion} • ${skill.author}`} 
                  color={skill.skillClass === 'medical' ? 'teal' : 'pink'}
                />
                <CardContent className="flex flex-col h-full bg-memphis-beige/30">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="bg-white border-4 border-black p-4 text-4xl shadow-memphis-sm group-hover:shadow-none transition-shadow rotate-3 group-hover:rotate-0">
                      {skill.emoji}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex text-memphis-purple">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            size={12} 
                            fill={s <= Math.round(skill.reliabilityRatio * 5) ? "currentColor" : "none"} 
                            stroke="currentColor"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-black uppercase opacity-50">
                        {Math.round(skill.reliabilityRatio * 100)}% RELIABLE
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-bold leading-relaxed mb-6 opacity-80 line-clamp-3">
                    {skill.description.replace(/# .*\n\n/, '')}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {skill.keywords.slice(0, 3).map(kw => (
                      <span key={kw} className="px-2 py-0.5 bg-white border border-black text-[8px] font-black uppercase">
                        {kw}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t-2 border-black border-dashed flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black opacity-50 uppercase">Cost / Use</span>
                      <span className="text-sm font-black text-memphis-pink">{skill.sotaEstimatedCost}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedSkill(skill)}
                      className="bg-black text-white px-6 py-2 border-2 border-black font-black uppercase text-xs hover:bg-memphis-teal hover:text-black transition-all flex items-center gap-2 active:translate-x-1 active:translate-y-1 shadow-memphis-sm hover:shadow-none"
                    >
                      <Sparkles size={14} /> EXPLORE
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-span-full border-4 border-black border-dashed p-16 flex flex-col items-center justify-center text-center opacity-60 bg-gray-50/50">
            <Search size={64} className="mb-6 text-memphis-pink" />
            <h3 className="font-black uppercase text-2xl mb-2 tracking-tighter">No Shards Found</h3>
            <p className="text-sm font-bold leading-relaxed max-w-sm mb-8">
              "<strong>{searchQuery}</strong>" didn't match any active neural nodes. Try adjusting your parameters or browse by category.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="bg-black text-white px-8 py-3 border-2 border-black font-black uppercase text-xs hover:bg-memphis-teal hover:text-black transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}