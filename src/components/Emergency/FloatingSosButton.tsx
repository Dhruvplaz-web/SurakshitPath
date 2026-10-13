/**
 * SurakshitPath - Floating Persistent Emergency SOS Trigger
 * 
 * Provides an instantaneous, zero-latency emergency access point
 * visible at all times across all commuter views and map pans.
 */

import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export const FloatingSosButton: React.FC<Props> = ({ onClick }) => {
  return (
    <div
      className="floating-sos-container"
      style={{
        position: 'fixed',
        bottom: '52px',
        right: '20px',
        zIndex: 1400,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label="Emergency SOS Cockpit"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          backgroundColor: 'var(--danger-crimson, #ef4444)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '9999px',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '13px',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.6), 0 0 0 1px rgba(239, 68, 68, 0.4)',
          transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          animation: 'pulseGlow 2.5s infinite ease-in-out'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(239, 68, 68, 0.75)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.6)';
        }}
      >
        <ShieldAlert size={18} />
        <span>SOS 112</span>
      </button>
    </div>
  );
};

export default FloatingSosButton;
