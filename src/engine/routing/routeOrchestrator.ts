import { RouteOption, DynamicEvent, TravelProfile } from '../../types/routing';
import { calculatePuneRoutes } from '../graphRouter';
import { calculateSafestRoute } from './safestRouteEngine';
import { calculateSwiftSafeRoute } from './swiftSafeRouteEngine';
import { calculateFastestRoute } from './fastestRouteEngine';
import { calculateTransitRoute } from './transitRouteEngine';

export interface RouteCollection {
  safe: RouteOption;        // 🛡️ Maximum Shield
  swiftSafe: RouteOption;   // ⚡ Swift & Safe
  fastest: RouteOption;     // ⏱️ Fastest Direct
  transit: RouteOption;     // 🚌 Transit Boulevard
  balanced: RouteOption;    // Backward-compatible alias for swiftSafe
}

const ORCHESTRATOR_CACHE = new Map<string, RouteCollection>();

/**
 * Multi-profile OSRM fetch with 6s timeout for resilient Indian 4G/3G connections
 */
async function fetchOsrmMultiRoutes(
  waypoints: [number, number][],
  profile: TravelProfile = 'pedestrian'
): Promise<{ coordinates: [number, number][]; distanceMeters: number; durationMinutes: number }[] | null> {
  const coordString = waypoints.map(w => `${w[1].toFixed(6)},${w[0].toFixed(6)}`).join(';');
  const preferredMode = profile === 'pedestrian' ? 'foot' : profile === 'two_wheeler' ? 'bike' : 'driving';

  const tryFetch = async (mode: string): Promise<any[] | null> => {
    try {
      const url = `https://router.project-osrm.org/route/v1/${mode}/${coordString}?overview=full&geometries=geojson&alternatives=3&steps=false`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) return null;
      const data = await response.json();
      if (!data.routes || data.routes.length === 0) return null;
      return data.routes;
    } catch {
      return null;
    }
  };

  let routes = await tryFetch(preferredMode);
  if (!routes && preferredMode !== 'driving') {
    routes = await tryFetch('driving');
  }

  if (!routes || routes.length === 0) return null;

  return routes.map((r: any) => ({
    coordinates: r.geometry.coordinates.map((c: [number, number]) => [
      Number(c[1].toFixed(5)),
      Number(c[0].toFixed(5))
    ]) as [number, number][],
    distanceMeters: Math.round(r.distance),
    durationMinutes: Math.max(1, Math.round(r.duration / 60))
  }));
}

/**
 * Master Route Orchestrator: Computes all 4 dedicated routes for any origin/destination pair in India
 */
export async function getOrchestratedRoutes(
  origin: [number, number],
  dest: [number, number],
  profile: TravelProfile = 'pedestrian',
  activeEvents: DynamicEvent[] = []
): Promise<RouteCollection> {
  const cacheKey = `${origin[0].toFixed(4)},${origin[1].toFixed(4)}->${dest[0].toFixed(4)},${dest[1].toFixed(4)}_${profile}`;
  if (ORCHESTRATOR_CACHE.has(cacheKey)) {
    return ORCHESTRATOR_CACHE.get(cacheKey)!;
  }

  // 1. Fetch live real-road geometry from OpenStreetMap OSRM
  const directRoutes = await fetchOsrmMultiRoutes([origin, dest], profile);

  if (directRoutes && directRoutes.length > 0) {
    const primary = directRoutes[0];
    const alt1 = directRoutes[1] || primary;
    const alt2 = directRoutes[2] || directRoutes[1] || primary;
    const alt3 = directRoutes[3] || directRoutes[0];

    const safe = calculateSafestRoute(primary.coordinates, primary.distanceMeters, profile, activeEvents);
    const swiftSafe = calculateSwiftSafeRoute(alt1.coordinates, alt1.distanceMeters, profile, activeEvents);
    const fastest = calculateFastestRoute(alt2.coordinates, Math.min(primary.distanceMeters, alt2.distanceMeters), profile, activeEvents);
    const transit = calculateTransitRoute(alt3.coordinates, alt3.distanceMeters, profile, activeEvents);

    const collection: RouteCollection = {
      safe,
      swiftSafe,
      fastest,
      transit,
      balanced: swiftSafe // Backward-compatible alias
    };

    ORCHESTRATOR_CACHE.set(cacheKey, collection);
    return collection;
  }

  // 2. Offline / Fallback: Use road-aligned graph router with statewide extrapolation
  const fallback = calculatePuneRoutes(0.8, activeEvents, origin, dest, profile);
  const safeFallback = calculateSafestRoute(fallback.safe.coordinates, fallback.safe.distanceMeters, profile, activeEvents);
  const swiftSafeFallback = calculateSwiftSafeRoute(fallback.balanced.coordinates, fallback.balanced.distanceMeters, profile, activeEvents);
  const fastestFallback = calculateFastestRoute(fallback.fastest.coordinates, fallback.fastest.distanceMeters, profile, activeEvents);
  const transitFallback = calculateTransitRoute(fallback.balanced.coordinates, fallback.balanced.distanceMeters, profile, activeEvents);

  const fallbackCollection: RouteCollection = {
    safe: safeFallback,
    swiftSafe: swiftSafeFallback,
    fastest: fastestFallback,
    transit: transitFallback,
    balanced: swiftSafeFallback
  };

  ORCHESTRATOR_CACHE.set(cacheKey, fallbackCollection);
  return fallbackCollection;
}