
/**
 * Global application state interface (Zustand).
 */
export interface AppState {
  logs: LogEntry[];
  isPending: boolean;
  user: null | User;
  currentView: ViewMode;
  selectedSkill: SkillDef | null;
  isAuthModalOpen: boolean;
  isHistoryModalOpen: boolean;
  isLiveModalOpen: boolean;
  isCommandPaletteOpen: boolean;
  
  /** Phase 4: Shield & Privacy */
  privacyMode: boolean;
  setPrivacyMode: (active: boolean) => void;
  
  /** Roadmap Specific State */
  activeRoadmapTab: RoadmapTab;
  roadmapOverlay: RoadmapOverlayConfig;
  
  /** Phase 2 & 4: Medical Encounter & Persistence */
  currentEncounter: MedicalEncounter | null;
  encountersHistory: MedicalEncounter[];
  
  /** Actions */
  addLog: (log: LogEntry) => void;
  setPending: (pending: boolean) => void;
  clearLogs: () => void;
  setUser: (user: User | null) => void;
  setView: (view: ViewMode) => void;
  setSelectedSkill: (skill: SkillDef | null) => void;
  setAuthModalOpen: (isOpen: boolean) => void;
  setHistoryModalOpen: (isOpen: boolean) => void;
  setLiveModalOpen: (isOpen: boolean) => void;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  loadConversation: (logs: LogEntry[]) => void;
  
  /** Medical Actions */
  startEncounter: () => void;
  updateEncounterField: (field: SOAPTextKey, value: string) => void;
  processEncounter: () => Promise<void>;
  saveCurrentEncounter: () => Promise<void>;
  signCurrentEncounter: () => Promise<void>;
  loadEncounters: () => Promise<void>;

  /** Roadmap Actions */
  setRoadmapTab: (tab: RoadmapTab) => void;
  toggleRoadmapOverlay: (key: keyof RoadmapOverlayConfig) => void;
}

export interface MedicalCode {
  code: string;
  description: string;
  type: 'ICD-10' | 'CPT';
}

export type SOAPTextKey = 'subjective' | 'objective' | 'assessment' | 'plan';

export interface SOAPData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  coding?: MedicalCode[];
}

export interface MedicalEncounter {
  id: string;
  patientName: string;
  timestamp: string;
  soap: SOAPData;
  rawTranscript: string[];
  status: 'draft' | 'signed';
  cmePoints?: number;
  signedAt?: string;
}

export enum LogType {
  USER_COMMAND = 'USER_COMMAND',
  SYSTEM_LOG = 'SYSTEM_LOG',
  AI_RESPONSE = 'AI_RESPONSE',
  SKILL_EXECUTION = 'SKILL_EXECUTION',
  SKILL_GROUP = 'SKILL_GROUP',
  IMAGE = 'IMAGE',
  ERROR = 'ERROR'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: LogType;
  content: string;
  metadata?: any;
}

export interface SkillExecutionData {
  skillName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message: string;
  warning?: string;
  linkUrl?: string;
  code?: string;
}

export interface SkillDef {
  fileName: string;
  displayName: string;
  model: string;
  recommendedModels: string[];
  emoji: string;
  headerImage?: string;
  icon?: string;
  description: string;
  reliability: string;
  reliabilityRatio: number;
  keywords: string[];
  factChecking: string;
  estimatedRunTime: string;
  sotaEstimatedCost: string;
  maxConcurrency: number;
  prePrompt: boolean;
  dependencies: string[];
  skillClass: string;
  knownIssues: string;
  roadmap: string;
  walkthrough: string;
  author: string;
  authorDUID: string;
  paypalEmail: string;
  donateLink: string;
  socialHandle: string;
  promoUrl: string;
  supportUrl: string;
  skillDUID: string;
  skillVersion: string;
  dataVersion: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  sourceCode?: string;
}

export interface CoreDataRequestPayload {
  command: string;
  timestamp: number;
  context?: any;
}

export interface CoreDataSuccessResponse {
  message: string;
  logs?: string[];
  skill?: SkillExecutionData;
  skills?: SkillExecutionData[];
  executionMode?: 'sequential' | 'concurrent';
  image?: string;
}

export interface User {
  id: string;
  username: string;
}

export interface Conversation {
  id: string;
  date: string;
  preview: string;
  logs: LogEntry[];
}

export type ViewMode = 'TERMINAL' | 'ROADMAP' | 'SECURITY' | 'SKILL_DETAIL' | 'SKILLS_MARKETPLACE' | 'CLINICAL_ENCOUNTER';
export type SourceFileType = 'file' | 'component' | 'store' | 'service' | 'types' | 'util' | 'config' | 'python' | 'toml';

export interface FileData {
    name: string;
    path: string;
    type: SourceFileType;
    content: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
  file?: string;
  blockedBy?: string[];
  todo?: string;
  datetime?: string;
}

export interface RoadmapItem {
  id: string;
  feature: string;
  category: string; 
  status: 'BLOCKED' | 'IN_PROGRESS' | 'PLANNED' | 'DONE';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  impact: string;
  effort: string;
  techDebt: string;
  tasks?: RoadmapTask[];
  datetime?: string;
}

export interface RoadmapOverlayConfig {
    performance: boolean;
    security: boolean;
    technicalDebt: boolean;
}

export type RoadmapTab = 'roadmap' | 'sourcemap';
