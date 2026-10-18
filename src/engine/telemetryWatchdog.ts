import * as turf from '@turf/turf';
import { RouteOption, TelemetryState, AnomalyCheckState } from '../types/routing';

/**
 * Calculates perpendicular cross-track distance (meters) from current GPS coordinate
 * to the active planned route polyline using Turf.js.
 */
export function calculateCrossTrackDistance(
  currentPos: [number, number], // [lat, lng]
  route: RouteOption
): number {
  if (!route.coordinates || route.coordinates.length < 2) return 0;

  // Turf expects [lng, lat]
  const pt = turf.point([currentPos[1], currentPos[0]]);
  const lineCoords = route.coordinates.map(c => [c[1], c[0]]);
  const line = turf.lineString(lineCoords);

  const distanceKm = turf.pointToLineDistance(pt, line, { units: 'kilometers' });
  return Math.round(distanceKm * 1000); // meters
}

/**
 * Checks for telematics anomalies:
 * 1. Deviation Anomaly: distance to planned path > 50 meters
 * 2. Stationary Anomaly: speed < 0.5 km/h for > threshold seconds in non-stop zone
 */
export function evaluateTelemetryAnomaly(
  telemetry: TelemetryState,
  isSimulationFastForward: boolean = true
): { hasAnomaly: boolean; reason: 'deviation' | 'stationary' | null } {
  // Deviation threshold: 50 meters
  // Deviation threshold: 85 meters (filters out urban GPS multipath jitter)
  if (telemetry.crossTrackDistanceMeters > 85) {
    return { hasAnomaly: true, reason: 'deviation' };
  }

  // Stationary threshold: in demo mode, 8 seconds of stationary stall; in production, 120s
  // Stationary dwell threshold: 10s for simulation, 240s (4 min) for production to prevent false alarms at traffic lights
  const stallThreshold = isSimulationFastForward ? 10 : 240;
  if (telemetry.isStationary && telemetry.dwellTimeSeconds >= stallThreshold) {
    return { hasAnomaly: true, reason: 'stationary' };
  }

  return { hasAnomaly: false, reason: null };
}

/**
 * Simulates dispatching an emergency webhook (n8n workflow / WhatsApp / Telegram)
 */
export async function dispatchEmergencyAlert(
  anomalyState: AnomalyCheckState,
  telemetry: TelemetryState,
  route: RouteOption
): Promise<{ success: boolean; dispatchId: string; message: string }> {
  const [lat, lng] = telemetry.currentPosition;
  const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
  const now = new Date().toLocaleTimeString();

  const payload = {
    event: 'EMERGENCY_SOS_TRIGGERED',
    timestamp: now,
    studentName: 'Dhruv / Commuter (SurakshitPath)',
    reason: anomalyState.reason === 'deviation' ? 'Critical Route Deviation (>85m off safe corridor)' : 'Prolonged Unexpected Stall (>4 min)',
    coordinates: { lat, lng },
    mapsLink,
    activeRoute: route.name,
    crossTrackMeters: telemetry.crossTrackDistanceMeters,
    recipients: ['+91 98230 XXXXX (Parent / Guardian)', '+91 98900 XXXXX (Emergency Contact)'],
    policeNotification: 'Alert sent to Pune Police Control (112) with telematics trace'
  };

  console.log('[SurakshitPath] Emergency Webhook Fired (n8n Payload):', payload);

  // Artificial network round-trip delay
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    success: true,
    dispatchId: `SOS-${Date.now().toString().slice(-6)}`,
    message: `Emergency SOS dispatched to Trusted Contacts & Pune Police Control with live GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
  };
}
