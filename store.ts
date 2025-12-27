
import { create } from 'zustand';
import { AppState, LogEntry, User, ViewMode, SkillDef, RoadmapTab, RoadmapOverlayConfig, SOAPData, LogType, MedicalEncounter, SOAPTextKey } from './types';
// Updated import path for autoScribeSOAP
import { autoScribeSOAP } from './services/skills/scribe';
import { saveEncounter, getAllEncounters } from './services/storage';

export const useAppStore = create<AppState>((set, get) => ({
  logs: [],
  isPending: false,
  user: null,
  currentView: 'TERMINAL',
  selectedSkill: null,
  isAuthModalOpen: false,
  isHistoryModalOpen: false,
  isLiveModalOpen: false,
  isCommandPaletteOpen: false,
  
  // Shield State
  privacyMode: false,
  setPrivacyMode: (active: boolean) => set({ privacyMode: active }),

  // Medical Encounter
  currentEncounter: null,
  encountersHistory: [],

  // Roadmap Extensions
  activeRoadmapTab: 'roadmap',
  roadmapOverlay: {
    performance: true,
    security: true,
    technicalDebt: false
  },

  addLog: (log: LogEntry) => set((state) => {
    const updatedEncounter = state.currentEncounter ? {
      ...state.currentEncounter,
      rawTranscript: [...state.currentEncounter.rawTranscript, log.content]
    } : null;

    return { 
      logs: [...state.logs, log],
      currentEncounter: updatedEncounter
    };
  }),
  
  setPending: (pending: boolean) => set({ isPending: pending }),
  clearLogs: () => set({ logs: [] }),
  
  setUser: (user: User | null) => set({ user }),
  setView: (view: ViewMode) => set({ currentView: view }),
  setSelectedSkill: (skill: SkillDef | null) => set({ selectedSkill: skill, currentView: skill ? 'SKILL_DETAIL' : 'TERMINAL' }),
  setAuthModalOpen: (isOpen: boolean) => set({ isAuthModalOpen: isOpen }),
  setHistoryModalOpen: (isOpen: boolean) => set({ isHistoryModalOpen: isOpen }),
  setLiveModalOpen: (isOpen: boolean) => set({ isLiveModalOpen: isOpen }),
  setCommandPaletteOpen: (isOpen: boolean) => set({ isCommandPaletteOpen: isOpen }),
  loadConversation: (logs: LogEntry[]) => set({ logs, currentView: 'TERMINAL' }),

  startEncounter: () => set({
    currentEncounter: {
      id: crypto.randomUUID(),
      patientName: "Patient_" + Math.random().toString(36).substring(7).toUpperCase(),
      timestamp: new Date().toISOString(),
      rawTranscript: [],
      soap: { subjective: '', objective: '', assessment: '', plan: '', coding: [] },
      status: 'draft'
    },
    currentView: 'CLINICAL_ENCOUNTER'
  }),

  updateEncounterField: (field: SOAPTextKey, value: string) => set((state) => ({
    currentEncounter: state.currentEncounter && state.currentEncounter.status !== 'signed' ? {
      ...state.currentEncounter,
      soap: { 
        ...state.currentEncounter.soap, 
        [field]: value 
      }
    } : state.currentEncounter
  })),

  /** PHASE 3 & 4: THE BRAIN + CODER ACTION */
  processEncounter: async () => {
    const state = get();
    if (!state.currentEncounter || state.currentEncounter.rawTranscript.length === 0) return;

    set({ isPending: true });
    try {
      const structuredSOAP = await autoScribeSOAP(state.currentEncounter.rawTranscript);
      
      const updatedEncounter: MedicalEncounter = {
          ...state.currentEncounter,
          soap: structuredSOAP
      };

      set({ currentEncounter: updatedEncounter });

      // Auto-save to Vault
      await saveEncounter(updatedEncounter);
      await get().loadEncounters();

      state.addLog({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        type: LogType.SYSTEM_LOG,
        content: "[BRAIN] SOAP Structure & Medical Coding finalized. Saved to Vault."
      });
    } catch (error: any) {
      state.addLog({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        type: LogType.ERROR,
        content: "Neural Structuring Error: " + error.message
      });
    } finally {
      set({ isPending: false });
    }
  },

  saveCurrentEncounter: async () => {
      const { currentEncounter } = get();
      if (!currentEncounter) return;
      await saveEncounter(currentEncounter);
      await get().loadEncounters();
  },

  /** 
   * Review Gate & CME Calculation 
   * Bridges Gap: "Doctor Review Gate" and "CME Credits"
   */
  signCurrentEncounter: async () => {
    const { currentEncounter, addLog, loadEncounters } = get();
    if (!currentEncounter || currentEncounter.status === 'signed') return;

    // Calculate CME Credits based on complexity (number of extracted codes)
    const codeCount = currentEncounter.soap.coding?.length || 0;
    // Formula: 0.5 points per code, max 5 points per encounter
    const cmeEarned = Math.min(5, Math.ceil(codeCount * 0.5 * 10) / 10);

    const signedEncounter: MedicalEncounter = {
        ...currentEncounter,
        status: 'signed',
        cmePoints: cmeEarned,
        signedAt: new Date().toISOString()
    };

    set({ currentEncounter: signedEncounter });
    await saveEncounter(signedEncounter);
    await loadEncounters();

    addLog({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        type: LogType.SYSTEM_LOG,
        content: `[AUDIT] Encounter ${signedEncounter.id.split('-')[0]} SIGNED & LOCKED. CME Credits Awarded: ${cmeEarned} pts.`
    });
  },

  loadEncounters: async () => {
      try {
          const encounters = await getAllEncounters();
          set({ encountersHistory: encounters.sort((a,b) => b.timestamp.localeCompare(a.timestamp)) });
      } catch (e) {
          console.error("Vault Access Failed", e);
      }
  },

  // Roadmap Actions
  setRoadmapTab: (tab: RoadmapTab) => set({ activeRoadmapTab: tab }),
  toggleRoadmapOverlay: (key: keyof RoadmapOverlayConfig) => set((state) => ({
    roadmapOverlay: {
      ...state.roadmapOverlay,
      [key]: !state.roadmapOverlay[key]
    }
  })),
}));
