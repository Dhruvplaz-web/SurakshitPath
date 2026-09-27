import React from 'react';
import { X, Award, Cpu, MapPin } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
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
          maxWidth: '740px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo.png"
              alt="SurakshitPath Logo"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                objectFit: 'contain',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '2px',
                border: '1px solid rgba(16, 185, 129, 0.25)'
              }}
            />
            <div>
              <h2 id="about-title" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                About SurakshitPath (सुरक्षितपथ)
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--safe-emerald)', fontWeight: 600 }}>
                Safer Routes • Smarter Choices · UN SDGs 5 &amp; 11
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close About Us"
            className="btn-civic"
            style={{ padding: '6px', borderRadius: '6px', background: 'transparent' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
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
          {/* Mission Card */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: 'var(--surface-elevated)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Our Founding Mission
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Traditional navigation platforms optimize strictly for distance, tolls, or travel speed. For pedestrians and commuters traveling after dusk, this objective function often routes users through deserted alleys, poorly lit shortcuts, and unmonitored underpasses. SurakshitPath re-engineers graph routing by prioritizing <strong>infrastructure visibility, active commercial storefronts, and safe havens</strong>, restoring nocturnal mobility freedom.
            </p>
          </div>

          {/* Pillars Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--safe-emerald)', fontWeight: 700, fontSize: '12.5px' }}>
                <Award size={15} /> UN SDG 5: Gender Equality
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                Empowering women students, IT professionals, and late-shift workers with objective safety scoring, Guardian corridor tracking, and instant Damini Squad integration.
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--haven-blue)', fontWeight: 700, fontSize: '12.5px' }}>
                <Cpu size={15} /> UN SDG 11: Sustainable Cities
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                Providing civic administrators (PMC/PCMC) with actionable SCADA smart-pole telemetry and dark-spot audit data to guide capital infrastructure investments.
              </div>
            </div>
          </div>

          {/* Technical Architecture */}
          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Core Technical Innovations
            </h3>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Mathematical Traversal Impedance:</strong> Custom Dijkstra graph routing where edge weights dynamically scale based on user risk sensitivity: <code style={{ fontFamily: 'var(--font-mono)' }}>W(e) = L(e) * [1 + &beta; * (1 - S(e))]</code>.</li>
              <li><strong>TreeSHAP Feature Explainability:</strong> Breaks down ML safety scores into positive and negative factor contributions without black-box opacity.</li>
              <li><strong>Extended Kalman Filter (EKF):</strong> 4-state kinematic state estimator ([x, y, vx, vy]) that eliminates GPS multipath drift and urban canyon flutter.</li>
              <li><strong>Anti-Redlining Ethics:</strong> Zero reliance on historical police arrest reports, safeguarding socio-economically marginalized areas from algorithmic bias.</li>
            </ul>
          </section>

          {/* Pune Deployment */}
          <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="var(--accent-amber)" /> Deployment: Pune Metropolitan Region
            </h3>
            <p style={{ margin: 0, fontSize: '12px' }}>
              The system is calibrated with high-density road geometry and lighting data spanning Tathawade (JSPM, Indira), Hinjawadi Rajiv Gandhi Infotech Park, Baner High Street, Savitribai Phule Pune University (SPPU), Shivajinagar, and Kothrud.
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
            SurakshitPath Open Research Initiative · 2026
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
