import React, { useState } from 'react';
import { VolunteerAlert } from '../../types/routing';
import {
  ShieldCheck,
  PhoneCall,
  Navigation,
  BellRing,
  Clock,
  MapPin,
  Radio,
  UserCheck,
  CheckCircle2,
  UserPlus
} from 'lucide-react';

interface Props {
  onAcknowledgeAlert?: (alertId: string) => void;
  onHighlightCoordinates?: (coords: [number, number]) => void;
}

interface EscortRequest {
  id: string;
  commuterName: string;
  travelMode: 'Walking' | 'Two-Wheeler';
  pickupLandmark: string;
  destinationLandmark: string;
  coordinates: [number, number];
  distanceMeters: number;
  requestedAt: string;
  status: 'pending' | 'accepted' | 'completed';
}

interface PoliceOutpostContact {
  name: string;
  chowki: string;
  officerInCharge: string;
  phone: string;
  directDial: string;
  coverageSector: string;
}

type VolunteerTab = 'sos_alerts' | 'escort_requests' | 'police_liaison' | 'ground_verification';

export const VolunteerCockpit: React.FC<Props> = ({
  onAcknowledgeAlert,
  onHighlightCoordinates
}) => {
  const [activeTab, setActiveTab] = useState<VolunteerTab>('sos_alerts');
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [lastCheckInTime, setLastCheckInTime] = useState<string>('Today, 21:00 (Wakad Chowki)');
  const [isCheckedInSuccess, setIsCheckedInSuccess] = useState(false);

  const [activeAlerts, setActiveAlerts] = useState<VolunteerAlert[]>([
    {
      id: 'vol_alert_1',
      commuterAlias: 'Student Commuter #821',
      emergencyType: 'corridor_deviation',
      coordinates: [18.5410, 73.7730],
      distanceMeters: 620,
      reportedTime: Date.now() - 180000,
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
      reportedTime: Date.now() - 420000,
      status: 'responding',
      nearestLandmark: 'Wakad Bridge Service Lane',
      responderCount: 2
    }
  ]);

  const [escortRequests, setEscortRequests] = useState<EscortRequest[]>([
    {
      id: 'escort_101',
      commuterName: 'IT Professional (Female, Solo)',
      travelMode: 'Walking',
      pickupLandmark: 'Hinjawadi Phase 1 Circle (near Infosys Gate)',
      destinationLandmark: 'Wakad Bhujbal Chowk Residences',
      coordinates: [18.5912, 73.7389],
      distanceMeters: 850,
      requestedAt: '4 mins ago',
      status: 'pending'
    },
    {
      id: 'escort_102',
      commuterName: 'College Student (Female)',
      travelMode: 'Walking',
      pickupLandmark: 'JSPM Tathawade Campus Bus Stop',
      destinationLandmark: 'Punawale Housing Society Cut',
      coordinates: [18.6186, 73.7483],
      distanceMeters: 1200,
      requestedAt: '8 mins ago',
      status: 'accepted'
    }
  ]);

  const [verifiedHazards, setVerifiedHazards] = useState<string[]>([]);

  const policeOutposts: PoliceOutpostContact[] = [
    {
      name: 'Pune Police Damini Squad (Women Safety Cell)',
      chowki: 'Pune City Police HQ / Shivajinagar',
      officerInCharge: 'Inspector Sunita Patil',
      phone: '1091 / 020-26122880',
      directDial: '1091',
      coverageSector: 'All Pune Wards & IT Corridors (24/7 Mobile Vans)'
    },
    {
      name: 'Wakad Pink Police Chowki',
      chowki: 'PCMC Ward 24 / Bhujbal Chowk',
      officerInCharge: 'Sub-Inspector Anjali Deshmukh',
      phone: '020-27278100',
      directDial: '02027278100',
      coverageSector: 'Wakad, Tathawade, Dange Chowk'
    },
    {
      name: 'Hinjawadi IT Park Police Station',
      chowki: 'Phase 1 Police Station',
      officerInCharge: 'Sr. Inspector Rahul Ghadge',
      phone: '020-22934200',
      directDial: '02022934200',
      coverageSector: 'Hinjawadi Phase 1, 2, 3 Tech Zones'
    },
    {
      name: 'Chatushrungi Police Station',
      chowki: 'Senapati Bapat Road Outpost',
      officerInCharge: 'Sr. Inspector Mahesh Bolte',
      phone: '020-25652835',
      directDial: '02025652835',
      coverageSector: 'Baner, Balewadi, Aundh, University Circle'
    }
  ];

  const handleAcknowledgeAlert = (id: string) => {
    setActiveAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'responding', responderCount: a.responderCount + 1 } : a))
    );
    if (onAcknowledgeAlert) {
      onAcknowledgeAlert(id);
    }
  };

  const handleAcceptEscort = (id: string) => {
    setEscortRequests(prev =>
      prev.map(e => (e.id === id ? { ...e, status: 'accepted' } : e))
    );
  };

  const handleCompleteEscort = (id: string) => {
    setEscortRequests(prev =>
      prev.map(e => (e.id === id ? { ...e, status: 'completed' } : e))
    );
  };

  const handleRadioCheckIn = () => {
    const timeStr = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Wakad Chowki Beat 3)`;
    setLastCheckInTime(timeStr);
    setIsCheckedInSuccess(true);
    setTimeout(() => setIsCheckedInSuccess(false), 3000);
  };

  const handleVerifyHazard = (hazardId: string) => {
    if (!verifiedHazards.includes(hazardId)) {
      setVerifiedHazards(prev => [...prev, hazardId]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Volunteer Profile & Duty Toggle Banner */}
      <div
        style={{
          backgroundColor: isOnDuty ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isOnDuty ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-subtle)',
          transition: 'all 0.2s ease'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="var(--accent-amber)" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Suraksha Sahayak Network
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Pune Sector 4 · Verified Volunteer #MH-12-841 (Kunal Shinde)
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOnDuty(!isOnDuty)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: isOnDuty ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            color: isOnDuty ? 'var(--safe-emerald)' : 'var(--text-muted)',
            border: `1px solid ${isOnDuty ? 'var(--safe-emerald)' : 'var(--border-medium)'}`,
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title={isOnDuty ? 'Click to switch to Standby' : 'Click to go Active on Duty'}
        >
          <Radio size={12} className={isOnDuty ? 'animate-pulse' : ''} />
          <span>{isOnDuty ? 'ON DUTY' : 'STANDBY'}</span>
        </button>
      </div>

      {/* Network Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>PATROLLERS</div>
          <div className="mono-num" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
            24 Active
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Sector 4</div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>COVERAGE</div>
          <div className="mono-num" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-amber)' }}>
            2.8 km
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Wakad-Baner</div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>AVG RESPONSE</div>
          <div className="mono-num" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--safe-emerald)' }}>
            3.4 min
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Rapid First Touch</div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>POLICE CHOWKIS</div>
          <div className="mono-num" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--haven-blue)' }}>
            4 Linked
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Pink Squad</div>
        </div>
      </div>

      {/* 4-Way Sub-Role Tab Switcher */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '3px',
          gap: '2px'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('sos_alerts')}
          style={{
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'sos_alerts' ? 'var(--accent-amber)' : 'transparent',
            color: activeTab === 'sos_alerts' ? '#000000' : 'var(--text-muted)',
            transition: 'all 0.15s ease'
          }}
        >
          SOS Alerts
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('escort_requests')}
          style={{
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'escort_requests' ? 'var(--accent-amber)' : 'transparent',
            color: activeTab === 'escort_requests' ? '#000000' : 'var(--text-muted)',
            transition: 'all 0.15s ease'
          }}
        >
          Night Escorts
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('police_liaison')}
          style={{
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'police_liaison' ? 'var(--accent-amber)' : 'transparent',
            color: activeTab === 'police_liaison' ? '#000000' : 'var(--text-muted)',
            transition: 'all 0.15s ease'
          }}
        >
          Police Liaison
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ground_verification')}
          style={{
            padding: '6px 4px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'ground_verification' ? 'var(--accent-amber)' : 'transparent',
            color: activeTab === 'ground_verification' ? '#000000' : 'var(--text-muted)',
            transition: 'all 0.15s ease'
          }}
        >
          Hazard Audit
        </button>
      </div>

      {/* TAB 1: LIVE PROXIMITY SOS ALERTS */}
      {activeTab === 'sos_alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Live Commuter Distress Signals
            </span>
            <span style={{ fontSize: '10px', color: 'var(--danger-crimson)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
              <BellRing size={12} className="animate-pulse" /> {activeAlerts.length} Active in Radius
            </span>
          </div>

          {activeAlerts.map((alert) => {
            const isResponding = alert.status === 'responding';

            return (
              <div
                key={alert.id}
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: `1px solid ${isResponding ? 'var(--safe-emerald)' : 'var(--danger-crimson)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: isResponding ? '0 0 16px rgba(16, 185, 129, 0.15)' : '0 0 16px rgba(239, 68, 68, 0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        backgroundColor: alert.emergencyType === 'corridor_deviation' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: alert.emergencyType === 'corridor_deviation' ? 'var(--danger-crimson)' : 'var(--accent-amber)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {alert.emergencyType === 'corridor_deviation' ? 'Corridor Deviation (>50m)' : 'Prolonged Dwell Stall'}
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
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

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={12} color="var(--accent-amber)" />
                  <span>{alert.nearestLandmark}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                  {!isResponding ? (
                    <button
                      type="button"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      className="btn-civic btn-primary-amber"
                      style={{ flex: 1, padding: '6px 12px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Navigation size={12} /> Acknowledge &amp; Respond
                    </button>
                  ) : (
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--safe-emerald)',
                        border: '1px solid var(--safe-emerald)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <ShieldCheck size={13} /> En Route ({alert.responderCount} Responders Active)
                    </div>
                  )}

                  {onHighlightCoordinates && (
                    <button
                      type="button"
                      onClick={() => onHighlightCoordinates(alert.coordinates)}
                      className="btn-civic"
                      style={{ padding: '6px 10px', fontSize: '11px' }}
                      title="Pin distress coordinates on map"
                    >
                      <MapPin size={12} />
                    </button>
                  )}

                  <a
                    href="tel:112"
                    className="btn-civic"
                    style={{
                      padding: '6px 10px',
                      fontSize: '11px',
                      textDecoration: 'none',
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      color: 'var(--danger-crimson)',
                      borderColor: 'var(--danger-crimson)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Call Police Emergency Control (112)"
                  >
                    <PhoneCall size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: NIGHT SHIFT ESCORT ACCOMPANIMENT */}
      {activeTab === 'escort_requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Night Shift Accompaniment ({escortRequests.length})
            </span>
            <span style={{ fontSize: '10px', color: 'var(--safe-emerald)', fontWeight: 700 }}>
              IT Corridor &amp; Student Walkers
            </span>
          </div>

          {escortRequests.map((req) => {
            const isAccepted = req.status === 'accepted';
            const isCompleted = req.status === 'completed';

            return (
              <div
                key={req.id}
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: `1px solid ${isAccepted ? 'var(--safe-emerald)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UserPlus size={13} color="var(--accent-amber)" />
                      <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{req.commuterName}</strong>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Mode: <span style={{ color: 'var(--accent-amber)' }}>{req.travelMode}</span> · Requested {req.requestedAt}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : isAccepted ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: isCompleted ? 'var(--safe-emerald)' : isAccepted ? 'var(--haven-blue)' : 'var(--accent-amber)',
                      border: `1px solid ${isCompleted ? 'var(--safe-emerald)' : isAccepted ? 'var(--haven-blue)' : 'var(--accent-amber)'}`
                    }}
                  >
                    {req.status}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div>📍 <strong>Pickup:</strong> {req.pickupLandmark}</div>
                  <div style={{ marginTop: '2px' }}>🎯 <strong>Destination:</strong> {req.destinationLandmark}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                  {req.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleAcceptEscort(req.id)}
                      className="btn-civic btn-primary-amber"
                      style={{ flex: 1, padding: '6px 10px', fontSize: '11px', fontWeight: 800 }}
                    >
                      <UserCheck size={12} /> Accept &amp; Meet Commuter
                    </button>
                  )}

                  {req.status === 'accepted' && (
                    <button
                      type="button"
                      onClick={() => handleCompleteEscort(req.id)}
                      className="btn-civic"
                      style={{ flex: 1, padding: '6px 10px', fontSize: '11px', fontWeight: 800, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--safe-emerald)', borderColor: 'var(--safe-emerald)' }}
                    >
                      <CheckCircle2 size={12} /> Mark Safely Escorted
                    </button>
                  )}

                  {req.status === 'completed' && (
                    <div style={{ fontSize: '11px', color: 'var(--safe-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Escort Mission Successfully Concluded
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: POLICE SUPPORT & OUTPOST RADIO CHECK-IN */}
      {activeTab === 'police_liaison' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Volunteer Radio Attendance Check-In Card */}
          <div
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Police Chowki Radio Check-In
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Last Beat Log: <strong style={{ color: '#fff' }}>{lastCheckInTime}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRadioCheckIn}
              className="btn-civic btn-primary-amber"
              style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {isCheckedInSuccess ? <CheckCircle2 size={12} /> : <Radio size={12} />}
              <span>{isCheckedInSuccess ? 'Logged!' : 'Log Attendance'}</span>
            </button>
          </div>

          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Verified Police Outposts &amp; Damini Units
          </div>

          {policeOutposts.map((outpost, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {outpost.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {outpost.chowki} · In-Charge: <strong style={{ color: 'var(--text-secondary)' }}>{outpost.officerInCharge}</strong>
                  </div>
                </div>

                <a
                  href={`tel:${outpost.directDial}`}
                  className="btn-civic"
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa',
                    borderColor: 'rgba(59, 130, 246, 0.4)'
                  }}
                  title={`Direct call to ${outpost.phone}`}
                >
                  <PhoneCall size={11} /> Dial
                </a>
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Sector Coverage: <span style={{ color: 'var(--safe-emerald)' }}>{outpost.coverageSector}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: GROUND TRUTH HAZARD AUDIT */}
      {activeTab === 'ground_verification' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Pending Ground Truth Verification
            </span>
            <span style={{ fontSize: '10px', color: 'var(--accent-amber)' }}>
              Patrollers inspect &amp; clear
            </span>
          </div>

          {[
            {
              id: 'hz_sus_khind',
              title: 'Sus Khind Deserted Pass — 0% Streetlights',
              location: 'Sus Khind Mountain Cut, Baner',
              reportedBy: '3 Commuters on Night Shift',
              category: 'Dark Spot & Stalking Vulnerability'
            },
            {
              id: 'hz_tathawade',
              title: 'JSPM College Lane Overgrown Tree Blocking Light',
              location: 'Tathawade PCMC Ward 21',
              reportedBy: 'Student Commuter #821',
              category: 'Vegetation Obstruction'
            },
            {
              id: 'hz_wakad_alley',
              title: 'Wakad Dirt Link — Open Drainage Excavation',
              location: 'Back-alley near Bhujbal Chowk',
              reportedBy: 'Cab Driver Association',
              category: 'Roadway Hazard'
            }
          ].map((hz) => {
            const isVerified = verifiedHazards.includes(hz.id);

            return (
              <div
                key={hz.id}
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {hz.title}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      📍 {hz.location} · {hz.category}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: isVerified ? 'var(--safe-emerald)' : 'var(--accent-amber)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {isVerified ? 'VERIFIED ON GROUND' : 'AWAITING INSPECTION'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Reported by: <strong style={{ color: 'var(--text-secondary)' }}>{hz.reportedBy}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleVerifyHazard(hz.id)}
                    className="btn-civic"
                    style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.2)' : 'var(--surface-hover)',
                      color: isVerified ? 'var(--safe-emerald)' : 'var(--text-primary)',
                      borderColor: isVerified ? 'var(--safe-emerald)' : 'var(--border-subtle)'
                    }}
                  >
                    {isVerified ? (
                      <>
                        <CheckCircle2 size={11} /> Ground Truth Authenticated
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={11} /> Verify on Ground
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VolunteerCockpit;
