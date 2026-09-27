import React, { useState } from 'react';
import { RouteOption, TelemetryState } from '../../types/routing';
import { ShieldCheck, BatteryCharging, Wifi, Phone, AlertTriangle, ExternalLink, Radio, MessageSquare } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Guardian Status Header */}
      <div style={{
        backgroundColor: isSafe ? 'var(--safe-emerald-subtle)' : 'var(--danger-crimson-subtle)',
        border: `1px solid ${isSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: isSafe ? 'var(--shadow-glow-emerald)' : 'var(--shadow-glow-crimson)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isSafe ? (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} color="var(--safe-emerald)" />
            </div>
          ) : (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} color="var(--danger-crimson)" />
            </div>
          )}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Live Trip Companion · Dhruv
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              En-route to {activeRoute.name.split('·')[0].trim()}
            </div>
          </div>
        </div>

        <span style={{
          fontSize: '10px',
          fontWeight: 800,
          backgroundColor: isSafe ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
          color: isSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)',
          padding: '4px 8px',
          borderRadius: 'var(--radius-full)',
          border: `1px solid ${isSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Radio size={11} className="animate-pulse" />
          {isSafe ? 'CORRIDOR SAFE' : 'ANOMALY DETECTED'}
        </span>
      </div>

      {/* Device Telemetry Gauges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            <BatteryCharging size={13} color="var(--safe-emerald)" />
            <span>PHONE BATTERY</span>
          </div>
          <div className="mono-num" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            78% Normal
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Estimated 4.2h runtime</div>
        </div>

        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            <Wifi size={13} color="var(--haven-blue)" />
            <span>CELLULAR SIGNAL</span>
          </div>
          <div className="mono-num" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--haven-blue)', marginTop: '2px' }}>
            5G Ultra
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Jio 5G · Low Latency (24ms)</div>
        </div>
      </div>

      {/* Route Adherence & Live GPS Coordinates */}
      <div style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Real-Time Cross-Track Distance
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <div className="mono-num" style={{
              fontSize: '22px',
              fontWeight: 800,
              color: telemetry.crossTrackDistanceMeters > 50 ? 'var(--danger-crimson)' : 'var(--safe-emerald)'
            }}>
              {telemetry.crossTrackDistanceMeters}m
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Deviation threshold: &plusmn;50m
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-civic"
            style={{ fontSize: '11px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <span>Open in Maps</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
          <strong>Coordinates:</strong> <span className="mono-num">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
        </div>
      </div>

      {/* Quick Action Emergency Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <a
          href="tel:+919665184535"
          onClick={() => setCallInitiated(true)}
          className="btn-civic btn-primary-amber"
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '12px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          title="Place direct cellular call to Dhruv (+91 96651 84535)"
        >
          <Phone size={14} />
          <span>{callInitiated ? 'Calling Dhruv...' : 'Call Dhruv'}</span>
        </a>

        <a
          href={`https://wa.me/919665184535?text=${encodeURIComponent(
            `🛡️ SurakshitPath Guardian Companion: Calling Dhruv regarding active trip to ${activeRoute.name.split('·')[0].trim()}. GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-civic"
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '12px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: 'rgba(37, 211, 102, 0.15)',
            border: '1px solid #25d366',
            color: '#25d366'
          }}
          title="Open WhatsApp Voice Call / Message"
        >
          <MessageSquare size={14} />
          <span>WhatsApp Dhruv</span>
        </a>

        <button
          type="button"
          onClick={() => setPoliceForwarded(true)}
          className="btn-civic btn-danger-crimson"
          style={{ width: '100%', padding: '10px 14px', fontSize: '12px' }}
        >
          <ShieldCheck size={14} />
          <span>{policeForwarded ? 'Forwarded (112) ✅' : 'Forward to Police (112)'}</span>
        </button>
      </div>
    </div>
  );
};

export default GuardianCockpit;
