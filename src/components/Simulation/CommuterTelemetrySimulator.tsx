import React from 'react';
import { TelemetryState } from '../../types/routing';
import { Play, Pause, Navigation, Compass, FastForward, Radio } from 'lucide-react';

interface Props {
  isSimulating: boolean;
  isLiveGpsActive?: boolean;
  telemetry: TelemetryState;
  onTogglePlay: () => void;
  onToggleLiveGps?: () => void;
  onSimulateDeviation: () => void;
  onSimulateStall: () => void;
  onResetSimulation: () => void;
}

export const CommuterTelemetrySimulator: React.FC<Props> = ({
  isSimulating,
  isLiveGpsActive = false,
  telemetry,
  onTogglePlay,
  onToggleLiveGps,
  onSimulateDeviation,
  onSimulateStall,
  onResetSimulation
}) => {
  const isDeviated = telemetry.crossTrackDistanceMeters > 50;

  return (
    <div className="simulation-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
          <Compass size={14} color="var(--safe-emerald)" />
          <span>Corridor Watchdog (50m Buffer)</span>
        </div>

        <span style={{
          fontSize: '10px',
          fontWeight: 800,
          padding: '2px 6px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: isDeviated
            ? 'rgba(239, 68, 68, 0.2)'
            : isLiveGpsActive
              ? 'rgba(16, 185, 129, 0.2)'
              : isSimulating
                ? 'rgba(245, 158, 11, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
          color: isDeviated
            ? 'var(--danger-crimson)'
            : isLiveGpsActive
              ? 'var(--safe-emerald)'
              : isSimulating
                ? 'var(--accent-amber)'
                : 'var(--text-muted)'
        }}>
          {(isLiveGpsActive || isSimulating) && <Radio size={10} className="animate-pulse" />}
          {isDeviated
            ? 'DEVIATED'
            : isLiveGpsActive
              ? 'LIVE GPS'
              : isSimulating
                ? 'SIMULATING'
                : 'STANDBY'}
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
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>SPEED</div>
          <div className="mono-num" style={{ fontSize: '12px', fontWeight: 800 }}>
            {telemetry.speedKmh.toFixed(1)} km/h
          </div>
        </div>
        <div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>CORRIDOR (d⊥)</div>
          <div className="mono-num" style={{
            fontSize: '12px',
            fontWeight: 800,
            color: isDeviated ? 'var(--danger-crimson)' : 'var(--safe-emerald)'
          }}>
            {telemetry.crossTrackDistanceMeters}m
          </div>
        </div>
        <div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>DWELL</div>
          <div className="mono-num" style={{ fontSize: '12px', fontWeight: 800 }}>
            {telemetry.dwellTimeSeconds}s
          </div>
        </div>
      </div>

      {/* Real Live GPS vs Simulation Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
        {onToggleLiveGps && (
          <button
            type="button"
            onClick={onToggleLiveGps}
            className="btn-civic"
            style={{
              padding: '7px 8px',
              fontSize: '11px',
              fontWeight: 800,
              backgroundColor: isLiveGpsActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: isLiveGpsActive ? '1px solid var(--safe-emerald)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isLiveGpsActive ? 'var(--safe-emerald)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <Radio size={12} color={isLiveGpsActive ? 'var(--safe-emerald)' : 'var(--text-muted)'} />
            <span>{isLiveGpsActive ? 'Stop Live GPS' : 'Live GPS Watchdog'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onTogglePlay}
          className="btn-civic btn-primary-amber"
          style={{ padding: '7px 8px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
        >
          {isSimulating ? <Pause size={12} /> : <Play size={12} />}
          <span>{isSimulating ? 'Pause Sim' : 'Simulate Trip'}</span>
        </button>
      </div>

      {/* Anomaly Triggers (Testing & Verification) */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          type="button"
          onClick={onSimulateDeviation}
          className="btn-civic"
          style={{
            flex: 1,
            padding: '6px 8px',
            fontSize: '10px',
            fontWeight: 700,
            borderColor: 'rgba(239, 68, 68, 0.4)',
            color: 'var(--danger-crimson)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          title="Simulate straying >50m off safe corridor"
        >
          <Navigation size={11} style={{ transform: 'rotate(45deg)' }} />
          <span>Test Deviation (&gt;50m)</span>
        </button>

        <button
          type="button"
          onClick={onSimulateStall}
          className="btn-civic"
          style={{
            flex: 1,
            padding: '6px 8px',
            fontSize: '10px',
            fontWeight: 700,
            borderColor: 'rgba(245, 158, 11, 0.4)',
            color: 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          title="Simulate unexpected stop in unlit stretch"
        >
          <FastForward size={11} />
          <span>Test Stall</span>
        </button>

        <button
          type="button"
          onClick={onResetSimulation}
          className="btn-civic"
          style={{ padding: '6px 10px', fontSize: '10px', fontWeight: 700 }}
          title="Reset telemetry"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
