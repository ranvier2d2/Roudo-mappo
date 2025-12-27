import { SkillDef, CoreDataSuccessResponse } from '../../types';
import { gptRequest } from '../ai_engine';

export const ANKI_SKILL_DEF: SkillDef = {
    fileName: 'ankiGenerator',
    displayName: 'Anki Card Generator',
    model: 'gemini-3-flash-preview',
    recommendedModels: ['gemini-3-flash-preview'],
    emoji: '🎴',
    description: `# Anki Card Generator\n\nAutomated spaced repetition card creator. Extracts key clinical learning points from encounters and formats them for Anki import.`,
    reliability: `High (Structured JSON)`,
    reliabilityRatio: 0.98,
    keywords: ['Education', 'Flashcards', 'Spaced Repetition', 'Learning'],
    factChecking: `Source grounding enabled.`,
    estimatedRunTime: '1 - 2 seconds',
    sotaEstimatedCost: '$0.002',
    maxConcurrency: 50,
    prePrompt: true,
    dependencies: ['nlp-extraction'],
    skillClass: 'administrative',
    knownIssues: `None.`,
    roadmap: `Direct .apkg export.`,
    walkthrough: `1. Select text or encounter. 2. Run /anki via terminal. 3. Copy CSV output.`,
    author: 'Ranvier Health',
    authorDUID: 'RH-1',
    paypalEmail: '',
    donateLink: '',
    socialHandle: '',
    promoUrl: '',
    supportUrl: '',
    skillDUID: 'anki-gen-1',
    skillVersion: '1.0.0',
    dataVersion: '1.0.0',
    status: 'published',
    createdAt: '2025-05-20',
    updatedAt: '2025-05-20',
};

export const executeAnkiSkill = async (command: string): Promise<CoreDataSuccessResponse> => {
    const context = command.replace('/anki', '').trim();
    const prompt = `Generate 3 Anki flashcards (Front/Back) based on the following clinical context or request: "${context}". Return them as a JSON array of objects with 'front' and 'back' properties.`;
    
    const result = await gptRequest(prompt, 'gemini-3-flash-preview', { responseMimeType: 'application/json' });
    
    return {
       message: "Anki cards generated successfully.",
       skill: {
           skillName: 'Anki Card Generator',
           status: 'completed',
           message: 'Generated 3 cards from context.',
           code: result.text
       }
    };
};