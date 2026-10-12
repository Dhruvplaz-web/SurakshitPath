import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Header } from './components/Common/Header';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { RouteComparisonCard } from './components/Sidebar/RouteComparisonCard';
import { SafetySlider } from './components/Sidebar/SafetySlider';
import { ExplainabilityRadar } from './components/Sidebar/ExplainabilityRadar';
import { TreeShapWaterfall } from './components/Sidebar/TreeShapWaterfall';
import { SegmentInspector } from './components/Sidebar/SegmentInspector';
import { LocationSearchBox } from './components/Sidebar/LocationSearchBox';
import { QuickSafeHavenButton } from './components/Sidebar/QuickSafeHavenButton';
import { EmergencyRefugeModal } from './components/Sidebar/EmergencyRefugeModal';
import { CivicAdminDashboard } from './components/Admin/CivicAdminDashboard';
import { GuardianCockpit } from './components/Guardian/GuardianCockpit';
import { VolunteerCockpit } from './components/Volunteer/VolunteerCockpit';
import { ReportHazardModal } from './components/Community/ReportHazardModal';
import { RouteShareModal } from './components/Sidebar/RouteShareModal';
import { MapCockpit } from './components/Map/MapCockpit';
import { EventSimulator } from './components/Simulation/EventSimulator';
import { CommuterTelemetrySimulator } from './components/Simulation/CommuterTelemetrySimulator';
import { SafetyCheckModal } from './components/Simulation/SafetyCheckModal';
import { calculatePuneRoutes } from './engine/graphRouter';
import { calculateCrossTrackDistance, evaluateTelemetryAnomaly } from './engine/telemetryWatchdog';
import { TelematicsKalmanFilter } from './engine/kalmanFilter';
import { audioGuidance } from './services/audioGuidance';
import { offlineStore } from './services/offlineRoutingStore';
import { apiClient } from './services/apiClient';
import { DynamicEvent, TelemetryState, AnomalyCheckState, RouteOption, SafeHaven, UserRole, CitizenReport, AppLanguage } from './types/routing';
import { PUNE_LANDMARKS, PuneLocation } from './services/geocodingService';
import { AlertCircle, ArrowRight, ChevronDown, Sliders, Cpu, ListFilter, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { PrivacyPolicyModal } from './components/Legal/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/Legal/TermsOfServiceModal';
import { CookiePolicyModal } from './components/Legal/CookiePolicyModal';
import { ConsentBanner } from './components/Legal/ConsentBanner';
import { AccessibilityStatementModal } from './components/Legal/AccessibilityStatementModal';
import { AboutUsModal } from './components/Pages/AboutUsModal';
import { ContactUsModal } from './components/Pages/ContactUsModal';
import { NotFoundView } from './components/Pages/NotFoundView';
import { Footer } from './components/Common/Footer';
import { MobileBottomSheet } from './components/Mobile/MobileBottomSheet';
import { MobileFloatingHud } from './components/Mobile/MobileFloatingHud';
import { DiscreetEscortModal } from './components/Mobile/DiscreetEscortModal';
import { MobileSearchModal } from './components/Mobile/MobileSearchModal';
import { SurakshitKavachCockpit } from './components/Hardware/SurakshitKavachCockpit';

export const App: React.FC = () => {
  // Read initial state from URL parameters (URL-First State Architecture with Boundary Validation)
  const initialParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const betaRaw = parseFloat(params.get('beta') || '0.8');
    const betaParam = isNaN(betaRaw) ? 0.8 : Math.max(0.0, Math.min(1.5, betaRaw));
    
    const rawRoute = params.get('route') || 'route_safe';
    const routeParam = ['route_safe', 'route_fastest', 'route_balanced'].includes(rawRoute) ? rawRoute : 'route_safe';
    
    const originId = params.get('origin') || 'loc_jspm_tathawade';
    const destId = params.get('dest') || 'loc_kothrud_stand';
    
    const validRoles: UserRole[] = ['commuter', 'guardian', 'volunteer', 'admin'];
    const rawRole = params.get('role') as UserRole;
    const roleParam = validRoles.includes(rawRole) ? rawRole : 'commuter';

    const validLangs: AppLanguage[] = ['en', 'mr', 'hi'];
    const rawLang = params.get('lang') as AppLanguage;
    const langParam = validLangs.includes(rawLang) ? rawLang : 'en';

    const rawTheme = params.get('theme') || localStorage.getItem('surakshit_theme') || 'dark';
    const themeParam: 'dark' | 'light' = rawTheme === 'light' ? 'light' : 'dark';

    const originLoc = PUNE_LANDMARKS.find(l => l.id === originId) || PUNE_LANDMARKS[0];
    const destLoc = PUNE_LANDMARKS.find(l => l.id === destId) || PUNE_LANDMARKS[13];

    return {
      beta: betaParam,
      route: routeParam,
      origin: originLoc,
      destination: destLoc,
      role: roleParam,
      lang: langParam,
      theme: themeParam
    };
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>(initialParams.theme);
  const [userRole, setUserRole] = useState<UserRole>(initialParams.role);
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>(initialParams.lang);
  const [origin, setOrigin] = useState<PuneLocation>(initialParams.origin);
  const [destination, setDestination] = useState<PuneLocation>(initialParams.destination);
  const [beta, setBeta] = useState<number>(initialParams.beta);
  const [activeRouteId, setActiveRouteId] = useState<string>(initialParams.route);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [isPickingOnMap, setIsPickingOnMap] = useState<'origin' | 'destination' | null>(null);
  const [explainabilityMode, setExplainabilityMode] = useState<'radar' | 'shap'>('radar');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>([]);
  const [isRefugesModalOpen, setIsRefugesModalOpen] = useState(false);
  const [activeLockedHavenId, setActiveLockedHavenId] = useState<string | null>(null);

  // Legal & Core Page Modal States
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isCookiesOpen, setIsCookiesOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isSimControlsOpen, setIsSimControlsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBetaOpen, setIsBetaOpen] = useState(false);
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [isSegmentsOpen, setIsSegmentsOpen] = useState(false);

  // Mobile Viewport and Discreet Escort States
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 960);
  const [isDiscreetModeOpen, setIsDiscreetModeOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isKavachModalOpen, setIsKavachModalOpen] = useState(false);

  // Responsive mobile viewport listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 960);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (path !== '/' && path !== '/index.html' && path !== '') {
      setIsNotFound(true);
    }
  }, []);

  // Preload Offline Vector Tiles and POIs into IndexedDB
  useEffect(() => {
    offlineStore.syncOfflinePack();
  }, []);

  // Sync real-time citizen incident reports from database on mount
  useEffect(() => {
    apiClient.getCitizenReports().then(reports => {
      if (reports && reports.length > 0) {
        setCitizenReports(reports);
      }
    }).catch(() => {});
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

  // Sync state back to URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('role', userRole);
    params.set('lang', currentLanguage);
    params.set('beta', beta.toFixed(2));
    params.set('route', activeRouteId);
    params.set('origin', origin.id);
    params.set('dest', destination.id);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [userRole, currentLanguage, beta, activeRouteId, origin, destination]);

  // Calculate Pune routes on demand for selected origin and destination
  const routes = useMemo(() => {
    return calculatePuneRoutes(beta, dynamicEvents, origin.coordinates, destination.coordinates);
  }, [beta, dynamicEvents, origin.coordinates, destination.coordinates]);

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

  // Telemetry & Commuter Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
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

  const [anomalyState, setAnomalyState] = useState<AnomalyCheckState>({
    isOpen: false,
    reason: 'deviation',
    countdownSeconds: 45,
    sosDispatched: false
  });

  const animationStepRef = useRef<number>(0);
  const simulationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Commuter Animation Loop with Extended Kalman Filter GPS Smoothing
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

  // Anomaly Evaluator with Proactive Audio Cue
  const triggerAnomalyCheck = useCallback((reason: 'deviation' | 'stationary') => {
    setIsSimulating(false);
    setAnomalyState({
      isOpen: true,
      reason,
      countdownSeconds: 45,
      sosDispatched: false,
      timestamp: Date.now()
    });

    audioGuidance.speakSafetyCue(
      reason === 'deviation'
        ? 'Warning: Cross-track corridor deviation detected. Initiating safety check-in.'
        : 'Alert: Prolonged stationary dwell detected along isolated stretch. Are you safe?',
      true
    );
  }, []);

  useEffect(() => {
    const { hasAnomaly, reason } = evaluateTelemetryAnomaly(telemetry, true);
    if (hasAnomaly && reason && !anomalyState.isOpen && isSimulating) {
      triggerAnomalyCheck(reason);
    }
  }, [telemetry, anomalyState.isOpen, isSimulating, triggerAnomalyCheck]);

  // Location Handlers
  const handleSwapLocations = () => {
    setActiveLockedHavenId(null);
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleMapPickLocation = (target: 'origin' | 'destination', coords: [number, number]) => {
    const customLocation: PuneLocation = {
      id: `picked_${Date.now()}`,
      name: `Map Point (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`,
      subtitle: 'Custom selected coordinate in Pune',
      coordinates: coords,
      category: 'landmark'
    };

    if (target === 'origin') {
      setOrigin(customLocation);
    } else {
      setDestination(customLocation);
      setActiveLockedHavenId(null);
    }
    setIsPickingOnMap(null);
  };

  const handleLockSafeHaven = (haven: SafeHaven) => {
    setActiveLockedHavenId(haven.id);
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
    setIsRefugesModalOpen(false);

    audioGuidance.speakSafetyCue(
      `Emergency safe haven locked: ${haven.name}. Calculating highest visibility corridor.`,
      true
    );
  };

  const handleToggleEvent = (eventId: string) => {
    setDynamicEvents(prev =>
      prev.map(ev => (ev.id === eventId ? { ...ev, active: !ev.active } : ev))
    );
  };

  const handleResetEvents = () => {
    setDynamicEvents(prev => prev.map(ev => ({ ...ev, active: false })));
  };

  const handleSimulateDeviation = () => {
    const [lat, lng] = telemetry.currentPosition;
    const deviatedPos: [number, number] = [lat + 0.00065, lng - 0.00075];
    const crossTrack = calculateCrossTrackDistance(deviatedPos, activeRoute);

    setTelemetry(prev => ({
      ...prev,
      currentPosition: deviatedPos,
      crossTrackDistanceMeters: Math.max(72, crossTrack),
      isDeviated: true
    }));

    triggerAnomalyCheck('deviation');
  };

  const handleSimulateStall = () => {
    setTelemetry(prev => ({
      ...prev,
      speedKmh: 0,
      isStationary: true,
      dwellTimeSeconds: 120
    }));

    triggerAnomalyCheck('stationary');
  };

  const handleResetSimulation = () => {
    animationStepRef.current = 0;
    kalmanFilterRef.current.reset(origin.coordinates);
    setTelemetry({
      currentPosition: origin.coordinates,
      activeSegmentIndex: 0,
      progressPercent: 0,
      speedKmh: 0,
      crossTrackDistanceMeters: 0,
      isDeviated: false,
      isStationary: false,
      dwellTimeSeconds: 0
    });
    setIsSimulating(false);
    setAnomalyState(prev => ({ ...prev, isOpen: false }));
  };

  // Check if a real-time event is currently degrading the active route
  const handleNewCitizenReport = (report: CitizenReport) => {
    setCitizenReports(prev => [report, ...prev]);
    const injectedEvent: DynamicEvent = {
      id: `ev_${report.id}`,
      title: report.title,
      description: report.description,
      type: report.category === 'broken_lamp' ? 'streetlight_outage' : 'crowd_alert',
      coordinates: report.coordinates,
      affectedEdgeIds: ['edge_nh48_tathawade_to_wakad'],
      severity: report.urgency === 'high' ? 0.9 : 0.6,
      timestamp: report.reportedAt,
      active: true
    };
    setDynamicEvents(prev => [injectedEvent, ...prev]);
    audioGuidance.speakSafetyCue(`New citizen audit report registered: ${report.title}. Dynamic penalty applied.`);
  };

  // Check if a real-time event is currently degrading the active route
  const activeDegradingEvent = dynamicEvents.find(
    e => e.active && activeRoute.segments.some(seg => e.affectedEdgeIds.includes(seg.edgeId))
  );

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

  // Silent SOS trigger from Discreet Escort Calculator
  const handleSilentSosTriggered = useCallback(() => {
    setAnomalyState(prev => ({
      ...prev,
      isOpen: false,
      sosDispatched: true
    }));
    audioGuidance.speakSafetyCue('Silent escort emergency beacon transmitted to emergency network.');
    apiClient.submitCitizenReport({
      id: `sos_${Date.now()}`,
      category: 'harassment_crowd',
      title: 'Silent Escort SOS Beacon',
      description: '[DISCREET ESCORT SILENT SOS] Silent panic beacon dispatched via disguised interface.',
      coordinates: telemetry.currentPosition,
      reportedAt: Date.now(),
      status: 'verified',
      upvotes: 1,
      urgency: 'high',
      landmarkName: 'Discreet Escort Trigger'
    }).catch(() => {});
  }, [telemetry.currentPosition]);

  // Hardware SOS trigger from Surakshit-Kavach Smart Charm
  const handleHardwareSosTriggered = useCallback((reason: string) => {
    setAnomalyState({
      isOpen: true,
      reason: 'deviation',
      countdownSeconds: 30,
      sosDispatched: false
    });
    audioGuidance.speakSafetyCue(`Emergency alert: ${reason}. Verification countdown started.`);
    apiClient.submitCitizenReport({
      id: `kavach_sos_${Date.now()}`,
      category: 'harassment_crowd',
      title: 'Surakshit-Kavach Hardware Alert',
      description: `[HARDWARE SMART CHARM TRIGGER] ${reason}`,
      coordinates: telemetry.currentPosition,
      reportedAt: Date.now(),
      status: 'verified',
      upvotes: 1,
      urgency: 'high',
      landmarkName: 'Surakshit-Kavach Smart Charm'
    }).catch(() => {});
  }, [telemetry.currentPosition]);

  return (
    <div className="app-container">
      {!isMobile ? (
        <Header
          currentRole={userRole}
          onSelectRole={setUserRole}
          isAudioMuted={isAudioMuted}
          onToggleAudio={handleToggleAudio}
          currentLanguage={currentLanguage}
          onSelectLanguage={setCurrentLanguage}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenKavachCockpit={() => setIsKavachModalOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      ) : (
        <MobileFloatingHud
          origin={origin}
          destination={destination}
          onOpenSearch={() => setIsMobileSearchOpen(true)}
          isAudioMuted={isAudioMuted}
          onToggleAudio={handleToggleAudio}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenDiscreetMode={() => setIsDiscreetModeOpen(true)}
          onOpenRefugesModal={() => setIsRefugesModalOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenKavachCockpit={() => setIsKavachModalOpen(true)}
          activeLockedHavenId={activeLockedHavenId}
        />
      )}

      <main className={`workspace-grid ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Left Sidebar Drawer (Desktop Only) */}
        {!isMobile && (
          <aside className="sidebar-panel">
          {userRole === 'admin' && (
            <section className="sidebar-section">
              <ErrorBoundary fallbackTitle="Admin Dashboard Error">
                <CivicAdminDashboard onHighlightEdge={setSelectedEdgeId} citizenReports={citizenReports} />
              </ErrorBoundary>
            </section>
          )}

          {userRole === 'guardian' && (
            <section className="sidebar-section">
              <ErrorBoundary fallbackTitle="Guardian Cockpit Error">
                <GuardianCockpit activeRoute={activeRoute} telemetry={telemetry} />
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
              {/* Section: Origin & Destination Geocoding Search */}
              <section className="sidebar-section" style={{ paddingBottom: '12px' }}>
                <ErrorBoundary fallbackTitle="Search Error">
                  <LocationSearchBox
                    origin={origin}
                    destination={destination}
                    onSelectOrigin={setOrigin}
                    onSelectDestination={(loc) => {
                      setDestination(loc);
                      setActiveLockedHavenId(null);
                    }}
                    onSwapLocations={handleSwapLocations}
                    onPickOnMap={setIsPickingOnMap}
                    isPickingOnMap={isPickingOnMap}
                  />
                </ErrorBoundary>
              </section>

              {/* Section: 1-Click Emergency Shelter Lock */}
              <section className="sidebar-section" style={{ paddingTop: '8px', paddingBottom: '12px' }}>
                <ErrorBoundary fallbackTitle="Safe Haven Error">
                  <QuickSafeHavenButton
                    currentCoordinates={telemetry.currentPosition}
                    onLockSafeHaven={handleLockSafeHaven}
                    onOpenRefugesModal={() => setIsRefugesModalOpen(true)}
                    activeLockedHavenId={activeLockedHavenId}
                  />
                </ErrorBoundary>
              </section>

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
                  <span className="brand-badge">Dual-Route Model</span>
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
                  />
                </ErrorBoundary>
              </section>

              {/* Section 2: Collapsible Safety Preference & Impedance (Beta Trade-off) */}
              <section className="sidebar-section" style={{ padding: '10px 24px' }}>
                <button
                  type="button"
                  className="accordion-toggle-btn"
                  onClick={() => setIsBetaOpen(!isBetaOpen)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={14} color="var(--accent-amber)" />
                    <span style={{ fontWeight: 600, fontSize: '12px' }}>Safety Sensitivity &amp; Trade-Off</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="brand-badge" style={{ fontSize: '10px' }}>β = {beta.toFixed(2)}</span>
                    <ChevronDown size={14} style={{ transform: isBetaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }} />
                  </div>
                </button>

                {isBetaOpen && (
                  <div className="accordion-body">
                    <ErrorBoundary fallbackTitle="Slider Error">
                      <SafetySlider beta={beta} onBetaChange={setBeta} />
                    </ErrorBoundary>
                  </div>
                )}
              </section>

              {/* Section 3: Collapsible Explainable AI & TreeSHAP (ML) */}
              <section className="sidebar-section" style={{ padding: '10px 24px' }}>
                <button
                  type="button"
                  className="accordion-toggle-btn"
                  onClick={() => setIsExplainOpen(!isExplainOpen)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={14} color="var(--haven-blue)" />
                    <span style={{ fontWeight: 600, fontSize: '12px' }}>AI Explainability &amp; SHAP Risk</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {explainabilityMode === 'radar' ? '4-Factor' : 'TreeSHAP'}
                    </span>
                    <ChevronDown size={14} style={{ transform: isExplainOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }} />
                  </div>
                </button>

                {isExplainOpen && (
                  <div className="accordion-body">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', marginBottom: '8px' }}>
                      <button
                        id="btn-xai-radar"
                        className={`btn-civic ${explainabilityMode === 'radar' ? 'btn-primary-amber' : ''}`}
                        style={{ padding: '2px 8px', fontSize: '10px', height: '22px' }}
                        onClick={() => setExplainabilityMode('radar')}
                      >
                        4-Factor Radar
                      </button>
                      <button
                        id="btn-xai-shap"
                        className={`btn-civic ${explainabilityMode === 'shap' ? 'btn-primary-amber' : ''}`}
                        style={{ padding: '2px 8px', fontSize: '10px', height: '22px' }}
                        onClick={() => setExplainabilityMode('shap')}
                      >
                        TreeSHAP (ML)
                      </button>
                    </div>
                    <ErrorBoundary fallbackTitle="Explainability View Error">
                      {explainabilityMode === 'radar' ? (
                        <ExplainabilityRadar activeRoute={activeRoute} />
                      ) : (
                        <TreeShapWaterfall activeRoute={activeRoute} />
                      )}
                    </ErrorBoundary>
                  </div>
                )}
              </section>

              {/* Section 4: Collapsible Micro-Segment Inspector */}
              <section className="sidebar-section" style={{ padding: '10px 24px' }}>
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
                      />
                    </ErrorBoundary>
                  </div>
                )}
              </section>
            </>
          )}
        </aside>
        )}

        {/* Right Map Viewport */}
        <section style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Floating Sidebar Dock Toggle (Full-Screen Map Freedom - Desktop Only) */}
          {!isMobile && (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="map-sidebar-dock-toggle"
              title={isSidebarCollapsed ? "Expand Navigation & Routes Sidebar" : "Hide Sidebar for Full-Screen Map Freedom"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={14} color="var(--accent-amber)" /> : <PanelLeftClose size={14} />}
              <span>{isSidebarCollapsed ? "Show Routes" : "Full Map"}</span>
            </button>
          )}

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
              onLockSafeHaven={handleLockSafeHaven}
              activeLockedHavenId={activeLockedHavenId}
              onOpenRefugesModal={() => setIsRefugesModalOpen(true)}
            />
          </ErrorBoundary>

          {/* Floating Live Simulation & Event Controls (Collapsible for Uncluttered View) */}
          <div className="map-floating-overlay">
            {!isSimControlsOpen ? (
              <button
                onClick={() => setIsSimControlsOpen(true)}
                className="btn-civic"
                style={{
                  backgroundColor: 'rgba(18, 20, 26, 0.94)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--accent-amber)',
                  color: 'var(--text-primary)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <span style={{ color: 'var(--accent-amber)' }}>⚡ Simulation &amp; Watchdog</span>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  Open Panel
                </span>
              </button>
            ) : (
              <ErrorBoundary fallbackTitle="Simulator Error">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2px' }}>
                  <button
                    onClick={() => setIsSimControlsOpen(false)}
                    className="btn-civic"
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      backgroundColor: 'rgba(30, 34, 44, 0.95)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: 'var(--text-muted)'
                    }}
                  >
                    ✕ Minimize Panel
                  </button>
                </div>
                <EventSimulator
                  activeEvents={dynamicEvents}
                  onToggleEvent={handleToggleEvent}
                  onResetEvents={handleResetEvents}
                />

                <CommuterTelemetrySimulator
                  isSimulating={isSimulating}
                  telemetry={telemetry}
                  onTogglePlay={() => {
                    const nextSim = !isSimulating;
                    setIsSimulating(nextSim);
                    if (nextSim) {
                      audioGuidance.speakSafetyCue(`Starting trip simulation from ${origin.name} to ${destination.name}. Safe corridor tracking active.`);
                    }
                  }}
                  onSimulateDeviation={handleSimulateDeviation}
                  onSimulateStall={handleSimulateStall}
                  onResetSimulation={handleResetSimulation}
                />
              </ErrorBoundary>
            )}
          </div>
        </section>
      </main>

      {/* Unskippable "Are You Safe?" Anomaly Check Modal */}
      {anomalyState.isOpen && (
        <SafetyCheckModal
          anomalyState={anomalyState}
          telemetry={telemetry}
          activeRoute={activeRoute}
          onDismiss={() => setAnomalyState(prev => ({ ...prev, isOpen: false }))}
          onSosDispatched={() => setAnomalyState(prev => ({ ...prev, sosDispatched: true }))}
        />
      )}

      {/* Community Citizen Incident Reporting Modal */}
      <ReportHazardModal
        isOpen={isReportModalOpen}
        currentCoordinates={telemetry.currentPosition}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleNewCitizenReport}
      />

      {/* Ask for Angela Verified Safe Haven Directory Modal */}
      <EmergencyRefugeModal
        isOpen={isRefugesModalOpen}
        onClose={() => setIsRefugesModalOpen(false)}
        currentCoordinates={telemetry.currentPosition}
        onLockSafeHaven={handleLockSafeHaven}
        activeLockedHavenId={activeLockedHavenId}
      />

      {/* Share Safe Route Pass Modal */}
      <RouteShareModal
        isOpen={isShareModalOpen}
        activeRoute={activeRoute}
        origin={origin}
        destination={destination}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Docked Civic Footer with Legal & A11y Links (Desktop Only) */}
      {!isMobile && (
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
      )}

      {/* Mobile Draggable Bottom Sheet */}
      {isMobile && userRole === 'commuter' && (
        <MobileBottomSheet
          activeRoute={activeRoute}
          routes={routes}
          activeRouteId={activeRouteId}
          onSelectRoute={(id) => {
            setActiveRouteId(id);
            const selRoute = id === 'route_fastest' ? routes.fastest : id === 'route_balanced' ? routes.balanced : routes.safe;
            audioGuidance.speakSafetyCue(`Switched to ${selRoute.name}. Safety score: ${selRoute.safetyScore} out of 100.`);
          }}
          origin={origin}
          destination={destination}
          beta={beta}
          onBetaChange={setBeta}
          selectedEdgeId={selectedEdgeId}
          onSelectSegment={setSelectedEdgeId}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenRefugesModal={() => setIsRefugesModalOpen(true)}
          activeLockedHavenId={activeLockedHavenId}
          isSimulating={isSimulating}
          onToggleSimulating={() => {
            const nextSim = !isSimulating;
            setIsSimulating(nextSim);
            if (nextSim) {
              audioGuidance.speakSafetyCue(`Starting trip simulation from ${origin.name} to ${destination.name}. Safe corridor tracking active.`);
            }
          }}
        />
      )}

      {/* Mobile Search & Destination Modal */}
      <MobileSearchModal
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
        origin={origin}
        destination={destination}
        onSelectOrigin={setOrigin}
        onSelectDestination={(loc) => {
          setDestination(loc);
          setActiveLockedHavenId(null);
        }}
        onSwapLocations={handleSwapLocations}
        onPickOnMap={(target) => {
          setIsPickingOnMap(target);
          setIsMobileSearchOpen(false);
        }}
        isPickingOnMap={isPickingOnMap}
      />

      {/* Discreet Escort Mode Modal (Disguised Functional Calculator with Panic PIN) */}
      <DiscreetEscortModal
        isOpen={isDiscreetModeOpen}
        onClose={() => setIsDiscreetModeOpen(false)}
        onSilentSosTriggered={handleSilentSosTriggered}
        currentCoordinates={telemetry.currentPosition}
      />

      {/* Surakshit-Kavach Smart Charm Hardware Cockpit */}
      <SurakshitKavachCockpit
        isOpen={isKavachModalOpen}
        onClose={() => setIsKavachModalOpen(false)}
        onTriggerSos={handleHardwareSosTriggered}
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
    </div>
  );
};

export default App;
