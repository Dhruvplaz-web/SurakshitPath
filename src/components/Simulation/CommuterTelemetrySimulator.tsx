import React from 'react';
import { TelemetryState } from '../../types/routing';
import { Play, Pause, Navigation, Compass, FastForward } from 'lucide-react';

interface Props {
  isSimulating: boolean;
  telemetry: TelemetryState;
  onTogglePlay: () => void;
  onSimulateDeviation: () => void;
  onSimulateStall: () => void;
  onResetSimulation: () => void;
}

export const CommuterTelemetrySimulator: React.FC<Props> = ({
  isSimulating,
  telemetry,
  onTogglePlay,
  onSimulateDeviation,
  onSimulateStall,
  onResetSimulation
}) => {
  return (
    <div className="simulation-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
          <Compass size={14} color="var(--safe-emerald)" />
          <span>Live Commuter Telemetry Watchdog</span>
        </div>

        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: isSimulating ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          color: isSimulating ? 'var(--safe-emerald)' : 'var(--text-muted)'
        }}>
          {isSimulating ? 'TRACKING LIVE' : 'STANDBY'}
        </span>
      </div>

      {/* Telemetry Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '6px',
        marginBottom: '10px',
        backgroundColor: 'var(--surface-elevated)',
        padding: '6px 8px',
        borderRadius: '6px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>GPS SPEED</div>
          <div className="mono-num" style={{ fontSize: '12px', fontWeight: 700 }}>
            {telemetry.speedKmh.toFixed(1)} km/h
          </div>
        </div>
        <div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>CROSS-TRACK (d⊥)</div>
          <div className="mono-num" style={{
            fontSize: '12px',
            fontWeight: 700,
            color: telemetry.crossTrackDistanceMeters > 50 ? 'var(--danger-crimson)' : 'var(--safe-emerald)'
          }}>
            {telemetry.crossTrackDistanceMeters}m
          </div>
        </div>
        <div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>DWELL TIME</div>
          <div className="mono-num" style={{ fontSize: '12px', fontWeight: 700 }}>
            {telemetry.dwellTimeSeconds}s
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <button
          onClick={onTogglePlay}
          className="btn-civic btn-primary-amber"
          style={{ flex: 1, padding: '6px 10px', fontSize: '11px' }}
        >
          {isSimulating ? <Pause size={12} /> : <Play size={12} />}
          <span>{isSimulating ? 'Pause Trip' : 'Start Simulated Trip'}</span>
        </button>

        <button
          onClick={onResetSimulation}
          className="btn-civic"
          style={{ padding: '6px 10px', fontSize: '11px' }}
          title="Reset to Origin (JSPM)"
        >
          Reset
        </button>
      </div>

      {/* Anomaly Triggers (Mandatory PS-20 evaluation tests) */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={onSimulateDeviation}
          className="btn-civic"
          style={{
            flex: 1,
            padding: '6px 8px',
            fontSize: '10px',
            borderColor: 'rgba(239, 68, 68, 0.4)',
            color: 'var(--danger-crimson)'
          }}
          title="Simulate straying >50m into dark alley"
        >
          <Navigation size={11} style={{ transform: 'rotate(45deg)' }} />
          <span>Stray Off-Route (&gt;50m)</span>
        </button>

        <button
          onClick={onSimulateStall}
          className="btn-civic"
          style={{
            flex: 1,
            padding: '6px 8px',
            fontSize: '10px',
            borderColor: 'rgba(245, 158, 11, 0.4)',
            color: 'var(--accent-amber)'
          }}
          title="Simulate unexpected stop in unlit stretch"
        >
          <FastForward size={11} />
          <span>Stall Commuter (0 km/h)</span>
        </button>
      </div>
    </div>
  );
};
