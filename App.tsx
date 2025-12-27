
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import LogStream from './components/LogStream';
import RoadmapView from './components/RoadmapView';
import { Security } from './pages/Security';
import { SkillsMarketplace } from './pages/SkillsMarketplace';
import SkillDetailView from './components/SkillDetailView';
import AuthModal from './components/AuthModal';
import HistoryModal from './components/HistoryModal';
import LiveSessionModal from './components/LiveSessionModal';
import SOAPGrid from './components/SOAPGrid';
import { useAppStore } from './store';

const queryClient = new QueryClient();

function ViewSwitcher() {
  const { currentView, selectedSkill, setSelectedSkill } = useAppStore();

  switch (currentView) {
    case 'ROADMAP':
      return <RoadmapView />;
    case 'SECURITY':
      return <Security />;
    case 'SKILLS_MARKETPLACE':
      return <SkillsMarketplace />;
    case 'CLINICAL_ENCOUNTER':
      return <SOAPGrid />;
    case 'SKILL_DETAIL':
      return selectedSkill ? (
        <SkillDetailView skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      ) : <LogStream />;
    case 'TERMINAL':
    default:
      return <LogStream />;
  }
}

function AppContent() {
  const { setCommandPaletteOpen } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <ViewSwitcher />
        <AuthModal />
        <HistoryModal />
        <LiveSessionModal />
      </Layout>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
