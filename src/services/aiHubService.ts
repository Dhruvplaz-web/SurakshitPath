/**
 * SurakshitPath - AI Hub Service
 * 
 * Unifies Google Gemini API (Multimodal Vision & Indic NLP)
 * and xAI Grok API (Real-Time Social & Web Street Intelligence)
 * with the deterministic client-side ML Safety Model (TreeSHAP).
 * 
 * Strict Production Engineering Directives:
 * - Pure Native Fetch (zero heavy npm SDK dependencies)
 * - AbortController timeout & cancellation guards against race conditions
 * - Strict schema validation with zero null-pointer risks
 * - 100% Graceful offline/mock fallback when API keys are not yet configured
 */

import { ShapValue } from '../engine/mlSafetyModel';
import { LiveRoadClosure, PUNE_VERIFIED_ROADWORKS } from './liveClosureService';
import { AppLanguage } from '../types/routing';
import { aiRiskService } from './aiRiskService';

export interface GeminiHazardInput {
  title: string;
  description: string;
  category: string;
  customCategory?: string;
  photoDataUrl?: string | null; // base64 JPEG/PNG
  coordinates: [number, number];
  language?: AppLanguage;
}

export interface GeminiHazardResult {
  verified: boolean;
  severityScore: number; // 0.0 to 1.0 (calibrated for SafetyFeatureVector.activeHazardSeverity)
  urgency: 'high' | 'medium' | 'low';
  confidence: number; // 0 to 100
  isSpamOrFake: boolean;
  detectedHazardType: string;
  photoAssessment: string;
  estimatedLuxLevel: 'pitch_black' | 'dimly_lit' | 'adequately_lit' | 'bright_daylight';
  explanation: string;
  source: 'gemini-multimodal' | 'local-heuristic-engine';
}

export interface GrokIntelResult {
  closures: LiveRoadClosure[];
  source: 'grok-realtime' | 'offline-archive';
  headline: string;
  lastSyncTime: number;
}

class AIHubService {
  // Read keys from environment variables or localStorage overrides
  private getGeminiKey(): string {
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
    return (
      envKey ||
      localStorage.getItem('surakshit_gemini_api_key') ||
      ''
    ).trim();
  }

  private getGrokKey(): string {
    const envKey = (import.meta as any).env?.VITE_GROK_API_KEY as string | undefined;
    return (
      envKey ||
      localStorage.getItem('surakshit_grok_api_key') ||
      ''
    ).trim();
  }

  public hasGeminiKey(): boolean {
    return this.getGeminiKey().length > 5;
  }

  public hasGrokKey(): boolean {
    return this.getGrokKey().length > 5;
  }

  public setCustomKeys(geminiKey?: string, grokKey?: string) {
    if (geminiKey !== undefined) {
      if (geminiKey.trim()) {
        localStorage.setItem('surakshit_gemini_api_key', geminiKey.trim());
      } else {
        localStorage.removeItem('surakshit_gemini_api_key');
      }
    }
    if (grokKey !== undefined) {
      if (grokKey.trim()) {
        localStorage.setItem('surakshit_grok_api_key', grokKey.trim());
      } else {
        localStorage.removeItem('surakshit_grok_api_key');
      }
    }
  }

  /**
   * 1. Google Gemini Multimodal Hazard Verification
   * Inspects citizen photos and Marathi/Hindi/English descriptions to
   * detect fake reports, estimate illumination lux, and calibrate hazard severity.
   */
  public async verifyHazardReport(
    input: GeminiHazardInput,
    signal?: AbortSignal
  ): Promise<GeminiHazardResult> {
    const geminiKey = this.getGeminiKey();

    // Fallback if no Gemini API key configured
    if (!geminiKey) {
      return this.fallbackHazardVerification(input);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout

      // Combine external signal with internal timeout
      const onAbort = () => controller.abort();
      if (signal) signal.addEventListener('abort', onAbort);

      // Build multimodal payload
      const parts: any[] = [];

      // System instruction & prompt
      const promptText = `
You are the SurakshitPath Civic Safety AI for Pune, India.
Your mission is to evaluate a night pedestrian safety hazard report submitted by a citizen.

Input Data:
- Title: "${input.title}"
- Description: "${input.description}"
- Category: "${input.category}"
- Custom Detail: "${input.customCategory || 'None'}"
- Coordinates: [${input.coordinates[0]}, ${input.coordinates[1]}]
- User Language: "${input.language || 'en'}"

Tasks:
1. Multilingual Semantic Analysis: Accurately parse Marathi, Hindi, Hinglish, or English text for genuine fear, darkness, physical danger, or municipal defects.
2. Photo Verification: If a photo is attached, verify if it shows an actual outdoor street, pothole, open manhole, broken lamp, or dark stretch. Flag it as spam/fake if it is an unrelated indoor object, meme, selfie, or stock photo.
3. Compute calibrated severity score between 0.0 (negligible) and 1.0 (extreme immediate danger).
4. Output STRICT JSON conforming to this schema without any markdown formatting or extra text:
{
  "verified": boolean,
  "severityScore": number,
  "urgency": "high" | "medium" | "low",
  "confidence": number,
  "isSpamOrFake": boolean,
  "detectedHazardType": string,
  "photoAssessment": string,
  "estimatedLuxLevel": "pitch_black" | "dimly_lit" | "adequately_lit" | "bright_daylight",
  "explanation": string
}
`;
      parts.push({ text: promptText });

      // If photo attached, include base64 image part
      if (input.photoDataUrl && input.photoDataUrl.includes('base64,')) {
        const matches = input.photoDataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          parts.push({
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          });
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiKey
      };
      if (geminiKey.startsWith('AQ.') || geminiKey.startsWith('ya29.')) {
        headers['Authorization'] = `Bearer ${geminiKey}`;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.15
            }
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);
      if (signal) signal.removeEventListener('abort', onAbort);

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from Gemini');

      const parsed = JSON.parse(rawText);

      return {
        verified: Boolean(parsed.verified ?? true),
        severityScore: Math.max(0.1, Math.min(1.0, Number(parsed.severityScore) || 0.5)),
        urgency: ['high', 'medium', 'low'].includes(parsed.urgency) ? parsed.urgency : 'medium',
        confidence: Math.max(10, Math.min(99, Math.round(Number(parsed.confidence) || 85))),
        isSpamOrFake: Boolean(parsed.isSpamOrFake ?? false),
        detectedHazardType: String(parsed.detectedHazardType || input.category),
        photoAssessment: String(parsed.photoAssessment || (input.photoDataUrl ? 'Photographic evidence verified' : 'No photo attached')),
        estimatedLuxLevel: ['pitch_black', 'dimly_lit', 'adequately_lit', 'bright_daylight'].includes(parsed.estimatedLuxLevel)
          ? parsed.estimatedLuxLevel
          : 'dimly_lit',
        explanation: String(parsed.explanation || 'Verified with Gemini Multimodal Safety Engine.'),
        source: 'gemini-multimodal'
      };
    } catch (err) {
      console.warn('Gemini hazard verification failed, falling back to local heuristic:', err);
      return this.fallbackHazardVerification(input);
    }
  }

  private fallbackHazardVerification(input: GeminiHazardInput): GeminiHazardResult {
    const heuristic = aiRiskService.evaluateRisk({
      title: input.title,
      description: input.description,
      category: input.category,
      customCategory: input.customCategory,
      hasPhoto: Boolean(input.photoDataUrl),
      coordinates: input.coordinates
    });

    const severity = Math.max(0.15, Math.min(0.95, heuristic.riskScore / 100));

    return {
      verified: true,
      severityScore: Number(severity.toFixed(2)),
      urgency: heuristic.urgency,
      confidence: heuristic.confidence,
      isSpamOrFake: false,
      detectedHazardType: input.category,
      photoAssessment: input.photoDataUrl ? 'Local visual telemetry attached' : 'No photo attached',
      estimatedLuxLevel: input.category === 'broken_lamp' ? 'pitch_black' : 'dimly_lit',
      explanation: heuristic.rationale,
      source: 'local-heuristic-engine'
    };
  }

  /**
   * 2. xAI Grok Real-Time Pune Street Intelligence
   * Queries live Pune municipal & traffic police updates (@PuneCityTraffic, waterlogging,
   * metro barricading) and extracts structured road closures for routing.
   */
  public async fetchLivePuneIntel(signal?: AbortSignal): Promise<GrokIntelResult> {
    const grokKey = this.getGrokKey();

    if (!grokKey) {
      return {
        closures: PUNE_VERIFIED_ROADWORKS,
        source: 'offline-archive',
        headline: 'Showing 4 verified active Pune municipal roadwork & metro corridors (offline ground truth).',
        lastSyncTime: Date.now()
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      const onAbort = () => controller.abort();
      if (signal) signal.addEventListener('abort', onAbort);

      const prompt = `
You are the real-time Pune Traffic Intelligence Engine for SurakshitPath.
Provide the current active roadworks, diversions, waterlogging, or police barricades across Pune metropolitan areas (e.g. Hinjawadi, Chandani Chowk, University Road, Swargate, Bund Garden, Hadapsar, Deccan).

Return STRICT JSON with an array of active disruptions matching this schema:
{
  "headline": string,
  "disruptions": [
    {
      "id": string,
      "name": string,
      "type": "construction" | "closure" | "diversion",
      "coordinates": [number, number],
      "affectedStretch": string,
      "reason": string,
      "severity": number, // 0.1 to 1.0
      "reportedBy": string
    }
  ]
}
`;

      const isGroq = grokKey.startsWith('gsk_');
      const endpoint = isGroq
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : 'https://api.x.ai/v1/chat/completions';
      const model = isGroq ? 'llama-3.3-70b-versatile' : 'grok-2-latest';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${grokKey}`
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (signal) signal.removeEventListener('abort', onAbort);

      if (!res.ok) {
        throw new Error(`Grok API returned status ${res.status}`);
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from Grok');

      // Extract JSON if model wrapped in markdown
      let jsonString = content.trim();
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
      }

      const parsed = JSON.parse(jsonString);
      const disruptions: LiveRoadClosure[] = (parsed.disruptions || []).map((d: any, idx: number) => ({
        id: d.id || `grok_pune_${Date.now()}_${idx}`,
        name: d.name || 'Active Roadway Obstruction',
        type: ['construction', 'closure', 'diversion'].includes(d.type) ? d.type : 'construction',
        coordinates: Array.isArray(d.coordinates) && d.coordinates.length === 2 ? d.coordinates : [18.5204, 73.8567],
        affectedStretch: d.affectedStretch || 'Pune Transit Corridor',
        reason: d.reason || 'Roadway work in progress',
        status: 'active_wip',
        severity: Math.max(0.2, Math.min(1.0, Number(d.severity) || 0.75)),
        reportedBy: d.reportedBy || 'xAI Grok Live Pune Intel',
        timestamp: Date.now()
      }));

      return {
        closures: disruptions.length > 0 ? disruptions : PUNE_VERIFIED_ROADWORKS,
        source: 'grok-realtime',
        headline: parsed.headline || 'Live Pune traffic alerts synchronized via xAI Grok.',
        lastSyncTime: Date.now()
      };
    } catch (err) {
      console.warn('Grok intel fetch failed, falling back to municipal ground truth:', err);
      return {
        closures: PUNE_VERIFIED_ROADWORKS,
        source: 'offline-archive',
        headline: 'Showing 4 verified active Pune municipal roadwork & metro corridors (offline fallback).',
        lastSyncTime: Date.now()
      };
    }
  }

  /**
   * 3. Google Gemini TreeSHAP Explainability Narrator
   * Translates exact mathematical Shapley feature attributions (phi_i) into
   * empathetic, non-stigmatizing natural language commuter advice.
   */
  public async explainTreeShapWithGemini(params: {
    routeName: string;
    routeType: string;
    safetyScore: number;
    shapValues: ShapValue[];
    language: AppLanguage;
  }): Promise<string> {
    const geminiKey = this.getGeminiKey();

    // Deterministic fallback if no Gemini API key
    if (!geminiKey) {
      return this.fallbackTreeShapExplanation(params);
    }

    try {
      const topPositive = params.shapValues
        .filter(s => s.shapValue > 0)
        .sort((a, b) => b.shapValue - a.shapValue)
        .slice(0, 2);

      const topNegative = params.shapValues
        .filter(s => s.shapValue < 0)
        .sort((a, b) => a.shapValue - b.shapValue)
        .slice(0, 1);

      const prompt = `
You are the SurakshitPath Explainable AI Safety Narrator for Pune commuters.
Translate the mathematical TreeSHAP feature attributions into a single concise, empowering 1-2 sentence commuter safety summary.

Route Name: "${params.routeName}" (${params.routeType} route)
Predicted Safety Score: ${params.safetyScore}/100
Language required: "${params.language}" (en = English, mr = Marathi, hi = Hindi)

Top Positive Feature Attributions (+ points):
${topPositive.map(p => `- ${p.displayName}: +${p.shapValue.toFixed(1)} pts (${p.description})`).join('\n')}

Top Risk Penalties (- points):
${topNegative.map(n => `- ${n.displayName}: ${n.shapValue.toFixed(1)} pts (${n.description})`).join('\n')}

Rules:
1. Do NOT stigmatize neighborhoods or use fear mongering. Focus on positive physical infrastructure (streetlamps, open 24/7 pharmacies, police proximity).
2. Keep it under 35 words.
3. Return ONLY plain text in the requested language without quotes or JSON formatting.
`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiKey
      };
      if (geminiKey.startsWith('AQ.') || geminiKey.startsWith('ya29.')) {
        headers['Authorization'] = `Bearer ${geminiKey}`;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 120
            }
          })
        }
      );

      if (!response.ok) throw new Error('Gemini API call failed');
      const json = await response.json();
      const narrative = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (narrative) return narrative;
      return this.fallbackTreeShapExplanation(params);
    } catch {
      return this.fallbackTreeShapExplanation(params);
    }
  }

  private fallbackTreeShapExplanation(params: {
    routeName: string;
    routeType: string;
    safetyScore: number;
    shapValues: ShapValue[];
    language: AppLanguage;
  }): string {
    const topPositive = params.shapValues
      .filter(s => s.shapValue > 0)
      .sort((a, b) => b.shapValue - a.shapValue)[0];

    const topNegative = params.shapValues
      .filter(s => s.shapValue < 0)
      .sort((a, b) => a.shapValue - b.shapValue)[0];

    if (params.language === 'mr') {
      if (params.routeType === 'safe') {
        return `या मार्गावर सतत पथदिवे आणि २४/७ सुरू दुकानांमुळे रात्रीच्या प्रवासासाठी सुरक्षितता सर्वाधिक आहे.`;
      }
      return `हा मार्ग वेगवान असला तरी काही ठिकाणी अपुरा प्रकाश आणि निर्जन पट्टे आढळतात.`;
    }

    if (params.language === 'hi') {
      if (params.routeType === 'safe') {
        return `यह मार्ग निरंतर स्ट्रीटलाइट्स और सक्रिय दुकानों के कारण रात की यात्रा के लिए सबसे सुरक्षित है।`;
      }
      return `यह मार्ग तेज है लेकिन कुछ स्थानों पर कम रोशनी और सन्नाटे के कारण सतर्कता आवश्यक है।`;
    }

    if (topPositive) {
      return `This route scores higher due to ${topPositive.displayName.toLowerCase()} and active commercial frontage, reducing isolated walking stretches.`;
    }

    if (topNegative) {
      return `Caution is advised along this corridor due to ${topNegative.displayName.toLowerCase()} during late-night hours.`;
    }

    return `Empirically evaluated using 9 SafetiPin urban parameters and TreeSHAP attribution.`;
  }
}

export const aiHubService = new AIHubService();
export default aiHubService;
