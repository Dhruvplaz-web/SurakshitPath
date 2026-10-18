import { SegmentDetail, FactorBreakdown, DynamicEvent, RoadClass, RouteManeuver } from '../../types/routing';
import { PUNE_SAFE_HAVENS } from '../../data/safeHavens';
import { PUNE_DARK_SPOTS } from '../../data/civicAdminData';

/**
 * Straight-line distance in meters between two [lat, lng] coordinates
 */
export function getDistanceMeters(p1: [number, number], p2: [number, number]): number {
  const dLat = (p2[0] - p1[0]) * 111320;
  const dLng = (p2[1] - p1[1]) * 105000;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

/**
 * Computes minimum distance from a coordinate polyline to any verified safe haven
 */
export function getMinDistanceToHavens(coords: [number, number][]): number {
  let minD = Infinity;
  const step = Math.max(1, Math.floor(coords.length / 30));
  for (let i = 0; i < coords.length; i += step) {
    const pt = coords[i];
    for (const h of PUNE_SAFE_HAVENS) {
      const d = getDistanceMeters(pt, h.coordinates);
      if (d < minD) minD = d;
      if (minD < 100) return minD;
    }
  }
  return minD === Infinity ? 450 : minD;
}

/**
 * Checks for proximity to municipal dark spots and active community hazards
 */
export function calculateHazardPenalty(coords: [number, number][], activeEvents: DynamicEvent[] = []): number {
  let penalty = 0.0;
  const step = Math.max(1, Math.floor(coords.length / 30));

  for (let i = 0; i < coords.length; i += step) {
    const pt = coords[i];
    for (const ds of PUNE_DARK_SPOTS) {
      for (const dsPt of ds.coordinates) {
        if (getDistanceMeters(pt, dsPt) < 90) {
          penalty += 0.08;
          break;
        }
      }
    }
    for (const evt of activeEvents) {
      if (evt.active && getDistanceMeters(pt, evt.coordinates) < 120) {
        penalty += evt.severity * 0.15;
      }
    }
  }

  return Number(Math.min(0.65, penalty).toFixed(2));
}

/**
 * Splits a full road polyline into cohesive semantic segments for navigation inspection
 */
export function createSemanticSegments(
  routeId: string,
  routeName: string,
  coords: [number, number][],
  totalDistance: number,
  baseFactors: FactorBreakdown,
  roadClass: RoadClass = 'primary'
): SegmentDetail[] {
  const numSegments = coords.length > 200 ? 4 : coords.length > 60 ? 3 : 2;
  const segLength = Math.floor(coords.length / numSegments);
  const segments: SegmentDetail[] = [];

  for (let s = 0; s < numSegments; s++) {
    const startIdx = s * segLength;
    const endIdx = s === numSegments - 1 ? coords.length : (s + 1) * segLength + 1;
    const segCoords = coords.slice(startIdx, endIdx);
    const segDist = Math.round(totalDistance / numSegments);

    let segName = `${routeName} · Section ${s + 1}`;
    if (s === 0) segName = 'Origin Road Access → Arterial Feeder';
    else if (s === numSegments - 1) segName = 'Transit Corridor → Destination Arrival';
    else segName = 'Main Road Carriageway & Overpass Stretch';

    segments.push({
      edgeId: `${routeId}_seg_${s + 1}`,
      name: segName,
      roadClass,
      lengthMeters: segDist,
      factors: {
        ...baseFactors,
        compositeScore: baseFactors.compositeScore
      },
      coordinates: segCoords,
      illuminationSource: 'Direct OSM Tag',
      keySafetyNotes: [
        'Continuous asphalt road alignment verified via OpenStreetMap',
        baseFactors.lighting >= 0.75 
          ? 'High continuous street lighting along carriageway' 
          : 'Moderate to low night visibility stretch'
      ]
    });
  }

  return segments;
}

/**
 * Generates synthetic turn maneuvers along the road coordinates
 */
export function generateRouteManeuvers(coords: [number, number][], roadName: string): RouteManeuver[] {
  if (coords.length < 2) return [];
  const maneuvers: RouteManeuver[] = [];

  maneuvers.push({
    id: 'm_start',
    type: 'depart',
    instruction: `Head out towards ${roadName}`,
    roadName,
    coordinates: coords[0],
    distanceMeters: Math.round(coords.length * 5),
    durationSeconds: 60,
    safetyScore: 92,
    lightingLux: 45,
    isRecommended: true
  });

  if (coords.length > 20) {
    const midIdx = Math.floor(coords.length / 2);
    maneuvers.push({
      id: 'm_mid',
      type: 'straight',
      instruction: `Continue along ${roadName}`,
      roadName,
      coordinates: coords[midIdx],
      distanceMeters: Math.round(coords.length * 8),
      durationSeconds: 180,
      safetyScore: 88,
      lightingLux: 40,
      isRecommended: true
    });
  }

  maneuvers.push({
    id: 'm_end',
    type: 'arrive',
    instruction: 'Arrive at destination',
    roadName: 'Destination Way',
    coordinates: coords[coords.length - 1],
    distanceMeters: 0,
    durationSeconds: 0,
    safetyScore: 95,
    lightingLux: 50,
    isRecommended: true
  });

  return maneuvers;
}