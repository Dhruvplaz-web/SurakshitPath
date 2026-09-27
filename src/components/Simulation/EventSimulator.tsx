import React from 'react';
import { DynamicEvent } from '../../types/routing';
import { AlertTriangle, LightbulbOff, ShieldAlert, RotateCcw } from 'lucide-react';

interface Props {
  activeEvents: DynamicEvent[];
  onToggleEvent: (eventId: string) => void;
  onResetEvents: () => void;
}

export const EventSimulator: React.FC<Props> = ({
  activeEvents,
  onToggleEvent,
  onResetEvents
}) => {
  const isBlackoutActive = activeEvents.some(e => e.id === 'event_baner_blackout' && e.active);
  const isCrowdAlertActive = activeEvents.some(e => e.id === 'event_sus_crowd' && e.active);

  return (
    <div className="simulation-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
          <AlertTriangle size={14} color="var(--accent-amber)" />
          <span>Real-Time Event Simulator</span>
        </div>

        {(isBlackoutActive || isCrowdAlertActive) && (
          <button
            onClick={onResetEvents}
            className="btn-civic"
            style={{ padding: '2px 8px', fontSize: '10px' }}
            title="Reset simulated hazards"
          >
            <RotateCcw size={10} /> Reset
          </button>
        )}
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
        Test dynamic re-routing: trigger simulated local condition changes on the Pune network.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Event 1: Streetlight Outage on Baner Road */}
        <button
          onClick={() => onToggleEvent('event_baner_blackout')}
          className="btn-civic"
          style={{
            justifyContent: 'flex-start',
            padding: '8px 10px',
            fontSize: '11px',
            backgroundColor: isBlackoutActive ? 'rgba(239, 68, 68, 0.15)' : 'var(--surface-card)',
            borderColor: isBlackoutActive ? 'var(--danger-crimson)' : 'var(--border-subtle)',
            color: isBlackoutActive ? 'var(--danger-crimson)' : 'var(--text-secondary)'
          }}
        >
          <LightbulbOff size={14} />
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Simulate Streetlight Grid Failure</div>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>Baner Road Commercial Corridor (L_e drops to 0.10)</div>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 700 }}>{isBlackoutActive ? 'ACTIVE' : 'OFF'}</span>
        </button>

        {/* Event 2: Verified Crowd Alert on Sus Alley */}
        <button
          onClick={() => onToggleEvent('event_sus_crowd')}
          className="btn-civic"
          style={{
            justifyContent: 'flex-start',
            padding: '8px 10px',
            fontSize: '11px',
            backgroundColor: isCrowdAlertActive ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-card)',
            borderColor: isCrowdAlertActive ? 'var(--accent-amber)' : 'var(--border-subtle)',
            color: isCrowdAlertActive ? 'var(--accent-amber)' : 'var(--text-secondary)'
          }}
        >
          <ShieldAlert size={14} />
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Simulate Verified Hazard Alert</div>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>Sus Khind Bypass (Harassment report, R_e = 0.85)</div>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 700 }}>{isCrowdAlertActive ? 'ACTIVE' : 'OFF'}</span>
        </button>
      </div>
    </div>
  );
};
