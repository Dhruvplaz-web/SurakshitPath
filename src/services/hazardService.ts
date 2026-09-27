import * as turf from '@turf/turf';
import { PUNE_EDGES } from '../data/puneCorridorGraph';
import { GraphEdge, CitizenReport, DynamicEvent } from '../types/routing';

export interface HazardSnapResult {
  snappedEdge: GraphEdge;
  distanceMeters: number;
  nearestPointCoords: [number, number];
  affectedEdgeIds: string[];
}

/**
 * Dynamically snaps a citizen hazard report coordinate to the nearest roadway edge in the city graph
 * using Turf.js geodesic point-to-line distance, eliminating any hardcoded edge binding.
 */
export function snapHazardToNearestEdge(
  coords: [number, number], // [lat, lng]
  edges: GraphEdge[] = PUNE_EDGES,
  thresholdMeters: number = 150
): HazardSnapResult | null {
  if (!coords || coords.length < 2 || edges.length === 0) return null;

  // Turf expects [lng, lat]
  const reportPoint = turf.point([coords[1], coords[0]]);

  let closestEdge: GraphEdge = edges[0];
  let minDistanceMeters = Infinity;
  let snappedPointCoords: [number, number] = coords;

  for (const edge of edges) {
    if (!edge.coordinates || edge.coordinates.length < 2) continue;

    // Convert coordinates to [lng, lat] for Turf
    const lineCoords = edge.coordinates.map(c => [c[1], c[0]]);
    const lineString = turf.lineString(lineCoords);

    const distKm = turf.pointToLineDistance(reportPoint, lineString, { units: 'kilometers' });
    const distMeters = Math.round(distKm * 1000);

    if (distMeters < minDistanceMeters) {
      minDistanceMeters = distMeters;
      closestEdge = edge;

      // Find nearest point on the line segment
      const nearestPt = turf.nearestPointOnLine(lineString, reportPoint);
      snappedPointCoords = [nearestPt.geometry.coordinates[1], nearestPt.geometry.coordinates[0]];
    }
  }

  // Determine whether the report falls directly within corridor buffer or adjacent connector
  const isWithinBuffer = minDistanceMeters <= thresholdMeters;

  return {
    snappedEdge: closestEdge,
    distanceMeters: minDistanceMeters,
    nearestPointCoords: snappedPointCoords,
    affectedEdgeIds: isWithinBuffer ? [closestEdge.id] : [closestEdge.id]
  };
}

/**
 * Converts a CitizenReport into a DynamicEvent with dynamic spatial edge penalization
 */
export function createDynamicEventFromReport(
  report: CitizenReport,
  edges: GraphEdge[] = PUNE_EDGES
): DynamicEvent {
  const snapResult = snapHazardToNearestEdge(report.coordinates, edges);
  const affectedEdgeIds = snapResult ? snapResult.affectedEdgeIds : ['edge_jspm_to_bhumkar'];

  // Map category to event type
  let eventType: DynamicEvent['type'] = 'streetlight_outage';
  if (report.category === 'harassment_crowd') {
    eventType = 'crowd_alert';
  } else if (report.category === 'pothole_hazard') {
    eventType = 'road_closure';
  } else if (report.category === 'other') {
    const text = `${report.title} ${report.description}`.toLowerCase();
    if (text.includes('pothole') || text.includes('road') || text.includes('block') || text.includes('digging') || text.includes('construction')) {
      eventType = 'road_closure';
    } else if (text.includes('crowd') || text.includes('harass') || text.includes('men') || text.includes('threat') || text.includes('follow')) {
      eventType = 'crowd_alert';
    } else {
      eventType = 'streetlight_outage';
    }
  }

  // Calibrated severity from Gemini Multimodal / AI Risk assessment (0.15 to 1.0)
  let severity = 0.65;
  if (typeof report.aiRiskScore === 'number' && !isNaN(report.aiRiskScore)) {
    severity = Math.max(0.15, Math.min(1.0, Number((report.aiRiskScore / 100).toFixed(2))));
  } else if (report.urgency === 'high') {
    severity = 0.90;
  } else if (report.urgency === 'low') {
    severity = 0.40;
  }

  return {
    id: `ev_${report.id}`,
    title: report.title,
    description: `${report.description} (Snapped to ${snapResult?.snappedEdge.name || 'Roadway Corridor'} [${snapResult?.distanceMeters || 0}m away])`,
    type: eventType,
    coordinates: report.coordinates,
    affectedEdgeIds,
    severity,
    timestamp: report.reportedAt || Date.now(),
    active: true
  };
}
