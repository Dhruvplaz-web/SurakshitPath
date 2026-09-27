import { SafeHaven } from '../types/routing';

export interface RouteCorridorShelter {
  haven: SafeHaven;
  detourMeters: number;
  detourMinutes: number;
  isDirectCorridor: boolean; // <= 500m
  isExtended: boolean;       // <= 1200m
}

export interface RouteShelterMetrics {
  directCount: number;
  extendedCount: number;
  shelters: RouteCorridorShelter[];
  closestShelter: RouteCorridorShelter | null;
  shelterDesert: {
    hasDesert: boolean;
    desertSpanKm: number;
    message?: string;
  };
}

/**
 * Calculates geodesic distance in meters between two [lat, lng] coordinates
 */
export function getDistanceMeters(c1: [number, number], c2: [number, number]): number {
  const dLat = (c2[0] - c1[0]) * 111000;
  const dLng = (c2[1] - c1[1]) * 105000;
  return Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
}

/**
 * Calculates minimum distance from a point to a line segment [p1, p2]
 */
function distanceToSegment(p: [number, number], p1: [number, number], p2: [number, number]): number {
  const x = p[0], y = p[1];
  const x1 = p1[0], y1 = p1[1];
  const x2 = p2[0], y2 = p2[1];

  const dx = (x2 - x1) * 111000;
  const dy = (y2 - y1) * 105000;

  if (dx === 0 && dy === 0) {
    return getDistanceMeters(p, p1);
  }

  const px = (x - x1) * 111000;
  const py = (y - y1) * 105000;

  const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy)));
  const projLat = x1 + t * (x2 - x1);
  const projLng = y1 + t * (y2 - y1);

  return getDistanceMeters(p, [projLat, projLng]);
}

/**
 * Calculates minimum perpendicular distance from a safe haven to any segment in the route polyline
 */
export function getMinDistanceToRoute(havenCoords: [number, number], routeCoords: [number, number][]): number {
  if (!routeCoords || routeCoords.length === 0) return 999999;
  if (routeCoords.length === 1) return getDistanceMeters(havenCoords, routeCoords[0]);

  let minDistance = Infinity;

  // Stride optimization if route has hundreds of vertices
  const step = routeCoords.length > 80 ? 2 : 1;

  for (let i = 0; i < routeCoords.length - 1; i += step) {
    const nextIdx = Math.min(i + step, routeCoords.length - 1);
    const dist = distanceToSegment(havenCoords, routeCoords[i], routeCoords[nextIdx]);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }

  return Math.round(minDistance);
}

/**
 * Extracts and categorizes all safe havens along a route corridor
 */
export function analyzeRouteShelters(
  routeCoords: [number, number][],
  allHavens: SafeHaven[],
  directThresholdMeters = 550,
  extendedThresholdMeters = 1300
): RouteShelterMetrics {
  const analyzed: RouteCorridorShelter[] = allHavens.map(haven => {
    const detourMeters = getMinDistanceToRoute(haven.coordinates, routeCoords);
    const detourMinutes = Math.max(1, Math.ceil(detourMeters / 75)); // ~75m/min walking speed
    return {
      haven,
      detourMeters,
      detourMinutes,
      isDirectCorridor: detourMeters <= directThresholdMeters,
      isExtended: detourMeters <= extendedThresholdMeters
    };
  });

  // Sort by detour distance
  analyzed.sort((a, b) => a.detourMeters - b.detourMeters);

  const directShelters = analyzed.filter(s => s.isDirectCorridor);
  const extendedShelters = analyzed.filter(s => s.isExtended);

  // Analyze "Shelter Desert": Check gaps along the route polyline
  let hasDesert = false;
  let maxDesertGapKm = 0;

  if (routeCoords.length > 5) {
    // Sample along the route every ~1 km
    let currentDesertDistanceMeters = 0;
    let accumulatedDistanceMeters = 0;

    for (let i = 0; i < routeCoords.length - 1; i++) {
      const segLen = getDistanceMeters(routeCoords[i], routeCoords[i + 1]);
      accumulatedDistanceMeters += segLen;

      // Check if any shelter is within 650m of this coordinate
      const hasNearbyHaven = allHavens.some(h => getDistanceMeters(h.coordinates, routeCoords[i]) <= 650);

      if (!hasNearbyHaven) {
        currentDesertDistanceMeters += segLen;
        if (currentDesertDistanceMeters > maxDesertGapKm * 1000) {
          maxDesertGapKm = Number((currentDesertDistanceMeters / 1000).toFixed(1));
        }
      } else {
        currentDesertDistanceMeters = 0;
      }
    }

    if (maxDesertGapKm >= 2.5) {
      hasDesert = true;
    }
  }

  const desertMessage = hasDesert
    ? `⚠️ ${maxDesertGapKm} km Shelter Desert: Extended corridor with zero 24/7 havens within 650m`
    : undefined;

  return {
    directCount: directShelters.length,
    extendedCount: extendedShelters.length,
    shelters: analyzed,
    closestShelter: directShelters[0] || extendedShelters[0] || analyzed[0] || null,
    shelterDesert: {
      hasDesert,
      desertSpanKm: maxDesertGapKm,
      message: desertMessage
    }
  };
}
