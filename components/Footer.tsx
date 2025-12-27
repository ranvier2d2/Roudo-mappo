import React from 'react';
import { MessageSquare, Coins, Download, Settings, Users } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <div className="bg-terminal-black border-t border-terminal-border py-2 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] text-terminal-dim font-mono uppercase tracking-wider">
        <div className="flex items-center gap-4">
            <span>Document Edits Complete</span>
        </div>
        
        <div className="flex items-center gap-1">
            <FooterButton icon={<MessageSquare size={12}/>} label="Contact Data" />
            <div className="w-px h-3 bg-terminal-border mx-1" />
            <FooterButton icon={<Coins size={12}/>} label="Get Credits" />
            <FooterButton icon={<Download size={12}/>} label="Get Revenue" />
            <FooterButton icon={<Settings size={12}/>} label="Settings" />
            <div className="w-px h-3 bg-terminal-border mx-1" />
            <FooterButton icon={<Users size={12}/>} label="Get Users" />
        </div>
      </div>
    </div>
  );
};

const FooterButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <button className="flex items-center gap-1.5 px-3 py-1 hover:text-white hover:bg-terminal-dark rounded transition-colors">
        {icon}
        <span>{label}</span>
    </button>
)

export default Footer;
