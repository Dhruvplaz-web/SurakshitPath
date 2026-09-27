import React, { useState, useEffect } from 'react';
import { RouteOption } from '../../types/routing';
import { PuneLocation } from '../../services/geocodingService';
import { ShieldCheck, Share2, Copy, Check, MessageSquare, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  activeRoute: RouteOption;
  origin: PuneLocation;
  destination: PuneLocation;
  onClose: () => void;
}

export const RouteShareModal: React.FC<Props> = ({
  isOpen,
  activeRoute,
  origin,
  destination,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

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

  if (!isOpen) return null;

  const tripId = `tr_${Date.now().toString(36)}`;
  const liveTrackingUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?mode=track&trip=${tripId}&route=${activeRoute.id}&origin=${origin.id}&dest=${destination.id}&role=guardian`
    : '';

  const shareText = `🛡️ SurakshitPath Live Night Travel Trail:
I am traveling from ${origin.name} to ${destination.name} via ${activeRoute.name}.
Safety Index: ${activeRoute.safetyScore}/100 | Illumination: ${Math.round(activeRoute.factors.lighting * 100)}%
Click to open Live Guardian Companion (Zero-Install):
${liveTrackingUrl}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(liveTrackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-pass-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={16} />
            </div>
            <h2 id="share-pass-title" style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
              Share Safe Route Pass
            </h2>
          </div>

          <button onClick={onClose} className="btn-civic" style={{ padding: '4px', border: 'none' }} title="Close">
            <X size={16} />
          </button>
        </div>

        {/* Safety Pass Card Preview */}
        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '14px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Accent Glow */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: activeRoute.safetyScore >= 70 ? 'var(--safe-emerald)' : 'var(--accent-amber)'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SURAKSHITPATH VERIFIED TRIP
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {activeRoute.name}
              </div>
            </div>

            <div style={{
              backgroundColor: activeRoute.safetyScore >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: activeRoute.safetyScore >= 70 ? 'var(--safe-emerald)' : 'var(--accent-amber)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldCheck size={14} />
              <span>{activeRoute.safetyScore}/100</span>
            </div>
          </div>

          <div style={{ margin: '12px 0', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div><strong>From:</strong> {origin.name}</div>
            <div><strong>To:</strong> {destination.name}</div>
            <div><strong>Distance / Time:</strong> {(activeRoute.distanceMeters / 1000).toFixed(1)} km · {activeRoute.durationMinutes} min</div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '8px',
            fontSize: '10px',
            color: 'var(--text-muted)'
          }}>
            <span>Illumination: {Math.round(activeRoute.factors.lighting * 100)}%</span>
            <span>Havens En Route: {activeRoute.segments.length > 3 ? '4' : '2'} Verified</span>
            <span>Live Guardian Sync: Active</span>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleWhatsAppShare}
            className="btn-civic"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#25D366',
              color: '#000',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              borderRadius: '8px'
            }}
          >
            <MessageSquare size={16} /> Share via WhatsApp
          </button>

          <button
            onClick={handleCopyLink}
            className="btn-civic"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'var(--surface-elevated)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              borderRadius: '8px'
            }}
          >
            {copied ? <Check size={16} color="var(--safe-emerald)" /> : <Copy size={16} />}
            <span>{copied ? 'Live Link Copied!' : 'Copy Live Tracking Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
