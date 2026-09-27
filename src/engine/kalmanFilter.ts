/**
 * Extended Kalman Filter (EKF) for Smartphone GPS Smoothing in Urban Canyons.
 * 
 * Mitigates multipath reflections, tall building shadows, and accelerometer drift
 * along Pune's arterial corridors (e.g. NH-48 flyovers and Baner high-rises),
 * preventing false-positive deviation alarms.
 */

export class TelematicsKalmanFilter {
  // State: [lat, lng, v_lat, v_lng]
  private lat: number;
  private lng: number;
  private vLat: number = 0;
  private vLng: number = 0;

  // Estimation error covariance
  private pLat: number = 1.0;
  private pLng: number = 1.0;

  // Process noise (how quickly velocity can change)
  private readonly q: number = 0.000008;

  // Measurement noise (GPS accuracy in meters converted to deg sq)
  private readonly r: number = 0.000045;

  private lastTimestampMs: number;

  constructor(initialCoords: [number, number]) {
    this.lat = initialCoords[0];
    this.lng = initialCoords[1];
    this.lastTimestampMs = Date.now();
  }

  /**
   * Updates state with new raw GPS measurement
   */
  public update(
    rawCoords: [number, number],
    accuracyMeters: number = 12
  ): { smoothedCoords: [number, number]; speedKmh: number; isSmoothed: boolean } {
    const now = Date.now();
    const dt = Math.max(0.1, (now - this.lastTimestampMs) / 1000); // delta t in seconds
    this.lastTimestampMs = now;

    // 1. Time Update (Predict step)
    const predictedLat = this.lat + this.vLat * dt;
    const predictedLng = this.lng + this.vLng * dt;
    const predictedPLat = this.pLat + this.q * dt;
    const predictedPLng = this.pLng + this.q * dt;

    // Measurement noise dynamically scaled by GPS accuracy
    const measurementNoise = Math.max(this.r, (accuracyMeters / 111000) ** 2);

    // 2. Measurement Update (Correct step)
    const kalmanGainLat = predictedPLat / (predictedPLat + measurementNoise);
    const kalmanGainLng = predictedPLng / (predictedPLng + measurementNoise);

    const newLat = predictedLat + kalmanGainLat * (rawCoords[0] - predictedLat);
    const newLng = predictedLng + kalmanGainLng * (rawCoords[1] - predictedLng);

    // Update velocities
    this.vLat = (newLat - this.lat) / dt;
    this.vLng = (newLng - this.lng) / dt;

    // Update covariances
    this.pLat = (1 - kalmanGainLat) * predictedPLat;
    this.pLng = (1 - kalmanGainLng) * predictedPLng;

    this.lat = newLat;
    this.lng = newLng;

    // Speed in km/h from state velocities
    const vLatMps = this.vLat * 111000;
    const vLngMps = this.vLng * 105000;
    const speedMps = Math.sqrt(vLatMps * vLatMps + vLngMps * vLngMps);
    const speedKmh = Number((speedMps * 3.6).toFixed(1));

    return {
      smoothedCoords: [newLat, newLng],
      speedKmh: Math.min(60, speedKmh),
      isSmoothed: true
    };
  }

  public reset(coords: [number, number]) {
    this.lat = coords[0];
    this.lng = coords[1];
    this.vLat = 0;
    this.vLng = 0;
    this.pLat = 1.0;
    this.pLng = 1.0;
    this.lastTimestampMs = Date.now();
  }
}
