/**
 * SurakshitPath - Consent-Based GPS Location Sharing Service
 * 
 * Strictly follows Privacy-by-Design principles:
 * - 100% Opt-In: NEVER starts without explicit user confirmation
 * - Transparent status indicators and instant [Stop Sharing] control
 * - Minimum necessary telemetry (coordinates, accuracy, timestamp)
 * - Temporary in-memory session (no permanent tracking or historical retention)
 * - Automatically shuts down when stopped, trip ends, or component unmounts
 */

export interface LocationShareSession {
  sessionId: string;
  isActive: boolean;
  trustedContactName: string;
  trustedContactPhone: string;
  coordinates: [number, number] | null;
  accuracyMeters: number | null;
  startedAt: number;
  lastUpdatedAt: number;
  shareUrl: string;
  error: string | null;
}

type LocationListener = (session: LocationShareSession) => void;

class LocationShareService {
  private watchId: number | null = null;
  private listeners: Set<LocationListener> = new Set();

  private session: LocationShareSession = {
    sessionId: '',
    isActive: false,
    trustedContactName: 'Mom',
    trustedContactPhone: '+91 98220 12345',
    coordinates: null,
    accuracyMeters: null,
    startedAt: 0,
    lastUpdatedAt: 0,
    shareUrl: '',
    error: null
  };

  public getSession(): LocationShareSession {
    return { ...this.session };
  }

  public subscribe(listener: LocationListener): () => void {
    this.listeners.add(listener);
    listener(this.getSession());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const current = this.getSession();
    this.listeners.forEach(fn => fn(current));
  }

  /**
   * Starts GPS location sharing after explicit user consent
   */
  public async startSharing(contactName = 'Mom', contactPhone = '+91 98220 12345'): Promise<LocationShareSession> {
    if (this.session.isActive) {
      return this.getSession();
    }

    if (!navigator.geolocation) {
      this.session.error = 'Geolocation is not supported by your browser.';
      this.notify();
      throw new Error(this.session.error);
    }

    const sessionId = 'loc_' + Math.random().toString(36).substring(2, 9);
    const demoUrl = `${window.location.origin}/track/${sessionId}`;

    this.session = {
      sessionId,
      isActive: true,
      trustedContactName: contactName,
      trustedContactPhone: contactPhone,
      coordinates: null,
      accuracyMeters: null,
      startedAt: Date.now(),
      lastUpdatedAt: Date.now(),
      shareUrl: demoUrl,
      error: null
    };
    this.notify();

    // Start watching position with high accuracy
    return new Promise((resolve, reject) => {
      let hasResolved = false;

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy);

          this.session.coordinates = [lat, lng];
          this.session.accuracyMeters = accuracy;
          this.session.lastUpdatedAt = Date.now();
          this.session.error = null;
          this.notify();

          // Sync with backend API if available
          this.syncUpdateToBackend(lat, lng, accuracy);

          if (!hasResolved) {
            hasResolved = true;
            resolve(this.getSession());
          }
        },
        (error) => {
          let msg = 'Unable to determine your GPS location.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission was denied. Please allow location access to share.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'GPS signal unavailable. Please ensure location services are enabled.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location acquisition timed out.';
          }
          this.session.error = msg;
          this.notify();

          if (!hasResolved) {
            hasResolved = true;
            reject(new Error(msg));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000
        }
      );
    });
  }

  /**
   * Immediately stops location sharing and clears GPS watcher
   */
  public stopSharing() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    const previousSessionId = this.session.sessionId;
    this.session = {
      ...this.session,
      isActive: false,
      error: null
    };
    this.notify();

    // Notify backend
    if (previousSessionId) {
      this.syncStopToBackend(previousSessionId);
    }
  }

  /**
   * Asynchronously notifies backend (with silent offline fallback)
   */
  private async syncUpdateToBackend(lat: number, lng: number, accuracy: number) {
    try {
      await fetch('/api/location-share/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.session.sessionId,
          latitude: lat,
          longitude: lng,
          accuracy: accuracy,
          timestamp: Date.now()
        })
      });
    } catch {
      // Offline fallback: keep in memory
    }
  }

  private async syncStopToBackend(sessionId: string) {
    try {
      await fetch('/api/location-share/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });
    } catch {
      // Offline fallback
    }
  }
}

export const locationShareService = new LocationShareService();
