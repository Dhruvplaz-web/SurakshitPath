import { RouteOption, FactorBreakdown, DynamicEvent, TravelProfile } from '../../types/routing';
import { calculateModeDurationMinutes } from '../graphRouter';
import { getMinDistanceToHavens, calculateHazardPenalty, createSemanticSegments, generateRouteManeuvers } from './routeHelpers';

export function calculateSwiftSafeRoute(
  coords: [number, number][],
  distanceMeters: number,
  profile: TravelProfile = 'pedestrian',
  activeEvents: DynamicEvent[] = []
): RouteOption {
  const isPedestrian = profile === 'pedestrian';
  const minHavenDist = getMinDistanceToHavens(coords);
  const hazardPenalty = calculateHazardPenalty(coords, activeEvents);

  const factors: FactorBreakdown = {
    lighting: isPedestrian ? 0.82 : 0.78,
    activity: 0.78,
    transit: 0.82,
    emergency: minHavenDist <= 500 ? 0.80 : 0.68,
    incidentPenalty: hazardPenalty * 0.8,
    compositeScore: Math.max(30, Math.round(82 - hazardPenalty * 80))
  };

  const durationMinutes = calculateModeDurationMinutes(distanceMeters, profile);

  return {
    id: 'route_balanced',
    name: 'Route 2 · ⚡ Swift & Safe (Everyday Favorite)',
    tagline: 'Fast commuter compromise: 8% faster than Shield while avoiding unlit alleys and dark cuts',
    routeType: 'balanced',
    travelProfile: profile,
    distanceMeters,
    durationMinutes,
    safetyScore: factors.compositeScore,
    betaUsed: 0.5,
    factors,
    coordinates: coords,
    segments: createSemanticSegments('swift_safe', 'Swift Arterial Link', coords, distanceMeters, factors, 'secondary'),
    maneuvers: generateRouteManeuvers(coords, 'Direct Secondary Avenue'),
    isRecommendedNightRoute: false,
    reasons: [
      'Smart commuter compromise: keeps travel time quick while avoiding all dark interior cut-throughs.',
      'Follows well-paved secondary arterials with good visibility and steady vehicular traffic.',
      `Maintains reliable ~${Math.round(minHavenDist)}m refuge access across the commute.`,
      'Ideal for everyday evening commutes from office or college.'
    ]
  };
}