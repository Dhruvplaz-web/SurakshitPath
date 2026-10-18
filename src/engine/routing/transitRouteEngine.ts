import { RouteOption, FactorBreakdown, DynamicEvent, TravelProfile } from '../../types/routing';
import { calculateModeDurationMinutes } from '../graphRouter';
import { getMinDistanceToHavens, calculateHazardPenalty, createSemanticSegments, generateRouteManeuvers } from './routeHelpers';

export function calculateTransitRoute(
  coords: [number, number][],
  distanceMeters: number,
  profile: TravelProfile = 'pedestrian',
  activeEvents: DynamicEvent[] = []
): RouteOption {
  const minHavenDist = getMinDistanceToHavens(coords);
  const hazardPenalty = calculateHazardPenalty(coords, activeEvents);

  const factors: FactorBreakdown = {
    lighting: 0.76,
    activity: 0.88,
    transit: 0.94,
    emergency: minHavenDist <= 400 ? 0.85 : 0.72,
    incidentPenalty: hazardPenalty * 0.7,
    compositeScore: Math.max(30, Math.round(79 - hazardPenalty * 70))
  };

  const durationMinutes = calculateModeDurationMinutes(distanceMeters, profile);

  return {
    id: 'route_transit',
    name: 'Route 4 · 🚌 Transit & High-Footfall Corridor',
    tagline: 'Balanced travel time along illuminated transit lines, BRTS stops, and regular footfall hubs',
    routeType: 'transit',
    travelProfile: profile,
    distanceMeters,
    durationMinutes,
    safetyScore: factors.compositeScore,
    betaUsed: 0.4,
    factors,
    coordinates: coords,
    segments: createSemanticSegments('transit', 'Transit Corridor & Metro Strip', coords, distanceMeters, factors, 'primary'),
    maneuvers: generateRouteManeuvers(coords, 'BRTS Public Transit Boulevard'),
    isRecommendedNightRoute: false,
    reasons: [
      'Follows major illuminated public transit corridors with continuous active bus stops and metro stations.',
      'High natural crowd surveillance: consistent pedestrian presence throughout evening hours.',
      `Proximity to transit kiosks and safe shelter zones (~${Math.round(minHavenDist)}m).`,
      'Excellent choice for commuters traveling via or alongside public transit lines.'
    ]
  };
}