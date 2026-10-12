import React from 'react';
import { X, Cookie, HardDrive, Check, Trash2 } from 'lucide-react';
import { clearSpatialCache } from '../../services/spatialCache';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CookiePolicyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClearCache = () => {
    clearSpatialCache();
    alert('Local spatial cache and offline map data have been successfully cleared.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
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
          maxWidth: '680px',
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
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--haven-blue)'
              }}
            >
              <Cookie size={18} />
            </div>
            <div>
              <h2 id="cookie-title" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Cookie &amp; Local Storage Policy
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Transparency in Browser Storage &amp; Offline Cache Architecture
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Cookie Policy"
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
          <p style={{ margin: 0 }}>
            SurakshitPath adheres to a strict <strong>Zero Third-Party Advertising Tracker</strong> policy. We do not use marketing trackers, retargeting pixels, or cross-site fingerprinting cookies.
          </p>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Storage Technologies We Utilize
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: 'var(--surface-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HardDrive size={13} color="var(--safe-emerald)" /> LocalStorage (Essential Cache)
                  </strong>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--safe-emerald)', fontWeight: 600 }}>Strictly Necessary</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Caches Overpass lighting infrastructure and OSM bounding box responses locally with a 7-day TTL to minimize mobile cellular data consumption and enable low-bandwidth routing in Pune.
                </div>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: 'var(--surface-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HardDrive size={13} color="var(--accent-amber)" /> IndexedDB (Offline Corridors)
                  </strong>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', fontWeight: 600 }}>Functional / Offline</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Stores pre-packaged vector topology for Tathawade, Hinjawadi, Shivajinagar, and Kothrud corridors to guarantee zero-drop navigation even when passing through connectivity dead zones.
                </div>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: 'var(--surface-elevated)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={13} color="var(--haven-blue)" /> URL State Parameters
                  </strong>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--haven-blue)', fontWeight: 600 }}>Zero-Cookie Session</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Active safety weights (&beta;), selected route, and user language are stored directly in URL query parameters (<code style={{ fontFamily: 'var(--font-mono)' }}>?beta=0.8&amp;role=commuter</code>) rather than tracking cookies, enabling seamless link sharing.
                </div>
              </div>
            </div>
          </section>

          <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Manage Your Local Storage
            </h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>
              You have complete autonomy over data stored in your browser. You can flush all locally saved tiles and spatial caches at any moment:
            </p>
            <button
              onClick={handleClearCache}
              className="btn-civic"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--danger-crimson)',
                border: '1px solid var(--danger-crimson)',
                fontSize: '11px',
                padding: '6px 12px'
              }}
            >
              <Trash2 size={13} /> Purge All Local Spatial Cache Now
            </button>
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
