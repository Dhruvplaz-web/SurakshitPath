/**
 * SurakshitPath - Backend REST API Client & Autonomous Fallback Bridge
 * Connects the React client to the FastAPI Python service (api/main.py)
 * with transparent, zero-downtime fallback to local in-browser calculation.
 */

// Dynamically adapt to LAN IP (e.g. 10.197.81.205) when testing on mobile devices over Wi-Fi
const defaultApiHost = typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost'
  ? `http://${window.location.hostname}:8000`
  : 'http://localhost:8000';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultApiHost;

export interface BackendHealthResponse {
  status: string;
  system: string;
  testbed: string;
  anti_redlining: boolean;
  un_sdgs: string[];
}

export interface BackendTelemetryCheckRequest {
  current_position: [number, number];
  corridor_coordinates: [number, number][];
  stationary_duration_seconds: number;
  speed_mps: number;
}

export interface BackendTelemetryCheckResponse {
  has_anomaly: boolean;
  reason: string | null;
  requires_safety_check: boolean;
  emergency_escalation_available: boolean;
}

export interface BackendSafetyScoreRequest {
  length_meters: number;
  lighting_lux: number;
  active_commercial_pois: number;
  nearest_transit_meters: number;
  nearest_emergency_meters: number;
  incident_penalty: number;
}

export interface BackendSafetyScoreResponse {
  safety_score: number;
  classification: string;
  sub_factors: {
    lighting_factor: number;
    commercial_activity_factor: number;
    transit_proximity_factor: number;
    emergency_haven_factor: number;
    incident_penalty: number;
  };
  explainability: {
    primary_safety_driver: string;
    audit_standard: string;
  };
}

let backendHealthy = false;
let lastCheckTime = 0;
const HEALTH_CACHE_MS = 15000;

/**
 * Checks if the FastAPI backend server is currently reachable
 */
export async function checkBackendHealth(): Promise<boolean> {
  const now = Date.now();
  if (now - lastCheckTime < HEALTH_CACHE_MS) {
    return backendHealthy;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      backendHealthy = true;
      lastCheckTime = now;
      return true;
    }
  } catch {
    backendHealthy = false;
    lastCheckTime = now;
  }

  return false;
}

/**
 * Checks telematics anomalies against the FastAPI watchdog service
 */
export async function checkTelemetryWithBackend(
  req: BackendTelemetryCheckRequest
): Promise<BackendTelemetryCheckResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE_URL}/api/telemetry/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as BackendTelemetryCheckResponse;
    }
  } catch {
    // Fall back to client-side Extended Kalman Filter & Turf.js watchdog
  }

  return null;
}

/**
 * Calculates safety score using the FastAPI safety scoring endpoint
 */
export async function scoreSafetyWithBackend(
  req: BackendSafetyScoreRequest
): Promise<BackendSafetyScoreResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE_URL}/api/safety/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as BackendSafetyScoreResponse;
    }
  } catch {
    // Fall back to client-side formula
  }

  return null;
}
