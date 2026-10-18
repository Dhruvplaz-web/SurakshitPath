import React, { useState } from 'react';
import { VolunteerAlert } from '../../types/routing';
import { ShieldCheck, PhoneCall, Navigation, Users, BellRing, Clock, MapPin, Radio } from 'lucide-react';

interface Props {
  onAcknowledgeAlert?: (alertId: string) => void;
}

export const VolunteerCockpit: React.FC<Props> = ({ onAcknowledgeAlert }) => {
  const [activeAlerts, setActiveAlerts] = useState<VolunteerAlert[]>([
    {
      id: 'vol_alert_1',
      commuterAlias: 'Student Commuter #821',
      emergencyType: 'corridor_deviation',
      coordinates: [18.5410, 73.7730],
      distanceMeters: 620,
      reportedTime: Date.now() - 180000, // 3 mins ago
      status: 'active',
      nearestLandmark: 'Sus Khind Underpass (Unlit Cut)',
      responderCount: 1
    },
    {
      id: 'vol_alert_2',
      commuterAlias: 'Night Shift Professional #412',
      emergencyType: 'prolonged_stall',
      coordinates: [18.5710, 73.7540],
      distanceMeters: 1400,
      reportedTime: Date.now() - 420000, // 7 mins ago
      status: 'responding',
      nearestLandmark: 'Wakad Bridge Service Lane',
      responderCount: 2
    }
  ]);

  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);

  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds(prev => [...prev, id]);
    setActiveAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'responding', responderCount: a.responderCount + 1 } : a))
    );
    if (onAcknowledgeAlert) {
      onAcknowledgeAlert(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Volunteer Profile Banner */}
      <div style={{
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="var(--accent-amber)" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Suraksha Sahayak Network
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Pune Sector 4 · Verified Volunteer #MH-12-841
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          color: 'var(--safe-emerald)',
          padding: '3px 8px',
          borderRadius: '9999px',
          fontSize: '10px',
          fontWeight: 700
        }}>
          <Radio size={11} className="animate-pulse" />
          <span>ON DUTY</span>
        </div>
      </div>

      {/* Network Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px'
      }}>
        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '8px 10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ACTIVE VOLUNTEERS</div>
          <div className="mono-num" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
            18
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '8px 10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SECTOR RADIUS</div>
          <div className="mono-num" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-amber)' }}>
            2.5 km
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '8px 10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>AVG RESPONSE</div>
          <div className="mono-num" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--safe-emerald)' }}>
            3.8 min
          </div>
        </div>
      </div>

      {/* Emergency Alert Feed */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Live Proximity SOS Alarms
          </span>
          <span style={{ fontSize: '10px', color: 'var(--danger-crimson)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BellRing size={11} className="animate-pulse" /> {activeAlerts.length} Nearby
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeAlerts.map(alert => {
            const isAck = acknowledgedIds.includes(alert.id) || alert.status === 'responding';

            return (
              <div
                key={alert.id}
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: `1px solid ${isAck ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.5)'}`,
                  borderRadius: '8px',
                  padding: '12px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: alert.emergencyType === 'corridor_deviation' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: alert.emergencyType === 'corridor_deviation' ? 'var(--danger-crimson)' : 'var(--accent-amber)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {alert.emergencyType === 'corridor_deviation' ? 'Corridor Deviation (>50m)' : 'Prolonged Dwell Stall'}
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {alert.commuterAlias}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="mono-num" style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-amber)' }}>
                      {alert.distanceMeters}m away
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end', marginTop: '2px' }}>
                      <Clock size={10} /> 3 min ago
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                  <MapPin size={12} color="var(--accent-amber)" />
                  <span>{alert.nearestLandmark}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!isAck ? (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="btn-civic btn-primary-amber"
                      style={{ flex: 1, padding: '7px 10px', fontSize: '11px', fontWeight: 700 }}
                    >
                      <Navigation size={12} /> Acknowledge & Respond
                    </button>
                  ) : (
                    <div style={{
                      flex: 1,
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--safe-emerald)',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}>
                      <ShieldCheck size={12} /> En Route ({alert.responderCount} Responders)
                    </div>
                  )}

                  <a
                    href="tel:112"
                    className="btn-civic btn-danger-crimson"
                    style={{ padding: '7px 10px', fontSize: '11px', textDecoration: 'none' }}
                    title="Call Police Control"
                  >
                    <PhoneCall size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Escalation Row */}
      <div style={{
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={16} color="var(--safe-emerald)" />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Pune Police Damini Squad Liaison
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              Direct radio patch for female safety distress calls
            </div>
          </div>
        </div>

        <a
          href="tel:1091"
          className="btn-civic"
          style={{ padding: '5px 10px', fontSize: '11px', color: 'var(--safe-emerald)', textDecoration: 'none', border: '1px solid rgba(16, 185, 129, 0.4)' }}
        >
          Dial 1091
        </a>
      </div>
    </div>
  );
};
