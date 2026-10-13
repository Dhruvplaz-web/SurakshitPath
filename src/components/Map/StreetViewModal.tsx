import React, { useEffect } from 'react';
import { X, Eye, MapPin, ExternalLink, Camera } from 'lucide-react';

export interface StreetViewData {
  title: string;
  locationName: string;
  coordinates: [number, number];
  photoUrl: string;
  lightingLevel: number; // 0-100
  cctvCount: number;
  openShopsCount: number;
  auditNotes: string;
  roadWidthLanes: number;
}

interface Props {
  isOpen: boolean;
  data: StreetViewData | null;
  onClose: () => void;
}

export const StreetViewModal: React.FC<Props> = ({ isOpen, data, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const [lat, lng] = data.coordinates;
  const googleStreetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;

  const isSafe = data.lightingLevel >= 70;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="street-view-title"
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '640px',
          padding: '0',
          overflow: 'hidden',
          backgroundColor: 'var(--surface-elevated)',
          border: `1px solid ${isSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)'}`,
          boxShadow: isSafe ? '0 12px 36px rgba(16, 185, 129, 0.25)' : '0 12px 36px rgba(239, 68, 68, 0.3)'
        }}
      >
        {/* Ground Photo Container */}
        <div style={{ position: 'relative', width: '100%', height: '240px', backgroundColor: '#000' }}>
          <img
            src={data.photoUrl}
            alt={data.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
          />

          {/* Top Bar with Street View Badge & Close */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(10px)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Camera size={13} color="var(--accent-amber)" />
              <span>Ground-Level Night Audit View</span>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Bottom Overlay on Image */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 100%)',
            padding: '24px 16px 12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-amber)', fontWeight: 700 }}>
              <MapPin size={13} />
              <span>{data.locationName}</span>
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff' }}>
              {data.title}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '16px 20px' }}>
          {/* Key Audit Scorecard */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '8px',
            marginBottom: '14px'
          }}>
            <div style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                STREET ILLUMINATION
              </div>
              <div className="mono-num" style={{
                fontSize: '18px',
                fontWeight: 800,
                color: isSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)',
                marginTop: '2px'
              }}>
                {data.lightingLevel}%
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                CCTV CAMERAS
              </div>
              <div className="mono-num" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '2px' }}>
                {data.cctvCount} Active
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                24/7 OPEN SHOPS
              </div>
              <div className="mono-num" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--haven-blue)', marginTop: '2px' }}>
                {data.openShopsCount} Fronts
              </div>
            </div>
          </div>

          {/* Audit Notes */}
          <div style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            marginBottom: '14px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            <strong>SafetiPin Night Mobility Audit:</strong> {data.auditNotes}
          </div>

          {/* External Google Street View Link Button */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={googleStreetViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-civic btn-primary-amber"
              style={{ flex: 1, padding: '10px 14px', fontSize: '12px', textDecoration: 'none' }}
            >
              <Eye size={14} />
              <span>Open in Google Street View 360°</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={onClose}
              className="btn-civic"
              style={{ padding: '10px 16px', fontSize: '12px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreetViewModal;
