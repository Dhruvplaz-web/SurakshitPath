import React from 'react';
import { X, Eye, Keyboard, Volume2, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityStatementModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-title"
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
          maxWidth: '700px',
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
              <Eye size={18} />
            </div>
            <div>
              <h2 id="a11y-title" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Accessibility Statement (WCAG 2.1 AA)
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Commitment to Inclusive Night Navigation &amp; Assistive Technologies
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Accessibility Statement"
            className="btn-civic"
            style={{ padding: '6px', borderRadius: '6px', background: 'transparent' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
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
          <p style={{ margin: 0 }}>
            SurakshitPath is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards under the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>.
          </p>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} color="var(--accent-amber)" /> 1. Visual Contrast &amp; Night Adaptation
            </h3>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              <li><strong>CartoDB Dark Matter Theme:</strong> Calibrated specifically to prevent blinding glare during night travel while maintaining a minimum 4.5:1 text-to-background contrast ratio.</li>
              <li><strong>Non-Color-Dependent Statuses:</strong> High-risk segments and safety metrics are indicated by explicit numeric badges, icons, and text labels, not solely by red/green hues.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Keyboard size={14} color="var(--haven-blue)" /> 2. Keyboard Navigation &amp; Focus Trapping
            </h3>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              <li>Every interactive control, role switcher, and modal supports full keyboard navigation via <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>Tab</kbd>, <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>Shift+Tab</kbd>, and <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>Enter</kbd>.</li>
              <li>Modals trap focus within active dialogs and dismiss immediately upon pressing <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>Escape</kbd>.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={14} color="var(--safe-emerald)" /> 3. Voice Guidance &amp; Screen Reader Support
            </h3>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              <li>Native <strong>Web Speech API</strong> voice cues announce upcoming safety-critical landmarks, lit corridors, and potential dark spots in real time.</li>
              <li>Multi-language support for <strong>English</strong>, <strong>Marathi (मराठी)</strong>, and <strong>Hindi (हिंदी)</strong>.</li>
              <li>All map vectors and segment cards carry semantic ARIA labels and live region announcements.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Feedback &amp; Accessibility Assistance
            </h3>
            <p style={{ margin: 0, fontSize: '12px' }}>
              If you experience any accessibility barriers while using SurakshitPath, please contact our team at{' '}
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>accessibility@surakshitpath.org</span>. We endeavor to resolve issues within 3 business days.
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
            justifyContent: 'flex-end',
            backgroundColor: 'var(--surface-elevated)'
          }}
        >
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
