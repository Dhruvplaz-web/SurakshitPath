import { RouteOption, DynamicEvent, TravelProfile } from '../types/routing';
import { getOrchestratedRoutes, RouteCollection } from '../engine/routing/routeOrchestrator';

export { getOrchestratedRoutes };
export type { RouteCollection };

/**
 * Master road routing bridge: Delegates to the modular 4-engine Route Orchestrator
 * (safestRouteEngine, swiftSafeRouteEngine, fastestRouteEngine, transitRouteEngine).
 * Fully backward-compatible with legacy callers expecting { fastest, safe, balanced }.
 */
export async function getRoadAlignedRoutes(
  origin: [number, number],
  dest: [number, number],
  _beta: number = 0.8,
  activeEvents: DynamicEvent[] = [],
  profile: TravelProfile = 'pedestrian'
): Promise<{
  fastest: RouteOption;
  safe: RouteOption;
  balanced: RouteOption;
  swiftSafe: RouteOption;
  transit: RouteOption;
}> {
  const routes = await getOrchestratedRoutes(origin, dest, profile, activeEvents);

  return {
    fastest: routes.fastest,
    safe: routes.safe,
    balanced: routes.swiftSafe, // Backward-compatible alias
    swiftSafe: routes.swiftSafe,
    transit: routes.transit
  };
}