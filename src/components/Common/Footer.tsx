import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Props {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenCookies: () => void;
  onOpenA11y: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  originName: string;
  destinationName: string;
}

export const Footer: React.FC<Props> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenCookies,
  onOpenA11y,
  onOpenAbout,
  onOpenContact,
  originName,
  destinationName
}) => {
  return (
    <footer
      role="contentinfo"
      className="civic-footer"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '10px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '11px',
        color: 'var(--text-muted)',
        zIndex: 1000
      }}
    >
      {/* Left: Breadcrumbs & Civic Alignment */}
      <div className="footer-breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 600, color: 'var(--accent-amber)' }}>Pune Metro Corridor</span>
          <ChevronRight size={11} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{originName}</span>
          <ChevronRight size={11} />
          <span style={{ color: 'var(--safe-emerald)', fontWeight: 500 }}>{destinationName}</span>
        </div>

        <span style={{ color: 'var(--border-subtle)' }}>|</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ padding: '1px 5px', borderRadius: '3px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--safe-emerald)', fontSize: '10px', fontWeight: 600 }}>
            SDG 5 &amp; 11
          </span>
          <span style={{ padding: '1px 5px', borderRadius: '3px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--haven-blue)', fontSize: '10px', fontWeight: 600 }}>
            DPDPA 2023
          </span>
        </div>
      </div>

      {/* Right: Legal & Core Navigation Links */}
      <nav aria-label="Legal & Platform Links" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <button
          onClick={onOpenAbout}
          className="footer-link"
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}
        >
          About Us
        </button>

        <button
          onClick={onOpenContact}
          className="footer-link"
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}
        >
          Contact &amp; Escalations
        </button>

        <button
          onClick={onOpenPrivacy}
          className="footer-link"
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}
        >
          Privacy Policy
        </button>

        <button
          onClick={onOpenTerms}
          className="footer-link"
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}
        >
          Terms of Service
        </button>

        <button
          onClick={onOpenCookies}
          className="footer-link"
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}
        >
          Cookie Policy
        </button>

        <button
          onClick={onOpenA11y}
          className="footer-link"
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}
        >
          Accessibility
        </button>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-amber)' }}>
          v1.2.0-prod
        </span>
      </nav>
    </footer>
  );
};
