import React, { useState } from 'react';
import { 
    FileCode, Folder, Database, Layout, Globe, Cpu, Zap, Wrench,
    Copy, ChevronRight, Search, Terminal, Check, File, Palette,
    ShieldAlert, FileText, ClipboardList
} from 'lucide-react';
import { FileData, SourceFileType } from '../types';

const PROJECT_FILES: FileData[] = [
    {
        name: 'medical_stt_strategic_analysis.md',
        path: 'medical_stt_strategic_analysis.md',
        type: 'types', // Using types icon for docs
        content: `# 🚀 Medical Speech-to-Text Platform: Strategic Analysis & Implementation Guide

## 1. Problem Statement
Physicians currently spend **40-50% of their time** on administrative documentation after patient encounters. The current market solution is simple transcription (Audio → Text → SOAP), but this **does not add real value**—it merely shifts the typing burden.

## 2. Three Architectural Approaches

### Approach A: "Speaknosis Clone" (Simple)
**Flow:** Audio → STT → SOAP → EMR
- ✅ **Pros:** Fast to market (8-12 weeks), low complexity.
- ❌ **Cons:** No differentiation, commodity layer, high vendor lock-in, no scalability.

### Approach B: "Full Enterprise Pipeline" (Complex)
**Flow:** Audio → STT Queue → Segment Classification → RAG + MCP Processing → Multi-Artifacts
- ✅ **Pros:** Highly scalable, extensible, no vendor lock-in, high moat.
- ❌ **Cons:** Slow to market (16-20 weeks), higher capital requirements.

### Approach C: "Hybrid Evolution" ⭐ (Recommended)
**Strategy:**
1.  **Phase 1 (Weeks 1-8):** Simple MVP (Approach A logic) to get users.
2.  **Phase 2 (Weeks 9-16):** Async processing + Basic Artifacts (Anki/Billing).
3.  **Phase 3 (Weeks 17+):** Full MCP Ecosystem (Approach B).

---

## 3. Recommended MVP (Weeks 1-10)

### Scope
**"Doctor talks → Audio recorded → SOAP auto-generated → Reviewed & sent to EMR"**

### Tech Stack
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Frontend | React/Next.js + TypeScript | Standard, robust ecosystem. |
| Backend | Node.js Express + PostgreSQL | Relational data integrity for medical records. |
| STT | Deepgram Nova 2 Medical | 42.8% lower WER than standard models. |
| LLM | Claude 3.5 Sonnet / Gemini 1.5 Pro | HIPAA-ready, high reasoning capability. |
| Infra | AWS (S3, Lambda, RDS, KMS) | Industry standard for compliance. |
| Security | AES-256 + TLS 1.3 | Non-negotiable encryption standards. |

---

## 4. Information Workflow & Data Classification

This is the **key differentiator** against black-box competitors like Speaknosis. We explicitly classify and track data lifecycle.

### Data Classification Levels
- 🔴 **RESTRICTED (PHI)**: Highest protection. Raw audio, transcripts, patient names.
- 🟠 **CONFIDENTIAL**: Business sensitive. Billing codes, doctor IDs.
- 🟡 **INTERNAL**: System metadata, processing logs.
- 🟢 **PUBLIC**: De-identified research data (with consent).

### The 11-Step Data Lifecycle

#### Step 1: CAPTURE
- **Input:** Audio stream (microphone).
- **Class:** 🔴 RESTRICTED.
- **Security:** In-memory buffer.

#### Step 2: TRANSMISSION
- **Method:** WebSocket over TLS 1.3.
- **Security:** Encrypted in transit.

#### Step 3: STORAGE (Raw)
- **Location:** AWS S3.
- **Encryption:** AWS KMS AES-256 at rest.
- **Retention:** 30 days, then hard delete.

#### Step 4: STT PROCESSING
- **Provider:** Deepgram API (via secure tunnel).
- **Data Sent:** Raw Audio only (No PII/Patient ID attached to the audio stream sent to provider if possible).

#### Step 5: TRANSCRIPT STORAGE
- **Location:** PostgreSQL 'consultations.raw_transcript'.
- **Encryption:** Column-level encryption.
- **Retention:** 90 days.

#### Step 6: ENTITY EXTRACTION & SOAP
- **Processor:** LLM (Claude/Gemini).
- **Prompt:** De-identified transcript context.
- **Output:** Structured JSON (Subjective, Objective, Assessment, Plan).

#### Step 7: DOCTOR REVIEW GATE ⭐
- **Action:** Doctor reviews raw text vs generated SOAP.
- **Edit:** Manual overrides.
- **Status:** 'PENDING' → 'REVIEWED'.

#### Step 8: BILLING CODES (v1.1)
- **Extraction:** ICD-10 & CPT codes derived from Assessment/Plan.
- **Class:** 🟠 CONFIDENTIAL.
- **Retention:** 7 years (IRS/Audit requirement).

#### Step 9: EMR INTEGRATION
- **Action:** Push to Epic/Cerner via HL7/FHIR.
- **Audit:** Log success/failure timestamp.

#### Step 10: ARTIFACT GENERATION (Async)
- **Anki Cards:** Spaced repetition for doctor learning.
- **Patient Summary:** 5th-grade reading level summary.
- **CME Credits:** Log educational value of case.

#### Step 11: AUDIT TRAIL
- **Log:** WHO accessed WHAT, WHEN, and WHY.
- **Storage:** Immutable ledger.

---

## 5. Value-Add Artifacts (Differentiation)

Don't just save time. Help the doctor **learn** and **earn**.

1.  **Anki Cards (Education):**
    *   *Context:* Patient with resistant hypertension.
    *   *Card:* "Why is Spironolactone added as a 4th line agent?"
    *   *Benefit:* Doctor studies during downtime.

2.  **Billing Automation (Revenue):**
    *   *Context:* Complex case.
    *   *Suggestion:* "Add modifier -25 for significant, separately identifiable evaluation."
    *   *Benefit:* Increases clinic revenue by 5-10%.

3.  **Patient Summaries (Engagement):**
    *   *Context:* Complex diagnosis.
    *   *Output:* Plain English email to patient explaining the plan.
    *   *Benefit:* Higher patient adherence.

---

## 6. Competitive Analysis vs Speaknosis

| Feature | Speaknosis | Ranvier DATA |
|---------|------------|--------------|
| **MVP Timeline** | 12 weeks | **8 weeks** |
| **Specialty** | Pediatric ENT Focus | **Multimodal / General** |
| **Lock-in** | High (Proprietary) | **Low (Modular STT/LLM)** |
| **Artifacts** | None | **Anki, Billing, Summaries** |
| **Data Privacy** | Black Box | **Transparent / Auditable** |
| **Telehealth** | Not mentioned | **Native Support** |

## 7. Timeline & Milestones

- **Phase 1 (Weeks 1-10):** MVP Launch. Audio → SOAP. 5 Beta Doctors.
- **Phase 2 (Weeks 11-16):** Artifacts. Anki/Billing generation. 20 Clinics.
- **Phase 3 (Weeks 17-32):** Ecosystem. EMR Integration (MCP). 100+ Clinics.

## 8. Financial Requirements (Pre-Seed)
- **Capital:** $120k - $150k.
- **Runway:** 9-12 months.
- **Team:** 1 DevOps, 2 Full Stack, 1 QA.`
    },
    {
        name: 'medical-stt-strategy.md',
        path: 'medical-stt-strategy.md',
        type: 'types',
        content: `# 🎯 Medical STT Executive Strategy

## Executive Summary
Ranvier DATA is a multimodal medical documentation platform designed to replace clerical work with automated clinical intelligence. Unlike competitors who strictly focus on transcription, Ranvier DATA focuses on **Artifact Generation**—creating value-added data products (Anki cards, billing codes, patient education) from the clinical encounter.

## The Opportunity
- **Pain Point:** Doctors hate writing notes (40% of their day).
- **Current Sol:** "Smart Dictation" (Nuance, Speaknosis) is just faster typing.
- **Our Sol:** "Clinical Intelligence" (Ranvier). We don't just write the note; we structure the data, verify the billing, and educate the patient.

## Competitive Matrix

| Feature | Speaknosis | Ranvier DATA |
|---------|------------|--------------|
| **STT Accuracy** | Standard | **High (Deepgram Nova 2)** |
| **Coding** | Manual | **Hybrid Auto-Resolution** |
| **Artifacts** | None | **Anki, Billing, Summaries** |
| **Privacy** | Cloud-heavy | **Local Vault + Edge Shield** |
| **Latency** | 5s - 15s | **< 2s (Native Audio)** |
| **Protocol** | Closed | **MCP (Model Context Protocol)** |

## Key Differentiators

### 1. The Artifact Engine
We treat the clinical conversation as a data source to generate multiple outputs:
- **For the Doctor:** Automated flashcards (Anki) based on rare cases seen that day.
- **For the Clinic:** Automated ICD-10/CPT coding with revenue optimization suggestions.
- **For the Patient:** Instant, jargon-free summaries of the visit.

### 2. Native Audio Processing
Using Gemini 2.5 Flash Native Audio (and Deepgram Nova 2 fallback), we achieve near-real-time latency. This tight feedback loop reduces "Review Anxiety"—the doctor trusts the system because they see it working.

### 3. Medical Logic Grounding (Hybrid Coder)
We do not rely solely on LLMs for medical coding. We use a **Hybrid Retrieval** system:
- **LLM:** Extracts clinical entities ("Hypertension").
- **Local DB:** Fuzzy matches against a verified ICD-10 database ('I10').
- **Result:** Zero hallucinations in billing codes.

## Success Metrics (Year 1)
- **WER (Word Error Rate):** < 1.0% for medical terminology.
- **Doc-Time Savings:** Reduce documentation time from 15 mins to < 2 mins per patient.
- **Billing Accuracy:** > 95% match rate for suggested codes.
- **Adoption:** 100+ Clinics active.
- **MRR:** $50k+.`
    },
    {
        name: 'App.tsx',
        path: 'App.tsx',
        type: 'component',
        content: `// Primary View Orchestrator...`
    },
    {
        name: 'store.ts',
        path: 'store.ts',
        type: 'store',
        content: `// Zustand State Engine...`
    },
    {
        name: 'api.ts',
        path: 'services/api.ts',
        type: 'service',
        content: `// Neural API Handlers...`
    },
    {
        name: 'medicalSearch.ts',
        path: 'services/medicalSearch.ts',
        type: 'service',
        content: `// Local BM25/Fuzzy Resolver...`
    }
];

const SourceMapView: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<FileData>(PROJECT_FILES[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [copied, setCopied] = useState(false);

    const filteredFiles = PROJECT_FILES.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.path.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(selectedFile.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getIcon = (type: SourceFileType) => {
        switch(type) {
            case 'component': return <Layout size={14} className="text-blue-400" />;
            case 'store': return <Database size={14} className="text-yellow-400" />;
            case 'service': return <Globe size={14} className="text-green-400" />;
            case 'types': return <FileText size={14} className="text-pink-400" />;
            case 'util': return <Wrench size={14} className="text-purple-400" />;
            case 'python': return <FileCode size={14} className="text-blue-500" />;
            default: return <File size={14} className="text-terminal-dim" />;
        }
    };

    const renderCode = (content: string) => {
        return content.split('\n').map((line, i) => {
            const highlighted = line
                .replace(/(const|let|var|function|return|import|export|from|if|switch|case|default|async|await|def|class|asyncio|interface|type|enum|##|#)/g, '<span class="text-pink-400">$1</span>')
                .replace(/(['"])(.*?)(['"])/g, '<span class="text-memphis-yellow">$1$2$3</span>')
                .replace(/(\(|\)|\[|\]|\{|\})/g, '<span class="text-blue-400">$1</span>');
            
            return (
                <div key={i} dangerouslySetInnerHTML={{ __html: highlighted || ' ' }} />
            );
        });
    };

    return (
        <div className="w-full h-[650px] flex flex-col bg-terminal-black border-4 border-black shadow-memphis overflow-hidden animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="h-10 border-b-2 border-black bg-terminal-dark flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 mr-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-[10px] font-mono font-black text-terminal-dim uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={12} /> NEURAL_OBJECT_EXPLORER v2.1
                    </span>
                </div>
                <div className="text-[10px] font-mono text-terminal-dim hidden md:block">
                    PATH: <span className="text-terminal-accent">{selectedFile.path}</span>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r-2 border-black flex flex-col bg-terminal-dark/50 shrink-0">
                    <div className="p-3 border-b border-terminal-border/30">
                        <div className="relative">
                            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-terminal-dim" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Shards..."
                                className="w-full bg-black/40 border border-terminal-border/30 rounded px-7 py-1.5 text-[10px] font-mono text-white focus:outline-none focus:border-terminal-accent/50"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                        <FileGroup label="Strategy & Specs" icon={<ClipboardList size={10} />} files={filteredFiles.filter(f => f.name.endsWith('.md'))} selectedPath={selectedFile.path} onSelect={setSelectedFile} getIcon={getIcon} />
                        <FileGroup label="Primary Logic" icon={<Cpu size={10} />} files={filteredFiles.filter(f => !f.name.endsWith('.md'))} selectedPath={selectedFile.path} onSelect={setSelectedFile} getIcon={getIcon} />
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
                    <div className="flex bg-[#161b22] border-b border-terminal-border/30 px-4 items-center justify-between shrink-0">
                        <div className="px-4 py-2.5 border-t-2 border-terminal-accent bg-[#0d1117] flex items-center gap-2">
                            {getIcon(selectedFile.type)}
                            <span className="text-xs font-mono text-white font-bold">{selectedFile.name}</span>
                        </div>
                        <button onClick={handleCopy} className="p-1.5 hover:bg-white/10 rounded text-terminal-dim hover:text-white transition-all flex items-center gap-2 text-[10px] font-mono">
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            {copied ? 'CACHED' : 'COPY'}
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                        <div className="flex font-mono text-sm leading-relaxed">
                            <div className="pr-4 border-r border-terminal-border/20 text-terminal-dim/30 text-right select-none min-w-[2.5rem] shrink-0">
                                {selectedFile.content.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                            </div>
                            <pre className="pl-4 text-gray-300 whitespace-pre">
                                {renderCode(selectedFile.content)}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FileGroup: React.FC<{ label: string, icon: React.ReactNode, files: FileData[], selectedPath: string, onSelect: (f: FileData) => void, getIcon: (t: SourceFileType) => React.ReactNode }> = ({ label, icon, files, selectedPath, onSelect, getIcon }) => {
    if (files.length === 0) return null;
    return (
        <div className="mb-4">
            <div className="px-4 py-2 text-[9px] font-bold text-terminal-dim uppercase tracking-widest flex items-center gap-2 border-b border-white/5 mb-1">
                {icon} {label}
            </div>
            {files.map(file => (
                <button
                    key={file.path}
                    onClick={() => onSelect(file)}
                    className={`w-full text-left px-6 py-2 flex items-center gap-3 group transition-colors relative ${selectedPath === file.path ? 'bg-terminal-accent/10' : 'hover:bg-white/5'}`}
                >
                    {selectedPath === file.path && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-terminal-accent" />}
                    <span className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">{getIcon(file.type)}</span>
                    <span className={`font-mono text-xs truncate ${selectedPath === file.path ? 'text-terminal-accent font-bold' : 'text-gray-400'}`}>{file.name}</span>
                </button>
            ))}
        </div>
    );
};

export default SourceMapView;