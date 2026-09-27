import React from 'react';
import { X, Scale, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tos-title"
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
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)'
              }}
            >
              <Scale size={18} />
            </div>
            <div>
              <h2 id="tos-title" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Terms of Service &amp; Navigation Disclaimer
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                User Agreement &amp; Civic Platform Guidelines · SurakshitPath
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Terms of Service"
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
          {/* Critical Disclaimer Alert */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '8px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}
          >
            <AlertTriangle size={18} color="var(--danger-crimson)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Essential Navigation Notice:</strong> SurakshitPath provides advisory safety-score optimization based on available geospatial infrastructure data. Road conditions, temporary street outages, and local activity patterns may change dynamically. Users must always exercise personal judgment and situational awareness.
            </div>
          </div>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={14} color="var(--accent-amber)" /> 1. Nature of the Advisory Service
            </h3>
            <p style={{ margin: 0 }}>
              SurakshitPath is a public civic navigation tool designed for Safe &amp; Smart Communities. The service is designed to:
            </p>
            <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
              <li>Offer comparative dual-route insights (Fastest Route vs. High-Visibility Corridor).</li>
              <li>Provide transparency into factors influencing route selection (lighting, active frontage, emergency shelter proximity).</li>
              <li>Empower commuters to adjust their personal risk tolerance via the mathematical trade-off slider (&beta;).</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={14} color="var(--safe-emerald)" /> 2. Permitted Use &amp; Citizen Reporting Rules
            </h3>
            <p style={{ margin: 0 }}>
              When submitting community infrastructure hazard reports (e.g. broken streetlamps, deserted blindspots):
            </p>
            <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
              <li>You agree to submit only accurate, good-faith reports of physical road conditions.</li>
              <li>You must not post defamatory, abusive, or discriminatory content targeting any community or establishment.</li>
              <li>Submitting fraudulent emergency alarms (SOS) is strictly prohibited and subject to legal prosecution under the Indian Penal Code and Information Technology Act, 2000.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              3. Emergency Escalations &amp; Law Enforcement Handoff
            </h3>
            <p style={{ margin: 0 }}>
              SurakshitPath bridges commuters to official first-response mechanisms (such as the 112 National Emergency Helpline and the Pune Police Damini Squad). SurakshitPath is not a private security contractor or a substitute for statutory police and municipal emergency services.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              4. Limitation of Liability
            </h3>
            <p style={{ margin: 0 }}>
              To the fullest extent permissible by applicable law, SurakshitPath, its contributors, and municipal partners shall not be held liable for any incidental, consequential, or indirect damages arising out of your use of or inability to use the advisory navigation routes.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              5. Governing Law &amp; Jurisdiction
            </h3>
            <p style={{ margin: 0 }}>
              These Terms are governed by and construed in accordance with the laws of India. Any disputes arising in connection with the platform shall be subject to the exclusive jurisdiction of the courts located in Pune, Maharashtra.
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
            Last Revision: September 2026
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
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};
