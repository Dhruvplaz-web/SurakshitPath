import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';

interface Props {
  onOpenCookiePolicy: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const ConsentBanner: React.FC<Props> = ({ onOpenCookiePolicy, onOpenPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('surakshit_storage_consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // Storage access blocked or restricted
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('surakshit_storage_consent', 'accepted');
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy and Storage Consent"
      style={{
        position: 'fixed',
        bottom: '50px',
        right: '16px',
        maxWidth: '420px',
        backgroundColor: 'rgba(22, 24, 29, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--accent-amber)',
        borderRadius: '10px',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.85)',
        padding: '12px 14px',
        zIndex: 5000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={14} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Zero-Tracker Privacy Notice
          </span>
        </div>
        <button
          onClick={handleAccept}
          className="btn-civic"
          style={{ padding: '2px', border: 'none', background: 'transparent' }}
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ fontSize: '11px', lineHeight: 1.45, color: 'var(--text-secondary)' }}>
        SurakshitPath operates on-device: zero personal track retention and zero advertising cookies. Essential local storage is used solely to cache lighting and offline map topology.{' '}
        <button
          onClick={onOpenPrivacyPolicy}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--safe-emerald)',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            font: 'inherit'
          }}
        >
          Privacy Policy
        </button>.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
        <button
          onClick={onOpenCookiePolicy}
          className="btn-civic"
          style={{ padding: '4px 8px', fontSize: '10px' }}
        >
          Storage Details
        </button>
        <button
          onClick={handleAccept}
          className="btn-civic"
          style={{
            backgroundColor: 'var(--accent-amber)',
            color: '#000',
            fontWeight: 700,
            fontSize: '11px',
            padding: '5px 12px',
            borderRadius: '6px'
          }}
        >
          <Check size={12} /> Got It
        </button>
      </div>
    </aside>
  );
};
