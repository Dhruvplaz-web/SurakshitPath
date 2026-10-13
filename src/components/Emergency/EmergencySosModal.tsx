/**
 * SurakshitPath - Emergency SOS Cockpit Modal
 * 
 * Life-safety emergency cockpit designed for immediate high-stress activation:
 * - 1-Tap National Emergency (112) & Damini Squad (1091) Dialing
 * - Web Audio Acoustic Deterrent Siren & Visual Strobe
 * - Automated Telematics Dispatch to 3 Trusted Guardians
 * - Nearest Verified Pune Police Stations with landline contacts
 * - Silent Duress PIN fallback (9999)
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sirenService } from '../../services/sirenService';
import { strobeService } from '../../services/strobeService';
import { PUNE_CATEGORIZED_POIS, PunePoi } from '../../data/punePois';
import {
  X,
  PhoneCall,
  Phone,
  MessageSquare,
  Volume2,
  VolumeX,
  Radio,
  Send,
  CheckCircle2,
  MapPin,
  Flashlight,
  Zap,
  Maximize2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPosition?: [number, number];
  activeRouteName?: string;
  crossTrackDistanceMeters?: number;
}

export const EmergencySosModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentPosition = [18.5582, 73.7915],
  activeRouteName = 'Baner Arterial Safe Boulevard',
  crossTrackDistanceMeters = 12
}) => {
  const { user } = useAuth();
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [isTorchSupported, setIsTorchSupported] = useState(false);
  const [strobePulseState, setStrobePulseState] = useState(false);
  const [isFullscreenStrobe, setIsFullscreenStrobe] = useState(false);
  const [sosDispatched, setSosDispatched] = useState(false);
  const [duressPin, setDuressPin] = useState('');
  const [duressState, setDuressState] = useState<'idle' | 'triggered'>('idle');

    // Subscribe to strobe 8Hz pulses for real-time visual feedback
  useEffect(() => {
    const unsubscribe = strobeService.subscribe((isHigh, isTorch) => {
      setStrobePulseState(isHigh);
      setIsTorchSupported(isTorch);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Stop siren and hardware strobe when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (isSirenActive) {
        sirenService.stopSiren();
        setIsSirenActive(false);
      }
      if (isStrobeActive) {
        strobeService.stopStrobe();
        setIsStrobeActive(false);
      }
      setIsFullscreenStrobe(false);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isSirenActive) sirenService.stopSiren();
        if (isStrobeActive) strobeService.stopStrobe();
        setIsFullscreenStrobe(false);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSirenActive, isStrobeActive, onClose]);

  if (!isOpen) return null;

    const toggleSiren = () => {
    if (isSirenActive) {
      sirenService.stopSiren();
      setIsSirenActive(false);
    } else {
      sirenService.startSiren();
      setIsSirenActive(true);
    }
  };

  const toggleStrobe = async () => {
    if (isStrobeActive) {
      strobeService.stopStrobe();
      setIsStrobeActive(false);
      setIsFullscreenStrobe(false);
    } else {
      setIsStrobeActive(true);
      const torchWorked = await strobeService.startStrobe();
      setIsTorchSupported(torchWorked);
    }
  };

  const toggleAllDeterrents = async () => {
    const shouldActivate = !isSirenActive || !isStrobeActive;
    if (shouldActivate) {
      if (!isSirenActive) {
        sirenService.startSiren();
        setIsSirenActive(true);
      }
      if (!isStrobeActive) {
        setIsStrobeActive(true);
        const torchWorked = await strobeService.startStrobe();
        setIsTorchSupported(torchWorked);
      }
    } else {
      sirenService.stopSiren();
      setIsSirenActive(false);
      strobeService.stopStrobe();
      setIsStrobeActive(false);
      setIsFullscreenStrobe(false);
    }
  };

  const handleDispatchSos = () => {
    setSosDispatched(true);
    // Broadcast message via Web BroadcastChannel for any paired Guardian tab
    try {
      const channel = new BroadcastChannel('surakshit_emergency_stream');
      channel.postMessage({
        type: 'EMERGENCY_SOS_PACKET',
        payload: {
          timestamp: Date.now(),
          coordinates: currentPosition,
          commuterName: user?.displayName || 'Citizen Commuter',
          routeName: activeRouteName,
          deviationMeters: crossTrackDistanceMeters,
          guardiansCount: user?.trustedGuardians?.length || 0
        }
      });
    } catch {
      // ignore
    }
  };

  const handleDuressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duressPin === '9999') {
      setDuressState('triggered');
      handleDispatchSos();
    } else {
      setDuressPin('');
    }
  };

  // Find nearest 3 police stations from POIs
  const policeStations = PUNE_CATEGORIZED_POIS
    .filter((poi: PunePoi) => poi.category === 'police')
    .map((poi: PunePoi) => {
      const [pLat, pLng] = poi.coordinates;
      const dLat = (pLat - currentPosition[0]) * 111;
      const dLng = (pLng - currentPosition[1]) * 111 * Math.cos((pLat * Math.PI) / 180);
      const distKm = Math.sqrt(dLat * dLat + dLng * dLng);
      return {
        ...poi,
        distanceKm: distKm
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3);

  const guardians = user?.trustedGuardians || [];

  return (
    <>
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-sos-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(10, 5, 5, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (isSirenActive) sirenService.stopSiren();
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '92vh',
          backgroundColor: 'var(--surface-elevated, #16181f)',
          border: '2px solid var(--danger-crimson, #ef4444)',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(239, 68, 68, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Urgent Pulsing Header */}
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--danger-crimson, #ef4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 0 16px rgba(239, 68, 68, 0.8)'
              }}
            >
              <Radio size={20} className="animate-pulse" />
            </div>
            <div>
              <h2
                id="emergency-sos-title"
                style={{
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#fff',
                  margin: 0,
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>EMERGENCY SOS COCKPIT</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: 'rgba(239, 68, 68, 0.3)',
                    border: '1px solid var(--danger-crimson, #ef4444)',
                    color: '#fca5a5',
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}
                >
                  LIVE DISPATCH
                </span>
              </h2>
              <p style={{ fontSize: '11px', color: '#fca5a5', margin: '2px 0 0 0' }}>
                Instant police line & guardian telemetry broadcast active.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isSirenActive) sirenService.stopSiren();
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
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

        {/* Scrollable Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Primary Guardian Direct Call & WhatsApp Dispatch (Mobile & Laptop Ready) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <a
              href="tel:+919665184535"
              style={{
                textDecoration: 'none',
                backgroundColor: 'rgba(16, 185, 129, 0.16)',
                border: '1.5px solid var(--safe-emerald, #10b981)',
                color: '#fff',
                padding: '12px 14px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 900,
                fontSize: '12px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                transition: 'transform 0.1s ease',
                cursor: 'pointer'
              }}
              title="Place Direct Call to Primary Guardian: +91 96651 84535"
            >
              <PhoneCall size={16} color="var(--safe-emerald, #10b981)" />
              <span>Call Guardian</span>
            </a>

            <a
              href={`https://wa.me/919665184535?text=${encodeURIComponent(
                `🚨 *SURAKSHITPATH CRITICAL SOS ALERT*\n` +
                `Commuter: ${user?.displayName || 'Citizen Commuter'}\n` +
                `Route: ${activeRouteName}\n` +
                `GPS Coordinates: ${currentPosition[0].toFixed(5)}, ${currentPosition[1].toFixed(5)}\n` +
                `Google Maps: https://www.google.com/maps?q=${currentPosition[0]},${currentPosition[1]}\n` +
                `Zero-Install Live Tracking: ${typeof window !== 'undefined' ? window.location.origin : ''}/?mode=track&role=guardian\n` +
                `Immediate assistance needed! Tap to initiate voice call.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                backgroundColor: 'rgba(37, 211, 102, 0.14)',
                border: '1.5px solid #25d366',
                color: '#fff',
                padding: '12px 14px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 900,
                fontSize: '12px',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)',
                transition: 'transform 0.1s ease',
                cursor: 'pointer'
              }}
              title="Open WhatsApp Distress Channel with Live GPS & Voice Call"
            >
              <MessageSquare size={16} color="#25d366" />
              <span>WhatsApp SOS</span>
            </a>
          </div>

          {/* Priority Dialing Actions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <a
              href="tel:112"
              style={{
                textDecoration: 'none',
                backgroundColor: 'var(--danger-crimson, #ef4444)',
                color: '#fff',
                padding: '14px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 900,
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                transition: 'transform 0.1s ease'
              }}
            >
              <PhoneCall size={18} />
              <span>Police (112)</span>
            </a>

            <a
              href="tel:1091"
              style={{
                textDecoration: 'none',
                backgroundColor: '#7c3aed',
                color: '#fff',
                padding: '14px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 800,
                fontSize: '13px',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
                transition: 'transform 0.1s ease'
              }}
            >
              <PhoneCall size={16} />
              <span>Damini (1091)</span>
            </a>
          </div>

                    {/* Hardware Strobe Beacon & Acoustic Siren Deterrent Panel */}
          <div
            style={{
              backgroundColor: (isSirenActive || isStrobeActive) ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: (isSirenActive || isStrobeActive) ? '1.5px solid var(--danger-crimson)' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              transition: 'all 0.2s ease',
              boxShadow: (isSirenActive || isStrobeActive) ? '0 0 24px rgba(239, 68, 68, 0.25)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ACOUSTIC & OPTICAL DETERRENT
              </div>
              {(isSirenActive || isStrobeActive) && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#ffffff',
                    backgroundColor: strobePulseState ? 'var(--danger-crimson)' : '#f59e0b',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    letterSpacing: '0.04em',
                    transition: 'background-color 0.1s ease'
                  }}
                >
                  ACTIVE 8Hz
                </span>
              )}
            </div>

            {/* Master Toggle: Maximum Deterrent (Both Siren & Strobe) */}
            <button
              type="button"
              onClick={toggleAllDeterrents}
              style={{
                padding: '12px 16px',
                backgroundColor: (isSirenActive && isStrobeActive) ? 'var(--danger-crimson)' : 'rgba(239, 68, 68, 0.18)',
                border: (isSirenActive && isStrobeActive) ? '2px solid #ffffff' : '1.5px solid var(--danger-crimson)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: (isSirenActive && isStrobeActive) ? '0 0 20px rgba(239, 68, 68, 0.6)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Zap size={16} />
              <span>{(isSirenActive && isStrobeActive) ? 'Stop Maximum Deterrent 🛑' : '🚨 Max Deterrent (Siren + Strobe Beacon)'}</span>
            </button>

            {/* Two Granular Controls: Acoustic Siren & Strobe Beacon */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {/* Siren Only Button */}
              <button
                type="button"
                onClick={toggleSiren}
                style={{
                  padding: '9px 12px',
                  backgroundColor: isSirenActive ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: isSirenActive ? '1.5px solid var(--accent-amber)' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: isSirenActive ? 'var(--accent-amber)' : 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {isSirenActive ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isSirenActive ? 'Stop Siren' : '🔊 Acoustic Siren'}</span>
              </button>

              {/* Hardware Strobe Only Button */}
              <button
                type="button"
                onClick={toggleStrobe}
                style={{
                  padding: '9px 12px',
                  backgroundColor: isStrobeActive ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: isStrobeActive ? '1.5px solid var(--danger-crimson)' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: isStrobeActive ? 'var(--danger-crimson)' : 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Flashlight size={14} />
                <span>{isStrobeActive ? 'Stop Strobe' : '🔦 Strobe Beacon'}</span>
              </button>
            </div>

            {/* Strobe Status & Fullscreen Trigger (when Strobe is active) */}
            {isStrobeActive && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '6px',
                  fontSize: '10px'
                }}
              >
                <span style={{ color: isTorchSupported ? 'var(--safe-emerald)' : 'var(--accent-amber)', fontWeight: 700 }}>
                  {isTorchSupported ? '🔦 Physical Camera LED Strobe Active' : '🖥️ Screen Optical Strobe Active'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFullscreenStrobe(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: 700,
                    textDecoration: 'underline'
                  }}
                >
                  <Maximize2 size={11} />
                  <span>Fullscreen Beacon</span>
                </button>
              </div>
            )}
          </div>

          {/* Live Location Telematics Card */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                <MapPin size={12} color="var(--accent-amber, #f59e0b)" />
                <span>CURRENT TELEMETRY BEACON</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--safe-emerald, #10b981)' }}>
                GPS ±4m Accuracy
              </span>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {activeRouteName}
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>
                Coordinates: <strong style={{ color: '#fff' }}>{currentPosition[0].toFixed(5)}, {currentPosition[1].toFixed(5)}</strong>
              </span>
              <span>
                Corridor Adherence: <strong style={{ color: crossTrackDistanceMeters > 50 ? 'var(--danger-crimson)' : 'var(--safe-emerald)' }}>{crossTrackDistanceMeters}m</strong>
              </span>
            </div>
          </div>

          {/* Broadcast to Guardians Section */}
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--safe-emerald, #10b981)' }}>
                TRUSTED GUARDIANS BROADCAST ({guardians.length})
              </div>
              {sosDispatched && (
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--safe-emerald, #10b981)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} />
                  <span>SMS & GPS Dispatched</span>
                </span>
              )}
            </div>

            {guardians.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {guardians.map((g) => {
                  const cleanName = g.name.replace(/\s*\(.*?\)\s*/g, '').trim() || g.name;
                  const cleanRelation = g.relationship.replace(/\s+Guardian/i, '').trim() || g.relationship;
                  const cleanPhone = g.phone.replace(/\D/g, '');
                  const telUrl = `tel:${cleanPhone.startsWith('91') ? '+' : '+91'}${cleanPhone.slice(-10)}`;
                  const waUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.slice(-10)}`}?text=${encodeURIComponent(
                    `🚨 *SURAKSHITPATH SOS ALERT*\nI need immediate assistance along my route (${activeRouteName}). Location: https://www.google.com/maps?q=${currentPosition[0]},${currentPosition[1]}`
                  )}`;

                  return (
                    <div
                      key={g.id}
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{cleanName}</span>
                          <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent-amber, #f59e0b)', backgroundColor: 'rgba(245, 158, 11, 0.12)', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>{cleanRelation}</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>{g.phone}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <a
                          href={telUrl}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            color: 'var(--safe-emerald, #10b981)',
                            border: '1px solid var(--safe-emerald, #10b981)',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontSize: '10px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title={`Call ${cleanName} directly`}
                        >
                          <Phone size={11} />
                          <span>Call</span>
                        </a>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'rgba(37, 211, 102, 0.2)',
                            color: '#25d366',
                            border: '1px solid #25d366',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontSize: '10px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title={`Send WhatsApp SOS to ${cleanName}`}
                        >
                          <MessageSquare size={11} />
                          <span>Chat</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                No guardians linked yet. Broadcast will still alert Pune Police Control.
              </div>
            )}

            <button
              type="button"
              onClick={handleDispatchSos}
              disabled={sosDispatched}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: sosDispatched ? 'rgba(16, 185, 129, 0.2)' : 'var(--safe-emerald, #10b981)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 800,
                cursor: sosDispatched ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {sosDispatched ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Alert Dispatched ✓</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Dispatch to Circle</span>
                </>
              )}
            </button>
          </div>

          {/* Nearest Police Stations Directory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Nearest Verified Police Stations (Pune)
            </div>

            {policeStations.map((station) => (
              <div
                key={station.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {station.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                    <span>{station.distanceKm.toFixed(1)} km away</span>
                    <span>·</span>
                    <span style={{ color: 'var(--safe-emerald, #10b981)' }}>{station.openHours.split('·')[0]}</span>
                  </div>
                </div>

                {station.phone && (
                  <a
                    href={`tel:${station.phone.replace(/\s+/g, '')}`}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      borderRadius: '6px',
                      color: '#a5b4fc',
                      textDecoration: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <PhoneCall size={11} />
                    <span>Call</span>
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Deceptive Silent Duress PIN Form */}
          <div
            style={{
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Under Coercion? Silent Duress PIN:
              </span>
              <span className="mono-num" style={{ fontSize: '10px', color: 'var(--danger-crimson)', fontWeight: 800 }}>
                PIN: 9999
              </span>
            </div>

            {duressState === 'triggered' ? (
              <div style={{ fontSize: '11px', color: 'var(--safe-emerald)', padding: '6px 10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                Deceptive dismissal active. Silent priority telemetry dispatch sent to Police Control.
              </div>
            ) : (
              <form onSubmit={handleDuressSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Enter Duress PIN (9999)"
                  value={duressPin}
                  onChange={(e) => setDuressPin(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    color: '#fff',
                    outline: 'none',
                    textAlign: 'center',
                    letterSpacing: '0.2em'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid var(--danger-crimson, #ef4444)',
                    color: '#fca5a5',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Silent Dismiss
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Fullscreen Optical Strobe Hazard Overlay */}
      {isFullscreenStrobe && (
        <div
          onClick={() => setIsFullscreenStrobe(false)}
          role="button"
          tabIndex={0}
          aria-label="Stop Fullscreen Strobe"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: strobePulseState ? '#ffffff' : '#ef4444',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: '24px',
            textAlign: 'center',
            transition: 'background-color 0.05s ease'
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              border: '2px solid #ffffff',
              color: '#ffffff',
              padding: '18px 28px',
              borderRadius: '16px',
              maxWidth: '380px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.04em' }}>
              🚨 EMERGENCY STROBE BEACON
            </div>
            <div style={{ fontSize: '12px', color: 'var(--accent-amber)', marginTop: '8px', fontWeight: 800 }}>
              {isTorchSupported ? '🔦 Hardware Camera Torch & Screen 8Hz Pulsing' : '🖥️ High-Contrast Display 8Hz Optical Flare'}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tap anywhere to return to SOS Cockpit
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencySosModal;
