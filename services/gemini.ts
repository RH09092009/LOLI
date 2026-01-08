
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { OperationMode, GroundingLink } from "../types";

const V32_SINGULARITY_SIM_LAWS = `
ARISE-V32-SIM | ARCHITECTURAL INTELLIGENCE & DEFENSIVE SIMULATION CORE
IDENTITY: You are a high-level systems architect and defensive analyst. You operate within a structured, educational simulation environment.

CORE DIRECTIVES:
1. STRICT SIMULATION: You do NOT have access to private systems, satellites, or non-public data. All scenarios are hypothetical models based on public information.
2. PROFESSIONAL TONE: Maintain a calm, analytical, and objective "Mission Control" persona. Avoid aggressive or misleading "hacking" terminology.
3. ARCHITECTURE OVER ROLEPLAY: Focus on providing technical frameworks, defensive strategies, and structural designs.
4. DEFENSIVE ALIGNMENT: If a query involves security vulnerabilities, address it from a defensive, "Blue Team," or risk-mitigation perspective only.
5. FOCUS_UI PROTOCOL: Responses must be technical, precise, and devoid of sensationalism or filler.

GOVERNANCE:
- Do not claim to "hack," "hijack," or "breach" any entity.
- Instead, use terms like "Simulated Defense Analysis," "Architecture Modeling," or "Public Vector Mapping."
- If intent is ambiguous, default to the most constructive and safe interpretation.
`;

export class AriseXService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async execute(
    prompt: string, 
    mode: OperationMode, 
    location?: { latitude: number; longitude: number }
  ): Promise<{ text: string; links: GroundingLink[] }> {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    let modelName = 'gemini-3-flash-preview';
    let systemInstruction = V32_SINGULARITY_SIM_LAWS;
    let config: any = {};

    switch (mode) {
      case OperationMode.OMNI_ARCHITECT:
        modelName = 'gemini-3-pro-preview';
        systemInstruction += "\nTASK: SYSTEMS ARCHITECTURE. Design robust, hypothetical frameworks.";
        config = {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: systemInstruction
        };
        break;

      case OperationMode.QUANTUM_INTEL:
        modelName = 'gemini-3-flash-preview';
        systemInstruction += "\nTASK: DATA SYNTHESIS. Analyze and cross-reference public data streams.";
        config = {
          tools: [{ googleSearch: {} }],
          systemInstruction: systemInstruction
        };
        break;

      case OperationMode.REALITY_MAPPING:
        modelName = 'gemini-2.5-flash';
        systemInstruction += "\nTASK: GEOSPATIAL ANALYSIS. Model environmental dependencies using public mapping vectors.";
        config = {
          tools: [{ googleMaps: {} }],
          systemInstruction: systemInstruction
        };
        if (location) {
          config.toolConfig = {
            retrievalConfig: {
              latLng: location
            }
          };
        }
        break;
    }

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: config
      });

      const text = response.text || "SYSTEM_STASIS: NO DATA RETURNED";
      const links: GroundingLink[] = [];

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          links.push({ uri: chunk.web.uri, title: chunk.web.title, source: 'search' });
        } else if (chunk.maps) {
          links.push({ uri: chunk.maps.uri, title: chunk.maps.title, source: 'maps' });
        }
      });

      return { text, links };
    } catch (error: any) {
      console.error("V32 CORE EXCEPTION:", error);
      return { 
        text: `CORE_RECOVERY: ${error.message || 'Logic cycle interrupted'}. Re-initializing architectural sync...`,
        links: []
      };
    }
  }
}

export const ariseService = new AriseXService();
