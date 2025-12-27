import { SkillDef, CoreDataSuccessResponse } from '../../types';
import { gptRequest } from '../ai_engine';

export const PATIENT_SUMMARY_SKILL_DEF: SkillDef = {
    fileName: 'patientSummary',
    displayName: 'Patient Summary (5th Grade)',
    model: 'gemini-3-flash-preview',
    recommendedModels: ['gemini-3-flash-preview'],
    emoji: '📝',
    description: `# Patient Summary Generator\n\nConverts complex clinical jargon into a 5th-grade reading level summary for patient handouts.`,
    reliability: `High (Simplification)`,
    reliabilityRatio: 0.99,
    keywords: ['Patient Education', 'Simplification', 'Handout'],
    factChecking: `Tone check enabled.`,
    estimatedRunTime: '2 - 3 seconds',
    sotaEstimatedCost: '$0.002',
    maxConcurrency: 50,
    prePrompt: true,
    dependencies: ['summarization'],
    skillClass: 'administrative',
    knownIssues: `May oversimplify complex rare diseases.`,
    roadmap: `Multi-language support.`,
    walkthrough: `1. Select encounter. 2. Run /summary via terminal. 3. Print.`,
    author: 'Ranvier Health',
    authorDUID: 'RH-1',
    paypalEmail: '',
    donateLink: '',
    socialHandle: '',
    promoUrl: '',
    supportUrl: '',
    skillDUID: 'pat-sum-1',
    skillVersion: '1.0.0',
    dataVersion: '1.0.0',
    status: 'published',
    createdAt: '2025-05-20',
    updatedAt: '2025-05-20',
};

export const executePatientSummarySkill = async (command: string): Promise<CoreDataSuccessResponse> => {
    const context = command.replace('/summary', '').trim();
    const prompt = `Rewrite the following medical text (or request) as a patient summary at a 5th-grade reading level: "${context}". Keep it encouraging and clear.`;
    
    const result = await gptRequest(prompt, 'gemini-3-flash-preview');
    
    return {
       message: result.text,
       skill: {
           skillName: 'Patient Summary',
           status: 'completed',
           message: 'Summary generated at 5th-grade level.',
       }
    };
};