
import { 
  CoreDataRequestPayload, 
  CoreDataSuccessResponse, 
  User, 
  Conversation, 
  RoadmapItem, 
  LogEntry, 
  SkillDef
} from '../types';

// Import Shared Engines
import { gptRequest } from './ai_engine';

// Import Skill Modules
import { ANKI_SKILL_DEF, executeAnkiSkill } from './skills/anki';
import { PATIENT_SUMMARY_SKILL_DEF, executePatientSummarySkill } from './skills/patient_summary';
import { DATA_SKILL_GUIDE_DEF, LAST_SESSION_ACCURACY, executeScribeSkill, autoScribeSOAP } from './skills/scribe';
import { HYBRID_CODER_SKILL, executeHybridCoderSkill } from './skills/hybrid_coder';

// Re-export specific functions for Store/Components
export { autoScribeSOAP, DATA_SKILL_GUIDE_DEF } from './skills/scribe';
export { gptRequest } from './ai_engine';

export const MOCK_ROADMAP: RoadmapItem[] = [
  {
    id: 'PHASE_1',
    feature: 'PHASE 1: MVP LAUNCH',
    category: 'WEEKS 1-10',
    status: 'DONE',
    priority: 'HIGH',
    impact: 'Critical',
    effort: 'High',
    techDebt: 'Low',
    tasks: [
      { id: 'p1-1', title: 'Audio Capture (Live API)', status: 'DONE', file: 'LiveSessionModal.tsx', datetime: 'WK 2' },
      { id: 'p1-2', title: 'SOAP Generation (Neural Scribe)', status: 'DONE', file: 'services/skills/scribe.ts', datetime: 'WK 4' },
      { id: 'p1-3', title: 'Local Vault (IndexedDB)', status: 'DONE', file: 'storage.ts', datetime: 'WK 6' }
    ]
  },
  {
    id: 'PHASE_2',
    feature: 'PHASE 2: ARTIFACT ENGINE',
    category: 'WEEKS 11-16',
    status: 'DONE',
    priority: 'HIGH',
    impact: 'High',
    effort: 'Medium',
    techDebt: 'Medium',
    tasks: [
      { id: 'p2-1', title: 'Hybrid Coder (ICD-10)', status: 'DONE', file: 'medicalSearch.ts', datetime: 'WK 11' },
      { id: 'p2-2', title: 'Anki Card Generator', status: 'DONE', file: 'services/skills/anki.ts', datetime: 'WK 13' },
      { id: 'p2-3', title: 'Patient Summaries', status: 'DONE', file: 'services/skills/patient_summary.ts', datetime: 'WK 15' },
      { id: 'p2-4', title: 'CME Credit Engine', status: 'DONE', file: 'store.ts (signCurrentEncounter)', datetime: 'WK 16' },
      { id: 'p2-5', title: 'Doctor Review Gate', status: 'DONE', file: 'SOAPGrid.tsx', datetime: 'WK 16' }
    ]
  },
  {
    id: 'PHASE_3',
    feature: 'PHASE 3: MCP ECOSYSTEM',
    category: 'WEEKS 17+',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    impact: 'High',
    effort: 'High',
    techDebt: 'Medium',
    tasks: [
      { id: 'p3-0', title: 'Neural Bridge (Gemini Live)', status: 'DONE', file: 'LiveSessionModal.tsx', datetime: 'WK 17' },
      { id: 'p3-1', title: 'Skill Runtime (Fluid Nodes)', status: 'DONE', file: 'services/skills/*.ts', datetime: 'WK 18' },
      { id: 'p3-2', title: 'Marketplace Interface', status: 'DONE', file: 'pages/SkillsMarketplace.tsx', datetime: 'WK 18' },
      { id: 'p3-3', title: 'EMR Integration (Epic/Cerner)', status: 'BLOCKED', blockedBy: ['MCP Protocol Finalization'] },
      { id: 'p3-4', title: 'Multi-Modal RAG', status: 'IN_PROGRESS', todo: 'Integrate Vector Store' }
    ]
  }
];

export const MOCK_SKILLS: SkillDef[] = [
    DATA_SKILL_GUIDE_DEF, 
    HYBRID_CODER_SKILL, 
    ANKI_SKILL_DEF, 
    PATIENT_SUMMARY_SKILL_DEF
];

export const fetchRoadmapData = async () => {
  const displayAccuracy = (LAST_SESSION_ACCURACY * 100).toFixed(1) + '%';
  
  // Transform MOCK_ROADMAP into the format expected by RoadmapView
  const items = MOCK_ROADMAP.map(phase => ({
      id: phase.id,
      title: phase.feature,
      date: phase.category,
      priority: phase.priority,
      theme_color: phase.status === 'DONE' ? 'bg-memphis-teal' : phase.status === 'BLOCKED' ? 'bg-memphis-pink' : 'bg-memphis-yellow',
      status: phase.status,
      implementation_log: phase.tasks?.map(t => ({
          id: t.id,
          label: t.title,
          path: t.file ? `</> ${t.file}` : undefined,
          date: t.datetime || t.status,
          completed: t.status === 'DONE'
      })),
      impact_analysis: {
          title: `STRATEGY: ${phase.feature}`,
          description: `Strategic execution of ${phase.feature}. Focus on ${phase.impact} impact and ${phase.techDebt} technical debt management.`,
          milestone_target: phase.status === 'DONE' ? 'COMPLETED' : phase.status === 'IN_PROGRESS' ? 'ACTIVE_SPRINT' : 'REVENUE_READY',
          technical_debt_level: phase.techDebt.toUpperCase(),
          technical_debt_progress: phase.status === 'DONE' ? 100 : phase.status === 'IN_PROGRESS' ? 65 : 45
      }
  }));

  return {
    "meta": { "title": "RANVIER FLIGHT PLAN", "subtitle": "Strategic Rollout: MVP (Ph1) → Artifacts (Ph2) → Ecosystem (Ph3)", "theme": "neo-brutalist", "font": "monospace" },
    "kpi_dashboard": [
      { "id": "kpi-1", "label": "CODING ACCURACY", "value": displayAccuracy, "icon": "zap", "color": "#00FFC2" },
      { "id": "kpi-2", "label": "PRIVACY LEVEL", "value": "SHIELDED", "icon": "shield-check", "color": "#A388EE" },
      { "id": "kpi-3", "label": "VAULT STATUS", "value": "LOCAL", "icon": "bar-chart", "color": "#F9E96D" }
    ],
    "roadmap": items,
    "sidebar": {
      "context_manager": [
        { "id": "performance", "label": "HYBRID LATENCY", "active": true, "color": "#00FFC2" },
        { "id": "security", "label": "PRIVACY SHIELD", "active": true, "color": "#A388EE" }
      ],
      "telemetry": {
        "title": "CODER_PRD_SPECS",
        "data": [
          { "key": "ALGORITHM:", "value": "BM25/Fuzzy", "status": "success" },
          { "key": "MATCH ACCURACY:", "value": displayAccuracy, "status": "success" },
          { "key": "DB SOURCE:", "value": "ICD10/CPT Local", "status": "success" }
        ]
      }
    }
  };
};

export const fetchTensorStream = async () => [{ "t": 0, "entity_id": "Coder_v2", "feature_group": "Hybrid", "novelty_drive": 0.99 }];

export const sendCoreDataCommand = async (payload: CoreDataRequestPayload): Promise<CoreDataSuccessResponse> => {
  const commandLower = payload.command.toLowerCase();
  
  // Route: Anki Generator
  if (commandLower.startsWith('/anki')) {
     return executeAnkiSkill(commandLower);
  }

  // Route: Patient Summary
  if (commandLower.startsWith('/summary')) {
     return executePatientSummarySkill(commandLower);
  }

  // Route: Medical Scribe (Direct CLI)
  if (commandLower.startsWith('/scribe')) {
     return executeScribeSkill(commandLower);
  }

  // Route: Hybrid Coder (Direct CLI)
  if (commandLower.startsWith('/code') || commandLower.startsWith('/billing')) {
     return executeHybridCoderSkill(commandLower);
  }

  // Default Route: General Intelligence
  const result = await gptRequest(payload.command, 'gemini-flash-lite-latest');
  return { message: result.text };
};

export const loginUser = async (username: string): Promise<User> => ({ id: `user_${Math.random()}`, username });

export const getHistory = (user: User): Conversation[] => {
    const data = localStorage.getItem(`history_${user.id}`);
    return data ? JSON.parse(data) : [];
};

export const saveConversationToHistory = (user: User, logs: LogEntry[]) => {
  const history = getHistory(user);
  const newConversation: Conversation = { id: `conv_${Date.now()}`, date: new Date().toLocaleString(), preview: "Interaction", logs };
  localStorage.setItem(`history_${user.id}`, JSON.stringify([newConversation, ...history].slice(0, 20)));
};
