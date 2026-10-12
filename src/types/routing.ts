export type RoadClass = 
  | 'trunk'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'residential'
  | 'service'
  | 'alley';

export interface GraphNode {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  name: string;
  roadClass: RoadClass;
  lengthMeters: number;
  explicitLit?: boolean; // OSM lit=yes/no
  spilloverPoiCount: number; // 24/7 petrol pumps, pharmacies, ATMs within 30m
  activeNightPois: number; // operational pharmacies, transit, dhabas
  transitDistanceMeters: number; // distance to nearest PMPML/metro node
  emergencyDistanceMeters: number; // distance to nearest police station/hospital
  coordinates: [number, number][]; // path geometry [[lat, lng], ...]
}

export interface FactorBreakdown {
  lighting: number; // L_e in [0, 1]
  activity: number; // A_e in [0, 1]
  transit: number; // T_e in [0, 1]
  emergency: number; // E_e in [0, 1]
  incidentPenalty: number; // R_e in [0, 1]
  compositeScore: number; // S_e clamped [0, 100]
}

export interface SegmentDetail {
  edgeId: string;
  name: string;
  roadClass: RoadClass;
  lengthMeters: number;
  factors: FactorBreakdown;
  coordinates: [number, number][];
  illuminationSource: 'Direct OSM Tag' | 'Hierarchical Baseline & Spillover Proxy';
  keySafetyNotes: string[];
}

export interface RouteOption {
  id: string;
  name: string;
  tagline: string;
  routeType: 'fastest' | 'safe' | 'balanced';
  distanceMeters: number;
  durationMinutes: number;
  safetyScore: number; // 0-100
  betaUsed: number;
  factors: FactorBreakdown;
  coordinates: [number, number][];
  segments: SegmentDetail[];
  reasons: string[];
}

export type SafeHavenType = 'police' | 'pharmacy_247' | 'hospital' | 'transit_hub' | 'commercial_refuge';

export interface SafeHaven {
  id: string;
  name: string;
  type: SafeHavenType;
  coordinates: [number, number];
  address: string;
  timing: string;
  contact?: string;
  is24x7?: boolean;
  askForAngelaTrained?: boolean;
  hasPhoneCharger?: boolean;
  safeWaitingArea?: boolean;
  securityStaffOnDuty?: boolean;
  accreditationBadge?: string;
}

export type DynamicEventType = 'streetlight_outage' | 'crowd_alert' | 'road_closure';

export interface DynamicEvent {
  id: string;
  title: string;
  description: string;
  type: DynamicEventType;
  coordinates: [number, number];
  affectedEdgeIds: string[];
  severity: number; // 0.1 to 1.0
  timestamp: number;
  active: boolean;
}

export interface TelemetryState {
  currentPosition: [number, number];
  activeSegmentIndex: number;
  progressPercent: number; // 0 to 100
  speedKmh: number;
  crossTrackDistanceMeters: number;
  isDeviated: boolean;
  isStationary: boolean;
  dwellTimeSeconds: number;
}

export interface AnomalyCheckState {
  isOpen: boolean;
  reason: 'deviation' | 'stationary';
  countdownSeconds: number;
  sosDispatched: boolean;
  timestamp?: number;
}

export type UserRole = 'commuter' | 'admin' | 'guardian' | 'volunteer';

export type AppLanguage = 'en' | 'mr' | 'hi';

export interface CitizenReport {
  id: string;
  category: 'broken_lamp' | 'deserted_stretch' | 'harassment_crowd' | 'cctv_blindspot' | 'pothole_hazard';
  title: string;
  description: string;
  coordinates: [number, number];
  reportedAt: number;
  status: 'verified' | 'investigating' | 'resolved';
  upvotes: number;
  urgency: 'high' | 'medium' | 'low';
  landmarkName: string;
  photoUrl?: string;
}

export interface VolunteerAlert {
  id: string;
  commuterAlias: string;
  emergencyType: 'corridor_deviation' | 'prolonged_stall' | 'sos_panic';
  coordinates: [number, number];
  distanceMeters: number;
  reportedTime: number;
  status: 'active' | 'responding' | 'resolved';
  nearestLandmark: string;
  responderCount: number;
}

export interface DarkSpotRecord {
  edgeId: string;
  name: string;
  roadClass: RoadClass;
  lengthMeters: number;
  lightingFactor: number;
  nightTrafficVolume: 'High' | 'Medium' | 'Low';
  priorityScore: number; // 0-100
  ward: string;
  suggestedAction: string;
  coordinates: [number, number][];
}

export interface MunicipalTicket {
  id: string;
  title: string;
  category: 'broken_lamp' | 'dark_stretch' | 'vegetation_block' | 'power_trip';
  locationName: string;
  ward: string;
  reportedAt: string;
  status: 'pending' | 'in_progress' | 'resolved';
  upvotes: number;
  edgeId: string;
}

export interface GuardianSession {
  studentName: string;
  batteryPercent: number;
  signalStrength: '5G Excellent' | '4G Good' | 'Low Coverage';
  lastPingTime: string;
  activeRouteName: string;
  guardianPhone: string;
}

