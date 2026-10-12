import React, { useState } from 'react';
import { RouteOption, TelemetryState } from '../../types/routing';
import { ShieldCheck, BatteryCharging, Wifi, Phone, Navigation, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react';

interface Props {
  activeRoute: RouteOption;
  telemetry: TelemetryState;
}

export const GuardianCockpit: React.FC<Props> = ({ activeRoute, telemetry }) => {
  const [callInitiated, setCallInitiated] = useState(false);
  const [policeForwarded, setPoliceForwarded] = useState(false);

  const [lat, lng] = telemetry.currentPosition;
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  const isSafe = telemetry.crossTrackDistanceMeters <= 50 && !telemetry.isStationary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Guardian Status Header */}
      <div style={{
        backgroundColor: isSafe ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.1)',
        border: `1px solid ${isSafe ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.4)'}`,
        borderRadius: '8px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isSafe ? (
            <ShieldCheck size={20} color="var(--safe-emerald)" />
          ) : (
            <AlertTriangle size={20} color="var(--danger-crimson)" />
          )}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Live Trip Companion · Dhruv
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              En-route to {activeRoute.name.split('·')[0].trim()}
            </div>
          </div>
        </div>

        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          backgroundColor: isSafe ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: isSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)',
          padding: '2px 8px',
          borderRadius: '4px',
          border: `1px solid ${isSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)'}`
        }}>
          {isSafe ? 'SAFE & ON-ROUTE' : 'ATTENTION REQUIRED'}
        </span>
      </div>

      {/* Device Telemetry Gauges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '10px 12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
            <BatteryCharging size={13} color="var(--safe-emerald)" />
            <span>PHONE BATTERY</span>
          </div>
          <div className="mono-num" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            78% Normal
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Estimated 4.2h runtime</div>
        </div>

        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '10px 12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
            <Wifi size={13} color="var(--haven-blue)" />
            <span>CELLULAR SIGNAL</span>
          </div>
          <div className="mono-num" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--haven-blue)', marginTop: '2px' }}>
            5G Ultra
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Jio 5G · Low Latency (24ms)</div>
        </div>
      </div>

      {/* Route Adherence & Live GPS Coordinates */}
      <div style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '12px 14px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Route Adherence & Corridor Buffer
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Cross-Track Corridor Error:</span>
            <strong className="mono-num" style={{
              color: telemetry.crossTrackDistanceMeters > 50 ? 'var(--danger-crimson)' : 'var(--safe-emerald)'
            }}>
              {telemetry.crossTrackDistanceMeters}m (Threshold: 50m)
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Live Movement Speed:</span>
            <strong className="mono-num" style={{ color: 'var(--text-primary)' }}>
              {telemetry.speedKmh.toFixed(1)} km/h
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Current Coordinate:</span>
            <strong className="mono-num" style={{ color: 'var(--haven-blue)' }}>
              {lat.toFixed(5)}° N, {lng.toFixed(5)}° E
            </strong>
          </div>
        </div>

        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-civic"
            style={{ width: '100%', justifyContent: 'center', fontSize: '11px', color: '#93c5fd' }}
          >
            <ExternalLink size={12} /> Open Real-Time Location in Google Maps
          </a>
        </div>
      </div>

      {/* Guardian Escalation Actions */}
      <div style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '12px 14px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
          Guardian Instant Escalation Hub
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setCallInitiated(true)}
            className="btn-civic"
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              backgroundColor: callInitiated ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface-elevated)',
              borderColor: callInitiated ? 'var(--safe-emerald)' : 'var(--border-subtle)',
              color: callInitiated ? 'var(--safe-emerald)' : 'var(--text-primary)'
            }}
          >
            <Phone size={14} />
            <span>{callInitiated ? 'Calling Commuter (+91 98230 XXXXX)...' : 'Call Commuter Directly'}</span>
          </button>

          <button
            onClick={() => setPoliceForwarded(true)}
            className="btn-civic btn-danger-crimson"
            style={{ padding: '8px 12px', fontSize: '12px' }}
          >
            <Navigation size={14} />
            <span>{policeForwarded ? 'Telematics Sent to Pune Police (112)' : 'Forward Telematics to Pune Police (112)'}</span>
          </button>
        </div>

        {policeForwarded && (
          <div style={{
            marginTop: '10px',
            padding: '8px 10px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--safe-emerald)',
            borderRadius: '6px',
            fontSize: '11px',
            color: 'var(--safe-emerald)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle size={13} />
            <span>Emergency ticket #PUN-POL-8821 dispatched to nearest patrol car.</span>
          </div>
        )}
      </div>
    </div>
  );
};
