import { SafeHaven, CitizenReport, SafeHavenType } from '../types/routing';
import { PUNE_SAFE_HAVENS } from '../data/safeHavens';
import { PUNE_DARK_SPOTS } from '../data/civicAdminData';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

export interface ScadaFeederTelemetry {
  feederId: string;
  substationName: string;
  circuitCode: string;
  status: 'ONLINE' | 'FAULT' | 'OFFLINE' | 'SCHEDULED_OFF';
  currentDrawAmps: number;
  voltageVolts: number;
  lumensUtilizationPct: number;
  activeLampCount: number;
  failedLampCount: number;
  lastHeartbeat: string;
  coordinates: [number, number];
}

export interface ScadaGrievanceResponse {
  success: boolean;
  ticket_id: string;
  department: string;
  sla_resolution_target_hours: number;
  assigned_substation: string;
  status: string;
  coordinates: [number, number];
}

export const apiClient = {
  /**
   * Fetch verified 24/7 Safe Haven refuges with optional proximity ordering
   */
  async getSafeHavens(
    coords?: [number, number],
    typeFilter?: SafeHavenType | 'all'
  ): Promise<SafeHaven[]> {
    try {
      const url = new URL(`${API_BASE}/safe-havens`);
      if (coords) {
        url.searchParams.set('lat', coords[0].toString());
        url.searchParams.set('lon', coords[1].toString());
      }
      if (typeFilter && typeFilter !== 'all') {
        url.searchParams.set('type', typeFilter);
      }

      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.havens) && data.havens.length > 0) {
          return data.havens;
        }
      }
    } catch {
      // Graceful offline fallback
    }

    // Local in-memory fallback
    let havens = [...PUNE_SAFE_HAVENS];
    if (typeFilter && typeFilter !== 'all') {
      havens = havens.filter(h => h.type === typeFilter);
    }
    return havens;
  },

  /**
   * Submit citizen safety audit report
   */
  async submitCitizenReport(report: CitizenReport): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: report.title,
          category: report.category,
          urgency: report.urgency,
          description: report.description,
          photoUrl: report.photoUrl,
          coordinates: report.coordinates
        }),
        signal: AbortSignal.timeout(4000)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Fetch crowdsourced citizen reports
   */
  async getCitizenReports(): Promise<CitizenReport[]> {
    try {
      const res = await fetch(`${API_BASE}/reports`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.reports)) {
          return data.reports;
        }
      }
    } catch {
      // Offline fallback
    }
    return [];
  },

  /**
   * Fetch verified municipal dark spots
   */
  async getDarkSpots() {
    try {
      const res = await fetch(`${API_BASE}/dark-spots`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.dark_spots)) {
          return data.dark_spots;
        }
      }
    } catch {
      // Fallback
    }
    return PUNE_DARK_SPOTS;
  },

  /**
   * Fetch live PMC SCADA streetlight feeders
   */
  async getScadaFeeders(): Promise<ScadaFeederTelemetry[]> {
    try {
      const res = await fetch(`${API_BASE}/scada/feeders`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return data.feeders || [];
      }
    } catch {
      // Fallback
    }
    return [];
  },

  /**
   * Auto-dispatch PMC SCADA grievance ticket for outages
   */
  async dispatchScadaGrievance(
    coordinates: [number, number],
    category: string,
    description: string,
    feederId?: string
  ): Promise<ScadaGrievanceResponse | null> {
    try {
      const res = await fetch(`${API_BASE}/scada/grievance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinates,
          category,
          description,
          feeder_id: feederId
        }),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return null;
  }
};
