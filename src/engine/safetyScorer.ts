import { GraphEdge, FactorBreakdown, DynamicEvent, RoadClass } from '../types/routing';

// Road classification baseline illumination priors for Pune
const ROAD_CLASS_BASELINE: Record<RoadClass, number> = {
  trunk: 0.80,      // NH-48 Expressway / Katraj-Dehu Bypass (Continuous high-mast lights)
  primary: 0.70,    // Baner Road, Ganeshkhind Road (Municipal LED)
  secondary: 0.50,  // Pashan-Sus Road, Wakad Link Road
  tertiary: 0.35,   // DP Road, connecting residential collector
  residential: 0.20,// Interior colony streets
  service: 0.10,    // Backservice alleys
  alley: 0.05       // Unpaved / isolated rural cuts
};

/**
 * Calculates the Illumination Factor L_e in [0.0, 1.0]
 * Uses Illumination Proxy Engine to overcome Pune's <15% OSM lit tag sparsity.
 */
export function calculateLightingFactor(
  edge: GraphEdge,
  activeEvents: DynamicEvent[]
): { score: number; source: 'Direct OSM Tag' | 'Hierarchical Baseline & Spillover Proxy' } {
  // Check if an active streetlight outage event affects this edge
  const outageEvent = activeEvents.find(
    e => e.active && e.type === 'streetlight_outage' && e.affectedEdgeIds.includes(edge.id)
  );

  if (outageEvent) {
    // Streetlight grid failure degrades illumination to emergency minimum
    return {
      score: 0.10,
      source: 'Direct OSM Tag'
    };
  }

  if (edge.explicitLit !== undefined) {
    if (edge.explicitLit) {
      // Explicitly tagged as lit in OSM
      const boost = Math.min(0.20, edge.spilloverPoiCount * 0.05);
      return {
        score: Math.min(1.0, 0.85 + boost),
        source: 'Direct OSM Tag'
      };
    } else {
      // Explicitly tagged as unlit in OSM
      return {
        score: 0.10,
        source: 'Direct OSM Tag'
      };
    }
  }

  // Fallback: Illumination Proxy Engine
  // L_e = min(1.0, RoadBaseline + sum(SpilloverPOIs * 0.20))
  const baseline = ROAD_CLASS_BASELINE[edge.roadClass] ?? 0.20;
  const commercialSpillover = Math.min(0.50, edge.spilloverPoiCount * 0.15);
  const score = Math.min(1.0, baseline + commercialSpillover);

  return {
    score,
    source: 'Hierarchical Baseline & Spillover Proxy'
  };
}

/**
 * Calculates Public Presence & Activity Factor A_e in [0.0, 1.0]
 * A_e = ln(1 + ActiveNightPOIs) / ln(1 + SaturationLimit)
 * SaturationLimit = 8
 */
export function calculateActivityFactor(edge: GraphEdge): number {
  const saturationLimit = 8;
  const count = Math.max(0, edge.activeNightPois);
  return Math.min(1.0, Math.log(1 + count) / Math.log(1 + saturationLimit));
}

/**
 * Calculates Transit Accessibility Factor T_e in [0.0, 1.0]
 * T_e = exp(-DistanceToNearestTransitStop / d_transit), d_transit = 300m
 */
export function calculateTransitFactor(edge: GraphEdge): number {
  const dTransit = 300; // meters
  return Math.exp(-edge.transitDistanceMeters / dTransit);
}

/**
 * Calculates Emergency Assistance Access Factor E_e in [0.0, 1.0]
 * E_e = exp(-DistanceToNearestEmergencyFacility / d_emergency), d_emergency = 1000m
 */
export function calculateEmergencyFactor(edge: GraphEdge): number {
  const dEmergency = 1000; // meters
  return Math.exp(-edge.emergencyDistanceMeters / dEmergency);
}

/**
 * Calculates Transient Incident Penalty R_e in [0.0, 1.0]
 * R_e = sum_i Severity_i * exp(-delta_t / tau) / (1 + dist(e, x_i)^2)
 * tau = 14 days = 14 * 86400 seconds
 */
export function calculateIncidentPenalty(edge: GraphEdge, activeEvents: DynamicEvent[]): number {
  let totalPenalty = 0;
  const tauSeconds = 14 * 86400; // 14 days in seconds
  const now = Date.now() / 1000;

  for (const event of activeEvents) {
    if (!event.active || event.type === 'streetlight_outage') continue;
    
    // Check if event targets this edge directly
    if (event.affectedEdgeIds.includes(edge.id)) {
      const deltaT = Math.max(0, now - event.timestamp / 1000);
      const timeDecay = Math.exp(-deltaT / tauSeconds);
      // Direct edge impact: distance = 0 -> 1 / (1 + 0) = 1
      totalPenalty += event.severity * timeDecay;
    }
  }

  return Math.min(1.0, totalPenalty);
}

/**
 * Calculates Composite Segment Safety Index S_e in [0.0, 1.0]
 * S_e = clamp(0.35 L_e + 0.25 A_e + 0.20 T_e + 0.15 E_e - 0.25 R_e, 0.0, 1.0)
 */
export function calculateSegmentSafety(
  edge: GraphEdge,
  activeEvents: DynamicEvent[] = []
): { factors: FactorBreakdown; illuminationSource: 'Direct OSM Tag' | 'Hierarchical Baseline & Spillover Proxy' } {
  const { score: L_e, source: illuminationSource } = calculateLightingFactor(edge, activeEvents);
  const A_e = calculateActivityFactor(edge);
  const T_e = calculateTransitFactor(edge);
  const E_e = calculateEmergencyFactor(edge);
  const R_e = calculateIncidentPenalty(edge, activeEvents);

  const rawScore = (0.35 * L_e) + (0.25 * A_e) + (0.20 * T_e) + (0.15 * E_e) - (0.25 * R_e);
  const clampedNormalized = Math.max(0.0, Math.min(1.0, rawScore));
  const compositeScore = Math.round(clampedNormalized * 100);

  return {
    factors: {
      lighting: Number(L_e.toFixed(2)),
      activity: Number(A_e.toFixed(2)),
      transit: Number(T_e.toFixed(2)),
      emergency: Number(E_e.toFixed(2)),
      incidentPenalty: Number(R_e.toFixed(2)),
      compositeScore
    },
    illuminationSource
  };
}

import { TravelProfile } from '../types/routing';

/**
 * Calculates Parametric Edge Traversal Impedance C(e)
 * C(e) = Length(e) * [ 1 + beta * (1 - S_e / 100)^1.5 ]
 * Tailored across 4 travel profiles (Walking, Two-Wheeler, Four-Wheeler, Transit)
 */
export function calculateEdgeImpedance(
  edge: GraphEdge,
  beta: number,
  activeEvents: DynamicEvent[] = [],
  profile: TravelProfile = 'pedestrian'
): number {
  const { factors } = calculateSegmentSafety(edge, activeEvents);
  const S_norm = factors.compositeScore / 100.0;
  
  // Exponential edge impedance: C(e) = L * [ 1 + beta * (1 - S_e)^1.5 ]
  const safetyPenalty = Math.pow(1 - S_norm, 1.5);
  
  // Profile-specific multipliers
  let profileMultiplier = 1.0;
  if (profile === 'pedestrian') {
    // Pedestrians strictly avoid unlit service alleys and mountain cuts
    if (edge.roadClass === 'alley' || edge.roadClass === 'service') {
      profileMultiplier = 2.4;
    }
  } else if (profile === 'two_wheeler') {
    // Two-wheelers prioritize arterial street lighting over narrow cuts
    if (edge.roadClass === 'alley') {
      profileMultiplier = 1.8;
    }
  } else if (profile === 'transit') {
    // Transit profile prioritizes proximity to BRTS and metro nodes
    if (edge.transitDistanceMeters <= 100) {
      profileMultiplier = 0.75; // Bonus incentive for transit corridor
    }
  }

  return edge.lengthMeters * (1 + beta * safetyPenalty * profileMultiplier);
}
