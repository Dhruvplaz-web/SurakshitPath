import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Database, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 7, 10, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '88vh',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-elevated)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--safe-emerald)'
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 id="privacy-title" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Privacy Policy &amp; Data Protection Charter
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Compliant with India's DPDPA 2023 &amp; Global Privacy Standards (Zero Track Retention)
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Privacy Policy"
            className="btn-civic"
            style={{ padding: '6px', borderRadius: '6px', background: 'transparent' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Content */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Key Principle Banner */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '8px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}
          >
            <Lock size={18} color="var(--safe-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Our Core Privacy Guarantee:</strong> SurakshitPath operates on a client-first, edge-computing model. Your live GPS coordinates, routes, and audio cues are computed locally in your browser session. We do not sell, broker, or build advertising profiles from your location.
            </div>
          </div>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={14} color="var(--accent-amber)" /> 1. Data Collection &amp; Scope
            </h3>
            <p style={{ margin: 0 }}>
              Under India's Digital Personal Data Protection Act (DPDPA), 2023, we collect only the minimal technical data strictly necessary to plan safe corridors:
            </p>
            <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
              <li><strong>Origin and Destination:</strong> Used ephemerally in client memory to calculate graph routes; cleared immediately upon session termination.</li>
              <li><strong>Live GPS Telematics:</strong> Processed locally using an on-device Extended Kalman Filter (EKF). Shared with trusted guardians only when you explicitly generate an authenticated telemetry session token.</li>
              <li><strong>Citizen Infrastructure Reports:</strong> Categorized hazard tags (unlit streetlamps, deserted alleys) are anonymized and aggregated into public civic heatmaps without retaining IP addresses.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EyeOff size={14} color="var(--safe-emerald)" /> 2. Anti-Redlining &amp; Algorithmic Fairness
            </h3>
            <p style={{ margin: 0 }}>
              Unlike commercial ride-hailing apps that stigmatize neighborhoods by training models on historical FIR arrest figures (which reflect police patrolling bias), SurakshitPath scores roads purely using verifiable physical infrastructure: photometric lux, active storefront density, safe haven proximity, and road hierarchy.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={14} color="var(--haven-blue)" /> 3. Guardian &amp; Emergency Telemetry Sharing
            </h3>
            <p style={{ margin: 0 }}>
              When activating Guardian Mode or triggering the National 112 emergency escalation:
            </p>
            <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
              <li>Telemetry links expire automatically within 4 hours or upon commuter arrival.</li>
              <li>Commuters retain 100% manual control to terminate or pause location broadcasts instantly.</li>
              <li>Corridor breach alerts (cross-track deviation &gt;50m) execute an on-device watchdog check prior to dispatching notifications.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              4. Data Retention &amp; Erasure (Right to be Forgotten)
            </h3>
            <p style={{ margin: 0 }}>
              Local cache entries in IndexedDB or LocalStorage can be purged at any moment via your browser settings or our one-click offline cache wipe in the application footer.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              5. Grievance Redressal &amp; Data Protection Officer (DPO)
            </h3>
            <p style={{ margin: 0 }}>
              In accordance with DPDPA Rule 4, for data inquiries or privacy grievances, contact our designated Grievance Officer:
              <br />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-amber)' }}>
                privacy-officer@surakshitpath.org · Pune Civic Innovation Cell, Shivaji Nagar, Pune 411005
              </span>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-elevated)'
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Effective Date: September 2026 · Version 1.2
          </div>
          <button
            onClick={onClose}
            className="btn-civic"
            style={{
              backgroundColor: 'var(--accent-amber)',
              color: '#000',
              fontWeight: 600,
              padding: '6px 16px',
              borderRadius: '6px'
            }}
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
