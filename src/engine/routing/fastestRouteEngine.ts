import { RouteOption, FactorBreakdown, DynamicEvent, TravelProfile } from '../../types/routing';
import { calculateModeDurationMinutes } from '../graphRouter';
import { getMinDistanceToHavens, calculateHazardPenalty, createSemanticSegments, generateRouteManeuvers } from './routeHelpers';

export function calculateFastestRoute(
  coords: [number, number][],
  distanceMeters: number,
  profile: TravelProfile = 'pedestrian',
  activeEvents: DynamicEvent[] = []
): RouteOption {
  const minHavenDist = getMinDistanceToHavens(coords);
  const hazardPenalty = calculateHazardPenalty(coords, activeEvents);
  const fastestHazard = Math.min(0.75, hazardPenalty + 0.12);

  const factors: FactorBreakdown = {
    lighting: 0.38,
    activity: 0.34,
    transit: 0.42,
    emergency: 0.32,
    incidentPenalty: fastestHazard,
    compositeScore: Math.max(25, Math.round(48 - fastestHazard * 100))
  };

  const durationMinutes = calculateModeDurationMinutes(distanceMeters, profile);

  return {
    id: 'route_fastest',
    name: 'Route 3 · ⏱️ Direct Cut (Fastest)',
    tagline: 'Shortest travel time, but cuts through lower-visibility local service streets',
    routeType: 'fastest',
    travelProfile: profile,
    distanceMeters,
    durationMinutes,
    safetyScore: factors.compositeScore,
    betaUsed: 0.0,
    factors,
    coordinates: coords,
    segments: createSemanticSegments('fastest', 'Direct Cut-Through', coords, distanceMeters, factors, 'residential'),
    maneuvers: generateRouteManeuvers(coords, 'Interior Service Connector'),
    isRecommendedNightRoute: false,
    warningNotice: 'Caution: Reduced nighttime illumination and sparse emergency shelter coverage along interior cuts.',
    reasons: [
      'Minimizes overall travel distance and travel duration.',
      'Warning: Traverses stretches with lower illumination and sparse 24/7 commercial footfall.',
      `Emergency shelter distance is higher (~${Math.round(minHavenDist)}m average).`,
      'Recommended when traveling in groups or during daylight hours.'
    ]
  };
}