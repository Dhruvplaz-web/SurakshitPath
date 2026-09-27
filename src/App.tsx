import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { Header } from './components/Common/Header';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { RouteComparisonCard } from './components/Sidebar/RouteComparisonCard';
import { RideShieldCard } from './components/Sidebar/RideShieldCard';
import { SafetySlider } from './components/Sidebar/SafetySlider';
import { SegmentInspector } from './components/Sidebar/SegmentInspector';
import { LocationSearchBox } from './components/Sidebar/LocationSearchBox';
import { QuickSafeHavenButton } from './components/Sidebar/QuickSafeHavenButton';
import { SafeSheltersModal, FilterCategory } from './components/Sidebar/SafeSheltersModal';
import { NearestPoliceCard } from './components/Sidebar/NearestPoliceCard';
import { CivicAdminDashboard } from './components/Admin/CivicAdminDashboard';
import { INITIAL_CITIZEN_REPORTS } from './data/civicAdminData';
import { VolunteerCockpit } from './components/Volunteer/VolunteerCockpit';
import { ReportHazardModal } from './components/Community/ReportHazardModal';
import { RouteShareModal } from './components/Sidebar/RouteShareModal';
import { MapCockpit } from './components/Map/MapCockpit';
import { calculatePuneRoutes } from './engine/graphRouter';
import { calculateCrossTrackDistance, evaluateTelemetryAnomaly } from './engine/telemetryWatchdog';
import { TelematicsKalmanFilter } from './engine/kalmanFilter';
import { audioGuidance } from './services/audioGuidance';
import { offlineStore } from './services/offlineRoutingStore';
import { DynamicEvent, TelemetryState, AnomalyCheckState, RouteOption, SafeHaven, UserRole, CitizenReport, AppLanguage, TravelProfile } from './types/routing';
import { createDynamicEventFromReport } from './services/hazardService';
import { ZeroInstallGuardianView } from './components/Guardian/ZeroInstallGuardianView';
import { PUNE_LANDMARKS, PuneLocation, getUserCurrentLocation, reverseGeocode, watchUserLiveLocation } from './services/geocodingService';
import { fetchRealRoadGeometry, RoadCurvatureResult } from './services/roadCurvatureService';
import { PUNE_SAFE_HAVENS } from './data/safeHavens';
import { getKnownSafeHavensSync, fetchLiveSafeHavens } from './services/liveShelterService';
import { 
  fetchLiveRoadClosures, 
  detectClosureIntersections, 
  convertClosuresToDynamicEvents, 
  LiveRoadClosure, 
  PUNE_VERIFIED_ROADWORKS 
} from './services/liveClosureService';
import { WeatherRiskProfile, WEATHER_PROFILES } from './components/Commuter/NocturnalWeatherCard';
import { AlertCircle, ArrowRight, ChevronDown, Sliders, ListFilter, PanelLeftClose, PanelLeftOpen, ShieldCheck } from 'lucide-react';
import { PrivacyPolicyModal } from './components/Legal/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/Legal/TermsOfServiceModal';
import { CookiePolicyModal } from './components/Legal/CookiePolicyModal';
import { ConsentBanner } from './components/Legal/ConsentBanner';
import { AccessibilityStatementModal } from './components/Legal/AccessibilityStatementModal';
import { AboutUsModal } from './components/Pages/AboutUsModal';
import { ContactUsModal } from './components/Pages/ContactUsModal';
import { NotFoundView } from './components/Pages/NotFoundView';
import { Footer } from './components/Common/Footer';
import { AuthModal } from './components/Auth/AuthModal';
import { TrustedGuardianModal } from './components/Guardian/TrustedGuardianModal';
import { EmergencySosModal } from './components/Emergency/EmergencySosModal';
import { FloatingSosButton } from './components/Emergency/FloatingSosButton';
import { EmergencyAssistCard } from './components/Emergency/EmergencyAssistCard';
import { FakeCallModal } from './components/Emergency/FakeCallModal';
import { LocationShareModal } from './components/Emergency/LocationShareModal';
import { CabRideShieldModal } from './components/Commuter/CabRideShieldModal';
import { TripFeedbackModal } from './components/Commuter/TripFeedbackModal';
import { StreetViewModal, StreetViewData } from './components/Map/StreetViewModal';
import { getStreetViewDataForSegment } from './data/streetViewData';

export const App: React.FC = () => {
  // Read initial state from URL parameters (URL-First State Architecture with Boundary Validation)
  const initialParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const betaRaw = parseFloat(params.get('beta') || '0.8');
    const betaParam = isNaN(betaRaw) ? 0.8 : Math.max(0.0, Math.min(1.5, betaRaw));
    
    const rawRoute = params.get('route') || 'route_safe';
    const routeParam = ['route_safe', 'route_fastest', 'route_balanced'].includes(rawRoute) ? rawRoute : 'route_safe';
    
    const originParam = params.get('origin');
    const destParam = params.get('dest');
    
    const validRoles: UserRole[] = ['commuter', 'volunteer', 'admin'];
    const rawRole = params.get('role') as UserRole;
    const roleParam = validRoles.includes(rawRole) ? rawRole : 'commuter';

    const validProfiles: TravelProfile[] = ['pedestrian', 'two_wheeler', 'four_wheeler', 'transit'];
    const rawProfile = params.get('profile') as TravelProfile;
    const profileParam = validProfiles.includes(rawProfile) ? rawProfile : 'pedestrian';

    const validLangs: AppLanguage[] = ['en', 'mr', 'hi'];
    const rawLang = params.get('lang') as AppLanguage;
    const langParam = validLangs.includes(rawLang) ? rawLang : 'en';

    const rawTheme = params.get('theme') || localStorage.getItem('surakshit_theme') || 'dark';
    const themeParam: 'dark' | 'light' = rawTheme === 'light' ? 'light' : 'dark';

    const resolveLocation = (id: string | null, fallback: PuneLocation): PuneLocation => {
      if (!id) return fallback;
      if (id === 'gps' || id.startsWith('gps')) {
        return {
          id: 'gps_my_location',
          name: '📍 Your Current Location',
          subtitle: 'Live Device GPS Coordinates',
          coordinates: fallback.coordinates,
          category: 'landmark'
        };
      }
      if (id.startsWith('coord_') || id.startsWith('custom_') || id.startsWith('nom_')) {
        const clean = id.replace(/^(coord_|custom_|nom_)/, '');
        const parts = clean.split('_');
        if (parts.length >= 2) {
          const lat = parseFloat(parts[0]);
          const lng = parseFloat(parts[1]);
          if (!isNaN(lat) && !isNaN(lng)) {
            return {
              id,
              name: `📍 Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
              subtitle: `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
              coordinates: [lat, lng],
              category: 'landmark'
            };
          }
        }
      }
      if (id.includes(',')) {
        const [latStr, lngStr] = id.split(',');
        const lat = parseFloat(latStr.trim());
        const lng = parseFloat(lngStr.trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          return {
            id: `coord_${lat.toFixed(5)}_${lng.toFixed(5)}`,
            name: `📍 Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            subtitle: `Selected point: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            coordinates: [lat, lng],
            category: 'landmark'
          };
        }
      }
      const landmark = PUNE_LANDMARKS.find(l => l.id === id);
      if (landmark) return landmark;
      const haven = getKnownSafeHavensSync().find(h => h.id === id) || PUNE_SAFE_HAVENS.find(h => h.id === id);
      if (haven) {
        return {
          id: haven.id,
          name: haven.name,
          subtitle: `${haven.address} (${haven.timing})`,
          coordinates: haven.coordinates,
          category: 'landmark'
        };
      }
      return fallback;
    };

    // Default origin: User's live GPS location
    const defaultOrigin: PuneLocation = {
      id: 'gps_my_location',
      name: '📍 Your Current Location',
      subtitle: 'Live Device GPS (Detecting...)',
      coordinates: [18.5204, 73.8567],
      category: 'landmark'
    };

    // Default destination: FC Road, Shivajinagar
    const defaultDest: PuneLocation = {
      id: 'loc_fc_road',
      name: 'Fergusson College Road (FC Road)',
      subtitle: 'Deccan Gymkhana / Shivajinagar, Pune',
      coordinates: [18.5204, 73.8402],
      category: 'college'
    };

    const originLoc = originParam ? resolveLocation(originParam, defaultOrigin) : defaultOrigin;
    const destLoc = destParam ? resolveLocation(destParam, defaultDest) : defaultDest;

    const isTrackingParam = window.location.pathname.startsWith('/track') || params.get('mode') === 'track';
    const tripIdParam = params.get('trip') || (window.location.pathname.startsWith('/track/') ? window.location.pathname.replace('/track/', '') : 'tr_89f2a41d');

    return {
      beta: betaParam,
      route: routeParam,
      origin: originLoc,
      destination: destLoc,
      role: roleParam,
      profile: profileParam,
      lang: langParam,
      theme: themeParam,
      isTracking: isTrackingParam,
      tripId: tripIdParam
    };
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>(initialParams.theme);
  const [userRole, setUserRole] = useState<UserRole>(initialParams.role);
  const { user } = useAuth();

  // Instant synchronization: transition view whenever operational role is switched via AuthModal
  useEffect(() => {
    if (user?.role && user.role !== userRole) {
      setUserRole(user.role);
      const url = new URL(window.location.href);
      url.searchParams.set('role', user.role);
      window.history.replaceState({}, '', url.toString());
    }
  }, [user?.role, userRole]);
  const [travelProfile, setTravelProfile] = useState<TravelProfile>(initialParams.profile);
  const [isTrackingMode, setIsTrackingMode] = useState<boolean>(initialParams.isTracking);
  const [trackingTripId] = useState<string>(initialParams.tripId);
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>(initialParams.lang);
  const [origin, setOrigin] = useState<PuneLocation>(initialParams.origin);
  const [destination, setDestination] = useState<PuneLocation>(initialParams.destination);
  const [beta, setBeta] = useState<number>(initialParams.beta);
  const [activeRouteId, setActiveRouteId] = useState<string>(initialParams.route);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [isPickingOnMap, setIsPickingOnMap] = useState<'origin' | 'destination' | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isCabShieldOpen, setIsCabShieldOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isStreetViewOpen, setIsStreetViewOpen] = useState(false);
  const [streetViewData, setStreetViewData] = useState<StreetViewData | null>(null);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(INITIAL_CITIZEN_REPORTS);
  const [isSheltersModalOpen, setIsSheltersModalOpen] = useState(false);
  const [sheltersInitialCategory, setSheltersInitialCategory] = useState<FilterCategory>('all');

  // Real-time Nocturnal Weather Risk Simulation Profile (Idea 2)
  const [weatherProfile, setWeatherProfile] = useState<WeatherRiskProfile>(WEATHER_PROFILES.clear);

  // Closed-Loop Civic Resolution Notification Toast (Idea 3 - SDG 11)
  const [civicToast, setCivicToast] = useState<{
    title: string;
    detail: string;
    points: number;
    timestamp: number;
  } | null>(null);

  const handleOpenShelters = (category?: FilterCategory) => {
    if (category) {
      setSheltersInitialCategory(category);
    }
    setIsSheltersModalOpen(true);
  };

  // Legal & Core Page Modal States
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isCookiesOpen, setIsCookiesOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBetaOpen, setIsBetaOpen] = useState(false);
  const [isSegmentsOpen, setIsSegmentsOpen] = useState(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isShareLocationModalOpen, setIsShareLocationModalOpen] = useState(false);

  // Synchronize data-theme on root HTML and URL/LocalStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('surakshit_theme', theme);
    const url = new URL(window.location.href);
    url.searchParams.set('theme', theme);
    window.history.replaceState({}, '', url.toString());
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Custom 404 route detection
  useEffect(() => {
    const path = window.location.pathname;
    if (path !== '/' && path !== '/index.html' && path !== '' && !path.startsWith('/track')) {
      setIsNotFound(true);
    }
  }, []);

  // Preload Offline Vector Tiles and POIs into IndexedDB
  useEffect(() => {
    offlineStore.syncOfflinePack();
  }, []);

  // Warm up and refresh real-time live safe havens around current location
  useEffect(() => {
    fetchLiveSafeHavens(origin.coordinates);
  }, [origin.coordinates[0], origin.coordinates[1]]);

  // Real-time Road Construction & Closure State
  const [liveClosures, setLiveClosures] = useState<LiveRoadClosure[]>(PUNE_VERIFIED_ROADWORKS);

  // Ingest live road closures from Overpass API and map into dynamic edge penalties
  useEffect(() => {
    fetchLiveRoadClosures().then(closures => {
      setLiveClosures(closures);
      const closureEvents = convertClosuresToDynamicEvents(closures);
      setDynamicEvents(prev => {
        const existingIds = new Set(prev.map(e => e.id));
        const toAdd = closureEvents.filter(e => !existingIds.has(e.id));
        return [...prev, ...toAdd];
      });
    });
  }, []);

  // Dynamic simulation events
  const [dynamicEvents, setDynamicEvents] = useState<DynamicEvent[]>([
    {
      id: 'event_baner_blackout',
      title: 'Streetlight Grid Failure',
      description: 'Municipal transformer failure reported along Baner High Street stretch.',
      type: 'streetlight_outage',
      coordinates: [18.5550, 73.7925],
      affectedEdgeIds: ['edge_baner_phata_to_mid', 'edge_baner_mid_to_univ'],
      severity: 0.80,
      timestamp: Date.now() - 3600000,
      active: false
    },
    {
      id: 'event_sus_crowd',
      title: 'Verified Harassment Alert',
      description: 'Hostile group loitering reported near unlit underpass.',
      type: 'crowd_alert',
      coordinates: [18.5410, 73.7730],
      affectedEdgeIds: ['edge_service_to_sus_alley', 'edge_sus_alley_to_chandani'],
      severity: 0.85,
      timestamp: Date.now() - 7200000,
      active: false
    }
  ]);

  // Extended Kalman Filter for GPS Smoothing
  const kalmanFilterRef = useRef<TelematicsKalmanFilter>(new TelematicsKalmanFilter(origin.coordinates));

  // Reset Kalman Filter on origin change
  useEffect(() => {
    kalmanFilterRef.current.reset(origin.coordinates);
  }, [origin.coordinates]);

  // Audio Guidance toggle handler
  const handleToggleAudio = () => {
    setIsAudioMuted(prev => {
      const next = !prev;
      audioGuidance.setEnabled(!next);
      return next;
    });
  };

  // Auto-acquire user's live GPS location on startup if origin was not explicitly fixed in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOrigin = params.get('origin');
    if (!urlOrigin || urlOrigin === 'gps' || urlOrigin === 'gps_my_location') {
      getUserCurrentLocation()
        .then(loc => {
          setOrigin(loc);
        })
        .catch(err => {
          console.log('GPS waiting for user trigger/permission:', err);
          setOrigin(prev => ({
            ...prev,
            subtitle: 'Tap GPS button or search place/coordinates'
          }));
        });
    }
  }, []);

  // Sync state back to URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('role', userRole);
    params.set('lang', currentLanguage);
    params.set('beta', beta.toFixed(2));
    params.set('route', activeRouteId);
    params.set('profile', travelProfile);
    params.set('origin', origin.id);
    params.set('dest', destination.id);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [userRole, currentLanguage, beta, activeRouteId, origin, destination, travelProfile]);

  // Dynamic Real Road Curvature State
  const [curvedGeometry, setCurvedGeometry] = useState<{
    safe?: RoadCurvatureResult;
    fastest?: RoadCurvatureResult;
    balanced?: RoadCurvatureResult;
  }>({});

  // Asynchronously fetch real road network geometry with turns and curves for ANY origin & destination coordinates
  useEffect(() => {
    let isCancelled = false;

    async function loadRoadCurvature() {
      try {
        const [safeRes, fastestRes, balancedRes] = await Promise.all([
          fetchRealRoadGeometry(origin.coordinates, destination.coordinates, travelProfile, 'safe'),
          fetchRealRoadGeometry(origin.coordinates, destination.coordinates, travelProfile, 'fastest'),
          fetchRealRoadGeometry(origin.coordinates, destination.coordinates, travelProfile, 'balanced')
        ]);

        if (!isCancelled) {
          setCurvedGeometry({
            safe: safeRes,
            fastest: fastestRes,
            balanced: balancedRes
          });
        }
      } catch (err) {
        console.warn('Real road curvature loading fallback:', err);
      }
    }

    loadRoadCurvature();

    return () => {
      isCancelled = true;
    };
  }, [origin.coordinates, destination.coordinates, travelProfile]);

  // Calculate Pune routes on demand for selected origin and destination, augmented with real curved geometry
  const routes = useMemo(() => {
    const base = calculatePuneRoutes(beta, dynamicEvents, origin.coordinates, destination.coordinates, travelProfile);

    if (curvedGeometry.safe && curvedGeometry.safe.coordinates.length > 2) {
      base.safe.coordinates = curvedGeometry.safe.coordinates;
      base.safe.distanceMeters = curvedGeometry.safe.distanceMeters;
      base.safe.durationMinutes = curvedGeometry.safe.durationMinutes;
      base.safe.maneuvers = curvedGeometry.safe.maneuvers;
      base.safe.isRecommendedNightRoute = curvedGeometry.safe.isRecommendedNightRoute;
      if (curvedGeometry.safe.safetyScore !== undefined) base.safe.safetyScore = curvedGeometry.safe.safetyScore;
      if (curvedGeometry.safe.factors) base.safe.factors = curvedGeometry.safe.factors;
      if (curvedGeometry.safe.segments && curvedGeometry.safe.segments.length > 0) base.safe.segments = curvedGeometry.safe.segments;
    }

    if (curvedGeometry.fastest && curvedGeometry.fastest.coordinates.length > 2) {
      base.fastest.coordinates = curvedGeometry.fastest.coordinates;
      base.fastest.distanceMeters = curvedGeometry.fastest.distanceMeters;
      base.fastest.durationMinutes = curvedGeometry.fastest.durationMinutes;
      base.fastest.maneuvers = curvedGeometry.fastest.maneuvers;
      base.fastest.isRecommendedNightRoute = curvedGeometry.fastest.isRecommendedNightRoute;
      base.fastest.warningNotice = curvedGeometry.fastest.warningNotice;
      if (curvedGeometry.fastest.safetyScore !== undefined) base.fastest.safetyScore = curvedGeometry.fastest.safetyScore;
      if (curvedGeometry.fastest.factors) base.fastest.factors = curvedGeometry.fastest.factors;
      if (curvedGeometry.fastest.segments && curvedGeometry.fastest.segments.length > 0) base.fastest.segments = curvedGeometry.fastest.segments;
    }

    if (curvedGeometry.balanced && curvedGeometry.balanced.coordinates.length > 2) {
      base.balanced.coordinates = curvedGeometry.balanced.coordinates;
      base.balanced.distanceMeters = curvedGeometry.balanced.distanceMeters;
      base.balanced.durationMinutes = curvedGeometry.balanced.durationMinutes;
      base.balanced.maneuvers = curvedGeometry.balanced.maneuvers;
      base.balanced.isRecommendedNightRoute = curvedGeometry.balanced.isRecommendedNightRoute;
      if (curvedGeometry.balanced.safetyScore !== undefined) base.balanced.safetyScore = curvedGeometry.balanced.safetyScore;
      if (curvedGeometry.balanced.factors) base.balanced.factors = curvedGeometry.balanced.factors;
      if (curvedGeometry.balanced.segments && curvedGeometry.balanced.segments.length > 0) base.balanced.segments = curvedGeometry.balanced.segments;
    }

    // IDEA 2: Weather & Monsoon Night Risk Multiplier
    if (weatherProfile && weatherProfile.mode !== 'clear') {
      const { lightingMultiplier, scorePenalty } = weatherProfile;
      base.safe.safetyScore = Math.max(25, base.safe.safetyScore - scorePenalty);
      if (base.safe.factors) {
        base.safe.factors.lighting = Number((base.safe.factors.lighting * lightingMultiplier).toFixed(2));
      }

      base.fastest.safetyScore = Math.max(10, base.fastest.safetyScore - Math.round(scorePenalty * 1.4));
      if (base.fastest.factors) {
        base.fastest.factors.lighting = Number((base.fastest.factors.lighting * lightingMultiplier).toFixed(2));
      }

      base.balanced.safetyScore = Math.max(20, base.balanced.safetyScore - scorePenalty);
      if (base.balanced.factors) {
        base.balanced.factors.lighting = Number((base.balanced.factors.lighting * lightingMultiplier).toFixed(2));
      }
    }

    return base;
  }, [beta, dynamicEvents, origin.coordinates, destination.coordinates, travelProfile, curvedGeometry, weatherProfile]);

  // Active Route
  const activeRoute: RouteOption = useMemo(() => {
    if (activeRouteId === 'route_fastest') return routes.fastest;
    if (activeRouteId === 'route_balanced') return routes.balanced;
    return routes.safe;
  }, [activeRouteId, routes]);

  // Alternative Routes
  const alternativeRoutes = useMemo(() => {
    const all = [routes.safe, routes.fastest, routes.balanced];
    return all.filter(r => r.id !== activeRoute.id);
  }, [routes, activeRoute.id]);

  // Set default selected edge when active route changes
  useEffect(() => {
    if (activeRoute.segments.length > 0) {
      setSelectedEdgeId(activeRoute.segments[0].edgeId);
    }
  }, [activeRoute]);

  const handleOpenStreetView = useCallback((edgeId: string) => {
    const seg = activeRoute.segments.find(s => s.edgeId === edgeId);
    const data = getStreetViewDataForSegment(
      edgeId,
      seg?.name,
      seg?.coordinates,
      seg?.factors.lighting
    );
    setStreetViewData(data);
    setIsStreetViewOpen(true);
  }, [activeRoute.segments]);

  // Telemetry & Commuter Simulation / Live GPS State
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLiveGpsActive, setIsLiveGpsActive] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    currentPosition: origin.coordinates,
    activeSegmentIndex: 0,
    progressPercent: 0,
    speedKmh: 0,
    crossTrackDistanceMeters: 0,
    isDeviated: false,
    isStationary: false,
    dwellTimeSeconds: 0
  });

  // Real-time Active Commuter Coordinates:
  // When simulating or live GPS is tracking, uses live telemetry position; otherwise dynamically locks to origin coordinates
  const activeUserCoordinates: [number, number] = useMemo(() => {
    if (isSimulating || isLiveGpsActive) {
      return telemetry.currentPosition;
    }
    return origin.coordinates;
  }, [isSimulating, isLiveGpsActive, telemetry.currentPosition, origin.coordinates]);

  // Synchronize telemetry position whenever origin location updates
  useEffect(() => {
    if (!isSimulating && !isLiveGpsActive) {
      setTelemetry(prev => ({
        ...prev,
        currentPosition: origin.coordinates
      }));
    }
  }, [origin.coordinates[0], origin.coordinates[1], isSimulating, isLiveGpsActive]);

  const [anomalyState, setAnomalyState] = useState<AnomalyCheckState>({
    isOpen: false,
    reason: 'deviation',
    countdownSeconds: 15,
    sosDispatched: false
  });

  const animationStepRef = useRef<number>(0);
  const simulationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Anomaly Evaluator with Proactive Audio Cue (15s Check-in Countdown)
  const triggerAnomalyCheck = useCallback((reason: 'deviation' | 'stationary') => {
    setIsSimulating(false);
    setAnomalyState({
      isOpen: true,
      reason,
      countdownSeconds: 15,
      sosDispatched: false,
      timestamp: Date.now()
    });

    audioGuidance.speakSafetyCue(
      reason === 'deviation'
        ? 'Warning: Cross-track corridor deviation detected over 50 meters. Initiating 15-second safety check-in.'
        : 'Alert: Prolonged stationary dwell detected. Are you safe? Initiating 15-second safety check-in.',
      true
    );
  }, []);

  // Real-Time Live GPS Corridor Watchdog (Continuous Hardware GPS Streaming)
  useEffect(() => {
    if (!isLiveGpsActive) return;

    audioGuidance.speakSafetyCue(
      `Live corridor watchdog active. 50-meter safety geofence armed along ${activeRoute.name.split('·')[0].trim()}.`
    );

    const stopWatch = watchUserLiveLocation(
      (rawCoords, accuracy) => {
        // Extended Kalman Filter smoothing against multi-path and street canyon reflections
        const kalmanResult = kalmanFilterRef.current.update(rawCoords, accuracy);
        const smoothedPos = kalmanResult.smoothedCoords;
        const crossTrack = calculateCrossTrackDistance(smoothedPos, activeRoute);
        const speedKmh = kalmanResult.speedKmh > 0 ? kalmanResult.speedKmh : 0;
        const isStationary = speedKmh < 1.0;

        setTelemetry(prev => {
          const newDwell = isStationary ? prev.dwellTimeSeconds + 2 : 0;
          return {
            ...prev,
            currentPosition: smoothedPos,
            speedKmh,
            crossTrackDistanceMeters: crossTrack,
            isDeviated: crossTrack > 50,
            isStationary,
            dwellTimeSeconds: newDwell
          };
        });

        // Instant Anomaly Trigger: straying > 50m off route corridor
        if (crossTrack > 50 && !anomalyState.isOpen) {
          triggerAnomalyCheck('deviation');
        }
      },
      (err) => {
        console.warn('[Watchdog] Geolocation error:', err.message);
      }
    );

    return () => {
      stopWatch();
    };
  }, [isLiveGpsActive, activeRoute, anomalyState.isOpen, triggerAnomalyCheck]);

  // Stationary Dwell Anomaly Watchdog: 180s (3 minutes) in isolated/unlit segment
  useEffect(() => {
    if (!isLiveGpsActive || anomalyState.isOpen) return;
    if (telemetry.isStationary && telemetry.dwellTimeSeconds >= 180) {
      triggerAnomalyCheck('stationary');
    }
  }, [isLiveGpsActive, telemetry.isStationary, telemetry.dwellTimeSeconds, anomalyState.isOpen, triggerAnomalyCheck]);

  // Commuter Animation Loop with Extended Kalman Filter GPS Smoothing (for Simulation Mode)
  useEffect(() => {
    if (!isSimulating || anomalyState.isOpen) {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      return;
    }

    const coords = activeRoute.coordinates;
    if (coords.length < 2) return;

    simulationTimerRef.current = setInterval(() => {
      animationStepRef.current += 1;
      const totalSteps = coords.length * 6;
      const stepFraction = (animationStepRef.current % totalSteps) / totalSteps;
      const coordIndex = Math.min(
        coords.length - 1,
        Math.floor(stepFraction * (coords.length - 1))
      );

      const rawPos = coords[coordIndex];
      // Extended Kalman Filter smoothing against multipath reflections & canyon noise
      const kalmanResult = kalmanFilterRef.current.update(rawPos, 8);
      const smoothedPos = kalmanResult.smoothedCoords;
      const crossTrack = calculateCrossTrackDistance(smoothedPos, activeRoute);

      setTelemetry(prev => ({
        ...prev,
        currentPosition: smoothedPos,
        activeSegmentIndex: coordIndex,
        progressPercent: Math.round(stepFraction * 100),
        speedKmh: kalmanResult.speedKmh > 5 ? kalmanResult.speedKmh : 28.5 + (Math.sin(stepFraction * 10) * 4),
        crossTrackDistanceMeters: crossTrack,
        isStationary: false,
        dwellTimeSeconds: 0
      }));
    }, 1200);

    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, [isSimulating, anomalyState.isOpen, activeRoute]);

  useEffect(() => {
    const { hasAnomaly, reason } = evaluateTelemetryAnomaly(telemetry, isSimulating);
    if (hasAnomaly && reason && !anomalyState.isOpen && (isSimulating || isLiveGpsActive)) {
      triggerAnomalyCheck(reason);
    }
  }, [telemetry, anomalyState.isOpen, isSimulating, isLiveGpsActive, triggerAnomalyCheck]);

  // Location Handlers
  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleMapPickLocation = async (target: 'origin' | 'destination', coords: [number, number]) => {
    const coordId = `coord_${coords[0].toFixed(5)}_${coords[1].toFixed(5)}`;
    const customLocation: PuneLocation = {
      id: coordId,
      name: `📍 Location (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`,
      subtitle: `${coords[0].toFixed(5)}°N, ${coords[1].toFixed(5)}°E`,
      coordinates: coords,
      category: 'landmark'
    };

    if (target === 'origin') {
      setOrigin(customLocation);
    } else {
      setDestination(customLocation);
    }
    setIsPickingOnMap(null);

    // Asynchronously resolve street/neighborhood name
    try {
      const enriched = await reverseGeocode(coords);
      enriched.id = coordId;
      if (target === 'origin') setOrigin(enriched);
      else setDestination(enriched);
    } catch {
      // keep coordinates
    }
  };

  const handleLockSafeHaven = (haven: SafeHaven) => {
    const havenLocation: PuneLocation = {
      id: haven.id,
      name: haven.name,
      subtitle: `${haven.address} (${haven.timing})`,
      coordinates: haven.coordinates,
      category: 'landmark'
    };

    setDestination(havenLocation);
    setBeta(1.2); // Set maximum safe corridor impedance
    setActiveRouteId('route_safe');

    audioGuidance.speakSafetyCue(
      `Emergency safe haven locked: ${haven.name}. Calculating highest visibility corridor.`,
      true
    );
  };

  const handleRerouteToPolice = (station: SafeHaven) => {
    const policeLocation: PuneLocation = {
      id: station.id,
      name: `🚨 ${station.name}`,
      subtitle: `${station.address} · 24/7 Police Outpost`,
      coordinates: station.coordinates,
      category: 'landmark'
    };

    setDestination(policeLocation);
    setBeta(1.5); // Highest priority safe routing
    setActiveRouteId('route_safe');

    audioGuidance.speakSafetyCue(
      `Emergency police station route engaged to ${station.name}. Prioritizing fully illuminated arterials with direct police beat coverage.`,
      true
    );
  };

  // Check if a real-time event is currently degrading the active route
  const handleNewCitizenReport = (report: CitizenReport) => {
    setCitizenReports(prev => [report, ...prev]);
    const injectedEvent = createDynamicEventFromReport(report);
    setDynamicEvents(prev => [injectedEvent, ...prev]);
    audioGuidance.speakSafetyCue(`New citizen audit report registered: ${report.title}. Dynamic roadway penalty applied.`);
  };

  // Check if a real-time event is currently degrading the active route
  const activeDegradingEvent = dynamicEvents.find(
    e => e.active && activeRoute.segments.some(seg => e.affectedEdgeIds.includes(seg.edgeId))
  );

  // Check if active route intersects any live road closures or active WIP construction zones
  const activeRouteClosures = useMemo(() => {
    return detectClosureIntersections(activeRoute.coordinates, liveClosures);
  }, [activeRoute.coordinates, liveClosures]);

  if (isNotFound) {
    return (
      <div className="app-container">
        <Header
          currentRole={userRole}
          onSelectRole={setUserRole}
          isAudioMuted={isAudioMuted}
          onToggleAudio={handleToggleAudio}
          currentLanguage={currentLanguage}
          onSelectLanguage={setCurrentLanguage}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenSos={() => setIsSosOpen(true)}
          onOpenCabShield={() => setIsCabShieldOpen(true)}
          onOpenShelters={handleOpenShelters}
          onLockSafeHaven={handleLockSafeHaven}
          currentCoordinates={telemetry.currentPosition}
          userCoordinates={telemetry.currentPosition}
          onSelectDestination={setDestination}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
        <NotFoundView
          onReturnHome={() => {
            window.history.pushState({}, '', '/');
            setIsNotFound(false);
          }}
        />
        <Footer
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          onOpenCookies={() => setIsCookiesOpen(true)}
          onOpenA11y={() => setIsA11yOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          originName={origin.name}
          destinationName={destination.name}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header
        currentRole={userRole}
        onSelectRole={setUserRole}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenCabShield={() => setIsCabShieldOpen(true)}
        onOpenShelters={handleOpenShelters}
        onLockSafeHaven={handleLockSafeHaven}
        currentCoordinates={activeUserCoordinates}
        userCoordinates={activeUserCoordinates}
        onSelectDestination={setDestination}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeWeatherMode={weatherProfile.mode}
        onWeatherModeChange={(_, profile) => setWeatherProfile(profile)}
      />

      {/* IDEA 3: Closed-Loop Civic Resolution Floating Toast (SDG 11) */}
      {civicToast && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          borderRadius: '12px',
          padding: '10px 18px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '560px',
          animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--safe-emerald, #34d399)',
            flexShrink: 0
          }}>
            <ShieldCheck size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{civicToast.title}</span>
              <span style={{
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                color: 'var(--safe-emerald)',
                fontWeight: 800
              }}>
                +{civicToast.points} PTS CONFIDENCE
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
              {civicToast.detail}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCivicToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              fontSize: '14px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      <main className={`workspace-grid ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Left Sidebar Drawer */}
        <aside className="sidebar-panel">
          {/* Mobile Bottom Sheet Grabber & Minimize Bar */}
          <div
            className="mobile-sheet-drag-handle-bar"
            onClick={() => setIsSidebarCollapsed(true)}
            role="button"
            tabIndex={0}
            title="Minimize route panel to view full map"
            aria-label="Minimize route panel to view full map"
          >
            <div className="mobile-sheet-drag-pill" />
            <div className="mobile-sheet-drag-label">
              <span>Tap to minimize to full map</span>
            </div>
          </div>
          {userRole === 'admin' && (
            <section className="sidebar-section">
              <ErrorBoundary fallbackTitle="Admin Dashboard Error">
                <CivicAdminDashboard
                  onHighlightEdge={setSelectedEdgeId}
                  citizenReports={citizenReports}
                  onUpdateCitizenReport={(reportId, newStatus) => {
                    const rep = citizenReports.find(r => r.id === reportId);
                    setCitizenReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));

                    if (newStatus === 'investigating') {
                      setCivicToast({
                        title: '🚧 Municipal Dispatch Order Initiated (SDG 11)',
                        detail: `PMC Work Order dispatched to ${rep?.landmarkName || 'reported location'}. Repair crew mobilized.`,
                        points: 4,
                        timestamp: Date.now()
                      });
                      audioGuidance.speakSafetyCue('Municipal repair crew mobilized for citizen report.');
                    } else if (newStatus === 'resolved') {
                      setCivicToast({
                        title: '🎉 Closed-Loop Civic Resolution (SDG 11)',
                        detail: `Municipal electrical team repaired lighting at ${rep?.landmarkName || 'reported dark spot'}. Arterial illumination restored (+10 pts Safety Confidence)!`,
                        points: 10,
                        timestamp: Date.now()
                      });
                      audioGuidance.speakSafetyCue('Civic resolution complete. Lighting restored along corridor.');
                      setDynamicEvents(prev => prev.filter(e => !e.title.toLowerCase().includes('blackout')));
                    }
                    setTimeout(() => setCivicToast(null), 7000);
                  }}
                />
              </ErrorBoundary>
            </section>
          )}

          {userRole === 'volunteer' && (
            <section className="sidebar-section">
              <ErrorBoundary fallbackTitle="Volunteer Cockpit Error">
                <VolunteerCockpit />
              </ErrorBoundary>
            </section>
          )}

          {userRole === 'commuter' && (
            <>
              {/* Section: Origin & Destination Geocoding Search (Sticky Header) */}
              <section className="sidebar-section sidebar-sticky-header">
                <ErrorBoundary fallbackTitle="Search Error">
                  <LocationSearchBox
                    origin={origin}
                    destination={destination}
                    onSelectOrigin={setOrigin}
                    onSelectDestination={setDestination}
                    onSwapLocations={handleSwapLocations}
                    onPickOnMap={setIsPickingOnMap}
                    isPickingOnMap={isPickingOnMap}
                    travelProfile={travelProfile}
                    onSelectTravelProfile={setTravelProfile}
                    currentLanguage={currentLanguage}
                  />
                </ErrorBoundary>
              </section>

              {/* Live Road Closure / WIP Detour Alert Banner */}
              {activeRouteClosures.length > 0 && (
                <div style={{ padding: '12px 24px 0' }}>
                  <div style={{
                    backgroundColor: 'rgba(234, 88, 12, 0.15)',
                    border: '1px solid rgba(234, 88, 12, 0.45)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#ffedd5',
                    boxShadow: '0 2px 10px rgba(234, 88, 12, 0.2)'
                  }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>🚧</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#fb923c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        WIP Construction: {activeRouteClosures[0].name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#fed7aa', marginTop: '2px', lineHeight: 1.3 }}>
                        {activeRouteClosures[0].reason}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveRouteId('route_safe');
                        setBeta(1.6);
                        audioGuidance.speakSafetyCue(
                          `Roadwork detected on ${activeRouteClosures[0].name}. Rerouting via illuminated arterial bypass.`,
                          true
                        );
                      }}
                      className="btn-civic"
                      style={{
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: '#ea580c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Detour around active roadwork and construction"
                    >
                      <span>Safe Detour</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Event Reroute Alert Banner */}
              {activeDegradingEvent && (
                <div style={{ padding: '12px 24px 0' }}>
                  <div className="event-alert-banner">
                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <strong>Hazard on Active Route:</strong> {activeDegradingEvent.title}
                      <div style={{ fontSize: '11px', marginTop: '2px' }}>
                        Segment degraded. A safer detour is recommended.
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveRouteId('route_balanced')}
                      className="btn-civic"
                      style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#fff', color: '#111' }}
                    >
                      Reroute <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              )}

              {/* Section 1: Route Alternatives */}
              <section className="sidebar-section">
                <div className="section-label">
                  <span>Candidate Routes Comparison</span>
                </div>
                <ErrorBoundary fallbackTitle="Route Comparison Error">
                  <RouteComparisonCard
                    routes={routes}
                    activeRouteId={activeRouteId}
                    onSelectRoute={(id) => {
                      setActiveRouteId(id);
                      const selRoute = id === 'route_fastest' ? routes.fastest : id === 'route_balanced' ? routes.balanced : routes.safe;
                      audioGuidance.speakSafetyCue(`Switched to ${selRoute.name}. Safety score: ${selRoute.safetyScore} out of 100.`);
                    }}
                    onOpenShelters={() => setIsSheltersModalOpen(true)}
                    onOpenRideShield={() => setIsCabShieldOpen(true)}
                    currentLanguage={currentLanguage}
                  />
                </ErrorBoundary>
              </section>

              {/* Ride Shield Card — Safety-aware cab journey assistant */}
              <section className="sidebar-section">
                <ErrorBoundary fallbackTitle="Ride Shield Error">
                  <RideShieldCard
                    activeRoute={activeRoute}
                    origin={origin}
                    destination={destination}
                    onOpenRideShield={() => setIsCabShieldOpen(true)}
                    currentLanguage={currentLanguage}
                  />
                </ErrorBoundary>
              </section>

              {/* Section 2: Quick Action Police Station & Safe Haven Lock */}
              <section className="sidebar-section" style={{ paddingTop: '4px', paddingBottom: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <ErrorBoundary fallbackTitle="Emergency Assist Error">
                  <EmergencyAssistCard
                    onTriggerFakeCall={() => setIsFakeCallOpen(true)}
                    onOpenShareLocationModal={() => setIsShareLocationModalOpen(true)}
                  />
                </ErrorBoundary>

                <ErrorBoundary fallbackTitle="Police Station Card Error">
                  <NearestPoliceCard
                    currentCoordinates={activeUserCoordinates}
                    onRerouteToPolice={handleRerouteToPolice}
                    currentLanguage={currentLanguage}
                  />
                </ErrorBoundary>
                <ErrorBoundary fallbackTitle="Safe Haven Error">
                  <QuickSafeHavenButton
                    currentCoordinates={activeUserCoordinates}
                    activeRoute={activeRoute}
                    onLockSafeHaven={handleLockSafeHaven}
                    onOpenSheltersModal={() => setIsSheltersModalOpen(true)}
                    currentLanguage={currentLanguage}
                  />
                </ErrorBoundary>
              </section>

              {/* Section 3: Collapsible Safety Preference (Everyday Mode) */}
              <section className="sidebar-section" style={{ padding: '8px 24px 12px' }}>
                <button
                  type="button"
                  className="accordion-toggle-btn"
                  onClick={() => setIsBetaOpen(!isBetaOpen)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={14} color="var(--accent-amber)" />
                    <span style={{ fontWeight: 700, fontSize: '12px' }}>Route Safety Priority</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="brand-badge" style={{ fontSize: '10px', textTransform: 'none' }}>
                      {beta >= 1.0 ? '🛡️ Max Safe' : beta >= 0.6 ? '✨ High Safe' : beta >= 0.2 ? '⚖️ Balanced' : '⚡ Fastest'}
                    </span>
                    <ChevronDown size={14} style={{ transform: isBetaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }} />
                  </div>
                </button>

                {isBetaOpen && (
                  <div className="accordion-body">
                    <ErrorBoundary fallbackTitle="Slider Error">
                      <SafetySlider beta={beta} onBetaChange={setBeta} currentLanguage={currentLanguage} />
                    </ErrorBoundary>
                  </div>
                )}
              </section>

              {/* Section 4: Collapsible Micro-Segment Inspector */}
              <section className="sidebar-section" style={{ padding: '8px 24px 16px' }}>
                <button
                  type="button"
                  className="accordion-toggle-btn"
                  onClick={() => setIsSegmentsOpen(!isSegmentsOpen)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ListFilter size={14} color="var(--safe-emerald)" />
                    <span style={{ fontWeight: 600, fontSize: '12px' }}>Turn-by-Turn Segment Audit</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="brand-badge" style={{ fontSize: '10px' }}>{activeRoute.segments.length} Edges</span>
                    <ChevronDown size={14} style={{ transform: isSegmentsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }} />
                  </div>
                </button>

                {isSegmentsOpen && (
                  <div className="accordion-body">
                    <ErrorBoundary fallbackTitle="Segment Inspector Error">
                      <SegmentInspector
                        segments={activeRoute.segments}
                        selectedEdgeId={selectedEdgeId}
                        onSelectSegment={setSelectedEdgeId}
                        onOpenStreetView={handleOpenStreetView}
                        currentLanguage={currentLanguage}
                      />
                    </ErrorBoundary>
                  </div>
                )}
              </section>
            </>
          )}
        </aside>

        {/* Right Map Viewport */}
        <section style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Floating Sidebar Dock Toggle (Full-Screen Map Freedom) */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="map-sidebar-dock-toggle"
            title={isSidebarCollapsed ? "Expand Navigation & Routes Sidebar" : "Hide Sidebar for Full-Screen Map Freedom"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={14} color="var(--accent-amber)" /> : <PanelLeftClose size={14} />}
            <span>{isSidebarCollapsed ? "Show Routes" : "Full Map"}</span>
          </button>


          <ErrorBoundary fallbackTitle="Map Cockpit Error">
            <MapCockpit
              userRole={userRole}
              origin={origin}
              destination={destination}
              activeRoute={activeRoute}
              alternativeRoutes={alternativeRoutes}
              activeEvents={dynamicEvents}
              telemetry={telemetry}
              selectedEdgeId={selectedEdgeId}
              onSelectSegment={setSelectedEdgeId}
              isPickingOnMap={isPickingOnMap}
              onMapPickLocation={handleMapPickLocation}
              citizenReports={citizenReports}
              theme={theme}
              travelProfile={travelProfile}
              isSimulating={isSimulating}
              onToggleSimulation={() => setIsSimulating(!isSimulating)}
              isLiveNavigating={isLiveGpsActive}
              onToggleLiveNavigation={setIsLiveGpsActive}
              onLockSafeHaven={handleLockSafeHaven}
              currentLanguage={currentLanguage}
            />
          </ErrorBoundary>
        </section>
      </main>

      {/* Community Citizen Incident Reporting Modal */}
      <ReportHazardModal
        isOpen={isReportModalOpen}
        currentCoordinates={telemetry.currentPosition}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleNewCitizenReport}
        onTriggerSos={() => setIsSosOpen(true)}
      />

      {/* Share Safe Route Pass Modal */}
      <RouteShareModal
        isOpen={isShareModalOpen}
        activeRoute={activeRoute}
        origin={origin}
        destination={destination}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Zero-Install Guardian Live Tracking Interface */}
      {isTrackingMode && (
        <ZeroInstallGuardianView
          tripId={trackingTripId}
          activeRoute={activeRoute}
          telemetry={telemetry}
          onExitTracking={() => {
            setIsTrackingMode(false);
            const url = new URL(window.location.href);
            url.searchParams.delete('mode');
            url.searchParams.delete('trip');
            window.history.pushState({}, '', url.pathname.startsWith('/track') ? '/' : url.toString());
          }}
        />
      )}

      {/* Docked Civic Footer with Legal & A11y Links */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenCookies={() => setIsCookiesOpen(true)}
        onOpenA11y={() => setIsA11yOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        originName={origin.name}
        destinationName={destination.name}
      />

      {/* Zero-Ad Privacy & Essential Storage Consent Banner */}
      <ConsentBanner
        onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)}
        onOpenCookiePolicy={() => setIsCookiesOpen(true)}
      />

      {/* Legal & Compliance Modals */}
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <CookiePolicyModal isOpen={isCookiesOpen} onClose={() => setIsCookiesOpen(false)} />
      <AccessibilityStatementModal isOpen={isA11yOpen} onClose={() => setIsA11yOpen(false)} />

      {/* Core Pages */}
      <AboutUsModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <ContactUsModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Industry-Grade Firebase Commuter Auth Modal */}
      <AuthModal />

      {/* Trusted Guardians Circle Management Modal */}
      <TrustedGuardianModal />

      {/* 24/7 Verified Safe Shelters & Emergency Refuges Modal */}
      <SafeSheltersModal
        isOpen={isSheltersModalOpen}
        onClose={() => setIsSheltersModalOpen(false)}
        currentCoordinates={activeUserCoordinates}
        activeRoute={activeRoute}
        onLockSafeHaven={handleLockSafeHaven}
        initialCategory={sheltersInitialCategory}
      />

      {/* Emergency 112 SOS Cockpit Modal */}
      <EmergencySosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        currentPosition={activeUserCoordinates}
        activeRouteName={activeRoute.name}
        crossTrackDistanceMeters={telemetry.crossTrackDistanceMeters}
      />

      {/* Safe Cab & Auto Ride Shield Modal */}
      <CabRideShieldModal
        isOpen={isCabShieldOpen}
        onClose={() => setIsCabShieldOpen(false)}
        origin={origin}
        destination={destination}
        activeRoute={activeRoute}
        telemetry={telemetry}
        onTripCompleted={() => setIsFeedbackOpen(true)}
        onOpenSos={() => setIsSosOpen(true)}
        currentLanguage={currentLanguage}
      />

      {/* 2-Tier Commuter End-of-Trip Feedback Modal */}
      <TripFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onOpenHazardReport={() => setIsReportModalOpen(true)}
        routeName={activeRoute.name}
        destinationName={destination.name}
      />

      {/* Ground-Level Street Audit 360° Modal */}
      <StreetViewModal
        isOpen={isStreetViewOpen}
        data={streetViewData}
        onClose={() => setIsStreetViewOpen(false)}
      />

      {/* Simulated Incoming Decoy Fake Call Screen */}
      <FakeCallModal
        isOpen={isFakeCallOpen}
        onClose={() => setIsFakeCallOpen(false)}
      />

      {/* Consent-Based Live GPS Location Sharing Modal */}
      <LocationShareModal
        isOpen={isShareLocationModalOpen}
        onClose={() => setIsShareLocationModalOpen(false)}
      />

      {/* Floating 1-Tap Emergency SOS Trigger Button for Commuters */}
      {userRole === 'commuter' && !isTrackingMode && (
        <FloatingSosButton onClick={() => setIsSosOpen(true)} />
      )}
    </div>
  );
};

export default App;
