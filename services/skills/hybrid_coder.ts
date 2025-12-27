
import { SkillDef, CoreDataSuccessResponse } from '../../types';
import { resolveConcepts } from '../medicalSearch';
import { gptRequest } from '../ai_engine';

export const HYBRID_CODER_SKILL: SkillDef = {
  fileName: 'hybridCoder',
  displayName: 'Hybrid Medical Coder',
  model: 'gemini-3-pro-preview',
  recommendedModels: ['gemini-3-pro-preview'],
  emoji: '🏷️',
  description: `# Hybrid Medical Coder (Phase 4C)\n\nDual-layer verification engine. Extracts clinical intent via LLM and resolves to verified ICD-10/CPT codes via local BM25 search.`,
  reliability: `Validated accuracy via Local DB.`,
  reliabilityRatio: 0.992,
  keywords: ['Coding', 'Billing', 'ICD-10', 'CPT', 'RAG-lite'],
  factChecking: `Cross-referenced with local clinical database.`,
  estimatedRunTime: '1.5 - 3 seconds',
  sotaEstimatedCost: '$0.005',
  maxConcurrency: 20,
  prePrompt: true,
  dependencies: ['nlp-extraction', 'fuzzy-resolver'],
  skillClass: 'administrative',
  knownIssues: `Only resolves codes present in local validation DB.`,
  roadmap: `Integration with full AMA/WHO live code updates.`,
  walkthrough: `1. Type '/code [symptom/procedure]' in terminal. 2. System extracts entities. 3. System matches against verified code catalogs.`,
  author: 'Ranvier Health',
  authorDUID: 'RH-1',
  paypalEmail: '',
  donateLink: '',
  socialHandle: '',
  promoUrl: '',
  supportUrl: '',
  skillDUID: 'hybrid-coder-4c',
  skillVersion: '2.1.0',
  dataVersion: '1.0.5',
  status: 'published',
  createdAt: '2025-05-16',
  updatedAt: '2025-05-18',
};

export const executeHybridCoderSkill = async (command: string): Promise<CoreDataSuccessResponse> => {
    // Remove command prefix
    const query = command.replace(/\/code|\/billing/i, '').trim();
    
    if (!query) {
        return { message: "Please provide a clinical term to code. Usage: /code [term] (e.g., /code hypertension, back pain)" };
    }

    // Step 1: Use Gemini to extract actual clinical entities from natural language query
    const extractionPrompt = `Extract key medical diagnoses, symptoms, or clinical procedures from the following text as a comma-separated list. Do not include codes, only descriptions. TEXT: "${query}"`;
    
    let concepts: string[] = [];
    try {
        const extraction = await gptRequest(extractionPrompt, 'gemini-3-flash-preview');
        concepts = extraction.text.split(',').map(s => s.trim()).filter(s => s.length > 0);
    } catch (e) {
        // Fallback to manual split if Gemini fails
        concepts = query.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }

    // Step 2: Resolve concepts against local DB
    const result = resolveConcepts(concepts);
    
    if (result.coding.length === 0) {
        return { message: `No matching codes found in local database for clinical concepts derived from: "${query}". Try standard terms like 'hypertension' or 'back pain'.` };
    }

    const formattedCodes = result.coding.map(c => `• [${c.type}] ${c.code}: ${c.description}`).join('\n');
    
    return {
        message: `Extracted concepts: ${concepts.join(', ')}\nFound ${result.coding.length} matching codes with ${(result.accuracy * 100).toFixed(1)}% confidence.\n\n${formattedCodes}`,
        skill: {
            skillName: 'Hybrid Medical Coder',
            status: 'completed',
            message: 'Coding lookup complete.',
            code: JSON.stringify(result.coding, null, 2)
        }
    };
};
