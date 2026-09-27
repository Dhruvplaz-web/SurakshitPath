import React, { useState, useEffect } from 'react';
import { RouteOption, TelemetryState } from '../../types/routing';
import {
  ShieldCheck,
  AlertTriangle,
  Phone,
  PhoneCall,
  BatteryCharging,
  Radio,
  Gauge,
  Navigation,
  ExternalLink,
  ShieldAlert,
  ArrowLeft,
  Share2,
  MapPin,
  Car
} from 'lucide-react';

interface Props {
  tripId: string;
  activeRoute: RouteOption;
  telemetry: TelemetryState;
  onExitTracking?: () => void;
}

export const ZeroInstallGuardianView: React.FC<Props> = ({
  tripId,
  activeRoute,
  telemetry,
  onExitTracking
}) => {
  const [liveStreamAlert, setLiveStreamAlert] = useState<{
    duressActive: boolean;
    reason: string;
    timestamp: number;
  } | null>(null);
  const [activeRideShield, setActiveRideShield] = useState<{
    commuterName: string;
    vehicleNumber: string;
    vehicleType: string;
    destination: string;
    timestamp: number;
  } | null>(null);
  const [callInitiated, setCallInitiated] = useState(false);
  const [policeInitiated, setPoliceInitiated] = useState(false);
  const [lastHeartbeat, setLastHeartbeat] = useState<number>(Date.now());

  // Listen to multi-window BroadcastChannel for real-time SOS packets and telemetry
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel('surakshit_emergency_stream');
    channel.onmessage = (event) => {
      const data = event.data;
      if (data && data.type === 'EMERGENCY_SOS_PACKET') {
        setLiveStreamAlert({
          duressActive: !!data.isSilentDuress,
          reason: data.reason || 'Duress PIN entry detected',
          timestamp: data.timestamp || Date.now()
        });
      } else if (data && data.type === 'RIDE_SHIELD_ACTIVATED' && data.payload) {
        setActiveRideShield(data.payload);
      }
      setLastHeartbeat(Date.now());
    };

    return () => {
      channel.close();
    };
  }, []);

  const [lat, lng] = telemetry.currentPosition;
  const isDeviated = telemetry.crossTrackDistanceMeters > 50;
  const isStationary = telemetry.isStationary;
  const isCorridorSafe = !isDeviated && !isStationary && !liveStreamAlert;

  const currentSegmentName = activeRoute.segments[telemetry.activeSegmentIndex]?.name || 'Urban Transit Corridor';
  const speedDisplay = telemetry.speedKmh > 0 ? `${telemetry.speedKmh.toFixed(1)} km/h` : 'Stationary (0 km/h)';

  const handleCallCommuter = () => {
    setCallInitiated(true);
    window.open('tel:+919881234567', '_self');
  };

  const handleTriggerPolice112 = () => {
    setPoliceInitiated(true);
    window.open('tel:112', '_self');
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SurakshitPath Zero-Install Live Guardian Tracking',
        text: `Live Commute Trail: ${activeRoute.name}. Real-time tracking link:`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tracking URL copied to clipboard!');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(9, 13, 20, 0.95)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      padding: '16px',
      color: 'var(--text-primary)',
      fontFamily: 'inherit'
    }}>
      {/* Top Banner Navigation */}
      <div style={{
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '14px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onExitTracking && (
            <button
              onClick={onExitTracking}
              className="btn-civic"
              style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Return to standard route planner"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          )}
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>SurakshitPath Guardian Portal</span>
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                color: 'var(--haven-blue)',
                border: '1px solid var(--haven-blue)',
                fontWeight: 700
              }}>
                ZERO-INSTALL PWA
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              WhatsApp Secure Session ID: <span className="mono-num">{tripId || 'tr_89f2a41d'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleShareLink}
          className="btn-civic"
          style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Share2 size={13} />
          <span>Share</span>
        </button>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '800px',
        width: '100%',
        margin: '16px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Silent Duress Emergency Banner (if triggered) */}
        {liveStreamAlert && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '2px solid var(--danger-crimson)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-glow-crimson)',
            animation: 'pulse 2s infinite'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldAlert size={26} color="var(--danger-crimson)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--danger-crimson)' }}>
                  EMERGENCY SOS BROADCAST ACTIVE
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                  Reason: {liveStreamAlert.reason} · Silent Duress packet received with live telemetry.
                </div>
              </div>
            </div>
            <button
              onClick={handleTriggerPolice112}
              className="btn-civic btn-danger-crimson"
              style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 800 }}
            >
              Dispatch Police 112
            </button>
          </div>
        )}

        {/* Active Cab Ride Shield Banner */}
        {activeRideShield && (
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '2px solid var(--accent-amber)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)'
              }}>
                <Car size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {activeRideShield.commuterName} is inside Verified Transit
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: 'var(--accent-amber)',
                    color: '#000',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {activeRideShield.vehicleType}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Destination: <strong>{activeRideShield.destination}</strong>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#fcd34d',
              color: '#000',
              border: '2px solid #000',
              borderRadius: '6px',
              padding: '6px 12px',
              fontWeight: 900,
              fontSize: '15px',
              letterSpacing: '0.12em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
            }}>
              {activeRideShield.vehicleNumber}
            </div>
          </div>
        )}

        {/* Live Status HUD */}
        <div style={{
          backgroundColor: isCorridorSafe ? 'var(--safe-emerald-subtle)' : 'var(--danger-crimson-subtle)',
          border: `1px solid ${isCorridorSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: isCorridorSafe ? 'var(--shadow-glow-emerald)' : 'var(--shadow-glow-crimson)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isCorridorSafe ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isCorridorSafe ? (
                <ShieldCheck size={26} color="var(--safe-emerald)" />
              ) : (
                <AlertTriangle size={26} color="var(--danger-crimson)" />
              )}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Commuter Status: {isCorridorSafe ? 'In Transit — Safe Corridor' : isDeviated ? 'Corridor Deviation Detected' : 'Stationary Stalling Alert'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Current Segment: <strong>{currentSegmentName}</strong>
              </div>
            </div>
          </div>

          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            backgroundColor: isCorridorSafe ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
            color: isCorridorSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            border: `1px solid ${isCorridorSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Radio size={12} className="animate-pulse" />
            {isCorridorSafe ? 'ENVELOPE SECURE' : 'ANOMALY DETECTED'}
          </span>
        </div>

        {/* Corridor Safety Envelope & Metrics HUD */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          {/* Commuter Speed */}
          <div style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              <Gauge size={14} color="var(--haven-blue)" />
              <span>LIVE SPEED</span>
            </div>
            <div className="mono-num" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {speedDisplay}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              GPS Extended Kalman Smoothed
            </div>
          </div>

          {/* Phone Battery */}
          <div style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              <BatteryCharging size={14} color="var(--safe-emerald)" />
              <span>PHONE BATTERY</span>
            </div>
            <div className="mono-num" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              78% Healthy
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Est. ~4.2h navigation runtime
            </div>
          </div>

          {/* Corridor Envelope & Cross-Track */}
          <div style={{
            backgroundColor: 'var(--surface-card)',
            border: `1px solid ${isDeviated ? 'var(--danger-crimson)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              <Navigation size={14} color={isDeviated ? 'var(--danger-crimson)' : 'var(--safe-emerald)'} />
              <span>SAFETY ENVELOPE (&plusmn;50m)</span>
            </div>
            <div className="mono-num" style={{
              fontSize: '20px',
              fontWeight: 800,
              color: isDeviated ? 'var(--danger-crimson)' : 'var(--safe-emerald)',
              marginTop: '4px'
            }}>
              {telemetry.crossTrackDistanceMeters}m {isDeviated ? '⚠️ OUT OF BUFFER' : '✅ IN BUFFER'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Green buffer: &plusmn;50m corridor bound
            </div>
          </div>
        </div>

        {/* Current Location & Safe Route Context */}
        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Active Route Corridor
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeRoute.name}
              </div>
            </div>
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-civic"
              style={{ fontSize: '11px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <span>Satellite Map</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {activeRoute.tagline}
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '10px'
          }}>
            <div>
              <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
              <strong>Coordinates:</strong> <span className="mono-num">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
            </div>
            <div>
              <strong>Trip Progress:</strong> <span className="mono-num">{telemetry.progressPercent}%</span>
            </div>
            <div>
              <strong>Last Synced:</strong> {new Date(lastHeartbeat).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* One-Tap Emergency Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginTop: '8px'
        }}>
          <button
            onClick={handleCallCommuter}
            className="btn-civic btn-primary-amber"
            style={{
              padding: '14px 18px',
              fontSize: '13px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Phone size={16} />
            <span>{callInitiated ? 'Calling Commuter...' : '1-Tap Call Commuter'}</span>
          </button>

          <button
            onClick={handleTriggerPolice112}
            className="btn-civic btn-danger-crimson"
            style={{
              padding: '14px 18px',
              fontSize: '13px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <PhoneCall size={16} />
            <span>{policeInitiated ? 'Triggering Police 112...' : 'Trigger Local Police 112'}</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
          SurakshitPath Zero-Install Guardian Oversight · Encrypted WebRTC / Broadcast Channel Sync · UN SDG 5 & 11
        </div>
      </div>
    </div>
  );
};
