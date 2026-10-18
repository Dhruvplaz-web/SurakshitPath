/**
 * SurakshitPath Native Mobile Watchdog & Sensor Bridge
 * Interfaces with Capacitor 6 Geolocation & Accelerometer APIs with fallback to Web APIs.
 */

import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Motion } from '@capacitor/motion';
import { TelematicsKalmanFilter } from '../engine/kalmanFilter';

export interface WatchdogPositionUpdate {
  coordinates: [number, number];
  accuracyMeters: number;
  speedKmh: number;
  headingDegrees: number | null;
  timestamp: number;
}

export interface ImpactAlert {
  magnitude: number;
  timestamp: number;
  type: 'sudden_impact' | 'violent_jerk' | 'prolonged_struggle';
}

class NativeWatchdogService {
  private isRunning: boolean = false;
  private watchId: string | number | null = null;
  private kalmanFilter: TelematicsKalmanFilter | null = null;
  private positionListeners: ((pos: WatchdogPositionUpdate) => void)[] = [];
  private impactListeners: ((alert: ImpactAlert) => void)[] = [];
  private lastAcceleration: { x: number; y: number; z: number } | null = null;
  private jerkCount: number = 0;
  private lastJerkTime: number = 0;

  /**
   * Check if running on Android or iOS native platform
   */
  public isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Request necessary hardware sensor and background location permissions
   */
  public async requestPermissions(): Promise<boolean> {
    if (this.isNative()) {
      try {
        const perm = await Geolocation.requestPermissions();
        return perm.location === 'granted';
      } catch (err) {
        console.warn('[NativeWatchdog] Capacitor permission request error:', err);
      }
    }
    return true;
  }

  /**
   * Start high-precision background telemetry and physical struggle detection
   */
  public async startWatchdog(
    onPosition: (pos: WatchdogPositionUpdate) => void,
    onImpact?: (alert: ImpactAlert) => void
  ): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    this.positionListeners.push(onPosition);
    if (onImpact) this.impactListeners.push(onImpact);

    await this.requestPermissions();

    // 1. Position tracking (Capacitor Native or HTML5 Geolocation)
    if (this.isNative()) {
      try {
        this.watchId = await Geolocation.watchPosition(
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 1000
          },
          (position: Position | null) => {
            if (position) {
              this.handleRawPosition(position.coords.latitude, position.coords.longitude, position.coords.accuracy, position.coords.speed, position.coords.heading);
            }
          }
        );
      } catch (err) {
        console.warn('[NativeWatchdog] Native watchPosition failed, falling back to Web API:', err);
        this.startWebGeolocationFallback();
      }
    } else {
      this.startWebGeolocationFallback();
    }

    // 2. Physical motion and struggle / sudden drop detection
    this.startMotionWatchdog();
  }

  /**
   * Web Geolocation fallback for standard browser environments
   */
  private startWebGeolocationFallback(): void {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          this.handleRawPosition(
            pos.coords.latitude,
            pos.coords.longitude,
            pos.coords.accuracy,
            pos.coords.speed,
            pos.coords.heading
          );
        },
        (err) => console.warn('[NativeWatchdog] Web Geolocation error:', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
      );
    }
  }

  /**
   * Kalman filter raw GPS observations and notify subscribers
   */
  private handleRawPosition(
    lat: number,
    lng: number,
    accuracy: number,
    speed: number | null,
    heading: number | null
  ): void {
    if (!this.kalmanFilter) {
      this.kalmanFilter = new TelematicsKalmanFilter([lat, lng]);
    }
    const result = this.kalmanFilter.update([lat, lng], accuracy);
    const speedKmh = speed !== null && speed >= 0 ? Math.round(speed * 3.6) : Math.round(result.speedKmh);

    const update: WatchdogPositionUpdate = {
      coordinates: result.smoothedCoords,
      accuracyMeters: Math.round(accuracy),
      speedKmh,
      headingDegrees: heading,
      timestamp: Date.now()
    };

    for (const listener of this.positionListeners) {
      listener(update);
    }
  }

  /**
   * Accelerometer struggle watchdog
   */
  private async startMotionWatchdog(): Promise<void> {
    if (this.isNative()) {
      try {
        await Motion.addListener('accel', (event) => {
          this.evaluateAcceleration(event.acceleration.x, event.acceleration.y, event.acceleration.z);
        });
      } catch (e) {
        console.warn('[NativeWatchdog] Motion sensor listener unavailable:', e);
      }
    } else if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', (e) => {
        if (e.acceleration) {
          this.evaluateAcceleration(e.acceleration.x || 0, e.acceleration.y || 0, e.acceleration.z || 0);
        }
      });
    }
  }

  /**
   * Analyze instantaneous jerk & struggle vectors
   */
  private evaluateAcceleration(x: number, y: number, z: number): void {
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const now = Date.now();

    // High Impact Threshold (e.g. phone thrown or violent physical attack > 26 m/s²)
    if (magnitude > 26) {
      this.dispatchImpact({
        magnitude,
        timestamp: now,
        type: 'sudden_impact'
      });
      return;
    }

    // Repeated struggle agitation detection (multiple jerks within 3 seconds)
    if (this.lastAcceleration) {
      const delta = Math.abs(magnitude - Math.sqrt(
        this.lastAcceleration.x ** 2 + this.lastAcceleration.y ** 2 + this.lastAcceleration.z ** 2
      ));
      if (delta > 14) {
        if (now - this.lastJerkTime < 3000) {
          this.jerkCount++;
          if (this.jerkCount >= 4) {
            this.dispatchImpact({
              magnitude,
              timestamp: now,
              type: 'prolonged_struggle'
            });
            this.jerkCount = 0;
          }
        } else {
          this.jerkCount = 1;
        }
        this.lastJerkTime = now;
      }
    }

    this.lastAcceleration = { x, y, z };
  }

  private dispatchImpact(alert: ImpactAlert): void {
    for (const listener of this.impactListeners) {
      listener(alert);
    }
  }

  /**
   * Stop watchdog and release sensor listeners
   */
  public async stopWatchdog(): Promise<void> {
    this.isRunning = false;
    if (this.watchId !== null) {
      if (this.isNative() && typeof this.watchId === 'string') {
        try {
          await Geolocation.clearWatch({ id: this.watchId });
        } catch {}
      } else if (typeof this.watchId === 'number' && typeof navigator !== 'undefined') {
        navigator.geolocation.clearWatch(this.watchId);
      }
      this.watchId = null;
    }

    if (this.isNative()) {
      try {
        await Motion.removeAllListeners();
      } catch {}
    }

    this.positionListeners = [];
    this.impactListeners = [];
  }
}

export const nativeWatchdog = new NativeWatchdogService();
