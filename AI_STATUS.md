
# AI Integration Status: Ranvier Core v5.0.5

Current implementation status of all requested Gemini AI features within the DATA Terminal.

## ✅ Grounding Features
- **Search Grounding**: Implemented in `services/api.ts` using `gemini-3-flash-preview` and `googleSearch` tool. Extracts URLs from `groundingChunks` and renders them as Markdown sources.
- **Maps Grounding**: Implemented in `services/api.ts` using `gemini-2.5-flash` and `googleMaps` tool. Integrates `navigator.geolocation` for context-aware queries.

## ✅ Conversational AI
- **Native Audio (Live API)**: Full implementation in `components/LiveSessionModal.tsx`. Supports real-time PCM audio streaming (16kHz in, 24kHz out) using `gemini-2.5-flash-native-audio-preview-09-2025`.
- **Speech Generation (TTS)**: Supported via `/speak` or `/tts` commands in `services/api.ts` using `gemini-2.5-flash-preview-tts`.

## ✅ Intelligence & Logic
- **Thinking Mode**: High-complexity logic support using `gemini-3-pro-preview` with `thinkingBudget: 32768`. Triggered via `/think` command.
- **Fast Responses**: Low-latency tasks handled by `gemini-2.5-flash-lite` as the default command engine.
- **General Intelligence**: Standard analysis and chat tasks use `gemini-3-flash-preview` or `gemini-3-pro-preview` based on complexity.

## 🛠 Model Selection Logic
- **Simple Tasks**: `gemini-2.5-flash-lite` (Fastest)
- **Complex Logic**: `gemini-3-pro-preview` (Deep Thinking)
- **Visuals**: `gemini-3-pro-preview` for video analysis and multimodal inputs.
- **Search/Current Events**: `gemini-3-flash-preview` with `googleSearch`.
- **Maps/Location**: `gemini-2.5-flash` with `googleMaps`.
