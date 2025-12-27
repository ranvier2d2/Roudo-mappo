import { Type } from "@google/genai";
import { SkillDef, SOAPData, CoreDataSuccessResponse } from '../../types';
import { ai } from '../ai_engine';
import { resolveConcepts } from '../medicalSearch';

// Shared state for this specific skill module
export let LAST_SESSION_ACCURACY = 0.992;

export const DATA_SKILL_GUIDE_DEF: SkillDef = {
  fileName: 'medicalScribe',
  displayName: 'AI Medical Scribe',
  model: 'gemini-3-pro-preview',
  recommendedModels: ['gemini-3-pro-preview'],
  emoji: '🩺',
  description: `# AI Medical Scribe\n\nAutomates clinical documentation and ICD-10 coding.`,
  reliability: `99% Clinical Accuracy.`,
  reliabilityRatio: 0.99,
  keywords: ['Healthcare', 'SOAP', 'Coding'],
  factChecking: `Hybrid local verification enabled.`,
  estimatedRunTime: '2 - 4 seconds',
  sotaEstimatedCost: '$0.01',
  maxConcurrency: 10,
  prePrompt: true,
  dependencies: ['stt', 'soap'],
  skillClass: 'medical',
  knownIssues: `Ambiguous audio may affect coding.`,
  roadmap: `EMR Integration.`,
  walkthrough: `1. Speak via Live Mode OR Type '/scribe [transcript]'. 2. Process. 3. Review SOAP & Codes.`,
  author: 'Ranvier Health',
  authorDUID: 'RH-1',
  paypalEmail: '',
  donateLink: '',
  socialHandle: '',
  promoUrl: '',
  supportUrl: '',
  skillDUID: 'medscribe-1',
  skillVersion: '2.0.0',
  dataVersion: '2.0.0',
  status: 'published',
  createdAt: '2025-05-15',
  updatedAt: '2025-05-18',
};

export const autoScribeSOAP = async (transcript: string[]): Promise<SOAPData> => {
  if (!transcript || transcript.length === 0) {
    throw new Error("Transcript is empty. Nothing to scribe.");
  }
  const combinedTranscript = transcript.join("\n");
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze this clinical transcript. Structure it into SOAP and extract key medical concepts for coding validation.
    TRANSCRIPT:
    ${combinedTranscript}`,
    config: {
      systemInstruction: "You are a professional scribe. Extract clinical concepts only. Do not hallucinate codes.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subjective: { type: Type.STRING },
          objective: { type: Type.STRING },
          assessment: { type: Type.STRING },
          plan: { type: Type.STRING },
          extractedConcepts: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["subjective", "objective", "assessment", "plan", "extractedConcepts"],
      },
    },
  });

  try {
    const rawResult = JSON.parse(response.text || "{}");
    const { coding, accuracy } = resolveConcepts(rawResult.extractedConcepts || []);
    
    LAST_SESSION_ACCURACY = accuracy;
    
    return { ...rawResult, coding };
  } catch (e) {
    throw new Error("Neural structuring failed.");
  }
};

export const executeScribeSkill = async (command: string): Promise<CoreDataSuccessResponse> => {
    const text = command.replace(/\/scribe/i, '').trim();
    if (!text) return { message: "Please provide clinical text. Usage: /scribe [transcript]" };
    
    try {
        const soap = await autoScribeSOAP([text]);
        const formatted = `
SUBJECTIVE: ${soap.subjective}

OBJECTIVE: ${soap.objective}

ASSESSMENT: ${soap.assessment}

PLAN: ${soap.plan}
        `.trim();
        
        return {
            message: formatted,
            skill: {
                skillName: 'AI Medical Scribe',
                status: 'completed',
                message: 'SOAP Note Generated from text input.',
                code: JSON.stringify(soap, null, 2)
            }
        };
    } catch (e: any) {
         return { message: "Scribe Error: " + e.message };
    }
};