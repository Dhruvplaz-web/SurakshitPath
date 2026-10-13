/**
 * SurakshitPath - AI Risk & Urgency Assessment Service
 *
 * Evaluates reported road hazards and emergency cues using multi-factor analysis:
 * 1. Semantic NLP Keyword & Threat Detection (harassment, darkness, physical danger)
 * 2. Infrastructure Category Baseline Weighting
 * 3. Nocturnal Vulnerability Multiplier (8 PM to 5:30 AM elevated risk window)
 * 4. Empirical Photo Verification Metric
 * 5. Explainable Reasoning Engine for Civic & Commuter Transparency
 */

export interface AIRiskAssessment {
  urgency: 'high' | 'medium' | 'low';
  riskScore: number; // 0 to 100
  confidence: number; // 0 to 100
  riskLevelLabel: string;
  factors: string[];
  rationale: string;
  isImminentDanger: boolean;
  detectedKeywords: string[];
}

export interface AIRiskInput {
  title: string;
  description: string;
  category: string;
  customCategory?: string;
  hasPhoto: boolean;
  coordinates?: [number, number];
  timeHour?: number;
}

// Critical high-severity risk signals (imminent commuter danger / violent crime / physical hazards)
const SEVERE_THREAT_KEYWORDS = [
  'follow', 'following', 'stalk', 'stalker', 'stalking',
  'harass', 'harassment', 'eve teasing', 'catcalling', 'touch', 'groped',
  'drunk', 'drinking', 'gang', 'group of men', 'men loitering', 'hostile',
  'weapon', 'knife', 'blade', 'gun', 'threat', 'threatening', 'attack', 'assault',
  'chase', 'chased', 'chasing', 'cornered', 'screaming', 'crying', 'help',
  'kidnap', 'snatch', 'snatching', 'robbery', 'robbed', 'theft',
  'pitch black', 'pitch dark', 'total darkness', 'complete blackout', 'zero light',
  'live wire', 'electric shock', 'open manhole', 'open trench', 'cave in', 'collapsed',
  'scared', 'terrified', 'fear', 'emergency', 'predator', 'unsafe'
];

// Moderate road hazard signals
const MODERATE_HAZARD_KEYWORDS = [
  'unlit', 'broken lamp', 'dark stretch', 'dim', 'flickering', 'shadowy',
  'isolated', 'deserted', 'empty', 'lonely', 'no footfall', 'no people',
  'blindspot', 'no cctv', 'blind spot', 'blocked path', 'dead end',
  'pothole', 'deep pothole', 'crater', 'waterlogging', 'flooding',
  'construction debris', 'digging', 'road closed', 'speeding', 'reckless driving',
  'accident prone', 'slippery', 'stray dogs', 'pack of dogs'
];

// Low hazard / maintenance signals
const LOW_HAZARD_KEYWORDS = [
  'minor', 'faded line', 'paint', 'cosmetic', 'dust', 'small bump',
  'uneven', 'trash', 'garbage', 'litter', 'noise', 'cleanliness', 'slow traffic'
];

export class AIRiskService {
  /**
   * Fast, client-side NLP and environmental risk evaluation
   */
  public evaluateRisk(input: AIRiskInput): AIRiskAssessment {
    const text = `${input.title} ${input.description} ${input.customCategory || ''}`.toLowerCase();
    const currentHour = input.timeHour ?? new Date().getHours();
    const isNightTime = currentHour >= 20 || currentHour < 6; // 8 PM to 6 AM

    const detectedSevere: string[] = [];
    const detectedModerate: string[] = [];
    const detectedLow: string[] = [];

    SEVERE_THREAT_KEYWORDS.forEach(kw => {
      if (text.includes(kw)) detectedSevere.push(kw);
    });

    MODERATE_HAZARD_KEYWORDS.forEach(kw => {
      if (text.includes(kw)) detectedModerate.push(kw);
    });

    LOW_HAZARD_KEYWORDS.forEach(kw => {
      if (text.includes(kw)) detectedLow.push(kw);
    });

    // 1. Base Score from Hazard Category
    let baseScore = 45;
    const categoryFactorLabel: string[] = [];

    switch (input.category) {
      case 'harassment_crowd':
        baseScore = 78;
        categoryFactorLabel.push('Hostile loitering / harassment hazard baseline');
        break;
      case 'deserted_stretch':
        baseScore = 68;
        categoryFactorLabel.push('Pedestrian isolation & low natural surveillance');
        break;
      case 'broken_lamp':
        baseScore = isNightTime ? 65 : 45;
        categoryFactorLabel.push(isNightTime ? 'Critical night illumination outage' : 'Daytime streetlamp defect');
        break;
      case 'cctv_blindspot':
        baseScore = 52;
        categoryFactorLabel.push('Surveillance blindspot corridor');
        break;
      case 'pothole_hazard':
        baseScore = 48;
        categoryFactorLabel.push('Roadway surface obstacle / transit hazard');
        break;
      case 'other':
      default:
        baseScore = 42;
        categoryFactorLabel.push('Custom civic incident report');
        break;
    }

    // 2. Semantic Keyword Boost
    let nlpScoreBoost = 0;
    if (detectedSevere.length > 0) {
      nlpScoreBoost += Math.min(45, detectedSevere.length * 20);
    }
    if (detectedModerate.length > 0) {
      nlpScoreBoost += Math.min(22, detectedModerate.length * 8);
    }
    if (detectedLow.length > 0 && detectedSevere.length === 0) {
      nlpScoreBoost -= Math.min(15, detectedLow.length * 6);
    }

    // 3. Nocturnal Vulnerability Multiplier
    let timeBoost = 0;
    if (isNightTime) {
      timeBoost = 14;
      categoryFactorLabel.push(`Night hour vulnerability window (${currentHour}:00 hrs)`);
    }

    // 4. Photo Proof Verification Multiplier
    let photoConfidenceBoost = 0;
    if (input.hasPhoto) {
      photoConfidenceBoost = 12;
      categoryFactorLabel.push('Verified geo-referenced photographic evidence attached');
    }

    // Calculate final composite risk score (clamped between 15 and 99)
    const rawScore = baseScore + nlpScoreBoost + timeBoost;
    const riskScore = Math.max(15, Math.min(99, Math.round(rawScore)));

    // Confidence score based on text volume, keyword matches, and photo presence
    const textVolume = (input.title + input.description).trim().length;
    let confidence = 65;
    if (textVolume > 30) confidence += 10;
    if (detectedSevere.length > 0 || detectedModerate.length > 0) confidence += 12;
    confidence += photoConfidenceBoost;
    confidence = Math.min(98, confidence);

    // Determine Urgency Thresholds
    let urgency: 'high' | 'medium' | 'low';
    let riskLevelLabel = '';
    let rationale = '';
    const isImminentDanger = detectedSevere.length > 0 || riskScore >= 75;

    if (riskScore >= 70 || detectedSevere.length > 0) {
      urgency = 'high';
      riskLevelLabel = 'Critical / Immediate Risk';
      if (detectedSevere.length > 0) {
        rationale = `Urgent commuter safety risk: detected critical signals (${detectedSevere.slice(0, 3).join(', ')})${isNightTime ? ' during nocturnal travel' : ''}. Prioritized for rapid civic & volunteer alert.`;
      } else {
        rationale = `High-risk infrastructure vulnerability: severe darkness or isolation compounded by current night travel conditions.`;
      }
    } else if (riskScore >= 42) {
      urgency = 'medium';
      riskLevelLabel = 'Elevated Caution Needed';
      if (detectedModerate.length > 0) {
        rationale = `Notable roadway impairment: ${detectedModerate.slice(0, 2).join(', ')} detected. Impedes safe night transit.`;
      } else {
        rationale = `Moderate roadway risk requiring heightened commuter alertness and municipal inspection.`;
      }
    } else {
      urgency = 'low';
      riskLevelLabel = 'Low / Routine Maintenance';
      rationale = `Civic maintenance observation with low immediate safety impact on pedestrian corridor.`;
    }

    return {
      urgency,
      riskScore,
      confidence,
      riskLevelLabel,
      factors: categoryFactorLabel,
      rationale,
      isImminentDanger,
      detectedKeywords: [...detectedSevere, ...detectedModerate]
    };
  }

  /**
   * Optional backend API analysis hook (with fallback to client-side evaluation)
   */
  public async evaluateRiskWithBackend(input: AIRiskInput): Promise<AIRiskAssessment> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200); // 1.2s rapid failover

      const res = await fetch('http://localhost:8000/api/safety/analyze-hazard-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: input.title,
          description: input.description,
          category: input.category,
          custom_category: input.customCategory || null,
          has_photo: input.hasPhoto,
          coordinates: input.coordinates || [18.5204, 73.8567],
          time_hour: input.timeHour ?? new Date().getHours()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          urgency: data.urgency,
          riskScore: data.risk_score,
          confidence: data.confidence,
          riskLevelLabel: data.risk_level_label,
          factors: data.factors,
          rationale: data.rationale,
          isImminentDanger: data.is_imminent_danger,
          detectedKeywords: data.detected_keywords || []
        };
      }
    } catch {
      // Fallback silently to client-side evaluation
    }

    return this.evaluateRisk(input);
  }
}

export const aiRiskService = new AIRiskService();
