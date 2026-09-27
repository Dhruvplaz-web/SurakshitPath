/**
 * SurakshitPath - Ride Shield Modal Component
 * 
 * Safety-Aware Ride Assistance Architecture:
 * - Extends route selection to nocturnal journey assistance.
 * - Integrates with Uber, Ola, and multi-modal mobility providers.
 * - Passes confirmed pickup & destination coordinates via official deep links.
 * - Pre-departure safety checklist.
 * - Post-booking optional trip monitoring, corridor deviation watchdog, and trusted guardian broadcast.
 * - Transparent safety language: NO fake driver ratings, NO false safety guarantees.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  RouteOption,
  TelemetryState,
  AppLanguage,
  RideProviderId,
  RideProviderInfo,
  RideSession
} from '../../types/routing';
import { PuneLocation } from '../../services/geocodingService';
import { rideShieldService } from '../../services/rideShieldService';
import { PUNE_SAFE_HAVENS } from '../../data/safeHavens';
import { getTranslation } from '../../services/localizationService';
import {
  ShieldCheck,
  Car,
  X,
  CheckCircle2,
  ExternalLink,
  Clock,
  Radio,
  MapPin,
  Share2,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  Check,
  Copy,
  Info,
  Send
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  origin?: PuneLocation;
  destination?: PuneLocation;
  activeRoute?: RouteOption;
  telemetry?: TelemetryState;
  onStartSimulation?: () => void;
  onTripCompleted?: () => void;
  onOpenSos?: () => void;
  currentLanguage?: AppLanguage;
}

export const CabRideShieldModal: React.FC<Props> = ({
  isOpen,
  onClose,
  origin,
  destination,
  activeRoute,
  telemetry,
  onStartSimulation,
  onTripCompleted,
  onOpenSos,
  currentLanguage = 'en'
}) => {
  const { user } = useAuth();
  const t = getTranslation(currentLanguage);

  // Providers list from RideShieldService adapter registry
  const [providers, setProviders] = useState<RideProviderInfo[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<RideProviderId>('uber');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(rideShieldService.isDemo());

  // Redirection confirmation state
  const [isConfirmingRedirect, setIsConfirmingRedirect] = useState(false);
  const [redirectedProvider, setRedirectedProvider] = useState<RideProviderInfo | null>(null);
  const [demoRedirectMessage, setDemoRedirectMessage] = useState<string | null>(null);

  // Active Session & Monitoring State
  const [activeSession, setActiveSession] = useState<RideSession | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'provider' | 'checklist' | 'monitoring' | 'emergency'>('provider');

  // Load providers and existing session on open
  useEffect(() => {
    if (isOpen) {
      const provs = rideShieldService.getProviders();
      setProviders(provs);
      setIsDemoMode(rideShieldService.isDemo());

      const existingSession = rideShieldService.getActiveSession();
      if (existingSession && existingSession.status !== 'completed' && existingSession.status !== 'cancelled') {
        setActiveSession(existingSession);
        setVehicleNumber(existingSession.vehicle_number || '');
        setDriverName(existingSession.driver_name || '');
        setIsMonitoringActive(existingSession.monitoring_enabled);
        if (existingSession.monitoring_enabled) {
          setActiveTab('monitoring');
        }
      } else {
        setActiveTab('provider');
      }
    }
  }, [isOpen]);

  // Elapsed timer for active monitoring
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isMonitoringActive && activeSession?.started_at) {
      interval = setInterval(() => {
        setElapsedMinutes(Math.floor((Date.now() - activeSession.started_at) / 60000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoringActive, activeSession]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fallback defaults for origin, destination, and active route
  const currentOrigin: PuneLocation = origin || {
    id: 'origin_default',
    name: 'Current Location',
    subtitle: '18.5204° N, 73.8567° E',
    coordinates: [18.5204, 73.8567],
    category: 'landmark'
  };

  const currentDestination: PuneLocation = destination || {
    id: 'dest_default',
    name: 'Selected Destination',
    subtitle: '18.5204° N, 73.8402° E',
    coordinates: [18.5204, 73.8402],
    category: 'landmark'
  };

  const defaultRoute: RouteOption = activeRoute || {
    id: 'route_safe',
    name: 'High-Visibility Safe Corridor',
    tagline: 'Continuous High Street Illumination',
    routeType: 'safe',
    distanceMeters: 13800,
    durationMinutes: 27,
    safetyScore: 88,
    betaUsed: 0.8,
    factors: {
      lighting: 0.88,
      activity: 0.82,
      transit: 0.79,
      emergency: 0.85,
      incidentPenalty: 0.05,
      compositeScore: 88
    },
    coordinates: [[18.6186, 73.7483], [18.5085, 73.8040]],
    segments: [],
    reasons: ['Continuous high-mast lighting', '24/7 active frontage']
  };

  // Nearest safe havens calculation
  const nearestHavens = useMemo(() => {
    const pos = telemetry?.currentPosition || currentOrigin.coordinates;
    return PUNE_SAFE_HAVENS.slice(0, 3).map(haven => {
      const dist = Math.sqrt(
        Math.pow(haven.coordinates[0] - pos[0], 2) + Math.pow(haven.coordinates[1] - pos[1], 2)
      ) * 111.32;
      return { ...haven, distanceKm: dist.toFixed(1) };
    });
  }, [telemetry, currentOrigin.coordinates]);

  if (!isOpen) return null;

  // Toggle Demo Mode
  const handleToggleDemoMode = () => {
    const next = !isDemoMode;
    setIsDemoMode(next);
    rideShieldService.setDemoMode(next);
  };

  // Step 1: User clicks "Open Provider" -> Show Confirmation Dialog
  const handleInitiateRedirect = (providerId: RideProviderId) => {
    const prov = providers.find(p => p.id === providerId) || providers[0];
    setSelectedProviderId(providerId);
    setRedirectedProvider(prov);
    setIsConfirmingRedirect(true);
  };

  // Step 2: User confirms leaving SurakshitPath to open provider
  const handleConfirmRedirect = () => {
    if (!redirectedProvider) return;

    // Create or update ride session
    const session = rideShieldService.createSession(
      selectedProviderId,
      {
        pickupCoords: currentOrigin.coordinates,
        pickupName: currentOrigin.name,
        destCoords: currentDestination.coordinates,
        destName: currentDestination.name,
        routeId: defaultRoute.id,
        routeName: defaultRoute.name,
        safetyScore: defaultRoute.safetyScore
      },
      user?.uid || 'guest_commuter'
    );

    setActiveSession(session);
    rideShieldService.markProviderRedirected(session.ride_id);

    // Generate deep link parameters
    const redirectInfo = rideShieldService.generateRedirect(selectedProviderId, {
      pickupCoords: currentOrigin.coordinates,
      pickupName: currentOrigin.name,
      destCoords: currentDestination.coordinates,
      destName: currentDestination.name,
      routeId: defaultRoute.id,
      routeName: defaultRoute.name,
      safetyScore: defaultRoute.safetyScore
    });

    if (isDemoMode) {
      setDemoRedirectMessage(`Demo Mode: Simulated official redirection to ${redirectedProvider.name}. Parameters passed: [Pickup: ${currentOrigin.name}, Destination: ${currentDestination.name}]. No external application launched.`);
      setIsConfirmingRedirect(false);
      setActiveTab('checklist');
    } else {
      // In Real Mode: open official universal link or deep link
      try {
        window.open(redirectInfo.universalUrl, '_blank', 'noopener,noreferrer');
      } catch {
        window.location.href = redirectInfo.fallbackUrl;
      }
      setIsConfirmingRedirect(false);
      setActiveTab('checklist');
    }
  };

  // Step 3: Start Ride Monitoring
  const handleStartRideMonitoring = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let session = activeSession;
    if (!session) {
      session = rideShieldService.createSession(
        selectedProviderId,
        {
          pickupCoords: currentOrigin.coordinates,
          pickupName: currentOrigin.name,
          destCoords: currentDestination.coordinates,
          destName: currentDestination.name,
          routeId: defaultRoute.id,
          routeName: defaultRoute.name,
          safetyScore: defaultRoute.safetyScore
        },
        user?.uid || 'guest_commuter'
      );
    }

    if (vehicleNumber.trim()) {
      rideShieldService.updateVehicleDetails(session.ride_id, vehicleNumber, driverName);
    }

    rideShieldService.toggleMonitoring(session.ride_id, true);
    setIsMonitoringActive(true);
    setActiveSession(session);
    setActiveTab('monitoring');

    // Start simulation / telemetry if available
    if (onStartSimulation) {
      onStartSimulation();
    }

    // Broadcast to guardians via BroadcastChannel
    try {
      const channel = new BroadcastChannel('surakshit_emergency_stream');
      channel.postMessage({
        type: 'RIDE_SHIELD_ACTIVATED',
        payload: {
          commuterName: user?.displayName || 'Citizen',
          vehicleNumber: vehicleNumber.toUpperCase().trim() || 'Cab / Auto',
          driverName: driverName || 'Ride Provider',
          provider: selectedProviderId,
          destination: currentDestination.name,
          route: defaultRoute.name,
          safetyScore: defaultRoute.safetyScore,
          timestamp: Date.now()
        }
      });
      setBroadcastSent(true);
    } catch {
      // ignore
    }
  };

  // Stop / End Ride Monitoring Safely
  const handleEndRideSafely = () => {
    if (activeSession) {
      rideShieldService.completeSession(activeSession.ride_id);
    }
    setIsMonitoringActive(false);
    setActiveSession(null);
    setBroadcastSent(false);
    onClose();
    if (onTripCompleted) {
      onTripCompleted();
    }
  };

  // Share Live Trip Link
  const tripShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?mode=track&trip=${activeSession?.ride_id || 'tr_shield'}&route=${defaultRoute.id}&origin=${currentOrigin.id}&dest=${currentDestination.id}&role=guardian`
    : '';

  const shareText = `🛡️ SurakshitPath Ride Shield Live Companion:
I am traveling from ${currentOrigin.name} to ${currentDestination.name} in a ${selectedProviderId.toUpperCase()} cab.
Vehicle Plate: ${vehicleNumber || 'Registered Cab'} | Safe Route: ${defaultRoute.name} (Safety: ${defaultRoute.safetyScore}/100)
Live Guardian Companion: ${tripShareUrl}`;

  const handleCopyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tripShareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ride-shield-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        backgroundColor: 'rgba(5, 7, 10, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          backgroundColor: 'var(--surface-elevated, #16181f)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.75)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.12) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(245, 158, 11, 0.18)',
                border: '1px solid var(--accent-amber, #f59e0b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber, #f59e0b)',
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.25)'
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2
                  id="ride-shield-modal-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: 'var(--text-primary, #f8fafc)',
                    margin: 0
                  }}
                >
                  {t.rideShield}
                </h2>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: isDemoMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: isDemoMode ? '#60a5fa' : 'var(--accent-amber, #f59e0b)',
                    border: isDemoMode ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                  }}
                >
                  {isDemoMode ? '🧪 Demo Mode' : '🛡️ Live Assistance'}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                {t.rideShieldSubtitle}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Demo Mode Switch */}
            <button
              type="button"
              onClick={handleToggleDemoMode}
              className="btn-civic"
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 700,
                backgroundColor: isDemoMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                color: isDemoMode ? '#60a5fa' : 'var(--text-muted)',
                border: isDemoMode ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px'
              }}
              title="Toggle Demo Mode (Simulates redirection without external app launch)"
            >
              Demo: {isDemoMode ? 'ON' : 'OFF'}
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted, #94a3b8)',
                cursor: 'pointer'
              }}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            padding: '0 16px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('provider')}
            style={{
              padding: '10px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: activeTab === 'provider' ? 'var(--accent-amber, #f59e0b)' : 'var(--text-muted)',
              borderBottom: activeTab === 'provider' ? '2px solid var(--accent-amber, #f59e0b)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Car size={14} />
            <span>1. {t.rideShieldChooseProvider}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            style={{
              padding: '10px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: activeTab === 'checklist' ? 'var(--accent-amber, #f59e0b)' : 'var(--text-muted)',
              borderBottom: activeTab === 'checklist' ? '2px solid var(--accent-amber, #f59e0b)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle2 size={14} />
            <span>2. {t.rideShieldChecklist}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monitoring')}
            style={{
              padding: '10px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: activeTab === 'monitoring' ? 'var(--safe-emerald, #10b981)' : 'var(--text-muted)',
              borderBottom: activeTab === 'monitoring' ? '2px solid var(--safe-emerald, #10b981)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Radio size={14} className={isMonitoringActive ? 'animate-pulse' : ''} />
            <span>3. {isMonitoringActive ? 'Active Ride Shield' : 'Trip Monitoring'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('emergency')}
            style={{
              padding: '10px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: activeTab === 'emergency' ? 'var(--danger-crimson, #ef4444)' : 'var(--text-muted)',
              borderBottom: activeTab === 'emergency' ? '2px solid var(--danger-crimson, #ef4444)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldAlert size={14} />
            <span>Emergency Havens</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Demo Mode Alert Banner */}
          {demoRedirectMessage && (
            <div
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#93c5fd',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{demoRedirectMessage}</div>
            </div>
          )}

          {/* Redirection Confirmation Modal Overlay */}
          {isConfirmingRedirect && redirectedProvider && (
            <div
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '2px solid var(--accent-amber, #f59e0b)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={18} color="var(--accent-amber)" />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Confirm Redirection to {redirectedProvider.name}
                </h3>
              </div>

              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                You will be redirected to the official <strong>{redirectedProvider.name}</strong> app/portal with your confirmed pickup (<strong>{currentOrigin.name}</strong>) and destination (<strong>{currentDestination.name}</strong>) coordinates.
              </p>

              <div style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: 'rgba(0,0,0,0.25)', padding: '8px 10px', borderRadius: '6px' }}>
                ⚠️ {t.rideShieldDriverDisclaimer} {t.rideShieldAssistanceDisclaimer}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handleConfirmRedirect}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    backgroundColor: 'var(--accent-amber, #f59e0b)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Open {redirectedProvider.name} {isDemoMode ? '(Simulate)' : ''}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsConfirmingRedirect(false)}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: 'var(--text-secondary)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Journey Context Card (Always Visible) */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Sparkles size={13} />
                <span>SURAKSHITPATH ROUTE CONTEXT</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: defaultRoute.safetyScore >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: defaultRoute.safetyScore >= 70 ? 'var(--safe-emerald)' : 'var(--accent-amber)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800
                }}
              >
                <ShieldCheck size={13} />
                <span>Safety Index: {defaultRoute.safetyScore}/100</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <MapPin size={14} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PICKUP LOCATION</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentOrigin.name}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <MapPin size={14} color="var(--safe-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DESTINATION</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentDestination.name}</div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '11px',
                color: 'var(--text-secondary)'
              }}
            >
              <span>Selected Corridor: <strong>{defaultRoute.name}</strong></span>
              <span><strong>{(defaultRoute.distanceMeters / 1000).toFixed(1)} km</strong> · ~<strong>{defaultRoute.durationMinutes} min</strong></span>
            </div>
          </div>

          {/* TAB 1: CHOOSE CAB PROVIDER */}
          {activeTab === 'provider' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Driver Safety Transparency Disclaimer Notice */}
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                <Info size={15} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <strong>Safety-Aware Mobility Redirection:</strong> {t.rideShieldDriverDisclaimer} {t.rideShieldAssistanceDisclaimer} Real-time driver rating and license verification are provided directly inside the official provider application.
                </div>
              </div>

              {/* Provider Selection Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {providers.map((prov) => (
                  <div
                    key={prov.id}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: selectedProviderId === prov.id ? '1.5px solid var(--accent-amber, #f59e0b)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px'
                        }}
                      >
                        {prov.logo}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {prov.name}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--safe-emerald)', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            {prov.tagline}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {prov.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleInitiateRedirect(prov.id)}
                        style={{
                          padding: '8px 14px',
                          backgroundColor: prov.id === 'uber' ? '#ffffff' : prov.id === 'ola' ? '#00D166' : 'var(--accent-amber)',
                          color: '#000000',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        <span>Open {prov.name}</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Step indicator to next action */}
              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid var(--accent-amber)',
                  color: 'var(--accent-amber)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Proceed to Safety Checklist & Monitoring</span>
                <CheckCircle2 size={16} />
              </button>
            </div>
          )}

          {/* TAB 2: PRE-DEPARTURE SAFETY CHECKLIST */}
          {activeTab === 'checklist' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t.rideShieldChecklist}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', fontSize: '12px' }}>
                  <Check size={16} color="var(--safe-emerald)" />
                  <span>Pickup location confirmed: <strong>{currentOrigin.name}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', fontSize: '12px' }}>
                  <Check size={16} color="var(--safe-emerald)" />
                  <span>Destination confirmed: <strong>{currentDestination.name}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', fontSize: '12px' }}>
                  <Check size={16} color="var(--safe-emerald)" />
                  <span>Route corridor selected: <strong>{defaultRoute.name}</strong> ({defaultRoute.safetyScore}/100)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', fontSize: '12px' }}>
                  <Check size={16} color="var(--safe-emerald)" />
                  <span>Emergency & safe-haven network accessible ({PUNE_SAFE_HAVENS.length} verified shelters)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '8px', fontSize: '12px' }}>
                  <Radio size={16} color="var(--accent-amber)" />
                  <span>Optional corridor deviation & stall safety monitoring ready to activate</span>
                </div>
              </div>

              {/* Cab Vehicle License Plate Form (Optional logging for security) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                  CAB / AUTO LICENSE NUMBER (OPTIONAL FOR GUARDIAN BROADCAST)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="e.g. MH 12 QX 4589"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(245, 158, 11, 0.06)',
                      border: '2px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '14px',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      color: '#ffffff',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--accent-amber, #f59e0b)',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    IND 🇮🇳
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleStartRideMonitoring()}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: 'var(--safe-emerald, #10b981)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <Radio size={16} />
                  <span>{t.rideShieldStartMonitoring}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVE MONITORING & TRIP SHIELD */}
          {activeTab === 'monitoring' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  backgroundColor: isMonitoringActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: isMonitoringActive ? '1px solid var(--safe-emerald)' : '1px solid var(--accent-amber)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isMonitoringActive ? 'var(--safe-emerald)' : 'var(--accent-amber)', fontWeight: 800, fontSize: '13px' }}>
                    <Radio size={16} className={isMonitoringActive ? 'animate-pulse' : ''} />
                    <span>{isMonitoringActive ? 'RIDE SHIELD ACTIVELY MONITORING' : t.rideShieldMonitoringOff}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: isMonitoringActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      color: isMonitoringActive ? 'var(--safe-emerald)' : 'var(--accent-amber)'
                    }}
                  >
                    {isMonitoringActive ? 'EN ROUTE' : 'OPT-IN REQUIRED'}
                  </span>
                </div>

                {vehicleNumber && (
                  <div
                    style={{
                      backgroundColor: '#fcd34d',
                      color: '#000',
                      border: '2px solid #000',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      textAlign: 'center',
                      fontWeight: 900,
                      fontSize: '16px',
                      letterSpacing: '0.15em',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    {vehicleNumber}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} />
                    <span>Trip Elapsed: <strong>{elapsedMinutes} mins</strong></span>
                  </div>
                  <div>
                    <span>Corridor: <strong>{defaultRoute.name}</strong></span>
                  </div>
                </div>
              </div>

              {/* Trusted Contact Sharing Section */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Share2 size={13} color="var(--accent-amber)" />
                  <span>SHARE TRIP WITH TRUSTED GUARDIANS</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: '#25D366',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Send size={13} />
                    <span>WhatsApp Live Trail</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      color: 'var(--text-primary)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {linkCopied ? <Check size={13} color="var(--safe-emerald)" /> : <Copy size={13} />}
                    <span>{linkCopied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>

                {broadcastSent && (
                  <div style={{ fontSize: '11px', color: 'var(--safe-emerald)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <CheckCircle2 size={13} />
                    <span>Live status broadcast dispatched to trusted emergency channel.</span>
                  </div>
                )}
              </div>

              {/* End Ride Button */}
              {isMonitoringActive ? (
                <button
                  type="button"
                  onClick={handleEndRideSafely}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'var(--safe-emerald, #10b981)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>I Have Arrived Safely (Complete Ride)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStartRideMonitoring()}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'var(--accent-amber, #f59e0b)',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Radio size={16} />
                  <span>Start Optional Trip Monitoring</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 4: VERIFIED EMERGENCY SUPPORT */}
          {activeTab === 'emergency' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Verified Safe Havens & Emergency Outposts
                </span>
                {onOpenSos && (
                  <button
                    type="button"
                    onClick={onOpenSos}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'var(--danger-crimson)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ShieldAlert size={12} />
                    <span>Emergency SOS 112</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {nearestHavens.map((haven) => (
                  <div
                    key={haven.id}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {haven.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {haven.address} · <span style={{ color: 'var(--safe-emerald)' }}>{haven.timing}</span>
                      </div>
                    </div>

                    {haven.contact && (
                      <a
                        href={`tel:${haven.contact.split('/')[0].trim()}`}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: 'rgba(16, 185, 129, 0.12)',
                          color: 'var(--safe-emerald)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <PhoneCall size={12} />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Safety Disclaimer Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            fontSize: '10px',
            color: 'var(--text-muted, #94a3b8)',
            lineHeight: 1.4,
            textAlign: 'center'
          }}
        >
          {t.rideShieldSafetyNote}
        </div>
      </div>
    </div>
  );
};

export default CabRideShieldModal;
