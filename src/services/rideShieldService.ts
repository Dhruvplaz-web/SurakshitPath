/**
 * SurakshitPath - Ride Shield Service & Provider Adapters
 * 
 * Safety-Aware Ride Assistance Architecture:
 * - Extends route selection to nocturnal journey assistance.
 * - Adapter pattern supporting Uber, Ola, and future mobility providers.
 * - Generates official universal links / deep links passing pickup & destination.
 * - Manages ride sessions and integrates with optional trip monitoring.
 * - Does NOT fabricate driver ratings or claim safety guarantees.
 */

import {
  RideProviderId,
  RideProviderInfo,
  RideLinkParams,
  RideProviderRedirectResult,
  RideSession
} from '../types/routing';

// ----------------------------------------------------------------------------
// PROVIDER ADAPTER INTERFACE
// ----------------------------------------------------------------------------

export interface RideProviderAdapter {
  id: RideProviderId;
  name: string;
  getMetadata(): RideProviderInfo;
  generateDeepLink(params: RideLinkParams): RideProviderRedirectResult;
}

// ----------------------------------------------------------------------------
// UBER ADAPTER
// ----------------------------------------------------------------------------

export class UberAdapter implements RideProviderAdapter {
  id: RideProviderId = 'uber';
  name = 'Uber';

  getMetadata(): RideProviderInfo {
    return {
      id: 'uber',
      name: 'Uber',
      logo: '🚗',
      tagline: 'Uber Go, Auto & Premier',
      description: 'Global on-demand mobility platform with in-app 24/7 safety features.',
      deepLinkSupported: true,
      supportedParameters: [
        'pickup_latitude',
        'pickup_longitude',
        'pickup_nickname',
        'dropoff_latitude',
        'dropoff_longitude',
        'dropoff_nickname'
      ],
      isConfigured: true,
      notice: 'Driver selection and driver verification are handled by Uber.',
      brandColor: '#000000',
      webUrl: 'https://m.uber.com',
      appScheme: 'uber://'
    };
  }

  generateDeepLink(params: RideLinkParams): RideProviderRedirectResult {
    const pickupLat = params.pickupCoords[0];
    const pickupLng = params.pickupCoords[1];
    const destLat = params.destCoords[0];
    const destLng = params.destCoords[1];
    const pickupName = params.pickupName || 'Current Location';
    const destName = params.destName || 'Selected Destination';

    // Official Uber Universal Web Link
    const universalUrl = `https://m.uber.com/ul/?action=setPickup&client_id=surakshitpath&pickup[latitude]=${pickupLat.toFixed(6)}&pickup[longitude]=${pickupLng.toFixed(6)}&pickup[formatted_address]=${encodeURIComponent(pickupName)}&dropoff[latitude]=${destLat.toFixed(6)}&dropoff[longitude]=${destLng.toFixed(6)}&dropoff[formatted_address]=${encodeURIComponent(destName)}`;

    // Official Uber App Custom Scheme
    const deepLinkUrl = `uber://?action=setPickup&pickup[latitude]=${pickupLat.toFixed(6)}&pickup[longitude]=${pickupLng.toFixed(6)}&pickup[formatted_address]=${encodeURIComponent(pickupName)}&dropoff[latitude]=${destLat.toFixed(6)}&dropoff[longitude]=${destLng.toFixed(6)}&dropoff[formatted_address]=${encodeURIComponent(destName)}`;

    const fallbackUrl = 'https://m.uber.com/';

    return {
      providerId: 'uber',
      providerName: 'Uber',
      universalUrl,
      deepLinkUrl,
      fallbackUrl,
      parametersPassed: {
        pickupLat,
        pickupLng,
        pickupName,
        destLat,
        destLng,
        destName
      },
      instructions: 'Opening Uber with your pickup and destination coordinates. Please confirm your booking within the Uber app, then return to SurakshitPath to start optional route monitoring.',
      disclaimer: 'Driver selection and driver verification are handled by the ride provider. SurakshitPath does not guarantee driver or passenger safety.'
    };
  }
}

// ----------------------------------------------------------------------------
// OLA ADAPTER
// ----------------------------------------------------------------------------

export class OlaAdapter implements RideProviderAdapter {
  id: RideProviderId = 'ola';
  name = 'Ola';

  getMetadata(): RideProviderInfo {
    return {
      id: 'ola',
      name: 'Ola',
      logo: '🚖',
      tagline: 'Ola Mini, Prime & Auto',
      description: 'Indian multi-modal ridesharing network with emergency SOS and OTP start.',
      deepLinkSupported: true,
      supportedParameters: [
        'lat',
        'lng',
        'drop_lat',
        'drop_lng',
        'drop_name'
      ],
      isConfigured: true,
      notice: 'Driver selection and driver verification are handled by Ola.',
      brandColor: '#00D166',
      webUrl: 'https://book.olacabs.com',
      appScheme: 'olacabs://'
    };
  }

  generateDeepLink(params: RideLinkParams): RideProviderRedirectResult {
    const pickupLat = params.pickupCoords[0];
    const pickupLng = params.pickupCoords[1];
    const destLat = params.destCoords[0];
    const destLng = params.destCoords[1];
    const pickupName = params.pickupName || 'Current Location';
    const destName = params.destName || 'Selected Destination';

    // Official Ola Web Booking Universal Link
    const universalUrl = `https://book.olacabs.com/?lat=${pickupLat.toFixed(6)}&lng=${pickupLng.toFixed(6)}&drop_lat=${destLat.toFixed(6)}&drop_lng=${destLng.toFixed(6)}&drop_name=${encodeURIComponent(destName)}`;

    // Official Ola App Scheme
    const deepLinkUrl = `olacabs://app/launch?lat=${pickupLat.toFixed(6)}&lng=${pickupLng.toFixed(6)}&drop_lat=${destLat.toFixed(6)}&drop_lng=${destLng.toFixed(6)}`;

    const fallbackUrl = 'https://book.olacabs.com/';

    return {
      providerId: 'ola',
      providerName: 'Ola',
      universalUrl,
      deepLinkUrl,
      fallbackUrl,
      parametersPassed: {
        pickupLat,
        pickupLng,
        pickupName,
        destLat,
        destLng,
        destName
      },
      instructions: 'Opening Ola with your pickup and destination coordinates. Please confirm your booking within the Ola app, then return to SurakshitPath to start optional route monitoring.',
      disclaimer: 'Driver selection and driver verification are handled by the ride provider. SurakshitPath does not guarantee driver or passenger safety.'
    };
  }
}

// ----------------------------------------------------------------------------
// FUTURE / GENERIC PROVIDER ADAPTER (e.g. Rapido / Auto / City Mobility)
// ----------------------------------------------------------------------------

export class GenericProviderAdapter implements RideProviderAdapter {
  id: RideProviderId = 'rapido';
  name = 'Rapido Auto & Bike';

  getMetadata(): RideProviderInfo {
    return {
      id: 'rapido',
      name: 'Rapido Auto',
      logo: '🛵',
      tagline: 'Rapido Auto & Bike Taxi',
      description: 'Last-mile urban mobility and auto-rickshaw transit across Pune.',
      deepLinkSupported: false,
      supportedParameters: ['pickup_coords', 'dropoff_coords'],
      isConfigured: false,
      notice: 'Provider integration configured as web launcher entry point.',
      brandColor: '#F9D000',
      webUrl: 'https://www.rapido.bike',
      appScheme: 'rapido://'
    };
  }

  generateDeepLink(params: RideLinkParams): RideProviderRedirectResult {
    const pickupLat = params.pickupCoords[0];
    const pickupLng = params.pickupCoords[1];
    const destLat = params.destCoords[0];
    const destLng = params.destCoords[1];

    return {
      providerId: 'rapido',
      providerName: 'Rapido Auto',
      universalUrl: 'https://www.rapido.bike',
      deepLinkUrl: 'rapido://app',
      fallbackUrl: 'https://www.rapido.bike',
      parametersPassed: {
        pickupLat,
        pickupLng,
        pickupName: params.pickupName,
        destLat,
        destLng,
        destName: params.destName
      },
      instructions: 'Open the Rapido application to book an auto or bike taxi for your route.',
      disclaimer: 'Driver selection and driver verification are handled by the ride provider.'
    };
  }
}

// ----------------------------------------------------------------------------
// RIDE SHIELD SERVICE
// ----------------------------------------------------------------------------

const STORAGE_SESSION_KEY = 'surakshit_active_ride_session';
const STORAGE_DEMO_KEY = 'surakshit_ride_shield_demo_mode';

class RideShieldServiceManager {
  private adapters: Map<RideProviderId, RideProviderAdapter> = new Map();
  private isDemoMode: boolean = false;

  constructor() {
    this.registerAdapter(new UberAdapter());
    this.registerAdapter(new OlaAdapter());
    this.registerAdapter(new GenericProviderAdapter());

    if (typeof window !== 'undefined') {
      const storedDemo = localStorage.getItem(STORAGE_DEMO_KEY);
      this.isDemoMode = storedDemo === 'true';
    }
  }

  public registerAdapter(adapter: RideProviderAdapter) {
    this.adapters.set(adapter.id, adapter);
  }

  public getProviders(): RideProviderInfo[] {
    return Array.from(this.adapters.values()).map(a => a.getMetadata());
  }

  public getAdapter(providerId: RideProviderId): RideProviderAdapter | undefined {
    return this.adapters.get(providerId);
  }

  public isDemo(): boolean {
    return this.isDemoMode;
  }

  public setDemoMode(enabled: boolean) {
    this.isDemoMode = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_DEMO_KEY, enabled ? 'true' : 'false');
    }
  }

  public generateRedirect(providerId: RideProviderId, params: RideLinkParams): RideProviderRedirectResult {
    const adapter = this.adapters.get(providerId);
    if (!adapter) {
      throw new Error(`Unsupported ride provider: ${providerId}`);
    }
    return adapter.generateDeepLink(params);
  }

  public createSession(
    provider: RideProviderId,
    params: RideLinkParams,
    userId: string = 'guest_commuter'
  ): RideSession {
    const session: RideSession = {
      ride_id: `rs_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      route_id: params.routeId || 'route_safe',
      route_name: params.routeName || 'Safe Corridor',
      provider,
      pickup_lat: params.pickupCoords[0],
      pickup_lng: params.pickupCoords[1],
      destination_lat: params.destCoords[0],
      destination_lng: params.destCoords[1],
      pickup_name: params.pickupName || 'Current Location',
      destination_name: params.destName || 'Selected Destination',
      started_at: Date.now(),
      monitoring_enabled: false,
      status: 'initiated',
      safety_score: params.safetyScore
    };

    this.saveSession(session);
    this.syncSessionWithBackend(session).catch(() => {});
    return session;
  }

  public markProviderRedirected(rideId: string): RideSession | null {
    const session = this.getActiveSession();
    if (session && session.ride_id === rideId) {
      session.provider_redirected_at = Date.now();
      session.status = 'provider_redirected';
      this.saveSession(session);
      this.updateBackendSession(session).catch(() => {});
      return session;
    }
    return null;
  }

  public toggleMonitoring(rideId: string, enabled: boolean): RideSession | null {
    const session = this.getActiveSession();
    if (session && session.ride_id === rideId) {
      session.monitoring_enabled = enabled;
      if (enabled) {
        session.monitoring_started_at = session.monitoring_started_at || Date.now();
        session.status = 'monitoring_started';
      } else {
        session.status = 'provider_redirected';
      }
      this.saveSession(session);
      this.updateBackendSession(session).catch(() => {});
      return session;
    }
    return null;
  }

  public updateVehicleDetails(
    rideId: string,
    vehicleNumber: string,
    driverName?: string
  ): RideSession | null {
    const session = this.getActiveSession();
    if (session && session.ride_id === rideId) {
      session.vehicle_number = vehicleNumber.toUpperCase().trim();
      if (driverName) session.driver_name = driverName.trim();
      this.saveSession(session);
      return session;
    }
    return null;
  }

  public completeSession(rideId: string): RideSession | null {
    const session = this.getActiveSession();
    if (session && session.ride_id === rideId) {
      session.status = 'completed';
      this.saveSession(session);
      this.updateBackendSession(session).catch(() => {});
      return session;
    }
    return null;
  }

  public cancelSession(rideId: string): RideSession | null {
    const session = this.getActiveSession();
    if (session && session.ride_id === rideId) {
      session.status = 'cancelled';
      this.saveSession(session);
      this.updateBackendSession(session).catch(() => {});
      return session;
    }
    return null;
  }

  public getActiveSession(): RideSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!raw) return null;
      const parsed: RideSession = JSON.parse(raw);
      // Auto-expire sessions older than 8 hours
      if (Date.now() - parsed.started_at > 8 * 3600 * 1000) {
        localStorage.removeItem(STORAGE_SESSION_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  public clearActiveSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }

  private saveSession(session: RideSession) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    }
  }

  private async syncSessionWithBackend(session: RideSession): Promise<void> {
    try {
      await fetch('/api/ride/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });
    } catch {
      // Backend offline or local static mode fallback
    }
  }

  private async updateBackendSession(session: RideSession): Promise<void> {
    try {
      await fetch(`/api/ride/${session.ride_id}/monitoring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monitoring_enabled: session.monitoring_enabled,
          status: session.status
        })
      });
    } catch {
      // ignore
    }
  }
}

export const rideShieldService = new RideShieldServiceManager();
