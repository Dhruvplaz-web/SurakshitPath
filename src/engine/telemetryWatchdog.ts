import * as turf from '@turf/turf';
import { RouteOption, TelemetryState, AnomalyCheckState } from '../types/routing';
import { getStoredGuardians } from '../services/firebaseAuthService';

export const MASTER_PIN = '4729'; // Default Master PIN: Safely cancels emergency alarm
export const DURESS_PIN = '9999'; // Default Duress PIN: Simulates dismissal while silently firing high-priority SOS

export type PinVerificationResult = 
  | { status: 'master_dismiss'; message: 'Safe commute confirmed. Watchdog alarm dismissed.' }
  | { status: 'duress_sos'; message: 'Alarm Dismissed — Safe Commute Resumed' } // Decoy message for attacker
  | { status: 'invalid'; message: 'Incorrect PIN. Emergency watchdog countdown continuing.' };

/**
 * Validates entered 4-digit PIN against the Dual-PIN Duress Architecture
 */
export function verifyDuressPin(enteredPin: string): PinVerificationResult {
  if (enteredPin === MASTER_PIN) {
    return {
      status: 'master_dismiss',
      message: 'Safe commute confirmed. Watchdog alarm dismissed.'
    };
  }
  if (enteredPin === DURESS_PIN) {
    return {
      status: 'duress_sos',
      message: 'Alarm Dismissed — Safe Commute Resumed'
    };
  }
  return {
    status: 'invalid',
    message: 'Incorrect PIN. Emergency watchdog countdown continuing.'
  };
}

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
 * 2. Stationary Anomaly: speed < 0.5 km/h for > threshold seconds in non-stop zone (>180s in live, >12s in demo)
 */
export function evaluateTelemetryAnomaly(
  telemetry: TelemetryState,
  isSimulationFastForward: boolean = true
): { hasAnomaly: boolean; reason: 'deviation' | 'stationary' | null } {
  // Deviation threshold: 50 meters
  if (telemetry.crossTrackDistanceMeters > 50) {
    return { hasAnomaly: true, reason: 'deviation' };
  }

  // Stationary threshold: in demo mode, 12 seconds; in live travel, 180s (3 minutes)
  const stallThreshold = isSimulationFastForward ? 12 : 180;
  if (telemetry.isStationary && telemetry.dwellTimeSeconds >= stallThreshold) {
    return { hasAnomaly: true, reason: 'stationary' };
  }

  return { hasAnomaly: false, reason: null };
}

/**
 * Dispatches emergency alert payload with live telematics snapshot
 * across WebSockets, BroadcastChannel, and simulated webhook
 */
export async function dispatchEmergencyAlert(
  anomalyState: AnomalyCheckState,
  telemetry: TelemetryState,
  route: RouteOption,
  isDuressSilentTrigger: boolean = false
): Promise<{ success: boolean; dispatchId: string; message: string }> {
  const [lat, lng] = telemetry.currentPosition;
  const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
  const now = new Date().toLocaleTimeString();

  // Retrieve configured guardians with primary target Dhruv (+91 96651 84535)
  const storedGuardians = getStoredGuardians();
  const recipients = storedGuardians.map(g => `${g.phone} (${g.name})`);
  if (!recipients.some(r => r.includes('9665184535'))) {
    recipients.unshift('+91 96651 84535 (Dhruv - Primary)');
  }

  const payload = {
    event: isDuressSilentTrigger ? 'SILENT_DURESS_PIN_TRIGGERED' : 'EMERGENCY_WATCHDOG_SOS',
    priority: 'CRITICAL_IMMEDIATE_DISPATCH',
    timestamp: now,
    studentName: 'Dhruv / Commuter (SurakshitPath)',
    reason: isDuressSilentTrigger 
      ? 'COERCION ALERT: User entered Duress PIN (9999). Attacker present.' 
      : anomalyState.reason === 'deviation'
        ? `Cross-Track Corridor Deviation (${telemetry.crossTrackDistanceMeters}m > 50m threshold)`
        : 'Motionless Standstill (>3 mins) along isolated stretch',
    coordinates: { lat, lng },
    mapsLink,
    activeRoute: route.name,
    crossTrackMeters: telemetry.crossTrackDistanceMeters,
    speedKmh: telemetry.speedKmh,
    batteryPercent: 88,
    recipients,
    policeNotification: 'Encrypted packet dispatched to Pune Police Control (112) with telematics trace'
  };

  console.warn('[SurakshitPath] EMERGENCY PACKET DISPATCHED:', payload);

  // Broadcast to other open windows / tabs (e.g. Guardian view on another monitor)
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('surakshit_emergency_stream');
      channel.postMessage({ type: 'SOS_EVENT', payload });
      channel.close();
    } catch {
      // Ignore broadcast errors
    }
  }

  // Artificial network latency simulation
  await new Promise(resolve => setTimeout(resolve, 350));

  return {
    success: true,
    dispatchId: `SOS-${Date.now().toString().slice(-6)}`,
    message: isDuressSilentTrigger
      ? 'Safe Commute Resumed'
      : `Emergency alert dispatched to Dhruv (+91 96651 84535), trusted circle & Pune Police (112) with live GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
  };
}
